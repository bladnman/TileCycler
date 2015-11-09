class StageDataController {
  constructor() {
    this.items     = [];
  }
  static create(width=0, height=0) {
    var size = new Size();
    size.width = width;
    size.height = height;
    return size;
  }
}
export default StageDataController;
