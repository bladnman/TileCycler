let Directions = {
  UP        : 'UP',
  DOWN      : 'DOWN',
  LEFT      : 'LEFT',
  RIGHT     : 'RIGHT',
  NONE      : 'NONE'
};
class Direction {
  constructor() {}

  /**
   * @return {boolean} boolean
   */
  static isUp(code) {
    return code.toUpperCase() === this.UP;
  }
  /**
   * @return {boolean} boolean
   */
  static isDown(code) {
    return code.toUpperCase() === this.DOWN;
  }
  /**
   * @return {boolean} boolean
   */
  static isLeft(code) {
    return code.toUpperCase() === this.LEFT;
  }
  /**
   * @return {boolean} boolean
   */
  static isRight(code) {
    return code.toUpperCase() === this.RIGHT;
  }
  /**
   * @return {boolean} boolean
   */
  static isNone(code) {
    return code.toUpperCase() === this.NONE;
  }
  /**
   * @return {string} string code representing direction
   */
  static get UP() {
    return Directions.UP;
  }
  /**
   * @return {string} string code representing direction
   */
  static get DOWN() {
    return Directions.DOWN;
  }
  /**
   * @return {string} string code representing direction
   */
  static get LEFT() {
    return Directions.LEFT;
  }
  /**
   * @return {string} string code representing direction
   */
  static get RIGHT() {
    return Directions.RIGHT;
  }
  /**
   * @return {string} string code representing direction
   */
  static get NONE() {
    return Directions.NONE;
  }
}
export default Direction;
