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
BB.gmap.richmarker = function(data, controller) {

    // Call the supra class constructor with the arguments
    // The controller and object are set in the BB.gmap.object Class
    BB.gmap.marker.call(this, data, controller);

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
BB.gmap.richmarker.prototype = Object.create(BB.gmap.marker.prototype);

/**
 *
 */
BB.gmap.richmarker.prototype.init = function() {
    var _data = this.data();

    this.set_content(_data.content);

    // No image load, no need to wait.
    this.display();

    return this;
};

BB.gmap.richmarker.prototype.set_content = function(content) {
    this._content = content;
    return this;
}

BB.gmap.richmarker.prototype.content = function() {
    return this._content;
}

/**
 *
 *
 */
BB.gmap.richmarker.prototype.display = function() {
    var _data = this.data();

    if (typeof _data.coords != 'object') {
        this.error('Requires coordinates [lat, lng] at BB.gmap.richmarker.display()');
        return false;
    }
    var options = {
        map: this.controller().map(),
        position: new google.maps.LatLng(_data.coords[0], _data.coords[1])
    };

    options = this.extend(options, _data);

    if (typeof options.html == 'function') {
        options.html = options.html(_data);
    }

    if (typeof options.selected_html == 'function') {
        options.selected_html = options.selected_html(_data);
    }

    if (typeof this.object() != 'undefined') {
        this.object().setOptions(options);
    } else {
        var marker = customMarker(options);
        this.set_marker(marker);
    }

    if (!this._listeners) {
        this.listeners();
        this._listeners = true;
        this.controller().place_loaded(this);
    }

    // From BB.gmap.line
    // If hidden, don't show it yet.
    if (this.data('hidden')) {
        this.hide();
    }

    return this;
};



/**
 * Sets or remove listeners according to plan and / but mainly options.
 *
 */
BB.gmap.richmarker.prototype.listeners = function() {
    // Scope
    var that = this;

    // Marker
    var marker = this.object();

    marker.bbmarker = this;

    if (this.data('draggable')) {
        google.maps.event.addListener(marker, 'dragend', that.dragend);
    }

    // click listeners
    // No condition, which is different to the dragend option
    // We might always use the click event, I see no reason to make
    // it optional. Options will occur in the event handler.
    google.maps.event.addListener(marker, 'click', that.onclick);

};

BB.gmap.richmarker.prototype.clear_listeners = function() {
    var marker = this.object();

    google.maps.event.clearListeners(marker, 'dragend');
    google.maps.event.clearListeners(marker, 'click');

    return this;
};

/**
 * marker-selected.png
 */
BB.gmap.richmarker.prototype.focus = function() {

    if (this.controller().focused()) {
        if (this.controller().focused().ident() == this.ident()) {
            return this;
        }
    }

    // Selected icon
    // Set selected state
    this.controller().set_focus(this);
    this.object().setHtml(this.data('selected_html'));
};

BB.gmap.richmarker.prototype.blur = function() {
    // Mechanics calls this methods upon map reset
    // We wanna check if the place still exists in the ma data entry
    if (!this.controller().get_place(this.ident())) {
        return false;
    }

    // Selected icon
    // Unset selected state
    this.object().setHtml(this.data('html'));
};

BB.gmap.richmarker.prototype.icon = function() {
    return {
        height: this.object().div.offsetHeight,
        width: this.object().div.offsetWidth
    }
};


/**
 * Expecting:
 * map
 * position
 * html
 * 
 * @param  {object} data Data for the marker.
 * @return {customMarker}Gmap custom marker object.
 */
customMarker = function(data) {

    if (!(typeof BB.gmap.customMarker == "function")) {
        BB.gmap.customMarker = function(data) {
            this.MAP = data.map;
            if (typeof data.map !== 'undefined') {
                this.setMap(this.MAP);
            }

            if (typeof data.position !== 'undefined') {
                this.latlng = data.position;
            }

            if (typeof data.html !== 'undefined') {
                this.html = data.html;
            }
        };

        BB.gmap.customMarker.prototype = new google.maps.OverlayView();
        BB.gmap.customMarker.prototype.draw = function() {
            this.setHtml(this.html);
        };

        BB.gmap.customMarker.prototype.setHtml = function(html) {
            var self = this;
            var div = this.div;
            if (!div) {
                div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.cursor = 'pointer';
                google.maps.event.addDomListener(div, "click", function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    google.maps.event.trigger(self, "click");
                });
                var panes = this.getPanes();
                panes.overlayImage.appendChild(div);
            }
            div.innerHTML = this.html;

            var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

            if (point) {
                var height = div.offsetHeight;
                var width = div.offsetWidth;

                div.style.left = point.x - (width/ 2) + 'px';
                div.style.top = point.y - (height) + 'px';
            }

            this.div = div;
        }

        BB.gmap.customMarker.prototype.remove = function() {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            }
        };

        BB.gmap.customMarker.prototype.setPosition = function(latLng) {
            this.latlng = latLng;
            this.draw();
        };

        BB.gmap.customMarker.prototype.getPosition = function() {
            return this.latlng;
        };
    }

    return new BB.gmap.customMarker(data);
}