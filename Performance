# Portfolio Performance Optimization Roadmap

This document outlines the strategy to optimize the Brion Portfolio from its current baseline (FCP: 2.8s, TBT: 490ms) to a high-performance state. The ultimate goal is a **100/100/100/100 Lighthouse score**.

---

## Current Baseline (Lighthouse)

| Metric | Value |
|---|---|
| First Contentful Paint (FCP) | 2.8s |
| Largest Contentful Paint (LCP) | 2.8s |
| Total Blocking Time (TBT) | 490ms |
| Cumulative Layout Shift (CLS) | 0 |
| Speed Index | 4.6s |

---

## Phase 0: Data Collection & Goal Setting
> **Priority: Critical** — Establish a scientific baseline and automated monitoring to ensure "Performance Regression" is impossible.

| Task ID | Description | Effort | Impact | Status |
|---|---|---|---|---|
| DC-0.1 | **Automated Lighthouse CI:** Integrate Lighthouse CI into GitHub Actions to run on every Pull Request. | Medium | High | [ ] |
| DC-0.2 | **Performance Budget:** Define a `budget.json` (e.g., max JS bundle < 200KB, max FCP < 1.2s). | Low | Med | [ ] |
| DC-0.3 | **Web Vitals Tracking:** Implement `web-vitals` library to log real-user metrics (RUM) in production. | Low | Med | [ ] |
| DC-0.4 | **Bundle Analysis:** Set up `rollup-plugin-visualizer` to identify "heavy hitters" in the dependency tree. | Low | High | [ ] |

---

## Phase 1: Critical Path & Bundle Size
> **Priority: High** — Reduce FCP/LCP and stop render-blocking.

| Task ID | Description | Effort | Impact | Status |
|---|---|---|---|---|
| BP-1.1 | **Lazy Load 3D Engine:** Move `Experience` instantiation to a dynamic `await import()` inside `onMounted`. | Low | High | [ ] |
| BP-1.2 | **Tree-shake Three.js:** Replace `import * as THREE` with named imports (e.g., `{ Scene, Vector3 }`). | Medium | Med | [ ] |
| BP-1.3 | **Manual Chunking:** Update `vite.config.ts` to separate `three` and `vue` into specific vendor chunks. | Low | Med | [ ] |
| BP-1.4 | **Dependency Cleanup:** Remove redundant `scss` package from `devDependencies`. | Low | Low | [ ] |

---

## Phase 2: Runtime Efficiency & Memory
> **Priority: High** — Fix jank and reduce TBT by optimizing the Main Thread.

| Task ID | Description | Effort | Impact | Status |
|---|---|---|---|---|
| RT-2.1 | **Vector Scratchpads:** Remove `.clone()` and `new Vector3()` from Boid loop. Use static reused variables. | Medium | High | [ ] |
| RT-2.2 | **Object Pooling:** Pre-allocate `THREE.Sphere` for Octree queries outside the `tick()` function. | Medium | Med | [ ] |
| RT-2.3 | **DOM Throttling:** Update Debug Panel `innerHTML` once every 10–20 frames instead of every frame. | Low | Med | [ ] |
| RT-2.4 | **Event Lifecycle:** Implement `destroy()` in `Experience` to remove `window` resize listeners. | Low | Low | [ ] |

---

## Phase 3: GPU & Rendering Optimization
> **Priority: Medium** — Maximize FPS and reduce CPU usage during animation.

| Task ID | Description | Effort | Impact | Status |
|---|---|---|---|---|
| GPU-3.1 | **Instanced Mesh:** Refactor 450 Boid meshes into a single `THREE.InstancedMesh`. | High | High | [ ] |
| GPU-3.2 | **Compositor Layers:** Add `contain: strict` or `will-change: transform` to the Canvas CSS. | Low | Low | [ ] |
| GPU-3.3 | **Web Workers:** Offload Boid/Octree calculations to a Worker thread to hit 0ms TBT. | High | High | [ ] |

---

## Implementation Notes

### The Scratchpad Pattern *(Fix for RT-2.1)*
Avoid memory allocation in the tick loop:

```ts
// Do this:
private static _tempVec = new THREE.Vector3();

// ... inside loop
_tempVec.copy(this.position).sub(other.position);
```

### Dynamic Importing *(Fix for BP-1.1)*
Allow the UI to render before loading heavy assets:

```ts
onMounted(async () => {
  const { Experience } = await import("@/lib/threejs");
  experience.value = new Experience(...);
});
```

---

## Success Metrics

- [ ] Lighthouse Score: **100/100/100/100**
- [ ] FCP < 1.2s
- [ ] TBT < 100ms
- [ ] LCP < 1.5s
- [ ] 0 Memory Leaks *(detected via Chrome Memory tab)*
