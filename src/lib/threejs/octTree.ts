import * as THREE from "three";
import Boid from "./boid";

export class Octree {
  _boundary: Boundary;
  _nodes: Array<Octree> = new Array<Octree>();
  _depth: number;

  _boids: Array<Boid> = new Array<Boid>();

  minPoint: THREE.Vector3;
  maxPoint: THREE.Vector3;

  subdivided: boolean;

  constructor(
    private capacity: number,
    minPoint: THREE.Vector3,
    maxPoint: THREE.Vector3
  ) {
    this._boundary = new CubicBoundary(minPoint, maxPoint);
    this.minPoint = minPoint;
    this.maxPoint = maxPoint;
  }

  subdivide() {
    if (this.subdivided) return false;
    const blockSize = new THREE.Vector3(
      (this.maxPoint.x - this.minPoint.x) / 2,
      (this.maxPoint.y - this.minPoint.y) / 2,
      (this.maxPoint.z - this.minPoint.z) / 2
    );

    for (let x = 0; x < 2; x++)
      for (let y = 0; y < 2; y++)
        for (let z = 0; z < 2; z++) {
          const minPoint = new THREE.Vector3(
            this.minPoint.x + x * blockSize.x,
            this.minPoint.y + y * blockSize.y,
            this.minPoint.z + z * blockSize.z
          );
          const maxPoint = new THREE.Vector3(
            this.minPoint.x + (x + 1) * blockSize.x,
            this.minPoint.y + (y + 1) * blockSize.y,
            this.minPoint.z + (z + 1) * blockSize.z
          );
          this._nodes.push(new Octree(this.capacity, minPoint, maxPoint));
        }
    this.subdivided = true;
  }

  add(boid: Boid): boolean {
    if (!this._boundary.contains(boid.position)) return false;
    if (this._boids.length < this.capacity) {
      this._boids.push(boid);
      return true;
    } else {
      this.subdivide();
      for (let i = 0; i < this._nodes.length; i++) {
        const node = this._nodes[i];
        if (node.add(boid)) return true;
      }
      return true;
    }
  }

  get debugHelpers(): THREE.Box3Helper[] {
    if (!this.subdivided) return [this._boundary.debug];
    const debugs = [this._boundary.debug];

    this._nodes.forEach((block) => {
      debugs.push(...block.debugHelpers);
    });
    return debugs;
  }
}

interface Boundary {
  _minPoint: THREE.Vector3;
  _maxPoint: THREE.Vector3;
  intersects: (_boundary: Boundary) => boolean;
  contains: (_point: THREE.Vector3) => boolean;
  debug: THREE.Box3Helper;
}

export class CubicBoundary implements Boundary {
  _minPoint: THREE.Vector3;
  _maxPoint: THREE.Vector3;
  private _box: THREE.Box3;

  boxHelper: THREE.Box3Helper;

  constructor(minPoint: THREE.Vector3, maxPoint: THREE.Vector3) {
    this._minPoint = minPoint;
    this._maxPoint = maxPoint;

    this._box = new THREE.Box3(this._minPoint, this._maxPoint);
    this.boxHelper = new THREE.Box3Helper(this._box, "green");
  }

  get debug() {
    return this.boxHelper;
  }

  intersects(boundary: Boundary) {
    console.log(boundary);
    return true;
  }

  contains(point: THREE.Vector3): boolean {
    return this._box.containsPoint(point);
  }
}
