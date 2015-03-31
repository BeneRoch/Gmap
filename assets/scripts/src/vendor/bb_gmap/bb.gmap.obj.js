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
BB.gmap.obj = function( data, controller )
{
	// Last state of the map
	// In case of ctrl+Z
	this.__LAST_STATE;
}

BB.gmap.obj.prototype.change = function(event)
{
	this.__LAST_STATE = this;
}

BB.gmap.obj.prototype._init = function()
{
	if (document.addEventListener) { // For all major browsers, except IE 8 and earlier
		document.addEventListener("click", myFunction);
	} else if (document.attachEvent) { // For IE 8 and earlier versions
		document.attachEvent("onclick", myFunction);
	}
}
