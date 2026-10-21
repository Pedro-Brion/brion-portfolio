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
| DC-0.1.2 | **Report History:** Keep every Lighthouse run published on GitHub Pages (e.g. `/<run_number>.html`) with an index page linking all runs. | Medium | Med | [ ] |
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
| BP-1.4 | **Dependency Cleanup:** Remove redundant `scss` package from `devDependencies`. | Low | Low | [X] |

---

## Phase 2: Runtime Efficiency & Memory
> **Priority: High** — Fix jank and reduce TBT by optimizing the Main Thread.

| Task ID | Description | Effort | Impact | Status |
|---|---|---|---|---|
| RT-2.1 | **Vector Scratchpads:** Remove `.clone()` and `new Vector3()` from Boid loop. Use static reused variables. | Medium | High | [X] |
| RT-2.2 | **Object Pooling:** Pre-allocate `THREE.Sphere` for Octree queries outside the `tick()` function. | Medium | Med | [X] |
| RT-2.3 | **DOM Throttling:** Update Debug Panel `innerHTML` once every 10–20 frames instead of every frame. | Low | Med | [X] |
| RT-2.4 | **Event Lifecycle:** Implement `destroy()` in `Experience` to remove `window` resize listeners. | Low | Low | [ ] |
| RT-2.5 | **Working Octree:** Rebuild the Octree every frame so queries use current positions (it was built once and never updated). | Low | High | [X] |
| RT-2.6 | **Query Output Array:** `query(sphere, out)` fills a caller-owned array and filters boids by distance, instead of spreading/merging arrays per node. | Low | High | [X] |
| RT-2.7 | **Delta Clamp:** Cap `delta` at 1/30s so a hidden tab or long frame can't fling boids out of bounds. | Low | Med | [X] |
| RT-2.8 | **Octree Node Reuse:** Clear and reuse nodes on rebuild (or switch to a uniform grid with `viewRange`-sized cells). | Medium | Med | [ ] |
| RT-2.9 | **Single-Pass Flocking:** Merge separation/alignment/cohesion into one loop over neighbours. | Low | High | [ ] |

---

## Phase 3: GPU & Rendering Optimization
> **Priority: Medium** — Maximize FPS and reduce CPU usage during animation.

| Task ID | Description | Effort | Impact | Status |
|---|---|---|---|---|
| GPU-3.1 | **Instanced Mesh:** Refactor 450 Boid meshes into a single `THREE.InstancedMesh`. | High | High | [ ] |
| GPU-3.2 | **Compositor Layers:** Add `contain: strict` or `will-change: transform` to the Canvas CSS. | Low | Low | [ ] |
| GPU-3.3 | **Web Workers:** Offload Boid/Octree calculations to a Worker thread to hit 0ms TBT. | High | High | [ ] |
| GPU-3.4 | **Shared Geometry & Material:** One `ConeGeometry` and one `MeshBasicMaterial` for all boids; theme change sets the material color in place. | Low | Med | [X] |

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

### Caller-Owned Output Array *(Fix for RT-2.6)*
Create the result array once, empty it per query, and pass it down the recursion. Nodes push into it; nothing is returned up the tree:

```ts
// once
private static _boidsQueried: Boid[] = [];

// per boid
Experience._boidsQueried.length = 0;
this._octree.query(sphere, Experience._boidsQueried);
```

Inside `query`, test each boid with `sphere.containsPoint(...)` in a plain `for` loop. `.filter()` or spreading would allocate again.

### Simulation Benchmark *(RT-2.1 – RT-2.7)*
Simulation only (no rendering), measured in Node (same V8 as Chrome): 451 boids, seeded start, 1200 frames after 300 warm-up.

| Version | Sim ms/frame | Neighbours returned / in range | GCs/s at 60fps |
|---|---|---|---|
| Before (stale Octree) | 7.7 | 95 / 399 | 111 |
| Before, Octree rebuilt every frame | 37.0 | 413 / — | 64 |
| **After RT-2.1 – RT-2.7** | **6.8** | **91 / 90** | **7.4** |

Lessons learned:
- The old version was fast only because the stale tree returned the wrong (much smaller) neighbour list.
- An Octree only helps when `viewRange` is small relative to the flock's spread. At `viewRange = 15` the flock packs tighter than the view range, so every boid sees most of the flock and the work is ~N². Flocking parameters were retuned (`viewRange` 8, `protectRange` 4) as part of this.

### Dynamic Importing *(Fix for BP-1.1)*
Allow the UI to render before loading heavy assets:

```ts
onMounted(async () => {
  const { Experience } = await import("@/lib/threejs");
  experience.value = new Experience(...);
});
```

### Report History *(Plan for DC-0.1.2)*
Each Pages deployment **replaces the whole site**, and the runner keeps nothing between runs. Renaming the report to `${{ github.run_number }}.html` alone still leaves only the latest run online.

Planned approach — store reports in a git branch:

1. Create an **orphan** branch (e.g. `lighthouse-reports`) so reports don't share history with the source code.
2. In the workflow, `actions/checkout` that branch, add the new `<run_number>.html` to it.
3. Generate an `index.html` listing every report (a static site can't list its own files).
4. Commit and push (job needs `contents: write`; set a git identity for the commit).
5. Upload the branch content with `upload-pages-artifact` and deploy as today.

Rejected alternatives: re-downloading old workflow artifacts (they expire with retention days) and fetching the live Pages site (no way to list which files exist).

Open questions to research:
- `${{ github.run_number }}` vs `$GITHUB_RUN_NUMBER` — who substitutes each, and when (script injection risk).
- How `actions/checkout` behaves when the target branch doesn't exist yet.

---

## Success Metrics

- [ ] Lighthouse Score: **100/100/100/100**
- [ ] FCP < 1.2s
- [ ] TBT < 100ms
- [ ] LCP < 1.5s
- [ ] 0 Memory Leaks *(detected via Chrome Memory tab)*
