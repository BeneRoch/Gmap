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
 *    - image `url`
 *
 *
 * ##Methods
 *
 *
 */

BB.gmap.polygon = function (data, controller) {
    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.line.call(this, data, controller);

    return this;
};


/**
 * Extends BB.gmap.line
 */
BB.gmap.polygon.prototype = Object.create(BB.gmap.line.prototype);

/**
 *
 */
BB.gmap.polygon.prototype.init = function() {
    var _data = this.data();

    // Set styles
    if (typeof _data.styles !== 'object') {
        this.set_data({
            'styles': this.controller().data('default_styles')
        });
    }
    this.add_styles(_data.styles);

    // Default = Empty array
    // Makes it possible to DRAW a new line or polygon
    this.set_paths(this.data('paths'));

    if (this.get_paths() && this.get_styles()) {
        this.display();
    }

    // Allow editable from options
    if (_data.editable) {
        this.set_editable(_data.editable);
    }

    // this.listeners();
    this.controller().place_loaded(this);
    return this;
};

/**
 *
 * @returns {*}
 */
BB.gmap.polygon.prototype.get_paths = function()
{
    return this.__PATHS;
};

/**
 * Set paths and convert them to valid information
 * @param paths
 */
BB.gmap.polygon.prototype.set_paths = function(paths)
{
    this.__PATHS = this.convert_recursive_array_to_lat_lng(paths);
    if (this.object()) {
        this.object().setPaths(this.__PATHS);
    }
};


/**
 * Only difference
 */
BB.gmap.polygon.prototype.display = function () {

    var styles = this.get_styles();
    if (typeof styles === 'undefined') {
        this.error('Undefined styles at BB.gmap.polygon.display : ' + styles);
    }

    // Setting paths
    var paths = this.get_paths();
    if (typeof paths === 'undefined') {
        this.error('Undefined paths at BB.gmap.polygon.display : ' + paths);
    }
styles.editable = true;
styles.draggable = true;

    if (typeof this.object() !== 'undefined') {
        this.object().setOptions(styles);
    } else {
        var polygon = new google.maps.Polygon(styles);
        this.set_object(polygon);
    }

    this.object().setPaths(paths);

    this.set_map(this.controller().map());

    // this.listeners();

    return this;
};

BB.gmap.polygon.prototype.get_position = function () {
    return this.object().getPaths();
};
