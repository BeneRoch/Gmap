var BB = BB || {};

BB.gmap = BB.gmap || {};

BB.gmap.object = function (data, controller) {

    // Set controller on current class
    // Allows map awareness and default options awareness
    this._controller = controller;

    // Parse options as they should be for the google.maps object
    this._options = this.parse_options(data);

    this.__DELETED = false;

    // Set data
    this.set_data(this._options);

    this.set_object(this.create_object());

    this.init();

    this.controller().loading_place(this.ident());

    return this;
};


BB.gmap.object.prototype = new BB.base();

/**
 * Require google object
 * @return this (chainable)
 */
BB.gmap.object.prototype.set_object = function (object) {
    this._object = object;
    return this;
};

/**
 * Return google object
 * @return google.maps.object()
 */
BB.gmap.object.prototype.object = function () {
    return this._object;
};

/**
 *
 * @returns {*} Map controller
 */
BB.gmap.object.prototype.controller = function () {
    return this._controller;
};

/**
 * Map controller
 *
 * @param ctrl
 * @returns {BB.gmap.object}
 */
BB.gmap.object.prototype.set_controller = function (ctrl) {
    this._controller = ctrl;

    return this;
};

/**
 * Must be an instance of the google map object
 *
 * @param map google.maps.Map
 * @returns {BB.gmap.object}
 */
BB.gmap.object.prototype.set_map = function (map) {
    this.object().setMap(map);

    return this;
};


/**
 * Allows to defines an array of coords [ [lat, lng], [lat, lng] ] as
 * a valid path for the line.
 * Transforms the said array into [ { lat: lat, lng: lng }, { lat: lat, lng: lng } ]
 *
 * @param arr
 * @returns {*}
 */
BB.gmap.object.prototype.convert_recursive_array_to_lat_lng = function(arr)
{
    // Convert point to lat/lng
    if (arr.length === 2) {
        if (typeof arr[0] !== 'object' && typeof arr[1] !== 'object') {
            return { lat: parseFloat(arr[0]), lng: parseFloat(arr[1]) };
        }
    }

    // Convert path to lat/lng
    for (var k in arr) {
        if (typeof arr[k] !== 'object') {
            continue;
        }

        arr[k] = this.convert_recursive_array_to_lat_lng(arr[k]);
    }

    return arr;
};

/**
 * Default
 *
 * @param event
 * @returns {BB.gmap.object}
 */
BB.gmap.object.prototype.map_click = function (event) {
    return this;
};


/**
 * Show the marker
 *
 * @return this (chainable)
 */
BB.gmap.object.prototype.show = function () {
    this.set_map(this.controller().map());
    return this;
};

/**
 * Hide the marker
 * @return this (chainable)
 */
BB.gmap.object.prototype.hide = function () {
    this.set_map(null);
    return this;
};

/**
 * Deletes the object FOREVER
 * @return this (chainable)
 */
BB.gmap.object.prototype.delete = function () {
    this.__DELETED = true;
    var _object    = this.object();
    if (typeof _object === 'undefined') {
        this.error('No object defined at BB.gmap.object.delete()');
        return this;
    }
    this.clear_listeners();
    this.set_map(null);

    var _data = this.data();
    if (typeof _data.ondelete === 'function') {
        _data.ondelete(this);
    }

    // Delete by Ident
    this.controller()._delete(this.data('type'), this.ident());

    return this;
};


/**
 * ABSTRACT METHODS
 * These are not really abstract, but should be
 * These only serve documentation purpose.
 * All object extending this class should declare these functions
 */


/**
 * Interface
 */
BB.gmap.object.prototype.parse_options = function (options) {
    return options;
};
BB.gmap.object.prototype.create_object = function () {
};
BB.gmap.object.prototype.init            = function () {
    return this;
};
BB.gmap.object.prototype.display         = function () {
    return this;
};
BB.gmap.object.prototype.focus           = function () {
    return this;
};
BB.gmap.object.prototype.blur            = function () {
    return this;
};
BB.gmap.object.prototype.get_bounds      = function () {
    return this;
};
BB.gmap.object.prototype.get_position    = function () {
    return this;
};
BB.gmap.object.prototype.clear_listeners = function () {
    return this;
};


/**
 * @see BB.gmap.controller.export
 * @return data
 */
BB.gmap.object.prototype.export = function () {
    return this.data();
};
