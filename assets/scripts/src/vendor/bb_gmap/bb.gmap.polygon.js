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
	// Contains the google map object
	this.__OBJECT = undefined;
	this.__STYLES;
	this.__PATHS;
	this.__CONTROLLER = controller;

	// Set data
	this.set_data( data );

	// If case sanitize is needed in the "set_data" process,
	// retrive them with data()
	var _data = this.data();

	this.init();
	// Chainable
	return this;
}

BB.gmap.polygon.prototype = new BB.base();

BB.gmap.polygon.prototype.init = function()
{
	var _data = this.data();
	
	if (typeof _data[ 'styles' ] == 'object') {
		this.add_styles( _data[ 'styles' ]);
	}

	if (typeof _data[ 'paths' ] == 'object') {
		this.set_paths( _data[ 'paths' ]);
	}

	if (this.get_paths() && this.get_styles()) {
		this.display();
	}

	return this;
}

/**
* Getter & setters
*/

BB.gmap.polygon.prototype.add_styles = function( styles )
{
	// Add validation here.

	this.__STYLES = styles;
}

/**
* AUTOMATICALLY SETS THE STYLE
*/
BB.gmap.polygon.prototype.set_styles = function( styles )
{
	this.add_styles(styles);
	this.display();
	return this;
}

BB.gmap.polygon.prototype.get_styles = function() 
{
	return this.__STYLES;
}


BB.gmap.polygon.prototype.set_paths = function( paths )
{
	if (typeof paths != 'object') {
		this.error('Invalid paths at BB.gmap.polygon.set_paths :'+paths);
		return ;
	}

	if (!(paths[0] instanceof google.maps.LatLng)) {
		var i = 0;
		var count = paths.length;
		var coords = [];
		for (; i<count; i++) {
			if (typeof paths[i] != 'object') {
				// Error.
				break;
			}
			var push = this.controller().translate_coords(paths[i]);

			coords.push( push );
		}

		paths = coords;
	}

	this.__PATHS = paths;
}

BB.gmap.polygon.prototype.get_paths = function()
{

	return this.__PATHS;
}


BB.gmap.polygon.prototype.display = function()
{
	var _data = this.data();

	var styles = this.get_styles();
	if (typeof styles == 'undefined') {
		this.error('Undefined styles at BB.gmap.polygon.display : ' + styles)
	}

	var paths = this.get_paths();
	if (typeof paths == 'undefined') {
		this.error('Undefined paths at BB.gmap.polygon.display : ' + paths);
	}

	styles.paths = paths;

	if (typeof this.object() != 'undefined') {
		this.object().setOptions(styles);
	} else {
		var polygon = new google.maps.Polygon(styles);
		this.set_object( polygon );
	}

	this.set_map(this.controller().map());

	return this;
}

BB.gmap.polygon.prototype.show = function()
{
	var _polygon = this.object();
	if (typeof polygon == 'undefined') {
		this.error('No polygon defined at BB.gmap.polygon.show()')
	}
	polygon.setMap(this.controller().map());
}

BB.gmap.polygon.prototype.hide = function()
{
	var _polygon = this.object();
	if (typeof polygon == 'undefined') {
		this.error('No polygon defined at BB.gmap.polygon.hide()')
	}
	_polygon.setMap(null);
}


BB.gmap.polygon.prototype.controller = function()
{
	return this.__CONTROLLER;
}


/**
* Require google polygon object
* @return this (chainable)
*/
BB.gmap.polygon.prototype.set_object = function( object )
{
	this.__OBJECT = object;
	return this;
}

/**
* Return google polygon object
* @return google.maps.Marker()
*/
BB.gmap.polygon.prototype.object = function()
{
	return this.__OBJECT;
}

BB.gmap.polygon.prototype.refresh = function()
{
	var opts = this.data('_opts');
	var polygon = this.object();
	polygon.setOptions(opts);
}

/**
* Requires either google map object
*
*/
BB.gmap.polygon.prototype.set_map = function( map )
{
	this.object().setMap( map );

	return this;
}
