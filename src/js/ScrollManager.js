import Timer from './Timer';

let delayScrollReportMills  = 100,
    delayScrollStopMills    = 50;


class ScrollManager {

  static get ACTION() {
    return {
      scroll            : 'scroll',
      scrollStart       : 'scrollStart',
      scrollEnd         : 'scrollEnd'
    };
  }

  constructor(objectToBindTo, callback, delayMills=delayScrollReportMills) {
    this.timer            = new Timer(delayMills, callback, objectToBindTo);
    this.objectToBindTo   = objectToBindTo;
    this.addListeners();
    this.addTimers();
  }
  addListeners() {
    // no object
    if ( ! this.objectToBindTo ) {
      console.error('Must have an object to use ScrollManager');
      return;
    }

    // DOM
    if ( this.objectToBindTo.addEventListener ) {
      this.objectToBindTo.addEventListener("scroll", this.queueScrollHandling.bind(this));
    }

    // JQUERY-like
    else if(this.objectToBindTo.on) {
      this.objectToBindTo.on('scroll', this.queueScrollHandling.bind(this));
    }

    else {
      console.warn('Object does not seem to listen to event subscriptions for scrolling.')
    }
  }
  removeListeners() {

    // no object
    if ( ! this.objectToBindTo ) {
      return;
    }

    if ( this.objectToBindTo.addEventListener ) {
      this.objectToBindTo.addEventListener("scroll", this.queueScrollHandling.bind(this));
    }

    // JQUERY-like
    else if(this.objectToBindTo.off) {
      this.objectToBindTo.off('scroll', this.queueScrollHandling.bind(this));
    }

  }
  addTimers() {
    this.scrollTimer      = new Timer(delayMills, callback, objectToBindTo);
  }
  queueScrollHandling() {
    // timers not scheduled, start them
    if ( ! this.timer.isRunning() ) {
      this.timer.start();
    }
  }


  on(action, callback) {
    if ( PSU.isNoE(name) || ! PSU.isFunction(callback) ) {
      console.warn('You must provide a valid action and callback function to subscribe to events');
      return;
    }



  }
}
export default ScrollManager;
