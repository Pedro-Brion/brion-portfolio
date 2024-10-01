import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sizes } from "./sizes";
import { Colors } from "@/theme/Colors";
import { type Theme } from "./types";
import Boid from "./boid";
import { Octree } from "./octTree";

const NUMBER_OF_BOIDS = 50;

export class Experience {
  canvas: HTMLElement;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock?: THREE.Clock;
  scene?: THREE.Scene;
  objects: THREE.Object3D[] = [];
  boids: Boid[] = [];
  controls: OrbitControls;
  octree: Octree;

  botBoundary = new THREE.Vector3(-40, -40, -40);
  topBoundary = new THREE.Vector3(40, 40, 40);

  infoPanel: HTMLElement;
  debug: boolean;

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
    this.canvas = canvas;
    this.infoPanel = info;
    this.camera = new THREE.PerspectiveCamera(75, Sizes.aspectRatio, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    this.theme = theme;

    this.debug = debug;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.update();

    this.initialize();
  }

  toggleDebug(value: boolean) {
    if (value) {
      this.camera.position.set(0, 20, 120);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else {
      this.camera.position.set(20, 10, 20);
      this.camera.lookAt(new THREE.Vector3(20, 0, 0));
    }
    this.debug = value;
    this.controls.enabled = value;
  }

  initialize() {
    this.scene = new THREE.Scene();
    if (this.debug) {
      this.camera.position.set(0, 20, 120);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else {
      this.camera.position.set(20, 10, 20);
      this.camera.lookAt(new THREE.Vector3(20, 0, 0));
    }

    const objectsColor =
      this.theme === "dark" ? Colors.primaryLight : Colors.primaryDark;

    for (let i = 0; i < NUMBER_OF_BOIDS; i++) {
      this.boids.push(new Boid(objectsColor));
    }
    // this.boids.push(new Boid(this, "#ff00ff", true));
    this.objects.push(
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

    this.boids.forEach((boid) => {
      this.scene?.add(boid._mesh);
    });
    this.buildOctree();
    this.objects.forEach((object) => this.scene?.add(object));

    this.initializeRenderer();
    window.addEventListener("resize", this.resizeRenderer);
    this.clock = new THREE.Clock();

    this.tick();
  }

  buildOctree() {
    this.octree = new Octree(6, this.botBoundary, this.topBoundary);

    this.boids.forEach((boid) => {
      this.octree.add(boid);
      this.scene?.add(boid._mesh);
    });
    this.objects.forEach((object) => this.scene?.remove(object));
    this.objects = [];

    this.objects.push(...this.octree.debugHelpers);
    this.objects.forEach((obj)=> this.scene?.add(obj))
  }

  initializeRenderer() {
    this.renderer.setSize(Sizes.width, Sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.renderer.render(this.scene!, this.camera);
  }

  tick() {
    this.frameCount++;
    this.elapsedTime = this.clock!.getElapsedTime();
    this.previousTime = this.currentTime;
    this.currentTime = this.elapsedTime;
    const delta = this.currentTime - this.previousTime;

    // Render
    this.renderer.render(this.scene!, this.camera);
    if (this.debug) this.controls.update();

    // if (this.frameCount % 4 === 0)
    //   this.infoPanel.innerHTML = `${(1 / delta).toPrecision(3)}</br>${
    //     this.frameCount
    //   }</br>${this.elapsedTime.toFixed(0)}`;

    this.boids.forEach((boid) => {
      boid.update(delta, this.boids);
    });
    this.buildOctree()

    // Call tick again on the next frame
    window.requestAnimationFrame(() => this.tick());
  }

  changeTheme(theme: Theme) {
    this.theme = theme;
    if (theme === "dark")
      this.boids.forEach((boid) =>
        boid.changeColor(new THREE.Color(Colors.primaryLight))
      );
    if (theme === "light")
      this.boids.forEach((boid) =>
        boid.changeColor(new THREE.Color(Colors.primaryDark))
      );
  }

  resizeRenderer = () => {
    // Update sizes
    Sizes.update();
    // Update camera
    this.camera.aspect = Sizes.aspectRatio;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(Sizes.width, Sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
}
