export class Sizes {
  private static _width: number = window.innerWidth - 51;
  private static _height: number = window.innerHeight - 51;

  static update() {
    this._width = window.innerWidth - 51;
    this._height = window.innerHeight - 51;
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
