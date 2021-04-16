/**
 * @name Bene Bundle (BB)
 * @version version 1.0
 * @author Bene Roch
 * @description
 * BASE
 * All reusable object methods and properties
 * - set_data
 * - data
 * - remove_data
 * - sanitize
 * - unsanitize
 * - escape_data
 * - unescape_data
 * - ident
 * - set_ident
 * - error // using the this.__BB_DEBUG__ to output error
 * Development feature.
 */

var BB = BB || {};

/**
 * BB.base Class
 * Base of all BB's objects
 *
 */
BB.base = function() {

    this.__BB_DEBUG__ = false;
    this.__PROTECTED__ = [];

    this._data = undefined;
};

/**
 *
 * @param data 	|	{Object}	|	{ key : data, key : data } object
 * @return this (chainable)
 */
BB.base.prototype.set_data = function(data) {
    if (typeof this._data == 'undefined') {
        this._data = new BB.data();
    }
    if (typeof data != 'object') {
        return this;
    }

    this._data.set_data(data);
    return this;

};

/**
 *
 * @param data 	|	{Object}	|	{ key : data, key : data } object
 * @return this (chainable)
 */
BB.base.prototype.remove_data = function(data) {
    this._data.remove_data(data);
    return this;

};

/**
 *
 * @return {mixed} data | {Object} data  || {Mixed} data[ key ]
 */
BB.base.prototype.get_data = function(key) {
    var data = this.data();
    if (typeof data[key] != 'undefined') {
        return data[key];
    }
    return false;
};

/**
 *
 * @param data 	|	{Object}	|	{ key : data, key : data } object
 * @return this (chainable)
 */
BB.base.prototype.data = function(data) {
    return this._data.get_data(data);
};

BB.base.prototype.sanitize = function() {
    var data = this.data();
    data = this._escape_data(data);
    this.set_data(data);
    return this;
};

/**
 * Every data passed to this function will be cleaned and encoded for web
 * Recursive
 * Prevents output errors
 * @param data 		|		{Object} 		|
 * @return {Object} data
 */
BB.base.prototype._escape_data = function(data) {
    if (typeof data === 'undefined') {
        return '';
    }

    if (typeof data === 'object' && data.length) {
        var i = 0;
        var count = data.length;
        for (; i < count; i++) {
            data[i] = this._escape_data(data[i]);
        }
    }

    if (typeof data === 'object') {
        for (var k in data) {
            data[k] = this._escape_data(data[k]);
        }
    }

    if (typeof data === 'string') {
        return escape(data);
    }

    // Default;
    return data;
};

/**
 * Every data passed to this function will be cleaned and encoded for web
 * Recursive
 * Prevents output errors
 * @param data 		|		{Object} 		|
 * @return {Object} data
 */
BB.base.prototype._unescape_data = function(data) {
    if (typeof data === 'undefined') {
        return '';
    }

    if (typeof data === 'object') {
        for (var k in data) {
            data[k] = this._unescape_data(data[k]);
        }
    }

    if (typeof data === 'string') {
        return unescape(data);
    }

    // Default;
    return data;
};



/**
 * Return current object ident
 * Ident
 * @return string
 */
BB.base.prototype.ident = function() {
    var _data = this.data();
    if (typeof _data.ident !== 'string') {
        this.error('Ident is not a String which is odd. ' + _data.ident);
        return '';
    }
    return _data.ident;
};

/**
 * Sets the ident for the current object
 * Ident parameters must be a string. If its not, it is converted
 * to one, which my give {Object object} if object values are passed.
 * If __BB_DEBUG__ is on, throws an error
 *
 * @param string 	ident 			MUST be a string
 * @return this (chainable)
 */
BB.base.prototype.set_ident = function(ident) {
    if (typeof ident !== 'string') {
        ident = '' + ident;
        this.error('Ident must be a string. Automatically converted to : ' + ident);
    }
    this.set_data({
        'ident': ident
    });

    return this;
};


BB.base.prototype.error = function(error_msg) {
    if (this.__BB_DEBUG__) {
        throw Error(error_msg);
    }
    return this;
};

/**
 * Utils
 * Check if object is empty
 * @param obj Object
 * @return boolean
 */
BB.base.prototype.is_empty_object = function(obj) {
    if (typeof obj !== 'object') {
        this.error('Invalid argument, Object expected at BB.base.is_empty_object()');
        return true;
    }
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return true;
};

/**
 * Merge defaults with user options
 * @private
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
BB.base.prototype.extend = function(defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};
/**
 * @name Bene Bundle (BB)
 * @version version 1.0
 * @author Bene Roch
 * @description
 * DATAS
 * All datas added to the object will be affected to a "data object"
 * which makes all affectation pass by a single entry point
 */

var BB = BB || {};

/**
 * BB.data Class
 * This class exists to decide wheiter or not you wanna
 * show the data, make them accessible to the public
 *
 */
BB.data = function(data) {

    this.__PROTECTED__ = [];
    this.__HIDDEN_DATA__ = true;

    if (this.__HIDDEN_DATA__) {
        var __DATA = data || {};
        return {
            set_data: function(data) {
                for (var key in data) {
                    __DATA[key] = data[key];
                }
            },
            get_data: function(data) {
                if (!data) {
                    return __DATA;
                }
                if (typeof __DATA[data] != 'undefined') {
                    return __DATA[data];
                }
                return '';
            },
            remove_data: function(key) {
                if (!key) {
                    __DATA = {};
                }

                if (typeof __DATA[key] != 'undefined') {
                    __DATA[key] = undefined;
                    delete __DATA[key];
                }
                return;
            }
        };
    }

    this.__DATA = data || {};

    this.set_data = function(data) {
        if (!this.__DATA) {
            this.__DATA = data || {};
            return;
        }
        if (!data) {
            return;
        }
        for (var key in data) {
            this.__DATA[key] = data[key];
        }
        return;
    };

    this.get_data = function(data) {
        if (!data) {
            return this.__DATA;
        }
        if (typeof this.__DATA[data] != 'undefined') {
            return this.__DATA[data];
        }
        return;
    };

    this.remove_data = function(key) {
        if (!key) {
            this.__DATA = {};
        }

        if (typeof this.__DATA[key] != 'undefined') {
            this.__DATA[key] = undefined;
            delete this.__DATA[key];
        }
        return;
    };

    return this;
};
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

/**
 * EXAMPLE
 *
 var map = new BB.gmap.controller(document.getElementById('test'), {
    options: {
        center: {
            lat     : 45.577997,
            lng     : -73.76850009999998
        },
        zoom: 15,
        mapType     : 'roadmap',
        coordsType    : 'inpage', // array, json? (vs ul li)
        map_mode    : 'default'
    },
    places :{
        test : {
            type : 'marker',
            icon : 'https://beneroch.com/path-to-image.jpg',
            coords : [ 45.577997,-73.76850009999998 ]
        }
    }
});
 map.init();

 map.add_place_by_address('test_un_autre', '1859 iberville, montréal, qc, h2k3c4', {
    type : 'marker',
    icon : 'http://localhost/test/assets/images/marker.png'
});
 */


var BB = BB || {};

BB.gmap = BB.gmap || {};

/**
 * Data
 * - Options: Any map options as defined here: https://developers.google.com/maps/documentation/javascript/tutorial#MapOptions
 * - places: Places to be added on the map
 *
 * @param container
 * @param data
 * @returns {BB.gmap}
 */
BB.gmap.controller = function (container, data) {
    // Keep the map in sight
    this._MAP = undefined;

    // DOM Element where is applied the actual map
    this.__CONTAINER = container;

    // Places container
    this.__PLACES = {};

    // Layers
    this.__LAYERS = {};

    // Focused item
    // could be line, marker, polygon, polygon vertex, whatever.
    this.__FOCUSED_ITEM = undefined;

    // MarkerClusterer
    this.__CLUSTERER = undefined;

    this.set_data(data);

    return this;
};

BB.gmap.controller.prototype = new BB.base();

/**
 * Return associated map
 */
BB.gmap.controller.prototype.map = function () {
    if (!this._MAP) {
        // No map yet
        this.error('No map associated to the current controller at BB.gmap.controller.map()');
        return false;
    }
    return this._MAP;
};

/**
 * When adding new place, tell the controller
 * Thats means some places are still loading
 */
BB.gmap.controller.prototype.loading_place = function (ident) {
    var obj = this.get_place(ident);
    if (!obj) {
        return this;
    }

    obj.set_data({
        loaded: false
    });

    return this;
}

/**
 *
 */
BB.gmap.controller.prototype.place_loaded = function (obj) {
    if (!obj) {
        return this;
    }

    if (obj.data('loaded')) {
        return false;
    }

    // Keep that in mind
    obj.set_data({
        loaded: true
    });

    if (this.check_loaded_places() && this.data('tiles_loaded')) {
        this._ready();
    }

    return this;

};


/**
 * @return {Boolean} All places loaded.
 */
BB.gmap.controller.prototype.check_loaded_places = function () {

    var all_loaded = true;

    this._loop_all(function (obj) {
        all_loaded = !!(all_loaded && obj.data('loaded'));
    });
    return all_loaded;
};

/**
 * Public method to declare a function to be called upon
 * loading all places of the map
 *
 * @param callback
 * @returns {BB.gmap.controller}
 */
BB.gmap.controller.prototype.ready = function (callback) {
    if (typeof callback === 'function') {
        this.set_data({
            map_ready: callback
        });
    }

    return this;
};


/**
 * When EVERYTHING is loaded on the map
 * Called ONCE after init by the plugin
 *
 * @returns {BB.gmap.controller}
 * @private
 */
BB.gmap.controller.prototype._ready = function () {
    var _data = this.data();

    // Already loaded
    if (this.data('loaded')) {
        return this;
    }

    // Call the function ready
    if (typeof _data.map_ready === 'function') {
        _data.map_ready(this);
    }

    this.set_data({
        loaded: true
    });

    // chainable
    return this;
};

/**
 * Container DIV
 *
 * @returns {*}
 */
BB.gmap.controller.prototype.container = function () {

    return this.__CONTAINER;
};

/**
 * Initialize the map
 * @returns {BB.gmap.controller}
 */
BB.gmap.controller.prototype.init = function () {
    // Already have a map!
    if (this.map()) {
        return this;
    }

    // Map options
    var options = this.data('options');

    // Affect new map object
    this._MAP = new google.maps.Map(this.container(), options);

    // Any places yet?
    this.add_places(this.data('places'));

    // Add listeners (map click)
    this.listeners();

    return this;
};

/**
 * Styles as JSON
 * https://developers.google.com/maps/documentation/javascript/styling
 *
 * @param styles
 * @returns {BB.gmap.controller}
 */
BB.gmap.controller.prototype.set_styles = function (styles) {
    if (typeof styles !== 'object') {
        this.error('Invalid type styles in BB.gmap.set_styles()' + styles);
    }

    // Set in options
    var map    = this.data('map');
    map.styles = styles;
    this.data('map', map);

    // Refresh RIGHT NOW
    if (this.map()) {
        this.map().setOptions({
            styles: styles
        });
    }

    return this;
};

/**
 * Unfinished.
 *
 * @param url
 * @param placesIdent
 * @param map
 */
BB.gmap.controller.prototype.add_by_url = function (url, placesIdent, map) {
    var map = {
        id:     'id',
        type:   'type',
        coords: 'coords',
        raw:    'raw.mLatitude',
        date:   'raw.mDate'
    };


    var mapping = function (item, value) {
        var splitted, length, i, previous;

        splitted = value.split('.');
        length   = splitted.length;
        i        = 0;
        previous = item;

        for (; i < length; i++) {
            if (typeof previous[splitted[i]] === 'undefined') {
                return item;
            }
            previous = previous[splitted[i]];
        }

        return previous;
    };

    var placeMap = function (item, index) {
        var out = {};

        for (var key in map) {
            out[key] = mapping(item, map[key]);
        }

        return out;
    };

    var xhttp                = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var result = JSON.parse(this.responseText);
            if (typeof placesIdent === 'string' && placesIdent !== '') {
                result = mapping(result, placesIdent)
            }
            if (result.hasOwnProperty('map')) {
                result = result.map(placeMap);
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhttp.send();
};

/**
 * places :
 * {
 *    ident : { data },
 *    ident : { data }
 * }
 *
 */
BB.gmap.controller.prototype.add_places = function (places) {
    // Places needs to be an object
    if (typeof places !== 'object') {
        return this;
    }

    for (var p in places) {
        this.add_place(p, places[p]);
    }

    return this;
};

/**
 * {
 *    ident : { data }
 * }
 *
 */
BB.gmap.controller.prototype.add_place = function (ident, data) {
    if (!data) {
        return this;
    }

    // Every place should have is uniq ident
    if (typeof data.type !== 'string') {
        return this;
    }

    // Set ident.
    data.ident = ident;

    var type = data.type;
    var defaultStyles = this.default_styles();

    switch (type) {
        case 'marker':
            this.set_place(ident, new BB.gmap.marker(data, this));
            break;

        case 'richmarker':
            this.set_place(ident, new BB.gmap.richmarker(data, this));
            break;

        case 'line':
            if (typeof data.styles === 'undefined') {
                data.styles = defaultStyles;
            }
            this.set_place(ident, new BB.gmap.line(data, this));
            break;

        case 'polygon':
            if (typeof data.styles === 'undefined') {
                data.styles = defaultStyles;
            }
            this.set_place(ident, new BB.gmap.polygon(data, this));
            break;

        case 'bike_layer':

            break;
    }

    return this;
};

/**
 * Called by add_place
 * Sets the place in the controller
 * @return this (chainable)
 */
BB.gmap.controller.prototype.set_place = function (ident, data) {
    if (!ident || !data) {
        this.error('Missing parameters in BB.gmap.controller.set_place( ' + ident + ', ' + data + ')');
        return this;
    }

    // Remember ident at that point
    // For export
    data.set_ident(ident);

    this.__PLACES[ident] = data;
    return this;
};

/**
 * All places added to the map
 *
 * @returns {object}
 */
BB.gmap.controller.prototype.get_places = function () {
    return this.__PLACES;
};

/**
 *
 * @return {mixed} BB.gmap.marker || false
 */
BB.gmap.controller.prototype.get_place = function (ident) {
    var places = this.get_places();

    if (typeof places[ident] === 'undefined') {
        this.error('Invalid ident at BB.gmap.controller.get_place( ident ) : ' + ident);
        return false;
    }

    return places[ident];
};

/**
 *
 * @param ident
 * @param address
 * @param data
 */
BB.gmap.controller.prototype.add_place_by_address = function (ident, address, data) {
    var that = this;
    this.geocode_address(address, function (coords) {
        data.coords = coords;
        that.add_place(ident, data);
    });
};

/**
 * Use google geocoder to geocode given address.
 *
 * @param address
 * @param callback
 * @returns {*}
 */
BB.gmap.controller.prototype.geocode_address = function (address, callback) {
    var ret = Array();

    if (typeof google !== 'undefined') {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
                'address': address
            },
            function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lon = results[0].geometry.location.lng();

                    if (typeof callback === 'function') {
                        callback([lat, lon]);
                    }

                }
                return ret;
            });
    } else {
        return error;
    }
};

BB.gmap.controller.prototype.remove_focus = function (ident) {
    var focused = this.focused(ident);

    // if (this.data('multiple') && ident) {
    //     this.__FOCUSED_ITEM[ident]
    // }

    if (this.data('multiple') && !ident) {
        for (var id in focused) {

            var current             = focused[id];
            this.__FOCUSED_ITEM[id] = undefined;
            delete this.__FOCUSED_ITEM[id];

            current.blur();
            if (typeof this.data('onblur') === 'function') {
                var func = this.data('onblur');
                func(current, this);
            }
        }
        return this;
    }

    if (focused) {

        if (this.data('multiple')) {
            this.__FOCUSED_ITEM[ident] = undefined;
            delete this.__FOCUSED_ITEM[ident];
        } else {
            this.__FOCUSED_ITEM = undefined;
        }

        focused.blur();
        if (typeof this.data('onblur') === 'function') {
            var func = this.data('onblur');
            func(focused, this);
        }
    }


    return this;
};

/**
 * @callback onfocus( item, controller )
 * @param {BB.gmap.object} item
 * @return this (chainable)
 */
BB.gmap.controller.prototype.set_focus = function (item) {
    // First, remove focus
    // Set focus on new item
    if (!this.data('multiple')) {
        this.remove_focus();
        this.__FOCUSED_ITEM = item;
    }

    if (this.data('multiple')) {
        if (!this.__FOCUSED_ITEM) {
            this.__FOCUSED_ITEM = {};
        }

        if (typeof this.__FOCUSED_ITEM[item.data('ident')] !== 'undefined') {
            this.remove_focus(item.data('ident'));
            return this;
        }

        this.__FOCUSED_ITEM[item.data('ident')] = item;
    }

    if (typeof this.data('onfocus') === 'function') {
        var func = this.data('onfocus');
        func(item, this);
    }

    return this;
};

/**
 * Retrieve focus Item, then change it.
 */
BB.gmap.controller.prototype.focused = function (ident) {
    if (!this.__FOCUSED_ITEM) {
        return undefined;
    }

    if (this.data('multiple') && ident) {
        if (typeof this.__FOCUSED_ITEM === 'undefined') {
            return undefined;
        }
        if (typeof this.__FOCUSED_ITEM[ident] !== 'undefined') {
            return this.__FOCUSED_ITEM[ident];
        }
        return undefined;
    } else if (ident) {

        if (this.__FOCUSED_ITEM.data('ident') === ident) {
            return this.__FOCUSED_ITEM;
        }
        // Prevents error when non multiple.
        return undefined;
    }
    return this.__FOCUSED_ITEM;
};

/**
 * Transform an array or coordinates into a google.maps.LatLng object
 *
 * @param coords
 * @returns {google.maps.LatLng}
 */
BB.gmap.controller.prototype.translate_coords = function (coords) {
    if (typeof coords != 'object') {
        return;
    }

    var total = coords.length;
    if (total !== 2) {
        return;
    }
    return new google.maps.LatLng(coords[0], coords[1]);
};

/**
 *
 */
BB.gmap.controller.prototype.listeners = function () {
    // Scope
    var that = this;

    // Map click listeners
    google.maps.event.clearListeners(this.map(), 'click');
    google.maps.event.addListener(this.map(), 'click', function (event) {
        that.map_click(event);
    });

    google.maps.event.addListenerOnce(this.map(), "tilesloaded", function (e) {
        that.set_data({
            'tiles_loaded': true
        });
        if (that.check_loaded_places()) {
            that._ready();
        }
    });

    // Map keypress listeners
    google.maps.event.addDomListener(document, 'keyup', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        switch (code) {
            // Delete
            case 46:
                if (that.focused()) {
                    // Remove focused item
                    if (that.focused().data('editable')) {
                        that.focused().delete();
                        that.remove_focus();
                    }
                }
                break;

            // Escape
            case 27:
                if (that.focused()) {
                    that.remove_focus();
                }
                break;
        }
    });

    return this;
};

/**
 * Dynamically add a new element on the map.
 * @param {String} type marker | polygon | line
 * @param {String} ident Whatever you want it to be
 */
BB.gmap.controller.prototype.create_new = function (type, ident) {
    // Scope
    var that = this;

    if (!ident) {
        ident = 'new_object';
    }

    if (this.get_place( ident )) {
    // Cannot create with existing ident
        return false;
    }

    var styles = this.default_styles();

    switch (type) {
        case 'polygon':

            var opts    = {
                type:     'polygon',
                editable: true,
                styles:   styles
            };
            var polygon = new BB.gmap.polygon(opts, that);


            that.set_place(ident, polygon);
            that.set_focus(polygon);
            break;
        case 'line':

            var opts = {
                type:     'line',
                editable: true,
                styles:   styles
            };

            var line = new BB.gmap.line(opts, that);

            that.set_place(ident, line);
            that.set_focus(line);
            break;

        default:
            this.set_data({
                'marker_creation': ident
            });
            break;

    }

}

/**
 * Sets the data in a kinda magic way...
 * Not really usefull, except you can add new event easily
 * @param string event (1 event at a time)
 * @param function the actual function
 * @return this (chainable)
 */
BB.gmap.controller.prototype.on = function (ev, func) {
    var key   = 'on' + ev;
    var data  = {};
    data[key] = func;
    this.set_data(data)
};

/**
 * Listeners for map click
 * This is where everything happen to have a single click event on the map
 *
 * Callbacks:
 * marker_creation_callback
 * Important if you are actually creating something on the map.
 *
 * @param event google map event
 * @return this (chainable)
 */
BB.gmap.controller.prototype.map_click = function (event) {

    if (this.data('marker_creation')) {
        // Means we are adding markers.
        this.add_place(this.data('marker_creation'), {
            coords:    [event.latLng.lat(), event.latLng.lng()],
            draggable: true,
            editable:  true,
            type:      'marker'
        });

        this.set_focus(this.get_place(this.data('marker_creation')));

        if (typeof this.data('marker_creation_callback') === 'function') {
            var func = this.data('marker_creation_callback');
            func(this.get_place(this.data('marker_creation')));
        }


        // this.set_data({
        //     'marker_creation': false
        // });

    }

    // Focused item on the map (if any)
    var focused = this.focused();
    if (!focused) {
        return this;
    }

    // Dispatch event and remove focus
    if (focused instanceof BB.gmap.object) {
        focused.map_click(event);
    } else {
        for (var k in focused) {
            if (focused[k] instanceof BB.gmap.object) {
                focused[k].map_click(event);
            }
        }
    }

    this.remove_focus();

    return this;
};


/**
 * Since I manually looped all markers and points, I
 * made that function to do just that.
 * @param callback function Will receive a place as argument
 * @return this (chainable)
 **/
BB.gmap.controller.prototype._loop_all = function (callback) {
    if (typeof callback !== 'function') {
        return this;
    }

    var places = this.get_places();
    for (var ident in places) {
        callback(places[ident]);
    }

    return this;
};

/**
 * Hide's all map object that don't fit the filter
 * Filters are in the "categories" options of the object.
 */
BB.gmap.controller.prototype.filter = function (filter) {
    // Scope
    var that = this;

    that._loop_all(function (place) {
        if (!filter) {
            place.show();
            return false;
        }

        var categories = place.data('categories');
        if (!categories) {
            place.hide();
            return false;
        }

        // Categories should be split by comma
        // Or be an array from the beginning
        if (typeof categories === 'string') {
            categories = categories.split(',');
        }

        if (!categories) {
            place.hide();
        }

        var filter_in_category = false;
        for (var k in categories) {
            if (filter === categories[k]) {
                filter_in_category = true;
            }
        }

        if (filter_in_category) {
            place.show();
        } else {
            place.hide();
        }

    })
};

/**
 * Fits bounds of ALL the objects on the page.
 * @return this (chainable)
 */
BB.gmap.controller.prototype.fit_bounds = function () {
    // Scope
    var bounds = new google.maps.LatLngBounds();

    var k = 0;
    this._loop_all(function (obj) {
        var paths = obj.get_position();
        if (!paths) {
            return false;
        }
        var path;

        // Worst fix ever.
        if (paths instanceof google.maps.LatLng) {
            bounds.extend(paths);
        } else {
            for (var i = 0; i < paths.getLength(); i++) {
                path = paths.getAt(i);
                for (var ii = 0; ii < path.getLength(); ii++) {
                    bounds.extend(path.getAt(ii));
                }
            }
        }
        k++;
    });

    if (k > 0) {
        this.map().fitBounds(bounds);
        if (this.data('max_fitbounds_zoom')) {
            var max          = this.data('max_fitbounds_zoom');
            var current_zoom = this.map().getZoom();
            if (current_zoom > max) {
                this.map().setZoom(max);
            }
        }
    }

    return this;
};

/**
 * Array of Marker object (google.maps.Marker)
 * Used for the marker clusterer
 *
 * @returns {Array}
 */
BB.gmap.controller.prototype.get_all_markers = function () {
    var ret = [];

    var places = this.get_places();
    for (var k in places) {
        var place = places[k];
        if (place.data('type') === 'marker' || place.data('type') === 'richmarker') {
            ret.push(place.object());
        }
    }

    return ret;
};


/**
 * Uses the MarkerClusterer plugin
 * Activates it ONLY for the MARKERS object (not including polygon markers)
 * @param {Object} options
 * @return this (chainable)
 * @see https://github.com/googlemaps/js-marker-clusterer

 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'averageCenter': (boolean) Wether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 *
 * IT USES THE DEFAULT OF MARKERCLUSTERER
 * You need to define new icons when needed
 */
BB.gmap.controller.prototype.activate_clusterer = function () {
    if (this.clusterer()) {
        this.clusterer().clearMarkers();
    }
    var markers           = this.get_all_markers();
    var clusterer_options = this.data('clusterer_options') || {};
    this.set_clusterer(new MarkerClusterer(this.map(), markers, clusterer_options));
    return this;
};

/**
 *
 * @param clusterer
 */
BB.gmap.controller.prototype.set_clusterer = function (clusterer) {
    this.__CLUSTERER = clusterer;
};

/**
 *
 * @returns {*}
 */
BB.gmap.controller.prototype.clusterer = function () {
    return this.__CLUSTERER;
};

/**
 * Delete a place from the controller
 * Method is used from BB.gmap.object.delete and shouldn't be called externally
 * @param {String} type marker | polygon | line
 * @param {String} ident Ident of the object
 * @return {Object} BB.Gmap options
 */
BB.gmap.controller.prototype._delete = function (ident) {
    if (typeof this.__PLACES[ident] !== 'undefined') {
        delete this.__PLACES[ident];
        return true;
    }

    return false;
};

/**
 * Export all contents on the map
 * You can use the exported data to load the map as last seen
 * @return {Object} BB.Gmap options
 */
BB.gmap.controller.prototype.export = function () {
    var ret = this.data();

    if (typeof ret.places !== 'undefined') {
        delete ret.places;
    }

    if (typeof ret.center !== 'undefined') {
        delete ret.center;
    }

    var center = this.map().getCenter();

    // Hard translation of map values
    // Map options should be fixed to
    // fit the API description
    ret.map.center.x = center.lat();
    ret.map.center.y = center.lng();
    ret.map.zoom     = this.map().getZoom();

    ret.places = {};

    this._loop_all(function (place) {
        ret['places'][place.ident()] = place.export();
    });

    return ret;

};

/**
 * Get the map STATIC image
 * @see https://developers.google.com/maps/documentation/static-maps
 * @return {[type]} [description]
 */
BB.gmap.controller.prototype.get_map_image = function () {
    var center = this.map().getCenter();

    var url = "https://maps.googleapis.com/maps/api/staticmap?";

    var aURL = [];

    // Center of the map
    aURL.push('center=' + center.lat() + ',' + center.lng());
    aURL.push('zoom=' + this.map().getZoom());
    aURL.push('size=640x400');

    this._loop_all(function (place) {

        if (place.data('type') == 'marker') {
            if (!place.data('icon').src) {
                return false;
            }
            var img    = new Image();
            img.src    = place.data('icon').src;
            var sizes  = place.data('icon').width + 'x' + place.data('icon').height;
            var coords = place.data('coords');
            var str    = 'markers=size:' + sizes + '|icon:' + img.src + '|' + coords[0] + ',' + coords[1];
            aURL.push(str);
        }

        if (place.data('type') === 'polygon') {
            var paths = place.data('paths');
            if (!paths) {
                return false;
            }

            var aPath  = [];
            var styles = place.data('styles');
            var color  = styles.strokeColor;
            var weight = styles.strokeWeight;
            var fill   = styles.fillColor;
            // aPath.push('color:'+color);
            aPath.push('color:black');
            aPath.push('weight:' + weight);
            aPath.push('fillcolor:white');
            // aPath.push('fill:'+fill);

            var i      = 0;
            var length = paths.length;
            for (; i < length; i++) {
                aPath.push(paths[i].join(','));
            }
            aPath.push(paths[0].join(','));

            aURL.push('path=' + aPath.join('|'));

        }
    });

    url = url + aURL.join('&');
    return url;

};


/**
 * This function removes all places and datas associated with the map
 * @return this chainable
 */
BB.gmap.controller.prototype.reset = function () {
    //
    this._loop_all(function (place) {
        place.hide();
        place.delete();
    });

    // Reset map, as in remove all places on it
    this.set_data({
        places: undefined
    });

    // remove focus, prevent some strange behaviors
    this.remove_focus();

    return this;
};

/**
 * Default styles (for polygon and lines) when none defined.
 *
 * @returns {object}
 */
BB.gmap.controller.prototype.default_styles = function () {
    if (this.data('default_styles')) {
        return this.data('default_styles');
    }

    return {
        strokeColor:   '#000000',
        strokeOpacity: 0.8,
        strokeWeight:  2,
        fillColor:     '#FFFFFF',
        fillOpacity:   0.35,
        hover:         {
            strokeColor:   '#000000',
            strokeOpacity: 0.8,
            strokeWeight:  2,
            fillColor:     '#FFFFFF',
            fillOpacity:   1
        },
        focused:       {
            fillOpacity: 1
        }
    };
}

/**
 * @name BB Gmap Infobox
 * @description
 * Map object infobox
 * Displays as the native infowindow, but with custom HTML.
 */

var BB = BB || {};

BB.gmap = BB.gmap || {};

BB.gmap.statics = BB.gmap.statics || {};

/**
 * Infobox class
 * @param elem Dom element / jQuery object (im a gentleman)
 * @param opts Placement option and more
 *
 * Opts include the following:
 * - `position` - latLng, [lat, lon]
 * - `offsetX` (float)
 * - `offsetY` (float)
 * - `map` google map object
 * - `index`
 */
BB.gmap.infobox = function(elem, opts, marker) {
    this.__MAP = undefined;
    this.__MARKER = marker;

    // Original infobox content
    this.infoboxContent = elem;

    // Just remember this.
    // We wanna take INNERHTML of that Document Element
    this.__ELEM = undefined;

    // Extend
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
    google.maps.OverlayView.call(this);

    // Defaults
    opts.offsetY = opts.offsetY || 0;
    opts.offsetX = opts.offsetX || 0;
    opts.multiple = opts.multiple || false;

    // Remember options
    this.opts = opts;

    if (typeof this.opts.placement == 'undefined') {
        // Possible:
        // top center
        // top left
        // top right
        // center center
        // center left
        // center right
        // bottom center
        // bottom left
        // bottom right
        // over center
        // over right
        // over left
        // under center
        // under left
        // under right
        this.opts.placement = 'top center';
    }

    this.__MAP = opts.map;

    // Set map.
    this.set_map(opts.map);

};

/**
 * This is in an init method because it requires the presence of gmap before
 * instanciating as it is an extension of the google.maps.OverlayView() class.
 *
 */
function init_infoBox() {

    BB.gmap.infobox.prototype = new google.maps.OverlayView();
    BB.gmap.infobox.prototype.remove = function() {
        if (this._div) {
            try {
                this._div.parentNode.removeChild(this._div);
            } catch (err) {

            }
            this._div = null;
        }
    };

    /**
     * Sets the map for the infobox
     *
     */
    BB.gmap.infobox.prototype.set_position = function(position) {
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

        this.opts.position = position;

        if (this.map) {
            this.draw();
        }
        return this;
    };


    /**
     * Sets the map for the infobox
     *
     */
    BB.gmap.infobox.prototype.set_map = function(map) {
        this.__MAP = map;
        this.setMap(this.__MAP);
    };

    /**
     * @see google.maps.OverlayView
     */
    BB.gmap.infobox.prototype.draw = function() {
        this.createElement();

        google.maps.event.trigger(this.__MAP, 'infobox_opened', { elem: this });
        // if (!this._div) return;

        var pixPosition = this.getProjection().fromLatLngToDivPixel(this.opts.position);
        if (!pixPosition) return;

        this._div.style.width = this._width + "px";
        this._div.style.left = (pixPosition.x + this._offsetX) + "px";
        this._div.style.height = this._height + "px";
        this._div.style.top = (pixPosition.y + this._offsetY) + "px";
        this._div.style.display = 'block';
        this._div.style.zIndex = 1;
    };

    /**
     *
     */
    BB.gmap.infobox.prototype.createElement = function() {
        // Generate infobox content
        this.generateInfoboxContent();

        var panes = this.getPanes();
        var div = this._div;

        if (div) {
            if (div.parentNode != panes.floatPane) {
                // The panes have changed.  Move the div.
                try {
                    div.parentNode.removeChild(div);
                } catch (err) {

                }
            }
        }

        if (!div) {
            div = this._div = document.createElement("div");
            div.style.border = "0";
            div.style.position = "absolute";
        }

        div.innerHTML = '';

        // Add content right on
        div.appendChild(this.__ELEM);
        panes.floatPane.appendChild(div);

        // Place content from with and height
        this._height = this.__ELEM.offsetHeight;
        this._width = this.__ELEM.offsetWidth;

        div.style.width = this._width + "px";
        div.style.height = this._height + "px";

        var infobox_class = 'gmap_infobox';
        div.setAttribute('class', infobox_class);

        // div.style.display = 'none';
        var position = this.opts.placement.split(' ');

        switch (position[0]) {
            case 'top':
                this._offsetY =  -parseFloat(this.opts.offsetY);
            break;
            case 'over':
                this._offsetY =  -parseFloat(this.opts.offsetY) - parseInt(this._height);
            break;
            case 'bottom':
                this._offsetY = - parseFloat(this._height);
            break;
            case 'under':
                this._offsetY =  0;
            break;
            case 'center':
                this._offsetY =  -parseFloat(this.opts.offsetY)/2 - parseInt(this._height)/2;
            break;
        }
        switch (position[1]) {
            case 'right':
                this._offsetX = (parseFloat(this.opts.offsetX)) - parseInt(this._width);
            break;
            case 'left':
                this._offsetX = -(parseFloat(this.opts.offsetX));
            break;
            case 'center':
                this._offsetX = - (parseInt(this._width)/2);
            break;
            case 'out-right':
                this._offsetX = (parseFloat(this.opts.offsetX));;
            break;
            case 'out-left':
                this._offsetX = -(parseFloat(this.opts.offsetX))-parseInt(this._width);
            break;
        }
    };

    /**
     *
     * @returns {BB.gmap.infobox}
     */
    BB.gmap.infobox.prototype.generateInfoboxContent = function() {
        var elem = this.infoboxContent;
        if (typeof elem === 'function') {
            elem = elem(this.__MARKER.data());
        }

        if (typeof elem === 'number') {
            elem = elem.toString();
        }

        if (typeof elem === 'string') {
            // Does the infobox exists in the dom already?
            var infobox = document.getElementById(elem);

            // If not, create a DIV element with it.
            if (!infobox) {
                infobox = document.createElement('div');
                infobox.style.position = 'absolute'; // Or this wont display corretly
                infobox.innerHTML = elem;
            }
            elem = infobox;
        }

        if (typeof jQuery !== 'undefined') {
            // Let's get rid of jQuery for this one
            if (elem instanceof jQuery) {
                // Select DOMElement
                elem = elem.get(0);
            }
        }

        this.__ELEM = elem;
        return this;
    };

    /**
     *
     */
    BB.gmap.infobox.prototype.refresh = function()
    {
        this.generateInfoboxContent();
    };
}

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
 * @return this
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
 * @return this
 */
BB.gmap.object.prototype.show = function () {
    this.set_map(this.controller().map());
    return this;
};

/**
 * Hide the marker
 * @return this
 */
BB.gmap.object.prototype.hide = function () {
    this.set_map(null);
    return this;
};

/**
 * Deletes the object FOREVER
 * @return this
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
    this.controller()._delete(this.ident());

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

/**
 * @name BB Gmap controller
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
    options.position = this.convert_recursive_array_to_lat_lng(options.position);
    return options;
};

/**
 *
 * @returns {BB.gmap.marker}
 */
BB.gmap.marker.prototype.init = function() {
    this.listeners();
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
 * Legacy support..
 *
 * @returns {HTMLImageElement}
 */
BB.gmap.marker.prototype.icon = function() {
    if (!this._image) {
        // Default value for google map pin
        return {
            width: 27,
            height: 43
        }
    }
    return this._image;
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

    if (that.controller().focused(that.ident())) {
        return that.blur();
    }

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
    this.controller().remove_focus(this.ident());
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
        if (!infobox_options.offsetY && that.icon()) {
            infobox_options.offsetY = that.icon().height;
        }

        if (!infobox_options.offsetX && that.icon()) {
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

/**
 * @name BB Gmap RichMarker
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
BB.gmap.richmarker = function (data, controller) {

    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.marker.call(this, data, controller);

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
BB.gmap.richmarker.prototype = Object.create(BB.gmap.marker.prototype);

/**
 *
 */
BB.gmap.richmarker.prototype.init = function () {
    var _data = this.data();

    this.set_content(_data.content);

    this.setup_content();

    // No image load, no need to wait.
    this.show();

    return this;
};

/**
 *
 */
BB.gmap.richmarker.prototype.setup_content = function()
{
    var _data = this.data();

    var options = {
        map:      this.controller().map()
    };

    options = this.extend(options, _data);

    if (typeof options.html === 'function') {
        options.html = options.html(_data);
    }

    if (typeof options.selected_html === 'function') {
        options.selected_html = options.selected_html(_data);
    }

    options.position = this.get_position();

    var marker = customMarker(options);
    this.set_marker(marker);

    if (!this._listeners) {
        this.listeners();
        this._listeners = true;
        this.controller().place_loaded(this);
    }
};

BB.gmap.richmarker.prototype.set_content = function (content) {
    this._content = content;
    return this;
};

BB.gmap.richmarker.prototype.content = function () {
    return this._content;
};


/**
 * Sets or remove listeners according to plan and / but mainly options.
 *
 */
BB.gmap.richmarker.prototype.listeners = function () {
    // Scope
    var that = this;

    // Marker
    var marker = this.object();

    marker.bbobject = this;

    if (this.data('draggable')) {
        google.maps.event.addListener(marker, 'dragend', that.dragend);
    }

    // click listeners
    // No condition, which is different to the dragend option
    // We might always use the click event, I see no reason to make
    // it optional. Options will occur in the event handler.
    google.maps.event.addListener(marker, 'click', that.onclick);

};

BB.gmap.richmarker.prototype.clear_listeners = function () {
    var marker = this.object();

    google.maps.event.clearListeners(marker, 'dragend');
    google.maps.event.clearListeners(marker, 'click');

    return this;
};

/**
 * marker-selected.png
 */
BB.gmap.richmarker.prototype.focus = function () {
    this.check_infobox(true);

    if (this.controller().focused()) {
        if (this.controller().focused().ident() === this.ident()) {
            return this;
        }
    }

    this.controller().set_focus(this);

    // Selected icon
    // Set selected state
    if (this.data('selected_html')) {
        var selected_html = this.data('selected_html');
        if (typeof selected_html === 'function') {
            selected_html = selected_html(this.data());
        }
        this.object().setHtml(selected_html);
    }
};

BB.gmap.richmarker.prototype.blur = function () {
    this.check_infobox(false);
    this.controller().remove_focus(this.ident());

    // Mechanics calls this methods upon map reset
    // We wanna check if the place still exists in the ma data entry
    if (!this.controller().get_place(this.ident())) {
        return false;
    }

    // Selected icon
    // Unset selected state
    var html = this.data('html');
    if (typeof html === 'function') {
        html = html(this.data());
    }
    this.object().setHtml(html);
};

BB.gmap.richmarker.prototype.icon = function () {
    return {
        height: this.object().div.offsetHeight,
        width:  this.object().div.offsetWidth
    }
};

/**
 * Hide the marker
 * @return this (chainable)
 */
BB.gmap.richmarker.prototype.hide = function () {
    this.set_map(null);
    this.object().dirty = false;
    return this;
};

/**
 * Hide the marker
 * @return this (chainable)
 */
BB.gmap.richmarker.prototype.show = function () {
    this.object().dirty = false;
    this.set_map(this.controller().map());
    return this;
};

/**
 * Expecting:
 * map
 * position
 * html
 *
 * @param  {object} data Data for the marker.
 * @return {customMarker}Gmap custom marker object.
 */
customMarker = function (data) {

    if (typeof BB.gmap.customMarker !== "function") {
        BB.gmap.customMarker = function (data) {
            this.dirty = false;
            this.MAP = data.map;
            if (typeof data.map !== 'undefined') {
                this.setMap(this.MAP);
            }

            if (typeof data.position !== 'undefined') {
                this.latlng = data.position;
            }

            if (typeof data.html !== 'undefined') {
                this.html = data.html;
            }
        };

        BB.gmap.customMarker.prototype      = new google.maps.OverlayView();
        BB.gmap.customMarker.prototype.draw = function () {
            if (!this.dirty) {
                this.updateHtml();
                this.dirty = true;
            }
            this.setPositionFromDraw();
        };

        BB.gmap.customMarker.prototype.setPositionFromDraw = function () {
            var div   = this.div;
            if (!div) {
                return this;
            }

            if (!this.getProjection()) {
                return this;
            }

            var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

            if (point) {
                var height = div.offsetHeight;
                var width  = div.offsetWidth;

                div.style.left = point.x - (width / 2) + 'px';
                div.style.top  = point.y - (height) + 'px';
            }

            this.div = div;
            return this;
        };

        BB.gmap.customMarker.prototype.updateHtml = function () {
            var self = this;
            var div  = this.div;
            if (!div) {
                div                = document.createElement('div');
                div.style.position = 'absolute';
                div.style.cursor   = 'pointer';

                google.maps.event.addDomListener(div, "click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    google.maps.event.trigger(self, "click");
                });

                var panes = this.getPanes();

                if (panes) {
                    panes.overlayImage.appendChild(div);
                }
            }


            div.innerHTML = this.html;
            this.div = div;
        };

        BB.gmap.customMarker.prototype.setHtml = function (html) {
            this.html = html;

            this.dirty = false;
            this.updateHtml();
            this.setPositionFromDraw();
        };

        BB.gmap.customMarker.prototype.remove = function () {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            }
        };

        BB.gmap.customMarker.prototype.setPosition = function (latLng) {
            this.latlng = latLng;
            this.draw();
        };

        BB.gmap.customMarker.prototype.getPosition = function () {
            return this.latlng;
        };
    }

    return new BB.gmap.customMarker(data);
}

/**
 * @name BB Gmap Line
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

(function(){var d=null;function e(a){return function(b){this[a]=b}}function h(a){return function(){return this[a]}}var j;
function k(a,b,c){this.extend(k,google.maps.OverlayView);this.c=a;this.a=[];this.f=[];this.ca=[53,56,66,78,90];this.j=[];this.A=!1;c=c||{};this.g=c.gridSize||60;this.l=c.minimumClusterSize||2;this.J=c.maxZoom||d;this.j=c.styles||[];this.X=c.imagePath||this.Q;this.W=c.imageExtension||this.P;this.O=!0;if(c.zoomOnClick!=void 0)this.O=c.zoomOnClick;this.r=!1;if(c.averageCenter!=void 0)this.r=c.averageCenter;l(this);this.setMap(a);this.K=this.c.getZoom();var f=this;google.maps.event.addListener(this.c,
"zoom_changed",function(){var a=f.c.getZoom();if(f.K!=a)f.K=a,f.m()});google.maps.event.addListener(this.c,"idle",function(){f.i()});b&&b.length&&this.C(b,!1)}j=k.prototype;j.Q="https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m";j.P="png";j.extend=function(a,b){return function(a){for(var b in a.prototype)this.prototype[b]=a.prototype[b];return this}.apply(a,[b])};j.onAdd=function(){if(!this.A)this.A=!0,n(this)};j.draw=function(){};
function l(a){if(!a.j.length)for(var b=0,c;c=a.ca[b];b++)a.j.push({url:a.X+(b+1)+"."+a.W,height:c,width:c})}j.S=function(){for(var a=this.o(),b=new google.maps.LatLngBounds,c=0,f;f=a[c];c++)b.extend(f.getPosition());this.c.fitBounds(b)};j.z=h("j");j.o=h("a");j.V=function(){return this.a.length};j.ba=e("J");j.I=h("J");j.G=function(a,b){for(var c=0,f=a.length,g=f;g!==0;)g=parseInt(g/10,10),c++;c=Math.min(c,b);return{text:f,index:c}};j.$=e("G");j.H=h("G");
j.C=function(a,b){for(var c=0,f;f=a[c];c++)q(this,f);b||this.i()};function q(a,b){b.s=!1;b.draggable&&google.maps.event.addListener(b,"dragend",function(){b.s=!1;a.L()});a.a.push(b)}j.q=function(a,b){q(this,a);b||this.i()};function r(a,b){var c=-1;if(a.a.indexOf)c=a.a.indexOf(b);else for(var f=0,g;g=a.a[f];f++)if(g==b){c=f;break}if(c==-1)return!1;b.setMap(d);a.a.splice(c,1);return!0}j.Y=function(a,b){var c=r(this,a);return!b&&c?(this.m(),this.i(),!0):!1};
j.Z=function(a,b){for(var c=!1,f=0,g;g=a[f];f++)g=r(this,g),c=c||g;if(!b&&c)return this.m(),this.i(),!0};j.U=function(){return this.f.length};j.getMap=h("c");j.setMap=e("c");j.w=h("g");j.aa=e("g");
j.v=function(a){var b=this.getProjection(),c=new google.maps.LatLng(a.getNorthEast().lat(),a.getNorthEast().lng()),f=new google.maps.LatLng(a.getSouthWest().lat(),a.getSouthWest().lng()),c=b.fromLatLngToDivPixel(c);c.x+=this.g;c.y-=this.g;f=b.fromLatLngToDivPixel(f);f.x-=this.g;f.y+=this.g;c=b.fromDivPixelToLatLng(c);b=b.fromDivPixelToLatLng(f);a.extend(c);a.extend(b);return a};j.R=function(){this.m(!0);this.a=[]};
j.m=function(a){for(var b=0,c;c=this.f[b];b++)c.remove();for(b=0;c=this.a[b];b++)c.s=!1,a&&c.setMap(d);this.f=[]};j.L=function(){var a=this.f.slice();this.f.length=0;this.m();this.i();window.setTimeout(function(){for(var b=0,c;c=a[b];b++)c.remove()},0)};j.i=function(){n(this)};
function n(a){if(a.A)for(var b=a.v(new google.maps.LatLngBounds(a.c.getBounds().getSouthWest(),a.c.getBounds().getNorthEast())),c=0,f;f=a.a[c];c++)if(!f.s&&b.contains(f.getPosition())){for(var g=a,u=4E4,o=d,v=0,m=void 0;m=g.f[v];v++){var i=m.getCenter();if(i){var p=f.getPosition();if(!i||!p)i=0;else var w=(p.lat()-i.lat())*Math.PI/180,x=(p.lng()-i.lng())*Math.PI/180,i=Math.sin(w/2)*Math.sin(w/2)+Math.cos(i.lat()*Math.PI/180)*Math.cos(p.lat()*Math.PI/180)*Math.sin(x/2)*Math.sin(x/2),i=6371*2*Math.atan2(Math.sqrt(i),
Math.sqrt(1-i));i<u&&(u=i,o=m)}}o&&o.F.contains(f.getPosition())?o.q(f):(m=new s(g),m.q(f),g.f.push(m))}}function s(a){this.k=a;this.c=a.getMap();this.g=a.w();this.l=a.l;this.r=a.r;this.d=d;this.a=[];this.F=d;this.n=new t(this,a.z(),a.w())}j=s.prototype;
j.q=function(a){var b;a:if(this.a.indexOf)b=this.a.indexOf(a)!=-1;else{b=0;for(var c;c=this.a[b];b++)if(c==a){b=!0;break a}b=!1}if(b)return!1;if(this.d){if(this.r)c=this.a.length+1,b=(this.d.lat()*(c-1)+a.getPosition().lat())/c,c=(this.d.lng()*(c-1)+a.getPosition().lng())/c,this.d=new google.maps.LatLng(b,c),y(this)}else this.d=a.getPosition(),y(this);a.s=!0;this.a.push(a);b=this.a.length;b<this.l&&a.getMap()!=this.c&&a.setMap(this.c);if(b==this.l)for(c=0;c<b;c++)this.a[c].setMap(d);b>=this.l&&a.setMap(d);
a=this.c.getZoom();if((b=this.k.I())&&a>b)for(a=0;b=this.a[a];a++)b.setMap(this.c);else if(this.a.length<this.l)z(this.n);else{b=this.k.H()(this.a,this.k.z().length);this.n.setCenter(this.d);a=this.n;a.B=b;a.ga=b.text;a.ea=b.index;if(a.b)a.b.innerHTML=b.text;b=Math.max(0,a.B.index-1);b=Math.min(a.j.length-1,b);b=a.j[b];a.da=b.url;a.h=b.height;a.p=b.width;a.M=b.textColor;a.e=b.anchor;a.N=b.textSize;a.D=b.backgroundPosition;this.n.show()}return!0};
j.getBounds=function(){for(var a=new google.maps.LatLngBounds(this.d,this.d),b=this.o(),c=0,f;f=b[c];c++)a.extend(f.getPosition());return a};j.remove=function(){this.n.remove();this.a.length=0;delete this.a};j.T=function(){return this.a.length};j.o=h("a");j.getCenter=h("d");function y(a){a.F=a.k.v(new google.maps.LatLngBounds(a.d,a.d))}j.getMap=h("c");
function t(a,b,c){a.k.extend(t,google.maps.OverlayView);this.j=b;this.fa=c||0;this.u=a;this.d=d;this.c=a.getMap();this.B=this.b=d;this.t=!1;this.setMap(this.c)}j=t.prototype;
j.onAdd=function(){this.b=document.createElement("DIV");if(this.t)this.b.style.cssText=A(this,B(this,this.d)),this.b.innerHTML=this.B.text;this.getPanes().overlayMouseTarget.appendChild(this.b);var a=this;google.maps.event.addDomListener(this.b,"click",function(){var b=a.u.k;google.maps.event.trigger(b,"clusterclick",a.u);b.O&&a.c.fitBounds(a.u.getBounds())})};function B(a,b){var c=a.getProjection().fromLatLngToDivPixel(b);c.x-=parseInt(a.p/2,10);c.y-=parseInt(a.h/2,10);return c}
j.draw=function(){if(this.t){var a=B(this,this.d);this.b.style.top=a.y+"px";this.b.style.left=a.x+"px"}};function z(a){if(a.b)a.b.style.display="none";a.t=!1}j.show=function(){if(this.b)this.b.style.cssText=A(this,B(this,this.d)),this.b.style.display="";this.t=!0};j.remove=function(){this.setMap(d)};j.onRemove=function(){if(this.b&&this.b.parentNode)z(this),this.b.parentNode.removeChild(this.b),this.b=d};j.setCenter=e("d");
function A(a,b){var c=[];c.push("background-image:url("+a.da+");");c.push("background-position:"+(a.D?a.D:"0 0")+";");typeof a.e==="object"?(typeof a.e[0]==="number"&&a.e[0]>0&&a.e[0]<a.h?c.push("height:"+(a.h-a.e[0])+"px; padding-top:"+a.e[0]+"px;"):c.push("height:"+a.h+"px; line-height:"+a.h+"px;"),typeof a.e[1]==="number"&&a.e[1]>0&&a.e[1]<a.p?c.push("width:"+(a.p-a.e[1])+"px; padding-left:"+a.e[1]+"px;"):c.push("width:"+a.p+"px; text-align:center;")):c.push("height:"+a.h+"px; line-height:"+a.h+
"px; width:"+a.p+"px; text-align:center;");c.push("cursor:pointer; top:"+b.y+"px; left:"+b.x+"px; color:"+(a.M?a.M:"black")+"; position:absolute; font-size:"+(a.N?a.N:11)+"px; font-family:Arial,sans-serif; font-weight:bold");return c.join("")}window.MarkerClusterer=k;k.prototype.addMarker=k.prototype.q;k.prototype.addMarkers=k.prototype.C;k.prototype.clearMarkers=k.prototype.R;k.prototype.fitMapToMarkers=k.prototype.S;k.prototype.getCalculator=k.prototype.H;k.prototype.getGridSize=k.prototype.w;
k.prototype.getExtendedBounds=k.prototype.v;k.prototype.getMap=k.prototype.getMap;k.prototype.getMarkers=k.prototype.o;k.prototype.getMaxZoom=k.prototype.I;k.prototype.getStyles=k.prototype.z;k.prototype.getTotalClusters=k.prototype.U;k.prototype.getTotalMarkers=k.prototype.V;k.prototype.redraw=k.prototype.i;k.prototype.removeMarker=k.prototype.Y;k.prototype.removeMarkers=k.prototype.Z;k.prototype.resetViewport=k.prototype.m;k.prototype.repaint=k.prototype.L;k.prototype.setCalculator=k.prototype.$;
k.prototype.setGridSize=k.prototype.aa;k.prototype.setMaxZoom=k.prototype.ba;k.prototype.onAdd=k.prototype.onAdd;k.prototype.draw=k.prototype.draw;s.prototype.getCenter=s.prototype.getCenter;s.prototype.getSize=s.prototype.T;s.prototype.getMarkers=s.prototype.o;t.prototype.onAdd=t.prototype.onAdd;t.prototype.draw=t.prototype.draw;t.prototype.onRemove=t.prototype.onRemove;
})();
