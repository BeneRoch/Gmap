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

BB.gmap.statics = BB.gmap.statics || {};

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
BB.gmap.infobox = function(elem, opts, marker) {
    this.__MAP = undefined;
    this.__MARKER = marker;

    // Original infobox content
    this.infoboxContent = elem;

    // Just remember this.
    // We wanna take INNERHTML of that Document Element
    this.__ELEM = undefined;

    // Extend
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
    google.maps.OverlayView.call(this);

    // Defaults
    opts.offsetY = opts.offsetY || 0;
    opts.offsetX = opts.offsetX || 0;
    opts.multiple = opts.multiple || false;

    // Remember options
    this.opts = opts;

    if (typeof this.opts.placement == 'undefined') {
        // Possible:
        // top center
        // top left
        // top right
        // center center
        // center left
        // center right
        // bottom center
        // bottom left
        // bottom right
        // over center
        // over right
        // over left
        // under center
        // under left
        // under right
        this.opts.placement = 'top center';
    }

    this.__MAP = opts.map;

    // Set map.
    this.set_map(opts.map);

};

/**
 * This is in an init method because it requires the presence of gmap before
 * instanciating as it is an extension of the google.maps.OverlayView() class.
 *
 */
function init_infoBox() {

    BB.gmap.infobox.prototype = new google.maps.OverlayView();
    BB.gmap.infobox.prototype.remove = function() {
        if (this._div) {
            try {
                this._div.parentNode.removeChild(this._div);
            } catch (err) {

            }
            this._div = null;
        }
    };

    /**
     * Sets the map for the infobox
     *
     */
    BB.gmap.infobox.prototype.set_position = function(position) {
        if (!position) {
            return this;
        }

        if (typeof position === 'string') {
            position = position.split(',');
        }

        if (!(position instanceof google.maps.LatLng)) {
            if (typeof position[0] === 'undefined' || typeof position[1] === 'undefined') {
                return this;
            }
            position = new google.maps.LatLng(position[0], position[1]);
        }

        this.opts.position = position;

        if (this.map) {
            this.draw();
        }
        return this;
    };


    /**
     * Sets the map for the infobox
     *
     */
    BB.gmap.infobox.prototype.set_map = function(map) {
        this.__MAP = map;
        this.setMap(this.__MAP);
    };

    /**
     * @see google.maps.OverlayView
     */
    BB.gmap.infobox.prototype.draw = function() {
        this.createElement();

        google.maps.event.trigger(this.__MAP, 'infobox_opened', { elem: this });
        // if (!this._div) return;

        var pixPosition = this.getProjection().fromLatLngToDivPixel(this.opts.position);
        if (!pixPosition) return;

        this._div.style.width = this._width + "px";
        this._div.style.left = (pixPosition.x + this._offsetX) + "px";
        this._div.style.height = this._height + "px";
        this._div.style.top = (pixPosition.y + this._offsetY) + "px";
        this._div.style.display = 'block';
        this._div.style.zIndex = 1;
    };

    /**
     *
     */
    BB.gmap.infobox.prototype.createElement = function() {
        // Generate infobox content
        this.generateInfoboxContent();

        var panes = this.getPanes();
        var div = this._div;

        if (div) {
            if (div.parentNode != panes.floatPane) {
                // The panes have changed.  Move the div.
                try {
                    div.parentNode.removeChild(div);
                } catch (err) {

                }
            }
        }

        if (!div) {
            div = this._div = document.createElement("div");
            div.style.border = "0";
            div.style.position = "absolute";
        }

        div.innerHTML = '';

        // Add content right on
        div.appendChild(this.__ELEM);
        panes.floatPane.appendChild(div);

        // Place content from with and height
        this._height = this.__ELEM.offsetHeight;
        this._width = this.__ELEM.offsetWidth;

        div.style.width = this._width + "px";
        div.style.height = this._height + "px";

        var infobox_class = 'gmap_infobox';
        div.setAttribute('class', infobox_class);

        // div.style.display = 'none';
        var position = this.opts.placement.split(' ');

        switch (position[0]) {
            case 'top':
                this._offsetY =  -parseFloat(this.opts.offsetY);
            break;
            case 'over':
                this._offsetY =  -parseFloat(this.opts.offsetY) - parseInt(this._height);
            break;
            case 'bottom':
                this._offsetY = - parseFloat(this._height);
            break;
            case 'under':
                this._offsetY =  0;
            break;
            case 'center':
                this._offsetY =  -parseFloat(this.opts.offsetY)/2 - parseInt(this._height)/2;
            break;
        }
        switch (position[1]) {
            case 'right':
                this._offsetX = (parseFloat(this.opts.offsetX)) - parseInt(this._width);
            break;
            case 'left':
                this._offsetX = -(parseFloat(this.opts.offsetX));
            break;
            case 'center':
                this._offsetX = - (parseInt(this._width)/2);
            break;
            case 'out-right':
                this._offsetX = (parseFloat(this.opts.offsetX));;
            break;
            case 'out-left':
                this._offsetX = -(parseFloat(this.opts.offsetX))-parseInt(this._width);
            break;
        }
    };

    /**
     *
     * @returns {BB.gmap.infobox}
     */
    BB.gmap.infobox.prototype.generateInfoboxContent = function() {
        var elem = this.infoboxContent;
        if (typeof elem === 'function') {
            elem = elem(this.__MARKER.data());
        }

        if (typeof elem === 'number') {
            elem = elem.toString();
        }

        if (typeof elem === 'string') {
            // Does the infobox exists in the dom already?
            var infobox = document.getElementById(elem);

            // If not, create a DIV element with it.
            if (!infobox) {
                infobox = document.createElement('div');
                infobox.style.position = 'absolute'; // Or this wont display corretly
                infobox.innerHTML = elem;
            }
            elem = infobox;
        }

        if (typeof jQuery !== 'undefined') {
            // Let's get rid of jQuery for this one
            if (elem instanceof jQuery) {
                // Select DOMElement
                elem = elem.get(0);
            }
        }

        this.__ELEM = elem;
        return this;
    };

    /**
     *
     */
    BB.gmap.infobox.prototype.refresh = function()
    {
        this.generateInfoboxContent();
    };
}
