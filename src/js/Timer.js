

class Timer {
  constructor(mills=0, callback=null, payload=null) {

    // public
    this.callback     = callback;
    this.mills        = mills;
    this.payload      = payload;

    // internal
    this._timer       = null;

  }
  isRunning() {
    return !!this._timer;
  }
  start() {
    this.stop();
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

    // our callback is a function
    if ( this.callback && Object.prototype.toString.call( this.callback ) === '[object Function]' ) {
      this.callback.apply(this, [this.payload]);
    }
    return this;
  }
}

export default Timer;
