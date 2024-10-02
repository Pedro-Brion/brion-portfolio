import * as THREE from "three";
import { Octree } from "./octTree";

export default class Boid {
  readonly _mesh: THREE.Group;
  private _geometry: THREE.ConeGeometry;
  private _color: THREE.Color | number | string;
  private _cone: THREE.Mesh;

  selected: boolean = false;

  currentNode: Octree | null;

  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;

  viewRange: number = 15;
  viewRangeSquared: number = this.viewRange * this.viewRange;

  protectRange: number = 5;
  protectRangeSquared: number = this.protectRange * this.protectRange;

  wallAvoidMag: number = 10;
  sepMag: number = 40;
  algMag: number = 35;
  cohMag: number = 30;
  freeWillMag: number = 12;

  constructor(color?: Boid["_color"], selected: boolean = false) {
    this.selected = selected;
    this._color = color ?? 0xff00ff;
    this._mesh = new THREE.Group();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);

    this._geometry = new THREE.ConeGeometry(0.3, 1, 5);

    this._cone = new THREE.Mesh(
      this._geometry,
      new THREE.MeshBasicMaterial({
        color: this._color,
      })
    );

    this._mesh.add(this._cone);
    this._cone.rotation.x = 0.5 * Math.PI;
    this.velocity.set(
      Math.random() * 30 - 15,
      Math.random() * 30 - 15,
      Math.random() * 30 - 15
    );
    this.position.set(
      Math.random() * 30 - 15,
      Math.random() * 30 - 15,
      Math.random() * 30 - 15
    );

    // this.mesh.position.x = (Math.random() - 0.5) * 5;
  }

  get position() {
    return this._mesh.position;
  }

  changeColor(color: THREE.Color) {
    //@ts-ignore
    this._cone.material.color = color;
  }

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

    this.position.add(step);
  }

  setVelocity(delta: number) {
    const velocityStep = new THREE.Vector3().copy(this.acceleration);
    velocityStep.multiplyScalar(delta);
    this.velocity.add(velocityStep);
    this.acceleration.set(0, 0, 0);
  }

  avoidWalls() {
    const wallsLimits = 25;
    if (this.position.x <= -wallsLimits) {
      this.acceleration.x +=
        this.wallAvoidMag * (-wallsLimits - this.position.x);
    }
    if (this.position.x >= wallsLimits) {
      this.acceleration.x +=
        this.wallAvoidMag * (wallsLimits - this.position.x);
    }
    if (this.position.y <= -wallsLimits) {
      this.acceleration.y +=
        this.wallAvoidMag * (-wallsLimits - this.position.y);
    }
    if (this.position.y >= wallsLimits) {
      this.acceleration.y +=
        this.wallAvoidMag * (wallsLimits - this.position.y);
    }
    if (this.position.z <= -wallsLimits) {
      this.acceleration.z +=
        this.wallAvoidMag * (-wallsLimits - this.position.z);
    }
    if (this.position.z >= wallsLimits) {
      this.acceleration.z +=
        this.wallAvoidMag * (wallsLimits - this.position.z);
    }
  }

  getBackToView() {
    const wallsLimits = -80;
    if (this.position.x <= wallsLimits) {
      this.position.x = wallsLimits;
    }
    if (this.position.x >= -wallsLimits) {
      this.position.x = -wallsLimits;
    }
    if (this.position.y <= wallsLimits) {
      this.position.y = wallsLimits;
    }
    if (this.position.y >= -wallsLimits) {
      this.position.y = -wallsLimits;
    }
    if (this.position.z <= wallsLimits) {
      this.position.z = wallsLimits;
    }
    if (this.position.z >= -wallsLimits) {
      this.position.z = -wallsLimits;
    }
  }

  flock(boids: Boid[]) {
    this.acceleration.add(this.separation(boids).multiplyScalar(this.sepMag));
    this.acceleration.add(this.alignment(boids).multiplyScalar(this.algMag));
    this.acceleration.add(this.cohersion(boids).multiplyScalar(this.cohMag));
    this.acceleration.add(this.freeWill());
  }

  separation(boids: Boid[]): THREE.Vector3 {
    const separationVector = new THREE.Vector3(0, 0, 0);
    let neighboursCount = 0;
    boids.forEach((boid: Boid) => {
      const d = this.position.distanceToSquared(boid.position);

      if (d < this.protectRangeSquared) {
        const diff = this.position.clone().sub(boid.position);
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
      const d = this.position.distanceToSquared(boid.position);

      if (d < this.viewRangeSquared && d > this.protectRangeSquared) {
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
      const d = this.position.distanceToSquared(boid.position);

      if (d < this.viewRangeSquared && d > this.protectRangeSquared) {
        neighboursCount++;
        centerOfMass.add(boid.position.clone());
      }
    });

    if (neighboursCount) {
      centerOfMass.divideScalar(neighboursCount);
      centerOfMass.sub(this.position);
      centerOfMass.normalize();
    }

    return centerOfMass;
  }

  /** Random noise to simulate a living being*/
  freeWill() {
    const ranX = Math.random() * 2 - 1;
    const ranY = Math.random() * 2 - 1;
    const ranZ = Math.random() * 2 - 1;
    const noise = new THREE.Vector3(ranX, ranY, ranZ);
    return noise.normalize().multiplyScalar(this.freeWillMag);
  }

  faceFront() {
    const direction = this.velocity.clone();
    direction.add(this.position);
    this._mesh.lookAt(direction);
  }
}
