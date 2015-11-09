class StageDataDelegate {
  constructor() {
    this.data     = null;
  }
  itemAtIndex(index=0) {
    if ( ! this.data || this.data.length < index + 1 ) {
      return null;
    }
    return this.data[index];
  }
  headerForItemAtIndex(index=0) {
    return null;
  }
  footerForItemAtIndex(index=0) {
    return null;
  }
  numberOfItems() {
    if ( ! this.data ) {
      return 0;
    }
    return this.data.length;
  }

  static createWithData(data) {
    let delegate = new StageDataDelegate();
    delegate.data = data;
    return delegate;
  }
}
export default StageDataDelegate;
