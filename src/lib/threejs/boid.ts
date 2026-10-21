import { ConeGeometry, Group, Material, Mesh, Vector3 } from "three";
import { Octree } from "./octTree";

export default class Boid {
  readonly _mesh: Group;
  private static _geometry: ConeGeometry = new ConeGeometry(0.3, 1, 5);
  private _material: Material;
  private _cone: Mesh;

  selected: boolean = false;

  currentNode: Octree | null;

  velocity: Vector3;
  acceleration: Vector3;

  static viewRange: number = 8;
  static viewRangeSquared: number = this.viewRange * this.viewRange;

  static protectRange: number = 4;
  static protectRangeSquared: number = this.protectRange * this.protectRange;

  private static _scratchVector: Vector3 = new Vector3();

  static wallAvoidMag: number = 10;
  static sepMag: number = 75;
  static algMag: number = 50;
  static cohMag: number = 40;
  static freeWillMag: number = 12;

  constructor(material: Material) {
    this._mesh = new Group();
    this.velocity = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);
    this._material = material;
    this._cone = new Mesh(Boid._geometry, this._material);

    this._mesh.add(this._cone);
    this._cone.rotation.x = 0.5 * Math.PI;
    this.velocity.set(
      Math.random() * 30 - 15,
      Math.random() * 30 - 15,
      Math.random() * 30 - 15,
    );
    this.position.set(
      Math.random() * 30 - 15,
      Math.random() * 30 - 15,
      Math.random() * 30 - 15,
    );
  }

  get position() {
    return this._mesh.position;
  }

  changeColor(material: Material) {
    this._cone.material = material;
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
    this.velocity.clampLength(0.7, 15);

    this.position.addScaledVector(this.velocity, delta);
  }

  setVelocity(delta: number) {
    this.velocity.addScaledVector(this.acceleration, delta);
    this.acceleration.set(0, 0, 0);
  }

  avoidWalls() {
    const wallsLimits = 25;
    if (this.position.x <= -wallsLimits) {
      this.acceleration.x +=
        Boid.wallAvoidMag * (-wallsLimits - this.position.x);
    }
    if (this.position.x >= wallsLimits) {
      this.acceleration.x +=
        Boid.wallAvoidMag * (wallsLimits - this.position.x);
    }
    if (this.position.y <= -wallsLimits) {
      this.acceleration.y +=
        Boid.wallAvoidMag * (-wallsLimits - this.position.y);
    }
    if (this.position.y >= wallsLimits) {
      this.acceleration.y +=
        Boid.wallAvoidMag * (wallsLimits - this.position.y);
    }
    if (this.position.z <= -wallsLimits) {
      this.acceleration.z +=
        Boid.wallAvoidMag * (-wallsLimits - this.position.z);
    }
    if (this.position.z >= wallsLimits) {
      this.acceleration.z +=
        Boid.wallAvoidMag * (wallsLimits - this.position.z);
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
    this.acceleration.add(this.separation(boids).multiplyScalar(Boid.sepMag));
    this.acceleration.add(this.alignment(boids).multiplyScalar(Boid.algMag));
    this.acceleration.add(this.cohersion(boids).multiplyScalar(Boid.cohMag));
    this.acceleration.add(this.freeWill());
  }

  separation(boids: Boid[]): Vector3 {
    Boid._scratchVector.set(0, 0, 0);
    let neighboursCount = 0;
    boids.forEach((boid: Boid) => {
      const d = this.position.distanceToSquared(boid.position);

      if (d < Boid.protectRangeSquared) {
        Boid._scratchVector.add(this.position).sub(boid.position);
        neighboursCount++;
      }
    });

    if (neighboursCount) {
      Boid._scratchVector.divideScalar(neighboursCount);
      Boid._scratchVector.normalize();
    }

    return Boid._scratchVector;
  }

  alignment(boids: Boid[]): Vector3 {
    Boid._scratchVector.set(0, 0, 0);
    let neighboursCount = 0;

    boids.forEach((boid: Boid) => {
      const d = this.position.distanceToSquared(boid.position);

      if (d < Boid.viewRangeSquared && d > Boid.protectRangeSquared) {
        neighboursCount++;
        Boid._scratchVector.add(boid.velocity);
      }
    });

    if (neighboursCount) {
      Boid._scratchVector.divideScalar(neighboursCount);
      Boid._scratchVector.normalize();
    }

    return Boid._scratchVector;
  }

  cohersion(boids: Boid[]): Vector3 {
    Boid._scratchVector.set(0, 0, 0);
    let neighboursCount = 0;

    boids.forEach((boid: Boid) => {
      const d = this.position.distanceToSquared(boid.position);

      if (d < Boid.viewRangeSquared && d > Boid.protectRangeSquared) {
        neighboursCount++;
        Boid._scratchVector.add(boid.position);
      }
    });

    if (neighboursCount) {
      Boid._scratchVector.divideScalar(neighboursCount);
      Boid._scratchVector.sub(this.position);
      Boid._scratchVector.normalize();
    }

    return Boid._scratchVector;
  }

  /** Random noise to simulate a living being*/
  freeWill() {
    const ranX = Math.random() * 2 - 1;
    const ranY = Math.random() * 2 - 1;
    const ranZ = Math.random() * 2 - 1;
    Boid._scratchVector.set(ranX, ranY, ranZ);
    return Boid._scratchVector.normalize().multiplyScalar(Boid.freeWillMag);
  }

  faceFront() {
    Boid._scratchVector.copy(this.velocity);
    Boid._scratchVector.add(this.position);
    this._mesh.lookAt(Boid._scratchVector);
  }
}
