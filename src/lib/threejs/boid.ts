import * as THREE from "three";
import { Experience } from ".";

export default class Boid {
  experience: Experience;
  mesh: THREE.Group;
  geometry: THREE.ConeGeometry;
  color: THREE.Color | number;
  cone: THREE.Mesh;
  selected: boolean = false;

  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;

  viewRange: number = 15;
  protectRange: number = 5;

  wallAvoidMag: number = 3;
  sepMag: number = 40;
  algMag: number = 35;
  cohMag: number = 25;

  constructor(
    experience: Experience,
    color?: THREE.Color,
    selected: boolean = false
  ) {
    this.selected = selected;
    this.experience = experience;
    this.color = color ?? 0xff00ff;
    this.mesh = new THREE.Group();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);

    this.geometry = new THREE.ConeGeometry(0.3, 1, 5);

    this.cone = new THREE.Mesh(
      this.geometry,
      new THREE.MeshBasicMaterial({
        color: this.color,
      })
    );
    // const boidOut = new THREE.Line(
    //   this.geometry,
    //   new THREE.LineBasicMaterial({
    //     color: 0x98a28e,
    //     linewidth: 2,
    //   })
    // );

    // this.cone.add(boidOut);

    // this.mesh.add(new THREE.AxesHelper(1));

    this.mesh.add(this.cone);
    this.cone.rotation.x = 0.5 * Math.PI;
    this.velocity.set(
      Math.random() * 30 - 15,
      Math.random() * 30 - 15,
      Math.random() * 30 - 15
    );
    this.mesh.position.set(
      Math.random() * 30 - 15,
      Math.random() * 30 - 15,
      Math.random() * 30 - 15
    );

    // this.mesh.position.x = (Math.random() - 0.5) * 5;
  }

  changeColor(color: THREE.Color) {
    //@ts-ignore
    this.cone.material.color = color;
  }

  // update(delta: number, elapsedTime: number) {
  update(delta: number, flock: Boid[]) {
    this.flock(flock);
    this.avoidWalls();
    this.getBackToView();

    this.setVelocity(delta);
    this.setPosition(delta);
    this.faceFront();
  }

  setPosition(delta: number) {
    const step = new THREE.Vector3();
    this.velocity.clampLength(0.7, 15);
    step.copy(this.velocity);
    step.multiplyScalar(delta);

    this.mesh.position.add(step);
  }

  setVelocity(delta: number) {
    const velocityStep = new THREE.Vector3().copy(this.acceleration);
    velocityStep.multiplyScalar(delta);
    this.velocity.add(velocityStep);
    this.acceleration.set(0, 0, 0);
  }

  avoidWalls() {
    const wallsLimits = [-15, 15];
    if (this.mesh.position.x <= wallsLimits[0]) {
      this.acceleration.x +=
        this.wallAvoidMag * (wallsLimits[0] - this.mesh.position.x);
    }
    if (this.mesh.position.x >= wallsLimits[1] - 10) {
      this.acceleration.x +=
        this.wallAvoidMag * (wallsLimits[1] - this.mesh.position.x);
    }
    if (this.mesh.position.y <= wallsLimits[0]) {
      this.acceleration.y +=
        this.wallAvoidMag * (wallsLimits[0] - this.mesh.position.y);
    }
    if (this.mesh.position.y >= wallsLimits[1]) {
      this.acceleration.y +=
        this.wallAvoidMag * (wallsLimits[1] - this.mesh.position.y);
    }
    if (this.mesh.position.z <= wallsLimits[0]) {
      this.acceleration.z +=
        this.wallAvoidMag * (wallsLimits[0] - this.mesh.position.z);
    }
    if (this.mesh.position.z >= wallsLimits[1]) {
      this.acceleration.z +=
        this.wallAvoidMag * (wallsLimits[1] - this.mesh.position.z);
    }
  }

  getBackToView() {
    const wallsLimits = [-40, 40];
    if (this.mesh.position.x <= wallsLimits[0]) {
      this.mesh.position.x = wallsLimits[0]
    }
    if (this.mesh.position.x >= wallsLimits[1]) {
      this.mesh.position.x = wallsLimits[1]
    }
    if (this.mesh.position.y <= wallsLimits[0]) {
      this.mesh.position.y = wallsLimits[0]
    }
    if (this.mesh.position.y >= wallsLimits[1]) {
      this.mesh.position.y = wallsLimits[1]
    }
    if (this.mesh.position.z <= wallsLimits[0]) {
      this.mesh.position.z = wallsLimits[0]
    }
    if (this.mesh.position.z >= wallsLimits[1]) {
      this.mesh.position.z = wallsLimits[1]
    }
   
  }

  flock(boids: Boid[]) {
    this.acceleration.add(this.separation(boids).multiplyScalar(this.sepMag));
    this.acceleration.add(this.alignment(boids).multiplyScalar(this.algMag));
    this.acceleration.add(this.cohersion(boids).multiplyScalar(this.cohMag));

    if (this.selected) console.log(this.acceleration);
  }

  separation(boids: Boid[]): THREE.Vector3 {
    const separationVector = new THREE.Vector3(0, 0, 0);
    let neighboursCount = 0;
    boids.forEach((boid: Boid) => {
      const d = this.mesh.position.distanceTo(boid.mesh.position);

      if (d < this.protectRange) {
        const diff = this.mesh.position.clone().sub(boid.mesh.position);
        separationVector.add(diff);
        neighboursCount++;
      }
    });

    if (neighboursCount) {
      separationVector.divideScalar(neighboursCount);
      separationVector.normalize();
    }

    return separationVector;
  }

  alignment(boids: Boid[]): THREE.Vector3 {
    const alignmentVector = new THREE.Vector3(0, 0, 0);
    let neighboursCount = 0;

    boids.forEach((boid: Boid) => {
      const d = this.mesh.position.distanceTo(boid.mesh.position);

      if (d < this.viewRange && d > this.protectRange) {
        neighboursCount++;
        alignmentVector.add(boid.velocity.clone());
      }
    });

    if (neighboursCount) {
      alignmentVector.divideScalar(neighboursCount);
      alignmentVector.normalize();
    }

    return alignmentVector;
  }

  cohersion(boids: Boid[]): THREE.Vector3 {
    const centerOfMass = new THREE.Vector3(0, 0, 0);
    let neighboursCount = 0;

    boids.forEach((boid: Boid) => {
      const d = this.mesh.position.distanceTo(boid.mesh.position);

      if (d < this.viewRange && d > this.protectRange) {
        neighboursCount++;
        centerOfMass.add(boid.mesh.position.clone());
      }
    });

    if (neighboursCount) {
      centerOfMass.divideScalar(neighboursCount);
      centerOfMass.normalize();
    }

    return centerOfMass;
  }

  faceFront() {
    const direction = this.velocity.clone();
    direction.add(this.mesh.position);
    this.mesh.lookAt(direction);
  }
}
