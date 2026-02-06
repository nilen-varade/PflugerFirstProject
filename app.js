const zodLib = window.Zod || window.zod || null;
const z = zodLib?.z || null;

const form = document.getElementById('calculator-form');
const distanceLabel = document.getElementById('distance-mi');
const timberTotal = document.getElementById('timber-total');
const steelSavings = document.getElementById('steel-savings');
const concreteSavings = document.getElementById('concrete-savings');
const timberCostEl = document.getElementById('timber-cost');
const complianceScoreEl = document.getElementById('compliance-score');
const solarPeakEl = document.getElementById('solar-peak');
const resultsSummary = document.getElementById('results-summary');
const reportGrid = document.getElementById('report-grid');
const assumptions = document.getElementById('assumptions');
const funFacts = document.getElementById('fun-facts');
const recommendationsEl = document.getElementById('recommendations');
const imageryPanel = document.getElementById('imagery-panel');
const cesiumPanel = document.getElementById('cesium-panel');
const projectCitySelect = document.getElementById('project-city');
const manufacturerSelect = document.getElementById('manufacturer-select');
const buildingTypeSelect = form.elements.buildingType;

const cityData = [
  ['Houston, TX',29.7604,-95.3698,0.98],['San Antonio, TX',29.4241,-98.4936,0.96],['Dallas, TX',32.7767,-96.7970,1.00],['Austin, TX',30.2672,-97.7431,1.09],['Fort Worth, TX',32.7555,-97.3308,0.98],['El Paso, TX',31.7619,-106.4850,0.92],['Arlington, TX',32.7357,-97.1081,0.98],['Corpus Christi, TX',27.8006,-97.3964,0.94],['Plano, TX',33.0198,-96.6989,1.02],['Lubbock, TX',33.5779,-101.8552,0.90],['Laredo, TX',27.5306,-99.4803,0.91],['Irving, TX',32.8140,-96.9489,0.99],['Garland, TX',32.9126,-96.6389,0.98],['Amarillo, TX',35.2220,-101.8313,0.90],['Grand Prairie, TX',32.7459,-96.9978,0.98],['McKinney, TX',33.1972,-96.6398,1.00],['Frisco, TX',33.1507,-96.8236,1.02],['Brownsville, TX',25.9017,-97.4975,0.90],['Pasadena, TX',29.6911,-95.2091,0.95],['Killeen, TX',31.1171,-97.7278,0.93],['Waco, TX',31.5493,-97.1467,0.94],['McAllen, TX',26.2034,-98.2300,0.91],['Denton, TX',33.2148,-97.1331,0.97],['Midland, TX',31.9973,-102.0779,0.93],['Abilene, TX',32.4487,-99.7331,0.90],
  ['New York, NY',40.7128,-74.0060,1.23],['Los Angeles, CA',34.0522,-118.2437,1.20],['Chicago, IL',41.8781,-87.6298,1.10],['Phoenix, AZ',33.4484,-112.0740,1.01],['Philadelphia, PA',39.9526,-75.1652,1.07],['San Diego, CA',32.7157,-117.1611,1.16],['San Jose, CA',37.3382,-121.8863,1.19],['Jacksonville, FL',30.3322,-81.6557,0.98],['Columbus, OH',39.9612,-82.9988,0.96],['Charlotte, NC',35.2271,-80.8431,0.98],['Indianapolis, IN',39.7684,-86.1581,0.95],['Seattle, WA',47.6062,-122.3321,1.17],['Denver, CO',39.7392,-104.9903,1.08],['Boston, MA',42.3601,-71.0589,1.19],['Nashville, TN',36.1627,-86.7816,0.99],['Baltimore, MD',39.2904,-76.6122,1.05],['Milwaukee, WI',43.0389,-87.9065,0.97],['Portland, OR',45.5152,-122.6784,1.10],['Las Vegas, NV',36.1699,-115.1398,1.03],['Detroit, MI',42.3314,-83.0458,0.95],['Memphis, TN',35.1495,-90.0490,0.92],['Louisville, KY',38.2527,-85.7585,0.94],['Oklahoma City, OK',35.4676,-97.5164,0.92],['Atlanta, GA',33.7490,-84.3880,1.02],['Miami, FL',25.7617,-80.1918,1.08],['Raleigh, NC',35.7796,-78.6382,0.99],['Kansas City, MO',39.0997,-94.5786,0.95],['Omaha, NE',41.2565,-95.9345,0.92],['Albuquerque, NM',35.0844,-106.6504,0.91],['Sacramento, CA',38.5816,-121.4944,1.12]
].map(([name,lat,lng,cost])=>({name,lat,lng,cost}));

const mfgData = [
['SmartLam North America — Columbia Falls, MT',48.3725,-114.1810],['DR Johnson Wood — Riddle, OR',42.9504,-123.3645],['Vaagen Timbers — Colville, WA',48.5466,-117.9055],['Katerra Legacy CLT — Spokane Valley, WA',47.6732,-117.2394],['Freres Engineered Wood — Lyons, OR',44.7740,-122.6076],['Mercer Mass Timber — Conway, AR',35.0887,-92.4335],['Timberlab — Greenville, SC',34.8526,-82.3940],['Sterling Structural — Lufkin, TX',31.3382,-94.7291],['Boise Cascade Engineered Wood — Boise, ID',43.6150,-116.2023],['Rosboro Laminated — Springfield, OR',44.0462,-123.0220],['Weyerhaeuser Engineered Wood — Tacoma, WA',47.2529,-122.4443],['Binderholz North America — Live Oak, FL',30.2949,-82.9840],['Hasslacher Norica USA — Nashville, TN',36.1627,-86.7816],['International Beams — Myrtle Creek, OR',43.0207,-123.2928],['Structurlam Legacy — Okanogan, WA',48.3620,-119.5836],['Western Archrib — Edmonton, AB',53.5461,-113.4938],['Nordic Structures — Chibougamau, QC',49.9169,-74.3659],['Element5 — St. Thomas, ON',42.7778,-81.1824],['Mass Timber Services — Portland, OR',45.5152,-122.6784],['Seagate Structures — Idaho Falls, ID',43.4917,-112.0339]
].map(([name,lat,lng])=>({name,lat,lng}));

const buildingTypes = ['education','recreational','gymnasium','library','office','residential','healthcare','hospitality','mixed-use','laboratory','warehouse','retail','airport-terminal','transit-hub','justice-courthouse','religious','museum','data-center','manufacturing'];
const marketCost = {
  education:[355,335,328], recreational:[395,360,350], gymnasium:[385,352,342], library:[390,355,345], office:[380,350,338], residential:[340,320,315], healthcare:[460,430,420], hospitality:[410,385,375], 'mixed-use':[405,380,368], laboratory:[470,445,430], warehouse:[245,230,225], retail:[320,305,295], 'airport-terminal':[520,500,470], 'transit-hub':[440,420,395], 'justice-courthouse':[430,410,390], religious:[340,325,315], museum:[465,438,418], 'data-center':[510,480,455], manufacturing:[280,265,255]
};
const districtRules = {
  'Austin, TX':{maxStories:5,maxHeightFt:85,requiredIBC:['IBC 2021','IBC 2024'],energy:['IECC 2021','IECC 2024']},
  'Houston, TX':{maxStories:6,maxHeightFt:95,requiredIBC:['IBC 2018','IBC 2021'],energy:['IECC 2021']},
  'Dallas, TX':{maxStories:6,maxHeightFt:95,requiredIBC:['IBC 2021'],energy:['IECC 2021']},
  'San Antonio, TX':{maxStories:5,maxHeightFt:85,requiredIBC:['IBC 2021'],energy:['IECC 2021']},
  default:{maxStories:6,maxHeightFt:100,requiredIBC:['IBC 2018','IBC 2021','IBC 2024'],energy:['IECC 2018','IECC 2021','IECC 2024','ASHRAE 90.1-2019']}
};

const speciesFactors = {'douglas-fir':{density:0.53,seq:-760,f:1},'spruce-pine-fir':{density:0.46,seq:-690,f:0.96},'southern-yellow-pine':{density:0.57,seq:-780,f:1.04},'hemlock-fir':{density:0.49,seq:-710,f:0.99}};
const transportFactors = {truck:0.11,rail:0.03,ship:0.015,multimodal:0.055};

const schema = z ? z.object({projectName:z.string().min(1),grossAreaFt2:z.coerce.number().min(0),stories:z.coerce.number().min(0),cltUsePercent:z.coerce.number().min(0).max(100)}) : null;

function validateInputs(fd) {
  if (schema) {
    return schema.safeParse({
      projectName: fd.get('projectName'),
      grossAreaFt2: fd.get('grossAreaFt2') || 0,
      stories: fd.get('stories') || 0,
      cltUsePercent: fd.get('cltUsePercent') || 0,
    });
  }
  const name = String(fd.get('projectName') || '').trim();
  if (!name) return { success: false, error: { issues: [{ message: 'Project name is required.' }] } };
  return { success: true };
}

const map = L.map('map', { fullscreenControl: true }).setView([31,-99],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(map);
const mfgMarker = L.marker([48.3725,-114.181],{draggable:true}).addTo(map);
const siteMarker = L.marker([30.2672,-97.7431],{draggable:true}).addTo(map);
const route = L.polyline([mfgMarker.getLatLng(),siteMarker.getLatLng()],{color:'#1f68ff',weight:3}).addTo(map);

let carbonChart,costChart,mixChart,riskChart,schoolFacts={five:0,ten:0,avgEnroll:0};


function withTimeout(promise, ms = 4500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out')), ms)),
  ]);
}

const byId = (id)=>document.getElementById(id);
const btn = {site:byId('site-lookup-btn'), est:byId('estimate-btn'), opt:byId('optional-toggle'), ors:byId('ors-route-btn'), mapillary:byId('mapillary-btn'), cesium:byId('cesium-btn'), pdf:byId('export-pdf-btn')};

const num = (fd,k,d=0)=>{const r=fd.get(k); const n=Number(r); return (r===''||r==null||!Number.isFinite(n))?d:n;};
const parseFtIn = (s)=>{if(!s) return 0; const m=s.match(/(\d+)\s*'\s*(\d+)?/); return m?Number(m[1])+Number(m[2]||0)/12:0;};
const miles = (a,b)=>{const rad=(d)=>d*Math.PI/180; const R=3958.8; const dLat=rad(b.lat-a.lat), dLng=rad(b.lng-a.lng); const x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(x));};

function populate() {
  projectCitySelect.innerHTML = cityData.map((c,i)=>`<option value="${i}">${c.name}</option>`).join('');
  manufacturerSelect.innerHTML = mfgData.map((m,i)=>`<option value="${i}">${m.name}</option>`).join('');
  buildingTypeSelect.innerHTML = buildingTypes.map((t)=>`<option value="${t}">${t.replace(/-/g,' ').replace(/\b\w/g,(x)=>x.toUpperCase())}</option>`).join('');
  buildingTypeSelect.value='gymnasium';
}

function autoSuggestCosts() {
  const t = form.elements.buildingType.value;
  const c = cityData[Number(projectCitySelect.value)] || cityData[0];
  const [timber,steel,concrete] = marketCost[t] || marketCost.education;
  if (!form.elements.timberCostPerFt2.value) form.elements.timberCostPerFt2.value = Math.round(timber*c.cost);
  if (!form.elements.steelCostPerFt2.value) form.elements.steelCostPerFt2.value = Math.round(steel*c.cost);
  if (!form.elements.concreteCostPerFt2.value) form.elements.concreteCostPerFt2.value = Math.round(concrete*c.cost);
}

function syncMap() {
  const city = cityData[Number(projectCitySelect.value)] || cityData[0];
  const m = mfgData[Number(manufacturerSelect.value)] || mfgData[0];
  siteMarker.setLatLng([city.lat, city.lng]);
  mfgMarker.setLatLng([m.lat, m.lng]);
  map.fitBounds(L.latLngBounds([siteMarker.getLatLng(), mfgMarker.getLatLng()]), {padding:[40,40]});
  updateDistance();
  autoSuggestCosts();
}

function updateDistance() {
  route.setLatLngs([mfgMarker.getLatLng(), siteMarker.getLatLng()]);
  const d = miles(mfgMarker.getLatLng(), siteMarker.getLatLng());
  distanceLabel.textContent = `${d.toFixed(0)} mi`;
  if (window.SunCalc) {
    const t = SunCalc.getTimes(new Date(), siteMarker.getLatLng().lat, siteMarker.getLatLng().lng);
    solarPeakEl.textContent = t.solarNoon ? t.solarNoon.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : 'N/A';
  } else {
    solarPeakEl.textContent = 'N/A';
  }
  return d;
}

function estimate(fd) {
  const type = fd.get('buildingType') || 'education';
  const occ = num(fd,'occupancy',700);
  const perPerson = ({gymnasium:120,recreational:145,library:160,education:120,office:140,residential:320,healthcare:240}[type]) || 150;
  const gross = num(fd,'grossAreaFt2',0) || occ * perPerson;
  const stories = num(fd,'stories',0) || Math.max(1,Math.round(gross/28000));
  const plate = num(fd,'floorPlateFt2',0) || gross/stories;
  const h = parseFtIn(fd.get('heightFtIn')) || stories*14;
  return {gross,stories,plate,height:h,clt:num(fd,'cltFt3',0)||gross*0.8,glu:num(fd,'glulamFt3',0)||gross*0.2,lvl:num(fd,'lvlFt3',0)||gross*0.06,nlt:num(fd,'nltFt3',0)||gross*0.04,dlt:num(fd,'dltFt3',0)||gross*0.03};
}

function complianceCheck(fd, est) {
  const city = cityData[Number(projectCitySelect.value)]?.name;
  const rule = districtRules[city] || districtRules.default;
  const flags = [];
  if (est.stories > rule.maxStories) flags.push(`Stories exceed district guideline (${rule.maxStories} max).`);
  if (est.height > rule.maxHeightFt) flags.push(`Height exceeds district guideline (${rule.maxHeightFt} ft max).`);
  if (!rule.requiredIBC.includes(fd.get('ibcVersion'))) flags.push('Selected IBC not preferred by local district guideline.');
  if (!rule.energy.includes(fd.get('energyCode'))) flags.push('Selected energy code differs from preferred district guideline.');
  const score = Math.max(0, 100 - flags.length * 22);
  return {score, flags, rule};
}

async function fetchSchoolsByRadius(lat,lng,mi) {
  const url = `https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Public_Schools/FeatureServer/0/query?f=json&geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=${mi}&units=esriSRUnit_StatuteMile&outFields=ENROLLMENT&returnGeometry=false`;
  const res = await fetch(url);
  const data = await res.json();
  const features = data?.features || [];
  const enroll = features.map((f)=>Number(f.attributes?.ENROLLMENT||0)).filter(Boolean);
  const avg = enroll.length ? enroll.reduce((a,b)=>a+b,0)/enroll.length : 0;
  return {count:features.length, avg};
}

async function updateSchoolFacts() {
  try {
    const s = siteMarker.getLatLng();
    const five = await withTimeout(fetchSchoolsByRadius(s.lat,s.lng,5));
    const ten = await withTimeout(fetchSchoolsByRadius(s.lat,s.lng,10));
    schoolFacts = {five:five.count, ten:ten.count, avgEnroll: ten.avg};
  } catch {
    schoolFacts = {five:0, ten:0, avgEnroll:0};
  }
}

async function geocodeSite(q) {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`, {headers:{'Accept-Language':'en-US'}});
  const d = await r.json();
  if (!d?.length) throw new Error('No result found');
  return {lat:Number(d[0].lat), lng:Number(d[0].lon), display:d[0].display_name};
}

async function orsMiles(key) {
  const a=mfgMarker.getLatLng(), b=siteMarker.getLatLng();
  const r=await fetch('https://api.openrouteservice.org/v2/directions/driving-car',{method:'POST',headers:{'Content-Type':'application/json',Authorization:key},body:JSON.stringify({coordinates:[[a.lng,a.lat],[b.lng,b.lat]]})});
  const d=await r.json();
  const m=d?.routes?.[0]?.summary?.distance; if(!m) throw new Error('No route result');
  return m*0.000621371;
}

function calculate(fd, routeMiles) {
  const est = estimate(fd);
  const species = speciesFactors[fd.get('timberSpecies')] || speciesFactors['douglas-fir'];
  const waste = num(fd,'wasteFactor',0)/100;
  const cltShare = num(fd,'cltUsePercent',0)/100;
  const totalFt3=(est.clt+est.glu+est.lvl+est.nlt+est.dlt)*(1+waste);
  const totalM3=totalFt3*0.0283168;
  const mass=totalM3*species.density;
  const grid=num(fd,'gridIntensity',0.32), renew=num(fd,'renewableShare',35)/100, fire=num(fd,'fireRating',2);
  const complexity=1+est.height/400+fire*0.02;
  const transport=transportFactors[fd.get('transportMode')]||0.11;

  const carbonTimber = totalM3*115*species.f + mass*routeMiles*transport + est.gross*0.85*grid*(1-renew) + totalM3*species.seq;
  const carbonSteel = est.gross*22*complexity + routeMiles*180;
  const carbonConcrete = est.gross*14*complexity + routeMiles*120;

  const city = cityData[Number(projectCitySelect.value)] || cityData[0];
  const costT = num(fd,'timberCostPerFt2',365), costS=num(fd,'steelCostPerFt2',340), costC=num(fd,'concreteCostPerFt2',330);
  const timberCost = est.gross*costT*city.cost, steelCost=est.gross*costS*city.cost, concreteCost=est.gross*costC*city.cost;

  return {est, complexity, cltShare, carbon:{timber:carbonTimber,steel:carbonSteel,concrete:carbonConcrete}, cost:{timber:timberCost,steel:steelCost,concrete:concreteCost}, transportImpact: mass*routeMiles*transport};
}

function fmtKg(v){return `${Math.round(v).toLocaleString()} kg CO₂e`;}
function fmtMoney(v){return `$${Math.round(v).toLocaleString()}`;}

function drawCharts(res, compliance) {
  if (!window.Chart) return;
  const make = (id)=>document.getElementById(id);
  carbonChart?.destroy(); costChart?.destroy(); mixChart?.destroy(); riskChart?.destroy();

  carbonChart = new Chart(make('carbon-canvas'), {type:'bar',data:{labels:['Timber','Steel','Concrete'],datasets:[{data:[res.carbon.timber,res.carbon.steel,res.carbon.concrete],backgroundColor:['#13a360','#d84a4a','#ea8a2a'],borderRadius:8}]},options:{plugins:{legend:{display:false}}}});
  costChart = new Chart(make('cost-canvas'), {type:'line',data:{labels:['Timber','Steel','Concrete'],datasets:[{data:[res.cost.timber,res.cost.steel,res.cost.concrete],borderColor:'#376bff',backgroundColor:'rgba(55,107,255,0.18)',fill:true,tension:.35}]},options:{plugins:{legend:{display:false}}}});
  mixChart = new Chart(make('mix-canvas'), {type:'radar',data:{labels:['CLT','Glulam','LVL','NLT','DLT'],datasets:[{data:[res.est.clt,res.est.glu,res.est.lvl,res.est.nlt,res.est.dlt],borderColor:'#1f68ff',backgroundColor:'rgba(31,104,255,.18)'}]},options:{plugins:{legend:{display:false}}}});
  riskChart = new Chart(make('risk-canvas'), {type:'doughnut',data:{labels:['Compliance Score','Gap'],datasets:[{data:[compliance.score,100-compliance.score],backgroundColor:['#13a360','#f2c9c9']}]},options:{plugins:{legend:{position:'bottom'}}}});
}

function renderReportGrid(res, compliance) {
  const carbonIntensity = res.carbon.timber / Math.max(res.est.gross,1);
  const costIntensity = res.cost.timber / Math.max(res.est.gross,1);
  const pctVsSteel = ((res.carbon.steel - res.carbon.timber) / Math.max(res.carbon.steel,1)) * 100;
  const transportPct = (res.transportImpact / Math.max(Math.abs(res.carbon.timber),1)) * 100;

  const cards = [
    ['Carbon Intensity', `${carbonIntensity.toFixed(2)} kgCO₂e/ft²`],
    ['Cost Intensity', `${costIntensity.toFixed(2)} $/ft²`],
    ['Reduction vs Steel', `${pctVsSteel.toFixed(1)}%`],
    ['Transport Impact', `${transportPct.toFixed(1)}% of timber carbon`],
    ['5-mile Public Schools', schoolFacts.five.toLocaleString()],
    ['10-mile Public Schools', schoolFacts.ten.toLocaleString()],
    ['Avg Nearby School Enrollment', schoolFacts.avgEnroll ? Math.round(schoolFacts.avgEnroll).toLocaleString() : 'N/A'],
    ['Compliance Score', `${compliance.score}/100`],
    ['District Max Stories', compliance.rule.maxStories],
    ['District Max Height', `${compliance.rule.maxHeightFt} ft`],
  ];
  reportGrid.innerHTML = cards.map(([k,v])=>`<article class="report-card"><p>${k}</p><h4>${v}</h4></article>`).join('');
}

function renderFunAndSuggestions(fd,res,compliance) {
  const pname = fd.get('projectName') || 'Project';
  const btype = fd.get('buildingType');
  const saved = Math.max(0, res.carbon.steel - res.carbon.timber);
  const cars = saved / 0.404;
  const treeYears = saved / 21;
  funFacts.innerHTML = `<strong>Project Fun Facts (${pname})</strong><br>• For this ${btype.replace(/-/g,' ')} scenario, carbon savings vs steel are like avoiding <strong>${Math.round(cars).toLocaleString()}</strong> car miles.<br>• Equivalent to roughly <strong>${Math.round(treeYears).toLocaleString()}</strong> tree-year sequestration credits.<br>• Within 5 miles: <strong>${schoolFacts.five}</strong> public schools; within 10 miles: <strong>${schoolFacts.ten}</strong>.`;

  const recs = [];
  if (res.cltShare < 0.55) recs.push('Increase CLT share toward ~55–70% to improve timber carbon performance.');
  if (res.transportImpact > Math.abs(res.carbon.timber)*0.15) recs.push('Consider nearer fabrication facility or rail mode to reduce logistics impact.');
  if (compliance.flags.length) recs.push('Resolve district/code flags before SD milestone to reduce redesign risk.');
  if (num(fd,'renewableShare',0) < 30) recs.push('Target >30% renewable fabrication energy for lower embodied emissions.');
  if (num(fd,'wasteFactor',0) > 8) recs.push('Improve prefabrication planning to reduce waste below 8%.');
  if (!recs.length) recs.push('Current assumptions are balanced. Next step: verify with supplier EPD and district manual alignment.');

  recommendationsEl.innerHTML = `<strong>Design Suggestions</strong><ul>${recs.map((r)=>`<li>${r}</li>`).join('')}</ul>`;
}

async function submit(event){
  event.preventDefault();
  const fd = new FormData(form);
  try {
  const valid = validateInputs(fd);
  if(!valid.success){resultsSummary.innerHTML=`<strong>Validation error:</strong> ${valid.error.issues[0].message}`;return;}

  const d = updateDistance();
  await updateSchoolFacts();
  const res = calculate(fd,d);
  const comp = complianceCheck(fd,res.est);

  timberTotal.textContent = fmtKg(res.carbon.timber);
  const dS = res.carbon.steel - res.carbon.timber, dC = res.carbon.concrete - res.carbon.timber;
  steelSavings.textContent = `${Math.round(Math.abs(dS)).toLocaleString()} kg ${dS>=0?'lower':'higher'}`;
  concreteSavings.textContent = `${Math.round(Math.abs(dC)).toLocaleString()} kg ${dC>=0?'lower':'higher'}`;
  timberCostEl.textContent = fmtMoney(res.cost.timber);
  complianceScoreEl.textContent = `${comp.score}/100`;

  drawCharts(res, comp);
  renderReportGrid(res, comp);
  renderFunAndSuggestions(fd,res,comp);

  resultsSummary.innerHTML = `<p><strong>${fd.get('projectName')}</strong> modeled at <strong>${Math.round(res.est.gross).toLocaleString()} ft²</strong>.</p><p>Timber carbon <strong>${fmtKg(res.carbon.timber)}</strong>, steel <strong>${fmtKg(res.carbon.steel)}</strong>, concrete <strong>${fmtKg(res.carbon.concrete)}</strong>.</p><p>Timber cost <strong>${fmtMoney(res.cost.timber)}</strong> with market-aligned auto-cost assumptions.</p>${comp.flags.length?`<p><strong>Code flags:</strong> ${comp.flags.join(' ')}</p>`:'<p><strong>Code review:</strong> No district guideline flags detected.</p>'}`;
  assumptions.innerHTML = `Route ${d.toFixed(1)} mi • Complexity ${res.complexity.toFixed(2)} • CLT share ${Math.round(res.cltShare*100)}% • Optional blanks were estimated as needed.`;
  } catch (err) {
    resultsSummary.innerHTML = `<p><strong>Report generation error:</strong> ${err.message}</p>`;
  }
}

btn.site.addEventListener('click', async ()=>{
  const q=form.elements.siteQuery.value.trim(); if(!q) return;
  try{const f=await geocodeSite(q); siteMarker.setLatLng([f.lat,f.lng]); map.panTo([f.lat,f.lng]); resultsSummary.innerHTML=`<p><strong>Site found:</strong> ${f.display}</p>`; updateDistance();}
  catch(e){resultsSummary.innerHTML=`<p><strong>Lookup failed:</strong> ${e.message}</p>`;}
});

btn.est.addEventListener('click', ()=>{
  const e=estimate(new FormData(form));
  form.elements.grossAreaFt2.value=Math.round(e.gross);
  form.elements.floorPlateFt2.value=Math.round(e.plate);
  form.elements.stories.value=Math.round(e.stories);
  form.elements.heightFtIn.value=`${Math.floor(e.height)}' ${Math.round((e.height%1)*12)}"`;
  form.elements.cltFt3.value=Math.round(e.clt);
  form.elements.glulamFt3.value=Math.round(e.glu);
  form.elements.lvlFt3.value=Math.round(e.lvl);
  form.elements.nltFt3.value=Math.round(e.nlt);
  form.elements.dltFt3.value=Math.round(e.dlt);
  autoSuggestCosts();
});

let optionalHidden=false;
btn.opt.addEventListener('click', ()=>{optionalHidden=!optionalHidden; form.classList.toggle('optional-hidden', optionalHidden);});

btn.ors.addEventListener('click', async ()=>{
  const key=form.elements.orsApiKey.value.trim(); if(!key){resultsSummary.innerHTML='<p><strong>ORS:</strong> add an API key.</p>'; return;}
  try{const m=await orsMiles(key); distanceLabel.textContent=`${m.toFixed(0)} mi`; resultsSummary.innerHTML=`<p><strong>ORS route distance:</strong> ${m.toFixed(1)} mi.</p>`;}
  catch(e){resultsSummary.innerHTML=`<p><strong>ORS failed:</strong> ${e.message}</p>`; updateDistance();}
});

btn.mapillary.addEventListener('click', ()=>{
  const t=form.elements.mapillaryToken.value.trim();
  const s=siteMarker.getLatLng();
  imageryPanel.innerHTML=t?`Open street imagery: <a href="https://www.mapillary.com/app/?lat=${s.lat}&lng=${s.lng}&z=16" target="_blank" rel="noreferrer">Mapillary Viewer</a>`:'Add token, then click again for street imagery link.';
});

btn.cesium.addEventListener('click', ()=>{
  const t=form.elements.cesiumToken.value.trim(), tiles=form.elements.tilesetUrl.value.trim(), col=form.elements.colladaUrl.value.trim();
  cesiumPanel.innerHTML=`Cesium setup: ${t?'token set':'token missing'} • tiles: ${tiles||'none'} • collada: ${col||'none'}`;
});

btn.pdf.addEventListener('click', async ()=>{
  const canvas=await html2canvas(document.querySelector('.panel:last-child')); const img=canvas.toDataURL('image/png');
  const pdf=new window.jspdf.jsPDF('p','mm','a4'); const w=190; const h=(canvas.height*w)/canvas.width; pdf.addImage(img,'PNG',10,10,w,Math.min(h,270)); pdf.save('mass-timber-report.pdf');
});

form.addEventListener('submit', submit);
projectCitySelect.addEventListener('change', syncMap);
manufacturerSelect.addEventListener('change', syncMap);
buildingTypeSelect.addEventListener('change', autoSuggestCosts);
mfgMarker.on('dragend', updateDistance);
siteMarker.on('dragend', updateDistance);

populate();
projectCitySelect.value='3';
manufacturerSelect.value='0';
syncMap();
if (!z) { resultsSummary.innerHTML = '<p><strong>Note:</strong> Zod validation library did not load. Running with basic validation fallback.</p>'; }
