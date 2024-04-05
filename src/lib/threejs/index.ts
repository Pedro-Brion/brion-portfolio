// @ts-nocheck
import * as THREE from "three";
import { Sizes } from "./sizes";
import { Colors } from "@/theme/Colors";
import { type Theme } from "./types";

export const Experience = class {
  canvas: HTMLElement;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock?: THREE.Clock;
  scene?: THREE.Scene;
  cube?: THREE.Mesh;

  theme: Theme;

  constructor(canvas: HTMLElement, theme: Theme) {
    this.canvas = canvas;
    this.camera = new THREE.PerspectiveCamera(75, Sizes.aspectRatio, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    this.theme = theme;
    this.initialize();
  }

  initialize() {
    this.scene = new THREE.Scene();

    this.camera.position.set(0, 2, 3);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    const cubeColor =
      this.theme === "dark" ? Colors.primaryLight : Colors.primaryDark;

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1.01, 1.01, 1.01, 2, 2, 2),
      new THREE.MeshBasicMaterial({
        color: cubeColor,
        transparent: true,
        opacity: 0.6,
      })
    );

    this.scene.add(this.cube);

    this.renderer.setSize(Sizes.width, Sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.renderer.render(this.scene, this.camera);
    window.addEventListener("resize", this.resizeRenderer);
    this.clock = new THREE.Clock();

    this.tick();
  }

  tick() {
    const elapsedTime = this.clock!.getElapsedTime();

    // Render
    this.renderer.render(this.scene!, this.camera);

    // this.cube!.rotation.z = elapsedTime * Math.PI;
    this.cube!.rotation.y = (elapsedTime * Math.PI) / 20;
    this.cube!.position.x = Math.cos((elapsedTime * Math.PI) / 10);
    this.cube!.position.z = Math.sin((elapsedTime * Math.PI) / 10);

    // Call tick again on the next frame
    window.requestAnimationFrame(() => this.tick());
  }

  changeTheme(theme: Theme) {
    this.theme = theme;
    if (theme === "dark")
      this.cube!.material.color = new THREE.Color(Colors.primaryLight);
    if (theme === "light")
      this.cube!.material.color = new THREE.Color(Colors.primaryDark);
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
};
