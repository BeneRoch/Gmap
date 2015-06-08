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
*/
BB.gmap.marker = function( data, controller )
{
	// Contains the google map object
	this.__MARKER = undefined;
	this.__MEDIA;
	this.__CONTROLLER = controller;

	// Status vars
	this._image_loaded = false;
	this._marker_loaded = false;

	// Set data
	this.set_data( data );

	// If case sanitize is needed in the "set_data" process,
	// retrive them with data()
	var _data = this.data();

	this.init();
	// Chainable
	return this;
}

/**
*
*/
BB.gmap.marker.prototype = new BB.base();

/**
*
*/
BB.gmap.marker.prototype.init = function()
{
	var _data = this.data();


	if (typeof _data['icon'] == 'string') {
		// No display called afterward
		// @see set_image() -> display() called after the image load.
		this.set_image( _data.icon );
	} else {
		// No image load, no need to wait.
		this.display();
	}

	this.__ICON;

	return this;
}

/**
*
*/
BB.gmap.marker.prototype.icon = function()
{
	if (!this.__ICON) {
		this.error('No icon were defined yet.')
		return new Image();
	}
	return this.__ICON;
}

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
}

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
	}

	img.onerror = function()
	{
		// Icon didn't work, treat it as if there's just no icon
		this.data.set_data({ 'icon' : undefined });
		this.data.display();
	}
	img.src = src;

	return this;
}

/**
*
*
*/
BB.gmap.marker.prototype.display = function()
{
	// if ()
	var width = this.icon().width;
	var height = this.icon().height;

	var _data = this.data();

	if (typeof _data.coords != 'object') {
		this.error('Requires coordinates [lat, lng] at BB.gmap.marker.display()');
		return false;
	}
	var options = {
		map: this.controller().map(),
	   	position: new google.maps.LatLng(_data.coords[0], _data.coords[1]),
	   	optimized: false
	}

	options = this.extend(options, _data);

	if (this.icon().src) {
		options.icon =  new google.maps.MarkerImage(
			// image src
			this.icon().src,
			// Width, Height.
			new google.maps.Size(width, height),
			// Origin for this image; X, Y.
			new google.maps.Point(0, 0),
			// Anchor for this image; X, Y.
			new google.maps.Point(width, height),
			new google.maps.Size(width, height)
	   	)
	}

	// Mini extend
	var custom_options = ( typeof _data['options'] == 'object' ) ? _data[ 'options' ] : {};
	for (var k in custom_options) {
		options[ k ] = custom_options[ k ];
	}

	if (typeof this.marker() != 'undefined') {
		this.marker().setOptions(options);
	} else {
		var marker = new google.maps.Marker(options);
		this.set_marker( marker );
	}

	this.listeners();

	return this;
}

/**
* show the marker
* @return this (chainable)
*/
BB.gmap.marker.prototype.show = function()
{
	var _marker = this.marker();
	if (typeof marker == 'undefined') {
		this.error('No marker defined at BB.gmap.marker.show()')
	}
	marker.setMap(this.controller().map());

	return this;
}

/**
* Hide the marker
* @return this (chainable)
*/
BB.gmap.marker.prototype.hide = function()
{
	var _marker = this.marker();
	if (typeof marker == 'undefined') {
		this.error('No marker defined at BB.gmap.marker.hide()')
	}
	_marker.setMap(null);

	return this;
}

/**
* @return BB.gmap.controller
*/
BB.gmap.marker.prototype.controller = function()
{
	return this.__CONTROLLER;
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
BB.gmap.marker.prototype.marker = function()
{
	return this.__MARKER;
}

/**
* Requires either google map object
*
*/
BB.gmap.marker.prototype.set_map = function( map )
{
	this.marker().setMap( map );

	return this;
}

/**
* Sets or remove listeners according to plan and / but mainly options.
*
*/
BB.gmap.marker.prototype.listeners = function()
{
	// Scope
	var that = this;

	// Marker
	var marker = this.marker();

	marker.bbmarker = this;

	if (this.data( 'draggable' )) {
		google.maps.event.addListener(marker, 'dragend', that.dragend);
	}
}

BB.gmap.marker.prototype.dragend = function(event)
{
	// Scope
	var that = this.bbmarker;

	var _data = that.data();

	if (typeof _data[ 'ondragend' ] == 'function') {
		_data.ondragend( event );
	}

}

/**
* @remove ?
*/
// BB.gmap.marker.prototype.refresh = function()
// {
// 	var opts = this.data('_opts');
// 	var marker = this.marker();
// 	marker.setOptions(opts);
// }