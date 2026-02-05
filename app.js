const form = document.getElementById('calculator-form');
const distanceLabel = document.getElementById('distance-km');
const timberTotal = document.getElementById('timber-total');
const steelSavings = document.getElementById('steel-savings');
const concreteSavings = document.getElementById('concrete-savings');
const timberCostEl = document.getElementById('timber-cost');
const steelCostDeltaEl = document.getElementById('steel-cost-delta');
const resultsSummary = document.getElementById('results-summary');
const carbonChart = document.getElementById('comparison-chart');
const costChart = document.getElementById('cost-chart');
const assumptions = document.getElementById('assumptions');
const projectCitySelect = document.getElementById('project-city');
const manufacturerSelect = document.getElementById('manufacturer-select');
const estimateBtn = document.getElementById('estimate-btn');
const optionalToggleBtn = document.getElementById('optional-toggle');

const usCities = [
  { name: 'New York, NY', lat: 40.7128, lng: -74.0060, cost: 1.23 },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, cost: 1.2 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, cost: 1.1 },
  { name: 'Houston, TX', lat: 29.7604, lng: -95.3698, cost: 0.98 },
  { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740, cost: 1.01 },
  { name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652, cost: 1.07 },
  { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936, cost: 0.96 },
  { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611, cost: 1.16 },
  { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, cost: 1.0 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431, cost: 1.09 },
  { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321, cost: 1.17 },
  { name: 'Denver, CO', lat: 39.7392, lng: -104.9903, cost: 1.08 },
  { name: 'Boston, MA', lat: 42.3601, lng: -71.0589, cost: 1.19 },
  { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880, cost: 1.02 },
  { name: 'Miami, FL', lat: 25.7617, lng: -80.1918, cost: 1.08 },
  { name: 'Portland, OR', lat: 45.5152, lng: -122.6784, cost: 1.1 },
  { name: 'Nashville, TN', lat: 36.1627, lng: -86.7816, cost: 0.99 },
  { name: 'Charlotte, NC', lat: 35.2271, lng: -80.8431, cost: 0.98 },
  { name: 'Minneapolis, MN', lat: 44.9778, lng: -93.2650, cost: 1.05 },
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, cost: 1.3 },
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
  { name: 'Hasslacher Norica USA (Nashville, TN)', lat: 36.1627, lng: -86.7816 },
  { name: 'Boise Cascade Mass Timber (Boise, ID)', lat: 43.6150, lng: -116.2023 },
  { name: 'Rosboro Laminated (Springfield, OR)', lat: 44.0462, lng: -123.0220 },
  { name: 'Binderholz North America (Live Oak, FL)', lat: 30.2949, lng: -82.9840 },
  { name: 'Weyerhaeuser Engineered Wood (Tacoma, WA)', lat: 47.2529, lng: -122.4443 },
  { name: 'International Beams Hub (Myrtle Creek, OR)', lat: 43.0207, lng: -123.2928 },
];

const transportFactors = { truck: 0.11, rail: 0.03, ship: 0.015, multimodal: 0.055 };

const speciesFactors = {
  'douglas-fir': { density: 0.53, sequestration: -760, processFactor: 1.0 },
  'spruce-pine-fir': { density: 0.46, sequestration: -690, processFactor: 0.96 },
  'southern-yellow-pine': { density: 0.57, sequestration: -780, processFactor: 1.04 },
  'hemlock-fir': { density: 0.49, sequestration: -710, processFactor: 0.99 },
  'european-spruce': { density: 0.45, sequestration: -680, processFactor: 1.08 },
};

const buildingDefaults = {
  education: { areaPerPerson: 11, stories: 2, cltPerM2: 0.24, glulamPerM2: 0.065, timberCost: 355, steelCost: 335, concreteCost: 328 },
  office: { areaPerPerson: 13, stories: 8, cltPerM2: 0.2, glulamPerM2: 0.052, timberCost: 380, steelCost: 350, concreteCost: 338 },
  residential: { areaPerPerson: 30, stories: 6, cltPerM2: 0.22, glulamPerM2: 0.058, timberCost: 340, steelCost: 320, concreteCost: 315 },
  civic: { areaPerPerson: 10, stories: 3, cltPerM2: 0.26, glulamPerM2: 0.072, timberCost: 370, steelCost: 345, concreteCost: 336 },
  industrial: { areaPerPerson: 25, stories: 1, cltPerM2: 0.1, glulamPerM2: 0.03, timberCost: 250, steelCost: 235, concreteCost: 228 },
  recreation: { areaPerPerson: 12, stories: 2, cltPerM2: 0.28, glulamPerM2: 0.08, timberCost: 395, steelCost: 360, concreteCost: 350 },
  library: { areaPerPerson: 14, stories: 3, cltPerM2: 0.25, glulamPerM2: 0.07, timberCost: 390, steelCost: 355, concreteCost: 345 },
  healthcare: { areaPerPerson: 22, stories: 7, cltPerM2: 0.19, glulamPerM2: 0.05, timberCost: 460, steelCost: 430, concreteCost: 420 },
  hospitality: { areaPerPerson: 28, stories: 10, cltPerM2: 0.21, glulamPerM2: 0.055, timberCost: 410, steelCost: 385, concreteCost: 375 },
  'mixed-use': { areaPerPerson: 20, stories: 9, cltPerM2: 0.22, glulamPerM2: 0.06, timberCost: 405, steelCost: 380, concreteCost: 368 },
};

const map = L.map('map').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const manufacturerMarker = L.marker([48.3725, -114.181], { draggable: true }).addTo(map).bindPopup('Manufacturer');
const siteMarker = L.marker([30.2672, -97.7431], { draggable: true }).addTo(map).bindPopup('Project Site');
const routeLine = L.polyline([manufacturerMarker.getLatLng(), siteMarker.getLatLng()], { color: '#1e66ff', weight: 3 }).addTo(map);

function num(fd, key, fallback = 0) {
  const value = fd.get(key);
  const parsed = Number(value);
  return Number.isFinite(parsed) && value !== '' ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function haversineKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const r = 6371;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
}

function updateDistance() {
  const m = manufacturerMarker.getLatLng();
  const s = siteMarker.getLatLng();
  routeLine.setLatLngs([m, s]);
  const km = haversineKm(m, s);
  distanceLabel.textContent = `${km.toFixed(0)} km`;
  return km;
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

function estimateQuantities(fd) {
  const type = fd.get('buildingType') || 'education';
  const d = buildingDefaults[type] || buildingDefaults.education;
  const occ = num(fd, 'occupancy', 600);
  const mode = fd.get('floorAreaMode') || 'manual';

  const estimatedGross = occ * d.areaPerPerson;
  const stories = num(fd, 'stories', d.stories);
  const grossArea = mode === 'estimate' ? estimatedGross : num(fd, 'grossAreaInput', estimatedGross);
  const floorPlate = num(fd, 'floorPlate', grossArea / Math.max(stories, 1));
  const height = num(fd, 'height', stories * 4.2);

  const cltVolume = num(fd, 'cltVolume', grossArea * d.cltPerM2);
  const glulamVolume = num(fd, 'glulamVolume', grossArea * d.glulamPerM2);
  const lvlVolume = num(fd, 'lvlVolume', grossArea * 0.015);
  const nltVolume = num(fd, 'nltVolume', grossArea * 0.012);
  const dltVolume = num(fd, 'dltVolume', grossArea * 0.009);

  return {
    grossArea,
    floorPlate,
    stories,
    height,
    cltVolume,
    glulamVolume,
    lvlVolume,
    nltVolume,
    dltVolume,
    note: mode === 'estimate'
      ? 'Gross area and timber quantities were approximated from building type and occupancy.'
      : 'Missing quantities were approximated from typology intensities and provided geometry.',
  };
}

function calculate(fd, distanceKm) {
  const est = estimateQuantities(fd);
  const type = fd.get('buildingType') || 'education';
  const defaults = buildingDefaults[type] || buildingDefaults.education;
  const species = speciesFactors[fd.get('timberSpecies')] || speciesFactors['douglas-fir'];
  const speciesMix = clamp(num(fd, 'speciesMixPct', 100) / 100, 0.2, 1);

  const cltUse = clamp(num(fd, 'cltUsePercent', 70) / 100, 0, 1);
  const steelShare = clamp(num(fd, 'hybridSteelPercent', 18) / 100, 0, 1);
  const concreteShare = clamp(num(fd, 'hybridConcretePercent', 12) / 100, 0, 1);
  const wasteFactor = clamp(num(fd, 'wasteFactor', 5) / 100, 0, 0.35);
  const reworkFactor = clamp(num(fd, 'reworkFactor', 3) / 100, 0, 0.25);
  const renewableShare = clamp(num(fd, 'renewableShare', 35) / 100, 0, 1);
  const gridIntensity = clamp(num(fd, 'gridIntensity', 0.32), 0.05, 1.3);
  const fireRating = num(fd, 'fireRating', 2);
  const resin = num(fd, 'resinIntensity', 8);
  const dataQuality = clamp(num(fd, 'dataQualityFactor', 1), 0.8, 1.2);
  const mode = fd.get('transportMode') || 'truck';
  const payload = clamp(num(fd, 'payloadUtilization', 82) / 100, 0.4, 1);
  const backhaul = clamp(num(fd, 'backhaulEfficiency', 35) / 100, 0, 1);
  const siteCongestion = clamp(num(fd, 'siteCongestionPct', 10) / 100, 0, 0.5);
  const dieselLiters = num(fd, 'dieselLiters', 60000);
  const electricEquip = clamp(num(fd, 'electricEquipmentPct', 20) / 100, 0, 1);
  const constructionMonths = num(fd, 'constructionMonths', 16);

  const timberVolume = (est.cltVolume + est.glulamVolume + est.lvlVolume + est.nltVolume + est.dltVolume) * (1 + wasteFactor + reworkFactor);
  const timberMassTons = timberVolume * species.density * speciesMix;

  const structuralComplexity = 1 + (est.height / 120) + (fireRating * 0.03) + siteCongestion;
  const hybridSteelTons = est.grossArea * 0.055 * steelShare;
  const hybridConcreteM3 = est.grossArea * 0.1 * concreteShare;
  const connectorSteel = num(fd, 'connectorSteelTons', 40);

  const timberProduction = (
    est.cltVolume * 112 + est.glulamVolume * 98 + est.lvlVolume * 140 + est.nltVolume * 85 + est.dltVolume * 78
  ) * species.processFactor * dataQuality;
  const resinEmissions = timberVolume * resin * 1.8;
  const sequestration = timberVolume * species.sequestration;

  const transportFactor = (transportFactors[mode] || transportFactors.truck) / payload * (1 + (1 - backhaul) * 0.3);
  const transport = timberMassTons * distanceKm * transportFactor;

  const fabEnergy = est.grossArea * 20 * structuralComplexity;
  const fabEmissions = fabEnergy * gridIntensity * (1 - renewableShare);
  const siteFuelEmissions = dieselLiters * 2.68 * (1 - electricEquip * 0.4);

  const hybridEmissions = (hybridSteelTons + connectorSteel) * 1850 + hybridConcreteM3 * 300;
  const massTimberCarbon = timberProduction + resinEmissions + transport + fabEmissions + hybridEmissions + siteFuelEmissions + sequestration;

  const steelAltTons = est.grossArea * 0.12 * structuralComplexity;
  const concreteAltM3 = est.grossArea * 0.17 * structuralComplexity;

  const steelCarbon = steelAltTons * 1850 + est.grossArea * 11 * gridIntensity + steelAltTons * distanceKm * 0.11 * 0.7 + siteFuelEmissions * 1.12;
  const concreteCarbon = concreteAltM3 * 300 + est.grossArea * 9.5 * gridIntensity + concreteAltM3 * 2.4 * distanceKm * 0.11 * 0.45 + siteFuelEmissions * 1.08;

  const analysisYear = num(fd, 'analysisYear', 2026);
  const yearsFromBase = Math.max(0, analysisYear - 2026);
  const escalation = Math.max(0, num(fd, 'escalationPct', 3.5) / 100);
  const regionalMultiplier = num(fd, 'regionCostMultiplier', (usCities[Number(projectCitySelect.value)] || { cost: 1 }).cost);
  const laborIndex = num(fd, 'laborIndex', 1.0);
  const contingency = Math.max(0, num(fd, 'contingencyPct', 8) / 100);
  const softCost = Math.max(0, num(fd, 'softCostPct', 18) / 100);
  const scheduleAdvantage = clamp(num(fd, 'timberScheduleAdvantage', 10) / 100, 0, 0.35);
  const genCond = num(fd, 'generalConditionsPerMonth', 210000);
  const financeCarry = num(fd, 'financingCarryPerMonth', 180000);

  const ft2 = est.grossArea * 10.7639;
  const timberCostRate = num(fd, 'timberCostPerFt2', defaults.timberCost);
  const steelCostRate = num(fd, 'steelCostPerFt2', defaults.steelCost);
  const concreteCostRate = num(fd, 'concreteCostPerFt2', defaults.concreteCost);

  const escalationFactor = (1 + escalation) ** yearsFromBase;

  const timberHardCost = ft2 * timberCostRate * regionalMultiplier * laborIndex * escalationFactor;
  const steelHardCost = ft2 * steelCostRate * regionalMultiplier * laborIndex * escalationFactor;
  const concreteHardCost = ft2 * concreteCostRate * regionalMultiplier * laborIndex * escalationFactor;

  const timberScheduleMonths = constructionMonths * (1 - scheduleAdvantage);
  const timberTimeCost = timberScheduleMonths * (genCond + financeCarry);
  const steelTimeCost = constructionMonths * (genCond + financeCarry);
  const concreteTimeCost = constructionMonths * 1.05 * (genCond + financeCarry);

  const timberTotalCost = timberHardCost * (1 + contingency + softCost) + timberTimeCost;
  const steelTotalCost = steelHardCost * (1 + contingency + softCost) + steelTimeCost;
  const concreteTotalCost = concreteHardCost * (1 + contingency + softCost) + concreteTimeCost;

  const carbonPrice = num(fd, 'carbonPrice', 70);
  const carbonCreditCapture = clamp(num(fd, 'carbonCreditCapturePct', 30) / 100, 0, 1);
  const timberCarbonValue = ((steelCarbon - massTimberCarbon) / 1000) * carbonPrice * carbonCreditCapture;

  return {
    ...est,
    carbon: { timber: massTimberCarbon, steel: steelCarbon, concrete: concreteCarbon },
    cost: { timber: timberTotalCost - timberCarbonValue, steel: steelTotalCost, concrete: concreteTotalCost },
    assumptions: { structuralComplexity, distanceKm, mode, species: fd.get('timberSpecies') || 'douglas-fir', cltUse, note: est.note },
  };
}

function fmtKg(v) { return `${Math.round(v).toLocaleString()} kg CO₂e`; }
function fmtMoney(v) { return `$${Math.round(v).toLocaleString()}`; }
function fmtDelta(v, suffix) { return `${Math.round(Math.abs(v)).toLocaleString()} ${suffix} ${v >= 0 ? 'lower' : 'higher'}`; }

function renderBarChart(target, rows, formatter, styleOverride = '') {
  const max = Math.max(...rows.map((r) => r.value), 1);
  target.innerHTML = rows.map((row) => `
    <div class="bar-row">
      <strong>${row.label}</strong>
      <div class="bar ${row.style} ${styleOverride}"><span style="width:${Math.max(2, (row.value / max) * 100)}%"></span></div>
      <span>${formatter(row.value)}</span>
    </div>
  `).join('');
}

function updateOptionalUI(hidden) {
  form.classList.toggle('optional-hidden', hidden);
  optionalToggleBtn.textContent = hidden ? 'Show Optional Emphasis' : 'Hide Optional Emphasis';
}

let optionalHidden = false;
optionalToggleBtn.addEventListener('click', () => {
  optionalHidden = !optionalHidden;
  updateOptionalUI(optionalHidden);
});

estimateBtn.addEventListener('click', () => {
  const fd = new FormData(form);
  const est = estimateQuantities(fd);
  form.elements.grossAreaInput.value = Math.round(est.grossArea);
  form.elements.floorPlate.value = Math.round(est.floorPlate);
  form.elements.stories.value = Math.round(est.stories);
  form.elements.height.value = est.height.toFixed(1);
  form.elements.cltVolume.value = Math.round(est.cltVolume);
  form.elements.glulamVolume.value = Math.round(est.glulamVolume);
  form.elements.lvlVolume.value = Math.round(est.lvlVolume);
  form.elements.nltVolume.value = Math.round(est.nltVolume);
  form.elements.dltVolume.value = Math.round(est.dltVolume);
  resultsSummary.innerHTML = `<p><strong>Auto-estimation completed.</strong> ${est.note}</p>`;
});

projectCitySelect.addEventListener('change', syncMapFromSelections);
manufacturerSelect.addEventListener('change', syncMapFromSelections);
manufacturerMarker.on('dragend', updateDistance);
siteMarker.on('dragend', updateDistance);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fd = new FormData(form);
  const distanceKm = updateDistance();
  const result = calculate(fd, distanceKm);

  const carbonDeltaSteel = result.carbon.steel - result.carbon.timber;
  const carbonDeltaConcrete = result.carbon.concrete - result.carbon.timber;
  const costDeltaSteel = result.cost.steel - result.cost.timber;

  timberTotal.textContent = fmtKg(result.carbon.timber);
  steelSavings.textContent = fmtDelta(carbonDeltaSteel, 'kg CO₂e');
  concreteSavings.textContent = fmtDelta(carbonDeltaConcrete, 'kg CO₂e');
  steelSavings.className = carbonDeltaSteel >= 0 ? 'positive' : 'negative';
  concreteSavings.className = carbonDeltaConcrete >= 0 ? 'positive' : 'negative';

  timberCostEl.textContent = fmtMoney(result.cost.timber);
  steelCostDeltaEl.textContent = fmtDelta(costDeltaSteel, 'USD');
  steelCostDeltaEl.className = costDeltaSteel >= 0 ? 'positive' : 'negative';

  renderBarChart(carbonChart, [
    { label: 'Mass Timber', value: result.carbon.timber, style: 'timber' },
    { label: 'Steel Baseline', value: result.carbon.steel, style: 'steel' },
    { label: 'Concrete Baseline', value: result.carbon.concrete, style: 'concrete' },
  ], fmtKg);

  renderBarChart(costChart, [
    { label: 'Mass Timber', value: result.cost.timber, style: 'cost' },
    { label: 'Steel Baseline', value: result.cost.steel, style: 'steel' },
    { label: 'Concrete Baseline', value: result.cost.concrete, style: 'concrete' },
  ], fmtMoney);

  resultsSummary.innerHTML = `
    <p><strong>${fd.get('projectName') || 'Project'}</strong> modeled at <strong>${Math.round(result.grossArea).toLocaleString()} m²</strong> (${Math.round(result.grossArea * 10.7639).toLocaleString()} ft²).</p>
    <p>Embodied carbon (timber): <strong>${fmtKg(result.carbon.timber)}</strong>; reduction vs steel: <strong>${fmtDelta(carbonDeltaSteel, 'kg CO₂e')}</strong>; vs concrete: <strong>${fmtDelta(carbonDeltaConcrete, 'kg CO₂e')}</strong>.</p>
    <p>Total project cost (timber): <strong>${fmtMoney(result.cost.timber)}</strong>; delta vs steel baseline: <strong>${fmtDelta(costDeltaSteel, 'USD')}</strong>.</p>
    <p><em>${result.assumptions.note}</em></p>
  `;

  assumptions.innerHTML = `
    Structural complexity <strong>${result.assumptions.structuralComplexity.toFixed(2)}</strong>, transport mode <strong>${result.assumptions.mode}</strong>, route distance <strong>${result.assumptions.distanceKm.toFixed(0)} km</strong>,
    primary species <strong>${result.assumptions.species}</strong>, CLT share <strong>${Math.round(result.assumptions.cltUse * 100)}%</strong>.
  `;
});

populateSelect(projectCitySelect, usCities);
populateSelect(manufacturerSelect, timberManufacturers);
projectCitySelect.value = String(usCities.findIndex((x) => x.name.startsWith('Austin')));
manufacturerSelect.value = '0';
syncMapFromSelections();
renderBarChart(carbonChart, [
  { label: 'Mass Timber', value: 0, style: 'timber' },
  { label: 'Steel Baseline', value: 0, style: 'steel' },
  { label: 'Concrete Baseline', value: 0, style: 'concrete' },
], fmtKg);
renderBarChart(costChart, [
  { label: 'Mass Timber', value: 0, style: 'cost' },
  { label: 'Steel Baseline', value: 0, style: 'steel' },
  { label: 'Concrete Baseline', value: 0, style: 'concrete' },
], fmtMoney);
updateOptionalUI(false);
