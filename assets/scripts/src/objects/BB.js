/**
 * @name Bene Bundle (BB)
 * @version version 1.0
 * @author Bene Roch
 * @description
 *
 */

/** 
* This is a configuration variable.
* You can decide to hide any datas within the object.
* This uses a scope particularity of Javascript to do just that.
* If you change it AFTER initiation of any object prototyping BB.base()
* it won't matter at all. Objects before will have hidden datas, new objects
* will have visible datas at _datas.__DATAS
* @see BB.datas()
*/
var __HIDDEN_DATAS__ = true;


var BB = BB || {};

/**
* BB.datas Class
* This class exists to decide wheiter or not you wanna
* show the datas, make them accessible to the public
*
*/
BB.datas = function(datas)
{
	this.hidden = __HIDDEN_DATAS__;

	if (this.hidden) {
		var __DATAS = datas || {};
		return {
			set_datas: function(datas) { 	
				for (var key in datas) {
					__DATAS[key] = datas[ key ];
				}
		 },
			get_datas: function(datas) { 
				if (!datas) {
					return __DATAS; 
				}
				if (typeof __DATAS[ datas ] != 'undefined') {
					return __DATAS[ datas ];
				}
				return '';
			}
		}
	}

	this.__DATAS = datas || {};

	this.set_datas = function(datas) { 
		if (!this.__DATAS) {
			this.__DATAS = datas || {};
		}	
		if (!datas) {
			return ;
		}
		for (var key in datas) {
			this.__DATAS[key] = datas[ key ];
		}
		return ;
	}
	this.get_datas = function(datas) { 
		if (!datas) {
			return this.__DATAS; 
		}
		if (typeof this.__DATAS[ datas ] != 'undefined') {
			return this.__DATAS[ datas ];
		}
	}

	return this;
}


/**
* BB.base Class
* Base of all BB's objects
*
*/
BB.base = function() {
	this._datas = new BB.datas();
}

/**
*
* @param datas 	|	{Object}	|	{ key : data, key : data } object
* @return this (chainable)
*/
BB.base.prototype.set_datas = function(datas)
{
	if (typeof datas != 'object') {
		return this;
	}

	this._datas.set_datas(datas);
	return this;

}

BB.base.prototype.get_data = function(key)
{
	var datas = this.datas();
	if (typeof datas[ key ] != 'undefined') {
		return datas[ key ];
	}
	return {};
}

/**
*
* @param datas 	|	{Object}	|	{ key : data, key : data } object
* @return this (chainable)
*/
BB.base.prototype.datas = function(data)
{
	return this._datas.get_datas(data);
}

BB.base.prototype.sanitize = function()
{
	var datas = this.datas();
	datas = this._escape_datas(datas);
	this.set_datas(datas);
	return this;
}

/**
* Every data passed to this function will be cleaned and encoded for web
* Recursive
* Prevents output errors
* @param datas 		|		{Object} 		|
* @return {Object} data
*/ 
BB.base.prototype._escape_datas = function(data) {
	var that = this;

	if (typeof data == 'undefined') {
		return '';
	}

	if (typeof data == 'array') {
		var i = 0;
		var count = data.length;
		for (; i < count; i++) {
			data[i] = this._escape_datas(data[i]);
		}
	}

	if (typeof data == 'object') {
		for (var i in data) {
			data[i] = this._escape_datas(data[i]);
		}
	}

	if (typeof data == 'string') {
		return escape( data );
	}

	// Default;
	return data;
}

/**
* Every data passed to this function will be cleaned and encoded for web
* Recursive
* Prevents output errors
* @param datas 		|		{Object} 		|
* @return {Object} data
*/ 
BB.base.prototype._unescape_datas = function(data) {
	var that = this;

	if (typeof data == 'undefined') {
		return '';
	}

	if (typeof data == 'array') {
		var i = 0;
		var count = data.length;
		for (; i < count; i++) {
			data[i] = this._unescape_datas(data[i]);
		}
	}

	if (typeof data == 'object') {
		for (var i in data) {
			data[i] = this._unescape_datas(data[i]);
		}
	}

	if (typeof data == 'string') {
		return unescape( data );
	}

	// Default;
	return data;
}
