# Mass Timber Carbon Studio Ultra+

Professional conceptual calculator for mass timber embodied carbon and cost comparisons against steel and concrete.

## Major capabilities

- Imperial-unit workflow (ft/in and ft²/ft³).
- Optional parameters default to **0** until project-specific data is entered.
- Hover tooltips on parameter labels for plain-language guidance.
- Expanded code selectors: older/new IBC, IFC, energy code, and local code options.
- Site lookup by address/school name (OSM geocoding).
- OpenRouteService routing distance option (API key supported).
- SunCalc integration for solar noon/position context.
- Mapillary street-level imagery launch integration.
- Cesium/3D Tiles + Collada configuration panel hooks.
- Zod validation for key input constraints.
- Interactive charts (bar/doughnut/radar) + fun facts.
- PDF report export using jsPDF + html2canvas.

## Run

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Notes

- This remains a conceptual planner and should be calibrated using project-specific EPDs and formal LCA workflows.
- For ORS, Mapillary, and Cesium production usage, provide valid API keys/tokens.
