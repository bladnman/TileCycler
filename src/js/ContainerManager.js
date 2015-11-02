
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

    // make sure it's a jq item
    if ( PSU.isA(container) ) {
      this.container  = PSU.isJquery(container) ? container : $(container);
    }

    this.setup();
  }
  setup() {
    this.scrollManager = new ScrollManager(this.container, this.didScroll, SCROLL_DELAY);

    this.calculateMetrics();
    this.installTiles();

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
    console.log('Container did scroll!');
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
