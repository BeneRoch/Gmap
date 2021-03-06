/**
 * @name BB Gmap RichMarker
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
BB.gmap.richmarker = function (data, controller) {

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
BB.gmap.richmarker.prototype.init = function () {
    var _data = this.data();

    this.set_content(_data.content);

    this.setup_content();

    // No image load, no need to wait.
    this.show();

    return this;
};

/**
 *
 */
BB.gmap.richmarker.prototype.setup_content = function()
{
    var _data = this.data();

    var options = {
        map:      this.controller().map()
    };

    options = this.extend(options, _data);

    if (typeof options.html === 'function') {
        options.html = options.html(_data);
    }

    if (typeof options.selected_html === 'function') {
        options.selected_html = options.selected_html(_data);
    }

    options.position = this.get_position();

    var marker = customMarker(options);
    this.set_marker(marker);

    if (!this._listeners) {
        this.listeners();
        this._listeners = true;
        this.controller().place_loaded(this);
    }
};

BB.gmap.richmarker.prototype.set_content = function (content) {
    this._content = content;
    return this;
};

BB.gmap.richmarker.prototype.content = function () {
    return this._content;
};


/**
 * Sets or remove listeners according to plan and / but mainly options.
 *
 */
BB.gmap.richmarker.prototype.listeners = function () {
    // Scope
    var that = this;

    // Marker
    var marker = this.object();

    marker.bbobject = this;

    if (this.data('draggable')) {
        google.maps.event.addListener(marker, 'dragend', that.dragend);
    }

    // click listeners
    // No condition, which is different to the dragend option
    // We might always use the click event, I see no reason to make
    // it optional. Options will occur in the event handler.
    google.maps.event.addListener(marker, 'click', that.onclick);

};

BB.gmap.richmarker.prototype.clear_listeners = function () {
    var marker = this.object();

    google.maps.event.clearListeners(marker, 'dragend');
    google.maps.event.clearListeners(marker, 'click');

    return this;
};

/**
 * marker-selected.png
 */
BB.gmap.richmarker.prototype.focus = function () {
    this.check_infobox(true);

    if (this.controller().focused()) {
        if (this.controller().focused().ident() === this.ident()) {
            return this;
        }
    }

    this.controller().set_focus(this);

    // Selected icon
    // Set selected state
    if (this.data('selected_html')) {
        var selected_html = this.data('selected_html');
        if (typeof selected_html === 'function') {
            selected_html = selected_html(this.data());
        }
        this.object().setHtml(selected_html);
    }
};

BB.gmap.richmarker.prototype.blur = function () {
    this.check_infobox(false);
    this.controller().remove_focus(this.ident());

    // Mechanics calls this methods upon map reset
    // We wanna check if the place still exists in the ma data entry
    if (!this.controller().get_place(this.ident())) {
        return false;
    }

    // Selected icon
    // Unset selected state
    var html = this.data('html');
    if (typeof html === 'function') {
        html = html(this.data());
    }
    this.object().setHtml(html);
};

BB.gmap.richmarker.prototype.icon = function () {
    return {
        height: this.object().div.offsetHeight,
        width:  this.object().div.offsetWidth
    }
};

/**
 * Hide the marker
 * @return this (chainable)
 */
BB.gmap.richmarker.prototype.hide = function () {
    this.set_map(null);
    this.object().dirty = false;
    return this;
};

/**
 * Hide the marker
 * @return this (chainable)
 */
BB.gmap.richmarker.prototype.show = function () {
    this.object().dirty = false;
    this.set_map(this.controller().map());
    return this;
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
customMarker = function (data) {

    if (typeof BB.gmap.customMarker !== "function") {
        BB.gmap.customMarker = function (data) {
            this.dirty = false;
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

        BB.gmap.customMarker.prototype      = new google.maps.OverlayView();
        BB.gmap.customMarker.prototype.draw = function () {
            if (!this.dirty) {
                this.updateHtml();
                this.dirty = true;
            }
            this.setPositionFromDraw();
        };

        BB.gmap.customMarker.prototype.setPositionFromDraw = function () {
            var div   = this.div;
            if (!div) {
                return this;
            }

            if (!this.getProjection()) {
                return this;
            }

            var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

            if (point) {
                var height = div.offsetHeight;
                var width  = div.offsetWidth;

                div.style.left = point.x - (width / 2) + 'px';
                div.style.top  = point.y - (height) + 'px';
            }

            this.div = div;
            return this;
        };

        BB.gmap.customMarker.prototype.updateHtml = function () {
            var self = this;
            var div  = this.div;
            if (!div) {
                div                = document.createElement('div');
                div.style.position = 'absolute';
                div.style.cursor   = 'pointer';

                google.maps.event.addDomListener(div, "click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    google.maps.event.trigger(self, "click");
                });

                var panes = this.getPanes();

                if (panes) {
                    panes.overlayImage.appendChild(div);
                }
            }


            div.innerHTML = this.html;
            this.div = div;
        };

        BB.gmap.customMarker.prototype.setHtml = function (html) {
            this.html = html;

            this.dirty = false;
            this.updateHtml();
            this.setPositionFromDraw();
        };

        BB.gmap.customMarker.prototype.remove = function () {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            }
        };

        BB.gmap.customMarker.prototype.setPosition = function (latLng) {
            this.latlng = latLng;
            this.draw();
        };

        BB.gmap.customMarker.prototype.getPosition = function () {
            return this.latlng;
        };
    }

    return new BB.gmap.customMarker(data);
}
