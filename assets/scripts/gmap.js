/**
 * @name Bene Bundle (BB)
 * @version version 1.0
 * @author Bene Roch
 * @description
 *
 */

/** 
* This is a configuration variable.
* You can decide to hide any data within the object.
* This uses a scope particularity of Javascript to do just that.
* If you change it AFTER initiation of any object prototyping BB.base()
* it won't matter at all. Objects before will have hidden data, new objects
* will have visible data at _data.__DATA
* @see BB.data()
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
		}
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
	}

	this.get_data = function(data) 
	{ 
		if (!data) {
			return this.__DATA; 
		}
		if (typeof this.__DATA[ data ] != 'undefined') {
			return this.__DATA[ data ];
		}
		return ;
	}

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
	}

	return this;
}


/**
* BB.base Class
* Base of all BB's objects
*
*/
BB.base = function()
{

	this.__BB_DEBUG__	 = true;
	this.__PROTECTED__   = [];

	this._data = new BB.data();
}

/**
*
* @param data 	|	{Object}	|	{ key : data, key : data } object
* @return this (chainable)
*/
BB.base.prototype.set_data = function(data)
{
	if (typeof data != 'object') {
		return this;
	}

	this._data.set_data(data);
	return this;

}

/**
*
* @param data 	|	{Object}	|	{ key : data, key : data } object
* @return this (chainable)
*/
BB.base.prototype.remove_data = function(data)
{
	this._data.remove_data(data);
	return this;

}

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
	return {};
}

/**
*
* @param data 	|	{Object}	|	{ key : data, key : data } object
* @return this (chainable)
*/
BB.base.prototype.data = function(data)
{
	return this._data.get_data(data);
}

BB.base.prototype.sanitize = function()
{
	var data = this.data();
	data = this._escape_data(data);
	this.set_data(data);
	return this;
}

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

	if (typeof data == 'array') {
		var i = 0;
		var count = data.length;
		for (; i < count; i++) {
			data[i] = this._escape_data(data[i]);
		}
	}

	if (typeof data == 'object') {
		for (var i in data) {
			data[i] = this._escape_data(data[i]);
		}
	}

	if (typeof data == 'string') {
		return escape( data );
	}

	// Default;
	return data;
}

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

	if (typeof data == 'array') {
		var i = 0;
		var count = data.length;
		for (; i < count; i++) {
			data[i] = this._unescape_data(data[i]);
		}
	}

	if (typeof data == 'object') {
		for (var i in data) {
			data[i] = this._unescape_data(data[i]);
		}
	}

	if (typeof data == 'string') {
		return unescape( data );
	}

	// Default;
	return data;
}



/**
* Return current object ident
* Ident
* @return string
*/
BB.base.prototype.ident = function()
{
	var _data = this.data();
	if (typeof _data[ 'ident' ] != 'string') {
		this.error('Ident is not a String which is odd. ' + _data['ident']);
		return '';
	}
	return _data[ 'ident' ];
}

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
}


BB.base.prototype.error = function( error_msg )
{
	if (this.__BB_DEBUG__) {
		throw Error( error_msg );
	}
	return this;
}



BB.gmap = BB.gmap || {};
/**
* This is the gmap object
*/
BB.gmap.controller = function(container, data)
{
	this._MAP;
	this._CONTAINER = container;

	this._MARKERS = {};
	this._PLACES = {
		markers : {},
		areas 	: {},
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
	this.set_places( _data[ 'places' ] )
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
BB.gmap.controller.prototype.set_places = function( places ) 
{
	if (!places) {
		this.error('Invalid places specified :' + places)
		return this;
	}

	// Might add some extra sanitize functions here
	this.__PLACES = places;

	for (var p in places) {
		this.add_place( places[ p ] );
	}

	return this;
}


/**
* {
*	ident : { data }
* }
*
*/
BB.gmap.controller.prototype.add_place = function( data )
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

	var type = data['type'];

	switch (type) {
		case 'marker':
			this.add_marker( data );
		break;

		case 'line' :
			this.add_line( data );
		break;

		case 'area':
			this.add_area( data );
		break;
	}

	return this;

}

/**
*
*
*/
BB.gmap.controller.prototype.add_marker = function( data )
{
	if (!data) {
		this.error('Missing parameter BB.gmap.controller.prototype._add_marker ( ident, data ) : ( ' + ident + ', ' + data + ' )');
		return this;
	}

	if (typeof data[ 'ident' ] != 'string') {
		this.error('Ident must be a string BB.gmap.controller.add_marker( data ) -- data.ident : ' + ident);
		return this;
	}

	if (typeof this._MARKERS[ ident ] != 'undefined') {
		this.error('There is already a marker with that ident : ' + ident);
		return this;
	}

	this._MARKERS[ ident ] = new BB.gmap.marker(data);

	return this;
}

/**
*
* @return {mixed} BB.gmap.marker || false
*/
BB.gmap.controller.prototype.get_marker = function( ident )
{
	if (typeof this._PLACES.markers[ ident ] == 'undefined') {
		this.error('Invalid marker ident : ' + ident)
		return false;
	}
	return this._PLACES.markers[ ident ];
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
* #Marker object class
* Accepts all datas at first 
* Needs a google.maps.Marker() object ( data[ 'marker' ] ) in order
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
*
*
*/
BB.gmap.marker = function( data )
{
	// Contains the google map object
	this.__MARKER = undefined;

	// Status vars
	this._image_loaded = false;
	this._marker_loaded = false;

	// Set data
	this.set_data( data );

	// If case sanitize is needed in the "set_data" process,
	// retrive them with data()
	var _data = this.data();

	// If the marker is already set
	if (typeof _data[ 'marker' ] == 'object') {
		this.set_marker( _data[ 'marker' ] );
	}
	this.init();
	// Chainable
	return this;

}

BB.gmap.marker.prototype = new BB.base();

BB.gmap.marker.prototype.init = function()
{
	var _data = this.data();

	if (typeof _data[ 'ident' ] != 'string') {
		this.error('BB.gmap.marker requires a valid STRING ident : ' + ident);
	}

	this.set_marker( new google.maps.Marker() );



	return;

}


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

	this.__MARKER = marker;
	return this;
}

/**
* Return google marker object
* @return google.maps.Marker()
*/
BB.gmap.marker.prototype.marker = function( marker )
{
	return this.__MARKER = marker;
}

BB.gmap.marker.prototype.refresh = function()
{
	var opts = this.data('_opts');
	var marker = this.marker();
	marker.setOptions(opts);
}

BB.gmap.marker.prototype.remove = function()
{

}



/**
* Requires either google map object
*
*/
BB.gmap.marker.prototype.set_map = function( map )
{
	this.__MARKER.setMap( map );

	return this;
}

/**
* Area object
*/
BB.gmap.area = function( data )
{
	this.set_data( data );
}

BB.gmap.area.prototype = BB.base();



(function($){
	// Function GMAP + default options
 $.fn.gmap = function(args) {
	if ($(this).length) {
		init_infoBox();
		var $this = $(this);
		var defaults = {
			center: {
				x 	: 45.577997,
				y 	: -73.76850009999998
			},
			zoom: 15,
			map 		: $this[0],
			mapType 	: 'roadmap',
			coordsType	: 'inpage', // array, json? (vs ul li)
			map_mode	: 'default',
			map_colors  : {},
			options			: {}
		};
		var settings = $.extend(defaults, args);

		if ($this.data()['charcoal.gmap'] == undefined) {
			charcoal_map = new bGmap($this,settings);
			$this.data('charcoal.gmap',this);
		}
	}
	return this;
 };

})(jQuery);


/**
* IE 8 legacy support...
*/
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
