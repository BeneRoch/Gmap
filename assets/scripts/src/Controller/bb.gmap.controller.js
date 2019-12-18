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

    // all places are stucked there
    // this allows a quick research by ident
    this.__PLACES = {};

    // Focused item
    // could be line, marker, polygon, polygon vertex, whatever.
    this.__FOCUSED_ITEM = undefined;

    // MarkerClusterer
    this.__CLUSTERER = undefined;

    this.xhrs = undefined;

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
    if (typeof this.data('places') !== 'object') {
        // This might be an unnecessary error
        this.error('You haven\'t set any places yet');
    } else {
        this.add_places(this.data('places'));
    }

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
    }

    var placeMap = function (item, index) {
        var out = {};

        for (var key in map) {
            out[key] = mapping(item, map[key]);
        }

        return out;
    }

    var xhttp                = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText);
            if (typeof placesIdent === 'string' && placesIdent != '') {
                result = mapping(result, placesIdent)
            }
            if (result.hasOwnProperty('map')) {
                result = result.map(placeMap);
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    // xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();

    // this.xhrs.push(xhttp);
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
    if (typeof places !== 'object') {
        this.error('Invalid places specified :' + places);
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
        this.error('Missing parameter BB.gmap.controller.prototype.add_place ( ident, data ) : ( ' + ident + ', ' + data + ' )');
        return this;
    }

    // Every place should have is uniq ident
    if (typeof data.type !== 'string') {
        this.error('Missing parameter "type" in BB.gmap.controller.prototype.add_place');
        return this;
    }

    // Set ident.
    data.ident = ident;

    var type = data.type;
    switch (type) {
        case 'marker':
            this.set_place(ident, new BB.gmap.marker(data, this));
            break;

        case 'richmarker':
            this.set_place(ident, new BB.gmap.richmarker(data, this));
            break;

        case 'line':
            this.set_place(ident, new BB.gmap.line(data, this));
            break;

        case 'polygon':
            this.set_place(ident, new BB.gmap.polygon(data, this));
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
    focused.map_click(event);
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
        if (place.data('type') === 'marker') {
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
    var places = this.get_places();

    if (typeof places[ident] !== 'undefined') {
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
