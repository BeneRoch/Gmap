/**
 * @name BB Gmap Tools
 * @version version 1.0
 * @author Bene Roch
 * @description
 * Map TOOLS helper
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
BB.gmap.tools = function( controller )
{
	// Chainable
	return this;

	this.__CONTROLLER = undefined;
};


/**
* SEt controller
*/
BB.gmap.tools.prototype.set_controller = function( controller )
{
	this.__CONTROLLER = controller;
};

/**
* Get base class methods
*/
BB.gmap.tools.prototype = new BB.base();



BB.gmap.tools.prototype.center = function()
{

};

