import {
  Clock,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sizes } from "./sizes";
import { Colors } from "@/theme/Colors";
import { type Theme } from "./types";
import Boid from "./boid";
import { Octree } from "./octTree";

const NUMBER_OF_BOIDS = 450;

export class Experience {
  private _canvas: HTMLElement;
  private _camera: PerspectiveCamera;
  private _renderer: WebGLRenderer;
  private _clock?: Clock;
  private _scene?: Scene;
  private _boids: Boid[] = [];
  private _controls: OrbitControls;
  private _octree: Octree;

  private _botBoundary = new Vector3(-40, -40, -40);
  private _topBoundary = new Vector3(40, 40, 40);

  private _infoPanel: HTMLElement;
  private _debug: boolean;

  private static _boidRangeSphere: Sphere = new Sphere(
    new Vector3(0, 0, 0),
    Boid.viewRange,
  );
  private static _boidsQueried: Boid[] = [];
  private _boidsMaterial: MeshBasicMaterial;

  theme: Theme;

  currentTime: number = 0;
  previousTime: number = 0;
  elapsedTime: number = 0;
  frameCount: number = 0;

  constructor(
    canvas: HTMLElement,
    theme: Theme,
    info: HTMLElement,
    debug: boolean = false,
  ) {
    this._canvas = canvas;
    this._infoPanel = info;
    this._camera = new PerspectiveCamera(75, Sizes.aspectRatio, 0.1, 1000);
    this._renderer = new WebGLRenderer({
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
      this._camera.lookAt(new Vector3(0, 0, 0));
    } else {
      this._camera.position.set(20, 10, 20);
      this._camera.lookAt(new Vector3(20, 0, 0));
    }
    this._debug = value;
    this._controls.enabled = value;
  }

  initialize() {
    this._scene = new Scene();
    if (this._debug) {
      this._camera.position.set(0, 20, 120);
      this._camera.lookAt(new Vector3(0, 0, 0));
    } else {
      this._camera.position.set(20, 10, 20);
      this._camera.lookAt(new Vector3(20, 0, 0));
    }

    this._boidsMaterial = new MeshBasicMaterial({
      color: this.theme === "dark" ? Colors.primaryLight : Colors.primaryDark,
    });

    for (let i = 0; i < NUMBER_OF_BOIDS; i++) {
      this._boids.push(new Boid(this._boidsMaterial));
    }

    this._boids.forEach((boid) => {
      this._scene?.add(boid._mesh);
    });

    this.buildOctree();

    this.initializeRenderer();
    window.addEventListener("resize", this.resizeRenderer);
    this._clock = new Clock();

    this.tick();
  }

  buildOctree() {
    this._octree = new Octree(8, this._botBoundary, this._topBoundary);

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
    const delta = Math.min(this.currentTime - this.previousTime, 1 / 30);

    // Render
    this._renderer.render(this._scene!, this._camera);
    if (this._debug) this._controls.update();


    this._boids.forEach((boid) => {
      Experience._boidRangeSphere.center.copy(boid.position);
      Experience._boidsQueried.length = 0;
      this._octree.query(Experience._boidRangeSphere, Experience._boidsQueried);
      boid.update(delta, Experience._boidsQueried);
    });
    this.buildOctree();

    if (this.frameCount % 10 === 0) {
      if (this._debug && this._infoPanel) {
        this._infoPanel.innerHTML = `${(1 / delta).toPrecision(
          3,
        )}</br>${this.elapsedTime.toFixed(0)}</br>`;
      }
    }

    window.requestAnimationFrame(() => this.tick());
  }

  changeTheme(theme: Theme) {
    this.theme = theme;
    const color =
      this.theme === "dark" ? Colors.primaryLight : Colors.primaryDark;

    this._boidsMaterial.color.set(color);
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
