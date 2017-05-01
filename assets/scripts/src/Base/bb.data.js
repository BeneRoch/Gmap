/**
 * @name Bene Bundle (BB)
 * @version version 1.0
 * @author Bene Roch
 * @description
 * DATAS
 * All datas added to the object will be affected to a "data object"
 * which makes all affectation pass by a single entry point
 */

var BB = BB || {};

/**
 * BB.data Class
 * This class exists to decide wheiter or not you wanna
 * show the data, make them accessible to the public
 *
 */
BB.data = function(data) {

    this.__PROTECTED__ = [];
    this.__HIDDEN_DATA__ = true;

    if (this.__HIDDEN_DATA__) {
        var __DATA = data || {};
        return {
            set_data: function(data) {
                for (var key in data) {
                    __DATA[key] = data[key];
                }
            },
            get_data: function(data) {
                if (!data) {
                    return __DATA;
                }
                if (typeof __DATA[data] != 'undefined') {
                    return __DATA[data];
                }
                return '';
            },
            remove_data: function(key) {
                if (!key) {
                    __DATA = {};
                }

                if (typeof __DATA[key] != 'undefined') {
                    __DATA[key] = undefined;
                    delete __DATA[key];
                }
                return;
            }
        };
    }

    this.__DATA = data || {};

    this.set_data = function(data) {
        if (!this.__DATA) {
            this.__DATA = data || {};
            return;
        }
        if (!data) {
            return;
        }
        for (var key in data) {
            this.__DATA[key] = data[key];
        }
        return;
    };

    this.get_data = function(data) {
        if (!data) {
            return this.__DATA;
        }
        if (typeof this.__DATA[data] != 'undefined') {
            return this.__DATA[data];
        }
        return;
    };

    this.remove_data = function(key) {
        if (!key) {
            this.__DATA = {};
        }

        if (typeof this.__DATA[key] != 'undefined') {
            this.__DATA[key] = undefined;
            delete this.__DATA[key];
        }
        return;
    };

    return this;
};