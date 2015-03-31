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
* Needs a google.maps.Marker() object ( data[ 'line' ] ) in order
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
BB.gmap.line = function( data, controller )
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

BB.gmap.line.prototype = new BB.base();

BB.gmap.line.prototype.init = function()
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

BB.gmap.line.prototype.add_styles = function( styles )
{
	// Add validation here.

	this.__STYLES = styles;
}

/**
* AUTOMATICALLY SETS THE STYLE
*/
BB.gmap.line.prototype.set_styles = function( styles )
{
	this.add_styles(styles);
	this.display();
	return this;
}

BB.gmap.line.prototype.get_styles = function() 
{
	return this.__STYLES;
}


BB.gmap.line.prototype.set_paths = function( paths )
{
	if (typeof paths != 'object') {
		this.error('Invalid paths at BB.gmap.line.set_paths :'+paths);
		return ;
	}

	if (!(paths[0] instanceof google.maps.LatLng)) {
		var i = 0;
		var count = paths.length;
		var coords = new google.maps.MVCArray;
		for (; i<count; i++) {
			if (typeof paths[i] != 'object') {
				// Error.
				break;
			}
			var push = this.controller().translate_coords(paths[i]);

			coords.insertAt( coords.length, push );
		}
		console.log(coords);

		paths = coords;
	}

	this.__PATHS = paths;
}

BB.gmap.line.prototype.get_paths = function()
{
	return this.__PATHS;
}


BB.gmap.line.prototype.display = function()
{
	var _data = this.data();

	var styles = this.get_styles();
	if (typeof styles == 'undefined') {
		this.error('Undefined styles at BB.gmap.line.display : ' + styles)
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

	return this;
}

BB.gmap.line.prototype.show = function()
{
	var _line = this.object();
	if (typeof line == 'undefined') {
		this.error('No line defined at BB.gmap.line.show()')
	}
	line.setMap(this.controller().map());
}

BB.gmap.line.prototype.hide = function()
{
	var _line = this.object();
	if (typeof line == 'undefined') {
		this.error('No line defined at BB.gmap.line.hide()')
	}
	_line.setMap(null);
}


BB.gmap.line.prototype.controller = function()
{
	return this.__CONTROLLER;
}


/**
* Require google line object
* @return this (chainable)
*/
BB.gmap.line.prototype.set_object = function( object )
{
	this.__OBJECT = object;
	return this;
}

/**
* Return google line object
* @return google.maps.Marker()
*/
BB.gmap.line.prototype.object = function()
{
	return this.__OBJECT;
}

BB.gmap.line.prototype.refresh = function()
{
	var opts = this.data('_opts');
	var line = this.object();
	line.setOptions(opts);
}

/**
* Requires either google map object
*
*/
BB.gmap.line.prototype.set_map = function( map )
{
	this.object().setMap( map );

	return this;
}

/**
* @param path Coords or the point
*/
BB.gmap.line.prototype.add_point = function(path, index)
{

	// Not good
	if (typeof path != 'object') {
		return false;
	}

	if (typeof path[ 0 ] == 'undefined' || typeof path[ 1 ] == 'undefined') {
		// Something missing
		return false;
	}

	// Not good.
	if ( !(path[0] instanceof google.maps.LatLng) ) {
		path = this.controller().translate_coords(path)
	}

	if (typeof index == 'number') {
		index = this.get_paths().length;
	}

	this.get_paths().insertAt(index, path);
	return this;
}

/**
* @param boolean
*/
BB.gmap.line.prototype.set_editable = function(param)
{
	if (!param) {

	}
	// Add listeners and stuff

}