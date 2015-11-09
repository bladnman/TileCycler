class Size {
  constructor() {
    this.width     = 0;
    this.height    = 0;
  }
  static create(width=0, height=0) {
    var size = new Size();
    size.width = width;
    size.height = height;
    return size;
  }
}
export default Size;
