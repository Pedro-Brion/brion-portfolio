import * as THREE from "three";
import Boid from "./boid";

export class Octree {
  private _boundary: CubicBoundary;
  private _nodes: Array<Octree> = new Array<Octree>();
  // _depth: number;

  private _boids: Array<Boid> = new Array<Boid>();

  private _minPoint: THREE.Vector3;
  private _maxPoint: THREE.Vector3;

  private _subdivided: boolean;

  constructor(
    private capacity: number,
    minPoint: THREE.Vector3,
    maxPoint: THREE.Vector3
  ) {
    this._boundary = new CubicBoundary(minPoint, maxPoint);
    this._minPoint = minPoint;
    this._maxPoint = maxPoint;
  }

  private _subdivide() {
    if (this._subdivided) return false;
    const blockSize = new THREE.Vector3(
      (this._maxPoint.x - this._minPoint.x) / 2,
      (this._maxPoint.y - this._minPoint.y) / 2,
      (this._maxPoint.z - this._minPoint.z) / 2
    );

    for (let x = 0; x < 2; x++)
      for (let y = 0; y < 2; y++)
        for (let z = 0; z < 2; z++) {
          const minPoint = new THREE.Vector3(
            this._minPoint.x + x * blockSize.x,
            this._minPoint.y + y * blockSize.y,
            this._minPoint.z + z * blockSize.z
          );
          const maxPoint = new THREE.Vector3(
            this._minPoint.x + (x + 1) * blockSize.x,
            this._minPoint.y + (y + 1) * blockSize.y,
            this._minPoint.z + (z + 1) * blockSize.z
          );
          this._nodes.push(new Octree(this.capacity, minPoint, maxPoint));
        }
    this._subdivided = true;
  }

  add(boid: Boid): boolean {
    if (!this._boundary.contains(boid.position)) return false;
    if (this._boids.length < this.capacity) {
      this._boids.push(boid);
      boid.currentNode = this;
      return true;
    } else {
      this._subdivide();
      for (let i = 0; i < this._nodes.length; i++) {
        const node = this._nodes[i];
        if (node.add(boid)) return true;
      }
      return true;
    }
  }

  remove(boid: Boid): boolean {
    const index = this._boids.indexOf(boid);
    if (index !== -1) {
      this._boids.splice(index, 1);
      boid.currentNode = null; // Clear the boid's reference to this node
      return true;
    }
    if (this._subdivided) {
      for (let i = 0; i < this._nodes.length; i++) {
        const node = this._nodes[i];
        if (node.remove(boid)) return true;
      }
    }
    return false;
  }

  updateBoid(boid: Boid): boolean {
    if (this._boundary.contains(boid.position)) return true;
    this.remove(boid);
    return this.add(boid);
  }

  query(sphere: THREE.Sphere): Boid[] {
    if (!this._boids.length && !this._subdivided) return [];
    const flock = [...this._boids];

    if (!this._boundary.intersectsSphere(sphere)) {
      return [];
    }
    if (this._subdivided) {
      for (let i = 0; i < this._nodes.length; i++) {
        const node = this._nodes[i];
        if (node._boids.length) {
          flock.push(...node.query(sphere));
        }
      }
    }
    return flock;
  }
}

export class CubicBoundary {
  private _minPoint: THREE.Vector3;
  private _maxPoint: THREE.Vector3;
  private _box: THREE.Box3;

  boxHelper: THREE.Box3Helper;

  constructor(minPoint: THREE.Vector3, maxPoint: THREE.Vector3) {
    this._minPoint = minPoint;
    this._maxPoint = maxPoint;

    this._box = new THREE.Box3(this._minPoint, this._maxPoint);
  }

  intersectsSphere(sphere: THREE.Sphere) {
    return this._box.intersectsSphere(sphere);
  }

  contains(point: THREE.Vector3): boolean {
    return this._box.containsPoint(point);
  }
}
