export default class Point {
  constructor(px, py) {
    this.x = px
    this.y = py
  }
  setX = px => (this.x = px)
  setY = py => (this.y = py)
}
