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
	// Contains the google map object
	this.__OBJECT = undefined;
	this.__STYLES;
	this.__PATHS;

	// One marker per point to make it editable
	this.__MARKERS;

	this.__CONTROLLER = controller;

	this.__MARKERS = {};

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

	// Set styles
	if (typeof _data[ 'styles' ] == 'object') {
		this.add_styles( _data[ 'styles' ]);
	}

	// Set paths
	if (typeof _data[ 'paths' ] == 'object') {
		this.set_paths( _data[ 'paths' ]);
	} else {
		// Default = Empty array
		// Makes it possible to DRAW a new line or polygon
		this.set_paths( [] );
	}

	if (this.get_paths() && this.get_styles()) {
		this.display();
	}

	// Allow editable from options
	if (_data[ 'editable' ]) {
		this.set_editable( _data['editable'] );
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
		paths = coords;
	}
	this.__PATHS = paths;
}

/**
* Return paths
* @return coord MVCArray paths
*/
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


	if (typeof index != 'number') {
		index = paths.length;
	}

	paths.insertAt(index, path);


	// Add marker on top of it
	var marker = new BB.gmap.marker({
		coords : [ path.lat(), path.lng() ],
		draggable: true,
		ondragend : function(event) {
			console.log(this);
			console.log(event);
			that.move_point( this.index, [ event.latLng.lat(), event.latLng.lng() ] );
		},
		index: index
	}, that.controller());

	return this;
}

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

	paths.setAt(index, path);

	return this;
}


/**
* @param boolean
*/
BB.gmap.line.prototype.set_editable = function(param)
{
	if (!param) {
		this.set_data({ 'editable' : false });
		this.controller().set_editable(false);
		return this;
	}



	// Add listeners and stuff
	this.set_data({ 'editable' : true });

	this.controller().set_editable(true);

	return this;

}

BB.gmap.line.prototype.map_click = function(event)
{
	this.add_point(event.latLng);
}


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

}
