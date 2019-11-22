/**
 * @name Bene Bundle (BB)
 * @version version 1.0
 * @author Bene Roch
 * @description
 * BASE
 * All reusable object methods and properties
 * - set_data
 * - data
 * - remove_data
 * - sanitize
 * - unsanitize
 * - escape_data
 * - unescape_data
 * - ident
 * - set_ident
 * - error // using the this.__BB_DEBUG__ to output error
 * Development feature.
 */

var BB = BB || {};

/**
 * BB.base Class
 * Base of all BB's objects
 *
 */
BB.base = function() {

    this.__BB_DEBUG__ = false;
    this.__PROTECTED__ = [];

    this._data = undefined;
};

/**
 *
 * @param data 	|	{Object}	|	{ key : data, key : data } object
 * @return this (chainable)
 */
BB.base.prototype.set_data = function(data) {
    if (typeof this._data == 'undefined') {
        this._data = new BB.data();
    }
    if (typeof data != 'object') {
        return this;
    }

    this._data.set_data(data);
    return this;

};

/**
 *
 * @param data 	|	{Object}	|	{ key : data, key : data } object
 * @return this (chainable)
 */
BB.base.prototype.remove_data = function(data) {
    this._data.remove_data(data);
    return this;

};

/**
 *
 * @return {mixed} data | {Object} data  || {Mixed} data[ key ]
 */
BB.base.prototype.get_data = function(key) {
    var data = this.data();
    if (typeof data[key] != 'undefined') {
        return data[key];
    }
    return false;
};

/**
 *
 * @param data 	|	{Object}	|	{ key : data, key : data } object
 * @return this (chainable)
 */
BB.base.prototype.data = function(data) {
    return this._data.get_data(data);
};

BB.base.prototype.sanitize = function() {
    var data = this.data();
    data = this._escape_data(data);
    this.set_data(data);
    return this;
};

/**
 * Every data passed to this function will be cleaned and encoded for web
 * Recursive
 * Prevents output errors
 * @param data 		|		{Object} 		|
 * @return {Object} data
 */
BB.base.prototype._escape_data = function(data) {
    if (typeof data === 'undefined') {
        return '';
    }

    if (typeof data === 'object' && data.length) {
        var i = 0;
        var count = data.length;
        for (; i < count; i++) {
            data[i] = this._escape_data(data[i]);
        }
    }

    if (typeof data === 'object') {
        for (var k in data) {
            data[k] = this._escape_data(data[k]);
        }
    }

    if (typeof data === 'string') {
        return escape(data);
    }

    // Default;
    return data;
};

/**
 * Every data passed to this function will be cleaned and encoded for web
 * Recursive
 * Prevents output errors
 * @param data 		|		{Object} 		|
 * @return {Object} data
 */
BB.base.prototype._unescape_data = function(data) {
    if (typeof data === 'undefined') {
        return '';
    }

    if (typeof data === 'object') {
        for (var k in data) {
            data[k] = this._unescape_data(data[k]);
        }
    }

    if (typeof data === 'string') {
        return unescape(data);
    }

    // Default;
    return data;
};



/**
 * Return current object ident
 * Ident
 * @return string
 */
BB.base.prototype.ident = function() {
    var _data = this.data();
    if (typeof _data.ident !== 'string') {
        this.error('Ident is not a String which is odd. ' + _data.ident);
        return '';
    }
    return _data.ident;
};

/**
 * Sets the ident for the current object
 * Ident parameters must be a string. If its not, it is converted
 * to one, which my give {Object object} if object values are passed.
 * If __BB_DEBUG__ is on, throws an error
 *
 * @param string 	ident 			MUST be a string
 * @return this (chainable)
 */
BB.base.prototype.set_ident = function(ident) {
    if (typeof ident !== 'string') {
        ident = '' + ident;
        this.error('Ident must be a string. Automatically converted to : ' + ident);
    }
    this.set_data({
        'ident': ident
    });

    return this;
};


BB.base.prototype.error = function(error_msg) {
    if (this.__BB_DEBUG__) {
        throw Error(error_msg);
    }
    return this;
};

/**
 * Utils
 * Check if object is empty
 * @param obj Object
 * @return boolean
 */
BB.base.prototype.is_empty_object = function(obj) {
    if (typeof obj !== 'object') {
        this.error('Invalid argument, Object expected at BB.base.is_empty_object()');
        return true;
    }
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return true;
};

/**
 * Merge defaults with user options
 * @private
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
BB.base.prototype.extend = function(defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};