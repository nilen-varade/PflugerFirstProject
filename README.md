# Mass Timber Carbon Studio Ultra++

A friendly but professional conceptual calculator for mass timber embodied carbon and cost benchmarking.

## New in this version

- **20 timber manufacturers** with populated fabrication facility coordinates.
- **50+ project cities** including a broad set of major Texas cities.
- **18 building types** (10+ added from common construction sectors).
- Optional parameters are now **blank by default** (not zero), with estimations applied only when needed.
- Improved UI clarity for dropdown-driven workflows and quantity inputs.
- Leaflet **fullscreen** map integration.
- ArcGIS Open Data integration path + ArcGIS public schools query for location-based school comparison facts.
- Seamless integration links for ORS, Mapillary, Cesium ion, and ArcGIS data search.
- Zod validation, SunCalc context, Chart.js interactive report charts, and PDF export.

## Run

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Notes

- This is an early-stage planning tool and should be calibrated with project-specific EPD/LCA data for formal reporting.
- ArcGIS school layer availability can vary by service uptime and data publication status.
