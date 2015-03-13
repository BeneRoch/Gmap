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
	this._MAP;
	this._CONTAINER = container;

	this._MARKERS = {};
	this.__PLACES = {
		markers : {},
		polygons 	: {},
		lines 	: {}
	};

	this.set_data(data);

	return this;
}

BB.gmap.controller.prototype = new BB.base();

/**
* Return associated map
*/
BB.gmap.controller.prototype.map = function()
{
	if (!this._MAP) {
		// No map yet
		this.error('No map associated to the current controller')
		return;
	}
	return this._MAP;
}

/**
* Helper
* Kind of does same thing but on the map object
* You can always object.map().[methods]()
* @see https://developers.google.com/maps/documentation/javascript/reference#Map
*/
BB.gmap.controller.prototype.set_zoom = function(zoom)
{
	this.map().setZoom( zoom );
}

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
	this._MAP = new google.maps.Map(this._CONTAINER, map_options);

	// Any places yet?
	if (typeof _data[ 'places' ] == 'undefined') {
		this.error('You haven\'t set any places yet')
		return this;
	}
	this.add_places( _data[ 'places' ] )
	return this;
}

BB.gmap.controller.prototype.set_styles = function ( styles ) {
	if (typeof styles != 'object') {
		this.error('Invalid type styles in BB.gmap.set_styles()' + styles)
	}

	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var styles = new google.maps.StyledMapType(styles,
	{name: "Custom"});

	//Associate the styled map with the MapTypeId and set it to display.
	this.map().mapTypes.set('custom', styles);
	this.map().setMapTypeId('custom');
	return this;
}


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
		this.error('Invalid places specified :' + places)
		return this;
	}

	for (var p in places) {
		this.add_place( p, places[ p ] );
	}

	return this;
}

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
}

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
	if (typeof data[ 'type' ] != 'string') {
		this.error('Missing parameter "type" in BB.gmap.controller.prototype.add_place');
		return this;
	}

	// Set ident.
	data[ 'ident' ] = ident;

	var type = data['type'];

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
}

BB.gmap.controller.prototype.get_places = function()
{
	return this.__PLACES;
}
BB.gmap.controller.prototype.get_places_by_type = function(type)
{
	return this.__PLACES[ type ];
}

/**
*
*
*/
BB.gmap.controller.prototype.add_marker = function( ident, data )
{
	this.set_place('markers', ident, new BB.gmap.marker(data, this));
	this.get_places_by_type('markers')[ ident ].set_ident('ident');
	return this;
}

/**
*
* @return {mixed} BB.gmap.marker || false
*/
BB.gmap.controller.prototype.get_marker = function( ident )
{
	var _markers = this.get_places_by_type('markers');

	if (typeof _markers[ ident ] == 'undefined') {
		this.error('Invalid marker ident at BB.gmap.controller.get_marker( ident ) : ' + ident)
		return false;
	}
	return _markers[ ident ];
}

BB.gmap.controller.prototype.add_place_by_address = function( ident, address, data ) 
{
	var that = this;
	this.geocode_address( address, function(coords) {
		data.coords = coords;
		that.add_place(ident, data);
	})
}


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
}

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
			place = typeof places_by_type[ ident ] == 'object' ? places_by_type[ ident ] : false;
		}
	}

	if (!place) {
		this.error('Invalid ident at BB.gmap.controller.get_place( ident ) : ' + ident);
		return false;
	}

	return place;
}




BB.gmap.controller.prototype.add_clusterer = function()
{

}
BB.gmap.controller.prototype.get_clusterer = function()
{

}

BB.gmap.controller.prototype.filter = function( filters ) 
{

}

BB.gmap.controller.prototype.clear_infoboxes = function()
{

}

BB.gmap.controller.prototype.refresh = function()
{
	this.clear_infoboxes();

}

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
}