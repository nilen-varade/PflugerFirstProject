const form = document.getElementById('calculator-form');
const distanceLabel = document.getElementById('distance-km');
const timberTotal = document.getElementById('timber-total');
const steelSavings = document.getElementById('steel-savings');
const concreteSavings = document.getElementById('concrete-savings');
const resultsSummary = document.getElementById('results-summary');
const chart = document.getElementById('comparison-chart');
const assumptions = document.getElementById('assumptions');
const projectCitySelect = document.getElementById('project-city');
const manufacturerSelect = document.getElementById('manufacturer-select');
const estimateBtn = document.getElementById('estimate-btn');
const optionalToggleBtn = document.getElementById('optional-toggle');

const usCities = [
  { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
  { name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652 },
  { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936 },
  { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
  { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
  { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
  { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
  { name: 'Boston, MA', lat: 42.3601, lng: -71.0589 },
  { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880 },
  { name: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
  { name: 'Portland, OR', lat: 45.5152, lng: -122.6784 },
];

const timberManufacturers = [
  { name: 'SmartLam North America (Columbia Falls, MT)', lat: 48.3725, lng: -114.1810 },
  { name: 'DR Johnson Wood Innovations (Riddle, OR)', lat: 42.9504, lng: -123.3645 },
  { name: 'Vaagen Timbers (Colville, WA)', lat: 48.5466, lng: -117.9055 },
  { name: 'Katerra Legacy CLT (Spokane Valley, WA)', lat: 47.6732, lng: -117.2394 },
  { name: 'Freres Engineered Wood (Lyons, OR)', lat: 44.7740, lng: -122.6076 },
  { name: 'Mercer Mass Timber / Structurlam (Conway, AR)', lat: 35.0887, lng: -92.4335 },
  { name: 'Timberlab / Swinerton (Greenville, SC)', lat: 34.8526, lng: -82.3940 },
  { name: 'Sterling Structural (Lufkin, TX)', lat: 31.3382, lng: -94.7291 },
  { name: 'XL Construction Timber Hub (Sacramento, CA)', lat: 38.5816, lng: -121.4944 },
  { name: 'Hasslacher Norica USA (Nashville, TN)', lat: 36.1627, lng: -86.7816 },
];

const transportFactors = { truck: 0.11, rail: 0.03, ship: 0.015 };
const productionFactors = { clt: 110, glulam: 95, sequestration: -720, steel: 1850, concrete: 300 };

const typeDefaults = {
  education: { areaPerPerson: 11, stories: 2, heightPerStory: 4.2, cltKgPerM2: 0.17, glulamKgPerM2: 0.055 },
  office: { areaPerPerson: 13, stories: 8, heightPerStory: 3.8, cltKgPerM2: 0.14, glulamKgPerM2: 0.04 },
  residential: { areaPerPerson: 30, stories: 6, heightPerStory: 3.5, cltKgPerM2: 0.15, glulamKgPerM2: 0.045 },
  civic: { areaPerPerson: 10, stories: 3, heightPerStory: 4.5, cltKgPerM2: 0.19, glulamKgPerM2: 0.06 },
  industrial: { areaPerPerson: 25, stories: 1, heightPerStory: 8, cltKgPerM2: 0.08, glulamKgPerM2: 0.035 },
};

const map = L.map('map').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const manufacturerMarker = L.marker([48.3725, -114.1810], { draggable: true }).addTo(map).bindPopup('Manufacturer');
const siteMarker = L.marker([30.2672, -97.7431], { draggable: true }).addTo(map).bindPopup('Project Site');
const routeLine = L.polyline([manufacturerMarker.getLatLng(), siteMarker.getLatLng()], { color: '#1f67ff', weight: 3 }).addTo(map);

function populateSelect(selectElement, data) {
  selectElement.innerHTML = data.map((item, idx) => `<option value="${idx}">${item.name}</option>`).join('');
}

function setMarkerFromSelection() {
  const city = usCities[Number(projectCitySelect.value)] || usCities[0];
  const maker = timberManufacturers[Number(manufacturerSelect.value)] || timberManufacturers[0];
  siteMarker.setLatLng([city.lat, city.lng]);
  manufacturerMarker.setLatLng([maker.lat, maker.lng]);
  map.fitBounds(L.latLngBounds([siteMarker.getLatLng(), manufacturerMarker.getLatLng()]), { padding: [35, 35] });
  updateRouteAndDistance();
}

function haversineKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const r = 6371;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
}

function updateRouteAndDistance() {
  const m = manufacturerMarker.getLatLng();
  const s = siteMarker.getLatLng();
  routeLine.setLatLngs([m, s]);
  const km = haversineKm(m, s);
  distanceLabel.textContent = `${km.toFixed(0)} km`;
  return km;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function optionalNumber(fd, key, fallback) {
  const value = fd.get(key);
  const parsed = Number(value);
  return Number.isFinite(parsed) && value !== '' ? parsed : fallback;
}

function estimateBuildingQuantities(fd) {
  const buildingType = fd.get('buildingType') || 'education';
  const defaults = typeDefaults[buildingType] || typeDefaults.education;
  const occupancy = optionalNumber(fd, 'occupancy', 600);
  const floorAreaMode = fd.get('floorAreaMode') || 'manual';

  const estimatedGrossArea = occupancy * defaults.areaPerPerson;
  const estimatedStories = Math.max(1, Math.round(defaults.stories));
  const estimatedFloorPlate = estimatedGrossArea / estimatedStories;
  const estimatedHeight = estimatedStories * defaults.heightPerStory;

  const floorPlate = floorAreaMode === 'estimate'
    ? estimatedFloorPlate
    : optionalNumber(fd, 'floorPlate', estimatedFloorPlate);
  const stories = optionalNumber(fd, 'stories', estimatedStories);
  const height = optionalNumber(fd, 'height', estimatedHeight);
  const grossArea = floorPlate * stories;

  const cltVolume = optionalNumber(fd, 'cltVolume', grossArea * defaults.cltKgPerM2 / 0.47);
  const glulamVolume = optionalNumber(fd, 'glulamVolume', grossArea * defaults.glulamKgPerM2 / 0.51);

  return {
    floorPlate,
    stories,
    height,
    grossArea,
    cltVolume,
    glulamVolume,
    approximationNote: floorAreaMode === 'estimate'
      ? 'Gross area estimated from occupancy and building type defaults.'
      : 'Missing material quantities estimated from building type intensity defaults.',
  };
}

function calculate(fd, distanceKm) {
  const estimate = estimateBuildingQuantities(fd);

  const cltUse = clamp(optionalNumber(fd, 'cltUsePercent', 70) / 100, 0, 1);
  const steelShare = clamp(optionalNumber(fd, 'hybridSteelPercent', 15) / 100, 0, 1);
  const concreteShare = clamp(optionalNumber(fd, 'hybridConcretePercent', 10) / 100, 0, 1);
  const wasteFactor = clamp(optionalNumber(fd, 'wasteFactor', 5) / 100, 0, 0.35);
  const renewableShare = clamp(optionalNumber(fd, 'renewableShare', 30) / 100, 0, 1);
  const gridIntensity = clamp(optionalNumber(fd, 'gridIntensity', 0.35), 0.05, 1.2);
  const fireRating = optionalNumber(fd, 'fireRating', 2);
  const mode = fd.get('transportMode') || 'truck';

  const structuralComplexity = 1 + (estimate.height / 120) + (fireRating * 0.03);
  const wasteMultiplier = 1 + wasteFactor;

  const timberM3 = (estimate.cltVolume + estimate.glulamVolume) * wasteMultiplier;
  const timberProduction = (
    estimate.cltVolume * productionFactors.clt +
    estimate.glulamVolume * productionFactors.glulam
  ) * wasteMultiplier;
  const timberSequestration = timberM3 * productionFactors.sequestration;

  const timberMassTons = (estimate.cltVolume * 0.47 + estimate.glulamVolume * 0.51) * wasteMultiplier;
  const transport = timberMassTons * distanceKm * (transportFactors[mode] || transportFactors.truck);

  const fabricationEnergyKwh = estimate.grossArea * 18 * structuralComplexity;
  const fabricationEmissions = fabricationEnergyKwh * gridIntensity * (1 - renewableShare);

  const hybridSteelTons = estimate.grossArea * 0.05 * steelShare;
  const hybridConcreteM3 = estimate.grossArea * 0.09 * concreteShare;
  const hybridEmissions = (hybridSteelTons * productionFactors.steel) + (hybridConcreteM3 * productionFactors.concrete);

  const massTimberTotal = timberProduction + transport + fabricationEmissions + hybridEmissions + timberSequestration;

  const steelAltTons = estimate.grossArea * 0.11 * structuralComplexity;
  const concreteAltM3 = estimate.grossArea * 0.16 * structuralComplexity;

  const steelAlternative = (steelAltTons * productionFactors.steel) + (estimate.grossArea * 10 * gridIntensity) + (steelAltTons * distanceKm * transportFactors.truck * 0.65);
  const concreteAlternative = (concreteAltM3 * productionFactors.concrete) + (estimate.grossArea * 9 * gridIntensity) + (concreteAltM3 * 2.4 * distanceKm * transportFactors.truck * 0.4);

  return {
    ...estimate,
    timber: massTimberTotal,
    steel: steelAlternative,
    concrete: concreteAlternative,
    assumptions: { structuralComplexity, distanceKm, transportMode: mode, cltUse },
  };
}

function formatKg(value) {
  return `${Math.round(value).toLocaleString()} kg CO₂e`;
}

function formatDelta(value) {
  return `${Math.round(Math.abs(value)).toLocaleString()} kg CO₂e ${value >= 0 ? 'lower' : 'higher'}`;
}

function renderChart(values) {
  const max = Math.max(values.timber, values.steel, values.concrete, 1);
  const rows = [['Mass Timber', values.timber, 'timber'], ['Steel Baseline', values.steel, 'steel'], ['Concrete Baseline', values.concrete, 'concrete']];
  chart.innerHTML = rows.map(([label, val, style]) => `
    <div class="bar-row">
      <strong>${label}</strong>
      <div class="bar ${style}"><span style="width:${Math.max(2, (val / max) * 100)}%"></span></div>
      <span>${formatKg(val)}</span>
    </div>
  `).join('');
}

function updateOptionalUI(hidden) {
  form.classList.toggle('optional-hidden', hidden);
  optionalToggleBtn.textContent = hidden ? 'Show Optional Inputs' : 'Hide Optional Inputs';
}

let optionalHidden = false;

optionalToggleBtn.addEventListener('click', () => {
  optionalHidden = !optionalHidden;
  updateOptionalUI(optionalHidden);
});

estimateBtn.addEventListener('click', () => {
  const fd = new FormData(form);
  const est = estimateBuildingQuantities(fd);
  form.elements.floorPlate.value = est.floorPlate.toFixed(0);
  form.elements.stories.value = Math.round(est.stories);
  form.elements.height.value = est.height.toFixed(1);
  form.elements.cltVolume.value = est.cltVolume.toFixed(0);
  form.elements.glulamVolume.value = est.glulamVolume.toFixed(0);
  resultsSummary.innerHTML = `<p><strong>Auto-estimation complete.</strong> ${est.approximationNote}</p>`;
});

projectCitySelect.addEventListener('change', setMarkerFromSelection);
manufacturerSelect.addEventListener('change', setMarkerFromSelection);
manufacturerMarker.on('dragend', updateRouteAndDistance);
siteMarker.on('dragend', updateRouteAndDistance);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fd = new FormData(form);
  const distanceKm = updateRouteAndDistance();
  const values = calculate(fd, distanceKm);
  const deltaVsSteel = values.steel - values.timber;
  const deltaVsConcrete = values.concrete - values.timber;

  timberTotal.textContent = formatKg(values.timber);
  steelSavings.textContent = formatDelta(deltaVsSteel);
  steelSavings.className = deltaVsSteel >= 0 ? 'positive' : 'negative';
  concreteSavings.textContent = formatDelta(deltaVsConcrete);
  concreteSavings.className = deltaVsConcrete >= 0 ? 'positive' : 'negative';

  resultsSummary.innerHTML = `
    <p><strong>${fd.get('projectName') || 'Project'}</strong> modeled at <strong>${Math.round(values.grossArea).toLocaleString()} m²</strong>.</p>
    <p>Mass timber embodied carbon: <strong>${formatKg(values.timber)}</strong>.</p>
    <p>Compared to steel: <strong>${formatDelta(deltaVsSteel)}</strong>.</p>
    <p>Compared to concrete: <strong>${formatDelta(deltaVsConcrete)}</strong>.</p>
    <p><em>${values.approximationNote}</em></p>
  `;

  renderChart(values);

  assumptions.innerHTML = `
    Structural complexity <strong>${values.assumptions.structuralComplexity.toFixed(2)}</strong>,
    mode <strong>${values.assumptions.transportMode}</strong>, distance <strong>${values.assumptions.distanceKm.toFixed(0)} km</strong>,
    CLT share <strong>${Math.round(values.assumptions.cltUse * 100)}%</strong>.
  `;
});

populateSelect(projectCitySelect, usCities);
populateSelect(manufacturerSelect, timberManufacturers);
projectCitySelect.value = String(usCities.findIndex((x) => x.name.startsWith('Austin')));
manufacturerSelect.value = '0';
setMarkerFromSelection();
renderChart({ timber: 0, steel: 0, concrete: 0 });
updateOptionalUI(false);
