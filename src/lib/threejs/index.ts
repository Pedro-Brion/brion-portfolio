import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sizes } from "./sizes";
import { Colors } from "@/theme/Colors";
import { type Theme } from "./types";
import Boid from "./boid";
import { Octree } from "./octTree";

const NUMBER_OF_BOIDS = 450;

export class Experience {
  private _canvas: HTMLElement;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;
  private _clock?: THREE.Clock;
  private _scene?: THREE.Scene;
  private _objects: THREE.Object3D[] = [];
  private _boids: Boid[] = [];
  private _controls: OrbitControls;
  private _octree: Octree;

  private _botBoundary = new THREE.Vector3(-40, -40, -40);
  private _topBoundary = new THREE.Vector3(40, 40, 40);

  private _infoPanel: HTMLElement;
  private _debug: boolean;

  theme: Theme;

  currentTime: number = 0;
  previousTime: number = 0;
  elapsedTime: number = 0;
  frameCount: number = 0;

  constructor(
    canvas: HTMLElement,
    theme: Theme,
    info: HTMLElement,
    debug: boolean = false
  ) {
    this._canvas = canvas;
    this._infoPanel = info;
    this._camera = new THREE.PerspectiveCamera(
      75,
      Sizes.aspectRatio,
      0.1,
      1000
    );
    this._renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    this.theme = theme;

    this._debug = debug;

    this._controls = new OrbitControls(this._camera, this._canvas);
    this._controls.enableDamping = true;
    this._controls.update();

    this.initialize();
  }

  toggleDebug(value: boolean) {
    if (value) {
      this._camera.position.set(0, 20, 120);
      this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else {
      this._camera.position.set(20, 10, 20);
      this._camera.lookAt(new THREE.Vector3(20, 0, 0));
    }
    this._debug = value;
    this._controls.enabled = value;
  }

  initialize() {
    this._scene = new THREE.Scene();
    if (this._debug) {
      this._camera.position.set(0, 20, 120);
      this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else {
      this._camera.position.set(20, 10, 20);
      this._camera.lookAt(new THREE.Vector3(20, 0, 0));
    }

    const objectsColor =
      this.theme === "dark" ? Colors.primaryLight : Colors.primaryDark;

    for (let i = 0; i < NUMBER_OF_BOIDS; i++) {
      this._boids.push(new Boid(objectsColor));
    }
    // this.boids.push(new Boid("#ff00ff", true));
    this._objects.push(
      new THREE.Mesh(
        new THREE.BoxGeometry(30, 30, 30, 1, 1, 1),
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 1,
          transparent: true,
          roughness: 0,
          thickness: 0.2,
          opacity: 0.8,
        })
      )
    );

    this._boids.forEach((boid) => {
      this._scene?.add(boid._mesh);
    });

    this.buildOctree();

    this.initializeRenderer();
    window.addEventListener("resize", this.resizeRenderer);
    this._clock = new THREE.Clock();

    this.tick();
  }

  buildOctree() {
    this._octree = new Octree(4, this._botBoundary, this._topBoundary);

    this._boids.forEach((boid) => {
      this._octree.add(boid);
    });
  }

  initializeRenderer() {
    this._renderer.setSize(Sizes.width, Sizes.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.setClearColor(0x000000, 0);

    this._renderer.render(this._scene!, this._camera);
  }

  tick() {
    this.frameCount++;
    this.elapsedTime = this._clock!.getElapsedTime();
    this.previousTime = this.currentTime;
    this.currentTime = this.elapsedTime;
    const delta = this.currentTime - this.previousTime;

    // Render
    this._renderer.render(this._scene!, this._camera);
    if (this._debug) this._controls.update();

    let size = 0;

    this._boids.forEach((boid, index) => {
      const boidRange = new THREE.Sphere(boid.position, boid.viewRange);
      const boids = this._octree.query(boidRange);
      if (boid.selected) size = boids.length;
      boid.update(delta, boids);
    });

    if (this._debug && this._infoPanel) {
      if (this.frameCount % 4 === 0)
        this._infoPanel.innerHTML = `${(1 / delta).toPrecision(
          3
        )}</br>${this.elapsedTime.toFixed(0)}</br>${size}`;
    }

    window.requestAnimationFrame(() => this.tick());
  }

  changeTheme(theme: Theme) {
    this.theme = theme;
    if (theme === "dark")
      this._boids.forEach((boid) =>
        boid.changeColor(new THREE.Color(Colors.primaryLight))
      );
    if (theme === "light")
      this._boids.forEach((boid) =>
        boid.changeColor(new THREE.Color(Colors.primaryDark))
      );
  }

  resizeRenderer = () => {
    // Update sizes
    Sizes.update();
    // Update camera
    this._camera.aspect = Sizes.aspectRatio;
    this._camera.updateProjectionMatrix();

    // Update renderer
    this._renderer.setSize(Sizes.width, Sizes.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
}
