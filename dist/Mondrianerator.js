/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * @param {Object} config
 * @param {HTMLElement} config.mount
 * @param {Number} config.seed
 */
function Mondrianerate(config) {

  if (!(this instanceof Mondrianerate)) return new Mondrianerate(config);

  var height = config.mount.getBoundingClientRect().height;
  var width = config.mount.getBoundingClientRect().width;

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
  var _this = this;

  var color = this._getColor();
  var rect = this.DrawRect(Object.assign({}, config, {
    fill: color
  }));

  if (this._shouldBisect({ height: config.height, width: config.width })) {

    var childConfigs = this._split(config);

    return childConfigs.forEach(function (childConfig) {
      return _this.Render(childConfig);
    });
  }

  this._mount.appendChild(rect[0]);
  this._mount.appendChild(rect[1]);
};

/**
 * @returns {Boolean}
 */
Mondrianerate.prototype._shouldBisect = function (config) {

  var rand = this._rand();

  var shouldBisect = this._bisectCount < this._minBisects || rand <= this._bisectChance && config.height >= this._minDim && config.width >= this._minDim;

  if (shouldBisect) {

    this._bisectCount++;
    this._bisectChance = this._bisectChance / 1.125;
  }

  return shouldBisect;
};

/**
 * @returns {String}
 */
Mondrianerate.prototype._getColor = function () {

  var rand = this._rand();

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
Mondrianerate.prototype._choosePrimary = function (n) {
  var _this2 = this;

  var total = Object.keys(this._colorWeights).reduce(function (t, k) {
    return t += _this2._colorWeights[k];
  }, 0);
  var weighted = n * total;
  var red = this._colorWeights.red;
  var blue = this._colorWeights.blue + red;
  var yellow = this._colorWeights.yellow + blue;

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
Mondrianerate.prototype._split = function (config) {
  var _this3 = this;

  var rand = this._rand();
  var direction = void 0;

  if (rand > this._directionWeight) {

    direction = ['height', 'y'];
    this._directionWeight += this._directionWeight / 2;
  } else {

    direction = ['width', 'x'];
    this._directionWeight -= this._directionWeight / 2;
  }

  var minPerc = this._minDim / config[direction[0]];
  var maxPerc = 1 - minPerc;
  var perc = Math.max(Math.min(this._rand(), maxPerc), minPerc);

  return [perc, 1 - perc].map(function (p, i) {

    var childConfig = Object.assign({}, config);

    childConfig[direction[0]] = childConfig[direction[0]] * p + (!i ? _this3._borderWidth : 0);
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
Mondrianerate.prototype.DrawRect = function (config) {

  var outerRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  var innerRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  Object.keys(config).forEach(function (a) {
    return outerRect.setAttributeNS(null, a, config[a]);
  });

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
Mondrianerate.prototype._rand = function () {

  this._seed = this._seed * 16808 % 2147483647;

  return (this._seed - 1) / 2147483646;
};

/* harmony default export */ __webpack_exports__["default"] = (Mondrianerate);

/***/ })
/******/ ]);