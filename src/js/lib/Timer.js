import ListenerController from './ListenerController';

class Timer {

  static get EVENT() {
    return {
      fire            : 'fire'
    };
  }

  constructor(mills=0, callback=null, payload=null) {

    // public
    this.mills        = mills;
    this.payload      = payload;
    this.lastStarted  = null;
    this.lastFired    = null;

    // internal
    this._timer       = null;
    this._listeners   = new ListenerController();

    if ( callback ) {
      this.on(Timer.EVENT.fire, callback);
    }

  }

  isRunning() {
    return !!this._timer;
  }
  start() {
    this.stop();

    this.lastStarted  = new Date();
    this._timer       = setTimeout(this.fire.bind(this), this.mills);

    return this;
  }
  stop() {
    if ( this._timer ) {
      clearTimeout(this._timer);
      this._timer     = null;
    }
    return this;
  }
  fire() {
    this.stop();

    this.lastFired  = new Date();
    this.notifyListeners();

    return this;
  }

  addEventListener(eventType, callback) {

    // improper values
    if ( typeof eventType === 'undefined' || eventType === null || Object.prototype.toString.call( callback ) !== '[object Function]' ) {
      console.warn('To subscribe to Timer events you must send valid callback functions as observers');
      return this;
    }

    // FIRE
    if ( eventType.toLowerCase() === Timer.EVENT.fire.toLowerCase() ) {
      this._listeners.addListener(callback);
    }

    // UNKNOWN EVENT TYPE
    else {
      console.warn('Unknown event type');
    }

    return this;
  }
  removeEventListener(eventType, callback) {
    // improper values
    if ( Object.prototype.toString.call( callback ) !== '[object Function]' ) {
      return this;
    }

    // only 1 listener, just attempt to unsub
    this._listeners.removeListener(callback);

    return this;
  }

  notifyListeners() {

    this._listeners.notifyListeners(this.payload);

    return this;

  }
}

export default Timer;
