# Pfluger Mass Timber Calculator

A professional, architect-friendly conceptual planner for mass-timber carbon and cost comparisons.

## Key upgrades

- Added **Gymnasium** building type plus broad industry types (18 total).
- Added **20 timber manufacturers** with fabrication facility coordinates.
- Added **50+ U.S. project cities**, including extensive major Texas city coverage.
- Optional inputs are blank by default; estimates are only applied when needed.
- Auto-suggested market-style material costs ($/ft²) based on building type and city cost factor.
- Added district-style compliance flags (stories/height + preferred code sets) as a practical guideline check layer.
- Added ArcGIS school proximity facts within **5-mile and 10-mile** radii near project site.
- Added richer report outputs: compliance/risk chart, expanded KPI/report cards, design recommendations, and a prominent in-depth comparative facts section.
- Added building-system modeling (all-timber and hybrid assemblies such as steel columns + CLT deck + timber beams) to better reflect mixed-structure projects.
- Default code selections are pre-populated to 2024-ready options (IBC 2024, IFC 2024, IECC 2024), and Timberlab is pre-selected as default manufacturer.
- Improved PDF export quality with high-resolution, multi-page rendering and automatic filename based on project name.
- Improved Leaflet capture alignment during PDF export so route line/markers stay aligned with the map.
- Hardened null-safe UI rendering to avoid `Cannot set properties of null` errors and ensure report generation works with limited project input data.
- Hardened report generation with timeout/error handling so clicking **Generate Designer Report** always returns user feedback even if external APIs are slow/unavailable.
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
