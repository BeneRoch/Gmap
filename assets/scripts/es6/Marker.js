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
        this._dimensions;

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
                this.setDimensions({
                    height: preload.height,
                    width: preload.width
                });
                
            }

            preload.error = () => {

            }

            icon = new Image(icon);
        }

        this._icon = icon;
        return this;
    }

    icon() {
        return this._icon;
    }

    setDimensions(dimensions)
    {
        this._dimensions = dimensions;
        return this;
    }

    dimensions() {
        return this._dimensions;
    }

    /**
     * On click callback.
     * @return {this} Chainable.
     */
    click() {
        return this;
    }

    /**
     * On mouse over callback.
     * @return {this} Chainable.
     */
    mouseover() {
        return this;
    }

    /**
     * On mouse out callback.
     * @return {this} Chainable.
     */
    mouseout() {
        return this;
    }

    /**
     * Show object on map.
     * @return {this} Chainable.
     */
    show() {
        this.googleObject().setMap(this.map);
        return this;
    }

    /**
     * Hide object from map.
     * @return {this} Chainable.
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

    /**
     * Destroy module.
     * @return {this} [description]
     */
    destroy() {
        this.hide();
    }
}
