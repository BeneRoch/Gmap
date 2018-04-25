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
 * #Line object class
 * Accepts all datas at first
 * Needs a google.maps.Polyline() object ( data[ 'line' ] ) in order
 * be functionnal with all methods
 *
 * ##Options ( data )
 *
 * - type ( line // polygon )
 *
 * - styles
 * 	- strokeColor
 * 	- strokeOpacity
 * 	- strokeWeight
 * 	- fillColor
 * 	- fillOpacity
 *
 * - editable (makes map drawable)
 *
 * ##Methods
 *
 *
 */
BB.gmap.line = function(data, controller) {
    // This is a line + polygon concept
    // This belongs here
    this.__STYLES = undefined;
    this.__PATHS = undefined;

    // One marker per point to make it editable
    this.__MARKERS = [];

    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.object.call(this, data, controller);


    // Chainable
    return this;
};

BB.gmap.line.prototype = Object.create(BB.gmap.object.prototype);

/**
 *
 */
BB.gmap.line.prototype.init = function() {
    var _data = this.data();

    // Set styles
    if (typeof _data.styles != 'object') {
        this.set_data({
            'styles': this.controller().data('default_styles')
        });
    }
    this.add_styles(_data.styles);

    // Default = Empty array
    // Makes it possible to DRAW a new line or polygon
    this.set_paths([]);

    // Set paths
    if (typeof _data.paths == 'object') {
        var i = 0;
        var total = _data.paths.length;
        for (; i < total; i++) {
            this.add_point(_data.paths[i]);
        }
    }


    if (this.get_paths() && this.get_styles()) {
        this.display();
    }

    // Allow editable from options
    if (_data.editable) {
        this.set_editable(_data.editable);
    }

    this.listeners();
    this.controller().place_loaded(this);
    return this;
};

/**
 * Pretty much the same as init, but removing all markers associated
 * and all listeners to get a fresh start.
 *
 */
BB.gmap.line.prototype.redraw = function() {
    // Scope
    var that = this;

    // Paths
    var paths = this.get_paths();
    var i = 0;
    var total = paths.length;

    var new_paths = [];

    for (; i < total; i++) {
        new_paths.push([paths.getAt(i).lat(), paths.getAt(i).lng()]);

        // if (typeof this.__MARKERS[ i ] != 'undefined') {
        // 	this.__MARKERS[ i ].hide();
        // }
    }

    this.set_data({
        paths: new_paths
    });

    // this.init();
};



/**
 * Getter & setters
 */

BB.gmap.line.prototype.add_styles = function(styles) {
    // Add validation here.
    this.__STYLES = styles;
};

/**
 * AUTOMATICALLY SETS THE STYLE
 */
BB.gmap.line.prototype.set_styles = function(styles) {
    this.add_styles(styles);
    this.display();
    return this;
};

BB.gmap.line.prototype.get_styles = function() {
    return this.__STYLES;
};


BB.gmap.line.prototype.set_paths = function(paths) {
    if (typeof paths != 'object') {
        this.error('Invalid paths at BB.gmap.line.set_paths :' + paths);
        return;
    }

    if (!(paths[0] instanceof google.maps.LatLng)) {
        var i = 0;
        var count = paths.length;
        var coords = new google.maps.MVCArray();
        for (; i < count; i++) {
            if (typeof paths[i] != 'object') {
                // Error.
                break;
            }
            var push = this.controller().translate_coords(paths[i]);

            coords.insertAt(coords.length, push);
        }
        paths = coords;
    }
    this.__PATHS = paths;
};

/**
 * Return paths
 * @return coord MVCArray paths
 */
BB.gmap.line.prototype.get_paths = function() {
    return this.__PATHS;
};

BB.gmap.line.prototype.display = function() {
    var _data = this.data();

    var styles = this.get_styles();
    if (typeof styles == 'undefined') {
        this.error('Undefined styles at BB.gmap.line.display : ' + styles);
    }

    var paths = this.get_paths();

    if (typeof paths == 'undefined') {
        this.error('Undefined paths at BB.gmap.line.display : ' + paths);
    }

    styles.path = paths;

    if (typeof this.object() != 'undefined') {
        this.object().setOptions(styles);
    } else {
        var line = new google.maps.Polyline(styles);
        this.set_object(line);
    }

    this.set_map(this.controller().map());

    this.update_coords();

    return this;
};

BB.gmap.line.prototype.refresh = function() {
    var opts = this.data('_opts');
    var line = this.object();
    line.setOptions(opts);
};


/**
 * @param path Coords or the point
 */
BB.gmap.line.prototype.add_point = function(path, index) {
    // Not good
    if (typeof path != 'object') {
        return false;
    }
    // Not good.
    if (!(path instanceof google.maps.LatLng)) {
        path = this.controller().translate_coords(path);
    }
    if ((!(path instanceof google.maps.LatLng)) && (typeof path[0] == 'undefined' || typeof path[1] == 'undefined')) {
        // Something missing
        return false;
    }
    // Scope
    var that = this;


    var paths = this.get_paths();

    // Allows to have empty path polygon
    // Allows to CREATE a new polygon
    if (typeof paths == 'undefined') {
        this.set_paths([
            [path.lat(), path.lng()]
        ]);
    }
    paths = this.get_paths();

    // If no index defined, add the point as the last point
    if (typeof index != 'number') {
        index = paths.length;
    }

    paths.insertAt(index, path);

    // Add marker on top of it
    if (this.data('editable')) {
        var marker = new BB.gmap.marker({
            coords: [path.lat(), path.lng()],
            draggable: true, // The whole point of these.

            // icon: 'assets/images/marker-tri.png',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 4
            },

            editable: true,
            ondragend: function(marker, event) {
                that.move_point(marker.object().index, [event.latLng.lat(), event.latLng.lng()]);
            },
            ondelete: function(marker) {
                that.remove_point(marker.object().index);
                that.focus();

                if (!that.get_paths().length) {
                    that.delete();
                }
            },
            index: index
        }, that.controller());

        if (!this.__MARKERS) {
            this.__MARKERS = [];
        }
        this.__MARKERS[index] = marker;
    }

    return this;
};

/**
 * When dragging a marker to change the point
 * or whatever concerning the moving of a single point on
 * a polygon
 *
 * @param {Integer} index Index of the 'point'
 * @param {Object} path Coordinates of the new emplacement
 * @return this || false
 */
BB.gmap.line.prototype.move_point = function(index, path) {
    var paths = this.get_paths();
    if (typeof paths != 'object') {
        // How can you move something inexistant?
        this.error('You can not move a point when no path is given at BB.gmap.line.move_point( index, path )');
        return false;
    }
    if (!path) {
        this.error('Required arguments index:integer and path:object at BB.gmap.line.move_point( index, path )');
        return false;
    }

    // Not good.
    if (!(path instanceof google.maps.LatLng)) {
        path = this.controller().translate_coords(path);
    }
    if ((!(path instanceof google.maps.LatLng)) && (typeof path[0] == 'undefined' || typeof path[1] == 'undefined')) {
        // Something missing
        return false;
    }
    // Scope
    var that = this;

    paths.setAt(index, path);

    this.update_coords();

    return this;
};

/**
 * Remove one point from the polygon
 * @param {Integer} Index
 * @return this (chainable)
 */
BB.gmap.line.prototype.remove_point = function(index) {
    var paths = this.get_paths();
    if (typeof paths != 'object') {
        // How can you move something inexistant?
        this.error('You can not move a point when no path is given at BB.gmap.line.remove_point( index, path )');
        return false;
    }

    // Remove that paths.
    paths.removeAt(index);

    if (typeof this.__MARKERS[index] != 'undefined') {
        this.__MARKERS[index].hide();
        this.__MARKERS.splice(index, 1);
    }

    var _m = this.__MARKERS;
    for (var i in _m) {
        _m[i].object().index = parseInt(i);
    }

    this.redraw();


    this.update_coords();
    return this;
};


/**
 * @param boolean
 */
BB.gmap.line.prototype.set_editable = function(param) {
    if (!param) {
        this.set_data({
            'editable': false
        });
        // this.controller().set_editable(false);
        this.hide_markers();
        // No need to remove focus here
        return this;
    }

    // Add listeners and stuff
    this.set_data({
        'editable': true
    });
    this.show_markers();
    // Add focus when setting editable.
    this.focus();

    return this;

};

/**
 * Show all markers
 * return this (chainable)
 */
BB.gmap.line.prototype.show_markers = function() {
    for (var i = 0; i < this.__MARKERS.length; i++) {
        this.__MARKERS[i].show();
    }

    return this;
}

/**
 * Hide all markers
 * return this (chainable)
 */
BB.gmap.line.prototype.hide_markers = function() {
    var focused = this.controller().focused();

    for (var i = 0; i < this.__MARKERS.length; i++) {
        this.__MARKERS[i].hide();
    }

    return this;
}

/**
 * Adds point on map click
 */
BB.gmap.line.prototype.map_click = function(event) {
    this.add_point(event.latLng);
};


/**
 * Enables or disable draggable
 * @return this (chainable)
 */
BB.gmap.line.prototype.set_draggable = function(bool) {
    var styles = this.get_styles();

    if (!bool) {
        styles.draggable = false;
    } else {
        styles.draggable = true;
    }

    this.set_styles(styles);
    return this;

};



BB.gmap.line.prototype.listeners = function() {
    // Scope
    var that = this;
    that.object().bbobject = that;

    this.clear_listeners();
    google.maps.event.addListener(that.object(), 'mouseover', that.mouse_over);
    google.maps.event.addListener(that.object(), 'mouseout', that.mouse_out);
    google.maps.event.addListener(that.object(), 'click', that.click);

};


/**
 * Remove all listeners associated with the current object
 * @return {thisArg} [Chainable]
 */
BB.gmap.line.prototype.clear_listeners = function() {
    // Scope
    var that = this;

    // Listener removal
    google.maps.event.clearListeners(that.object(), 'mouseover');
    google.maps.event.clearListeners(that.object(), 'mouseout');
    google.maps.event.clearListeners(that.object(), 'click');

    // Chainable
    return this;
};

/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.mouse_over = function(event) {
    var that = this.bbobject;
    var _data = that.data();

    if (typeof _data.onmouseover == 'function') {
        _data.onmouseover(that, event);
    }

    var styles = that.get_data('styles');
    if (typeof styles.hover == 'object') {
        that.set_styles(styles.hover);
    }
};

/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.mouse_out = function(event) {
    var that = this.bbobject;
    var _data = that.data();

    if (typeof _data.onmouseout == 'function') {
        _data.onmouseout(that, event);
    }

    var styles = that.get_data('styles');

    if (that.controller().focused(that.data('ident'))) {
        if (typeof styles.focused == 'object') {
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
BB.gmap.line.prototype.mouse_down = function(event) {
    var that = this.bbobject;
    // Go back to original state
    // that.set_styles( that.get_data('styles') );
};


/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.mouse_up = function(event) {
    var that = this.bbobject;
    // Go back to original state
    // that.set_styles( that.get_data('styles') );
};

/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.line.prototype.click = function(event) {
    // Scope
    var that = this.bbobject;
    var _data = that.data();
    that.focus();

    if (typeof _data.onclick == 'function') {
        _data.onclick(that, event);
    } else if (typeof _data.onclick == 'string' && typeof window[_data.onclick] == 'function') {
        window[_data.onclick](that, event);
    }
};


/**
 * Set focus on the current item, tell so to the controller
 * @return this (chainable)
 */
BB.gmap.line.prototype.focus = function() {
    // Counter of ASYNC moves such as delete, into lost focus
    if (this.__DELETED) {
        return false;
    }

    if (this.controller().focused(this.data('ident'))) {
        this.controller().set_focus(this);
        return this;
    }

    this.controller().set_focus(this);

    var styles = this.get_data('styles');
    if (typeof styles.focused == 'object') {
        this.set_styles(styles.focused);
    }

    // Markers when selected AND editable
    if (this.data('editable')) {
        this.show_markers();
    }

    return this;
};

/**
 * Go to the original state of the object
 * @return this (chainable)
 */
BB.gmap.line.prototype.blur = function() {
    // Counter of ASYNC moves such as delete, into lost focus
    if (this.__DELETED) {
        return false;
    }
    this.set_styles(this.get_data('styles'));
    // No markers when not selected
    // this.hide_markers();

    return this;
};

/**
 *
 * @return google LatLngBounds object
 */
BB.gmap.line.prototype.get_bounds = function() {
    // Scope
    var that = this;

    var bounds = new google.maps.LatLngBounds();
    var paths = that.object().getPaths();
    var path;
    for (var i = 0; i < paths.getLength(); i++) {
        path = paths.getAt(i);
        for (var ii = 0; ii < path.getLength(); ii++) {
            bounds.extend(path.getAt(ii));
        }
    }
    return bounds;
};

/**
 * returns a nested mcvarray in order to fit the polygon paths declaration
 * @return MCVArray paths
 */
BB.gmap.line.prototype.get_position = function() {
    var array = new google.maps.MVCArray();
    array.push(this.object().getPath());
    return array;
};

/**
 * Make dure the coords data get's updated everytime it changes, for export
 * @return this (chainable)
 */
BB.gmap.line.prototype.update_coords = function() {
    var paths = this.get_paths();
    var ret = [];
    paths.forEach(function(p) {
        ret.push([p.lat(), p.lng()]);
    });

    this.set_data({
        paths: ret
    });

    return this;
};


/**
 * @see BB.gmap.controller.export
 * @return data
 */
BB.gmap.line.prototype.export = function() {
    this.update_coords();

    var _data = this.data();
    // At this point, we do not need these
    if (typeof _data.styles.path != 'undefined') {
        delete _data.styles.path;
    }
    return this.data();
};

BB.gmap.line.prototype.delete = function() {
    var i = 0;
    var total = this.__MARKERS.length;
    if (total) {
        for (; i < total; i++) {
            this.remove_point(i);
        }
    }

    // Index stuff before doesn't seem to work.
    this.hide_markers();

    // Parent
    BB.gmap.object.prototype.delete.call(this);
};