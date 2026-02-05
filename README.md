# Mass Timber Carbon Studio Ultra

A highly detailed professional web app for mass timber embodied-carbon and cost benchmarking versus steel and concrete systems.

## What’s new

- **80+ planning parameters** across project profile, geometry, timber systems, species selection, logistics, code/risk, and cost assumptions.
- **Expanded building types** including recreation, library, healthcare, hospitality, mixed-use, and more.
- **Timber species modeling** including Douglas Fir-Larch, SPF, Southern Yellow Pine, Hemlock-Fir, and European Spruce.
- **Cost benchmarking** with market-style $/ft² inputs, escalation, contingency, soft costs, schedule acceleration, and financing impacts.
- **Auto-estimation mode** for major unknown quantities (gross area, plate, stories, height, CLT/glulam/LVL/NLT/DLT volumes).
- **Major US city + timber manufacturer datasets** synchronized with interactive map markers.
- **Comprehensive executive output** with carbon and cost deltas against steel and concrete baselines.

## Run

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Typical workflow

1. Select building type and core project assumptions.
2. Fill known values and keep optional values blank where unknown.
3. Use **Auto-estimate Quantities + Timber Volumes**.
4. Select project city and manufacturer (or drag map markers).
5. Click **Generate Comprehensive Carbon + Cost Report**.

## Important note

This is still a conceptual estimator intended for early design and planning decisions. It should be calibrated against project-specific EPDs, supplier data, and formal LCA workflows before final decision-making.
