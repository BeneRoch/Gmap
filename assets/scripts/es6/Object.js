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
