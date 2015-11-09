class Position {
  constructor() {
    this.top     = 0;
    this.left    = 0;
  }
  static create(left=0, top=0) {
    var position = new Position();
    position.top = top;
    position.left = left;
    return position;
  }
}
export default Position;
