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

	// obsolete ?
	this._MARKERS = {};

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
		this.error('You haven\'t set any places yet');
		return this;
	}
	this.add_places( _data.places );

	// Add listeners (map click)
	this.listeners();

	return this;
};

BB.gmap.controller.prototype.set_styles = function ( styles ) {
	if (typeof styles != 'object') {
		this.error('Invalid type styles in BB.gmap.set_styles()' + styles);
	}

	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var s = new google.maps.StyledMapType(s,
	{name: "Custom"});

	//Associate the styled map with the MapTypeId and set it to display.
	this.map().mapTypes.set('custom', s);
	this.map().setMapTypeId('custom');
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
			this.set_place('markers', ident, new BB.gmap.marker(data, this));
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

/**
*
*
*/
BB.gmap.controller.prototype.add_marker = function( ident, data )
{
	this.set_place('markers', ident, new BB.gmap.marker(data, this));
	this.get_places_by_type('markers')[ ident ].set_ident('ident');
	return this;
};

/**
*
* @return {mixed} BB.gmap.marker || false
*/
BB.gmap.controller.prototype.get_marker = function( ident )
{
	var _markers = this.get_places_by_type('markers');

	if (typeof _markers[ ident ] == 'undefined') {
		this.error('Invalid marker ident at BB.gmap.controller.get_marker( ident ) : ' + ident);
		return false;
	}
	return _markers[ ident ];
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
		focused.blur();
		this.__FOCUSED_ITEM = undefined;
	}

	return this;
};

/**
*
*
*/
BB.gmap.controller.prototype.set_focus = function( item )
{
	var _data = item.data();

	var focused = this.focused();
	if (focused && (focused != item)) {
		focused.blur();
	}

	this.__FOCUSED_ITEM = item;
};

/**
* Retrieve focus Item, then change it.
*/
BB.gmap.controller.prototype.focused = function()
{
	return this.__FOCUSED_ITEM;
};


BB.gmap.controller.prototype.refresh = function()
{
	this.clear_infoboxes();

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
	google.maps.event.clearListeners(this.map(), 'click');
	var that = this;
	google.maps.event.addListener(this.map(), 'click', function(event) { that.map_click(event); });

	return this;
};


BB.gmap.controller.prototype.create_new = function()
{
	// var test = new BB.gmap.polygon({
	// 				editable: true,
	// 				styles : {
	// 				    strokeColor: '#99cc00',
	// 				    strokeOpacity: 0.8,
	// 				    strokeWeight: 3,
	// 				    fillColor: '#FF0000',
	// 				    fillOpacity: 0.35,
	// 					hover : {
	// 					    strokeColor: '#ffffff',
	// 					    strokeOpacity: 0.8,
	// 					    strokeWeight: 3,
	// 					    fillColor: '#000000',
	// 					    fillOpacity: 1
	// 					},
	// 					focused : {
	// 					    fillOpacity: 1
	// 					}
	// 				}}, map)
	// map.set_place('polygons', 'agna', test)
	// map.set_focus( test )
}

/**
* Listeners for map click
* This is where everything happen to have a single click event on the map
* @param event google map event
* @return this (chainable)
*/
BB.gmap.controller.prototype.map_click = function(event)
{
	// Focused item on the map (if any)
	var focused = this.focused();

	if (!focused) {
		return this;
	}

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
* Fits bounds of ALL the objects on the page.
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
    return bounds;
};