/* jshint esnext: true */
import {$document} from './utils/environment';

class App {
    constructor() {

    }
}

// IIFE for loading the application
// ==========================================================================
(function () {
    window.App = App;
})();

/* jshint esnext: true */
import {$document, $window, $html, $body} from './utils/environment';
/**
 * Abstract Module
 */
export default class {
    constructor(options) {
        this.$document = $document;
        this.$window = $window;
        this.$html = $html;
        this.$body = $body;
    }

    init() {
    }

    destroy() {
    }
}

/* jshint esnext: true */
// import {$document, $window, $html, $body} from '../utils/environment';
/**
 * Map Object
 * Events:
 * - ICON_LOADED
 * - 
 */

const EVENT_KEY = 'marker';
const Event = {
    ICON_LOADED: `icon_loaded.${EVENT_KEY}`,
    READY:       `ready.${EVENT_KEY}`
};

class Marker extends Object {
    constructor(options) {
        super(options);

        // Privates
        this._icon;

        this.setIcon(options.icon);
        this.coordinates = options.coordinates;
        this.buildGoogleObject();
    }

    buildGoogleObject() {
        let obj = 


        this.setGoogleObject(obj);
    }

    setIcon(icon) {
        if (!(icon instanceof Image)) {
            let preload = new Image();
            preload.onload = () => {

            }

            preload.error = () => {

            }
            
            icon = new Image(icon);
            icon.onload
        }

        this._icon = icon;
        return this;
    }

    icon() {
        return this._icon;
    }

    /**
     * On click callback.
     * @return {thisArg} Chainable.
     */
    click() {
        return this;
    }

    /**
     * On mouse over callback.
     * @return {thisArg} Chainable.
     */
    mouseover() {
        return this;
    }

    /**
     * On mouse out callback.
     * @return {thisArg} Chainable.
     */
    mouseout() {
        return this;
    }

    /**
     * Show object on map.
     * @return {thisArg} Chainable.
     */
    show() {
        this.googleObject().setMap(this.map);
        return this;
    }

    /**
     * Hide object from map.
     * @return {thisArg} Chainable.
     */
    hide() {
        this.googleObject().setMap(null);
        return this;
    }

    /**
     * Remove object forever.
     * @return {[type]} [description]
     */
    delete() {
        this.destroy();
    }

    destroy() {
        this.hide();
    }
}

/* jshint esnext: true */
// import {$document, $window, $html, $body} from '../utils/environment';
/**
 * Map Object class
 */
class Object {
    constructor(options) {
        // Associated google map
        this.element = options.element;
        this.map = options.map;
        this._googleObject;
    }

    dispatchEvent(event, detail) {
        let ev = new CustomEvent(event, detail);
        this.element.dispatchEvent(ev);
        return this;
    }

    eventListener(event, callback) {
        this.element.addEventListener(event, (e) => {
            callback(e);
        })
    }

    /**
     * Abstract function
     * @return {GoogleObject} Google object whatever it is.
     */
    buildGoogleObject() {}

    /**
     * Sets the google object
     * @param {[type]} obj [description]
     */
    setGoogleObject(obj) {
        this._googleObject = obj;
        return this;
    }

    /**
     * Returns the google object no matter what it is
     * @return {GoogleObject} Google object (abstract).
     */
    googleObject() {
        return this._googleObject;
    }

    /**
     * Callback when the object is ready and on map.
     * @return {thisArg} Chainable.
     */
    ready() {
        // Callback
        return this;
    }

    /**
     * On click callback.
     * @return {thisArg} Chainable.
     */
    click() {
        return this;
    }

    /**
     * On mouse over callback.
     * @return {thisArg} Chainable.
     */
    mouseover() {
        return this;
    }

    /**
     * On mouse out callback.
     * @return {thisArg} Chainable.
     */
    mouseout() {
        return this;
    }

    /**
     * Show object on map.
     * @return {thisArg} Chainable.
     */
    show() {
        this.googleObject().setMap(this.map);
        return this;
    }

    /**
     * Hide object from map.
     * @return {thisArg} Chainable.
     */
    hide() {
        this.googleObject().setMap(null);
        return this;
    }

    /**
     * Remove object forever.
     * Aliase for `destroy()`
     * @return {[type]} [description]
     */
    delete() {
        this.destroy();
    }

    destroy() {
        this.hide();
    }
}

(function () {
  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
const $document    = $(document);
const $window      = $(window);
const $html        = $(document.documentElement);
const $body        = $(document.body);

export { $document, $window, $html, $body };
