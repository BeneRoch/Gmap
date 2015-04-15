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

/**
* Extends BB.gmap.line
*/
BB.gmap.polygon.prototype = Object.create(BB.gmap.line.prototype);

/**
* Only difference
*/
BB.gmap.polygon.prototype.display = function()
{
	var _data = this.data();

	var styles = this.get_styles();
	if (typeof styles == 'undefined') {
		this.error('Undefined styles at BB.gmap.polygon.display : ' + styles)
	}

	// Setting paths
	var paths = this.get_paths();
	if (typeof paths == 'undefined') {
		this.error('Undefined paths at BB.gmap.polygon.display : ' + paths);
	}


	// styles.paths = paths;



	if (typeof this.object() != 'undefined') {
		this.object().setOptions(styles);
	} else {
		var polygon = new google.maps.Polygon(styles);
		this.set_object( polygon );
	}

	this.object().setPaths( new google.maps.MVCArray([paths]) );

	this.set_map(this.controller().map());

	return this;
}
