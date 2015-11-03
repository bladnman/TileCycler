class Listeners {
  constructor() {
    this._listeners   = [];
  }
  addListener(listener) {

    // improper values
    if ( typeof listener === 'undefined' || listener === null || Object.prototype.toString.call( listener ) !== '[object Function]' ) {
      console.warn('Listeners must be valid functions');
      return this;
    }

    arrayPushUnique(this._listeners, listener);

    return this;
  }
  removeListener(listener) {
    // improper values
    if ( typeof listener === 'undefined' || listener === null ) {
      return this;
    }

    arrayPopElement(this._listeners, listener);

    return this;

  }
  notifyListeners(/*payload*/) {

    for ( var listener of this._listeners ) {
      if ( typeof listener !== 'undefined' && listener !== null && Object.prototype.toString.call( listener ) === '[object Function]' ) {
        listener.apply(this, arguments);
      }
    }

    return this;

  }
}

export default Listeners;

function arrayPushUnique(array, element) {
  if ( Object.prototype.toString.call( array ) !== '[object Array]') {
    return null;
  }

  if ( array.indexOf(element) < 0 ) {
    array.push(element);
  }

  return array;
}
function arrayPopElement(array, element) {
  if ( Object.prototype.toString.call( array ) !== '[object Array]') {
    return null;
  }

  var index = array.indexOf(element);
  if (index > -1) {
    return array.splice(index, 1);
  }

  return null;
}
