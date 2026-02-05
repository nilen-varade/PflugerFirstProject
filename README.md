# Mass Timber Carbon Studio Ultra+++

A professional, architect-friendly conceptual planner for mass-timber carbon and cost comparisons.

## Key upgrades

- Added **Gymnasium** building type plus broad industry types (18 total).
- Added **20 timber manufacturers** with fabrication facility coordinates.
- Added **50+ U.S. project cities**, including extensive major Texas city coverage.
- Optional inputs are blank by default; estimates are only applied when needed.
- Auto-suggested market-style material costs ($/ft²) based on building type and city cost factor.
- Added district-style compliance flags (stories/height + preferred code sets) as a practical guideline check layer.
- Added ArcGIS school proximity facts within **5-mile and 10-mile** radii near project site.
- Added richer report outputs: compliance/risk chart, expanded KPI/report cards, and design recommendations.
- Added Leaflet fullscreen control and streamlined integration links for ORS, Mapillary, Cesium, ArcGIS, and NCES.

## Run

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Notes

- This remains a conceptual planning tool and should be calibrated with project EPD/LCA workflows and local authority requirements.
- “District guideline” checks are a practical screening layer and not a legal code review substitute.
