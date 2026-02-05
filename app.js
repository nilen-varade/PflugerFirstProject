const form = document.getElementById('calculator-form');
const distanceLabel = document.getElementById('distance-km');
const timberTotal = document.getElementById('timber-total');
const steelSavings = document.getElementById('steel-savings');
const concreteSavings = document.getElementById('concrete-savings');
const resultsSummary = document.getElementById('results-summary');
const chart = document.getElementById('comparison-chart');
const assumptions = document.getElementById('assumptions');

const transportFactors = {
  truck: 0.11,
  rail: 0.03,
  ship: 0.015,
};

const productionFactors = {
  clt: 110,
  glulam: 95,
  sequestration: -720,
  steel: 1850,
  concrete: 300,
};

const map = L.map('map').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const manufacturerMarker = L.marker([49.28, -123.12], { draggable: true }).addTo(map)
  .bindPopup('Manufacturer')
  .openPopup();

const siteMarker = L.marker([30.27, -97.74], { draggable: true }).addTo(map)
  .bindPopup('Project Site');

const routeLine = L.polyline([manufacturerMarker.getLatLng(), siteMarker.getLatLng()], {
  color: '#245dff',
  weight: 3,
  opacity: 0.9,
}).addTo(map);

function haversineKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(x));
}

function updateRouteAndDistance() {
  const manufacturer = manufacturerMarker.getLatLng();
  const site = siteMarker.getLatLng();
  routeLine.setLatLngs([manufacturer, site]);
  const km = haversineKm(manufacturer, site);
  distanceLabel.textContent = `${km.toFixed(0)} km`;
  return km;
}

manufacturerMarker.on('dragend', updateRouteAndDistance);
siteMarker.on('dragend', updateRouteAndDistance);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseNumber(fd, key, fallback = 0) {
  const parsed = Number(fd.get(key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function calculate(fd, distanceKm) {
  const floorPlate = parseNumber(fd, 'floorPlate');
  const stories = parseNumber(fd, 'stories');
  const height = parseNumber(fd, 'height');
  const cltVolume = parseNumber(fd, 'cltVolume');
  const glulamVolume = parseNumber(fd, 'glulamVolume');
  const cltUse = clamp(parseNumber(fd, 'cltUsePercent') / 100, 0, 1);
  const steelShare = clamp(parseNumber(fd, 'hybridSteelPercent') / 100, 0, 1);
  const concreteShare = clamp(parseNumber(fd, 'hybridConcretePercent') / 100, 0, 1);
  const wasteFactor = clamp(parseNumber(fd, 'wasteFactor') / 100, 0, 0.35);
  const renewableShare = clamp(parseNumber(fd, 'renewableShare') / 100, 0, 1);
  const gridIntensity = clamp(parseNumber(fd, 'gridIntensity'), 0.05, 1.2);
  const fireRating = parseNumber(fd, 'fireRating');
  const mode = fd.get('transportMode') || 'truck';

  const grossArea = floorPlate * stories;
  const structuralComplexity = 1 + (height / 120) + (fireRating * 0.03);
  const wasteMultiplier = 1 + wasteFactor;

  const timberM3 = (cltVolume + glulamVolume) * wasteMultiplier;
  const timberProduction = (
    cltVolume * productionFactors.clt +
    glulamVolume * productionFactors.glulam
  ) * wasteMultiplier;
  const timberSequestration = timberM3 * productionFactors.sequestration;

  const timberMassTons = (cltVolume * 0.47 + glulamVolume * 0.51) * wasteMultiplier;
  const transport = timberMassTons * distanceKm * (transportFactors[mode] || transportFactors.truck);

  const fabricationEnergyKwh = grossArea * 18 * structuralComplexity;
  const fabricationEmissions = fabricationEnergyKwh * gridIntensity * (1 - renewableShare);

  const hybridSteelTons = grossArea * 0.05 * steelShare;
  const hybridConcreteM3 = grossArea * 0.09 * concreteShare;
  const hybridEmissions =
    (hybridSteelTons * productionFactors.steel) +
    (hybridConcreteM3 * productionFactors.concrete);

  const massTimberTotal = timberProduction + transport + fabricationEmissions + hybridEmissions + timberSequestration;

  const steelAltTons = grossArea * 0.11 * structuralComplexity;
  const concreteAltM3 = grossArea * 0.16 * structuralComplexity;

  const steelAlternative =
    (steelAltTons * productionFactors.steel) +
    (grossArea * 10 * gridIntensity) +
    (steelAltTons * distanceKm * transportFactors.truck * 0.65);

  const concreteAlternative =
    (concreteAltM3 * productionFactors.concrete) +
    (grossArea * 9 * gridIntensity) +
    (concreteAltM3 * 2.4 * distanceKm * transportFactors.truck * 0.4);

  return {
    grossArea,
    timber: massTimberTotal,
    steel: steelAlternative,
    concrete: concreteAlternative,
    assumptions: {
      structuralComplexity,
      distanceKm,
      transportMode: mode,
      cltUse,
    },
  };
}

function formatKg(value) {
  return `${Math.round(value).toLocaleString()} kg CO₂e`;
}

function formatDelta(value) {
  const rounded = Math.round(Math.abs(value)).toLocaleString();
  return `${rounded} kg CO₂e ${value >= 0 ? 'lower' : 'higher'}`;
}

function renderChart(values) {
  const max = Math.max(values.timber, values.steel, values.concrete, 1);
  const rows = [
    ['Mass Timber', values.timber, 'timber'],
    ['Steel Baseline', values.steel, 'steel'],
    ['Concrete Baseline', values.concrete, 'concrete'],
  ];

  chart.innerHTML = rows.map(([label, val, style]) => `
    <div class="bar-row">
      <strong>${label}</strong>
      <div class="bar ${style}"><span style="width:${Math.max(2, (val / max) * 100)}%"></span></div>
      <span>${formatKg(val)}</span>
    </div>
  `).join('');
}

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
    <p><strong>${fd.get('projectName') || 'Project'}</strong> gross area: <strong>${values.grossArea.toLocaleString()} m²</strong>.</p>
    <p>Mass timber embodied carbon estimate: <strong>${formatKg(values.timber)}</strong>.</p>
    <p>Relative to steel baseline, this concept is <strong>${formatDelta(deltaVsSteel)}</strong>.</p>
    <p>Relative to concrete baseline, this concept is <strong>${formatDelta(deltaVsConcrete)}</strong>.</p>
  `;

  renderChart(values);

  assumptions.innerHTML = `
    Assumptions used: structural complexity <strong>${values.assumptions.structuralComplexity.toFixed(2)}</strong>,
    logistics mode <strong>${values.assumptions.transportMode}</strong>,
    route distance <strong>${values.assumptions.distanceKm.toFixed(0)} km</strong>,
    CLT share <strong>${Math.round(values.assumptions.cltUse * 100)}%</strong>.
  `;
});

renderChart({ timber: 0, steel: 0, concrete: 0 });
updateRouteAndDistance();
