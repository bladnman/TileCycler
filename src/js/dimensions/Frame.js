import Position from './Position';
import Size from './Size';

class Frame {
  constructor() {
    this.position     = null;
    this.size         = null;
  }
  static create(left, top, w, h) {
    let position        = Position.create(left, top);
    let size            = Size.create(w, h);
    let frame           = new Frame();
    frame.position      = position;
    frame.size          = size;
    return frame;
  }
  static isValidFrame(object) {
    return  object &&
      object.position &&
      object.size;
  }
}
export default Frame;
