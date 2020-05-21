/**
 * @name BB Gmap Line
 * @version version 1.0
 * @author Bene Roch
 * @description
 * Map LINE
 *
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
BB.gmap.line = function (data, controller) {

    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.object.call(this, data, controller);

    // Chainable
    return this;
};

BB.gmap.line.prototype = Object.create(BB.gmap.object.prototype);

/**
 * Create gmap object
 *
 * @returns {google.maps.Polyline}
 */
BB.gmap.line.prototype.create_object = function () {
    return new google.maps.Polyline(this._options);
};

/**
 *
 * @param options
 * @returns {*}
 */
BB.gmap.line.prototype.parse_options = function (options) {
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
BB.gmap.line.prototype.init = function () {
    this.listeners();
    this.show();
    this.controller().place_loaded(this);
    return this;
};

/**
 * Get the object paths
 * Helper function
 *
 * @returns {*}
 */
BB.gmap.line.prototype.get_path = function () {
    return this.object().getPath();
};

/**
 * Set the path of the line on the object
 * Converts the given path into valid format
 *
 * @param path
 * @returns {BB.gmap.line}
 */
BB.gmap.line.prototype.set_path = function (path) {
    // Make sure path is defined as expected.
    path = this.convert_recursive_array_to_lat_lng(path);
    this.object().setPath(path);

    return this;
};

/**
 * AUTOMATICALLY SETS THE STYLE
 */
BB.gmap.line.prototype.set_styles = function (styles) {
    this.object().setOptions(styles);
    return this;
};

BB.gmap.line.prototype.get_styles = function () {
    return this._options.styles;
};

/**
 *
 * @param coords
 * @param index
 * @returns {*}
 */
BB.gmap.line.prototype.add_point = function (coords, index) {
    // Not good
    if (typeof coords !== 'object') {
        return false;
    }

    if (coords instanceof google.maps.LatLng) {
        coords = [coords.lat(), coords.lng()];
    }

    if ((!(coords instanceof google.maps.LatLng)) && (typeof coords[0] === 'undefined' || typeof coords[1] === 'undefined')) {
        // Something missing
        return false;
    }

    // Scope
    var that = this;

    var paths = this.get_path();

    // Allows to have empty path polygon
    // Allows to CREATE a new polygon
    if (typeof paths === 'undefined') {
        this.set_path([
            [coords.lat(), coords.lng()]
        ]);
    }

    paths = this.get_path();

    // If no index defined, add the point as the last point
    if (typeof index !== 'number') {
        index = paths.length;
    }

    paths.push(coords);
    this.set_path(paths);

    // Add marker on top of it
    if (this.data('editable')) {
        var marker = new BB.gmap.marker({
            coords:    coords,
            draggable: true, // The whole point of these.

            // icon: 'assets/images/marker-tri.png',
            icon: {
                path:  google.maps.SymbolPath.CIRCLE,
                scale: 4
            },

            editable:  true,
            ondragend: function (marker, event) {
                that.move_point(marker.object().index, [event.latLng.lat(), event.latLng.lng()]);
            },
            ondelete:  function (marker) {
                that.remove_point(marker.object().index);
                that.focus();

                if (!that.get_path().length) {
                    that.delete();
                }
            },
            index:     index
        }, that.controller());

        if (!this.__MARKERS) {
            this.__MARKERS = [];
        }
        this.__MARKERS[index] = marker;
    }

    return this;
};

/**
 * Adds point on map click
 */
BB.gmap.line.prototype.map_click = function (event) {

};


BB.gmap.line.prototype.listeners = function () {
    // Scope
    this.object().bbobject = this;

    this.clear_listeners();
    google.maps.event.addListener(this.object(), 'mouseover', this.mouse_over);
    google.maps.event.addListener(this.object(), 'mouseout', this.mouse_out);
    google.maps.event.addListener(this.object(), 'click', this.click);

};


/**
 * Remove all listeners associated with the current object
 * @return {this}
 */
BB.gmap.line.prototype.clear_listeners = function () {

    // Listener removal
    google.maps.event.clearListeners(this.object(), 'mouseover');
    google.maps.event.clearListeners(this.object(), 'mouseout');
    google.maps.event.clearListeners(this.object(), 'click');

    // Chainable
    return this;
};

/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.mouse_over = function (event) {
    var that  = this.bbobject;
    var _data = that.data();


    if (typeof _data.onmouseover === 'function') {
        _data.onmouseover(that, event);
    }

    var styles = that.get_data('styles');
    if (typeof styles.hover === 'object') {
        that.set_styles(styles.hover);
    }
};

/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.mouse_out = function (event) {
    var that  = this.bbobject;
    var _data = that.data();

    if (typeof _data.onmouseout === 'function') {
        _data.onmouseout(that, event);
    }

    var styles = that.get_data('styles');

    if (that.controller().focused(that.data('ident'))) {
        if (typeof styles.focused === 'object') {
            that.set_styles(styles.focused);
        }
    } else {
        that.set_styles(styles);
    }
};


/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.mouse_down = function (event) {
    // var that = this.bbobject;
    // Go back to original state
    // that.set_styles( that.get_data('styles') );
};


/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.mouse_up = function (event) {
    // var that = this.bbobject;
    // Go back to original state
    // that.set_styles( that.get_data('styles') );
};

/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.click = function (event) {
    // Scope
    var that  = this.bbobject;
    var _data = that.data();
    that.focus();

    if (typeof _data.onclick === 'function') {
        _data.onclick(that, event);
    } else if (typeof _data.onclick === 'string' && typeof window[_data.onclick] === 'function') {
        window[_data.onclick](that, event);
    }
};


/**
 * Set focus on the current item, tell so to the controller
 * @return this (chainable)
 */
BB.gmap.line.prototype.focus = function () {
    // Counter of ASYNC moves such as delete, into lost focus
    if (this.__DELETED) {
        return false;
    }

    if (!this.controller().focused(this.data('ident'))) {
        var styles = this.get_data('styles');
        if (typeof styles.focused === 'object') {
            this.set_styles(styles.focused);
        }

    }

    this.controller().set_focus(this);
    return this;
};

/**
 * Go to the original state of the object
 * @return this (chainable)
 */
BB.gmap.line.prototype.blur = function () {
    // Counter of ASYNC moves such as delete, into lost focus
    if (this.__DELETED) {
        return false;
    }
    this.set_styles(this.get_data('styles'));

    return this;
};

/**
 *
 * @return google LatLngBounds object
 */
BB.gmap.line.prototype.get_bounds = function () {
    // Scope
    var that = this;

    var bounds = new google.maps.LatLngBounds();
    var path   = that.object().getPaths();
    var p;
    for (var i = 0; i < path.getLength(); i++) {
        p = path.getAt(i);
        for (var ii = 0; ii < path.getLength(); ii++) {
            bounds.extend(path.getAt(ii));
        }
    }
    return bounds;
};

/**
 * returns a nested mcvarray in order to fit the polygon path declaration
 * @return MCVArray path
 */
BB.gmap.line.prototype.get_position = function () {
    var array = new google.maps.MVCArray();
    array.push(this.object().getPath());
    return array;
};


/**
 * @see BB.gmap.controller.export
 * @return data
 */
BB.gmap.line.prototype.export = function () {
    var _data = this.data();
    // At this point, we do not need these
    if (typeof _data.styles.path !== 'undefined') {
        delete _data.styles.path;
    }
    return this.data();
};

BB.gmap.line.prototype.delete = function () {
    if (typeof this.__MARKERS === 'object') {
        var i     = 0;
        var total = this.__MARKERS.length;
        if (total) {
            for (; i < total; i++) {
                this.remove_point(i);
            }
        }
    }

    // Parent
    return BB.gmap.object.prototype.delete.call(this);
};
