# Terminology

| Term | Definition | Code Reference | Status |
|------|------------|----------------|--------|
| Canvas | Main interaction surface where scenario and command nodes are arranged visually. | `src/main.tsx:353`, `src/styles.css:78` | open |
| Initial Node | First central node that classifies the user's task scenario before command recommendation. | new; current start is implicit in `src/main.tsx:78` | open |
| Scenario Type | Maestro-derived category such as project initialization, new requirement, source exploration, or test expansion. | `src/main.tsx:66` | open |
| Command Node | A selected command represented as a persistent node in the graph. | current `ScenarioStep.command` at `src/main.tsx:51` | open |
| Primary Command | Recommended next command for the current scenario state. | current `choices` at `src/main.tsx:60` | open |
| Secondary Command | Alternative or fallback command option shown on the node. | current `alternatives` at `src/main.tsx:61` | open |
| Detail Panel | Current right sidebar showing command details, sources, routes, and checklist. | `src/main.tsx:404`, `src/styles.css:186` | open |
| Route Map | A generated canvas path composed of selected scenario and command nodes. | new; current app has fixed `ScenarioModel.edges` at `src/main.tsx:71` | open |
| Favorite Route | A user-protected saved route map that is never overwritten by recent-history cleanup. | new; no persistence in current code | open |
