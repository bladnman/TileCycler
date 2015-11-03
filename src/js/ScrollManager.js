import Timer from './Timer';
import Listeners from './Listeners';

let delayScrollReportMills  = 100,
    delayScrollStopMills    = 200;

class ScrollManager {

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

    this.scrollStartListeners   = new Listeners();

    this.scrollEndTimer         = new Timer(delayScrollStopMills);
    this.scrollEndTimer.addEventListener(Timer.EVENT.fire, this.scrollEndTimerFired.bind(this));

    this.elemToBindTo           = elemToBindTo;

    this._isScrolling           = false;
    this.addListeners();
  }
  addListeners() {
    // no object
    if ( ! this.elemToBindTo ) {
      console.error('Must have an object to use ScrollManager');
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
  removeListeners() {

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
    // timers not scheduled, start them
    if ( ! this.scrollTimer.isRunning() ) {
      this.scrollTimer.start();
    }

    // SCROLLING BEGINS
    if ( !this._isScrolling ) {

      // mark that we are scrolling
      this._isScrolling = true;

      // report scroll start
      this.scrollStartListeners.notifyListeners();
    }
  }

  addEventListener(eventType, callback) {
    if ( typeof eventType === 'undefined' || eventType === null || Object.prototype.toString.call( callback ) !== '[object Function]' ) {
      console.warn('You must provide a valid eventType and callback function to subscribe to events');
      return this;
    }

    // SCROLL
    if ( eventType.toLowerCase() === ScrollManager.EVENT.scroll.toLowerCase() ) {
      this.scrollTimer.addEventListener(Timer.EVENT.fire, callback);
    }

    // SCROLL START
    else if ( eventType.toLowerCase() === ScrollManager.EVENT.scrollStart.toLowerCase() ) {
      this.scrollStartListeners.addListener(callback);
    }

    // SCROLL END
    else if ( eventType.toLowerCase() === ScrollManager.EVENT.scrollEnd.toLowerCase() ) {
      this.scrollEndTimer.addEventListener(Timer.EVENT.fire, callback);
    }

    // UNKNOWN EVENT TYPE
    else {
      console.warn('Unknown event type');
    }

    return this;
  }
  removeEventListener(eventType, callback) {
    if ( typeof eventType === 'undefined' || Object.prototype.toString.call( callback ) !== '[object Function]' ) {
      console.warn('You must provide a valid eventType and callback function to unsubscribe from events');
      return this;
    }

    // SCROLL
    if ( eventType.toLowerCase() === ScrollManager.EVENT.scroll.toLowerCase() ) {
      this.scrollTimer.removeEventListener(Timer.EVENT.fire, callback);
    }

    // SCROLL START
    else if ( eventType.toLowerCase() === ScrollManager.EVENT.scrollStart.toLowerCase() ) {
      this.scrollStartListeners.removeEventListener(callback);
    }

    // SCROLL END
    else if ( eventType.toLowerCase() === ScrollManager.EVENT.scrollEnd.toLowerCase() ) {
      this.scrollEndTimer.removeEventListener(Timer.EVENT.fire, callback);
    }

    // ALL EVENTS
    else if ( eventType === null || eventType.toLowerCase() === 'all' ) {
      this.scrollTimer.removeEventListener(Timer.EVENT.fire, callback);
      this.scrollStartListeners.removeEventListener(callback);
      this.scrollEndTimer.removeEventListener(Timer.EVENT.fire, callback);
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
    this._isScrolling = false;
  }
  scrollTimerFired() {
    this.startScrollEndCheckTimer();
  }
}
export default ScrollManager;
