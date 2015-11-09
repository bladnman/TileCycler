import Frame from './Frame';
import Position from './Position';
import Size from './Size';

class DimensionUtils {

  // FRAMES
  static frameFromElement($element) {
    if (! $element || $element.length < 1 ) {
      return null;
    }

    let position = Position.create(Math.round($element.position().left),
                                   Math.round($element.position().top));

    let size      = Size.create(Math.ceil($element.width()),
                                Math.ceil($element.height()));

    return Frame.create(position.left, position.top, size.width, size.height);
  }
  static emptyFrame() {
    return Frame.create(0,0,0,0);
  }
  static areFramesIntersecting(frame1, frame2) {
    if ( this.isFrame(frame1) && this.isFrame(frame2) ) {

      let highestFrame  = frame1.position.top < frame2.position.top ? frame1 : frame2;
      let lowestFrame   = frame1 !== highestFrame ? frame1 : frame2;

      // LOWEST FRAME TOP WITHIN HIGHEST - keep testing
      if ( lowestFrame.position.top <= highestFrame.position.top + highestFrame.size.height ) {

        let leftestFrame    = frame1.position.left < frame2.position.left ? frame1 : frame2;
        let rightestFrame   = frame1 !== leftestFrame ? frame1 : frame2;

        // IS RIGHT-EST FRAME WITHIN LEFT-EST?
        return rightestFrame.position.left <= leftestFrame.position.left + leftestFrame.size.width;
      }
    }

    // otherwise - no
    return false;
  }
  static isFrame(object) {
    return Frame.isValidFrame(object);
  }

  // POSITIONS
  static emptyPosition() {
    return Position.create(0,0);
  }
  static scrollPositionFromElement($elem) {
    if ( !$elem || $elem.length < 1 || !$elem.scrollTop ) {
      return null;
    }

    return Position.create($elem.scrollLeft(), $elem.scrollTop());
  }

}
export default DimensionUtils;
