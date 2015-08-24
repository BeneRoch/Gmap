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
