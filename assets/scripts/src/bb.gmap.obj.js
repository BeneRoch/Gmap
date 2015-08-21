

var BB = BB || {};

BB.gmap = BB.gmap || {};

BB.gmap.object = function( data, controller )
{
	// Reference to the current object (Marker, line, polygon)
	this.__OBJECT = undefined;

	// Set controller right now
	this.__CONTROLLER = controller;

	// Set data
	this.set_data( data );

	this.init();

	return this;
}
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