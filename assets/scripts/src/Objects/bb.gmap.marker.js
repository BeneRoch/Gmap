/**
 * @name BB Gmap controller
 * @version version 1.0
 * @author Bene Roch
 * @description
 * MAP Controller
 * Controller for a google map object
 * This makes it possible to track all whats going on
 * with the google map
 */

var BB = BB || {};

BB.gmap = BB.gmap || {};

BB.gmap.statics = BB.gmap.statics || {};

/**
 * #Marker object class
 * Accepts all datas at first
 * Needs a google.maps.object() object ( data[ 'marker' ] ) in order
 * be functionnal with all methods
 *
 * ##Options ( options {} )
 *
 *
 * ##Methods
 *
 *
 */
BB.gmap.marker = function(data, controller) {
    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.object.call(this, data, controller);

    this._image = undefined;
    this._ready = false;

    // Status vars
    this._image_loaded = false;
    this._marker_loaded = false;

    // Infobox if needed
    this.__INFOBOX = undefined;

    //
    this._listeners = false;

    // Chainable
    return this;
};

/**
 * Create a google map object prototype
 * This means the object will have predefined methods such as:
 * - object()
 * - set_object()
 * - controller()
 * - set_controller()
 * - set_map()
 * - show()
 * - hide()
 */
BB.gmap.marker.prototype = Object.create(BB.gmap.object.prototype);

/**
 * Create gmap object
 *
 * @returns {google.maps.Polygon}
 */
BB.gmap.marker.prototype.create_object = function()
{
    return new google.maps.Marker(this._options);
};

/**
 *
 * @param options
 * @returns {*}
 */
BB.gmap.marker.prototype.parse_options = function(options)
{
    delete options.type;
    options.position = this.convert_recursive_array_to_lat_lng(options.position);
    return options;
};

/**
 *
 * @returns {BB.gmap.marker}
 */
BB.gmap.marker.prototype.init = function() {
    console.log(this.object());

    // Process image before showing.
    this.show();

    return this;
};

/**
 * Sets the image for the icon, preloads it
 * Calls the this.set_icon() function after loading
 *
 * @return this (chainable)
 */

/**
 * Allowed:
 * https://path.to/image.jpg
 * {
 *     src: https://path.to/image.jpg
 *     width: 42,
 *     height: 42
 * }
 *
 * @param src
 * @returns {BB.gmap.marker}
 */
BB.gmap.marker.prototype.set_image = function(src, success, error) {

    if (typeof src === 'string') {
        src = { src: src };
    }

    if (typeof src !== 'object') {
        // Error
        return this;
    }


    var img = new Image();

    img.data = this;
    img.onload = function() {
        // Done
        if (typeof success === 'function') {
            success();
        }
    };

    img.onerror = function() {
        // Failed
        if (typeof error === 'function') {
            error();
        }
    };

    img.src = src.src;

    if (typeof src.width !== 'undefined') {
        img.width = src.width;
    }

    if (typeof src.height !== 'undefined') {
        img.height = src.height;
    }

    this._image = img;

    return this;
};


/**
 *
 * @returns {*}
 */
BB.gmap.marker.prototype.display = function() {

    var height, width;

    var icon = this.icon();
    if (!(icon instanceof Image)) {
        // Means we are probably dealing with a PATH object
        if (typeof icon.path === 'string') {
            // Yup, was right
            if (typeof icon.height !== 'undefined' && typeof icon.height !== 'object') {
                height = parseInt(icon.height);
            }
            if (typeof icon.width !== 'undefined' && typeof icon.width !== 'object') {
                width = parseInt(icon.width);
            }
            icon.anchor = new google.maps.Point((width / 2), height);
            options.icon = icon;
        }
    }

    // Mini extend
    var custom_options = (typeof _data.options === 'object') ? _data.options : {};
    for (var k in custom_options) {
        options[k] = custom_options[k];
    }

    if (this.icon().src) {
        width = parseFloat(this.icon().width);
        height = parseFloat(this.icon().height);
        options.icon = new google.maps.MarkerImage(
            // image src
            this.icon().src,
            // Width, Height.
            new google.maps.Size(width, height),
            // Origin for this image; X, Y.
            new google.maps.Point(0, 0),
            // Anchor for this image; X, Y.
            new google.maps.Point((width / 2), height),
            new google.maps.Size(width, height)
        );
    }

    if (typeof this.object() !== 'undefined') {
        this.object().setOptions(options);
    } else {
        var marker = new google.maps.Marker(options);
        this.set_marker(marker);
    }

    if (!this._listeners) {
        this.listeners();
        this._listeners = true;
        this.marker_loaded();
    }

    // From BB.gmap.line
    // If hidden, don't show it yet.
    if (this.data('hidden')) {
        this.hide();
    }

    return this;
};


/**
 * Do whatever you want upon marker load
 * @return {thisArg}
 */
BB.gmap.marker.prototype.marker_loaded = function() {
    var _data = this.data();

    if (typeof _data.loaded_callback === 'function') {
        _data.loaded_callback(this);
    }

    if (this.controller().data('use_clusterer')) {
        // Uses clusterer_options set on the controller's data
        this.controller().activate_clusterer();
    }

    this.controller().place_loaded(this);
    return this;
};

/**
 * Require google marker object
 * Called only one, without getter
 * This is basicly an override of the set_object method
 *
 * @return this (chainable)
 */
BB.gmap.marker.prototype.set_marker = function(marker) {
    if (this._marker_loaded) {
        // Error
        this.error('There is already a marker affected to this instanciation of a [BB.gmap.marker] ( ' + this.ident() + ' )');
        return this;
    }
    this._marker_loaded = true;

    this.set_object(marker);
    return this;
};

/**
 * Sets or remove listeners according to plan and / but mainly options.
 *
 */
BB.gmap.marker.prototype.listeners = function() {
    // Marker
    var marker = this.object();
    marker.bbobject = this;

    if (this.data('draggable')) {
        google.maps.event.addListener(marker, 'dragend', this.dragend);
    }

    // click listeners
    // No condition, which is different to the dragend option
    // We might always use the click event, I see no reason to make
    // it optional. Options will occur in the event handler.
    google.maps.event.addListener(this.object(), 'click', this.onclick);
    google.maps.event.addListener(this.object(), 'mouseover', this.mouse_over);
    google.maps.event.addListener(this.object(), 'mouseout', this.mouse_out);

};

BB.gmap.marker.prototype.clear_listeners = function() {
    google.maps.event.clearListeners(this.object(), 'mouseover');
    google.maps.event.clearListeners(this.object(), 'mouseout');
    google.maps.event.clearListeners(this.object(), 'click');
    if (this.data('draggable')) {
        google.maps.event.clearListeners(this.object(), 'dragend');
    }

    return this;
};

/**
 * Event handler
 * Dragend event handler. Calls the callback if it exists
 *
 * this = marker object
 * @param {Event} event
 */
BB.gmap.marker.prototype.dragend = function(event) {
    // Scope
    var that = this.bbobject;

    var _data = that.data();

    if (typeof _data.ondragend === 'function') {
        _data.ondragend(that, event);
    }
    that.set_data({
        coords: [event.latLng.lat(), event.latLng.lng()]
    });

    that.focus();
};

/**
 * Event handler
 * Click event handler. Calls the callback if it exists
 * Used to store the index of the current marker
 *
 * this = marker object
 * @param {Event} event
 */
BB.gmap.marker.prototype.onclick = function(event) {
    // Scope
    var that = this.bbobject;
    var _data = that.data();

    if (typeof _data.onclick === 'function') {
        _data.onclick(event, that);
    } else if (typeof _data.onclick === 'string' && typeof window[_data.onclick] === 'function') {
        window[_data.onclick](that, event);
    }

    that.focus();
};

/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.marker.prototype.mouse_over = function(event) {
    var that = this.bbobject;
    var _data = that.data();

    if (typeof _data.onmouseover === 'function') {
        _data.onmouseover(that, event);
    }
};

/**
 * `this` is NOT a BB.gmap.line object
 * @see this.listeners()
 * @param event
 */
BB.gmap.marker.prototype.mouse_out = function(event) {
    var that = this.bbobject;
    var _data = that.data();

    if (typeof _data.onmouseout === 'function') {
        _data.onmouseout(that, event);
    }
};

/**
 * marker-selected.png
 */
BB.gmap.marker.prototype.focus = function() {
    this.check_infobox(true);
    this.controller().set_focus(this);

    // Data
    var _data = this.data();

    // Selected icon
    if (_data.icon_selected) {
        if (typeof _data.icon_selected === 'object') {
            this.set_icon(_data.icon_selected);
        } else {
            this.set_image(_data.icon_selected);
        }
    }
};

BB.gmap.marker.prototype.blur = function() {
    this.check_infobox(false);
    // Mechanics calls this methods upon map reset
    // We wanna check if the place still exists in the map data entry
    if (!this.controller().get_place(this.ident())) {
        return false;
    }

    // Data
    var _data = this.data();

    // Selected icon
    if (_data.icon_selected) {
        // No need to put back the icon if there's not selected icon specified.
        if (typeof _data.icon === 'object') {
            this.set_icon(_data.icon);
        } else {
            this.set_image(_data.icon);
        }
    }
};

/**
 *
 * @param visible
 * @returns {BB.gmap.marker}
 */
BB.gmap.marker.prototype.check_infobox = function(visible) {
    var that = this;
    var _data = this.data();

    if (_data.infobox) {
        if (that.__INFOBOX) {
            if (that.__INFOBOX.map && !visible) {
                that.__INFOBOX.set_map(null);
            } else if (visible) {
                that.__INFOBOX.set_position(that.object().getPosition());
                that.__INFOBOX.set_map(that.controller().map());
            }
            return this;
        }

        if (!BB.gmap.statics.infobox_loaded) {
            init_infoBox();
            BB.gmap.statics.infobox_loaded = true;
        }

        var infobox_options = {};
        if (_data.infobox_options) {
            infobox_options = _data.infobox_options;
        }


        // Default placement
        if (!infobox_options.offsetY) {
            infobox_options.offsetY = that.icon().height;
        }

        if (!infobox_options.offsetX) {
            infobox_options.offsetX = (that.icon().width / 2);
        }

        infobox_options.map = that.controller().map();
        infobox_options.position = that.get_position();

        that.__INFOBOX = new BB.gmap.infobox(_data.infobox, infobox_options, that);
    }
};

/**
 *
 * @returns {google.maps.LatLngBounds}
 */
BB.gmap.marker.prototype.get_bounds = function() {
    // Scope
    var that = this;

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(that.object().getPosition());

    return bounds;
};

/**
 *
 * @returns {*}
 */
BB.gmap.marker.prototype.get_position = function() {
    if (!this.object()) {
        return ;
    }
    return this.object().getPosition();
};

/**
 *
 * @param position
 * @returns {BB.gmap.marker}
 */
BB.gmap.marker.prototype.set_position = function(position) {
        if (!position) {
            return this;
        }

        if (typeof position === 'string') {
            position = position.split(',');
        }

        if (!(position instanceof google.maps.LatLng)) {
            if (typeof position[0] === 'undefined' || typeof position[1] === 'undefined') {
                return this;
            }
            position = new google.maps.LatLng(position[0], position[1]);
        }


        this.object().setPosition(position);
        this.set_data({
            coords: [position.lat(), position.lng()]
        });

        if (this.__INFOBOX) {
            this.__INFOBOX.set_position(position);
        }

        return this;
};
