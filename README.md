# Mass Timber Carbon Emissions Calculator

A lightweight Windows-friendly web app prototype to estimate embodied carbon for mass timber projects and compare outcomes against steel and concrete structural baselines.

## What this app includes

- 20+ user-editable project parameters (geometry, material split, code context, logistics, and energy assumptions).
- Interactive Leaflet map with draggable markers for **manufacturer** and **project site**.
- Automatic route-distance estimation (great-circle approximation) used in logistics emissions.
- Carbon output for:
  - Mass timber scenario
  - Conventional steel scenario
  - Conventional concrete scenario
- Side-by-side chart and savings comparison output.

## Quick start

1. Open `index.html` in a browser.
2. Populate project fields in the form.
3. Move map markers to set manufacturer and site locations.
4. Click **Calculate Emissions**.

## Windows packaging options

This prototype is browser-based. To ship as a native Windows desktop app, package it with one of:

- **Electron** (Node-based desktop shell)
- **Tauri** (Rust-based desktop shell)
- **WebView2 wrapper**

## Notes

- Current calculations are planning-level estimates and not a replacement for detailed LCA software.
- Emission factors are transparent in `app.js` and can be updated to align with your internal benchmarks or EPD datasets.
