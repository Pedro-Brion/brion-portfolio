import * as THREE from "three";
import { Experience } from ".";

export default class Boid {
  experience: Experience;
  mesh: THREE.Group;
  geometry: THREE.ConeGeometry;
  color: THREE.Color | number;
  cone: THREE.Mesh;

  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;

  constructor(experience: Experience, color?: THREE.Color) {
    this.experience = experience;
    this.color = color ?? 0xff00ff;
    this.mesh = new THREE.Group();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);

    this.geometry = new THREE.ConeGeometry(0.3, 1, 10);

    this.cone = new THREE.Mesh(
      this.geometry,
      new THREE.MeshBasicMaterial({
        color: this.color,
      })
    );
    const boidOut = new THREE.Line(
      this.geometry,
      new THREE.LineBasicMaterial({
        color: 0x98a28e,
        linewidth: 2,
      })
    );
    this.cone.add(boidOut);

    // this.mesh.add(new THREE.AxesHelper(0.5));

    this.mesh.add(this.cone);
    this.cone.rotation.x = 0.5 * Math.PI;
    this.velocity.set(
      Math.random() * 80 - 40,
      Math.random() * 80 - 40,
      Math.random() * 80 - 40
    );
    this.mesh.position.set(
      Math.random() * 80 - 40,
      Math.random() * 80 - 40,
      Math.random() * 80 - 40
    );

    // this.mesh.position.x = (Math.random() - 0.5) * 5;
  }

  changeColor(color: THREE.Color) {
    //@ts-ignore
    this.cone.material.color = color;
  }

  update(delta: number, elapsedTime: number) {
    this.avoidWalls();

    this.setVelocity(delta, elapsedTime);
    this.setPosition(delta);
    this.faceFront(delta);
  }

  setPosition(delta: number) {
    const step = new THREE.Vector3();
    this.velocity.clampLength(0.7, 10);
    step.copy(this.velocity);
    step.multiplyScalar(delta);

    this.mesh.position.add(step);
  }

  setVelocity(delta: number, elapsedTime: number) {
    this.velocity.add(this.acceleration);
    this.acceleration.set(0, 0, 0);
  }

  avoidWalls() {
    if (this.mesh.position.x >= 9) {
      if (this.mesh.position.x >= 20) this.mesh.position.x = 20;
      this.acceleration.x += -0.5;
    }
    if (this.mesh.position.x <= -49) {
      if (this.mesh.position.x <= -50) this.mesh.position.x = -50;
      this.acceleration.x += 0.5;
    }
    if (this.mesh.position.y >= 24) {
      if (this.mesh.position.y >= 25) this.mesh.position.y = 25;
      this.acceleration.y += -0.5;
    }
    if (this.mesh.position.y <= -24) {
      if (this.mesh.position.y <= -25) this.mesh.position.y = -25;
      this.acceleration.y += 0.5;
    }
    if (this.mesh.position.z >= 24) {
      if (this.mesh.position.z >= 25) this.mesh.position.z = 25;
      this.acceleration.z += -0.5;
    }
    if (this.mesh.position.z <= -24) {
      if (this.mesh.position.z <= -25) this.mesh.position.z = -25;
      this.acceleration.z += 0.5;
    }
  }

  faceFront(delta?: number) {
    const direction = this.velocity.clone();
    direction.add(this.mesh.position);
    this.mesh.lookAt(direction);
  }
}
