/**
 * @name BB Gmap Bike Layer
 */

var BB = BB || {};

BB.gmap = BB.gmap || {};

/**
 * Line object class
 *
 * @param data
 * @param controller
 * @returns {BB.gmap}
 */
BB.gmap.biker_layer = function (data, controller) {

    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.object.call(this, data, controller);

    // Chainable
    return this;
};

BB.gmap.biker_layer.prototype = Object.create(BB.gmap.object.prototype);

/**
 * Create gmap object
 *
 * @returns {google.maps.BicyclingLayer}
 */
BB.gmap.biker_layer.prototype.create_object = function () {
    return new google.maps.BicyclingLayer(this._options);
};

/**
 *
 * @param options
 * @returns {*}
 */
BB.gmap.biker_layer.prototype.parse_options = function (options) {
    delete options.type;
    options.path = this.convert_recursive_array_to_lat_lng(options.path);
    if (typeof options.styles === 'undefined') {
        options.styles = this.controller().default_styles();
    }

    var styles = options.styles;
    options = this.extend(options, styles);
    return options;
};

/**
 *
 */
BB.gmap.bike_layer.prototype.init = function () {
    this.listeners();
    this.show();
    this.controller().place_loaded(this);
    return this;
};
