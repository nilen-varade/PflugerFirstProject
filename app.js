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
const buildingTypeSelect = form.elements.buildingType;

const siteLookupBtn = document.getElementById('site-lookup-btn');
const estimateBtn = document.getElementById('estimate-btn');
const optionalToggleBtn = document.getElementById('optional-toggle');
const orsRouteBtn = document.getElementById('ors-route-btn');
const mapillaryBtn = document.getElementById('mapillary-btn');
const cesiumBtn = document.getElementById('cesium-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

const usCities = [
  { name: 'Houston, TX', lat: 29.7604, lng: -95.3698, cost: 0.98 },
  { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936, cost: 0.96 },
  { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, cost: 1.0 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431, cost: 1.09 },
  { name: 'Fort Worth, TX', lat: 32.7555, lng: -97.3308, cost: 0.98 },
  { name: 'El Paso, TX', lat: 31.7619, lng: -106.4850, cost: 0.92 },
  { name: 'Arlington, TX', lat: 32.7357, lng: -97.1081, cost: 0.98 },
  { name: 'Corpus Christi, TX', lat: 27.8006, lng: -97.3964, cost: 0.94 },
  { name: 'Plano, TX', lat: 33.0198, lng: -96.6989, cost: 1.02 },
  { name: 'Lubbock, TX', lat: 33.5779, lng: -101.8552, cost: 0.9 },
  { name: 'Laredo, TX', lat: 27.5306, lng: -99.4803, cost: 0.91 },
  { name: 'Irving, TX', lat: 32.8140, lng: -96.9489, cost: 0.99 },
  { name: 'Garland, TX', lat: 32.9126, lng: -96.6389, cost: 0.98 },
  { name: 'Amarillo, TX', lat: 35.2220, lng: -101.8313, cost: 0.9 },
  { name: 'Grand Prairie, TX', lat: 32.7459, lng: -96.9978, cost: 0.98 },
  { name: 'McKinney, TX', lat: 33.1972, lng: -96.6398, cost: 1.0 },
  { name: 'Frisco, TX', lat: 33.1507, lng: -96.8236, cost: 1.02 },
  { name: 'Brownsville, TX', lat: 25.9017, lng: -97.4975, cost: 0.9 },
  { name: 'Pasadena, TX', lat: 29.6911, lng: -95.2091, cost: 0.95 },
  { name: 'Killeen, TX', lat: 31.1171, lng: -97.7278, cost: 0.93 },
  { name: 'Waco, TX', lat: 31.5493, lng: -97.1467, cost: 0.94 },
  { name: 'McAllen, TX', lat: 26.2034, lng: -98.2300, cost: 0.91 },
  { name: 'Denton, TX', lat: 33.2148, lng: -97.1331, cost: 0.97 },
  { name: 'Midland, TX', lat: 31.9973, lng: -102.0779, cost: 0.93 },
  { name: 'Abilene, TX', lat: 32.4487, lng: -99.7331, cost: 0.9 },
  { name: 'New York, NY', lat: 40.7128, lng: -74.0060, cost: 1.23 },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, cost: 1.2 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, cost: 1.1 },
  { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740, cost: 1.01 },
  { name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652, cost: 1.07 },
  { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611, cost: 1.16 },
  { name: 'San Jose, CA', lat: 37.3382, lng: -121.8863, cost: 1.19 },
  { name: 'Jacksonville, FL', lat: 30.3322, lng: -81.6557, cost: 0.98 },
  { name: 'Columbus, OH', lat: 39.9612, lng: -82.9988, cost: 0.96 },
  { name: 'Charlotte, NC', lat: 35.2271, lng: -80.8431, cost: 0.98 },
  { name: 'Indianapolis, IN', lat: 39.7684, lng: -86.1581, cost: 0.95 },
  { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321, cost: 1.17 },
  { name: 'Denver, CO', lat: 39.7392, lng: -104.9903, cost: 1.08 },
  { name: 'Boston, MA', lat: 42.3601, lng: -71.0589, cost: 1.19 },
  { name: 'Nashville, TN', lat: 36.1627, lng: -86.7816, cost: 0.99 },
  { name: 'Baltimore, MD', lat: 39.2904, lng: -76.6122, cost: 1.05 },
  { name: 'Milwaukee, WI', lat: 43.0389, lng: -87.9065, cost: 0.97 },
  { name: 'Portland, OR', lat: 45.5152, lng: -122.6784, cost: 1.1 },
  { name: 'Las Vegas, NV', lat: 36.1699, lng: -115.1398, cost: 1.03 },
  { name: 'Detroit, MI', lat: 42.3314, lng: -83.0458, cost: 0.95 },
  { name: 'Memphis, TN', lat: 35.1495, lng: -90.0490, cost: 0.92 },
  { name: 'Louisville, KY', lat: 38.2527, lng: -85.7585, cost: 0.94 },
  { name: 'Oklahoma City, OK', lat: 35.4676, lng: -97.5164, cost: 0.92 },
  { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880, cost: 1.02 },
  { name: 'Miami, FL', lat: 25.7617, lng: -80.1918, cost: 1.08 },
  { name: 'Raleigh, NC', lat: 35.7796, lng: -78.6382, cost: 0.99 },
  { name: 'Kansas City, MO', lat: 39.0997, lng: -94.5786, cost: 0.95 },
  { name: 'Omaha, NE', lat: 41.2565, lng: -95.9345, cost: 0.92 },
  { name: 'Albuquerque, NM', lat: 35.0844, lng: -106.6504, cost: 0.91 },
  { name: 'Sacramento, CA', lat: 38.5816, lng: -121.4944, cost: 1.12 },
];

const timberManufacturers = [
  { name: 'SmartLam North America — Columbia Falls, MT', lat: 48.3725, lng: -114.1810 },
  { name: 'DR Johnson Wood — Riddle, OR', lat: 42.9504, lng: -123.3645 },
  { name: 'Vaagen Timbers — Colville, WA', lat: 48.5466, lng: -117.9055 },
  { name: 'Katerra Legacy CLT — Spokane Valley, WA', lat: 47.6732, lng: -117.2394 },
  { name: 'Freres Engineered Wood — Lyons, OR', lat: 44.7740, lng: -122.6076 },
  { name: 'Mercer Mass Timber — Conway, AR', lat: 35.0887, lng: -92.4335 },
  { name: 'Timberlab — Greenville, SC', lat: 34.8526, lng: -82.3940 },
  { name: 'Sterling Structural — Lufkin, TX', lat: 31.3382, lng: -94.7291 },
  { name: 'Boise Cascade Engineered Wood — Boise, ID', lat: 43.6150, lng: -116.2023 },
  { name: 'Rosboro Laminated — Springfield, OR', lat: 44.0462, lng: -123.0220 },
  { name: 'Weyerhaeuser Engineered Wood — Tacoma, WA', lat: 47.2529, lng: -122.4443 },
  { name: 'Binderholz North America — Live Oak, FL', lat: 30.2949, lng: -82.9840 },
  { name: 'Hasslacher Norica USA — Nashville, TN', lat: 36.1627, lng: -86.7816 },
  { name: 'International Beams — Myrtle Creek, OR', lat: 43.0207, lng: -123.2928 },
  { name: 'Structurlam Legacy — Okanogan, WA', lat: 48.3620, lng: -119.5836 },
  { name: 'Western Archrib — Edmonton, AB', lat: 53.5461, lng: -113.4938 },
  { name: 'Nordic Structures — Chibougamau, QC', lat: 49.9169, lng: -74.3659 },
  { name: 'Element5 — St. Thomas, ON', lat: 42.7778, lng: -81.1824 },
  { name: 'Mass Timber Services — Portland, OR', lat: 45.5152, lng: -122.6784 },
  { name: 'Seagate Structures — Idaho Falls, ID', lat: 43.4917, lng: -112.0339 },
];

const buildingTypes = [
  'Education', 'Recreational', 'Library', 'Office', 'Residential', 'Healthcare', 'Hospitality', 'Mixed Use',
  'Laboratory', 'Warehouse', 'Retail', 'Airport Terminal', 'Transit Hub', 'Justice/Courthouse', 'Religious',
  'Museum', 'Data Center', 'Manufacturing'
];

const transportFactors = { truck: 0.11, rail: 0.03, ship: 0.015, multimodal: 0.055 };
const speciesFactors = {
  'douglas-fir': { density: 0.53, sequestration: -760, processFactor: 1.0 },
  'spruce-pine-fir': { density: 0.46, sequestration: -690, processFactor: 0.96 },
  'southern-yellow-pine': { density: 0.57, sequestration: -780, processFactor: 1.04 },
  'hemlock-fir': { density: 0.49, sequestration: -710, processFactor: 0.99 },
};

const map = L.map('map', { fullscreenControl: true }).setView([31.0, -99.0], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
const manufacturerMarker = L.marker([48.3725, -114.181], { draggable: true }).addTo(map).bindPopup('Manufacturer Facility');
const siteMarker = L.marker([30.2672, -97.7431], { draggable: true }).addTo(map).bindPopup('Project Site');
const routeLine = L.polyline([manufacturerMarker.getLatLng(), siteMarker.getLatLng()], { color: '#1e66ff', weight: 3 }).addTo(map);

let carbonChart;
let costChart;
let mixChart;
let currentRouteMiles = 0;
let schoolStats = { count: 0, avgEnrollment: 0 };

const schema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  grossAreaFt2: z.coerce.number().min(0),
  stories: z.coerce.number().min(0),
  cltUsePercent: z.coerce.number().min(0).max(100),
});

function num(fd, key, fallback = 0) {
  const raw = fd.get(key);
  if (raw === '' || raw == null) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseFtIn(text) {
  if (!text) return 0;
  const m = text.match(/(\d+)\s*'\s*(\d+)?/);
  if (!m) return 0;
  return Number(m[1] || 0) + Number(m[2] || 0) / 12;
}

function haversineMiles(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const r = 3958.8;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
}

function populateSelect(select, data) {
  select.innerHTML = data.map((x, i) => `<option value="${i}">${x.name}</option>`).join('');
}

function populateBuildingTypes() {
  buildingTypeSelect.innerHTML = buildingTypes.map((t) => `<option value="${t.toLowerCase().replace(/\s+/g, '-')}">${t}</option>`).join('');
  buildingTypeSelect.value = 'recreational';
}

function estimateFromType(fd) {
  const type = fd.get('buildingType') || 'education';
  const occupancy = num(fd, 'occupancy', 600);
  const areaPerPerson = ({'library': 160, 'recreational': 145, 'education': 120, 'office': 140, 'residential': 320, 'healthcare': 240}[type]) || 150;
  const grossAreaFt2 = num(fd, 'grossAreaFt2', 0) || occupancy * areaPerPerson;
  const stories = num(fd, 'stories', 0) || Math.max(1, Math.round(grossAreaFt2 / 28000));
  const floorPlateFt2 = num(fd, 'floorPlateFt2', 0) || grossAreaFt2 / stories;
  const heightFt = parseFtIn(fd.get('heightFtIn')) || stories * 14;

  return {
    grossAreaFt2,
    stories,
    floorPlateFt2,
    heightFt,
    cltFt3: num(fd, 'cltFt3', 0) || grossAreaFt2 * 0.75,
    glulamFt3: num(fd, 'glulamFt3', 0) || grossAreaFt2 * 0.2,
    lvlFt3: num(fd, 'lvlFt3', 0) || grossAreaFt2 * 0.06,
    nltFt3: num(fd, 'nltFt3', 0) || grossAreaFt2 * 0.04,
    dltFt3: num(fd, 'dltFt3', 0) || grossAreaFt2 * 0.03,
  };
}

function updateSolar(lat, lng) {
  const solar = window.SunCalc.getTimes(new Date(), lat, lng);
  solarPeakEl.textContent = solar.solarNoon ? solar.solarNoon.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
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

function syncMapFromSelections() {
  const city = usCities[Number(projectCitySelect.value)] || usCities[0];
  const mfg = timberManufacturers[Number(manufacturerSelect.value)] || timberManufacturers[0];
  siteMarker.setLatLng([city.lat, city.lng]);
  manufacturerMarker.setLatLng([mfg.lat, mfg.lng]);
  map.fitBounds(L.latLngBounds([siteMarker.getLatLng(), manufacturerMarker.getLatLng()]), { padding: [40, 40] });
  updateDistance();
}

async function geocodeSite(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en-US' } });
  const data = await res.json();
  if (!data?.length) throw new Error('No result found');
  return { lat: Number(data[0].lat), lng: Number(data[0].lon), display: data[0].display_name };
}

async function fetchOrsRouteMiles(apiKey) {
  const a = manufacturerMarker.getLatLng();
  const b = siteMarker.getLatLng();
  const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: apiKey },
    body: JSON.stringify({ coordinates: [[a.lng, a.lat], [b.lng, b.lat]] }),
  });
  const data = await response.json();
  const meters = data?.routes?.[0]?.summary?.distance;
  if (!meters) throw new Error('No route distance returned');
  return meters * 0.000621371;
}

async function fetchArcgisSchoolStats(lat, lng) {
  const url = `https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Public_Schools/FeatureServer/0/query?f=json&geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=25&units=esriSRUnit_StatuteMile&outFields=ENROLLMENT&returnGeometry=false`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const features = data?.features || [];
    const enrollments = features.map((f) => Number(f.attributes?.ENROLLMENT || 0)).filter((x) => x > 0);
    const avgEnrollment = enrollments.length ? enrollments.reduce((a, b) => a + b, 0) / enrollments.length : 0;
    schoolStats = { count: features.length, avgEnrollment };
  } catch {
    schoolStats = { count: 0, avgEnrollment: 0 };
  }
}

function calculate(fd, routeMiles) {
  const est = estimateFromType(fd);
  const species = speciesFactors[fd.get('timberSpecies')] || speciesFactors['douglas-fir'];
  const transportMode = fd.get('transportMode') || 'truck';
  const waste = num(fd, 'wasteFactor', 0) / 100;
  const cltShare = num(fd, 'cltUsePercent', 0) / 100;

  const totalFt3 = (est.cltFt3 + est.glulamFt3 + est.lvlFt3 + est.nltFt3 + est.dltFt3) * (1 + waste);
  const totalM3 = totalFt3 * 0.0283168;
  const timberMass = totalM3 * species.density;
  const grid = num(fd, 'gridIntensity', 0.32);
  const renew = num(fd, 'renewableShare', 35) / 100;
  const fire = num(fd, 'fireRating', 2);
  const complexity = 1 + est.heightFt / 400 + fire * 0.02;

  const timberCarbon = totalM3 * 115 * species.processFactor + timberMass * routeMiles * (transportFactors[transportMode] || 0.11) + est.grossAreaFt2 * 0.85 * grid * (1 - renew) + totalM3 * species.sequestration;
  const steelCarbon = est.grossAreaFt2 * 22 * complexity + routeMiles * 180;
  const concreteCarbon = est.grossAreaFt2 * 14 * complexity + routeMiles * 120;

  const city = usCities[Number(projectCitySelect.value)] || { cost: 1 };
  const timberRate = num(fd, 'timberCostPerFt2', 365);
  const steelRate = num(fd, 'steelCostPerFt2', 340);
  const concreteRate = num(fd, 'concreteCostPerFt2', 330);

  const timberCost = est.grossAreaFt2 * timberRate * city.cost;
  const steelCost = est.grossAreaFt2 * steelRate * city.cost;
  const concreteCost = est.grossAreaFt2 * concreteRate * city.cost;

  return { est, cltShare, complexity, carbon: { timber: timberCarbon, steel: steelCarbon, concrete: concreteCarbon }, cost: { timber: timberCost, steel: steelCost, concrete: concreteCost } };
}

function fmtKg(v) { return `${Math.round(v).toLocaleString()} kg CO₂e`; }
function fmtMoney(v) { return `$${Math.round(v).toLocaleString()}`; }

function drawCharts(result) {
  if (carbonChart) carbonChart.destroy();
  if (costChart) costChart.destroy();
  if (mixChart) mixChart.destroy();

  carbonChart = new Chart(document.getElementById('carbon-canvas'), {
    type: 'bar',
    data: { labels: ['Timber', 'Steel', 'Concrete'], datasets: [{ data: [result.carbon.timber, result.carbon.steel, result.carbon.concrete], backgroundColor: ['#15a364', '#d84a4a', '#ea8a2a'] }] },
    options: { plugins: { legend: { display: false } } },
  });

  costChart = new Chart(document.getElementById('cost-canvas'), {
    type: 'doughnut',
    data: { labels: ['Timber', 'Steel', 'Concrete'], datasets: [{ data: [result.cost.timber, result.cost.steel, result.cost.concrete], backgroundColor: ['#4f79ff', '#b957ff', '#5bb6ff'] }] },
  });

  mixChart = new Chart(document.getElementById('mix-canvas'), {
    type: 'radar',
    data: { labels: ['CLT', 'Glulam', 'LVL', 'NLT', 'DLT'], datasets: [{ data: [result.est.cltFt3, result.est.glulamFt3, result.est.lvlFt3, result.est.nltFt3, result.est.dltFt3], borderColor: '#1e66ff', backgroundColor: 'rgba(30,102,255,.2)' }] },
    options: { plugins: { legend: { display: false } } },
  });
}

function setFunFacts(result) {
  const carbonSavings = Math.max(0, result.carbon.steel - result.carbon.timber);
  const treeYears = carbonSavings / 21;
  const carMiles = carbonSavings / 0.404;
  const schoolEquivalent = schoolStats.avgEnrollment ? (num(new FormData(form), 'occupancy', 0) / schoolStats.avgEnrollment) : 0;

  funFacts.innerHTML = `
    <strong>Fun Facts</strong><br>
    • Timber scenario saves about <strong>${Math.round(treeYears).toLocaleString()}</strong> tree-year equivalents vs steel.<br>
    • Carbon difference is about <strong>${Math.round(carMiles).toLocaleString()}</strong> passenger car miles.<br>
    • Nearby public schools within ~25 miles (ArcGIS): <strong>${schoolStats.count.toLocaleString()}</strong>.<br>
    • Your occupancy is ~<strong>${schoolEquivalent ? schoolEquivalent.toFixed(2) : 'N/A'}</strong>x the average nearby school enrollment.
  `;
}

async function handleSubmit(event) {
  event.preventDefault();
  const fd = new FormData(form);

  const validation = schema.safeParse({
    projectName: fd.get('projectName'),
    grossAreaFt2: fd.get('grossAreaFt2') || 0,
    stories: fd.get('stories') || 0,
    cltUsePercent: fd.get('cltUsePercent') || 0,
  });
  if (!validation.success) {
    resultsSummary.innerHTML = `<strong>Validation error:</strong> ${validation.error.issues[0].message}`;
    return;
  }

  const routeMiles = updateDistance();
  await fetchArcgisSchoolStats(siteMarker.getLatLng().lat, siteMarker.getLatLng().lng);
  const result = calculate(fd, routeMiles);

  const deltaSteel = result.carbon.steel - result.carbon.timber;
  const deltaConcrete = result.carbon.concrete - result.carbon.timber;

  timberTotal.textContent = fmtKg(result.carbon.timber);
  steelSavings.textContent = `${Math.round(Math.abs(deltaSteel)).toLocaleString()} kg ${deltaSteel >= 0 ? 'lower' : 'higher'}`;
  concreteSavings.textContent = `${Math.round(Math.abs(deltaConcrete)).toLocaleString()} kg ${deltaConcrete >= 0 ? 'lower' : 'higher'}`;
  timberCostEl.textContent = fmtMoney(result.cost.timber);

  drawCharts(result);
  setFunFacts(result);

  resultsSummary.innerHTML = `
    <p><strong>${fd.get('projectName')}</strong> modeled at <strong>${Math.round(result.est.grossAreaFt2).toLocaleString()} ft²</strong>.</p>
    <p>Timber: <strong>${fmtKg(result.carbon.timber)}</strong> | Steel: <strong>${fmtKg(result.carbon.steel)}</strong> | Concrete: <strong>${fmtKg(result.carbon.concrete)}</strong>.</p>
    <p>Costs — Timber: <strong>${fmtMoney(result.cost.timber)}</strong>, Steel: <strong>${fmtMoney(result.cost.steel)}</strong>, Concrete: <strong>${fmtMoney(result.cost.concrete)}</strong>.</p>
  `;
  assumptions.innerHTML = `Route ${routeMiles.toFixed(1)} mi • Complexity ${result.complexity.toFixed(2)} • CLT share ${Math.round(result.cltShare * 100)}% • Optional blanks were estimated.`;
}

siteLookupBtn.addEventListener('click', async () => {
  const query = form.elements.siteQuery.value.trim();
  if (!query) return;
  try {
    const found = await geocodeSite(query);
    siteMarker.setLatLng([found.lat, found.lng]);
    map.panTo([found.lat, found.lng]);
    resultsSummary.innerHTML = `<p><strong>Site found:</strong> ${found.display}</p>`;
    updateDistance();
  } catch (err) {
    resultsSummary.innerHTML = `<p><strong>Lookup failed:</strong> ${err.message}</p>`;
  }
});

estimateBtn.addEventListener('click', () => {
  const est = estimateFromType(new FormData(form));
  form.elements.grossAreaFt2.value = Math.round(est.grossAreaFt2);
  form.elements.floorPlateFt2.value = Math.round(est.floorPlateFt2);
  form.elements.stories.value = Math.round(est.stories);
  form.elements.heightFtIn.value = `${Math.floor(est.heightFt)}' ${Math.round((est.heightFt % 1) * 12)}"`;
  form.elements.cltFt3.value = Math.round(est.cltFt3);
  form.elements.glulamFt3.value = Math.round(est.glulamFt3);
  form.elements.lvlFt3.value = Math.round(est.lvlFt3);
  form.elements.nltFt3.value = Math.round(est.nltFt3);
  form.elements.dltFt3.value = Math.round(est.dltFt3);
  resultsSummary.innerHTML = '<p><strong>Auto-estimate complete.</strong> Estimated quantities now populated for clarity.</p>';
});

let optionalHidden = false;
optionalToggleBtn.addEventListener('click', () => {
  optionalHidden = !optionalHidden;
  form.classList.toggle('optional-hidden', optionalHidden);
});

orsRouteBtn.addEventListener('click', async () => {
  const key = form.elements.orsApiKey.value.trim();
  if (!key) {
    resultsSummary.innerHTML = '<p><strong>ORS:</strong> add an API key first.</p>';
    return;
  }
  try {
    const miles = await fetchOrsRouteMiles(key);
    currentRouteMiles = miles;
    distanceLabel.textContent = `${miles.toFixed(0)} mi`;
    resultsSummary.innerHTML = `<p><strong>ORS route distance:</strong> ${miles.toFixed(1)} mi.</p>`;
  } catch (e) {
    resultsSummary.innerHTML = `<p><strong>ORS failed:</strong> ${e.message}. Reverting to straight-line distance.</p>`;
    updateDistance();
  }
});

mapillaryBtn.addEventListener('click', () => {
  const token = form.elements.mapillaryToken.value.trim();
  const s = siteMarker.getLatLng();
  imageryPanel.innerHTML = token
    ? `Mapillary viewer near site: <a target="_blank" rel="noreferrer" href="https://www.mapillary.com/app/?lat=${s.lat}&lng=${s.lng}&z=16">Open Mapillary</a>`
    : 'Please add a Mapillary token. Then click again to launch a site-adjacent map link.';
});

cesiumBtn.addEventListener('click', () => {
  const token = form.elements.cesiumToken.value.trim();
  const tiles = form.elements.tilesetUrl.value.trim();
  const collada = form.elements.colladaUrl.value.trim();
  cesiumPanel.innerHTML = `Cesium status: ${token ? 'token provided' : 'no token'} • 3D Tiles: ${tiles || 'not set'} • COLLADA: ${collada || 'not set'}`;
});

exportPdfBtn.addEventListener('click', async () => {
  const canvas = await html2canvas(document.querySelector('.panel:last-child'));
  const img = canvas.toDataURL('image/png');
  const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
  const width = 190;
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(img, 'PNG', 10, 10, width, Math.min(270, height));
  pdf.save('mass-timber-report.pdf');
});

form.addEventListener('submit', handleSubmit);
projectCitySelect.addEventListener('change', syncMapFromSelections);
manufacturerSelect.addEventListener('change', syncMapFromSelections);
manufacturerMarker.on('dragend', updateDistance);
siteMarker.on('dragend', updateDistance);

populateSelect(projectCitySelect, usCities);
populateSelect(manufacturerSelect, timberManufacturers);
populateBuildingTypes();
projectCitySelect.value = '3';
manufacturerSelect.value = '0';
syncMapFromSelections();
