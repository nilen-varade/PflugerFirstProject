# Mass Timber Carbon Studio Pro

A professional, interactive web application to estimate embodied carbon for mass timber projects and benchmark against steel and concrete alternatives.

## Highlights

- Professional UI with workflow sidebar, KPI cards, grouped sections, sticky action bar, and responsive layout.
- Optional parameter support: users can leave many fields blank and rely on intelligent defaults.
- Auto-estimation engine for floor area, floor plate, height, CLT volume, and glulam volume based on building typology and occupancy.
- Auto-populated datasets for major US cities and major US timber manufacturers.
- Interactive Leaflet map synced with project city and manufacturer selection.
- Live logistics distance and carbon comparison chart.

## Run locally

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Usage flow

1. Select project typology and occupancy.
2. Keep known values, leave unknown optional values blank.
3. Use **Auto-estimate Building Quantities** when needed.
4. Select city and timber manufacturer (or drag map markers).
5. Click **Calculate Carbon Performance**.

## Windows app packaging options

- Electron
- Tauri
- WebView2 wrapper

## Notes

- This is a planning-stage estimator, not a substitute for full LCA software.
- Emissions factors and defaults are editable in `app.js`.
