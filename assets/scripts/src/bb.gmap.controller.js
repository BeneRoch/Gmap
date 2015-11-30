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
		return false;
	}
	return this._MAP;
};

/**
* When adding new place, tell the controller
* Thats means some places are still loading
*/
BB.gmap.controller.prototype.loading_place = function( ident )
{
	var obj = this.get_place( ident );
	if (!obj) {
		return this;
	}

	obj.set_data({ loaded : false });

	return this;
}

/**
*
*/
BB.gmap.controller.prototype.place_loaded = function( obj )
{
	if (!obj) {
		return this;
	}

	if (obj.data('loaded')) {
		return false;
	}

	// Keep that in mind
	obj.set_data({ loaded : true });
	if (this.check_loaded_places()) {
		this._ready();
	}

	return this;

}


/**
* @return {Boolean} All places loaded.
*/
BB.gmap.controller.prototype.check_loaded_places = function()
{

	var all_loaded = true;

	this._loop_all( function( obj ) {
		all_loaded = !!( all_loaded && obj.data('loaded') );
	});

	// Make sure EVERYTHING is ready.
	all_loaded = ( all_loaded && this.data('tiles_loaded') );

	return all_loaded;
}


/**
*
*
*/
BB.gmap.controller.prototype.ready = function( callback ) {
	if (typeof callback == 'function') {
		this.set_data({ map_ready : callback });
	}

	return this;
}


/**
* When EVERYTHING is loaded on the map
* Called ONCE after init
*/
BB.gmap.controller.prototype._ready = function()
{
	var _data = this.data();

	// Already loaded
	if (this.data('loaded')) {
		return this;
	}

	// Call the function ready
	if (typeof _data.map_ready == 'function') {
		_data.map_ready( this );
	}

	this.set_data({ loaded : true });

	// chainable
	return this;
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

	// Already hhave a map!
	if (this.map()) {
		return this;
	}

	// Map options
	var map_options = this.data('map');

	// Converts center position into google objects
	map_options.center = new google.maps.LatLng(parseFloat(map_options.center.x), parseFloat(map_options.center.y));

	// Affect new map object
	this._MAP = new google.maps.Map(this.container(), map_options);

	// Any places yet?
	if (typeof _data.places != 'object') {
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

	google.maps.event.addListenerOnce(this.map(), "tilesloaded", function(e) {
		that.set_data({ 'tiles_loaded' : true });
		that._ready();
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

	// var styles = this.data('default_styles');
	// if (!styles) {
	// 	styles = {
	// 	    strokeColor: '#000000',
	// 	    strokeOpacity: 0.8,
	// 	    strokeWeight: 2,
	// 	    fillColor: '#FFFFFF',
	// 	    fillOpacity: 0.35,
	// 		hover : {
	// 		    strokeColor: '#000000',
	// 		    strokeOpacity: 0.8,
	// 		    strokeWeight: 2,
	// 		    fillColor: '#FFFFFF',
	// 		    fillOpacity: 1
	// 		},
	// 		focused : {
	// 		    fillOpacity: 1
	// 		}
	// 	};
	// }

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
			editable: true,
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
		if (!paths) {
			return false;
		}
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
* This function removes all places and datas associated with the map
* @return this chainable
*/
BB.gmap.controller.prototype.reset = function()
{
	//
	this._loop_all(function(place) {
		place.hide();
		place.delete();
	});

	// Reset map, as in remove all places on it
	this.set_data({ places : undefined });

	// remove focus, prevent some strange behaviors
	this.remove_focus();

	return this;
}