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
BB.base = function()
{

	this.__BB_DEBUG__	 = false;
	this.__PROTECTED__   = [];

	this._data = undefined;
};

/**
*
* @param data 	|	{Object}	|	{ key : data, key : data } object
* @return this (chainable)
*/
BB.base.prototype.set_data = function(data)
{
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
BB.base.prototype.remove_data = function(data)
{
	this._data.remove_data(data);
	return this;

};

/**
*
* @return {mixed} data | {Object} data  || {Mixed} data[ key ]
*/
BB.base.prototype.get_data = function(key)
{
	var data = this.data();
	if (typeof data[ key ] != 'undefined') {
		return data[ key ];
	}
	return false;
};

/**
*
* @param data 	|	{Object}	|	{ key : data, key : data } object
* @return this (chainable)
*/
BB.base.prototype.data = function(data)
{
	return this._data.get_data(data);
};

BB.base.prototype.sanitize = function()
{
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
	var that = this;

	if (typeof data == 'undefined') {
		return '';
	}

	if (typeof data == 'object' && data.length) {
		var i = 0;
		var count = data.length;
		for (; i < count; i++) {
			data[i] = this._escape_data(data[i]);
		}
	}

	if (typeof data == 'object') {
		for (var k in data) {
			data[k] = this._escape_data(data[k]);
		}
	}

	if (typeof data == 'string') {
		return escape( data );
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
	var that = this;

	if (typeof data == 'undefined') {
		return '';
	}

	if (typeof data == 'object') {
		for (var k in data) {
			data[k] = this._unescape_data(data[k]);
		}
	}

	if (typeof data == 'string') {
		return unescape( data );
	}

	// Default;
	return data;
};



/**
* Return current object ident
* Ident
* @return string
*/
BB.base.prototype.ident = function()
{
	var _data = this.data();
	if (typeof _data.ident != 'string') {
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
BB.base.prototype.set_ident = function( ident )
{
	if (typeof ident != 'string') {
		ident = ''+ident;
		this.error('Ident must be a string. Automatically converted to : ' + ident);
	}
	this.set_data({ 'ident': ident });

	return this;
};


BB.base.prototype.error = function( error_msg )
{
	if (this.__BB_DEBUG__) {
		throw Error( error_msg );
	}
	return this;
};

/**
* Utils
* Check if object is empty
* @param obj Object
* @return boolean
*/
BB.base.prototype.is_empty_object = function( obj )
{
	if (typeof obj != 'object') {
		this.error('Invalid argument, Object expected at BB.base.is_empty_object()');
		return true;
	}
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
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
BB.base.prototype.extend = function ( defaults, options ) {
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
BB.data = function(data)
{

	this.__PROTECTED__     = [];
	this.__HIDDEN_DATA__   = true;


	if (this.__HIDDEN_DATA__) {
		var __DATA = data || {};
		return {
			set_data: function(data)
			{
				for (var key in data) {
					__DATA[key] = data[ key ];
				}
		 	},
			get_data: function(data)
			{
				if (!data) {
					return __DATA;
				}
				if (typeof __DATA[ data ] != 'undefined') {
					return __DATA[ data ];
				}
				return '';
			},
			remove_data: function(key)
			{
				if (!key) {
					__DATA = {};
				}

				if (typeof __DATA[ key ] != 'undefined') {
					__DATA[ key ] = undefined;
					delete __DATA[ key ];
				}
				return ;
			}
		};
	}

	this.__DATA = data || {};

	this.set_data = function(data)
	{
		if (!this.__DATA) {
			this.__DATA = data || {};
			return ;
		}
		if (!data) {
			return ;
		}
		for (var key in data) {
			this.__DATA[key] = data[ key ];
		}
		return ;
	};

	this.get_data = function(data)
	{
		if (!data) {
			return this.__DATA;
		}
		if (typeof this.__DATA[ data ] != 'undefined') {
			return this.__DATA[ data ];
		}
		return ;
	};

	this.remove_data = function(key)
	{
		if (!key) {
			this.__DATA = {};
		}

		if (typeof this.__DATA[ key ] != 'undefined') {
			this.__DATA[ key ] = undefined;
			delete this.__DATA[ key ];
		}
		return ;
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
* EAMPLE DATAS
*
	var map = new BB.gmap.controller(document.getElementById('test'), {
	   map: {
	   center: {
					x 	: 45.577997,
					y 	: -73.76850009999998
				},
				zoom: 15,
				mapType 	: 'roadmap',
				coordsType	: 'inpage', // array, json? (vs ul li)
				map_mode	: 'default'
		},
		places :{
			test : {
				type : 'marker',
	            icon : 'http://2.bp.blogspot.com/_--4sDAhQ5LI/TOquH6OPLWI/AAAAAAAACeM/JvG-MItGlmk/s1600/CRM5FormScripting4.png',
				coords : [ 45.577997,-73.76850009999998 ]
			}
		}
	})
	map.init()

	map.add_place_by_address('test_un_autre', '1859 iberville, montréal, qc, h2k3c4', {
		type : 'marker',
	    icon : 'http://localhost/test/assets/images/marker.png'
	})
*/
var BB = BB || {};

BB.gmap = BB.gmap || {};
/**
* This is the gmap object
*/
BB.gmap.controller = function(container, data)
{
	// Keep the map in sight
	this._MAP = undefined;

	// DOM Element where is applied the actual map
	this.__CONTAINER = container;

	// Editable makes the controller listen for events
	// such as click, mouseover, etc and dispatch that
	// event to every children in 'places'
	this.__EDITABLE = false;

	// all places are stucked there
	// this allows a quick research by ident
	this.__PLACES = {
		markers : {},
		polygons 	: {},
		lines 	: {}
	};

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
BB.gmap.controller.prototype.map = function()
{
	if (!this._MAP) {
		// No map yet
		this.error('No map associated to the current controller at BB.gmap.controller.map()');
		return;
	}
	return this._MAP;
};

/**
* Helper
* Kind of does same thing but on the map object
* You can always object.map().[methods]()
* @see https://developers.google.com/maps/documentation/javascript/reference#Map
*/
BB.gmap.controller.prototype.set_zoom = function(zoom)
{
	this.map().setZoom( zoom );

	return this;
};
BB.gmap.controller.prototype.container = function()
{

	return this.__CONTAINER;
};

/**
* MAP OPTIONS
* Map options will be passed AS IS to the map object
* Only the center position will be translated into google object
* center :
* {
*	x : float
*	y : float
* }
* @see https://developers.google.com/maps/documentation/javascript/reference#MapOptions
*/
BB.gmap.controller.prototype.init = function()
{
	var _data = this.data();

	// Map options
	var map_options = this.data('map');

	// Converts center position into google objects
	map_options.center = new google.maps.LatLng(parseFloat(map_options.center.x), parseFloat(map_options.center.y));

	// Affect new map object
	this._MAP = new google.maps.Map(this.container(), map_options);

	// Any places yet?
	if (typeof _data.places == 'undefined') {
		// This might be an unnecessary error
		this.error('You haven\'t set any places yet');
	} else {
		this.add_places( _data.places );
	}

	// Add listeners (map click)
	this.listeners();

	return this;
};

BB.gmap.controller.prototype.set_styles = function ( styles ) {
	if (typeof styles != 'object') {
		this.error('Invalid type styles in BB.gmap.set_styles()' + styles);
	}

	// Set in options
	var _map_data = this.data('map');
	_map_data.styles = styles;
	this.data('map', _map_data);

	// Refresh RIGHT NOW
	if (this.map()) {
		this.map().setOptions({ styles : styles });
	}



	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	// var s = new google.maps.StyledMapType(s,
	// {name: "Custom"});

	// //Associate the styled map with the MapTypeId and set it to display.
	// this.map().mapTypes.set('custom', s);
	// this.map().setMapTypeId('custom');

	return this;
};


/**
* places :
* {
*	ident : { data },
*	ident : { data }
* }
*
*/
BB.gmap.controller.prototype.add_places = function( places )
{
	if (!places) {
		this.error('Invalid places specified :' + places);
		return this;
	}

	for (var p in places) {
		this.add_place( p, places[ p ] );
	}

	return this;
};

/**
* Called by add_place
* Sets the place in the controller
* @return this (chainable)
*/
BB.gmap.controller.prototype.set_place = function( type, ident, data )
{
	if (!ident || !data) {
		this.error('Missing parameters in BB.gmap.controller.set_place( '+type+', '+ident+', '+data+')');
		return this;
	}
	if (typeof this.__PLACES[ type ] == 'undefined') {
		this.error('Invalid data type at BB.gmap.controlle.set_place( '+type+', '+ident+', '+data+')');
		return this;
	}
	if (typeof this.__PLACES[ type ][ ident ] == 'undefined') {
		this.__PLACES[ type ][ ident ] = {};
	}

	// Remember ident at that point
	// For export
	data.set_ident( ident );

	this.__PLACES[ type ][ ident ] = data;
	return this;
};

/**
* {
*	ident : { data }
* }
*
*/
BB.gmap.controller.prototype.add_place = function( ident, data )
{
	if (!data) {
		this.error('Missing parameter BB.gmap.controller.prototype.add_place ( ident, data ) : ( ' + ident + ', ' + data + ' )');
		return this;
	}

	// Every place should have is uniq ident
	if (typeof data.type != 'string') {
		this.error('Missing parameter "type" in BB.gmap.controller.prototype.add_place');
		return this;
	}

	// Set ident.
	data.ident = ident;

	var type = data.type;


	switch (type) {
		case 'marker':
			var marker = new BB.gmap.marker(data, this);
			this.set_place('markers', ident, marker);
			// Might add some extra sanitize functions here
			// this.set_place('markers', ident, data)

		break;

		case 'line' :
			this.set_place('lines', ident, new BB.gmap.line(data, this));
			// this.add_line( ident, data );
			// this.set_place('lines', ident, data)
		break;

		case 'polygon':
			this.set_place('polygons', ident, new BB.gmap.polygon(data, this));
			// this.add_polygon( ident, data );
			// this.set_place('polygons', ident, data)
		break;
	}

	if (this.data('use_clusterer')) {
		var clusterer_options = this.data('clusterer_options');
		this.activate_clusterer( clusterer_options );
	}

	return this;
};

BB.gmap.controller.prototype.get_places = function()
{
	return this.__PLACES;
};
BB.gmap.controller.prototype.get_places_by_type = function(type)
{
	return this.__PLACES[ type ];
};

BB.gmap.controller.prototype.add_place_by_address = function( ident, address, data )
{
	var that = this;
	this.geocode_address( address, function(coords) {
		data.coords = coords;
		that.add_place(ident, data);
	});
};


BB.gmap.controller.prototype.geocode_address = function( address, callback )
{
	var ret = Array();

	if (typeof google != 'undefined') {

		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({
			'address': address
		},
		function(results, status) {

		  if (status == google.maps.GeocoderStatus.OK) {
			var lat = results[0].geometry.location.lat();
			var lon = results[0].geometry.location.lng();

			if (typeof callback == 'function') {
				callback( [lat, lon ] );
			}

		  }
		  return ret;

		});

	} else {

		return error;

	}
};

/**
*
* @return {mixed} BB.gmap.marker || false
*/
BB.gmap.controller.prototype.get_place = function( ident )
{
	var places = this.get_places();
	var place = false;

	for (var k in places)
	{
		var places_by_type = this.get_places_by_type( k );

		if (!this.is_empty_object( places_by_type )) {
			place = typeof places_by_type[ ident ] == 'object' ? places_by_type[ ident ] : place;
		}
	}

	if (!place) {
		this.error('Invalid ident at BB.gmap.controller.get_place( ident ) : ' + ident);
		return false;
	}

	return place;
};

BB.gmap.controller.prototype.remove_focus = function()
{
	var focused = this.focused();
	if (focused) {

		if (typeof this.data('onblur') === 'function') {
			var func = this.data('onblur');
			func( focused, this );
		}

		focused.blur();
		this.__FOCUSED_ITEM = undefined;
	}


	return this;
};

/**
* @callback onfocus( item, controller )
* @param {BB.gmap.object} item
* @return this (chainable)
*/
BB.gmap.controller.prototype.set_focus = function( item )
{
	// First, remove focus
	this.remove_focus();

	// Set focus on new item
	this.__FOCUSED_ITEM = item;

	if (typeof this.data('onfocus') === 'function') {
		var func = this.data('onfocus');
		func( item, this );
	}

	return this;
};

/**
* Retrieve focus Item, then change it.
*/
BB.gmap.controller.prototype.focused = function()
{
	return this.__FOCUSED_ITEM;
};

/**
* Utils
* @param Array [ lat, lon ]
*/
BB.gmap.controller.prototype.translate_coords = function(coords) {
	if (typeof coords != 'object') {
		return ;
	}

	var total = coords.length;
	if (total != 2) {
		return ;
	}
	return new google.maps.LatLng(coords[0], coords[1]);
};

/**
*
*/
BB.gmap.controller.prototype.listeners = function()
{
	// Scope
	var that = this;

	// Map click listeners
	google.maps.event.clearListeners(this.map(), 'click');
	google.maps.event.addListener(this.map(), 'click', function(event) { that.map_click(event); });


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

        	case 27:
        		if (that.focused()) {
        			// Well blur actually
        			that.remove_focus();
        		}
        	break;
        }

        // Delete : 46
        // Escape : 27
    });

	return this;
};

/**
* Dynamically add a new element on the map.
* @param {String} type marker | polygon | line
* @param {String} ident Whatever you want it to be
*/
BB.gmap.controller.prototype.create_new = function( type, ident )
{
	// Scope
	var that = this;

	if (!ident) {
		ident = 'new_object';
	}

	// if (this.get_place( ident )) {
		// Cannot create with existing ident
	// 	return false;
	// }

	var styles = this.data('default_styles');
	if (!styles) {
		styles = {
		    strokeColor: '#000000',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: '#FFFFFF',
		    fillOpacity: 0.35,
			hover : {
			    strokeColor: '#000000',
			    strokeOpacity: 0.8,
			    strokeWeight: 2,
			    fillColor: '#FFFFFF',
			    fillOpacity: 1
			},
			focused : {
			    fillOpacity: 1
			}
		};
	}

	switch (type) {
		case 'polygon':

			var opts = {
				type : 'polygon',
				editable: true,
				styles: styles
			}
			var polygon = new BB.gmap.polygon(opts, that);


			that.set_place('polygons', ident, polygon);
			that.set_focus( polygon );
		break;
		case 'line' :

			var opts = {
				type : 'line',
				editable: true,
				styles: styles
			}
			var line = new BB.gmap.line(opts, that);


			that.set_place('lines', ident, line);
			that.set_focus( line );
		break;

		default:
			this.set_data({ 'marker_creation': ident });
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
BB.gmap.controller.prototype.on = function( ev, func )
{
	var key = 'on'+ev;
	var data = {};
	data[ key ] = func;
	this.set_data( data )
}

/**
* Listeners for map click
* This is where everything happen to have a single click event on the map
*
* Callbacks:
* marker_creation_callback
*
* @param event google map event
* @return this (chainable)
*/
BB.gmap.controller.prototype.map_click = function(event)
{
	// Scope
	var that = this;


	if (this.data('marker_creation')) {
		// Means we are adding markers.
		this.add_place( this.data('marker_creation'), {
			coords : [ event.latLng.lat(), event.latLng.lng() ],
			draggable: true,
			type : 'marker'
		});

		this.set_focus( this.get_place( this.data('marker_creation') ) );

		if (typeof this.data('marker_creation_callback') === 'function') {
			var func = this.data('marker_creation_callback');
			func( this.get_place( this.data('marker_creation') ) );
		}


		this.set_data({ 'marker_creation' : false });

	}

	// Focused item on the map (if any)
	var focused = this.focused();

	if (!focused) {
		return this;
	}

	// Edit OR get out of focus
	if (focused.data('editable')) {
		focused.map_click( event );
	} else {
		this.remove_focus();
	}



	return this;

};


/**
* Since I manually looped all markers and points, I
* made that function to do just that.
* @param callback function Will receive a place as argument
* @return this (chainable)
**/
BB.gmap.controller.prototype._loop_all = function( callback )
{
	if (typeof callback != 'function') {
		return this;
	}

	var places = this.get_places();
	for (var k in places)
	{
		var places_by_type = this.get_places_by_type( k );

		if (!this.is_empty_object( places_by_type )) {
			for (var ident in places_by_type) {

				callback( places_by_type[ ident ] );

			}
		}
	}

	return this;
};

/**
* Hide's all map object that don't fit the filter
* Filters are in the "categories" options of the object.
*/
BB.gmap.controller.prototype.filter = function( filter )
{
	// Scope
	var that = this;

	that._loop_all( function( place )
	{
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
		if (typeof categories == 'string') {
			categories = categories.split(',');
		}

		if (!categories) {
			place.hide();
		}

		var filter_in_category = false;
		for (var k in categories)
		{
			if (filter == categories[ k ]) {
				filter_in_category = true;
			}
		}

		if (filter_in_category) {
			place.show();
		} else {
			place.hide();
		}

	})
}

/**
* Fits bounds of ALL the objects on the page.
* @return this (chainable)
*/
BB.gmap.controller.prototype.fit_bounds = function()
{
	// Scope
	var that = this;

    var bounds = new google.maps.LatLngBounds();

	this._loop_all( function( obj )
	{
		var paths = obj.get_position();
   		var path;
	    for (var i = 0; i < paths.getLength(); i++) {
	        path = paths.getAt(i);
	        for (var ii = 0; ii < path.getLength(); ii++) {
	            bounds.extend(path.getAt(ii));
	        }
	    }

	});

	this.map().fitBounds( bounds );

	return this;
};

BB.gmap.controller.prototype.get_all_markers = function()
{
	var markers = this.get_places_by_type('markers');
	var ret = [];
	for (var k in markers) {
		ret.push( markers[ k ].object() );
	}
	return ret;
}


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
BB.gmap.controller.prototype.activate_clusterer = function( options )
{
	this.set_clusterer( new MarkerClusterer(this.map(), this.get_all_markers(), {}) );
	return this;
}

BB.gmap.controller.prototype.set_clusterer = function( clusterer )
{
	this.__CLUSTERER = clusterer;
}

BB.gmap.controller.prototype.clusterer = function()
{
	return this.__CLUSTERER;
}

/**
* Delete a place from the controller
* Method is used from BB.gmap.object.delete and shouldn't be called externally
* @param {String} type marker | polygon | line
* @param {String} ident Ident of the object
* @return {Object} BB.Gmap options
*/
BB.gmap.controller.prototype._delete = function( type, ident )
{

	switch (type) {
		case 'marker':
			if (typeof this.__PLACES.markers[ ident ] === 'undefined') {
				return false;
			}
			delete this.__PLACES.markers[ ident ];
		break;

		case 'line' :
			if (typeof this.__PLACES.lines[ ident ] === 'undefined') {
				return false;
			}
			delete this.__PLACES.lines[ ident ];
		break;

		case 'polygon':
			if (typeof this.__PLACES.polygons[ ident ] === 'undefined') {
				return false;
			}
			delete this.__PLACES.polygons[ ident ];
		break;
	}

}

/**
* Export all contents on the map
* You can use the exported data to load the map as last seen
* @return {Object} BB.Gmap options
*/
BB.gmap.controller.prototype.export = function()
{
	var ret = this.data();

	if (typeof ret.places != 'undefined') {
		delete ret.places;
	}

	if (typeof ret.center != 'undefined') {
		delete ret.center;
	}

	var center = this.map().getCenter();
	ret.map.center.x = center.lat();
	ret.map.center.y = center.lng();
	ret.map.zoom = this.map().getZoom();

	ret.places = {};

	this._loop_all( function( place ) {
		ret[ 'places' ][ place.ident() ] = place.export();
	});

	return ret;

};
/**
 * @name BB Gmap Infobox
 * @version version 1.0
 * @author Bene Roch
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
BB.gmap.infobox = function( elem, opts )
{
	BB.gmap.statics
	this.__MAP = undefined;

	// Let's get rid of jQuery for this one
	if (elem instanceof jQuery) {
		// Select DOMElement
		elem = elem.get(0);
	}

	// Just remember this.
	// We wanna take INNERHTML of that Document Element
	this.__ELEM = elem;

	// Extend
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
	google.maps.OverlayView.call(this);

	// Remember options
	this.opts = opts;

	this._height = elem.offsetHeight;
	this._width = elem.offsetWidth;

	opts.offsetY = opts.offsetY || 0;
	opts.offsetX = opts.offsetX || 0;

	this._offsetY = -(parseInt(this._height) - parseFloat(opts.offsetY) );
	this._offsetX = -(parseInt(this._width/2) - parseFloat(opts.offsetX) );

	this.__MAP = opts.map;

	// Scope
	var that = this;

	// Remember the listener so we can remove it when needed
	this._bounds_changed_listener = google.maps.event.addListener(this.__MAP, "bounds_changed", function() {
		return that.panMap.apply(that);
	});

	// Set map.
	this.set_map( opts.map );

};

function init_infoBox() {

	BB.gmap.infobox.prototype = new google.maps.OverlayView();
	BB.gmap.infobox.prototype.remove = function() {
		if (this._div) {
			try {
				this._div.parentNode.removeChild(this._div);
			} catch(err) {

			}
			this._div = null;
		}
	};

	/**
	* Sets the map for the infobox
	*
	*/
	BB.gmap.infobox.prototype.set_map = function( map )
	{
		this.__MAP = map;
		this.setMap( this.__MAP );
	};

	BB.gmap.infobox.prototype.map = function()
	{
		return this.__MAP;
	};


	BB.gmap.infobox.prototype.draw = function() {
			this.createElement();
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
	BB.gmap.infobox.prototype.createElement = function() {
		var panes = this.getPanes();
		var div = this._div;
		if (!div) {
			// This does not handle changing panes.  You can set the map to be null and
			// then reset the map to move the div.
			div = this._div = document.createElement("div");
			div.style.border = "0";
			div.style.position = "absolute";
			div.style.width = this._width + "px";
			div.style.height = this._height + "px";

			// Set a class for CSS
			var infobox_class = 'gmap_infobox';
			div.setAttribute('class',infobox_class);

			contentDiv = document.createElement("div");
			$(contentDiv).html(this.__ELEM.innerHTML);

			div.appendChild(contentDiv);
			contentDiv.style.display = 'block';
			div.style.display = 'none';
			panes.floatPane.appendChild(div);
			this.panMap();
		}
		else if (div.parentNode != panes.floatPane) {
			// The panes have changed.  Move the div.
			try {
				div.parentNode.removeChild(div);
			} catch (err) {

			}
			panes.floatPane.appendChild(div);
		}
		else {
			// The panes have not changed, so no need to create or move the div.
		}
	};

	BB.gmap.infobox.prototype.panMap = function() {
		// if we go beyond map, pan map

		var map = this.map;
		var bounds = map.getBounds();
		if (!bounds) return;

		// The position of the infowindow
		var position = this.opts.position;

		// The dimension of the infowindow
		var iwWidth = this._width;
		var iwHeight = this._height;

		// The offset position of the infowindow
		var iwOffsetX = this._offsetX;
		var iwOffsetY = this._offsetY;

		// Padding on the infowindow
		var padX = 0;
		var padY = 0;

		// The degrees per pixel
		var mapDiv = map.getDiv();
		var mapWidth = mapDiv.offsetWidth;
		var mapHeight = mapDiv.offsetHeight;
		var boundsSpan = bounds.toSpan();
		var longSpan = boundsSpan.lng();
		var latSpan = boundsSpan.lat();
		var degPixelX = longSpan / mapWidth;
		var degPixelY = latSpan / mapHeight;

		// The bounds of the map
		var mapWestLng = bounds.getSouthWest().lng();
		var mapEastLng = bounds.getNorthEast().lng();
		var mapNorthLat = bounds.getNorthEast().lat();
		var mapSouthLat = bounds.getSouthWest().lat();

		// The bounds of the infowindow
		var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
		var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
		var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
		var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

		// calculate center shift
		var shiftLng =
		  (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
		  (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
		var shiftLat =
		  (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
		  (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

		// The center of the map
		var center = map.getCenter();

		if (!center || typeof center == 'undefined') {
			return false;
		}
		// The new map center
		var centerX = center.lng() - shiftLng;
		var centerY = center.lat() - shiftLat;

		// center the map to the new shifted center
		// map.setCenter(new google.maps.LatLng(centerY, centerX));
		if (this._bounds_changed_listener !== null) {
			google.maps.event.removeListener(this._bounds_changed_listener);
		}
		this._bounds_changed_listener = null;
	};

}




var BB = BB || {};

BB.gmap = BB.gmap || {};

BB.gmap.object = function( data, controller )
{
	// Reference to the current object (Marker, line, polygon)
	this.__OBJECT = undefined;

	// Set controller right now
	this.__CONTROLLER = controller;

	// Set data
	this.set_data( data );

	this.init();

	return this;
}
BB.gmap.object.prototype = new BB.base();

/**
* Require google object
* @return this (chainable)
*/
BB.gmap.object.prototype.set_object = function( object )
{
	this.__OBJECT = object;
	return this;
};

/**
* Return google object
* @return google.maps.object()
*/
BB.gmap.object.prototype.object = function()
{
	return this.__OBJECT;
};

/**
* @return BB.gmap.controller
*/
BB.gmap.object.prototype.controller = function()
{
	return this.__CONTROLLER;
};
/**
* @param BB.gmap.controller
* @return this (chainable)
*/
BB.gmap.object.prototype.set_controller = function( ctrl )
{
	this.__CONTROLLER = ctrl;

	return this;
};


/**
* Requires either google map object
* @param google.maps.Map
* @return this (chainable)
*/
BB.gmap.object.prototype.set_map = function( map )
{
	this.object().setMap( map );

	return this;
};


/**
* show the marker
* @return this (chainable)
*/
BB.gmap.object.prototype.show = function()
{
	var _object = this.object();
	if (typeof _object == 'undefined') {
		this.error('No object defined at BB.gmap.object.show()');
		return this;
	}
	_object.setMap(this.controller().map());

	return this;
};

/**
* Hide the marker
* @return this (chainable)
*/
BB.gmap.object.prototype.hide = function()
{
	var _object = this.object();
	if (typeof _object == 'undefined') {
		this.error('No object defined at BB.gmap.object.hide()');
		return this;
	}
	_object.setMap(null);

	return this;
};

/**
* Deletes the object FOREVER
* @return this (chainable)
*/
BB.gmap.object.prototype.delete = function()
{
	var _object = this.object();
	if (typeof _object == 'undefined') {
		this.error('No object defined at BB.gmap.object.delete()');
		return this;
	}
	_object.setMap(null);

	var _data = this.data();
	if (typeof _data.ondelete === 'function') {
		_data.ondelete( this );
	}

	// Delete by Ident
	this.controller()._delete( this.data('type'), this.ident() );

	// Deletion, remove from memory
	delete _object;

	return this;
};


/**
* ABSTRACT METHODS
* These are not really abstract, but should be
* These only serve documentation purpose.
* All object extending this class should declare these functions
*/


/**
*
*/
BB.gmap.object.prototype.init 			= function() { return this; };
BB.gmap.object.prototype.display 		= function() { return this; };
BB.gmap.object.prototype.focus 			= function() { return this; };
BB.gmap.object.prototype.blur 			= function() { return this; };
BB.gmap.object.prototype.get_bounds 	= function() { return this; };
BB.gmap.object.prototype.get_position 	= function() { return this; };


/**
* @see BB.gmap.controller.export
* @return data
*/
BB.gmap.object.prototype.export = function()
{
	return this.data();
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
BB.gmap.marker = function( data, controller )
{
	// Call the supra class constructor with the arguments
	// The controller and object are set in the BB.gmap.object Class
	BB.gmap.object.call( this, data, controller );

	this.__MEDIA = undefined;
	this.__ICON = undefined;
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
*
*/
BB.gmap.marker.prototype.init = function()
{
	var _data = this.data();

	if (typeof _data.icon == 'string') {
		// No display called afterward
		// @see set_image() -> display() called after the image load.
		this.set_image( _data.icon );
	}
	else if (typeof _data.icon == 'object') {
		// We might have a path object (SVG)
		 this.set_icon( _data.icon );
		 this.display();
	} else {
		// No image load, no need to wait.
		this.display();
	}

	return this;
};

/**
*
*/
BB.gmap.marker.prototype.icon = function()
{
	if (!this.__ICON) {
		return new Image();
	}
	return this.__ICON;
};

/**
* Sets the icon for the marker
* Each marker can have a different icon
* @return this (chainable)
*/
BB.gmap.marker.prototype.set_icon = function( icon )
{
	if (typeof icon != 'object') {
		this.error('Invalid icon at BB.gmap.marker.prototype.set_icon( ' + icon + ' )');
		return this;
	}
	this.__ICON = icon;
	return this;
};

/**
* Sets the image for the icon, preloads it
* Calls the this.set_icon() function after loading
* @return this (chainable)
*/
BB.gmap.marker.prototype.set_image = function( src )
{
	var img = new Image();

	img.data = this;

	img.onload = function()
	{
		this.data.set_icon( this );
		this.data.display();
	};

	img.onerror = function()
	{
		// Icon didn't work, treat it as if there's just no icon
		this.data.set_data({ 'icon' : undefined });
		this.data.display();
	};
	img.src = src;

	return this;
};

/**
*
*
*/
BB.gmap.marker.prototype.display = function()
{
	var _data = this.data();

	if (typeof _data.coords != 'object') {
		this.error('Requires coordinates [lat, lng] at BB.gmap.marker.display()');
		return false;
	}
	var options = {
		map: this.controller().map(),
	   	position: new google.maps.LatLng(_data.coords[0], _data.coords[1]),
	   	optimized: false
	};

	options = this.extend(options, _data);

	var icon = this.icon();
	if (!(icon instanceof Image)) {
		// Means we are probably dealing with a PATH object
		if (typeof icon.path == 'string') {
			// Yup, was right
			var height = 0;
			var width = 0;
			if (typeof icon.height == 'string') {
				height = parseInt(icon.height);
			}
			if (typeof icon.width == 'string') {
				width = parseInt(icon.width);
			}
			icon.anchor = new google.maps.Point((width/2), height);
			options.icon = icon;
		}
	}


	if (this.icon().src) {
		var width = this.icon().width;
		var height = this.icon().height;
		options.icon =  new google.maps.MarkerImage(
			// image src
			this.icon().src,
			// Width, Height.
			new google.maps.Size(width, height),
			// Origin for this image; X, Y.
			new google.maps.Point(0, 0),
			// Anchor for this image; X, Y.
			new google.maps.Point((width/2), height),
			new google.maps.Size(width, height)
	   	);
	}

	// Mini extend
	var custom_options = ( typeof _data.options == 'object' ) ? _data.options : {};
	for (var k in custom_options) {
		options[ k ] = custom_options[ k ];
	}

	if (typeof this.object() != 'undefined') {
		this.object().setOptions(options);
	} else {
		var marker = new google.maps.Marker(options);
		this.set_marker( marker );
	}

	if (!this._listeners) {
		this.listeners();
		this._listeners = true;

		if (typeof _data.loaded_callback === 'function') {
			_data.loaded_callback( this );
		}
	}

	// From BB.gmap.line
	// If hidden, don't show it yet.
	if (this.data('hidden')) {
		this.hide();
	}

	return this;
};


/**
* Require google marker object
* @return this (chainable)
*/
BB.gmap.marker.prototype.set_marker = function( marker )
{
	if (this._marker_loaded) {
		// Error
		this.error( 'There is already a marker affected to this instanciation of a [BB.gmap.marker] ( ' + this.ident() + ' )' );
		return this;
	}
	this._marker_loaded = true;

	this.set_object( marker );
	return this;
};

/**
* Sets or remove listeners according to plan and / but mainly options.
*
*/
BB.gmap.marker.prototype.listeners = function()
{
	// Scope
	var that = this;

	// Marker
	var marker = this.object();

	marker.bbmarker = this;

	if (this.data( 'draggable' )) {
		google.maps.event.addListener(marker, 'dragend', that.dragend);
	}

	// click listeners
	// No condition, which is different to the dragend option
	// We might always use the click event, I see no reason to make
	// it optional. Options will occur in the event handler.
	google.maps.event.addListener(marker, 'click', that.onclick);

};

/**
* Event handler
* Dragend event handler. Calls the callback if it exists
*
* this = marker object
* @param {Event} event
*/
BB.gmap.marker.prototype.dragend = function(event)
{
	// Scope
	var that = this.bbmarker;

	var _data = that.data();

	if (typeof _data.ondragend == 'function') {
		_data.ondragend( that, event );
		that.set_data({ coords : [ event.latLng.lat, event.latLng.lng ]});
	}

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
BB.gmap.marker.prototype.onclick = function(event)
{
	// Scope
	var that = this.bbmarker;



	var _data = that.data();

	if (typeof _data.onclick == 'function') {
		_data.onclick( event, that );
	} else if (typeof _data.onclick == 'string' && typeof window[ _data.onclick ] == 'function') {
		window[ _data.onclick ]( that, event  );
	}

	if (_data.infobox) {
		if (that.__INFOBOX) {
			if (that.__INFOBOX.map) {
				that.__INFOBOX.set_map( null );
			} else {
				that.__INFOBOX.set_map( that.controller().map() );
			}
			that.focus();
			return this;
		}

		if (!BB.gmap.statics.infobox_loaded) {
			init_infoBox();
			BB.gmap.statics.infobox_loaded = true;
		}

		if (typeof _data.infobox == 'string') {
			_data.infobox = document.getElementById( _data.infobox );
		}

		var infobox_options = {};
		if (_data.infobox_options) {
			infobox_options = _data.infobox_options;
		}

		// Default placement
		if (!infobox_options.offsetY) {
			infobox_options.offsetY = -that.icon().height;
		}

		if (!infobox_options.offsetX) {
			infobox_options.offsetX = -(that.icon().width/2);
		}
		infobox_options.map = that.controller().map();
		infobox_options.position = that.get_position().getAt(0).getAt(0);
		that.__INFOBOX = new BB.gmap.infobox( _data.infobox, infobox_options );
	}

	that.focus();

};

/**
* marker-selected.png
*/
BB.gmap.marker.prototype.focus = function()
{
	// Scope
	var that = this;

	// Data
	var _data = this.data();

	// Selected icon
	if (_data.icon_selected) {
		this.set_image( _data.icon_selected );
	}

	that.controller().set_focus( that );

};

BB.gmap.marker.prototype.blur = function()
{
	// Scope
	var that = this;

	// Data
	var _data = this.data();

	// Selected icon
	if (_data.icon_selected) {
		// No need to put back the icon if there's not selected icon specified.
		this.set_image( _data.icon );
	}
};

BB.gmap.marker.prototype.get_bounds = function()
{
	// Scope
	var that = this;

	var bounds = new google.maps.LatLngBounds();
	bounds.extend( that.object().getPosition() );

	return bounds;
};

/**
*
*/
BB.gmap.marker.prototype.get_position = function()
{
	var position = new google.maps.MVCArray();
	var array = new google.maps.MVCArray();
	position.push( this.object().getPosition() );
	array.push( position );
	return array;
};


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
BB.gmap.line = function( data, controller )
{
	// This is a line + polygon concept
	// This belongs here
	this.__STYLES = undefined;
	this.__PATHS = undefined;

	// One marker per point to make it editable
	this.__MARKERS = [];

	// Call the supra class constructor with the arguments
	// The controller and object are set in the BB.gmap.object Class
	BB.gmap.object.call( this, data, controller );


	// Chainable
	return this;
};

BB.gmap.line.prototype = Object.create(BB.gmap.object.prototype);

/**
*
*/
BB.gmap.line.prototype.init = function()
{
	var _data = this.data();

	// Set styles
	if (typeof _data.styles == 'object') {
		this.add_styles( _data.styles );
	}

	// Default = Empty array
	// Makes it possible to DRAW a new line or polygon
	this.set_paths( [] );

	// Set paths
	if (typeof _data.paths == 'object') {
		var i = 0;
		var total = _data.paths.length;
		for (; i<total; i++) {
			this.add_point( _data.paths[ i ] );
		}
	}


	if (this.get_paths() && this.get_styles()) {
		this.display();
	}

	// Allow editable from options
	if (_data.editable) {
		this.set_editable( _data.editable );
	}

	this.listeners();
	return this;
};

/**
* Pretty much the same as init, but removing all markers associated
* and all listeners to get a fresh start.
*
*/
BB.gmap.line.prototype.redraw = function()
{
	// Scope
	var that = this;

	// Paths
	var paths = this.get_paths();
	var i = 0;
	var total = paths.length;

	var new_paths = [];

	for (; i<total; i++) {
		new_paths.push([ paths.getAt( i ).lat(), paths.getAt( i ).lng() ]);

		// if (typeof this.__MARKERS[ i ] != 'undefined') {
		// 	this.__MARKERS[ i ].hide();
		// }
	}

	this.set_data({ paths : new_paths });
	// this.init();
};



/**
* Getter & setters
*/

BB.gmap.line.prototype.add_styles = function( styles )
{
	// Add validation here.
	this.__STYLES = styles;
};

/**
* AUTOMATICALLY SETS THE STYLE
*/
BB.gmap.line.prototype.set_styles = function( styles )
{
	this.add_styles(styles);
	this.display();
	return this;
};

BB.gmap.line.prototype.get_styles = function()
{
	return this.__STYLES;
};


BB.gmap.line.prototype.set_paths = function( paths )
{
	if (typeof paths != 'object') {
		this.error('Invalid paths at BB.gmap.line.set_paths :'+paths);
		return ;
	}

	if (!(paths[0] instanceof google.maps.LatLng)) {
		var i = 0;
		var count = paths.length;
		var coords = new google.maps.MVCArray();
		for (; i<count; i++) {
			if (typeof paths[i] != 'object') {
				// Error.
				break;
			}
			var push = this.controller().translate_coords(paths[i]);

			coords.insertAt( coords.length, push );
		}
		paths = coords;
	}
	this.__PATHS = paths;
};

/**
* Return paths
* @return coord MVCArray paths
*/
BB.gmap.line.prototype.get_paths = function()
{
	return this.__PATHS;
};

BB.gmap.line.prototype.display = function()
{
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
		this.set_object( line );
	}

	this.set_map(this.controller().map());

	this.update_coords();

	return this;
};

BB.gmap.line.prototype.refresh = function()
{
	var opts = this.data('_opts');
	var line = this.object();
	line.setOptions(opts);
};


/**
* @param path Coords or the point
*/
BB.gmap.line.prototype.add_point = function(path, index)
{
	// Not good
	if (typeof path != 'object') {
		return false;
	}
	// Not good.
	if ( !(path instanceof google.maps.LatLng) ) {
		path = this.controller().translate_coords(path);
	}
	if ( (!(path instanceof google.maps.LatLng)) && (typeof path[ 0 ] == 'undefined' || typeof path[ 1 ] == 'undefined')) {
		// Something missing
		return false;
	}
	// Scope
	var that = this;


	var paths = this.get_paths();

	// Allows to have empty path polygon
	// Allows to CREATE a new polygon
	if (typeof paths == 'undefined') {
		this.set_paths( [ [ path.lat(), path.lng() ] ] );
	}
	paths = this.get_paths();

	// If no index defined, add the point as the last point
	if (typeof index != 'number') {
		index = paths.length;
	}

	paths.insertAt(index, path);

	// Add marker on top of it
	var marker = new BB.gmap.marker({
		coords : [ path.lat(), path.lng() ],
		draggable: true, // The whole point of these.
		icon: 'assets/images/marker-tri.png',
		hidden: !(this.data('editable')),
		editable: true,
		ondragend : function(marker, event) {
			that.move_point( marker.object().index, [ event.latLng.lat(), event.latLng.lng() ] );
		},
		ondelete : function ( marker ) {
			that.remove_point( marker.object().index );
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
	this.__MARKERS[ index ] = marker;

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
BB.gmap.line.prototype.move_point = function( index, path )
{
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
	if ( !(path instanceof google.maps.LatLng) ) {
		path = this.controller().translate_coords(path);
	}
	if ( (!(path instanceof google.maps.LatLng)) && (typeof path[ 0 ] == 'undefined' || typeof path[ 1 ] == 'undefined')) {
		// Something missing
		return false;
	}
	// Scope
	var that = this;

	paths.setAt( index, path );

	this.update_coords();

	return this;
};

/**
* Remove one point from the polygon
* @param {Integer} Index
* @return this (chainable)
*/
BB.gmap.line.prototype.remove_point = function( index )
{
	var paths = this.get_paths();
	if (typeof paths != 'object') {
		// How can you move something inexistant?
		this.error('You can not move a point when no path is given at BB.gmap.line.remove_point( index, path )');
		return false;
	}

	// Remove that paths.
	paths.removeAt( index );

	if (typeof this.__MARKERS[ index ] != 'undefined') {
		this.__MARKERS[ index ].hide();
		this.__MARKERS.splice( index, 1 );
	}

	var _m = this.__MARKERS;
	for (var i in _m) {
		_m[ i ].object().index = parseInt( i );
	}

	this.redraw();


	this.update_coords();
	return this;
};


/**
* @param boolean
*/
BB.gmap.line.prototype.set_editable = function(param)
{
	if (!param) {
		this.set_data({ 'editable' : false });
		// this.controller().set_editable(false);
		this.hide_markers();
		// No need to remove focus here
		return this;
	}

	// Add listeners and stuff
	this.set_data({ 'editable' : true });
	this.show_markers();
	// Add focus when setting editable.
	this.focus();

	return this;

};

/**
* Show all markers
* return this (chainable)
*/
BB.gmap.line.prototype.show_markers = function()
{
	for (var i = 0; i < this.__MARKERS.length; i++) {
		this.__MARKERS[ i ].show();
	}

	return this;
}

/**
* Hide all markers
* return this (chainable)
*/
BB.gmap.line.prototype.hide_markers = function()
{
	var focused = this.controller().focused();

	for (var i = 0; i < this.__MARKERS.length; i++) {
		this.__MARKERS[ i ].hide();
	}

	return this;
}

/**
* Adds point on map click
*/
BB.gmap.line.prototype.map_click = function(event)
{
	this.add_point(event.latLng);
};


/**
* Enables or disable draggable
* @return this (chainable)
*/
BB.gmap.line.prototype.set_draggable = function(bool)
{
	var styles = this.get_styles();

	if (!bool) {
		styles.draggable = false;
	} else {
		styles.draggable = true;
	}

	this.set_styles(styles);
	return this;

};



BB.gmap.line.prototype.listeners = function()
{
	// Scope
	var that = this;
	that.object().bbobject = that;

	google.maps.event.clearListeners( that.object(), 'mouseover' );
	google.maps.event.clearListeners( that.object(), 'mouseout' );
	google.maps.event.clearListeners( that.object(), 'click' );

	google.maps.event.addListener( that.object(), 'mouseover', that.mouse_over );
	google.maps.event.addListener( that.object(), 'mouseout', that.mouse_out );
	google.maps.event.addListener( that.object(), 'click', that.click );



};

/**
* `this` is NOT a BB.gmap.line object
* @see this.listeners()
* @param event
*/
BB.gmap.line.prototype.mouse_over = function( event )
{
	var that = this.bbobject;
	var _data = that.data();

	if (typeof _data.onmouseover == 'function') {
		_data.onmouseover( that, event );
	}

	var styles = that.get_styles();
	// Use hover styles
	if (typeof styles.hover == 'object') {
		that.set_styles( styles.hover );
	}
};

/**
* `this` is NOT a BB.gmap.line object
* @see this.listeners()
* @param event
*/
BB.gmap.line.prototype.mouse_out = function( event )
{
	var that = this.bbobject;

	var _data = that.data();

	if (typeof _data.onmouseout == 'function') {
		_data.onmouseout( that, event );
	}

	var focused = that.controller().focused();
	if (focused == that) {
		return false;
	}
	// Go back to original state
	that.set_styles( that.get_data('styles') );
};


/**
* `this` is NOT a BB.gmap.line object
* @see this.listeners()
* @param event
*/
BB.gmap.line.prototype.mouse_down = function( event )
{
	var that = this.bbobject;
	// Go back to original state
	// that.set_styles( that.get_data('styles') );
};


/**
* `this` is NOT a BB.gmap.line object
* @see this.listeners()
* @param event
*/
BB.gmap.line.prototype.mouse_up = function( event )
{
	var that = this.bbobject;
	// Go back to original state
	// that.set_styles( that.get_data('styles') );
};

/**
* `this` is NOT a BB.gmap.line object
* @see this.listeners()
* @param event
*/
BB.gmap.line.prototype.click = function( event )
{
	// Scope
	var that = this.bbobject;
	var _data = that.data();

	if (typeof _data.onclick == 'function') {
		_data.onclick( that, event );
	}

	that.focus();

};


/**
* Set focus on the current item, tell so to the controller
* @return this (chainable)
*/
BB.gmap.line.prototype.focus = function()
{
	var styles = this.get_data('styles');

	if (typeof styles.focused == 'object') {
		this.set_styles( styles.focused );
	}
	this.controller().set_focus( this );

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
BB.gmap.line.prototype.blur = function()
{
	this.set_styles( this.get_data('styles') );

	// No markers when not selected
	// this.hide_markers();

	return this;
};

/**
*
* @return google LatLngBounds object
*/
BB.gmap.line.prototype.get_bounds = function()
{
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
BB.gmap.line.prototype.get_position = function()
{
	var array = new google.maps.MVCArray();
	array.push(this.object().getPath());
	return array;
};

/**
* Make dure the coords data get's updated everytime it changes, for export
* @return this (chainable)
*/
BB.gmap.line.prototype.update_coords = function()
{
	var paths = this.get_paths();
	var ret = [];
	paths.forEach(function( p ) {
		ret.push( [ p.lat(), p.lng() ] );
	});

	this.set_data({ paths : ret });

	return this;
};


/**
* @see BB.gmap.controller.export
* @return data
*/
BB.gmap.line.prototype.export = function()
{
	this.update_coords();

	var _data = this.data();
	// At this point, we do not need these
	if (typeof _data.styles.path != 'undefined') {
		delete _data.styles.path;
	}
	return this.data();
};

BB.gmap.line.prototype.delete = function()
{
	var i = 0;
	var total = this.__MARKERS.length;
	if (total) {
		for (; i < total; i++) {
			this.remove_point( i );
		}
	}

	// Index stuff before doesn't seem to work.
	this.hide_markers();

	// Parent
	BB.gmap.object.prototype.delete.call(this);
};
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
* #Marker object class
* Accepts all datas at first
* Needs a google.maps.Marker() object ( data[ 'polygon' ] ) in order
* be functionnal with all methods
*
* ##Options ( options {} )
* - `icon`:
* 	- image `url`
*
*
* ##Methods
*
*
*/

BB.gmap.polygon = function( data, controller )
{
	// Call the supra class constructor with the arguments
	// The controller and object are set in the BB.gmap.object Class
	BB.gmap.line.call( this, data, controller );

	return this;
};

/**
* Extends BB.gmap.line
*/
BB.gmap.polygon.prototype = Object.create(BB.gmap.line.prototype);

/**
* Only difference
*/
BB.gmap.polygon.prototype.display = function()
{
	var _data = this.data();

	var styles = this.get_styles();
	if (typeof styles == 'undefined') {
		this.error('Undefined styles at BB.gmap.polygon.display : ' + styles);
	}

	// Setting paths
	var paths = this.get_paths();
	if (typeof paths == 'undefined') {
		this.error('Undefined paths at BB.gmap.polygon.display : ' + paths);
	}


	if (typeof this.object() != 'undefined') {
		this.object().setOptions(styles);
	} else {
		var polygon = new google.maps.Polygon(styles);
		this.set_object( polygon );
	}

	this.object().setPaths( new google.maps.MVCArray([paths]) );

	this.set_map(this.controller().map());

	this.listeners();

	return this;
};

BB.gmap.polygon.prototype.get_position = function()
{
	return this.object().getPaths();
};
(function(){var d=null;function e(a){return function(b){this[a]=b}}function h(a){return function(){return this[a]}}var j;
function k(a,b,c){this.extend(k,google.maps.OverlayView);this.c=a;this.a=[];this.f=[];this.ca=[53,56,66,78,90];this.j=[];this.A=!1;c=c||{};this.g=c.gridSize||60;this.l=c.minimumClusterSize||2;this.J=c.maxZoom||d;this.j=c.styles||[];this.X=c.imagePath||this.Q;this.W=c.imageExtension||this.P;this.O=!0;if(c.zoomOnClick!=void 0)this.O=c.zoomOnClick;this.r=!1;if(c.averageCenter!=void 0)this.r=c.averageCenter;l(this);this.setMap(a);this.K=this.c.getZoom();var f=this;google.maps.event.addListener(this.c,
"zoom_changed",function(){var a=f.c.getZoom();if(f.K!=a)f.K=a,f.m()});google.maps.event.addListener(this.c,"idle",function(){f.i()});b&&b.length&&this.C(b,!1)}j=k.prototype;j.Q="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m";j.P="png";j.extend=function(a,b){return function(a){for(var b in a.prototype)this.prototype[b]=a.prototype[b];return this}.apply(a,[b])};j.onAdd=function(){if(!this.A)this.A=!0,n(this)};j.draw=function(){};
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