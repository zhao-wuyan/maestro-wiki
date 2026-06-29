# Workflow Learnings

## 2026-06-28 — M2 Phase 2 Canvas Command Recommender (EXC-002)

### Grill-driven revision replaces planning artifacts
- 14 locked decisions from `GRL-20260628-fullscreen-canvas-layout` superseded the original M1-era analysis. Executing revised `PLN-002` with grill as explicit `source_context` prevented divergence. **Lesson: when a grill locks structural decisions mid-stream, regenerate the plan against the grill rather than patching the original analysis.**

### Floating-button pattern keeps canvas pure
- Migrating detail-panel, choice buttons, and saved-routes access from persistent panels into floating triggers + popovers preserved the fullscreen canvas invariant (grill Q1.2/Q5.2). `.fullscreen-toggle` / `.scenario-label` / saved-routes floating button reuse the same absolute-positioned transparent style. **Lesson: define one floating-control style token and reuse it for every overlay entry point.**

### Viewport clipping via pure geometry
- `VIEWPORT_BUFFER` (120px) + `isVisibleNode()` virtualizes node rendering using only arithmetic (transform-mapped coords vs viewport bounds), no graphics library (grill Q5.1). **Lesson: for 2D canvas virtualization, transform-space bounding-box checks are sufficient and dependency-free; defer real graphics libs until node count exceeds ~10k.**

### Pointer gesture unification (click vs pan)
- `PAN_THRESHOLD = 4px` separates click-select from pan on pointer up. Wheel zoom + onContextMenu preventDefault complete the gesture shell without pointer-capture libraries. **Lesson: a single threshold constant + pointer-up distance check replaces most gesture-library needs for simple pan/zoom/select UIs.**

### Popover evidence cluster centralizes per-node detail
- Recommended Command card + dl(Purpose/Input/Output/Next Action) + Alternatives + Source Status + Validation Checklist all inside right-click popover (grill Q2.1/Q2.3) means the main canvas only renders frames + branch edges. `checkedItems` keyed by `${stepId}::${checkId}` survives step navigation. **Lesson: co-locate all per-node transient detail in a popover triggered by a single gesture; the canvas becomes a pure navigation surface.**

### localStorage fault-tolerance via session fallback
- Wrapping all localStorage access in try/catch with module-level `sessionStore: SavedRoute[]` fallback (grill Q5.2) kept the app functional in private-mode/quota-exceeded environments. **Lesson: always pair localStorage with an in-memory fallback of the same shape; cost is one try/catch, payoff is zero-data-loss UX in hostile storage environments.**

### Serial waves fit canvas-layer rewrites
- 4 strictly-serial waves (rule foundation → canvas shell → popover+branches → persistence) matched the dependency shape of a rendering-layer rewrite where each layer builds on prior types/state. `estimation_accuracy` (68) was weakest but serial structure absorbed the TASK-002 complexity spike. **Lesson: for UI-layer rewrites touching shared state, prefer serial waves over parallel even when tasks look independent — the shared `src/main.tsx` file creates implicit write conflicts that serial execution sidesteps.**

### vite preview port leak in e2e loops
- Each e2e smoke run (`npm run test:e2e`) spawned `vite preview` without cleanup, accumulating 13 zombie processes on ports 4173-4185. **Lesson: e2e harness scripts that spawn preview servers MUST capture the PID and kill it in a trap/finally block; otherwise long execution sessions leak listening ports and exhaust the ephemeral range.**

## 2026-06-29 — 初始场景改造 多入口场景 (EXC-canvas-start-scenario-redesign)

### ScenarioRegistry over dynamic generation for multi-entry canvas
- Analyze evaluated 3 models (ScenarioRegistry fit=4 / dynamic fit=2 / rule-routing fit=1). ScenarioRegistry won because the ScenarioModel data contract was already validated by prior TASK-002/003 (nodeLayout/activeBranches/popover all depend on it), minimizing change surface, and aligning with grill Q4.1 (data model retained). **Lesson: when extending a data-driven UI to multi-instance, prefer a registry of pre-validated data contracts over dynamic generation — the validation cost is sunk, the change surface is smallest.**

### Unified selector node beats per-scenario intent node
- Path 2 (unified selector rendering independent scenario cards in empty state) bypassed the `scenario.nodes[0]` convention risk (D/F scenarios' first node isn't necessarily an "intent" node). **Lesson: when a data convention (nodes[0]=entry) doesn't hold across all instances, decouple the empty-state selector from the data model — render an independent selector UI rather than overloading the first data node.**

### prevScenarioIdRef to skip auto-pan on scenario switch
- TASK-002's auto-pan useEffect (`[activeStepId]`) couldn't distinguish "first scenario selection" from "scenario switch", causing canvasTransform to recenter on switch (violating C-005). TASK-003 added `prevScenarioIdRef`: first selection (prev=null) updates ref + continues auto-pan; subsequent switches update ref + skip auto-pan (canvasTransform byte-identical). **Lesson: when a useEffect depends on a derived value that changes for multiple reasons (step advance vs scenario switch), use a ref to distinguish the trigger cause and selectively skip the effect.**

### Rule system "wiring layer" pattern
- recommendCommands/authoredRules/SimulatedProjectState were built in TASK-001 (prior plan) but had zero App() calls — a "wiring layer" awaiting integration. This plan's TASK-003 finally connected them via `useMemo(() => recommendCommands(simulatedProjectState))`. **Lesson: building a rule engine ahead of its UI integration is viable when the data contract is stable; the integration task then becomes a pure wiring exercise with grep-verifiable convergence (`useMemo(() => recommendCommands(`).**

### scenario-switch-toggle for in-canvas scenario switching
- After initial selection, switching scenarios required a re-entry point. Added a floating `scenario-switch-toggle` button (reusing the floating-control style token from EXC-002) that reopens the selector overlay without resetting canvasTransform. **Lesson: for multi-scenario UIs, provide a lightweight in-canvas re-entry to the selector — don't force users back through an initial empty state.**

