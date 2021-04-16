/**
 * @name BB Gmap Rectangle
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
BB.gmap.rectangle = function(data, controller) {
    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.object.call(this, data, controller);


    // Chainable
    return this;
};

BB.gmap.rectangle.prototype = Object.create(BB.gmap.object.prototype);

/**
 *
 */
BB.gmap.rectangle.prototype.init = function() {
    return this;
};


BB.gmap.rectangle.prototype.delete = function() {
    var i = 0;
    var total = this.__MARKERS.length;
    if (total) {
        for (; i < total; i++) {
            this.remove_point(i);
        }
    }

    // Parent
    return BB.gmap.object.prototype.delete.call(this);
};
