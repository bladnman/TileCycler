
import ScrollManager from './ScrollManager';
import PSU from './PSU';

const SCROLL_DELAY = 100;
const TILE = {
  outerWidth: 160,
  outerHeight: 185
};
const PAGES_TO_BUILD = 1;

class ContainerManager {

  constructor(container) {

    this.scrollManager    = null;
    this.container        = null;
    this.elemsPerWidth    = null;
    this.elemsPerHeight   = null;

    // handler refs
    this._scrollHandler         = null;
    this._scrollStartHandler    = null;
    this._scrollEndHandler      = null;

    // make sure it's a jq item
    if ( PSU.isA(container) ) {
      this.container  = PSU.isJquery(container) ? container : $(container);
    }

    this.setup();
  }
  setup() {

    this.addListeners();
    this.calculateMetrics();
    this.installTiles();

  }
  addListeners() {

    this.removeListeners();

    this.scrollManager          = this.scrollManager || new ScrollManager(this.container, SCROLL_DELAY);

    this._scrollHandler         = this.didScroll.bind(this);
    this._scrollStartHandler    = this.scrollStarted.bind(this);
    this._scrollEndHandler      = this.scrollEnded.bind(this);

    this.scrollManager.addEventListener(ScrollManager.EVENT.scroll,         this._scrollHandler)
                      .addEventListener(ScrollManager.EVENT.scrollStart,    this._scrollStartHandler)
                      .addEventListener(ScrollManager.EVENT.scrollEnd,      this._scrollEndHandler);
  }
  removeListeners() {
    if ( PSU.isNoE(this.scrollManager) ) {
      return;
    }

    this.scrollManager.removeEventListener(ScrollManager.EVENT.scroll,      this._scrollHandler)
                      .removeEventListener(ScrollManager.EVENT.scrollStart, this._scrollStartHandler)
                      .removeEventListener(ScrollManager.EVENT.scrollEnd,   this._scrollEndHandler);
  }
  calculateMetrics() {
    this.elemsPerWidth    = Math.ceil(this.container.innerWidth() / TILE.outerWidth);
    this.elemsPerHeight   = Math.ceil(this.container.innerHeight() / TILE.outerHeight);
  }
  installTiles() {
    if ( PSU.isNoE(this.container) ) {
      return;
    }
    this.container.empty();

    let tileCount = this.elemsPerWidth * this.elemsPerHeight * PAGES_TO_BUILD;
    for (var i = 0; i < tileCount; i++) {
      this.container.append(getTileElem('Tile ' + (i + 1)));
    }

  }
  didScroll() {
    console.log('didScroll');
  }
  scrollStarted() {
    console.log('scrollStarted');
  }
  scrollEnded() {
    console.log('scrollEnded - unbinding end listener');
    this.scrollManager.removeEventListener(ScrollManager.EVENT.scrollEnd, this._scrollEndHandler);

  }

}
export default ContainerManager;




function getTileElem(title, imgUrl) {

  var tile = jqItemFromTemplate('#template-tile');
  tile.find('.title').html(title);

  if (imgUrl) {
    let img = tile.find('.img');
    img.css('background-image', 'url(' + imgUrl + ')');
  }

  return tile;
}
function jqItemFromTemplate(selector) {
  var obj = $(selector);
  if (!obj || obj.length < 1) {
    return null;
  }

  return $(obj[0].innerHTML);

}
