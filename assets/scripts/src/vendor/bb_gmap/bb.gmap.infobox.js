/**
 * @name BB Gmap Infobox
 * @version version 1.0
 * @author Bene Roch
 * @description
 * Map object infobox
 * Displays as the native infowindow, but with custom HTML.
 */

var BB = BB || {};

BB.gmap = BB.gmap || {};


/**
* Infobox class
* @param elem Dom element / jQuery object (im a gentleman)
* @param opts Placement option and more
*
* Opts include the following:
* - `position` - latLng, [lat, lon]
* - `offsetX` (float)
* - `offsetY` (float)
* - `map` google map object
* - `index`
*/
BB.gmap.infobox = function( elem, opts )
{
	this.__MAP = undefined;

	// Let's get rid of jQuery for this one
	if (elem instanceof jQuery) {
		// Select DOMElement
		elem = elem.get(0);
	}

	// Just remember this.
	this.__ELEM = elem;

	// Extend
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
	google.maps.OverlayView.call(this);

	// Remember options
	this.opts = opts;

	this._height = elem.offsetHeight;
	this._width = elem.offsetWidth;

	opts.offsetY = opts.offsetY || 0;
	opts.offsetX = opts.offsetX || 0;

	this._offsetY = -(parseInt(this._height) + parseFloat(opts.offsetY) );
	this._offsetX = -(parseInt(this._width/2) + parseFloat(opts.offsetY) );

	// Scope
	var that = this;

	// Remember the listener so we can remove it when needed
	this._bounds_changed_listener = google.maps.event.addListener(this.map_, "bounds_changed", function() {
		return that.panMap.apply(that);
	});

	// Set map.
	this.set_map( opts.map );

};

function init_infoBox() {

	BB.gmap.infobox.prototype = new google.maps.OverlayView();
	BB.gmap.infobox.prototype.remove = function() {
		if (this._div) {
			try {
				this._div.parentNode.removeChild(this._div);
			} catch(err) {

			}
			this._div = null;
		}
	};

	/**
	* Sets the map for the infobox
	*
	*/
	BB.gmap.infobox.prototype.set_map = function( map )
	{
		this.__MAP = map;
		this.setMap( this.__MAP );
	};

	BB.gmap.infobox.prototype.map = function()
	{
		return this.__MAP;
	};


	BB.gmap.infobox.prototype.draw = function() {
		if (typeof charcoal_map.infoBoxes[this.index_] != 'undefined' || typeof label_infobox[this.index_] != "undefined") {
			this.createElement();
			if (!this._div) return;

			var pixPosition = this.getProjection().fromLatLngToDivPixel(this.opts.position);
			if (!pixPosition) return;

			this._div.style.width = this._width + "px";
			this._div.style.left = (pixPosition.x + this._offsetX) + "px";
			this._div.style.height = this._height + "px";
			this._div.style.top = (pixPosition.y + this._offsetY) + "px";
			this._div.style.display = 'block';
			this._div.style.zIndex = 1;
		}
	};
	BB.gmap.infobox.prototype.createElement = function() {
		var panes = this.getPanes();
		var div = this._div;
		if (!div) {
			// This does not handle changing panes.  You can set the map to be null and
			// then reset the map to move the div.
			div = this._div = document.createElement("div");
			div.style.border = "0";
			div.style.position = "absolute";
			div.style.width = this._width + "px";
			div.style.height = this._height + "px";

			// Set a class for CSS
			var infobox_class = 'gmap_infobox';
			div.setAttribute('class',infobox_class);

			contentDiv = document.createElement("div");
			$(contentDiv).html($(this.appendDiv_).html());

			div.appendChild(contentDiv);
			contentDiv.style.display = 'block';
			div.style.display = 'none';
			panes.floatPane.appendChild(div);
			this.panMap();
		}
		else if (div.parentNode != panes.floatPane) {
			// The panes have changed.  Move the div.
			try {
				div.parentNode.removeChild(div);
			} catch (err) {

			}
			panes.floatPane.appendChild(div);
		}
		else {
			// The panes have not changed, so no need to create or move the div.
		}
	};

	BB.gmap.infobox.prototype.panMap = function() {
		// if we go beyond map, pan map
		var map = this.map();
		var bounds = map.getBounds();
		if (!bounds) return;

		// The position of the infowindow
		var position = this.opts.position;

		// The dimension of the infowindow
		var iwWidth = this._width;
		var iwHeight = this._height;

		// The offset position of the infowindow
		var iwOffsetX = this._offsetX;
		var iwOffsetY = this._offsetY;

		// Padding on the infowindow
		var padX = 0;
		var padY = 0;

		// The degrees per pixel
		var mapDiv = map.getDiv();
		var mapWidth = mapDiv.offsetWidth;
		var mapHeight = mapDiv.offsetHeight;
		var boundsSpan = bounds.toSpan();
		var longSpan = boundsSpan.lng();
		var latSpan = boundsSpan.lat();
		var degPixelX = longSpan / mapWidth;
		var degPixelY = latSpan / mapHeight;

		// The bounds of the map
		var mapWestLng = bounds.getSouthWest().lng();
		var mapEastLng = bounds.getNorthEast().lng();
		var mapNorthLat = bounds.getNorthEast().lat();
		var mapSouthLat = bounds.getSouthWest().lat();

		// The bounds of the infowindow
		var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
		var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
		var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
		var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

		// calculate center shift
		var shiftLng =
		  (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
		  (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
		var shiftLat =
		  (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
		  (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

		// The center of the map
		var center = map.getCenter();

		if (!center) {
			center = charcoal_map.map.getCenter();
		}

		if (!center || typeof center == 'undefined') {
			return false;
		}
		// The new map center
		var centerX = center.lng() - shiftLng;
		var centerY = center.lat() - shiftLat;

		// center the map to the new shifted center
		map.setCenter(new google.maps.LatLng(centerY, centerX));
		if (this._bounds_changed_listener !== null) {
			google.maps.event.removeListener(this._bounds_changed_listener);
		}
		this._bounds_changed_listener = null;
	};
}

