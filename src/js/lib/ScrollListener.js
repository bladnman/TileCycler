import Timer from './Timer';
import ListenerController from './ListenerController';

let delayScrollReportMills  = 100,
    delayScrollStopMills    = 200;

class ScrollListener {

  static get EVENT() {
    return {
      scroll            : 'scroll',
      scrollStart       : 'scrollStart',
      scrollEnd         : 'scrollEnd'
    };
  }

  constructor(elemToBindTo, delayMills=delayScrollReportMills) {

    this.scrollTimer            = new Timer(delayMills, null, elemToBindTo);
    this.scrollTimer.addEventListener(Timer.EVENT.fire, this.scrollTimerFired.bind(this));

    this.scrollEndTimer         = new Timer(delayScrollStopMills);
    this.scrollEndTimer.addEventListener(Timer.EVENT.fire, this.scrollEndTimerFired.bind(this));

    this.scrollListeners        = new ListenerController();
    this.scrollStartListeners   = new ListenerController();
    this.scrollEndListeners     = new ListenerController();

    this.elemToBindTo           = elemToBindTo;

    this._isScrolling           = false;
    this._startMills            = null;

    this._startingState         = null;
    this._previousState         = null;
    this._currentState          = null;

    this.addListenerController();
  }

  get scrollState() {
    return {
      starting            : this._startingState,
      previous            : this._previousState,
      current             : this._currentState,
      deltaFromPrevious   : this._getDeltaState(this._currentState, this._previousState),
      deltaFromStart      : this._getDeltaState(this._currentState, this._startingState)
    };
  }

  _getCurrentState() {

    var scrollLeft      = 0,
        scrollTop       = 0,
        mills           = 0;

    if ( this.elemToBindTo !== null ) {
      scrollLeft    = this.elemToBindTo.scrollLeft() || 0;
      scrollTop     = this.elemToBindTo.scrollTop() || 0;
      mills         = this._startMills === null ? 0 : (new Date()).getTime() - this._startMills;
    }

    return {
      scrollLeft  : scrollLeft,
      scrollTop   : scrollTop,
      mills       : mills
    };
  }
  _getDeltaState(thisState, comparedToState) {

    var scrollLeftDelta = 0,
        scrollTopDelta = 0,
        millsDelta = 0;

    if ( thisState !== null && comparedToState !== null ) {
      scrollLeftDelta    = thisState.scrollLeft  - comparedToState.scrollLeft;
      scrollTopDelta     = thisState.scrollTop   - comparedToState.scrollTop;
      millsDelta         = thisState.mills       - comparedToState.mills;
    }

    return {
      scrollLeft  : scrollLeftDelta,
      scrollTop   : scrollTopDelta,
      mills       : millsDelta,
      scrollDirection   : {
        isUp      : scrollTopDelta < 0,
        isDown    : scrollTopDelta > 0,
        isLeft    : scrollLeftDelta < 0,
        isRight   : scrollLeftDelta < 0
      }
    };
  }
  addListenerController() {
    // no object
    if ( ! this.elemToBindTo ) {
      console.error('Must have an object to use ScrollListener');
      return;
    }

    // DOM
    if ( this.elemToBindTo.addEventListener ) {
      this.elemToBindTo.addEventListener("scroll", this.queueScrollHandling.bind(this));
    }

    // JQUERY-like
    else if(this.elemToBindTo.on) {
      this.elemToBindTo.on('scroll', this.queueScrollHandling.bind(this));
    }

    else {
      console.warn('Object does not seem to listen to event subscriptions for scrolling.')
    }
  }
  removeListenerController() {

    // no object
    if ( ! this.elemToBindTo ) {
      return;
    }

    if ( this.elemToBindTo.removeEventListener ) {
      this.elemToBindTo.removeEventListener("scroll", this.queueScrollHandling.bind(this));
    }

    // JQUERY-like
    else if(this.elemToBindTo.off) {
      this.elemToBindTo.off('scroll', this.queueScrollHandling.bind(this));
    }

  }
  queueScrollHandling() {

    // BOUNCE last 'current' info into 'previous'
    this._previousState     = this._currentState;

    // SET UP CURRENT
    this._currentState      = this._getCurrentState();


    // timers not scheduled, start them
    if ( ! this.scrollTimer.isRunning() ) {
      this.scrollTimer.start();
    }

    // FIRST SCROLL
    if ( !this._isScrolling ) {

      // record our STARTING POSITION
      this._startMills      = (new Date()).getTime();
      this._startingState   = this._currentState;
      this._previousState   = null;

      // mark that we are scrolling
      this._isScrolling     = true;

      // report SCROLL START
      this.scrollStartListeners.notifyListeners();
    }

  }

  addEventListener(eventType, listener) {
    if ( typeof eventType === 'undefined' || eventType === null || Object.prototype.toString.call( listener ) !== '[object Function]' ) {
      console.warn('You must provide a valid eventType and listener function to subscribe to events');
      return this;
    }

    // SCROLL
    if ( eventType.toLowerCase() === ScrollListener.EVENT.scroll.toLowerCase() ) {
      this.scrollListeners.addListener(listener);
    }

    // SCROLL START
    else if ( eventType.toLowerCase() === ScrollListener.EVENT.scrollStart.toLowerCase() ) {
      this.scrollStartListeners.addListener(listener);
    }

    // SCROLL END
    else if ( eventType.toLowerCase() === ScrollListener.EVENT.scrollEnd.toLowerCase() ) {
      this.scrollEndListeners.addListener(listener);
    }

    // UNKNOWN EVENT TYPE
    else {
      console.warn('Unknown event type');
    }

    return this;
  }
  removeEventListener(eventType, listener) {
    if ( typeof eventType === 'undefined' || Object.prototype.toString.call( listener ) !== '[object Function]' ) {
      console.warn('You must provide a valid eventType and callback function to unsubscribe from events');
      return this;
    }

    // SCROLL
    if ( eventType.toLowerCase() === ScrollListener.EVENT.scroll.toLowerCase() ) {
      this.scrollListeners.removeListener(listener);
    }

    // SCROLL START
    else if ( eventType.toLowerCase() === ScrollListener.EVENT.scrollStart.toLowerCase() ) {
      this.scrollStartListeners.removeListener(listener);
    }

    // SCROLL END
    else if ( eventType.toLowerCase() === ScrollListener.EVENT.scrollEnd.toLowerCase() ) {
      this.scrollEndListeners.removeListener(listener);
    }

    // ALL EVENTS
    else if ( eventType === null || eventType.toLowerCase() === 'all' ) {
      this.scrollListeners.removeListener(listener);
      this.scrollStartListeners.removeListener(listener);
      this.scrollEndListeners.removeListener(listener);
    }

    // UNKNOWN EVENT TYPE
    else {
      console.warn('Unknown event type');
    }

    return this;
  }

  startScrollEndCheckTimer() {
    this.scrollEndTimer.start();
  }
  scrollEndTimerFired() {
    this.scrollEndListeners.notifyListeners(this.scrollState);
    this._reset();
  }
  scrollTimerFired() {
    this.scrollListeners.notifyListeners(this.scrollState);
    this.startScrollEndCheckTimer();
  }

  _reset() {
    this._isScrolling           = false;
    this._startingState         = null;
    this._previousState         = null;
    this._currentState          = null;
    this._startMills            = null;
  }
}
export default ScrollListener;
