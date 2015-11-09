
import ScrollListener from './lib/ScrollListener';
import StageManager from './stageWork/StageManager';
import Actor from './stageWork/Actor';
import PSU from './lib/PSU';

const SCROLL_DELAY            = 100;
const TILE                    = {
  outerWidth: 160,
  outerHeight: 185
};
const STAGE_OVERFLOW_PAGES    = 1; // number of 'pages' of content available on either side of visible area
const PAGES_TO_BUILD          = 1 + (2 * STAGE_OVERFLOW_PAGES); // 2 overflow areas (left, right) and visible area
//const PAGES_TO_BUILD          = 2; // 2 overflow areas (left, right) and visible area

class ContainerManager {

  constructor(container) {

    this.scrollManager          = null;
    this.$container             = null;
    this.elemsPerWidth          = null;
    this.elemsPerHeight         = null;

    // handler refs
    this._scrollHandler         = null;
    this._scrollStartHandler    = null;
    this._scrollEndHandler      = null;

    // controllers
    this._stageManager          = null;

    // make sure it's a jq item
    if ( PSU.isA(container) ) {
      this.$container            = PSU.isJquery(container) ? container : $(container);
    }

    this.setup();
  }
  setup() {


    this._stageManager          = StageManager.createWithView(this.$container);

    this.addListeners();
    this.calculateMetrics();
    this.installTiles();
  }
  addListeners() {

    this.removeListeners();

    this.scrollManager          = this.scrollManager || new ScrollListener(this.$container, SCROLL_DELAY);

    this._scrollHandler         = this.didScroll.bind(this);
    this._scrollStartHandler    = this.scrollStarted.bind(this);
    this._scrollEndHandler      = this.scrollEnded.bind(this);

    this.scrollManager.addEventListener(ScrollListener.EVENT.scroll,         this._scrollHandler)
                      .addEventListener(ScrollListener.EVENT.scrollStart,    this._scrollStartHandler)
                      .addEventListener(ScrollListener.EVENT.scrollEnd,      this._scrollEndHandler);
  }
  removeListeners() {
    if ( PSU.isNoE(this.scrollManager) ) {
      return;
    }

    this.scrollManager.removeEventListener(ScrollListener.EVENT.scroll,      this._scrollHandler)
                      .removeEventListener(ScrollListener.EVENT.scrollStart, this._scrollStartHandler)
                      .removeEventListener(ScrollListener.EVENT.scrollEnd,   this._scrollEndHandler);
  }
  calculateMetrics() {
    this.elemsPerWidth    = Math.ceil(this.$container.innerWidth() / TILE.outerWidth);
    this.elemsPerHeight   = Math.ceil(this.$container.innerHeight() / TILE.outerHeight);
  }
  installTiles() {
    if ( PSU.isNoE(this.$container) ) {
      return;
    }
    this.$container.empty();

    let tileCount = this.elemsPerWidth * this.elemsPerHeight * PAGES_TO_BUILD;
    for (var i = 0; i < tileCount; i++) {
      let actor = new Actor(getTileElem('Actor ' + (i + 1)));
      actor.id = i+1;

      actor.$view.addClass('actor-' + (i+1));

      this.$container.append(actor.$view);
      this._stageManager.addActor(actor);
    }

  }
  didScroll(/*scrollState*/) {
    //this.reportDirections(scrollState.deltaFromPrevious.scrollDirection);
    //this._stageManager.stageDidMove();
  }
  scrollStarted(/*scrollState*/) {
    //console.log('scrollStarted');

  }
  scrollEnded(/*scrollState*/) {
    //console.log('scroll ended!', scrollState);
    //console.log('scrollEnded - unbinding end listener');
    //this.scrollManager.removeEventListener(ScrollListener.EVENT.scrollEnd, this._scrollEndHandler);
    this._stageManager.stageDidMove();
  }


  reportDirections(direction) {
    if (direction.isUp)     {console.log('up')};
    if (direction.isDown)   {console.log('down')};
    if (direction.isLeft)   {console.log('left')};
    if (direction.isRight)  {console.log('right')};
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
