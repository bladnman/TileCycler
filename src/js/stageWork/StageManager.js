import DimU from './../dimensions/DimensionUtils';
import Stage from './Stage';
import Direction from './../dimensions/Direction';
//import StageDataDelegate from './delegates/StageDataDelegate';

let DEBUG_MOVES = false;

class StageManager {
  constructor() {
    // internal
    this.actors             = [];
    this.stage              = null;   // <Stage>
    //this.dataDelegate       = null;   // <StageDateDelegate>
    //this.viewDelegate       = null;   // <StageViewDelegate>
    this.lastScrollPosition = DimU.emptyPosition();
  }
  addActor(actor) {
    this.actors.push(actor);
    actor.$view.click(function() {
      console.log('you clicked me!');
    });
  }
  stageDidMove() {

    let directionMoved          = this.directionMoved();

    // bail - didn't end up moving
    if ( Direction.isNone(directionMoved) ) {
      return;
    }

    let isForwardMove           = Direction.isLeft(directionMoved) || Direction.isUp(directionMoved);
    let offstageActors          = this.collectOffstageActors(isForwardMove);
    let firstOnStagePosition    = DimU.emptyPosition();

    // nothing to do
    if ( ! offstageActors || offstageActors.length < 1 || ! this.actors || this.actors.length < 1 ) {
      return;
    }

    let firstOnstageActorPosition = this.theaterPositionForActor(this.actors[0]);
    //let ActorFrame = DimU.frameFromElement(this.actors[0].$view);

    // move the views
    for (let actor of offstageActors) {

      // PUT OFFSTAGE ACTORS AT BACK
      if ( isForwardMove ) {
        this.stage.$view.append(actor.$view);
        this.actors.push(actor);
      }

      // PUT OFFSTAGE ACTORS AT FRONT
      else {
        this.stage.$view.prepend(actor.$view);
        this.actors.unshift(actor);
      }

    }

    // SHIM
    let top     = Direction.isUp(directionMoved) ? Math.abs(firstOnstageActorPosition.top) : 0;
    let left    = Direction.isLeft(directionMoved) ? Math.abs(firstOnstageActorPosition.left) : 0;

    this.shim({top:top, left:left});

    this.logActorOrder();

    // remember position for next time
    this.lastScrollPosition = this.stage.scrollPosition;
  }
  isActorOnStage(actor) {

    // no stage
    if ( ! this.stage.isValid() ) {
      console.warn('checking if actor is in viewport without a valid stage');
      return false;
    }

    // no actor
    if ( !actor || !actor.$view || actor.$view.length < 1 || ! actor.$view.parent ) {
      console.warn('checking if actor is in viewport without a valid actor');
      return false;
    }

    // not on my stage
    if ( actor.$view.parent()[0] !== this.stage.$view[0] ) {
      console.warn('checking if actor is in viewport but this actor is not on my stage');
      return false;
    }

    // check for intersection
    else {
      let actorFrame = DimU.frameFromElement(actor.$view);
      return DimU.areFramesIntersecting(this.stage.frame, actorFrame);
    }

  }
  directionMoved() {

    let currentScrollPosition = this.stage.scrollPosition;

    // UP
    if ( currentScrollPosition.top > this.lastScrollPosition.top ) {
      return Direction.UP;
    }

    // DOWN
    if ( currentScrollPosition.top < this.lastScrollPosition.top ) {
      return Direction.DOWN;
    }

    // LEFT
    if ( currentScrollPosition.left > this.lastScrollPosition.left ) {
      return Direction.LEFT;
    }

    // RIGHT
    if ( currentScrollPosition.left < this.lastScrollPosition.left ) {
      return Direction.RIGHT;
    }

    return Direction.NONE;
  }
  clearShims() {

    if ( !this.stage.isValid() ) {
      return;
    }

    let shimClass     = '_stage_shim_';
    let $shims        = this.stage.$view.find('.' + shimClass);
    $shims.remove();

  }
  shim({left=0, top=0}) {

    this.clearShims();

    let shimClass           = '_stage_shim_';
    let shimTopClass        = '_stage_shim_top_';
    let shimLeftClass       = '_stage_shim_left_';

    console.log('Shimming with', arguments[0]);

    let createShimWithClass = function (className) {
      let $newShim = $('<div></div>');
      $newShim.addClass(shimClass);
      $newShim.addClass(className);
      return $newShim;
    };

    let $shim;

    // TOP SHIM
    if ( top > 0 ) {
      $shim = createShimWithClass(shimTopClass);
      $shim.css('width', '100%');
      $shim.css('height', top + 'px');
      this.stage.$view.prepend($shim);
    }

    // LEFT SHIM
    if ( left > 0 ) {
      $shim = createShimWithClass(shimLeftClass);
      $shim.css('height', '10px');
      $shim.css('width', left + 'px');
      $shim.css('float', 'left');
      this.stage.$view.prepend($shim);
    }

  }
  collectOffstageActors(startAtFront=true) {
    let offstageActors    = [];

    // no actors
    if ( !this.actors || this.actors.length < 1 ) {
      return offstageActors;
    }

    let currentIndex      = startAtFront ? 0 : this.actors.length - 1;

    // set up a loop that goes through all actors : note we do not use this index
    for ( let i = 0, length = this.actors.length; i < length; ++i ) {
      let actor           = this.actors[currentIndex];
      let isActorOnStage  = this.isActorOnStage(actor);

      // actor is OFF-STAGE
      if ( ! isActorOnStage ) {

        // push actor into offstage array
        offstageActors.push(actor);

        // remove actor from main actor array
        this.actors.splice(currentIndex, 1);

        // if going backwards we need to decrement index
        if ( !startAtFront ) {
          currentIndex--
        }
      }

      // actor is ON-STAGE (stop working)
      else {
        break;
      }
    }

    return offstageActors;
  }

  theaterPositionForActor(actor) {

    if ( !actor || !actor.$view || actor.$view.length < 1 ) {
      return DimU.emptyPosition();
    }

    let position            = DimU.frameFromElement(actor.$view).position;
    let stagePosition       = this.stage.scrollPosition;
    position.top            += stagePosition.top;
    position.left           += stagePosition.left;

    return position;
  }


  /**
   *  Loggers
   */
  logActorOrder() {
    let actorOrder = this.actors.reduce(function (memo, actor) {
      if ( memo.length > 0 ) {
        memo +=  ', ';
      }
      memo += actor.id;
      return memo;
    }, '');

    if (DEBUG_MOVES) { console.log('actorOrder', actorOrder); }
  }

  /**
   *  SETTERS
   */
  set $view($view) {
    this.stage              = new Stage($view);
  }

  /**
   *  CREATORS
   */
  static createWithView($view) {
    let manager             = new StageManager();
    manager.$view           = $view;
    return manager;
  }
}
export default StageManager;
