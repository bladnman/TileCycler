import DimU from './../dimensions/DimensionUtils';
import Position from './../dimensions/Position';

class Stage {
  constructor($view) {
    // read-only
    //this.$view;               // <jq Elem>
    //this.frame;               // <Frame>
    //this.scrollPosition;      // <Position>

    this.prepareStage($view);
  }
  prepareStage($view) {
    this._frame     = null;
    this._$view     = $view;
    this.$view.empty();

    this.$view.append('<div>hi</div>');

  }
  isValid() {
    return this.$view && this.$view.length > 0;
  }

  positionOnStage($view) {
    if ( !$view || $view.length < 1 ) {
      return null;
    }

    let top   = $view.position().top + this.scrollPosition.top;
    let left  = $view.position().left + this.scrollPosition.left;
    return Position.create(left, top);
  }

  /**
   *  GETTERS / SETTERS
   */
  get $view() {
    return this._$view;
  }
  get scrollPosition() {
    return DimU.scrollPositionFromElement(this.$view) || DimU.emptyPosition();
  }
  get frame() {

    if ( this._frame ) {
      return this._frame;
    }

    this._frame             = DimU.frameFromElement(this.$view) || DimU.emptyFrame();

    // our own frame - remove position in parent space
    this._frame.position    = {top:0, left:0};

    return this._frame;
  }
}
export default Stage;
