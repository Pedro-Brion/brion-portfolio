export class Sizes {
 private static _width: number = window.innerWidth;
 private static _height: number = window.innerHeight;

 static update() {
  this._width = window.innerWidth;
  this._height = window.innerHeight;
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
