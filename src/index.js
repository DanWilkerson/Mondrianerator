/**
 * @param {Object} config
 * @param {HTMLElement} config.mount
 * @param {Number} config.seed
 */
function Mondrianerate(config) {

  if (!(this instanceof Mondrianerate)) return new Mondrianerate(config);

  const height = config.mount.getBoundingClientRect().height;
  const width = config.mount.getBoundingClientRect().width;

  this._mount = config.mount;
  this._borderWidth = Math.min(height, width) * 0.02;

  this._minDim = this._borderWidth * 4;
  this._bisectCount = 0.0;
  this._minBisects = 5.0;
  this._bisectChance = 0.75;
  this._seed = config.seed % 2147483647;

  if (this._seed <= 0) this._seed += 2147483646;

  this._colorWeights = {
    red: 1,
    yellow: 1,
    blue: 1
  };
  this.colors = ['red', 'blue', 'yellow'];

  this._directionWeight = 0.5;

  this.Render({
    x: 0,
    y: 0,
    height: height,
    width: width
  });

}

/**
 * @prop {Number} x
 * @prop {Number} y
 * @prop {Number} height
 * @prop {Number} width
 */
Mondrianerate.prototype.Render = function Render(config) {

  const color = this._getColor();
  const rect = this.DrawRect(Object.assign({}, config, {
    fill: color,
  }));


  if (this._shouldBisect({height: config.height, width: config.width})) {

    let childConfigs = this._split(config);

    return childConfigs.forEach(childConfig => this.Render(childConfig));

  }

  this._mount.appendChild(rect[0]);
  this._mount.appendChild(rect[1]);

};

/**
 * @returns {Boolean}
 */
Mondrianerate.prototype._shouldBisect = function(config) {

  const rand = this._rand();

  const shouldBisect = (this._bisectCount < this._minBisects ||
    rand <= this._bisectChance) &&
    config.height >= this._minDim &&
    config.width >= this._minDim;

  if (shouldBisect) {

    this._bisectCount++;
    this._bisectChance = this._bisectChance / 1.125;

  }

  return shouldBisect;

};

/**
 * @returns {String}
 */
Mondrianerate.prototype._getColor = function() {

  const rand = this._rand();

  if (rand > 0.5) {

    if (rand < 0.1) return 'black';

    return this._choosePrimary(rand);

  }

  return 'white';

};

/**
 * @param {Number} n
 *
 * @returns {String}
 */
Mondrianerate.prototype._choosePrimary = function(n) {

  const total = Object.keys(this._colorWeights).reduce((t, k) => t += this._colorWeights[k], 0)
  const weighted = n * total;
  const red = this._colorWeights.red;
  const blue = this._colorWeights.blue + red;
  const yellow = this._colorWeights.yellow + blue;

  if (weighted <= red) {

    this._colorWeights.red /= 20;
    return 'red';

  }

  if (weighted <= blue) {

    this._colorWeights.blue /= 20;
    return 'blue';

  }

  if (weighted <= yellow) {

    this._colorWeights.yellow /= 20;
    return 'yellow';

  }

};

/**
 * @param {Object} config
 *
 * @returns {Object[]}
 */
Mondrianerate.prototype._split = function(config) {

  const rand = this._rand();
  let direction;

  if (rand > this._directionWeight) {

    direction = ['height', 'y'];
    this._directionWeight += this._directionWeight / 2;

  } else {

    direction = ['width', 'x'];
    this._directionWeight -= this._directionWeight / 2;

  }

  const minPerc = this._minDim / config[direction[0]];
  const maxPerc = 1 - minPerc;
  const perc = Math.max(Math.min(this._rand(), maxPerc), minPerc);

  return [perc, 1 - perc].map((p, i) => {

    const childConfig = Object.assign({}, config);

    childConfig[direction[0]] = childConfig[direction[0]] * p + (!i ? this._borderWidth : 0);
    if (i) childConfig[direction[1]] = childConfig[direction[1]] + config[direction[0]] * perc;

    return childConfig;

  });

};

/**
 * @param {Object} config
 * @param {Number} config.x
 * @param {Number} config.y
 * @param {Number} config.height
 * @param {Number} config.width
 * @param {String} config.fill
 *
 * @returns {SVGElement}
 */
Mondrianerate.prototype.DrawRect = function(config) {

  const outerRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  const innerRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  Object.keys(config).forEach(a => outerRect.setAttributeNS(null, a, config[a]));

  outerRect.setAttributeNS(null, 'fill', 'black');

  innerRect.setAttributeNS(null, 'fill', config.fill);
  innerRect.setAttributeNS(null, 'x', config.x + this._borderWidth);
  innerRect.setAttributeNS(null, 'y', config.y + this._borderWidth);
  innerRect.setAttributeNS(null, 'height', config.height - 2 * this._borderWidth);
  innerRect.setAttributeNS(null, 'width', config.width - 2 * this._borderWidth);

  return [outerRect, innerRect];

};

/**
 * Adapted from @link https://gist.github.com/blixt/f17b47c62508be59987b
 * @returns {Number}
 */
Mondrianerate.prototype._rand = function() {

  this._seed = this._seed * 16808 % 2147483647;

  return (this._seed - 1) / 2147483646;

};

export default Mondrianerate;
