const { z } = window.Zod;

const form = document.getElementById('calculator-form');
const distanceLabel = document.getElementById('distance-mi');
const timberTotal = document.getElementById('timber-total');
const steelSavings = document.getElementById('steel-savings');
const concreteSavings = document.getElementById('concrete-savings');
const timberCostEl = document.getElementById('timber-cost');
const solarPeakEl = document.getElementById('solar-peak');
const resultsSummary = document.getElementById('results-summary');
const assumptions = document.getElementById('assumptions');
const funFacts = document.getElementById('fun-facts');
const imageryPanel = document.getElementById('imagery-panel');
const cesiumPanel = document.getElementById('cesium-panel');
const projectCitySelect = document.getElementById('project-city');
const manufacturerSelect = document.getElementById('manufacturer-select');

const siteLookupBtn = document.getElementById('site-lookup-btn');
const estimateBtn = document.getElementById('estimate-btn');
const optionalToggleBtn = document.getElementById('optional-toggle');
const orsRouteBtn = document.getElementById('ors-route-btn');
const mapillaryBtn = document.getElementById('mapillary-btn');
const cesiumBtn = document.getElementById('cesium-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

const usCities = [
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431, cost: 1.09 },
  { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321, cost: 1.17 },
  { name: 'New York, NY', lat: 40.7128, lng: -74.0060, cost: 1.23 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, cost: 1.1 },
  { name: 'Denver, CO', lat: 39.7392, lng: -104.9903, cost: 1.08 },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, cost: 1.2 },
];

const timberManufacturers = [
  { name: 'SmartLam (Columbia Falls, MT)', lat: 48.3725, lng: -114.1810 },
  { name: 'DR Johnson (Riddle, OR)', lat: 42.9504, lng: -123.3645 },
  { name: 'Vaagen Timbers (Colville, WA)', lat: 48.5466, lng: -117.9055 },
  { name: 'Freres (Lyons, OR)', lat: 44.7740, lng: -122.6076 },
  { name: 'Sterling Structural (Lufkin, TX)', lat: 31.3382, lng: -94.7291 },
];

const transportFactors = { truck: 0.11, rail: 0.03, ship: 0.015, multimodal: 0.055 };
const speciesFactors = {
  'douglas-fir': { density: 0.53, sequestration: -760, processFactor: 1.0 },
  'spruce-pine-fir': { density: 0.46, sequestration: -690, processFactor: 0.96 },
  'southern-yellow-pine': { density: 0.57, sequestration: -780, processFactor: 1.04 },
  'hemlock-fir': { density: 0.49, sequestration: -710, processFactor: 0.99 },
};
const defaultsByType = {
  education: { areaPerPerson: 120, timberCost: 355, steelCost: 335, concreteCost: 328 },
  recreation: { areaPerPerson: 145, timberCost: 395, steelCost: 360, concreteCost: 350 },
  library: { areaPerPerson: 160, timberCost: 390, steelCost: 355, concreteCost: 345 },
  office: { areaPerPerson: 140, timberCost: 380, steelCost: 350, concreteCost: 338 },
  residential: { areaPerPerson: 320, timberCost: 340, steelCost: 320, concreteCost: 315 },
  healthcare: { areaPerPerson: 240, timberCost: 460, steelCost: 430, concreteCost: 420 },
  hospitality: { areaPerPerson: 300, timberCost: 410, steelCost: 385, concreteCost: 375 },
  'mixed-use': { areaPerPerson: 220, timberCost: 405, steelCost: 380, concreteCost: 368 },
};

const map = L.map('map').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
const manufacturerMarker = L.marker([48.3725, -114.181], { draggable: true }).addTo(map).bindPopup('Manufacturer');
const siteMarker = L.marker([30.2672, -97.7431], { draggable: true }).addTo(map).bindPopup('Project Site');
const routeLine = L.polyline([manufacturerMarker.getLatLng(), siteMarker.getLatLng()], { color: '#1e66ff', weight: 3 }).addTo(map);

let carbonChart;
let costChart;
let mixChart;
let currentRouteMiles = 0;

const schema = z.object({
  projectName: z.string().min(1),
  grossAreaFt2: z.coerce.number().min(0),
  floorPlateFt2: z.coerce.number().min(0),
  stories: z.coerce.number().min(0),
  cltUsePercent: z.coerce.number().min(0).max(100),
  wasteFactor: z.coerce.number().min(0).max(100),
});

function parseFtIn(text) {
  if (!text || /^0/.test(text.trim())) return 0;
  const m = text.match(/(\d+)\s*'\s*(\d+)?/);
  if (!m) return 0;
  const feet = Number(m[1] || 0);
  const inches = Number(m[2] || 0);
  return feet + inches / 12;
}

function num(fd, key, fallback = 0) {
  const raw = fd.get(key);
  const val = Number(raw);
  return Number.isFinite(val) ? val : fallback;
}

function haversineMiles(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const r = 3958.8;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
}

function updateDistance() {
  const m = manufacturerMarker.getLatLng();
  const s = siteMarker.getLatLng();
  routeLine.setLatLngs([m, s]);
  currentRouteMiles = haversineMiles(m, s);
  distanceLabel.textContent = `${currentRouteMiles.toFixed(0)} mi`;
  updateSolar(s.lat, s.lng);
  return currentRouteMiles;
}

function populateSelect(select, data) {
  select.innerHTML = data.map((x, i) => `<option value="${i}">${x.name}</option>`).join('');
}

function syncMapFromSelections() {
  const city = usCities[Number(projectCitySelect.value)] || usCities[0];
  const mfg = timberManufacturers[Number(manufacturerSelect.value)] || timberManufacturers[0];
  siteMarker.setLatLng([city.lat, city.lng]);
  manufacturerMarker.setLatLng([mfg.lat, mfg.lng]);
  map.fitBounds(L.latLngBounds([siteMarker.getLatLng(), manufacturerMarker.getLatLng()]), { padding: [35, 35] });
  updateDistance();
}

function estimate(fd) {
  const type = fd.get('buildingType') || 'education';
  const d = defaultsByType[type] || defaultsByType.education;
  const occupancy = Math.max(0, num(fd, 'occupancy', 0));
  const grossAreaFt2 = num(fd, 'grossAreaFt2', 0) || occupancy * d.areaPerPerson;
  const stories = num(fd, 'stories', 0) || Math.max(1, Math.round(grossAreaFt2 / 25000));
  const floorPlateFt2 = num(fd, 'floorPlateFt2', 0) || grossAreaFt2 / stories;
  const heightFt = parseFtIn(fd.get('heightFtIn')) || (stories * 14);
  const cltFt3 = num(fd, 'cltFt3', 0) || grossAreaFt2 * 0.8;
  const glulamFt3 = num(fd, 'glulamFt3', 0) || grossAreaFt2 * 0.18;
  const lvlFt3 = num(fd, 'lvlFt3', 0) || grossAreaFt2 * 0.06;
  const nltFt3 = num(fd, 'nltFt3', 0) || grossAreaFt2 * 0.04;
  const dltFt3 = num(fd, 'dltFt3', 0) || grossAreaFt2 * 0.03;
  return { grossAreaFt2, stories, floorPlateFt2, heightFt, cltFt3, glulamFt3, lvlFt3, nltFt3, dltFt3 };
}

function updateSolar(lat, lng) {
  const times = window.SunCalc.getTimes(new Date(), lat, lng);
  const peak = times.solarNoon ? times.solarNoon.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  solarPeakEl.textContent = peak;
}

async function geocodeSite(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en-US' } });
  const data = await res.json();
  if (!data?.length) throw new Error('No site found');
  return { lat: Number(data[0].lat), lng: Number(data[0].lon), display: data[0].display_name };
}

async function fetchOrsRouteMiles(apiKey) {
  const start = manufacturerMarker.getLatLng();
  const end = siteMarker.getLatLng();
  const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: apiKey },
    body: JSON.stringify({ coordinates: [[start.lng, start.lat], [end.lng, end.lat]] }),
  });
  const data = await response.json();
  const meters = data?.routes?.[0]?.summary?.distance;
  if (!meters) throw new Error('No route result');
  return meters * 0.000621371;
}

function calculate(fd, routeMiles) {
  const est = estimate(fd);
  const species = speciesFactors[fd.get('timberSpecies')] || speciesFactors['douglas-fir'];
  const transportMode = fd.get('transportMode') || 'truck';
  const waste = num(fd, 'wasteFactor', 0) / 100;
  const cltShare = num(fd, 'cltUsePercent', 0) / 100;
  const fire = num(fd, 'fireRating', 0);
  const grid = num(fd, 'gridIntensity', 0);
  const renew = num(fd, 'renewableShare', 0) / 100;

  const totalFt3 = (est.cltFt3 + est.glulamFt3 + est.lvlFt3 + est.nltFt3 + est.dltFt3) * (1 + waste);
  const totalM3 = totalFt3 * 0.0283168;
  const massTons = totalM3 * species.density;
  const complexity = 1 + est.heightFt / 400 + fire * 0.02;

  const timberCarbon =
    totalM3 * 115 * species.processFactor +
    massTons * routeMiles * (transportFactors[transportMode] || transportFactors.truck) +
    est.grossAreaFt2 * 0.9 * grid * (1 - renew) +
    totalM3 * species.sequestration;
  const steelCarbon = est.grossAreaFt2 * 22 * complexity + est.grossAreaFt2 * 1.1 * grid + routeMiles * 180;
  const concreteCarbon = est.grossAreaFt2 * 14 * complexity + est.grossAreaFt2 * 0.95 * grid + routeMiles * 120;

  const type = fd.get('buildingType') || 'education';
  const d = defaultsByType[type] || defaultsByType.education;
  const cityCost = (usCities[Number(projectCitySelect.value)] || { cost: 1 }).cost;
  const timberRate = num(fd, 'timberCostPerFt2', 0) || d.timberCost;
  const steelRate = num(fd, 'steelCostPerFt2', 0) || d.steelCost;
  const concreteRate = num(fd, 'concreteCostPerFt2', 0) || d.concreteCost;

  const timberCost = est.grossAreaFt2 * timberRate * cityCost;
  const steelCost = est.grossAreaFt2 * steelRate * cityCost;
  const concreteCost = est.grossAreaFt2 * concreteRate * cityCost;

  return {
    est,
    complexity,
    cltShare,
    carbon: { timber: timberCarbon, steel: steelCarbon, concrete: concreteCarbon },
    cost: { timber: timberCost, steel: steelCost, concrete: concreteCost },
  };
}

function fmtKg(v) { return `${Math.round(v).toLocaleString()} kg CO₂e`; }
function fmtMoney(v) { return `$${Math.round(v).toLocaleString()}`; }

function renderCharts(result) {
  const carbonData = [result.carbon.timber, result.carbon.steel, result.carbon.concrete];
  const costData = [result.cost.timber, result.cost.steel, result.cost.concrete];
  const mixData = [result.est.cltFt3, result.est.glulamFt3, result.est.lvlFt3, result.est.nltFt3, result.est.dltFt3];

  if (carbonChart) carbonChart.destroy();
  if (costChart) costChart.destroy();
  if (mixChart) mixChart.destroy();

  carbonChart = new Chart(document.getElementById('carbon-canvas'), {
    type: 'bar',
    data: { labels: ['Timber', 'Steel', 'Concrete'], datasets: [{ label: 'Embodied Carbon', data: carbonData, backgroundColor: ['#14a163', '#d74848', '#ec8c2e'] }] },
    options: { responsive: true, plugins: { legend: { display: false } } },
  });

  costChart = new Chart(document.getElementById('cost-canvas'), {
    type: 'doughnut',
    data: { labels: ['Timber', 'Steel', 'Concrete'], datasets: [{ data: costData, backgroundColor: ['#5d72ff', '#c552f5', '#5bb6ff'] }] },
    options: { responsive: true },
  });

  mixChart = new Chart(document.getElementById('mix-canvas'), {
    type: 'radar',
    data: { labels: ['CLT', 'Glulam', 'LVL', 'NLT', 'DLT'], datasets: [{ label: 'Timber Mix (ft³)', data: mixData, fill: true, borderColor: '#1e66ff', backgroundColor: 'rgba(30,102,255,0.2)' }] },
    options: { responsive: true },
  });
}

function renderFunFacts(result) {
  const treesEq = Math.max(0, (result.carbon.steel - result.carbon.timber) / 21);
  const carMiles = Math.max(0, (result.carbon.steel - result.carbon.timber) / 0.404);
  const poolEq = Math.max(0, result.est.grossAreaFt2 / 2500);
  funFacts.innerHTML = `
    <strong>Fun Facts</strong><br />
    • Timber scenario saves roughly <strong>${Math.round(treesEq).toLocaleString()}</strong> tree-sequestration-year equivalents vs steel baseline.<br />
    • Carbon savings are similar to avoiding about <strong>${Math.round(carMiles).toLocaleString()}</strong> passenger car miles.<br />
    • Your building area equals about <strong>${poolEq.toFixed(1)}</strong> basketball courts.
  `;
}

async function onSubmit(event) {
  event.preventDefault();
  const fd = new FormData(form);

  const validation = schema.safeParse({
    projectName: fd.get('projectName'),
    grossAreaFt2: fd.get('grossAreaFt2') || 0,
    floorPlateFt2: fd.get('floorPlateFt2') || 0,
    stories: fd.get('stories') || 0,
    cltUsePercent: fd.get('cltUsePercent') || 0,
    wasteFactor: fd.get('wasteFactor') || 0,
  });

  if (!validation.success) {
    resultsSummary.innerHTML = `<strong>Validation issue:</strong> ${validation.error.issues[0].message}`;
    return;
  }

  const routeMiles = updateDistance();
  const result = calculate(fd, routeMiles);

  const deltaSteel = result.carbon.steel - result.carbon.timber;
  const deltaConcrete = result.carbon.concrete - result.carbon.timber;
  timberTotal.textContent = fmtKg(result.carbon.timber);
  steelSavings.textContent = `${Math.round(Math.abs(deltaSteel)).toLocaleString()} kg ${deltaSteel >= 0 ? 'lower' : 'higher'}`;
  concreteSavings.textContent = `${Math.round(Math.abs(deltaConcrete)).toLocaleString()} kg ${deltaConcrete >= 0 ? 'lower' : 'higher'}`;
  steelSavings.className = deltaSteel >= 0 ? 'positive' : 'negative';
  concreteSavings.className = deltaConcrete >= 0 ? 'positive' : 'negative';
  timberCostEl.textContent = fmtMoney(result.cost.timber);

  renderCharts(result);
  renderFunFacts(result);

  resultsSummary.innerHTML = `
    <p><strong>${fd.get('projectName')}</strong> modeled at <strong>${Math.round(result.est.grossAreaFt2).toLocaleString()} ft²</strong>.</p>
    <p>Timber carbon: <strong>${fmtKg(result.carbon.timber)}</strong> | Steel: <strong>${fmtKg(result.carbon.steel)}</strong> | Concrete: <strong>${fmtKg(result.carbon.concrete)}</strong>.</p>
    <p>Timber cost: <strong>${fmtMoney(result.cost.timber)}</strong> | Steel: <strong>${fmtMoney(result.cost.steel)}</strong> | Concrete: <strong>${fmtMoney(result.cost.concrete)}</strong>.</p>
  `;

  assumptions.innerHTML = `Complexity ${result.complexity.toFixed(2)} • CLT share ${Math.round(result.cltShare * 100)}% • Route ${routeMiles.toFixed(1)} mi • Optional inputs defaulted to zero unless provided.`;
}

siteLookupBtn.addEventListener('click', async () => {
  try {
    const q = form.elements.siteQuery.value.trim();
    if (!q) return;
    const found = await geocodeSite(q);
    siteMarker.setLatLng([found.lat, found.lng]);
    map.panTo([found.lat, found.lng]);
    resultsSummary.innerHTML = `<p><strong>Site found:</strong> ${found.display}</p>`;
    updateDistance();
  } catch (err) {
    resultsSummary.innerHTML = `<p><strong>Lookup failed:</strong> ${err.message}</p>`;
  }
});

estimateBtn.addEventListener('click', () => {
  const fd = new FormData(form);
  const est = estimate(fd);
  form.elements.grossAreaFt2.value = Math.round(est.grossAreaFt2);
  form.elements.floorPlateFt2.value = Math.round(est.floorPlateFt2);
  form.elements.stories.value = Math.round(est.stories);
  form.elements.heightFtIn.value = `${Math.floor(est.heightFt)}' ${Math.round((est.heightFt % 1) * 12)}"`;
  form.elements.cltFt3.value = Math.round(est.cltFt3);
  form.elements.glulamFt3.value = Math.round(est.glulamFt3);
  form.elements.lvlFt3.value = Math.round(est.lvlFt3);
  form.elements.nltFt3.value = Math.round(est.nltFt3);
  form.elements.dltFt3.value = Math.round(est.dltFt3);
  resultsSummary.innerHTML = `<p><strong>Auto-estimation complete.</strong> Zero-value optional fields were estimated from building type and occupancy.</p>`;
});

let optionalHidden = false;
optionalToggleBtn.addEventListener('click', () => {
  optionalHidden = !optionalHidden;
  form.classList.toggle('optional-hidden', optionalHidden);
});

orsRouteBtn.addEventListener('click', async () => {
  try {
    const key = form.elements.orsApiKey.value.trim();
    if (!key) throw new Error('ORS key required');
    const miles = await fetchOrsRouteMiles(key);
    currentRouteMiles = miles;
    distanceLabel.textContent = `${miles.toFixed(0)} mi`;
    resultsSummary.innerHTML = `<p><strong>OpenRouteService route distance:</strong> ${miles.toFixed(1)} mi</p>`;
  } catch (e) {
    resultsSummary.innerHTML = `<p><strong>ORS fallback:</strong> ${e.message}. Using straight-line distance.</p>`;
    updateDistance();
  }
});

mapillaryBtn.addEventListener('click', () => {
  const token = form.elements.mapillaryToken.value.trim();
  const s = siteMarker.getLatLng();
  if (!token) {
    imageryPanel.textContent = 'Mapillary token missing. Add token to load street-level imagery links.';
    return;
  }
  imageryPanel.innerHTML = `Mapillary ready. Open street imagery near site: <a href="https://www.mapillary.com/app/?lat=${s.lat}&lng=${s.lng}&z=16" target="_blank" rel="noreferrer">Launch Mapillary Viewer</a>`;
});

cesiumBtn.addEventListener('click', () => {
  const token = form.elements.cesiumToken.value.trim();
  const tiles = form.elements.tilesetUrl.value.trim();
  const collada = form.elements.colladaUrl.value.trim();
  cesiumPanel.innerHTML = `Cesium/3D integration configured. ${token ? 'Ion token provided.' : 'No Ion token.'} ${tiles ? `Tileset URL: ${tiles}` : 'No tiles URL.'} ${collada ? `Collada URL: ${collada}` : 'No Collada URL.'}`;
});

exportPdfBtn.addEventListener('click', async () => {
  const canvas = await html2canvas(document.querySelector('.panel:last-child'));
  const img = canvas.toDataURL('image/png');
  const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
  const width = 190;
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(img, 'PNG', 10, 10, width, Math.min(height, 270));
  pdf.save('mass-timber-report.pdf');
});

form.addEventListener('submit', onSubmit);
projectCitySelect.addEventListener('change', syncMapFromSelections);
manufacturerSelect.addEventListener('change', syncMapFromSelections);
manufacturerMarker.on('dragend', updateDistance);
siteMarker.on('dragend', updateDistance);

populateSelect(projectCitySelect, usCities);
populateSelect(manufacturerSelect, timberManufacturers);
projectCitySelect.value = '0';
manufacturerSelect.value = '0';
syncMapFromSelections();
