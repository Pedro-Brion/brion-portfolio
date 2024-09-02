const NAVBAR_SIZE = 0;
const SIDEBAR_SIZE = 0;

export class Sizes {
  private static _width: number = window.innerWidth - SIDEBAR_SIZE;
  private static _height: number = window.innerHeight - NAVBAR_SIZE;

  static update() {
    this._width = window.innerWidth - SIDEBAR_SIZE;
    this._height = window.innerHeight - NAVBAR_SIZE;
  }

  static get height() {
    return Sizes._height;
  }
  static get width() {
    return Sizes._width;
  }
  static get aspectRatio() {
    return Sizes._width / Sizes._height;
  }
}
