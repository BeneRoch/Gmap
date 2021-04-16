/**
 * @name BB Gmap Line
 */

var BB = BB || {};

BB.gmap = BB.gmap || {};


/**
 * Class polygon
 *
 * @param data
 * @param controller
 * @returns {BB.gmap}
 */
BB.gmap.polygon = function (data, controller) {
    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.line.call(this, data, controller);

    return this;
};


/**
 * Extends BB.gmap.line
 */
BB.gmap.polygon.prototype = Object.create(BB.gmap.line.prototype);

/**
 * Create gmap object
 *
 * @returns {google.maps.Polygon}
 */
BB.gmap.polygon.prototype.create_object = function()
{
    return new google.maps.Polygon(this._options);
};

/**
 *
 * @param options
 * @returns {*}
 */
BB.gmap.polygon.prototype.parse_options = function(options)
{
    options.paths = this.convert_recursive_array_to_lat_lng(options.paths);


    if (typeof options.styles === 'undefined') {
        options = Object.assign(options, this.controller().default_styles());
    } else {
        options = Object.assign(options, options.styles);
    }
    return options;
};

/**
 *
 * @returns {*}
 */
BB.gmap.polygon.prototype.get_paths = function()
{
    return this.__PATHS;
};

/**
 * Set paths and convert them to valid information
 * @param paths
 */
BB.gmap.polygon.prototype.set_paths = function(paths)
{
    this.__PATHS = this.convert_recursive_array_to_lat_lng(paths);
    this.object().setPaths(this.__PATHS);
};

/**
 *
 * @returns {*}
 */
BB.gmap.polygon.prototype.get_position = function () {
    return this.object().getPaths();
};
