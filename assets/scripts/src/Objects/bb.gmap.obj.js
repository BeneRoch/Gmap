

var BB = BB || {};

BB.gmap = BB.gmap || {};

BB.gmap.object = function( data, controller )
{
	// Reference to the current object (Marker, line, polygon)
	this.__OBJECT = undefined;

	// Set controller right now
	this.__CONTROLLER = controller;

	this.__DELETED = false;

	// Make sure no ASYNC action
	// happen after suppression.
	// this.__DELETED = false;

	// Set data
	this.set_data( data );

	this.init();

	this.controller().loading_place( this.ident() );

	return this;
};


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
* Adds point on map click
*/
BB.gmap.object.prototype.map_click = function(event)
{
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
	this.__DELETED = true;
	var _object = this.object();
	if (typeof _object == 'undefined') {
		this.error('No object defined at BB.gmap.object.delete()');
		return this;
	}
	this.clear_listeners();
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
BB.gmap.object.prototype.clear_listeners= function() { return this; };


/**
* @see BB.gmap.controller.export
* @return data
*/
BB.gmap.object.prototype.export = function()
{
	return this.data();
};