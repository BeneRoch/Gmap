(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _environment = require('./utils/environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


var App = function App() {
    _classCallCheck(this, App);
};

// IIFE for loading the application
// ==========================================================================


(function () {
    window.App = App;
})();

},{"./utils/environment":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('./utils/environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


/**
 * Abstract Module
 */
var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.$document = _environment.$document;
        this.$window = _environment.$window;
        this.$html = _environment.$html;
        this.$body = _environment.$body;
    }

    _class.prototype.init = function init() {};

    _class.prototype.destroy = function destroy() {};

    return _class;
}();

exports.default = _class;

},{"./utils/environment":6}],3:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* jshint esnext: true */
// import {$document, $window, $html, $body} from '../utils/environment';
/**
 * Map Object
 * Events:
 * - ICON_LOADED
 * - 
 */

var EVENT_KEY = 'marker';
var Event = {
    ICON_LOADED: 'icon_loaded.' + EVENT_KEY,
    READY: 'ready.' + EVENT_KEY
};

var Marker = function (_Object) {
    _inherits(Marker, _Object);

    function Marker(options) {
        _classCallCheck(this, Marker);

        // Privates
        var _this = _possibleConstructorReturn(this, _Object.call(this, options));

        _this._icon;

        _this.setIcon(options.icon);
        _this.coordinates = options.coordinates;
        _this.buildGoogleObject();
        return _this;
    }

    Marker.prototype.buildGoogleObject = function buildGoogleObject() {
        var obj = this.setGoogleObject(obj);
    };

    Marker.prototype.setIcon = function setIcon(icon) {
        if (!(icon instanceof Image)) {
            var preload = new Image();
            preload.onload = function () {};

            preload.error = function () {};

            icon = new Image(icon);
            icon.onload;
        }

        this._icon = icon;
        return this;
    };

    Marker.prototype.icon = function icon() {
        return this._icon;
    };

    /**
     * On click callback.
     * @return {thisArg} Chainable.
     */


    Marker.prototype.click = function click() {
        return this;
    };

    /**
     * On mouse over callback.
     * @return {thisArg} Chainable.
     */


    Marker.prototype.mouseover = function mouseover() {
        return this;
    };

    /**
     * On mouse out callback.
     * @return {thisArg} Chainable.
     */


    Marker.prototype.mouseout = function mouseout() {
        return this;
    };

    /**
     * Show object on map.
     * @return {thisArg} Chainable.
     */


    Marker.prototype.show = function show() {
        this.googleObject().setMap(this.map);
        return this;
    };

    /**
     * Hide object from map.
     * @return {thisArg} Chainable.
     */


    Marker.prototype.hide = function hide() {
        this.googleObject().setMap(null);
        return this;
    };

    /**
     * Remove object forever.
     * @return {[type]} [description]
     */


    Marker.prototype.delete = function _delete() {
        this.destroy();
    };

    Marker.prototype.destroy = function destroy() {
        this.hide();
    };

    return Marker;
}(Object);

},{}],4:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint esnext: true */
// import {$document, $window, $html, $body} from '../utils/environment';
/**
 * Map Object class
 */
var Object = function () {
    function Object(options) {
        _classCallCheck(this, Object);

        // Associated google map
        this.element = options.element;
        this.map = options.map;
        this._googleObject;
    }

    Object.prototype.dispatchEvent = function dispatchEvent(event, detail) {
        var ev = new CustomEvent(event, detail);
        this.element.dispatchEvent(ev);
        return this;
    };

    Object.prototype.eventListener = function eventListener(event, callback) {
        this.element.addEventListener(event, function (e) {
            callback(e);
        });
    };

    /**
     * Abstract function
     * @return {GoogleObject} Google object whatever it is.
     */


    Object.prototype.buildGoogleObject = function buildGoogleObject() {};

    /**
     * Sets the google object
     * @param {[type]} obj [description]
     */


    Object.prototype.setGoogleObject = function setGoogleObject(obj) {
        this._googleObject = obj;
        return this;
    };

    /**
     * Returns the google object no matter what it is
     * @return {GoogleObject} Google object (abstract).
     */


    Object.prototype.googleObject = function googleObject() {
        return this._googleObject;
    };

    /**
     * Callback when the object is ready and on map.
     * @return {thisArg} Chainable.
     */


    Object.prototype.ready = function ready() {
        // Callback
        return this;
    };

    /**
     * On click callback.
     * @return {thisArg} Chainable.
     */


    Object.prototype.click = function click() {
        return this;
    };

    /**
     * On mouse over callback.
     * @return {thisArg} Chainable.
     */


    Object.prototype.mouseover = function mouseover() {
        return this;
    };

    /**
     * On mouse out callback.
     * @return {thisArg} Chainable.
     */


    Object.prototype.mouseout = function mouseout() {
        return this;
    };

    /**
     * Show object on map.
     * @return {thisArg} Chainable.
     */


    Object.prototype.show = function show() {
        this.googleObject().setMap(this.map);
        return this;
    };

    /**
     * Hide object from map.
     * @return {thisArg} Chainable.
     */


    Object.prototype.hide = function hide() {
        this.googleObject().setMap(null);
        return this;
    };

    /**
     * Remove object forever.
     * Aliase for `destroy()`
     * @return {[type]} [description]
     */


    Object.prototype.delete = function _delete() {
        this.destroy();
    };

    Object.prototype.destroy = function destroy() {
        this.hide();
    };

    return Object;
}();

},{}],5:[function(require,module,exports){
"use strict";

(function () {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $document = $(document);
var $window = $(window);
var $html = $(document.documentElement);
var $body = $(document.body);

exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;

},{}]},{},[1,2,3,4,5,6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXHNjcmlwdHNcXGVzNlxcQXBwLmpzIiwiYXNzZXRzXFxzY3JpcHRzXFxlczZcXENvbnRyb2xsZXIuanMiLCJhc3NldHNcXHNjcmlwdHNcXGVzNlxcTWFya2VyLmpzIiwiYXNzZXRzXFxzY3JpcHRzXFxlczZcXE9iamVjdC5qcyIsImFzc2V0c1xcc2NyaXB0c1xcZXM2XFxVdGlscy5qcyIsImFzc2V0c1xcc2NyaXB0c1xcZXM2XFx1dGlsc1xcZW52aXJvbm1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBOzswSkFEQTs7O0lBR00sRyxHQUNGLGVBQWM7QUFBQTtBQUViLEM7O0FBR0w7QUFDQTs7O0FBQ0EsQ0FBQyxZQUFZO0FBQ1QsV0FBTyxHQUFQLEdBQWEsR0FBYjtBQUNILENBRkQ7Ozs7Ozs7OztBQ1ZBOzswSkFEQTs7O0FBRUE7Ozs7QUFJSSxvQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQ2pCLGFBQUssU0FBTDtBQUNBLGFBQUssT0FBTDtBQUNBLGFBQUssS0FBTDtBQUNBLGFBQUssS0FBTDtBQUNIOztxQkFFRCxJLG1CQUFPLENBQ04sQzs7cUJBRUQsTyxzQkFBVSxDQUNULEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQkw7QUFDQTtBQUNBOzs7Ozs7O0FBT0EsSUFBTSxZQUFZLFFBQWxCO0FBQ0EsSUFBTSxRQUFRO0FBQ1Ysa0NBQTRCLFNBRGxCO0FBRVYsc0JBQXNCO0FBRlosQ0FBZDs7SUFLTSxNOzs7QUFDRixvQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBR2pCO0FBSGlCLHFEQUNqQixtQkFBTSxPQUFOLENBRGlCOztBQUlqQixjQUFLLEtBQUw7O0FBRUEsY0FBSyxPQUFMLENBQWEsUUFBUSxJQUFyQjtBQUNBLGNBQUssV0FBTCxHQUFtQixRQUFRLFdBQTNCO0FBQ0EsY0FBSyxpQkFBTDtBQVJpQjtBQVNwQjs7cUJBRUQsaUIsZ0NBQW9CO0FB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YUFBSyxJQUFMO0FBQ0gsSzs7Ozs7Ozs7QUM5R0wsQ0FBQyxZQUFZO0FBQ1gsTUFBSyxPQUFPLE9BQU8sV0FBZCxLQUE4QixVQUFuQyxFQUFnRCxPQUFPLEtBQVA7O0FBRWhELFdBQVMsV0FBVCxDQUF1QixLQUF2QixFQUE4QixNQUE5QixFQUF1QztBQUNyQyxhQUFTLFVBQVUsRUFBRSxTQUFTLEtBQVgsRUFBa0IsWUFBWSxLQUE5QixFQUFxQyxRQUFRLFNBQTdDLEVBQW5CO0FBQ0EsUUFBSSxNQUFNLFNBQVMsV0FBVCxDQUFzQixhQUF0QixDQUFWO0FBQ0EsUUFBSSxlQUFKLENBQXFCLEtBQXJCLEVBQTRCLE9BQU8sT0FBbkMsRUFBNEMsT0FBTyxVQUFuRCxFQUErRCxPQUFPLE1BQXRFO0FBQ0EsV0FBTyxHQUFQO0FBQ0E7O0FBRUYsY0FBWSxTQUFaLEdBQXdCLE9BQU8sS0FBUCxDQUFhLFNBQXJDOztBQUVBLFNBQU8sV0FBUCxHQUFxQixXQUFyQjtBQUNELENBYkQ7Ozs7Ozs7O0FDQUEsSUFBTSxZQUFlLEVBQUUsUUFBRixDQUFyQjtBQUNBLElBQU0sVUFBZSxFQUFFLE1BQUYsQ0FBckI7QUFDQSxJQUFNLFFBQWUsRUFBRSxTQUFTLGVBQVgsQ0FBckI7QUFDQSxJQUFNLFFBQWUsRUFBRSxTQUFTLElBQVgsQ0FBckI7O1FBRVMsUyxHQUFBLFM7UUFBVyxPLEdBQUEsTztRQUFTLEssR0FBQSxLO1FBQU8sSyxHQUFBLEsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHskZG9jdW1lbnR9IGZyb20gJy4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5jbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxufVxuXG4vLyBJSUZFIGZvciBsb2FkaW5nIHRoZSBhcHBsaWNhdGlvblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbihmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LkFwcCA9IEFwcDtcbn0pKCk7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5fSBmcm9tICcuL3V0aWxzL2Vudmlyb25tZW50Jztcbi8qKlxuICogQWJzdHJhY3QgTW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJGRvY3VtZW50ID0gJGRvY3VtZW50O1xuICAgICAgICB0aGlzLiR3aW5kb3cgPSAkd2luZG93O1xuICAgICAgICB0aGlzLiRodG1sID0gJGh0bWw7XG4gICAgICAgIHRoaXMuJGJvZHkgPSAkYm9keTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuLy8gaW1wb3J0IHskZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keX0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuLyoqXG4gKiBNYXAgT2JqZWN0XG4gKiBFdmVudHM6XG4gKiAtIElDT05fTE9BREVEXG4gKiAtIFxuICovXG5cbmNvbnN0IEVWRU5UX0tFWSA9ICdtYXJrZXInO1xuY29uc3QgRXZlbnQgPSB7XG4gICAgSUNPTl9MT0FERUQ6IGBpY29uX2xvYWRlZC4ke0VWRU5UX0tFWX1gLFxuICAgIFJFQURZOiAgICAgICBgcmVhZHkuJHtFVkVOVF9LRVl9YFxufTtcblxuY2xhc3MgTWFya2VyIGV4dGVuZHMgT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIFByaXZhdGVzXG4gICAgICAgIHRoaXMuX2ljb247XG5cbiAgICAgICAgdGhpcy5zZXRJY29uKG9wdGlvbnMuaWNvbik7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBvcHRpb25zLmNvb3JkaW5hdGVzO1xuICAgICAgICB0aGlzLmJ1aWxkR29vZ2xlT2JqZWN0KCk7XG4gICAgfVxuXG4gICAgYnVpbGRHb29nbGVPYmplY3QoKSB7XG4gICAgICAgIGxldCBvYmogPSBcblxuXG4gICAgICAgIHRoaXMuc2V0R29vZ2xlT2JqZWN0KG9iaik7XG4gICAgfVxuXG4gICAgc2V0SWNvbihpY29uKSB7XG4gICAgICAgIGlmICghKGljb24gaW5zdGFuY2VvZiBJbWFnZSkpIHtcbiAgICAgICAgICAgIGxldCBwcmVsb2FkID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBwcmVsb2FkLm9ubG9hZCA9ICgpID0+IHtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmVsb2FkLmVycm9yID0gKCkgPT4ge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGljb24gPSBuZXcgSW1hZ2UoaWNvbik7XG4gICAgICAgICAgICBpY29uLm9ubG9hZFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faWNvbiA9IGljb247XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGljb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pY29uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIGNsaWNrIGNhbGxiYWNrLlxuICAgICAqIEByZXR1cm4ge3RoaXNBcmd9IENoYWluYWJsZS5cbiAgICAgKi9cbiAgICBjbGljaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gbW91c2Ugb3ZlciBjYWxsYmFjay5cbiAgICAgKiBAcmV0dXJuIHt0aGlzQXJnfSBDaGFpbmFibGUuXG4gICAgICovXG4gICAgbW91c2VvdmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBtb3VzZSBvdXQgY2FsbGJhY2suXG4gICAgICogQHJldHVybiB7dGhpc0FyZ30gQ2hhaW5hYmxlLlxuICAgICAqL1xuICAgIG1vdXNlb3V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IG9iamVjdCBvbiBtYXAuXG4gICAgICogQHJldHVybiB7dGhpc0FyZ30gQ2hhaW5hYmxlLlxuICAgICAqL1xuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMuZ29vZ2xlT2JqZWN0KCkuc2V0TWFwKHRoaXMubWFwKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGlkZSBvYmplY3QgZnJvbSBtYXAuXG4gICAgICogQHJldHVybiB7dGhpc0FyZ30gQ2hhaW5hYmxlLlxuICAgICAqL1xuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuZ29vZ2xlT2JqZWN0KCkuc2V0TWFwKG51bGwpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgb2JqZWN0IGZvcmV2ZXIuXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgZGVsZXRlKCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG4vLyBpbXBvcnQgeyRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5fSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG4vKipcbiAqIE1hcCBPYmplY3QgY2xhc3NcbiAqL1xuY2xhc3MgT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIC8vIEFzc29jaWF0ZWQgZ29vZ2xlIG1hcFxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMubWFwID0gb3B0aW9ucy5tYXA7XG4gICAgICAgIHRoaXMuX2dvb2dsZU9iamVjdDtcbiAgICB9XG5cbiAgICBkaXNwYXRjaEV2ZW50KGV2ZW50LCBkZXRhaWwpIHtcbiAgICAgICAgbGV0IGV2ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50LCBkZXRhaWwpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChldik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCAoZSkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWJzdHJhY3QgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJuIHtHb29nbGVPYmplY3R9IEdvb2dsZSBvYmplY3Qgd2hhdGV2ZXIgaXQgaXMuXG4gICAgICovXG4gICAgYnVpbGRHb29nbGVPYmplY3QoKSB7fVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgZ29vZ2xlIG9iamVjdFxuICAgICAqIEBwYXJhbSB7W3R5cGVdfSBvYmogW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIHNldEdvb2dsZU9iamVjdChvYmopIHtcbiAgICAgICAgdGhpcy5fZ29vZ2xlT2JqZWN0ID0gb2JqO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBnb29nbGUgb2JqZWN0IG5vIG1hdHRlciB3aGF0IGl0IGlzXG4gICAgICogQHJldHVybiB7R29vZ2xlT2JqZWN0fSBHb29nbGUgb2JqZWN0IChhYnN0cmFjdCkuXG4gICAgICovXG4gICAgZ29vZ2xlT2JqZWN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ29vZ2xlT2JqZWN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHdoZW4gdGhlIG9iamVjdCBpcyByZWFkeSBhbmQgb24gbWFwLlxuICAgICAqIEByZXR1cm4ge3RoaXNBcmd9IENoYWluYWJsZS5cbiAgICAgKi9cbiAgICByZWFkeSgpIHtcbiAgICAgICAgLy8gQ2FsbGJhY2tcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gY2xpY2sgY2FsbGJhY2suXG4gICAgICogQHJldHVybiB7dGhpc0FyZ30gQ2hhaW5hYmxlLlxuICAgICAqL1xuICAgIGNsaWNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBtb3VzZSBvdmVyIGNhbGxiYWNrLlxuICAgICAqIEByZXR1cm4ge3RoaXNBcmd9IENoYWluYWJsZS5cbiAgICAgKi9cbiAgICBtb3VzZW92ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIG1vdXNlIG91dCBjYWxsYmFjay5cbiAgICAgKiBAcmV0dXJuIHt0aGlzQXJnfSBDaGFpbmFibGUuXG4gICAgICovXG4gICAgbW91c2VvdXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgb2JqZWN0IG9uIG1hcC5cbiAgICAgKiBAcmV0dXJuIHt0aGlzQXJnfSBDaGFpbmFibGUuXG4gICAgICovXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5nb29nbGVPYmplY3QoKS5zZXRNYXAodGhpcy5tYXApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIG9iamVjdCBmcm9tIG1hcC5cbiAgICAgKiBAcmV0dXJuIHt0aGlzQXJnfSBDaGFpbmFibGUuXG4gICAgICovXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5nb29nbGVPYmplY3QoKS5zZXRNYXAobnVsbCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBvYmplY3QgZm9yZXZlci5cbiAgICAgKiBBbGlhc2UgZm9yIGBkZXN0cm95KClgXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgZGVsZXRlKCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG59XG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gIGlmICggdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiICkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21FdmVudCAoIGV2ZW50LCBwYXJhbXMgKSB7XHJcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XHJcbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdDdXN0b21FdmVudCcgKTtcclxuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoIGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwgKTtcclxuICAgIHJldHVybiBldnQ7XHJcbiAgIH1cclxuXHJcbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcclxuXHJcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XHJcbn0pKCk7IiwiY29uc3QgJGRvY3VtZW50ICAgID0gJChkb2N1bWVudCk7XHJcbmNvbnN0ICR3aW5kb3cgICAgICA9ICQod2luZG93KTtcclxuY29uc3QgJGh0bWwgICAgICAgID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xyXG5jb25zdCAkYm9keSAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpO1xyXG5cclxuZXhwb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfTtcclxuIl19
