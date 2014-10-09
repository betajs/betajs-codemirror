/*!
betajs - v1.0.0 - 2014-10-02
Copyright (c) Oliver Friedmann,Victor Lingenthal
MIT Software License.
*/
var BetaJS = BetaJS || {};
/*
 * Export for NodeJS
 */
if (typeof module != "undefined" && "exports" in module)
	module.exports = BetaJS;

/** @class */
BetaJS.Types = {
	
    /** Returns whether argument is an object
     * 
     * @param x argument
     * @return true if x is an object
     */
	is_object: function (x) {
		return typeof x == "object";
	},
	
    /** Returns whether argument is an array
     * 
     * @param x argument
     * @return true if x is an array
     */
	is_array: function (x) {
		return Object.prototype.toString.call(x) === '[object Array]';
	},
	
    /** Returns whether argument is undefined (which is different from being null)
     * 
     * @param x argument
     * @return true if x is undefined
     */
	is_undefined: function (x) {
		return typeof x == "undefined";		
	},
	
    /** Returns whether argument is null (which is different from being undefined)
     * 
     * @param x argument
     * @return true if x is null
     */
	is_null: function (x) {
		return x === null;
	},
	
    /** Returns whether argument is undefined or null
     * 
     * @param x argument
     * @return true if x is undefined or null
     */
	is_none: function (x) {
		return this.is_undefined(x) || this.is_null(x);
	},
	
    /** Returns whether argument is defined (could be null)
     * 
     * @param x argument
     * @return true if x is defined
     */
	is_defined: function (x) {
		return typeof x != "undefined";
	},
	
    /** Returns whether argument is empty (undefined, null, an empty array or an empty object)
     * 
     * @param x argument
     * @return true if x is empty
     */
	is_empty: function (x) {
		if (this.is_none(x)) 
			return true;
		if (this.is_array(x))
			return x.length === 0;
		if (this.is_object(x)) {
			for (var key in x)
				return false;
			return true;
		}
		return false; 
	},
	
    /** Returns whether argument is a string
     * 
     * @param x argument
     * @return true if x is a a string
     */
	is_string: function (x) {
		return typeof x == "string";
	},
	
    /** Returns whether argument is a function
     * 
     * @param x argument
     * @return true if x is a function
     */
	is_function: function (x) {
		return typeof x == "function";
	},
	
    /** Returns whether argument is boolean
     * 
     * @param x argument
     * @return true if x is boolean
     */
	is_boolean: function (x) {
		return typeof x == "boolean";
	},
	
    /** Compares two values
     * 
     * If values are booleans, we compare them directly.
     * If values are arrays, we compare them recursively by their components.
     * Otherwise, we use localeCompare which compares strings.
     * 
     * @param x left value
     * @param y right value
     * @return 1 if x > y, -1 if x < y and 0 if x == y
     */
	compare: function (x, y) {
		if (BetaJS.Types.is_boolean(x) && BetaJS.Types.is_boolean(y))
			return x == y ? 0 : (x ? 1 : -1);
		if (BetaJS.Types.is_array(x) && BetaJS.Types.is_array(y)) {
			var len_x = x.length;
			var len_y = y.length;
			var len = Math.min(len_x, len_y);
			for (var i = 0; i < len; ++i) {
				var c = this.compare(x[i], y[i]);
				if (c !== 0)
					return c;
			}
			return len_x == len_y ? 0 : (len_x > len_y ? 1 : -1);
		}
		return x.localeCompare(y);			
	},
	
    /** Parses a boolean string
     * 
     * @param x boolean as a string
     * @return boolean value
     */	
	parseBool: function (x) {
		if (this.is_boolean(x))
			return x;
		if (x == "true")
			return true;
		if (x == "false")
			return false;
		return null;
	},
	
    /** Returns the type of a given expression
     * 
     * @param x expression
     * @return type string
     */	
	type_of: function (x) {
		if (this.is_array(x))
			return "array";
		return typeof x;
	}

};

/** @class */
BetaJS.Strings = {

	/** Converts a string new lines to html <br /> tags
	 *
	 * @param s string
	 * @return string with new lines replaced by <br />
	 */
	nl2br : function(s) {
		return (s + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
	},

	/** Converts special characters in a string to html entitiy symbols
	 *
	 * @param s string
	 * @return converted string
	 */
	htmlentities : function(s) {
		return (s + "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
	},

	JS_ESCAPES : {
		"'" : "'",
		'\\' : '\\',
		'\r' : 'r',
		'\n' : 'n',
		'\t' : 't',
		'\u2028' : 'u2028',
		'\u2029' : 'u2029'
	},

	JS_ESCAPER_REGEX : function() {
		if (!this.JS_ESCAPER_REGEX_CACHED)
			this.JS_ESCAPER_REGEX_CACHED = new RegExp(BetaJS.Objs.keys(this.JS_ESCAPES).join("|"), 'g');
		return this.JS_ESCAPER_REGEX_CACHED;
	},

	/** Converts string such that it can be used in javascript by escaping special symbols
	 *
	 * @param s string
	 * @return escaped string
	 */
	js_escape : function(s) {
		var self = this;
		return s.replace(this.JS_ESCAPER_REGEX(), function(match) {
			return '\\' + self.JS_ESCAPES[match];
		});
	},

	/** Determines whether a string starts with a sub string
	 *
	 * @param s string in question
	 * @param needle sub string
	 * @return true if string in question starts with sub string
	 */
	starts_with : function(s, needle) {
		return s.substring(0, needle.length) == needle;
	},

	/** Determines whether a string ends with a sub string
	 *
	 * @param s string in question
	 * @param needle sub string
	 * @return true if string in question ends with sub string
	 */
	ends_with : function(s, needle) {
		return s.indexOf(needle, s.length - needle.length) !== -1;
	},

	/** Removes sub string from a string if string starts with sub string
	 *
	 * @param s string in question
	 * @param needle sub string
	 * @return string without sub string if it starts with sub string otherwise it returns the original string
	 */
	strip_start : function(s, needle) {
		return this.starts_with(s, needle) ? s.substring(needle.length) : s;
	},

	/** Returns the complete remaining part of a string after a the last occurrence of a sub string
	 *
	 * @param s string in question
	 * @param needle sub string
	 * @return remaining part of the string in question after the last occurrence of the sub string
	 */
	last_after : function(s, needle) {
		return s.substring(s.lastIndexOf(needle) + needle.length, s.length);
	},

	EMAIL_ADDRESS_REGEX : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

	/** Determines whether a string is a syntactically valid email address
	 *
	 * @param s string in question
	 * @return true if string looks like an email address
	 */
	is_email_address : function(s) {
		return this.EMAIL_ADDRESS_REGEX.test(s);
	},

	STRIP_HTML_TAGS : ["script", "style", "head"],
	STRIP_HTML_REGEX : /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi,
	STRIP_HTML_COMMENT_REGEX : /<![^>]*>/gi,

	/** Removes all html from data and returns plain text
	 *
	 * @param html string containing html
	 * @return string containing the plain text part of it
	 */
	strip_html : function(html) {
		var result = html;
		for ( i = 0; i < this.STRIP_HTML_TAGS.length; ++i)
			result = result.replace(new RegExp("<" + this.STRIP_HTML_TAGS[i] + ".*</" + this.STRIP_HTML_TAGS[i] + ">", "i"), '');
		result = result.replace(this.STRIP_HTML_REGEX, '').replace(this.STRIP_HTML_COMMENT_REGEX, '');
		return result;
	},

	/** Trims all trailing and leading whitespace and removes block indentations
	 *
	 * @param s string
	 * @return string with trimmed whitespaces and removed block indentation
	 */
	nltrim : function(s) {
		var a = s.replace(/\t/g, "  ").split("\n");
		var len = null;
		var i = 0;
		for ( i = 0; i < a.length; ++i) {
			var j = 0;
			while (j < a[i].length) {
				if (a[i].charAt(j) != ' ')
					break;
				++j;
			}
			if (j < a[i].length)
				len = len === null ? j : Math.min(j, len);
		}
		for ( i = 0; i < a.length; ++i)
			a[i] = a[i].substring(len);
		return a.join("\n").trim();
	},

	read_cookie_string : function(raw, key) {
		var cookie = "; " + raw;
		var parts = cookie.split("; " + key + "=");
		if (parts.length == 2)
			return parts.pop().split(";").shift();
		return null;
	},

	write_cookie_string : function(raw, key, value) {
		var cookie = "; " + raw;
		var parts = cookie.split("; " + key + "=");
		if (parts.length == 2)
			cookie = parts[0] + parts[1].substring(parts[1].indexOf(";"));
		return key + "=" + value + cookie;
	},

	capitalize : function(input) {
		return input.replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	},

	email_get_name : function(input) {
	    input = input || "";
		var temp = input.split("<");
		input = temp[0].trim();
		if (!input && temp.length > 1) {
			temp = temp[1].split(">");
			input = temp[0].trim();
		}		
		input = input.replace(/['"]/g, "").replace(/[\\._@]/g, " ");
		return this.capitalize(input);
	},

	email_get_email : function(input) {
        input = input || "";
		var temp = input.split("<");
		input = temp[0].trim();
		if (temp.length > 1) {
			temp = temp[1].split(">");
			input = temp[0].trim();
		}
		input = input.replace(/'/g, "").replace(/"/g, "").trim();
		return input;
	},

	email_get_salutatory_name : function(input) {
        input = input || "";
		return (this.email_get_name(input).split(" "))[0];
	}
};

/** @class */
BetaJS.Functions = {
	
    /** Takes a function and an instance and returns the method call as a function
     * 
     * @param func function
     * @param instance instance
     * @return method call 
     */
	as_method: function (func, instance) {
		return function() {
			return func.apply(instance, arguments);
		};
	},
	
    /** Takes a function and returns a function that calls the original function on the first call and returns the return value on all subsequent call. In other words a lazy function cache.
     * 
     * @param func function
     * @return cached function 
     */
	once: function (func) {
		var result = false;
		var executed = false;
		return function () {
			if (executed)
				return result;
			executed = true;
			result = func.apply(this, arguments);
			func = null;
			return result;
		};
	},
	
    /** Converts some other function's arguments to an array
     * 
     * @param func function arguments
     * @param slice number of arguments to be omitted (default: 0)
     * @return arguments as array 
     */	
	getArguments: function (args, slice) {
		return Array.prototype.slice.call(args, slice || 0);
	},
	
    /** Matches functions arguments against some pattern
     * 
     * @param args function arguments
     * @param pattern typed pattern
     * @return matched arguments as associative array 
     */	
	matchArgs: function (args, pattern) {
		var i = 0;
		var result = {};
		for (var key in pattern) {
			if (pattern[key] === true || BetaJS.Types.type_of(args[i]) == pattern[key]) {
				result[key] = args[i];
				i++;
			}
		}
		return result;
	}
	
};

/** @class */
BetaJS.SyncAsync = {
	
	eventually: function (func, params, context) {
		var timer = setTimeout(function () {
			clearTimeout(timer);
			if (!BetaJS.Types.is_array(params)) {
				context = params;
				params = [];
			}
			func.apply(context || this, params || []);
		}, 0);
	},
	
    /** Converts a synchronous function to an asynchronous one and calls it
     * 
     * @param callbacks callbacks object with success and exception
     * @param syncCall the synchronous function
     * @param params optional syncCall params
     * @param context optional object context
     */	
	syncToAsync: function (callbacks, syncCall) {
		var args = BetaJS.Functions.matchArgs(BetaJS.Functions.getArguments(arguments, 2), {
			params: "array",
			context: "object"
		});
		try {
			if (callbacks && callbacks.success)
				callbacks.success.call(callbacks.context || this, syncCall.apply(args.context || this, args.params || []));
		} catch (e) {
			if (callbacks && callbacks.exception)
				callbacks.exception.call(callbacks.context || this, e);
		}
	},
	
    /** Either calls a synchronous or asynchronous function depending on whether preferSync is given
     * 
     * @param callbacks callbacks object with success and exception (or null)
     * @param preferSync prefer synchronous call?
     * @param syncCall the synchronous function
     * @param asyncCall the asynchronous function
     * @param params optional syncCall params
     * @param context optional object context
     * @return the function return data
     */	
	either: function (callbacks, preferSync, syncCall, asyncCall) {
		var args = BetaJS.Functions.matchArgs(BetaJS.Functions.getArguments(arguments, 4), {
			params: "array",
			context: "object"
		});
		if (callbacks && !preferSync && !callbacks.sync) {
			var params = args.params || [];
			params.push(callbacks); 
			asyncCall.apply(args.context || this, params);
			return null;
		} else
			return this.eitherSync(callbacks, syncCall, args.params, args.context);
	},
	
	eitherSync: function (callbacks, syncCall) {
		var args = BetaJS.Functions.matchArgs(BetaJS.Functions.getArguments(arguments, 2), {
			params: "array",
			context: "object"
		});
		var context = args.context || this;
		var params = args.params || [];
		if (callbacks)
			this.syncToAsync(callbacks, syncCall, params, context);
		else
			return syncCall.apply(context, params);
		return null;
	},
	
	SYNC: 1,
	ASYNC: 2,
	ASYNCSINGLE: 3,
	
	toCallbackType: function (callbacks, type) {
		if (type == this.ASYNCSINGLE)
			return function (err, result) {
                var caller = err ? "exception" : "success";
                if (caller in callbacks)
                    callbacks[caller].call(callbacks.context || this, err ? err : result);
			};
		return callbacks;
	},
	
	then: function () {
		var args = BetaJS.Functions.matchArgs(arguments, {
			func_ctx: "object",
			func: true,
			params: "array",
			type: "number",
			callbacks: true,
			success_ctx: "object",
			success: "function",
			exception: "function"
		});
		var func_ctx = args.func_ctx || this;
		var func = args.func;
		var params = args.params || [];
		var callbacks = args.callbacks;
		var type = args.type || (!callbacks || callbacks.sync ? this.SYNC : this.ASYNC);
		var success_ctx = args.success_ctx || func_ctx;
		var success = args.success;
		var exception = args.exception;
		if (type != this.SYNC) {			
			params.push(this.toCallbackType({
				context: callbacks.context,
				success: success ? function (ret) {
					success.call(success_ctx, ret, callbacks);
				} : callbacks.success,
				exception: exception ? function (error) {
					exception.call(success_ctx, error, callbacks);
				} : callbacks.exception
			}, type));
			func.apply(func_ctx, params);
		} else if (callbacks) {
			try {
				if (success)
					success.call(success_ctx, func.apply(func_ctx, params), callbacks);
				else
					callbacks.success.call(callbacks.context || this, func.apply(func_ctx, params));
			} catch (e) {
				if (exception)
					exception.call(success_ctx, e, callbacks);
				else if (callbacks.exception)
					callbacks.exception.call(callbacks.context || this, e);
				else
					throw e;
			}
		} else {
			try {
				var ret = func.apply(func_ctx, params);
				if (success)
					success.call(success_ctx, ret, {
						sync: true,
						success: function (retv) {
							ret = retv;
						},
						exception: function (err) {
							throw err;
						}
					});
				return ret;
			} catch (e) {
				if (exception) {
					exception.call(success_ctx, e, {
						sync: true,
						success: function (retv) {
							ret = retv;
						},
						exception: function (err) {
							throw err;
						}
					});
					return ret;
				} else
					throw e;
			}
		}
		return null;
	},
	
	PROMISE_LAZY: 1,
	PROMISE_ACTIVE: 2,
	PROMISE_SUCCESS: 3,
	PROMISE_EXCEPTION: 4,

	lazy: function () {
		var args = BetaJS.Functions.matchArgs(arguments, {
			func_ctx: "object",
			func: true,
			params: "array",
			type: "number"
		});
		return {
			state: this.PROMISE_LAZY,
			func_ctx: args.func_ctx || this,
			func: args.func,
			params: args.params || [],
			type: args.type || this.ASYNC
		};
	},
	
	promise: function () {
		var args = BetaJS.Functions.matchArgs(arguments, {
			func_ctx: "object",
			func: true,
			params: "array",
			type: "number"
		});
		var func_ctx = args.func_ctx || this;
		var func = args.func;
		var params = args.params || [];
		var type = args.type || this.ASYNC;
		if (type == this.SYNC) {
			try {
				return {
					state: this.PROMISE_SUCCESS,
					result: func.apply(func_ctx, params)
				};
			} catch (e) {
				return {
					state: this.PROMISE_EXCEPTION,
					exception: e
				};
			}
		} else {
			var promise = {
				state: this.PROMISE_ACTIVE,
				listeners: []
			};
			params.push({
				context: promise,
				success: function (result) {
					this.state = BetaJS.SyncAsync.PROMISE_SUCCESS;
					this.result = result;
					for (var i = 0; i < this.listeners.length; ++i)
						this.listeners[i].success.call(this.listeners[i].context || this, result);
				},
				exception: function (error) {
					this.state = BetaJS.SyncAsync.PROMISE_EXCEPTION;
					this.exception = error;
					for (var i = 0; i < this.listeners.length; ++i)
						this.listeners[i].exception.call(this.listeners[i].context || this, error);
				}
			});
			func.apply(func_ctx, params);
			return promise;
		}
	},
	
	reveal: function (promise, callbacks) {
		if (promise.state == this.PROMISE_LAZY) {
			var promise_temp = this.promise(promise.func_ctx, promise.func, promise.params, promise.type);
			for (var key in promise_temp)
				promise[key] = promise_temp[key];
		}
		if (promise.state == this.PROMISE_ACTIVE)
			promise.listeners.push(callbacks);
		else if (promise.state == this.PROMISE_SUCCESS)
			callbacks.success.call(callbacks.context || this, promise.result);
		else if (promise.state == this.PROMISE_EXCEPTION)
			callbacks.exception.call(callbacks.context || this, promise.exception);
	},
	
	join: function (promises, callbacks) {
		var monitor = {
			count: promises.length,
			exception: false,
			results: []
		};
		for (var i = 0; i < promises.length; ++i) {
			monitor.results.push(null);
			this.reveal(promises[i], {
				context: {
					monitor: monitor,
					index: i
				},
				sync: callbacks && callbacks.sync,
				success: function (result) {
					this.monitor.count = this.monitor.count - 1;
					if (this.monitor.exception)
						return;
					this.monitor.results[this.index] = result;
					if (this.monitor.count <= 0) {
						if (callbacks)
							callbacks.success.apply(callbacks.context || this, this.monitor.results);
					}
				},
				exception: function (error) {
					this.monitor.count = this.monitor.count - 1;
					if (this.monitor.exception)
						return;
					this.monitor.exception = true;
					if (callbacks)
						callbacks.exception.apply(callbacks.context || this, error);
					else
						throw error;
				}
			});
		}
		return monitor.results;
	},
	
	mapSuccess: function (callbacks, success) {
		var obj = BetaJS.Objs.clone(callbacks, 1);
		obj.success = success;
		return obj;
	},
	
	mapException: function (callbacks, exception) {
		var obj = BetaJS.Objs.clone(callbacks, 1);
		obj.exception = exception;
		return obj;
	},

	callback: function (callbacks, type) {
		if (!callbacks || (type != "success" && type != "exception"))
			return;
		var context = callbacks.context || this;
		var params = BetaJS.Functions.getArguments(arguments, 2);
		if (type in callbacks)
			callbacks[type].apply(context, params);
		if ("complete" in callbacks)
			callbacks.complete.apply(context);
	}
	
};



BetaJS.SyncAsync.SyncAsyncMixin = {
	
	supportsSync: function () {
		return this._supportsSync;
	},
	
	supportsAsync: function () {
		return this._supportsAsync;
	},
	
	eitherSync: function (callbacks, syncFunc, params) {
		return BetaJS.SyncAsync.eitherSync(callbacks, syncFunc, params || [], this);
	},
		
	either: function (callbacks, syncFunc, asyncFunc, preferSync, params) {
		if (BetaJS.Types.is_undefined(preferSync))
			preferSync = !this.supportsAsync();
		return BetaJS.SyncAsync.either(callbacks, preferSync, syncFunc, asyncFunc, params || [], this);
	},
	
	eitherSyncFactory: function (property, callbacks, syncFunc, params) {
		return BetaJS.SyncAsync.eitherSync(callbacks, function () {
			if (!this[property])
				this[property] = syncFunc.apply(this, params);
			return this[property];				
		}, this);
	},

	eitherAsyncFactory: function (property, callbacks, asyncFunc, params) {
		var ctx = this;
		return this.either(callbacks, function () {
			return ctx[property];				
		}, function () {
			asyncFunc.call(this, BetaJS.SyncAsync.mapSuccess(callbacks, function (result) {
				ctx[property] = result;
				ctx.callback(callbacks, "success", result);
			}));
		}, property in this, this);
	},

	eitherFactory: function (property, callbacks, syncFunc, asyncFunc, params) {
		var ctx = this;
		return this.either(callbacks, function () {
			if (!this[property])
				this[property] = syncFunc.apply(this, params);
			return this[property];				
		}, function () {
			asyncFunc.call(this, BetaJS.SyncAsync.mapSuccess(callbacks, function (result) {
				ctx[property] = result;
				callbacks.success.call(this, result);
			}));
		}, this[property] || !this.supportsAsync());
	},
	
	then: function () {
		var args = BetaJS.Functions.matchArgs(arguments, {
			func_ctx: "object",
			func: true,
			params: "array",
			type: "number",
			callbacks: true,
			success_ctx: "object",
			success: true,
			exception: "function"
		});
		var func_ctx = args.func_ctx || this;
		var func = args.func;
		var params = args.params || [];
		var callbacks = args.callbacks;
		var type = args.type || (!callbacks || !this.supportsAsync() ? BetaJS.SyncAsync.SYNC : BetaJS.SyncAsync.ASYNC);
		var success_ctx = args.success_ctx || this;
		return BetaJS.SyncAsync.then(func_ctx, func, params, type, callbacks, success_ctx, args.success, args.exception);
	},
	
	thenSingle: function () {
		var args = BetaJS.Functions.matchArgs(arguments, {
			func_ctx: "object",
			func: true,
			params: "array",
			type: "number",
			callbacks: true,
			success_ctx: "object",
			success: true
		});
		var func_ctx = args.func_ctx || this;
		var func = args.func;
		var params = args.params || [];
		var callbacks = args.callbacks;
		var type = args.type || (!callbacks || !this.supportsAsync() ? BetaJS.SyncAsync.SYNC : BetaJS.SyncAsync.ASYNCSINGLE);
		var success_ctx = args.success_ctx || this;
		var success = args.success;
		return BetaJS.SyncAsync.then(func_ctx, func, params, type, callbacks, success_ctx, success);
	},
	
	promise: function () {
		var args = BetaJS.Functions.matchArgs(arguments, {
			func_ctx: "object",
			func: true,
			params: "array",
			type: "number"
		});
		return BetaJS.SyncAsync.promise(args.func_ctx || this, args.func, args.params || [], args.type);
	},
	
	join: function (promises, callbacks) {
		return BetaJS.SyncAsync.join(promises, callbacks);
	},
	
	delegate: function () {
		var args = BetaJS.Functions.matchArgs(arguments, {
			func_ctx: "object",
			func: true,
			params: "array",
			callbacks: "object"
		});
		var ctx = args.func_ctx || this;
		var params = args.params || [];
		if (args.callbacks) {
			if (this.supportsAsync() && !args.callbacks.sync) {
				params.push(args.callbacks);
				return args.func.apply(ctx, params);
			} else
				return BetaJS.SyncAsync.syncToAsync(args.callbacks, args.func, params, ctx);
		} else
			return args.func.apply(ctx, params);
	},
	
	callback: function () {
		return BetaJS.SyncAsync.callback.apply(this, arguments);
	}
	
};


/** @class */
BetaJS.Scopes = {
	
	/** Takes a string and returns the global object associated with it by name.
     * 
     * @param s string (example: "BetaJS")
     * @param base a global namespace base (optional, will autodetect the right one if not provided)
     * @return global object (example: BetaJS object)
     */
	base: function (s, base, initialize) {
		if (!BetaJS.Types.is_string(s))
			return s;
		if (base)
			return base[s];
		try {
			if (window && window[s])
				return window[s];
		} catch (e) {}
		try {
			if (global && global[s])
				return global[s];
		} catch (e) {}
		try {
			if (module && module.exports)
				return module.exports;
		} catch (e) {}
		if (!initialize)
		    return null;
        try {
            if (window) {
                window[s] = {};
                return window[s];
            }
        } catch (e) {}
        try {
            if (global) {
                global[s] = {};
                return global[s];
            }
        } catch (e) {}
        try {
            if (module && module.exports) {
                module.exports = {};
                return module.exports;
            }
        } catch (e) {}
        return null;
	},
	
	/** Takes an object address string and returns the object associated with it.
     * 
     * @param s string (example: "BetaJS.Strings")
     * @param base a global namespace base (optional, will autodetect the right one if not provided)
     * @return global object (example BetaJS.Strings object)
     */
	resolve: function (s, base) {
		if (!BetaJS.Types.is_string(s))
			return s;
		var a = s.split(".");			
		var object = this.base(a[0], base);
		for (var i = 1; i < a.length; ++i)
			object = object[a[i]];
		return object;
	},
	
	/** Takes an object address string and returns the object associated with it.
	 *  If the address does not exist, it will be created.
     * 
     * @param s string (example: "BetaJS.Strings.FooBar")
     * @param base a global namespace base (optional, will autodetect the right one if not provided)
     * @return global object (example BetaJS.Strings.FooBar object)
     */
	touch: function (s, base) {
		if (!BetaJS.Types.is_string(s))
			return s;
		var a = s.split(".");		
		var object = this.base(a[0], base, true);
		for (var i = 1; i < a.length; ++i) {
			if (!(a[i] in object))
				object[a[i]] = {};
			object = object[a[i]];
		}
		return object;
	},
	
	/** Takes an object address string and overwrites it by a given object.
	 *  If the address does not exist, it will be created.
     * 
     * @param obj object (example: {test: "foobar"})
     * @param s string (example: "BetaJS.Strings.FooBar")
     * @param base a global namespace base (optional, will autodetect the right one if not provided)
     * @return global object (example BetaJS.Strings.FooBar object)
     */
	set: function (obj, s, base) {
		if (!BetaJS.Types.is_string(s))
			return s;
		var a = s.split(".");			
		var object = this.base(a[0], base, true);
		for (var i = 1; i < a.length - 1; ++i) {
			if (!(a[i] in object))
				object[a[i]] = {};
			object = object[a[i]];
		}
		if (a.length > 1)
			object[a[a.length - 1]] = obj;
		return obj;
	}
	
};

/** @class */
BetaJS.Ids = {
	
	__uniqueId: 0,
	
    /** Returns a unique identifier
     * 
     * @param prefix a prefix string for the identifier (optional)
     * @return unique identifier
     */
	uniqueId: function (prefix) {
		return (prefix || "") + (this.__uniqueId++);
	},
	
    /** Returns the object's unique identifier or sets it
     * 
     * @param object the object
     * @param id (optional)
     * @return object's unique identifier
     */
	objectId: function (object, id) {
		if (typeof id != "undefined")
			object.__cid = id;
		else if (!object.__cid)
			object.__cid = this.uniqueId("cid_");
		return object.__cid;
	}
	
};
/** @class */
BetaJS.Tokens = {
	
    /** Returns a new token
     * 
     * @param length optional length of token, default is 16
     * @return token
     */
	generate_token: function (length) {
		length = length || 16;
		var s = "";
		while (s.length < length)
			s += Math.random().toString(36).substr(2); 
		return s.substr(0, length);
	}
	
};
BetaJS.Objs = {
	
	count: function (obj) {
		if (BetaJS.Types.is_array(obj))
			return obj.length;
		else {
			var c = 0;
			for (var key in obj)
				c++;
			return c;
		}
	},
	
	clone: function (item, depth) {
		if (!depth || depth <= 0)
			return item;
		if (BetaJS.Types.is_array(item))
			return item.slice(0);
		else if (BetaJS.Types.is_object(item))
			return this.extend({}, item, depth-1);
		else
			return item;
	},
	
	acyclic_clone: function (object, def) {
		if (object === null || ! BetaJS.Types.is_object(object))
			return object;
		var s = "__acyclic_cloned";
		if (object[s])
			return def || "CYCLE";
		object[s] = true;
		var result = {};
		for (var key in object) {
			if (key != s)
				result[key] = this.acyclic_clone(object[key], def);
		}
		delete object[s];
		return result;
	},
	
	extend: function (target, source, depth) {
		target = target || {};
		if (source) {
			for (var key in source)
				target[key] = this.clone(source[key], depth);
		}
		return target;
	},
	
	tree_extend: function (target, source, depth) {
		target = target || {};
		if (source) {
			for (var key in source) {
				if (key in target && BetaJS.Types.is_object(target[key]) && BetaJS.Types.is_object(source[key]))
					target[key] = this.tree_extend(target[key], source[key], depth);
				else
					target[key] = this.clone(source[key], depth);
			}
		}
		return target;
	},
		
	merge: function (secondary, primary, options) {
		secondary = secondary || {};
		primary = primary || {};
		var result = {};
		var keys = BetaJS.Objs.extend(BetaJS.Objs.keys(secondary, true), BetaJS.Objs.keys(primary, true));
		for (var key in keys) {
			var opt = key in options ? options[key] : "primary";
			if (opt == "primary" || opt == "secondary") {
				if (key in primary || key in secondary) {
					if (opt == "primary")
						result[key] = key in primary ? primary[key] : secondary[key];
					else
						result[key] = key in secondary ? secondary[key] : primary[key];
				}			
			}
			else if (BetaJS.Types.is_function(opt))
				result[key] = opt(secondary[key], primary[key]);
			else if (BetaJS.Types.is_object(opt))
				result[key] = BetaJS.Objs.merge(secondary[key], primary[key], opt);
		}
		return result;
	},
	
	tree_merge: function (secondary, primary) {
		secondary = secondary || {};
		primary = primary || {};
		var result = {};
		var keys = BetaJS.Objs.extend(BetaJS.Objs.keys(secondary, true), BetaJS.Objs.keys(primary, true));
		for (var key in keys) {
			if (BetaJS.Types.is_object(primary[key]) && secondary[key])
				result[key] = BetaJS.Objs.tree_merge(secondary[key], primary[key]);
			else
				result[key] = key in primary ? primary[key] : secondary[key];
		}
		return result;
	},

	keys: function(obj, mapped) {
		var result = null;
		var key = null;
		if (BetaJS.Types.is_undefined(mapped)) {
			result = [];
			for (key in obj)
				result.push(key);
			return result;
		} else {
			result = {};
			for (key in obj)
				result[key] = mapped;
			return result;
		}
	},
	
	map: function (obj, f, context) {
		var result = null;
		if (BetaJS.Types.is_array(obj)) {
			result = [];
			for (var i = 0; i < obj.length; ++i)
				result.push(context ? f.apply(context, [obj[i], i]) : f(obj[i], i));
			return result;
		} else {
			result = {};
			for (var key in obj)
				result[key] = context ? f.apply(context, [obj[key], key]) : f(obj[key], key);
			return result;
		}
	},
	
	values: function (obj) {
		var result = [];
		for (var key in obj)
			result.push(obj[key]);
		return result;
	},
	
	filter: function (obj, f, context) {
		var ret = null;
		if (BetaJS.Types.is_array(obj)) {
			ret = [];
			for (var i = 0; i < obj.length; ++i) {
				if (context ? f.apply(context, [obj[i], i]) : f(obj[i], i))
					ret.push(obj[i]);
			}
			return ret;
		} else {
			ret = {};
			for (var key in obj) {
				if (context ? f.apply(context, [obj[key], key]) : f(obj[key], key))
					ret[key] = obj[key];
			}
			return ret;
		}
	},
	
	equals: function (obj1, obj2, depth) {
		var key = null;
		if (depth && depth > 0) {
			for (key in obj1) {
				if (!key in obj2 || !this.equals(obj1[key], obj2[key], depth-1))
					return false;
			}
			for (key in obj2) {
				if (!key in obj1)
					return false;
			}
			return true;
		} else
			return obj1 == obj2;
	},
	
	iter: function (obj, f, context) {
		var result = null;
		if (BetaJS.Types.is_array(obj)) {
			for (var i = 0; i < obj.length; ++i) {
				result = context ? f.apply(context, [obj[i], i]) : f(obj[i], i);
				if (BetaJS.Types.is_defined(result) && !result)
					return false;
			}
		} else {
			for (var key in obj) {
				result = context ? f.apply(context, [obj[key], key]) : f(obj[key], key);
				if (BetaJS.Types.is_defined(result) && !result)
					return false;
			}
		}
		return true;
	},
	
	intersect: function (a, b) {
		var c = {};
		for (var key in a) {
			if (key in b)
				c[key] = a[key];
		}
		return c;
	},
	
	contains_key: function (obj, key) {
		if (BetaJS.Types.is_array(obj))
			return BetaJS.Types.is_defined(obj[key]);
		else
			return key in obj;
	},
	
	contains_value: function (obj, value) {
		if (BetaJS.Types.is_array(obj)) {
			for (var i = 0; i < obj.length; ++i) {
				if (obj[i] === value)
					return true;
			}
		} else {
			for (var key in obj) {
				if (obj[key] === value)
					return true;
			}
		}
		return false;
	},
	
	exists: function (obj, f, context) {
		var success = false;
		BetaJS.Objs.iter(obj, function () {
			success = success || f.apply(this, arguments);
			return !success;
		}, context);
		return success;
	},
	
	all: function (obj, f, context) {
		var success = true;
		BetaJS.Objs.iter(obj, function () {
			success = success && f.apply(this, arguments);
			return success;
		}, context);
		return success;
	},
	
	objectify: function (arr, f, context) {
		var result = {};
		var is_function = BetaJS.Types.is_function(f);
		if (BetaJS.Types.is_undefined(f))
			f = true;
		for (var i = 0; i < arr.length; ++i)
			result[arr[i]] = is_function ? f.apply(context || this, [arr[i], i]) : f;
		return result;
	},
	
	peek: function (obj) {
		if (BetaJS.Types.is_array(obj))
			return obj.length > 0 ? obj[0] : null;
		else {
			for (var key in obj)
				return obj[key];
			return null;
		} 
	},
	
	poll: function (obj) {
		if (BetaJS.Types.is_array(obj))
			return obj.shift();
		else {
			for (var key in obj) {
				var item = obj[key];
				delete obj[key];
				return item;
			}
			return null;
		} 
	},
	
	objectBy: function () {
		var obj = {};
		var count = arguments.length / 2;
		for (var i = 0; i < count; ++i)
			obj[arguments[2 * i]] = arguments[2 * i + 1];
		return obj;
	},
	
	valueByIndex: function (obj, idx) {
		idx = idx || 0;
		if (BetaJS.Types.is_array(obj))
			return obj[idx];
		for (var key in obj) {
			if (idx === 0)
				return obj[key];
			idx--;
		}
		return null;
	},
	
	keyByIndex: function (obj, idx) {
		idx = idx || 0;
		if (BetaJS.Types.is_array(obj))
			return idx;
		for (var key in obj) {
			if (idx === 0)
				return key;
			idx--;
		}
		return null;
	}

};

BetaJS.Class = function () {};

BetaJS.Class.classname = "Class";

BetaJS.Class.extend = function (classname, objects, statics, class_statics) {
	objects = objects || [];
	if (!BetaJS.Types.is_array(objects))
		objects = [objects];
	statics = statics || [];
	if (!BetaJS.Types.is_array(statics))
		statics = [statics];
	class_statics = class_statics || [];
	if (!BetaJS.Types.is_array(class_statics))
		class_statics = [class_statics];
	
	var parent = this;
	
	var result;
	
	// Setup JavaScript Constructor
	BetaJS.Objs.iter(objects, function (obj) {
		if (obj.hasOwnProperty("constructor"))
			result = obj.constructor;
	});
	var has_constructor = BetaJS.Types.is_defined(result);
	if (!BetaJS.Types.is_defined(result))
		result = function () { parent.apply(this, arguments); };

	// Add Parent Statics
	BetaJS.Objs.extend(result, parent);

	// Add External Statics
	BetaJS.Objs.iter(statics, function (stat) {
		BetaJS.Objs.extend(result, stat);
	});
	
	
	// Add Class Statics
	var class_statics_keys = {};
	if (parent.__class_statics_keys) {
		for (var key in parent.__class_statics_keys) 
			result[key] = BetaJS.Objs.clone(parent[key], 1);
	}
	BetaJS.Objs.iter(class_statics, function (stat) {
		BetaJS.Objs.extend(result, stat);
		BetaJS.Objs.extend(class_statics_keys, BetaJS.Objs.keys(stat, true));
	});
	if (parent.__class_statics_keys)
		BetaJS.Objs.extend(class_statics_keys, parent.__class_statics_keys);
	result.__class_statics_keys = class_statics_keys;
	
	// Parent & Children Hierarchy
	result.parent = parent;
	result.children = [];
	result.extend = this.extend;
	if (!parent.children)
		parent.children = [];
	parent.children.push(result);
	
	// Setup Prototype
	var ctor = function () {};
	ctor.prototype = parent.prototype;
	result.prototype = new ctor();

	// ClassNames
	result.prototype.cls = result;
	result.classname = classname;
	
	// Enforce ClassName in namespace
	if (classname)
		BetaJS.Scopes.set(result, classname);
	
	// Setup Prototype
	result.__notifications = {};
	
	if (parent.__notifications)
		BetaJS.Objs.extend(result.__notifications, parent.__notifications, 1);		

	BetaJS.Objs.iter(objects, function (object) {
		BetaJS.Objs.extend(result.prototype, object);

		// Note: Required for Internet Explorer
		if ("constructor" in object)
			result.prototype.constructor = object.constructor;

		if (object._notifications) {
			for (var key in object._notifications) {
				if (!result.__notifications[key])
					result.__notifications[key] = [];
				result.__notifications[key].push(object._notifications[key]);
			}
		}
	});	
	delete result.prototype._notifications;

	if (!has_constructor)
		result.prototype.constructor = parent.prototype.constructor;
		
	return result; 
};



BetaJS.Class.prototype.constructor = function () {
	this._notify("construct");
};

BetaJS.Class.prototype.as_method = function (s) {
	return BetaJS.Functions.as_method(this[s], this);
};

BetaJS.Class.prototype._auto_destroy = function (obj) {
	if (!this.__auto_destroy_list)
		this.__auto_destroy_list = [];
	var target = obj;
	if (!BetaJS.Types.is_array(target))
	   target = [target];
	for (var i = 0; i < target.length; ++i)
	   this.__auto_destroy_list.push(target[i]);
	return obj;
};

BetaJS.Class.prototype._notify = function (name) {
	if (!this.cls.__notifications)
		return;
	var rest = Array.prototype.slice.call(arguments, 1);
	var table = this.cls.__notifications[name];
	if (table) {
		for (var i in table) {
			var method = BetaJS.Types.is_function(table[i]) ? table[i] : this[table[i]];
			if (!method)
				throw this.cls.classname  + ": Could not find " + name + " notification handler " + table[i];
			method.apply(this, rest);
		}
	}
};

BetaJS.Class.prototype.destroy = function () {
	this._notify("destroy");
	if (this.__auto_destroy_list) {
		for (var i = 0; i < this.__auto_destroy_list.length; ++i) {
			if ("destroy" in this.__auto_destroy_list[i])
				this.__auto_destroy_list[i].destroy();
		}
	}
	for (var key in this)
		delete this[key];
};

BetaJS.Class.prototype._inherited = function (cls, func) {
	return cls.parent.prototype[func].apply(this, Array.prototype.slice.apply(arguments, [2]));
};

BetaJS.Class._inherited = function (cls, func) {
	return cls.parent[func].apply(this, Array.prototype.slice.apply(arguments, [2]));
};

BetaJS.Class.prototype.instance_of = function (cls) {
	return this.cls.ancestor_of(cls);
};

BetaJS.Class.ancestor_of = function (cls) {
	return (this == cls) || (this != BetaJS.Class && this.parent.ancestor_of(cls));
};

BetaJS.Class.prototype.cid = function () {
	return BetaJS.Ids.objectId(this);
};



BetaJS.Class.prototype.cls = BetaJS.Class;

BetaJS.Class.__notifications = {};

BetaJS.Class.is_class_instance = function (object) {
	return object && BetaJS.Types.is_object(object) && ("_inherited" in object) && ("cls" in object);
};


BetaJS.Exceptions = {
	
	ensure: function (e) {
		if (e && BetaJS.Types.is_object(e) && ("instance_of" in e) && (e.instance_of(BetaJS.Exceptions.Exception)))
			return e;
		return new BetaJS.Exceptions.NativeException(e);
	}
	
};


BetaJS.Class.extend("BetaJS.Exceptions.Exception", {
	
	constructor: function (message) {
		this._inherited(BetaJS.Exceptions.Exception, "constructor");
		this.__message = message;
	},
	
	assert: function (exception_class) {
		if (!this.instance_of(exception_class))
			throw this;
		return this;
	},
	
	callstack: function () {
		var callstack = [];
		var current = arguments.callee.caller;
		while (current) {
			callstack.push(current.toString());
			current = current.caller;
		}
		return callstack;
	},
	
	callstack_to_string: function () {
		return this.callstack().join("\n");
	},
	
	message: function () {
		return this.__message;
	},
	
	toString: function () {
		return this.message();
	},
	
	format: function () {
		return this.cls.classname + ": " + this.toString() + "\n\nCall Stack:\n" + this.callstack_to_string();
	},
	
	json: function () {
		return {
			classname: this.cls.classname,
			message: this.message()
		};
	}
	
}, {
	
	ensure: function (e) {
		e = BetaJS.Exceptions.ensure(e);
		e.assert(this);
		return e;
	}
	
});


BetaJS.Exceptions.Exception.extend("BetaJS.Exceptions.NativeException", {
	
	constructor: function (object) {
		this._inherited(BetaJS.Exceptions.NativeException, "constructor", object ? ("toString" in object ? object.toString() : object) : "null");
		this.__object = object;
	},
	
	object: function () {
		return this.__object;
	}
	
});

BetaJS.Class.extend("BetaJS.Lists.AbstractList", {
	
	_add: function (object) {},
	_remove: function (ident) {},
	_get: function (ident) {},
	_iterate: function (callback, context) {},
	
	get_ident: function (object) {
		var ident = null;
		this._iterate(function (obj, id) {
			if (obj == object) {
				ident = id;
				return false;
			}
			return true;	
		});
		return ident;
	},
	
	exists: function (object) {
		return object && this.get_ident(object) !== null;
	},
	
	_ident_changed: function (object, new_ident) {},
	
	constructor: function (objects) {
		this._inherited(BetaJS.Lists.AbstractList, "constructor");
		this.__count = 0;
		if (objects)
			BetaJS.Objs.iter(objects, function (object) {
				this.add(object);
			}, this);
	},
	
	add: function (object) {
		var ident = this._add(object);
		if (BetaJS.Types.is_defined(ident))
			this.__count++;
		return ident;
	},
	
	count: function () {
		return this.__count;
	},
	
	clear: function () {
		this._iterate(function (object, ident) {
			this.remove_by_ident(ident);
			return true;
		}, this);
	},
	
	remove_by_ident: function (ident) {
		var ret = this._remove(ident);
		if (BetaJS.Types.is_defined(ret))
			this.__count--;
		return ret;
	},
	
	remove: function (object) {
		return this.remove_by_ident(this.get_ident(object));
	},
	
	remove_by_filter: function (filter) {
		this._iterate(function (object, ident) {
			if (filter(object))
				this.remove_by_ident(ident);
			return true;
		}, this);
	},
	
	get: function (ident) {
		return this._get(ident);
	},
	
	iterate: function (cb, context) {
		this._iterate(function (object, ident) {
			var ret = cb.apply(this, [object, ident]);
			return BetaJS.Types.is_defined(ret) ? ret : true;
		}, context);
	},
	
	iterator: function () {
		return BetaJS.Iterators.ArrayIterator.byIterate(this.iterate, this);
	}

});

BetaJS.Lists.AbstractList.extend("BetaJS.Lists.LinkedList", {
	
	constructor: function (objects) {
		this.__first = null;
		this.__last = null;
		this._inherited(BetaJS.Lists.LinkedList, "constructor", objects);
	},
	
	_add: function (obj) {
		this.__last = {
			obj: obj,
			prev: this.__last,
			next: null
		};
		if (this.__first)
			this.__last.prev.next = this.__last;
		else
			this.__first = this.__last;
		return this.__last;
	},
	
	_remove: function (container) {
		if (container.next)
			container.next.prev = container.prev;
		else
			this.__last = container.prev;
		if (container.prev)
			container.prev.next = container.next;
		else
			this.__first = container.next;
		return container.obj;
	},
	
	_get: function (container) {
		return container.obj;
	},
	
	_iterate: function (cb, context) {
		var current = this.__first;
		while (current) {
			var prev = current;
			current = current.next;
			if (!cb.apply(context || this, [prev.obj, prev]))
				return;
		}
	}
});


BetaJS.Lists.AbstractList.extend("BetaJS.Lists.ObjectIdList",  {
	
	constructor: function (objects, id_generator) {
		this.__map = {};
		this.__id_generator = id_generator;
		this._inherited(BetaJS.Lists.ObjectIdList, "constructor", objects);
	},

	_add: function (object) {
	    while (true) {
	        var id = object.__cid;
	        if (!id) {
                id = this.__id_generator ? BetaJS.Ids.objectId(object, this.__id_generator()) : BetaJS.Ids.objectId(object);
        		if (this.__map[id] && this.__id_generator)
        		  continue;
            }
    		this.__map[id] = object;
    		return id;
    	}
    	return null;
	},
	
	_remove: function (ident) {
		var obj = this.__map[ident];
		delete this.__map[ident];
		return obj;
	},
	
	_get: function (ident) {
		return this.__map[ident];
	},
	
	_iterate: function (callback, context) {
		for (var key in this.__map)
			callback.apply(context || this, [this.__map[key], key]);
	},
	
	get_ident: function (object) {
		var ident = BetaJS.Ids.objectId(object);
		return this.__map[ident] ? ident : null;
	}
	
});



BetaJS.Lists.AbstractList.extend("BetaJS.Lists.ArrayList", {
	
	constructor: function (objects, options) {
		this.__idToIndex = {};
		this.__items = [];
		options = options || {};
		if ("compare" in options)
			this._compare = options["compare"];
		this._inherited(BetaJS.Lists.ArrayList, "constructor", objects);
	},
	
	set_compare: function (compare) {
		this._compare = compare;
		if (compare)
			this.sort();
	},
	
	get_compare: function () {
		return this._compare;
	},
	
	sort: function (compare) {
		compare = compare || this._compare;
		if (!compare)
			return;
		this.__items.sort(compare);
		for (var i = 0; i < this.__items.length; ++i)
			this.__ident_changed(this.__items[i], i);
		this._sorted();
	},
	
	_sorted: function () {},
		
	re_index: function (index) {
		if (!this._compare)
			return index;
		var last = this.__items.length - 1;
		var object = this.__items[index];
		var i = index;	
		while (i < last && this._compare(this.__items[i], this.__items[i + 1]) > 0) {
			this.__items[i] = this.__items[i + 1];
			this.__ident_changed(this.__items[i], i);
			this.__items[i + 1] = object;
			++i;
		}
		if (i == index) {
			while (i > 0 && this._compare(this.__items[i], this.__items[i - 1]) < 0) {
				this.__items[i] = this.__items[i - 1];
				this.__ident_changed(this.__items[i], i);
				this.__items[i - 1] = object;
				--i;
			}
		}
		if (i != index) {
			this.__ident_changed(object, i);
			this._re_indexed(object);
		}
		return i;
	},
	
	_re_indexed: function (object) {},
	
	_add: function (object) {
		var last = this.__items.length;
		this.__items.push(object);
		var i = this.re_index(last);
		this.__idToIndex[BetaJS.Ids.objectId(object)] = i;
		return i;
	},
	
	_remove: function (ident) {
		var obj = this.__items[ident];
		for (var i = ident + 1; i < this.__items.length; ++i) {
			this.__items[i-1] = this.__items[i];
			this.__ident_changed(this.__items[i-1], i-1);
		}
		this.__items.pop();
		delete this.__idToIndex[BetaJS.Ids.objectId(obj)];
		return obj;
	},
	
	_get: function (ident) {
		return this.__items[ident];
	},
	
	_iterate: function (callback, context) {
		var items = BetaJS.Objs.clone(this.__items, 1);
		for (var i = 0; i < items.length; ++i)
			callback.apply(context || this, [items[i], this.get_ident(items[i])]);
	},

	__ident_changed: function (object, index) {
		this.__idToIndex[BetaJS.Ids.objectId(object)] = index;
		this._ident_changed(object, index);
	},

	get_ident: function (object) {
		var id = BetaJS.Ids.objectId(object);
		return id in this.__idToIndex ? this.__idToIndex[id] : null;
	},
	
	ident_by_id: function (id) {
		return this.__idToIndex[id];
	}

});
BetaJS.Iterators = {
	
	ensure: function (mixed) {
		if (mixed === null)
			return new BetaJS.Iterators.ArrayIterator([]);
		if (mixed.instance_of(BetaJS.Iterators.Iterator))
			return mixed;
		if (BetaJS.Types.is_array(mixed))
			return new BetaJS.Iterators.ArrayIterator(mixed);
		return new BetaJS.Iterators.ArrayIterator([mixed]);
	}
	
};

BetaJS.Class.extend("BetaJS.Iterators.Iterator", {
	
	asArray: function () {
		var arr = [];
		while (this.hasNext())
			arr.push(this.next());
		return arr;
	},
	
	asArrayDelegate: function (f) {
		var arr = [];
		while (this.hasNext()) {
			var obj = this.next();			
			arr.push(obj[f].apply(obj, BetaJS.Functions.getArguments(arguments, 1)));
		}
		return arr;
	},
	
	iterate: function (callback, context) {
		while (this.hasNext())
			callback.call(context || this, this.next());
	}
	
});

BetaJS.Iterators.Iterator.extend("BetaJS.Iterators.ArrayIterator", {
	
	constructor: function (arr) {
		this._inherited(BetaJS.Iterators.ArrayIterator, "constructor");
		this.__array = arr;
		this.__i = 0;
	},
	
	hasNext: function () {
		return this.__i < this.__array.length;
	},
	
	next: function () {
		var ret = this.__array[this.__i];
		this.__i++;
		return ret;
	}
	
}, {
	
	byIterate: function (iterate_func, iterate_func_ctx) {
		var result = [];
		iterate_func.call(iterate_func_ctx || this, function (item) {
			result.push(item);
		}, this);
		return new this(result);
	}
	
});

BetaJS.Iterators.ArrayIterator.extend("BetaJS.Iterators.ObjectKeysIterator", {
	
	constructor: function (obj) {
		this._inherited(BetaJS.Iterators.ObjectKeysIterator, "constructor", BetaJS.Objs.keys(obj));
	}
	
});

BetaJS.Iterators.ArrayIterator.extend("BetaJS.Iterators.ObjectValuesIterator", {
	
	constructor: function (obj) {
		this._inherited(BetaJS.Iterators.ObjectValuesIterator, "constructor", BetaJS.Objs.values(obj));
	}
	
});

BetaJS.Iterators.Iterator.extend("BetaJS.Iterators.MappedIterator", {
	
	constructor: function (iterator, map, context) {
		this._inherited(BetaJS.Iterators.MappedIterator, "constructor");
		this.__iterator = iterator;
		this.__map = map;
		this.__context = context || this;
	},
	
	hasNext: function () {
		return this.__iterator.hasNext();
	},
	
	next: function () {
		return this.hasNext() ? this.__map.call(this.__context, this.__iterator.next()) : null;
	}
	
});

BetaJS.Iterators.Iterator.extend("BetaJS.Iterators.FilteredIterator", {
	
	constructor: function (iterator, filter, context) {
		this._inherited(BetaJS.Iterators.FilteredIterator, "constructor");
		this.__iterator = iterator;
		this.__filter = filter;
		this.__context = context || this;
		this.__next = null;
	},
	
	hasNext: function () {
		this.__crawl();
		return this.__next !== null;
	},
	
	next: function () {
		this.__crawl();
		var item = this.__next;
		this.__next = null;
		return item;
	},
	
	__crawl: function () {
		while (!this.__next && this.__iterator.hasNext()) {
			var item = this.__iterator.next();
			if (this.__filter_func(item))
				this.__next = item;
		}
	},
	
	__filter_func: function (item) {
		return this.__filter.apply(this.__context, [item]);
	}

});


BetaJS.Iterators.Iterator.extend("BetaJS.Iterators.SkipIterator", {
	
	constructor: function (iterator, skip) {
		this._inherited(BetaJS.Iterators.SkipIterator, "constructor");
		this.__iterator = iterator;
		while (skip > 0) {
			iterator.next();
			skip--;
		}
	},
	
	hasNext: function () {
		return this.__iterator.hasNext();
	},
	
	next: function () {
		return this.__iterator.next();
	}

});


BetaJS.Iterators.Iterator.extend("BetaJS.Iterators.LimitIterator", {
	
	constructor: function (iterator, limit) {
		this._inherited(BetaJS.Iterators.LimitIterator, "constructor");
		this.__iterator = iterator;
		this.__limit = limit;
	},
	
	hasNext: function () {
		return this.__limit > 0 && this.__iterator.hasNext();
	},
	
	next: function () {
		if (this.__limit <= 0)
			return null;
		this.__limit--;
		return this.__iterator.next();
	}

});


BetaJS.Iterators.Iterator.extend("BetaJS.Iterators.SortedIterator", {
	
	constructor: function (iterator, compare) {
		this._inherited(BetaJS.Iterators.SortedIterator, "constructor");
		this.__array = iterator.asArray();
		this.__array.sort(compare);
		this.__i = 0;
	},
	
	hasNext: function () {
		return this.__i < this.__array.length;
	},
	
	next: function () {
		var ret = this.__array[this.__i];
		this.__i++;
		return ret;
	}
	
});

BetaJS.Events = {};

BetaJS.Events.EVENT_SPLITTER = /\s+/;

BetaJS.Events.EventsMixin = {
	
	__create_event_object: function (callback, context, options) {
		options = options || {};
		var obj = {
			callback: callback,
			context: context
		};
		if (options.eventually)
			obj.eventually = options.eventually;
		if (options.min_delay)
			obj.min_delay = new BetaJS.Timers.Timer({
				delay: options.min_delay,
				once: true,
				start: false,
				context: this,
				fire: function () {
					if (obj.max_delay)
						obj.max_delay.stop();
					obj.callback.apply(obj.context || this, obj.params);
				}
			});
		if (options.max_delay)
			obj.max_delay = new BetaJS.Timers.Timer({
				delay: options.max_delay,
				once: true,
				start: false,
				context: this,
				fire: function () {
					if (obj.min_delay)
						obj.min_delay.stop();
					obj.callback.apply(obj.context || this, obj.params);
				}
			});
		return obj;
	},
	
	__destroy_event_object: function (object) {
		if (object.min_delay)
			object.min_delay.destroy();
		if (object.max_delay)
			object.max_delay.destroy();
	},
	
	__call_event_object: function (object, params) {
		if (object.min_delay)
			object.min_delay.restart();
		if (object.max_delay)
			object.max_delay.start();
		if (!object.min_delay && !object.max_delay) {
			if (object.eventually)
				BetaJS.SyncAsync.eventually(object.callback, params, object.context || this);
			else
				object.callback.apply(object.context || this, params);
		} else
			object.params = params;
	},
	
	on: function(events, callback, context, options) {
		this.__events_mixin_events = this.__events_mixin_events || {};
		events = events.split(BetaJS.Events.EVENT_SPLITTER);
		var event;
		while (true) {
			event = events.shift();
			if (!event)
				break;
			this.__events_mixin_events[event] = this.__events_mixin_events[event] || new BetaJS.Lists.LinkedList();
			this.__events_mixin_events[event].add(this.__create_event_object(callback, context, options));
		}
		return this;
	},
	
	off: function(events, callback, context) {
		this.__events_mixin_events = this.__events_mixin_events || {};
		if (events) {
			events = events.split(BetaJS.Events.EVENT_SPLITTER);
			var event;
			while (true) {
				event = events.shift();
				if (!event)
					break;
				if (this.__events_mixin_events[event]) {
					this.__events_mixin_events[event].remove_by_filter(function (object) {
						var result = (!callback || object.callback == callback) && (!context || object.context == context);
						if (result && this.__destroy_event_object)
							this.__destroy_event_object(object);
						return result;
					});
					if (this.__events_mixin_events[event].count() === 0) {
						this.__events_mixin_events[event].destroy();
						delete this.__events_mixin_events[event];
					}
				}
			}
		} else {
			for (event in this.__events_mixin_events) {
				this.__events_mixin_events[event].remove_by_filter(function (object) {
					var result = (!callback || object.callback == callback) && (!context || object.context == context);
					if (result && this.__destroy_event_object)
						this.__destroy_event_object(object);
					return result;
				});
				if (this.__events_mixin_events[event].count() === 0) {
					this.__events_mixin_events[event].destroy();
					delete this.__events_mixin_events[event];
				}
			}
		}
		return this;
	},
	
	triggerAsync: function () {
		var self = this;
		var args = BetaJS.Functions.getArguments(arguments);
		var timeout = setTimeout(function () {
			clearTimeout(timeout);
			self.trigger.apply(self, args);
		}, 0);
	},

    trigger: function(events) {
    	var self = this;
    	events = events.split(BetaJS.Events.EVENT_SPLITTER);
    	var rest = BetaJS.Functions.getArguments(arguments, 1);
		var event;
		if (!this.__events_mixin_events)
			return this;
		while (true) {
			event = events.shift();
			if (!event)
				break;
    		if (this.__events_mixin_events[event])
    			this.__events_mixin_events[event].iterate(function (object) {
    				self.__call_event_object(object, rest);
    			});
			if (this.__events_mixin_events && "all" in this.__events_mixin_events)
				this.__events_mixin_events["all"].iterate(function (object) {
					self.__call_event_object(object, [event].concat(rest));
				});
		}
    	return this;
    },
    
    once: function (events, callback, context, options) {
        var self = this;
        var once = BetaJS.Functions.once(function() {
          self.off(events, once);
          callback.apply(this, arguments);
        });
        once._callback = callback;
        return this.on(name, once, context, options);
    },
    
    delegateEvents: function (events, source, prefix, params) {
    	params = params || []; 
    	prefix = prefix ? prefix + ":" : "";
    	if (events === null) {
    		source.on("all", function (event) {
				var rest = BetaJS.Functions.getArguments(arguments, 1);
				this.trigger.apply(this, [prefix + event].concat(params).concat(rest));
    		}, this);
    	} else {
    		if (!BetaJS.Types.is_array(events))
    			events = [events];
	   		BetaJS.Objs.iter(events, function (event) {
				source.on(event, function () {
					var rest = BetaJS.Functions.getArguments(arguments);
					this.trigger.apply(this, [prefix + event].concat(params).concat(rest));
				}, this);
			}, this);
		}
    }
	
};

BetaJS.Class.extend("BetaJS.Events.Events", BetaJS.Events.EventsMixin);



BetaJS.Events.ListenMixin = {
		
	_notifications: {
		"destroy": "listenOff" 
	},
		
	listenOn: function (target, events, callback, options) {
		if (!this.__listen_mixin_listen) this.__listen_mixin_listen = {};
		this.__listen_mixin_listen[BetaJS.Ids.objectId(target)] = target;
		target.on(events, callback, this, options);
	},
	
	listenOnce: function (target, events, callback, options) {
		if (!this.__listen_mixin_listen) this.__listen_mixin_listen = {};
		this.__listen_mixin_listen[BetaJS.Ids.objectId(target)] = target;
		target.once(events, callback, this, options);
	},
	
	listenOff: function (target, events, callback) {
		if (!this.__listen_mixin_listen)
			return;
		if (target) {
			target.off(events, callback, this);
			if (!events && !callback)
				delete this.__listen_mixin_listen[BetaJS.Ids.objectId(target)];
		}
		else
			BetaJS.Objs.iter(this.__listen_mixin_listen, function (obj) {
				obj.off(events, callback, this);
				if (!events && !callback)
					delete this.__listen_mixin_listen[BetaJS.Ids.objectId(obj)];
			}, this);
	}
	
};

BetaJS.Class.extend("BetaJS.Events.Listen", BetaJS.Events.ListenMixin);

BetaJS.Classes = {};

BetaJS.Classes.InvokerMixin = {

	invoke_delegate : function(invoker, members) {
		if (!BetaJS.Types.is_array(members))
			members = [members];
		invoker = this[invoker];
		var self = this;
		for (var i = 0; i < members.length; ++i) {
			var member = members[i];
			this[member] = function(member) {
				return function() {
					var args = BetaJS.Functions.getArguments(arguments);
					args.unshift(member);
					return invoker.apply(self, args);
				};
			}.call(self, member);
		}
	}
};

BetaJS.Classes.AutoDestroyMixin = {

	_notifications : {
		construct : "__initialize_auto_destroy",
		destroy : "__finalize_auto_destroy"
	},

	__initialize_auto_destroy : function() {
		this.__auto_destroy = {};
	},

	__finalize_auto_destroy : function() {
		var copy = this.__auto_destroy;
		this.__auto_destroy = {};
		BetaJS.Objs.iter(copy, function(object) {
			object.unregister(this);
		}, this);
	},

	register_auto_destroy : function(object) {
		if (object.cid() in this.__auto_destroy)
			return;
		this.__auto_destroy[object.cid()] = object;
		object.register(this);
		this._notify("register_auto_destroy", object);
	},

	unregister_auto_destroy : function(object) {
		if (!(object.cid() in this.__auto_destroy))
			return;
		this._notify("unregister_auto_destroy", object);
		delete this.__auto_destroy[object.cid()];
		object.unregister(this);
		if (BetaJS.Types.is_empty(this.__auto_destroy))
			this.destroy();
	}
};

BetaJS.Class.extend("BetaJS.Classes.AutoDestroyObject", {

	constructor : function() {
		this._inherited(BetaJS.Classes.AutoDestroyObject, "constructor");
		this.__objects = {};
	},

	register : function(object) {
		var id = BetaJS.Ids.objectId(object);
		if ( id in this.__objects)
			return;
		this.__objects[id] = object;
		object.register_auto_destroy(this);
	},

	unregister : function(object) {
		var id = BetaJS.Ids.objectId(object);
		if (!( id in this.__objects))
			return;
		delete this.__objects[id];
		object.unregister_auto_destroy(this);
	},

	clear : function() {
		BetaJS.Objs.iter(this.__objects, function(object) {
			this.unregister(object);
		}, this);
	}
});

BetaJS.Class.extend("BetaJS.Classes.ObjectCache", [BetaJS.Events.EventsMixin, {

	constructor : function(options) {
		this._inherited(BetaJS.Classes.ObjectCache, "constructor");
		this.__size = "size" in options ? options.size : null;
		this.__destroy_on_remove = "destroy_on_remove" in options ? options.destroy_on_remove : true;
		this.__id_to_container = {};
		this.__first = null;
		this.__last = null;
		this.__count = 0;
	},

	destroy : function() {
		this.clear();
		this._inherited(BetaJS.Classes.ObjectCache, "destroy");
	},

	add : function(object) {
		if (this.get(object))
			return;
		if (this.__size !== null && this.__count >= this.__size && this.__first)
			this.remove(this.__first.object);
		var container = {
			object : object,
			prev : this.__last,
			next : null
		};
		this.__id_to_container[BetaJS.Ids.objectId(object)] = container;
		if (this.__first)
			this.__last.next = container;
		else
			this.__first = container;
		this.__last = container;
		this.__count++;
		this.trigger("cache", object);
	},

	remove : function(id) {
		if (BetaJS.Class.is_class_instance(id))
			id = BetaJS.Ids.objectId(id);
		var container = this.__id_to_container[id];
		if (!container)
			return;
		delete this.__id_to_container[id];
		if (container.next)
			container.next.prev = container.prev;
		else
			this.__last = container.prev;
		if (container.prev)
			container.prev.next = container.next;
		else
			this.__first = container.next;
		this.__count--;
		this.trigger("release", container.object);
		if (this.__destroy_on_remove)
			container.object.destroy();
	},

	get : function(id) {
		if (BetaJS.Class.is_class_instance(id))
			id = BetaJS.Ids.objectId(id);
		return this.__id_to_container[id] ? this.__id_to_container[id].object : null;
	},

	clear : function() {
		BetaJS.Objs.iter(this.__id_to_container, function(container) {
			this.remove(container.object);
		}, this);
	}
}]);

BetaJS.Classes.ModuleMixin = {

	_notifications : {
		construct : function() {
			this.__modules = {};
		},
		destroy : function() {
			BetaJS.Objs.iter(this.__modules, this.remove_module, this);
		}
	},

	add_module : function(module) {
		if (module.cid() in this.__modules)
			return;
		this.__modules[module.cid()] = module;
		module.register(this);
		this._notify("add_module", module);
	},

	remove_module : function(module) {
		if (!(module.cid() in this.__modules))
			return;
		delete this.__modules[module.cid()];
		module.unregister(this);
		this._notify("remove_module", module);
	}
};

BetaJS.Class.extend("BetaJS.Classes.Module", {

	constructor : function(options) {
		this._inherited(BetaJS.Classes.Module, "constructor");
		this._objects = {};
		this.__auto_destroy = "auto_destroy" in options ? options.auto_destroy : true;
	},

	destroy : function() {
		BetaJS.Objs.iter(this._objects, this.unregister, this);
		this._inherited(BetaJS.Classes.Module, "destroy");
	},

	register : function(object) {
		var id = BetaJS.Ids.objectId(object);
		if ( id in this._objects)
			return;
		var data = {};
		this._objects[id] = {
			object : object,
			data : data
		};
		object.add_module(this);
		this._register(object, data);
	},

	_register : function(object) {
	},

	unregister : function(object) {
		var id = BetaJS.Ids.objectId(object);
		if (!( id in this._objects))
			return;
		var data = this._objects[id].data;
		this._unregister(object, data);
		delete this._objects[id];
		object.remove_module(this);
		if ("off" in object)
			object.off(null, null, this);
		if (this.__auto_destroy && BetaJS.Types.is_empty(this._objects))
			this.destroy();
	},

	_unregister : function(object) {
	},

	_data : function(object) {
		return this._objects[BetaJS.Ids.objectId(object)].data;
	}
}, {

	__instance : null,

	singleton : function() {
		if (!this.__instance)
			this.__instance = new this({
				auto_destroy : false
			});
		return this.__instance;
	}
});


BetaJS.Classes.ObjectIdMixin = {

    _notifications: {
        construct: "__register_object_id",
        destroy: "__unregister_object_id"
    },

    __object_id_scope: function () {
        if (this.object_id_scope)
            return this.object_id_scope;
        if (!BetaJS.Classes.ObjectIdScope)
            BetaJS.Classes.ObjectIdScope = BetaJS.Objs.clone(BetaJS.Classes.ObjectIdScopeMixin, 1);
        return BetaJS.Classes.ObjectIdScope;
    },

    __register_object_id: function () {
        var scope = this.__object_id_scope();
        scope.__objects[BetaJS.Ids.objectId(this)] = this;
    },

    __unregister_object_id: function () {
        var scope = this.__object_id_scope();
        delete scope.__objects[BetaJS.Ids.objectId(this)];
    }

};

BetaJS.Classes.ObjectIdScopeMixin = {

    __objects: {},

    get: function (id) {
        return this.__objects[id];
    }

};


BetaJS.Classes.HelperClassMixin = {
	
	addHelper: function (helper_class, options) {
		var helper = new helper_class(this, options);
		this.__helpers = this.__helpers || [];
		this.__helpers.push(this._auto_destroy(helper));
	},
	
	_helper: function (options) {
		if (BetaJS.Types.is_string(options)) {
			options = {
				method: options
			};
		}
		options = BetaJS.Objs.extend({
			fold_start: null,
			fold: function (acc, result) {
				return acc || result;
			}
		}, options);
		var args = BetaJS.Functions.getArguments(arguments, 1);
		var acc = options.fold_start;
		if (options.callbacks) {
			var self = this;
			var callback_index = -1;
			for (j = 0; j < args.length; ++j) {
				if (args[j] == options.callback)
					callback_index = j;
			}
			function helper_fold(idx) {
				if (idx >= self.__helpers.length) {
					BetaJS.SyncAsync.callback(options.callbacks, "success", acc);
					return;
				} else if (options.method in self.__helpers[idx]) {
					var helper = this.__helpers[idx];
					if (callback_index == -1) {
						helper[options.method].apply(helper, args);
						helper_fold(idx + 1);
					} else {
						args[callback_index] = {
							context: options.callbacks.context,
							success: function (result) {
								acc = options.fold(acc, result);
								helper_fold(idx + 1);
							},
							failure: options.callbacks.failure
						};
						helper[options.method].apply(helper, args);
					}
				} else
					helper_fold(idx + 1);
			}
			helper_fold(0);
		} else {
			for (var i = 0; i < this.__helpers.length; ++i) {
				var helper = this.__helpers[i];
				if (options.method in helper) {
					var result = helper[options.method].apply(helper, args);
					acc = options.fold(acc, result);
				}
			}
		}
		return acc;
	}
	
};
BetaJS.Properties = {};


BetaJS.Properties.TYPE_VALUE = 0;
BetaJS.Properties.TYPE_BINDING = 1;
BetaJS.Properties.TYPE_COMPUTED = 2;



BetaJS.Properties.PropertiesMixin = {
    
    raw_get: function (key) {
        return key in this.__properties ? this.__properties[key].value : null;    
    },
	
	get: function (key) {
	    keys = key.split(".");
	    var value = this.raw_get(keys[0]);
	    for (var i = 1; i < keys.length; ++i) {
	       if (value && BetaJS.Types.is_object(value))
	           value = value[keys[i]];
	       else
	           return null;
	    }
		return value;
	},
	
	_canSet: function (key, value) {
		return true;
	},
	
	_beforeSet: function (key, value) {
		return value;
	},
	
	_afterSet: function (key, value, options) {
	},
	
	has: function (key) {
		return key in this.__properties;
	},
	
	setAll: function (obj, options) {
		for (var key in obj)
			this.set(key, obj[key], options);
	},
	
	keys: function (mapped) {
		return BetaJS.Objs.keys(this.__properties, mapped);
	},
	
	binding: function (key) {
		return {
			type: BetaJS.Properties.TYPE_BINDING,
			bindee: this,
			property: key
		};
	},
	
	computed : function (f, dependencies) {
		return {
			type: BetaJS.Properties.TYPE_COMPUTED,
			func: f,
			dependencies: dependencies || []
		};
	},
	
	_isBinding: function (object) {
		return BetaJS.Types.is_object(object) && object && object.type && object.type == BetaJS.Properties.TYPE_BINDING && object.bindee && object.property;
	},
	
	_isComputed: function (object) {
		return BetaJS.Types.is_object(object) && object && object.type && object.type == BetaJS.Properties.TYPE_COMPUTED && object.func && object.dependencies;
	},
		
	getAll: function () {
		var obj = {};
		for (var key in this.__properties)
			obj[key] = this.get(key);
		return obj;
	},
	
	unset: function (key) {
		if (key in this.__properties) {
			var entry = this.__properties[key];
			if (entry.type == BetaJS.Properties.TYPE_BINDING) {
				entry.bindee.off("change:" + entry.property, null, this.__properties[key]);
			} else if (entry.type == BetaJS.Properties.TYPE_COMPUTED) {
				var self = this;
				BetaJS.Objs.iter(entry.dependencies, function (dep) {
					if (this._isBinding(dep))
						dep.bindee.off("change:" + dep.property, null, this.__properties[key]);
					else if (this._isTimer(dep))
						entry.timers[dep].destroy();
					else
						self.off("change:" + dep, null, this.__properties[key]);
				}, this);
			}
			this.trigger("unset", key);
			this.trigger("unset:" + key);
			delete this.__properties[key];
		}
	},
	
	_set_changed: function (key, old_value, options) {
		this._afterSet(key, this.get(key), old_value, options);
		this.trigger("change", key, this.get(key), old_value, options);
		this.trigger("change:" + key, this.get(key), old_value, options);
	},
	
	_isTimer: function (dep) {
		return BetaJS.Strings.starts_with("dep", "timer:");
	},
	
	_parseTimer: function (dep) {
		return parseInt(BetaJS.Strings.strip_start("timer:"), 10);
	},
	
	set: function (key, value, options) {
	    var keys = key.split(".");
	    if (keys.length < 2) {
	        this.raw_set(key, value, options);
	    } else {
    	    var obj = this.raw_get(key, obj);
    	    if (!obj) {
    	        obj = {};
    	        this.raw_set(key, obj, options);
    	    }
    	    for (var i = 2; i < keys.length - 1; ++i) {
    	        obj[keys[i]] = obj[keys[i]] || {};
    	        obj = obj[keys[i]];
    	    }
    	    var old_value = obj[keys[keys.length - 1]];
    	    obj[keys[keys.length - 1]] = value;
    	    if (old_value != value) {
                this.trigger("change", key, value, old_value);
                this.trigger("change:" + key.replace(".", "->"), value, old_value);
            }
        }
	},
	
	raw_set: function (key, value, options) {
		var old = this.get(key);
		if (old == value)
			return; 
		var self = this;
		var entry = this.__properties[key];
		if (this._isBinding(value)) {
			this.unset(key);
			this.__properties[key] = {
				type: BetaJS.Properties.TYPE_BINDING,
				bindee: value.bindee,
				property: value.property,
				value: value.bindee.get(value.property)
			};
			value.bindee.on("change:" + value.property, function () {
				var old = self.__properties[key].value;
				self.__properties[key].value = value.bindee.get(value.property);
				self._set_changed(key, old);
			}, this.__properties[key]);
			this._set_changed(key, old, options);
		} else if (this._isComputed(value)) {
			this.unset(key);
			this.__properties[key] = {
				type: BetaJS.Properties.TYPE_COMPUTED,
				func: value.func,
				dependencies: value.dependencies,
				value: value.func.apply(self),
				timers: {}
			};
			BetaJS.Objs.iter(value.dependencies, function (dep) {
				if (this._isBinding(dep))
					dep.bindee.on("change:" + dep.property, function () {
						var old = self.__properties[key].value;
						self.__properties[key].value = value.func.apply(self);
						self._set_changed(key, old);
					}, this.__properties[key]);
				else if (this._isTimer(dep)) {
					this.__properties[key].timers[dep] = new BetaJS.Timers.Timer({
						delay: this._parseTimer(dep),
						fire: function () {
							var old = self.__properties[key].value;
							self.__properties[key].value = value.func.apply(self);
							self._set_changed(key, old);
						}
					});
				} else
					self.on("change:" + dep, function () {
						var old = self.__properties[key].value;
						self.__properties[key].value = value.func.apply(self);
						self._set_changed(key, old);
					}, this.__properties[key]);
			}, this);
			this._set_changed(key, old);
		} else {
			value = this._beforeSet(key, value);
			if (this._canSet(key, value)) {
				if (this.__properties[key] && this.__properties[key].type == BetaJS.Properties.TYPE_BINDING) {
					this.__properties[key].bindee.set(this.__properties[key].property, value);
				} else {
					this.unset(key);
					this.__properties[key] = {
						type: BetaJS.Properties.TYPE_VALUE,
						value: value
					};
					this._set_changed(key, old, options);
				}
			}
		}
	},
	
	_notifications: {
		"construct": "__properties_construct",
		"destroy": "__properties_destroy"
	},
	
	__properties_construct: function () {
		this.__properties = {};
	},
	
	__properties_destroy: function () {
		for (var key in this.__properties) 
			this.unset(key);
		this.trigger("destroy");
	}
	
};

BetaJS.Class.extend("BetaJS.Properties.Properties", [
	BetaJS.Events.EventsMixin,
	BetaJS.Properties.PropertiesMixin, {
	
	constructor: function (obj) {
		this._inherited(BetaJS.Properties.Properties, "constructor");
		if (obj)
			this.setAll(obj);
	}
	
}]);



BetaJS.Class.extend("BetaJS.Properties.PropertiesData", {
	
	constructor: function (properties) {
		this._inherited(BetaJS.Properties.PropertiesData, "constructor");
		this.__properties = properties;
		this.data = this.__properties.getAll();
		this.__properties.on("change", function (key, value) {
			this.data[key] = value;
		}, this);
		this.__properties.on("unset", function (key) {
			delete this.data[key];
		}, this);
		this.__properties.on("destroy", function () {
			this.destroy();
		}, this);
	},
	
	properties: function () {
		return this.__properties;
	}
	
});

BetaJS.Class.extend("BetaJS.Collections.Collection", [
	BetaJS.Events.EventsMixin, {
		
	constructor: function (options) {
		this._inherited(BetaJS.Collections.Collection, "constructor");
		options = options || {};
		var list_options = {};
		if ("compare" in options)
			list_options["compare"] = options["compare"];
		this.__data = new BetaJS.Lists.ArrayList([], list_options);
		var self = this;
		this.__data._ident_changed = function (object, index) {
			self._index_changed(object, index);
		};
		this.__data._re_indexed = function (object) {
			self._re_indexed(object);
		};
		this.__data._sorted = function () {
			self._sorted();
		};
		if ("objects" in options)
			this.add_objects(options["objects"]);
	},
	
	set_compare: function (compare) {
		this.__data.set_compare(compare);
	},
	
	get_compare: function () {
		this.__data.get_compare();
	},

	destroy: function () {
		this.__data.iterate(function (object) {
			if ("off" in object)
				object.off(null, null, this);
		}, this);
		this.__data.destroy();
		this.trigger("destroy");
		this._inherited(BetaJS.Collections.Collection, "destroy");
	},
	
	count: function () {
		return this.__data.count();
	},
	
	_index_changed: function (object, index) {
		this.trigger("index", object, index);
	},
	
	_re_indexed: function (object) {
		this.trigger("reindexed", object);
	},
	
	_sorted: function () {
		this.trigger("sorted");
	},
	
	_object_changed: function (object, key, value) {
		this.trigger("update");
		this.trigger("change", object, key, value);
		this.trigger("change:" + key, object, value);
		this.__data.re_index(this.getIndex(object));
	},
	
	add: function (object) {
		if (!BetaJS.Class.is_class_instance(object))
			object = new BetaJS.Properties.Properties(object);
		if (this.exists(object))
			return null;
		var ident = this.__data.add(object);
		if (ident !== null) {
			this.trigger("add", object);
			this.trigger("update");
			if ("on" in object)
				object.on("change", function (key, value) {
					this._object_changed(object, key, value);
				}, this);
		}
		return ident;
	},
	
	add_objects: function (objects) {
		var count = 0;
		BetaJS.Objs.iter(objects, function (object) {
			if (this.add(object))
				count++;
		}, this);		
		return count;
	},
	
	exists: function (object) {
		return this.__data.exists(object);
	},
	
	remove: function (object) {
		if (!this.exists(object))
			return null;
		this.trigger("remove", object);
		this.trigger("update");
		var result = this.__data.remove(object);
		if ("off" in object)
			object.off(null, null, this);
		return result;
	},
	
	getByIndex: function (index) {
		return this.__data.get(index);
	},
	
	getById: function (id) {
		return this.__data.get(this.__data.ident_by_id(id));
	},
	
	getIndex: function (object) {
		return this.__data.get_ident(object);
	},
	
	iterate: function (cb, context) {
		this.__data.iterate(cb, context);
	},
	
	iterator: function () {
		return BetaJS.Iterators.ArrayIterator.byIterate(this.iterate, this);
	},
	
	clear: function () {
		this.iterate(function (obj) {
			this.remove(obj);
		}, this);
	}
		
}]);


BetaJS.Class.extend("BetaJS.Collections.CollectionData", {
	
	constructor: function (collection) {
		this._inherited(BetaJS.Collections.CollectionData, "constructor");
		this.__collection = collection;
		this.__properties_data = {};
		this.data = {};
		this.__collection.iterate(this.__insert, this);
		this.__collection.on("add", this.__insert, this);
		this.__collection.on("remove", this.__remove, this);
		this.__collection.on("destroy", function () {
			this.destroy();
		}, this);
	},
	
	collection: function () {
		return this.__collection;
	},
	
	__insert: function (property) {
		var id = BetaJS.Ids.objectId(property);
		this.__properties_data[id] = new BetaJS.Properties.PropertiesData(property);
		this.data[id] = this.__properties_data[id].data;
	},
	
	__remove: function (property) {
		var id = BetaJS.Ids.objectId(property);
		this.__properties_data[id].destroy();
		delete this.__properties_data[id];
		delete this.data[id];
	}
	
});



BetaJS.Collections.Collection.extend("BetaJS.Collections.FilteredCollection", {
	
	constructor: function (parent, options) {
		this.__parent = parent;
		options = options || {};
		delete options["objects"];
		options.compare = options.compare || parent.get_compare();
		this._inherited(BetaJS.Collections.FilteredCollection, "constructor", options);
		if ("filter" in options)
			this.filter = options["filter"];
		this.__parent.iterate(function (object) {
			this.add(object);
			return true;
		}, this);
		this.__parent.on("add", this.add, this);
		this.__parent.on("remove", this.remove, this);
	},
	
	filter: function (object) {
		return true;
	},
	
	_object_changed: function (object, key, value) {
		this._inherited(BetaJS.Collections.FilteredCollection, "_object_changed", object, key, value);
		if (!this.filter(object))
			this.__selfRemove(object);
	},
	
	destroy: function () {
		this.__parent.off(null, null, this);
		this._inherited(BetaJS.Collections.FilteredCollection, "destroy");
	},
	
	__selfAdd: function (object) {
		return this._inherited(BetaJS.Collections.FilteredCollection, "add", object);
	},
	
	add: function (object) {
		if (this.exists(object) || !this.filter(object))
			return null;
		var id = this.__selfAdd(object);
		this.__parent.add(object);
		return id;
	},
	
	__selfRemove: function (object) {
		return this._inherited(BetaJS.Collections.FilteredCollection, "remove", object);
	},

	remove: function (object) {
		if (!this.exists(object))
			return null;
		var result = this.__selfRemove(object);
		if (!result)
			return null;
		return this.__parent.remove(object);
	}
	
});

BetaJS.Comparators = {
	
	byObject: function (object) {
		return function (left, right) {
			for (key in object) {
				var c = 0;
				if (BetaJS.Properties.Properties.is_class_instance(left) && BetaJS.Properties.Properties.is_class_instance(right))
					c = BetaJS.Comparators.byValue(left.get(key) || null, right.get(key) || null);
				else
					c = BetaJS.Comparators.byValue(left[key] || null, right[key] || null);
				if (c !== 0)
					return c * object[key];
			}
			return 0;
		};
	},
	
	byValue: function (a, b) {
		if (BetaJS.Types.is_string(a))
			return a.localeCompare(b);
		if (a < b)
			return -1;
		if (a > b)
			return 1;
		return 0;
	}
		
};

BetaJS.Sort = {

	sort_object : function(object, f) {
		var a = [];
		for (var key in object)
		a.push({
			key : key,
			value : object[key]
		});
		a.sort(function (x, y) {
			return f(x.key, y.key, x.value, y.value);
		});
		var o = {};
		for (var i = 0; i < a.length; ++i)
			o[a[i].key] = a[i].value;
		return o;
	},
	
	deep_sort: function (object, f) {
		f = f || BetaJS.Comparators.byValue;
		if (BetaJS.Types.is_array(object)) {
			for (var i = 0; i < object.length; ++i)
				object[i] = this.deep_sort(object[i], f);
			return object.sort(f);
		} else if (BetaJS.Types.is_object(object)) {
			for (var key in object)
				object[key] = this.deep_sort(object[key], f);
			return this.sort_object(object, f);
		} else
			return f;
	},

	dependency_sort : function(items, identifier, before, after) {
		var identifierf = BetaJS.Types.is_string(identifier) ? function(obj) {
			return obj[identifier];
		} : identifier;
		var beforef = BetaJS.Types.is_string(before) ? function(obj) {
			return obj[before];
		} : before;
		var afterf = BetaJS.Types.is_string(after) ? function(obj) {
			return obj[after];
		} : after;
		var n = items.length;
		var data = [];
		var identifier_to_index = {};
		var todo = {};
		var i = null;
		for ( i = 0; i < n; ++i) {
			todo[i] = true;
			var ident = identifierf(items[i], i);
			identifier_to_index[ident] = i;
			data.push({
				before : {},
				after : {}
			});
		}
		for ( i = 0; i < n; ++i) {
			BetaJS.Objs.iter(beforef(items[i], i) || [], function(before) {
				var before_index = identifier_to_index[before];
				if (BetaJS.Types.is_defined(before_index)) {
					data[i].before[before_index] = true;
					data[before_index].after[i] = true;
				}
			});
			BetaJS.Objs.iter(afterf(items[i]) || [], function(after) {
				var after_index = identifier_to_index[after];
				if (BetaJS.Types.is_defined(after_index)) {
					data[i].after[after_index] = true;
					data[after_index].before[i] = true;
				}
			});
		}
		var result = [];
		while (!BetaJS.Types.is_empty(todo)) {
			for (i in todo) {
				if (BetaJS.Types.is_empty(data[i].after)) {
					delete todo[i];
					result.push(items[i]);
					for (bef in data[i].before)
					delete data[bef].after[i];
				}
			}
		}
		return result;
	}
};

BetaJS.Locales = {
	
	__data: {},
	
	language: null,
	
	get: function (key) {
	    if (this.language && (this.language + "." + key) in this.__data)
	        return this.__data[this.language + "." + key];
		return key in this.__data ? this.__data[key] : key;
	},
	
	register: function (strings, prefix) {
		prefix = prefix ? prefix + "." : "";
		for (var key in strings)
			this.__data[prefix + key] = strings[key];
	},
	
	view: function (base) {
		return {
			context: this,
			base: base,
			get: function (key) {
				return this.context.get(this.base + "." + key);
			},
			base: function (base) {
				return this.context.base(this.base + "." + base);
			}
		};
	}
	
};
BetaJS.Time = {
	
	format_time: function(t, s) {
		var seconds = this.seconds(t);
		var minutes = this.minutes(t);
		var hours = this.hours(t);
		var replacers = {
			"hh": hours < 10 ? "0" + hours : hours, 
			"h": hours, 
			"mm": minutes < 10 ? "0" + minutes : minutes, 
			"m": minutes, 
			"ss": seconds < 10 ? "0" + seconds : seconds, 
			"s": seconds
		};
		for (var key in replacers)
			s = s.replace(key, replacers[key]);
		return s;
	},
	
	make: function (data) {
		var t = 0;
		var multipliers = {
			hours: 60,
			minutes: 60,
			seconds: 60,
			milliseconds: 1000
		};
		for (var key in multipliers) {
			t *= multipliers[key];
			if (key in data)
				t += data[key];
		}
		return t;
	},
	
	seconds: function (t) {
		return Math.floor(t / 1000) % 60;
	},
	
	minutes: function (t) {
		return Math.floor(t / 60 / 1000) % 60;
	},

	hours: function (t) {
		return Math.floor(t / 60 / 60 / 1000) % 24;
	},

	days: function (t) {
		return Math.floor(t / 24 / 60 / 60 / 1000);
	},

	now: function () {
		var d = new Date();
		return d.getTime();
	},
	
	ago: function (t) {
		return this.now() - t;
	},
	
	days_ago: function (t) {
		return this.days(this.ago(t));
	},
	
	format_ago: function (t) {
		if (this.days_ago(t) > 1)
			return this.format(t, {time: false});
		else
			return this.format_period(Math.max(this.ago(t), 0)) + " ago";
	},
	
	format_period: function (t) {
		t = Math.round(t / 1000);
		if (t < 60)
			return t + " " + BetaJS.Locales.get(t == 1 ? "second" : "seconds");
		t = Math.round(t / 60);
		if (t < 60)
			return t + " " + BetaJS.Locales.get(t == 1 ? "minute" : "minutes");
		t = Math.round(t / 60);
		if (t < 24)
			return t + " " + BetaJS.Locales.get(t == 1 ? "hour" : "hours");
		t = Math.round(t / 24);
		return t + " " + BetaJS.Locales.get(t == 1 ? "day" : "days");
	},
	
	format: function (t, options) {
		options = BetaJS.Objs.extend({
			time: true,
			date: true,
			locale: true
		}, options || {});
		var d = new Date(t);
		if (options.locale) {
			if (options.date) {
				if (options.time)
					return d.toLocaleString();
				else
					return d.toLocaleDateString();
			} else
				return d.toLocaleTimeString();
		} else {
			if (options.date) {
				if (options.time) 
					return d.toString();
				else
					return d.toDateString();
			} else
				return d.toTimeString();
		}
	}
	
};

BetaJS.Class.extend("BetaJS.Timers.Timer", {
	
	/*
	 * int delay (mandatory): number of milliseconds until it fires
	 * bool once (optional, default false): should it fire infinitely often
	 * func fire (optional): will be fired
	 * object context (optional): for fire
	 * bool start (optional, default true): should it start immediately
	 * 
	 */
	constructor: function (options) {
		this._inherited(BetaJS.Timers.Timer, "constructor");
		options = BetaJS.Objs.extend({
			once: false,
			start: true,
			fire: null,
			context: this,
			destroy_on_fire: false
		}, options);
		this.__delay = options.delay;
		this.__destroy_on_fire = options.destroy_on_fire;
		this.__once = options.once;
		this.__fire = options.fire;
		this.__context = options.context;
		this.__started = false;
		if (options.start)
			this.start();
	},
	
	destroy: function () {
		this.stop();
		this._inherited(BetaJS.Timers.Timer, "destroy");
	},
	
	fire: function () {
		if (this.__once)
			this.__started = false;
		if (this.__fire)
			this.__fire.apply(this.__context, [this]);
		if (this.__destroy_on_fire)
			this.destroy();
	},
	
	stop: function () {
		if (!this.__started)
			return;
		if (this.__once)
			clearTimeout(this.__timer);
		else
			clearInterval(this.__timer);
		this.__started = false;
	},
	
	start: function () {
		if (this.__started)
			return;
		var self = this;
		if (this.__once)
			this.__timer = setTimeout(function () {
				self.fire();
			}, this.__delay);
		else
			this.__timer = setInterval(function () {
				self.fire();
			}, this.__delay);
		this.__started = true;
	},
	
	restart: function () {
		this.stop();
		this.start();
	}
	
});
/*
 * Inspired by Underscore's Templating Engine
 * (which itself is inspired by John Resig's implementation)
 */

BetaJS.Templates = {
	
	tokenize: function (s) {
		// Already tokenized?
		if (BetaJS.Types.is_array(s))
			return s;
		var tokens = [];
		var index = 0;
		s.replace(BetaJS.Templates.SYNTAX_REGEX(), function(match, expr, esc, code, offset) {
			if (index < offset) 
				tokens.push({
					type: BetaJS.Templates.TOKEN_STRING,
					data: BetaJS.Strings.js_escape(s.slice(index, offset))
				});
			if (code)
				tokens.push({type: BetaJS.Templates.TOKEN_CODE, data: code});
			if (expr)
				tokens.push({type: BetaJS.Templates.TOKEN_EXPR, data: expr});
			if (esc)
				tokens.push({type: BetaJS.Templates.TOKEN_ESC, data: esc});
		    index = offset + match.length;
		    return match;
		});
		return tokens;
	},
	
	/*
	 * options
	 *  - start_index: token start index
	 *  - end_index: token end index
	 */
	compile: function(source, options) {
		if (BetaJS.Types.is_string(source))
			source = this.tokenize(source);
		options = options || {};
		var start_index = options.start_index || 0;
		var end_index = options.end_index || source.length;
		var result = "__p+='";
		for (var i = start_index; i < end_index; ++i) {
			switch (source[i].type) {
				case BetaJS.Templates.TOKEN_STRING:
					result += source[i].data;
					break;
				case BetaJS.Templates.TOKEN_CODE:
					result += "';\n" + source[i].data + "\n__p+='";
					break;
				case BetaJS.Templates.TOKEN_EXPR:
					result += "'+\n((__t=(" + source[i].data + "))==null?'':__t)+\n'";
					break;
				case BetaJS.Templates.TOKEN_ESC:
					result += "'+\n((__t=(" + source[i].data + "))==null?'':BetaJS.Strings.htmlentities(__t))+\n'";
					break;
				default:
					break;
			}	
		}
		result += "';\n";
		result = 'with(obj||{}){\n' + result + '}\n';
		result = "var __t,__p='',__j=Array.prototype.join," +
		  "echo=function(){__p+=__j.call(arguments,'');};\n" +
		  result + "return __p;\n";
		var func = new Function('obj', result);
		var func_call = function(data) {
			return func.call(this, data);
		};
		func_call.source = 'function(obj){\n' + result + '}';
		return func_call;
	}
		
};

BetaJS.Templates.SYNTAX = {
	OPEN: "{%",
	CLOSE: "%}",
	MODIFIER_CODE: "",
	MODIFIER_EXPR: "=",
	MODIFIER_ESC: "-"
};

BetaJS.Templates.SYNTAX_REGEX = function () {
	var syntax = BetaJS.Templates.SYNTAX;
	if (!BetaJS.Templates.SYNTAX_REGEX_CACHED)
		BetaJS.Templates.SYNTAX_REGEX_CACHED = new RegExp(
			syntax.OPEN + syntax.MODIFIER_EXPR + "([\\s\\S]+?)" + syntax.CLOSE + "|" +
			syntax.OPEN + syntax.MODIFIER_ESC + "([\\s\\S]+?)" + syntax.CLOSE + "|" +
			syntax.OPEN + syntax.MODIFIER_CODE + "([\\s\\S]+?)" + syntax.CLOSE + "|" +
			"$",
		'g');
	return BetaJS.Templates.SYNTAX_REGEX_CACHED;
};

BetaJS.Templates.TOKEN_STRING = 1;
BetaJS.Templates.TOKEN_CODE = 2;
BetaJS.Templates.TOKEN_EXPR = 3;
BetaJS.Templates.TOKEN_ESC = 4;



BetaJS.Class.extend("BetaJS.Templates.Template", {
	
	constructor: function (template_string) {
		this._inherited(BetaJS.Templates.Template, "constructor");
		this.__tokens = BetaJS.Templates.tokenize(template_string);
		this.__compiled = BetaJS.Templates.compile(this.__tokens);
	},
	
	evaluate: function (obj) {
		return this.__compiled.apply(this, [obj]);
	}
	
}, {
	
	bySelector: function (selector) {
		return new this(BetaJS.$(selector).html());
	}
	
});
BetaJS.Class.extend("BetaJS.States.Host", [
    BetaJS.Events.EventsMixin,
    {
    
    initialize: function (initial_state, initial_args) {
        var cls = BetaJS.Scopes.resolve(initial_state);
        var obj = new cls(this, initial_args, {});
        obj.start();
    },
    
    finalize: function () {
        if (this._state)
            this._state.destroy();
		this._state = null;    	
    },
    
    destroy: function () {
    	this.finalize();
        this._inherited(BetaJS.States.Host, "destroy");
    },
    
    state: function () {
        return this._state;
    },

    _start: function (state) {
        this._stateEvent(state, "before_start");
        this._state = state;
    },
    
    _afterStart: function (state) {
        this._stateEvent(state, "start");
    },
    
    _end: function (state) {
        this._stateEvent(state, "end");
        this._state = null;
    },
    
    _afterEnd: function (state) {
        this._stateEvent(state, "after_end");
    },
    
    _next: function (state) {
        this._stateEvent(state, "next");
    },
    
    _afterNext: function (state) {
        this._stateEvent(state, "after_next");
    },
    
    _can_transition_to: function (state) {
        return true;
    },
    
    _stateEvent: function (state, s) {
        this.trigger("event", s, state.state_name(), state.description());
        this.trigger(s, state.state_name(), state.description());
        this.trigger(s + ":" + state.state_name(), state.description());
    }

}]);


BetaJS.Class.extend("BetaJS.States.State", {

    _locals: [],
    _persistents: [],
    
    _white_list: null,

    constructor: function (host, args, transitionals) {
        this._inherited(BetaJS.States.State, "constructor");
        this.host = host;
        this.transitionals = transitionals;
        this._starting = false;
        this._started = false;
        this._stopped = false;
        this.__next_state = null;
        this.__suspended = 0;
        args = args || {};
        this._locals = BetaJS.Types.is_function(this._locals) ? this._locals() : this._locals;
        for (var i = 0; i < this._locals.length; ++i)
            this["_" + this._locals[i]] = args[this._locals[i]];
        this._persistents = BetaJS.Types.is_function(this._persistents) ? this._persistents() : this._persistents;
        for (i = 0; i < this._persistents.length; ++i)
            this["_" + this._persistents[i]] = args[this._persistents[i]];
    },

    state_name: function () {
        return BetaJS.Strings.last_after(this.cls.classname, ".");
    },
    
    description: function () {
        return this.state_name();
    },
    
    start: function () {
    	if (this._starting)
    		return;
        this._starting = true;
        this.host._start(this);
        this._start();
        if (this.host) {
            this.host._afterStart(this);
            this._started = true;
        }
    },
    
    end: function () {
    	if (this._stopped)
    		return;
    	this._stopped = true;
        this._end();
        this.host._end(this);
        this.host._afterEnd(this);
        this.destroy();
    },
    
    next: function (state_name, args, transitionals) {
    	if (!this._starting || this._stopped || this.__next_state)
    		return;
        var clsname = this.cls.classname;
        var scope = BetaJS.Scopes.resolve(clsname.substring(0, clsname.lastIndexOf(".")));
        var cls = scope[state_name];
        args = args || {};
        for (var i = 0; i < this._persistents.length; ++i) {
            if (!(this._persistents[i] in args))
                args[this._persistents[i]] = this["_" + this._persistents[i]];
        }
        var obj = new cls(this.host, args, transitionals);
        if (!this.can_transition_to(obj)) {
            obj.destroy();
            return;
        }
        if (!this._started) {
            this.host._afterStart(this);
            this._started = true;
        }
        this.__next_state = obj;
        if (this.__suspended <= 0)
        	this.__next();
    },
    
    __next: function () {
        var host = this.host;
        var obj = this.__next_state;
        host._next(obj);
        this.end();
        obj.start();
        host._afterNext(obj);
    },
    
    suspend: function () {
    	this.__suspended++;
    },
    
    resume: function () {
    	this.__suspended--;
    	if (this.__suspended === 0 && !this._stopped && this.__next_state)
    		this.__next();
    },

    can_transition_to: function (state) {
        return this.host && this.host._can_transition_to(state) && this._can_transition_to(state);
    },
    
    _start: function () {},
    
    _end: function () {},
    
    _can_transition_to: function (state) {
        return !BetaJS.Types.is_array(this._white_list) || BetaJS.Objs.contains_value(this._white_list, state.state_name());
    }

});



BetaJS.Class.extend("BetaJS.States.CompetingComposite", {

    _register_host: function (competing_host) {
        this._hosts = this._hosts || [];
        this._hosts.push(this._auto_destroy(competing_host));
    },
    
    other_hosts: function (competing_host) {
        return BetaJS.Objs.filter(this._hosts || [], function (other) {
            return other != competing_host;
        }, this);
    },
    
    _next: function (competing_host, state) {
        var others = this.other_hosts(competing_host);
        for (var i = 0; i < others.length; ++i) {
            var other = others[i];
            var other_state = other.state();
            if (!other_state.can_coexist_with(state))
                other_state.retreat_against(state);
        }
    }

});


BetaJS.States.Host.extend("BetaJS.States.CompetingHost", {

    constructor: function (composite) {
        this._inherited(BetaJS.States.CompetingHost, "constructor");
        this._composite = composite;
        if (composite)
            composite._register_host(this);
    },
    
    composite: function () {
        return this._composite;
    },

    _can_transition_to: function (state) {
        if (!this._composite)
            return true;
        var others = this._composite.other_hosts(this);
        for (var i = 0; i < others.length; ++i) {
            var other = others[i];
            var other_state = other.state();
            if (!state.can_coexist_with(other_state) && !state.can_prevail_against(other_state))
                return false;
        }
        return true;
    },
    
    _next: function (state) {
        if (this._composite)
            this._composite._next(this, state);
        this._inherited(BetaJS.States.CompetingHost, "_next", state);
    }
    
});


BetaJS.States.State.extend("BetaJS.States.CompetingState", {

    can_coexist_with: function (foreign_state) {
        return true;
    },
    
    can_prevail_against: function (foreign_state) {
        return false;
    },
    
    retreat_against: function (foreign_state) {
    }
    
});

BetaJS.Class.extend("BetaJS.Channels.Sender", [
	BetaJS.Events.EventsMixin,
	{
	
	send: function (message, data) {
		this.trigger("send", message, data);
		this._send(message, data);
	},
	
	_send: function (message, data) {}
	
}]);

BetaJS.Class.extend("BetaJS.Channels.Receiver", [
	BetaJS.Events.EventsMixin,
	{
		
	_receive: function (message, data) {
		this.trigger("receive", message, data);
		this.trigger("receive:" + message, data);
	}
	
}]);


BetaJS.Channels.Sender.extend("BetaJS.Channels.ReveiverSender", {
	
	constructor: function (receiver) {
		this._inherited(BetaJS.Channels.ReveiverSender, "constructor");
		this.__receiver = receiver;
	},
	
	_send: function (message, data) {
		this.__receiver._receive(message, data);
	}
	
});

BetaJS.Channels.Sender.extend("BetaJS.Channels.SenderMultiplexer", {
	
	constructor: function (sender, prefix) {
		this._inherited(BetaJS.Channels.SenderMultiplexer, "constructor");
		this.__sender = sender;
		this.__prefix = prefix;
	},
	
	_send: function (message, data) {
		this.__sender.send(this.__prefix + ":" + message, data);
	}
	
});

BetaJS.Channels.Receiver.extend("BetaJS.Channels.ReceiverMultiplexer", {

	constructor: function (receiver, prefix) {
		this._inherited(BetaJS.Channels.ReceiverMultiplexer, "constructor");
		this.__receiver = receiver;
		this.__prefix = prefix;
		this.__receiver.on("receive", function (message, data) {
			if (BetaJS.Strings.starts_with(message, this.__prefix + ":")) {
				this._receive(BetaJS.Strings.strip_start(message, this.__prefix + ":"), data);
			}
		}, this);
	}
		
});



BetaJS.Class.extend("BetaJS.Channels.TransportChannel", {
	
	constructor: function (sender, receiver, options) {
		this._inherited(BetaJS.Channels.TransportChannel, "constructor");
		this.__sender = sender;
		this.__receiver = receiver;
		this.__options = BetaJS.Objs.extend(options, {
			timeout: 10000,
			tries: 1,
			timer: 500
		});
		this.__receiver.on("receive:send", function (data) {
			this.__reply(data);
		}, this);
		this.__receiver.on("receive:reply", function (data) {
			this.__complete(data);
		}, this);
		this.__sent_id = 0;
		this.__sent = {};
		this.__received = {};
		this.__timer = this._auto_destroy(new BetaJS.Timers.Timer({
			delay: this.__options.timer,
			context: this,
			fire: this.__maintenance
		}));
	},
	
	_reply: function (message, data, callbacks) {},
	
	send: function (message, data, callbacks, options) {
		options = options || {};
		if (options.stateless) {
			this.__sender.send("send", {
				message: message,
				data: data,
				stateless: true
			});
		} else {
			this.__sent_id++;
			this.__sent[this.__sent_id] = {
				message: message,
				data: data,
				tries: 1,
				time: BetaJS.Time.now(),
				id: this.__sent_id,
				callbacks: callbacks
			};
			this.__sender.send("send", {
				message: message,
				data: data,
				id: this.__sent_id
			});
		}
	},
	
	__reply: function (data) {
		if (data.stateless) {
			this._reply(data.message, data.data);
			return;
		}
		if (!this.__received[data.id]) {
			this.__received[data.id] = data;
			this.__received[data.id].time = BetaJS.Time.now();
			this.__received[data.id].returned = false;
			this.__received[data.id].success = false;
			this._reply(data.message, data.data, {
				context: this,
				success: function (result) {
					this.__received[data.id].reply = result;
					this.__received[data.id].success = true;
				}, complete: function () {
					this.__received[data.id].returned = true;
					this.__sender.send("reply", {
						id: data.id,
						reply: data.reply,
						success: data.success
					});
				}
			});
			  
		} else if (this.__received[data.id].returned) {
			this.__sender.send("reply", {
				id: data.id,
				reply: data.reply,
				success: data.success
			});
		}
	},
	
	__complete: function (data) {
		if (this.__sent[data.id]) {
			BetaJS.SyncAsync.callback(this.__sent[data.id].callbacks, "success", data.reply);
			delete this.__sent[data.id];
		}
	},
	
	__maintenance: function () {
		var now = BetaJS.Time.now();
		for (var received_key in this.__received) {
			var received = this.__received[received_key];
			if (received.time + this.__options.tries * this.__options.timeout <= now)
				delete this.__received[received_key];
		}
		for (var sent_key in this.__sent) {
			var sent = this.__sent[sent_key];
			if (sent.time + sent.tries * this.__options.timeout <= now) {
				if (sent.tries < this.__options.tries) {
					sent.tries++;
					this.__sender.send("send", {
						message: sent.message,
						data: sent.data,
						id: sent.id
					});
				} else {
					BetaJS.SyncAsync.callback(sent.callbacks, "failure", {
						message: sent.message,
						data: sent.data
					});
					delete this.__sent[sent_key];
				}
			}
		}
	}
	
});

BetaJS.Class.extend("BetaJS.RMI.Stub", [
	BetaJS.Classes.InvokerMixin,
	BetaJS.Events.EventsMixin,
	{
		
	intf: [],
	
	constructor: function () {
		this._inherited(BetaJS.RMI.Stub, "constructor");
		this.invoke_delegate("invoke", this.intf);
	},
	
	destroy: function () {
		this.invoke("_destroy");
		this.trigger("destroy");
		this._inherited(BetaJS.RMI.Stub, "destroy");
	},
	
	_new_promise: function () {
		return {
			context: this,
			success: function (f) {
				this.__success = f;
				if (this.is_complete && this.is_success)
					this.__success.call(this.context, this.result);
				return this;
			},
			failure: function (f) {
				this.__failure = f;
				if (this.is_complete && this.is_failure)
					this.__failure.call(this.context);
				return this;
			},
			callbacks: function (c) {
			    c = c.callbacks ? c.callbacks : c;
			    this.context = c.context || this;
			    if (c.success)
			        this.success(c.success);
                if (c.failure)
                    this.failure(c.failure);
                if (c.exception)
                    this.failure(c.exception);
                return this;
			}
		};
	},
	
	_promise_success: function (promise, result) {
		promise.result = result;
		promise.is_complete = true;
		promise.is_success = true;
		if (promise.__success)
			promise.__success.call(promise.context, result);
	},
	
	_promise_failure: function (promise) {
		promise.is_complete = true;
		promise.is_failure = true;		
		if (promise.__failure)
			promise.__failure.call(promise.context);
	},
	
	invoke: function (message) {
		var promise = this._new_promise();
		this.trigger("send", message, BetaJS.Functions.getArguments(arguments, 1), {
			context: this,
			success: function (result) {
				return this._promise_success(promise, result);
			},
			failure: function () {
				return this._promise_failure(promise);
			}
		});
		return promise;
	}
	
}]);

BetaJS.Class.extend("BetaJS.RMI.StubSyncer", [
	BetaJS.Classes.InvokerMixin,
	{
	
	constructor: function (stub) {
		this._inherited(BetaJS.RMI.StubSyncer, "constructor");
		this.__stub = stub;
		this.__current = null;
		this.__queue = [];
		this.invoke_delegate("invoke", this.__stub.intf);
	},
	
	invoke: function () {
		var object = {
			args: BetaJS.Functions.getArguments(arguments),
			promise: this.__stub._new_promise()
		};
		this.__queue.push(object);
		if (!this.__current)
			this.__next();
		return object.promise;		
	},
	
	__next: function () {
		if (this.__queue.length === 0)
			return;
		this.__current = this.__queue.shift();
		this.__stub.invoke.apply(this.__stub, this.__current.args).callbacks({
			context: this,
			success: function (result) {
				this.__stub._promise_success(this.__current.promise, result);
				this.__next();
			},
			failure: function () {
				this.__stub._promise_failure(this.__current.promise);
				this.__next();
			}
		});
	}
	
}]);


BetaJS.Class.extend("BetaJS.RMI.Skeleton", [
	BetaJS.Events.EventsMixin,
	{
	
	_stub: null,
	intf: [],
	intfSync: [],
	_intf: {},
	_intfSync: {},
	__superIntf: [],
	__superIntfSync: ["_destroy"],
	
	constructor: function (options) {
		this._options = BetaJS.Objs.extend({
			destroyable: false
		}, options);
		this._inherited(BetaJS.RMI.Skeleton, "constructor");
		this.intf = this.intf.concat(this.__superIntf);
		this.intfSync = this.intfSync.concat(this.__superIntfSync);
		for (var i = 0; i < this.intf.length; ++i)
			this._intf[this.intf[i]] = true;
		for (i = 0; i < this.intfSync.length; ++i)
			this._intfSync[this.intfSync[i]] = true;
	},
	
	_destroy: function () {
		if (this._options.destroyable)
			this.destroy();
	},
	
	destroy: function () {
		this.trigger("destroy");
		this._inherited(BetaJS.RMI.Skeleton, "destroy");
	},
	
	invoke: function (message, data, callbacks, caller) {
		if (!(this._intf[message] || this._intfSync[message])) {
			this._failure(callbacks);
			return;
		}
		var ctx = {
			callbacks: callbacks,
			caller: caller
		};
		if (this._intf[message]) {
			data.unshift(ctx);
			this[message].apply(this, data);
		} else {
			try {
				this._success(ctx, this[message].apply(this, data));
			} catch (e) {
				this._failure(ctx, e);
			}
		}
	},
	
	_success: function (callbacks, result) {
		callbacks = callbacks.callbacks ? callbacks.callbacks : callbacks;
		BetaJS.SyncAsync.callback(callbacks, "success", result);
	},
	
	_failure: function (callbacks) {
		callbacks = callbacks.callbacks ? callbacks.callbacks : callbacks;
		BetaJS.SyncAsync.callback(callbacks, "failure");
	},
	
	stub: function () {
		if (this._stub)
			return this._stub;
		var stub = this.cls.classname;
		return stub.indexOf("Skeleton") >= 0 ? stub.replace("Skeleton", "Stub") : stub;
	}
	
}]);

BetaJS.Class.extend("BetaJS.RMI.Server", [
	BetaJS.Events.EventsMixin,
	{
	
	constructor: function (sender_or_channel_or_null, receiver_or_null) {
		this._inherited(BetaJS.RMI.Server, "constructor");
		this.__channels = new BetaJS.Lists.ObjectIdList();
		this.__instances = {};
		if (sender_or_channel_or_null) {
			var channel = sender_or_channel_or_null;
			if (receiver_or_null)
				channel = this._auto_destroy(new BetaJS.Channels.TransportChannel(sender_or_channel_or_null, receiver_or_null));
			this.registerClient(channel);
		}
	},
	
	destroy: function () {
		this.__channels.iterate(this.unregisterClient, this);
		BetaJS.Objs.iter(this.__instances, function (inst) {
			this.unregisterInstance(inst.instance);
		}, this);
		this.__channels.destroy();
		this._inherited(BetaJS.RMI.Server, "destroy");
	},
	
	registerInstance: function (instance, options) {
		options = options || {};
		this.__instances[BetaJS.Ids.objectId(instance, options.name)] = {
			instance: instance,
			options: options
		};
		return instance;
	},
	
	unregisterInstance: function (instance) {
		delete this.__instances[BetaJS.Ids.objectId(instance)];
		instance.destroy();
	},
	
	registerClient: function (channel) {
		var self = this;
		this.__channels.add(channel);
		channel._reply = function (message, data, callbacks) {
			var components = message.split(":");
			if (components.length == 2)
				self._invoke(channel, components[0], components[1], data, callbacks);
			else
				BetaJS.SyncAsync.callback(callbacks, "failure");
		};
	},
	
	unregisterClient: function (channel) {
		this.__channels.remove(channel);
		channel._reply = null;
	},
	
	_invoke: function (channel, instance_id, method, data, callbacks) {
		var instance = this.__instances[instance_id];
		if (!instance) {
			this.trigger("loadInstance", channel, instance_id);
			instance = this.__instances[instance_id];
		}
		if (!instance) {
			BetaJS.SyncAsync.callback(callbacks, "failure");
			return;
		}
		instance = instance.instance;
		var self = this;
		instance.invoke(method, data, BetaJS.SyncAsync.mapSuccess(callbacks, function (result) {
			if (BetaJS.RMI.Skeleton.is_class_instance(result) && result.instance_of(BetaJS.RMI.Skeleton)) {
				self.registerInstance(result);
				BetaJS.SyncAsync.callback(callbacks, "success", {
					__rmi_meta: true,
					__rmi_stub: result.stub(),
					__rmi_stub_id: BetaJS.Ids.objectId(result)
				});
			} else
				BetaJS.SyncAsync.callback(callbacks, "success", result);
		}), channel);
	}
		
}]);


BetaJS.Class.extend("BetaJS.RMI.Client", {
	
	constructor: function (sender_or_channel_or_null, receiver_or_null) {
		this._inherited(BetaJS.RMI.Client, "constructor");
		this.__channel = null;
		this.__instances = {};
		if (sender_or_channel_or_null) {
			var channel = sender_or_channel_or_null;
			if (receiver_or_null)
				channel = this._auto_destroy(new BetaJS.Channels.TransportChannel(sender_or_channel_or_null, receiver_or_null));
			this.__channel = channel;
		}
	},
	
	destroy: function () {
		if (this.__channel)
			this.disconnect();
		this._inherited(BetaJS.RMI.Client, "destroy");
	},
	
	connect: function (channel) {
		if (this.__channel)
			return;
		this.__channel = channel;
	},
	
	disconnect: function () {
		if (!this.__channel)
			return;
		this.__channel = null;
		BetaJS.Objs.iter(this.__instances, function (inst) {
			this.release(inst);
		}, this);
	},
	
	acquire: function (class_type, instance_name) {
		if (this.__instances[instance_name])
			return this.__instances[instance_name];
		if (BetaJS.Types.is_string(class_type))
			class_type = BetaJS.Scopes.resolve(class_type);
		if (!class_type || !class_type.ancestor_of(BetaJS.RMI.Stub))
			return null;
		var instance = new class_type();
		this.__instances[BetaJS.Ids.objectId(instance, instance_name)] = instance;
		var self = this;
		instance.on("send", function (message, data, callbacks) {
			this.__channel.send(instance_name + ":" + message, data, BetaJS.SyncAsync.mapSuccess(callbacks, function (result) {
				if (BetaJS.Types.is_object(result) && result.__rmi_meta)
					BetaJS.SyncAsync.callback(callbacks, "success", self.acquire(result.__rmi_stub, result.__rmi_stub_id));
				else
					BetaJS.SyncAsync.callback(callbacks, "success", result);
			}));
		}, this);
		return instance;		
	},
	
	release: function (instance) {
		var instance_name = BetaJS.Ids.objectId(instance);
		if (!this.__instances[instance_name])
			return;
		instance.off(null, null, this);
		instance.destroy();
		delete this.__instances[instance_name];
	}
	
});


BetaJS.Class.extend("BetaJS.RMI.Peer", {

	constructor: function (sender, receiver) {
		this._inherited(BetaJS.RMI.Peer, "constructor");
		this.__sender = sender;
		this.__receiver = receiver;
		this.__client_sender = this._auto_destroy(new BetaJS.Channels.SenderMultiplexer(sender, "client"));
		this.__server_sender = this._auto_destroy(new BetaJS.Channels.SenderMultiplexer(sender, "server"));
		this.__client_receiver = this._auto_destroy(new BetaJS.Channels.ReceiverMultiplexer(receiver, "server"));
		this.__server_receiver = this._auto_destroy(new BetaJS.Channels.ReceiverMultiplexer(receiver, "client"));
		this.client = this._auto_destroy(new BetaJS.RMI.Client(this.__client_sender, this.__client_receiver));
		this.server = this._auto_destroy(new BetaJS.RMI.Server(this.__server_sender, this.__server_receiver));
	},	
	
	acquire: function (class_type, instance_name) {
		return this.client.acquire(class_type, instance_name);
	},
	
	release: function (instance) {
		this.client.release(instance);
	},

	registerInstance: function (instance, options) {
		return this.server.registerInstance(instance, options);
	},
	
	unregisterInstance: function (instance) {
		this.server.unregisterInstance(instance);
	}

});

BetaJS.Structures = {};

BetaJS.Structures.AvlTree = {

	empty : function() {
		return null;
	},

	singleton : function(data) {
		return {
			data : data,
			left : null,
			right : null,
			height : 1
		};
	},

	min : function(root) {
		return root.left ? this.min(root.left) : root.data;
	},

	max : function(root) {
		return root.right ? this.max(root.right) : root.data;
	},

	height : function(node) {
		return node ? node.height : 0;
	},

	height_join : function(left, right) {
		return 1 + Math.max(this.height(left), this.height(right));
	},

	create : function(data, left, right) {
		return {
			data : data,
			left : left,
			right : right,
			height : this.height_join(left, right)
		};
	},

	balance : function(data, left, right) {
		if (this.height(left) > this.height(right) + 2) {
			if (this.height(left.left) >= this.height(left.right))
				return this.create(left.data, left.left, this.create(data,
						left.right, right));
			else
				return this.create(left.right.data, this.create(left.data,
						left.left, left.right.left), this.create(data,
						left.right.right, right));
		} else if (this.height(right) > this.height(left) + 2) {
			if (this.height(right.right) >= this.height(right.left))
				return this.create(right.data, this.create(data, left,
						right.left), right.right);
			else
				return this.create(right.left.data, this.create(data, left,
						right.left.left), this.create(right.data,
						right.left.right, right.right));
		} else
			return this.create(data, left, right);
	},

	__add_left : function(data, left) {
		return left ? this.balance(left.data, this.__add_left(data, left.left),
				left.right) : this.singleton(data);
	},

	__add_right : function(data, right) {
		return right ? this.balance(right.data, right.data, this.__add_right(
				data, right.right)) : this.singleton(data);
	},

	join : function(data, left, right) {
		if (!left)
			return this.__add_left(data, right);
		else if (!right)
			return this.__add_right(data, left);
		else if (this.height(left) > this.height(right) + 2)
			return this.balance(left.data, left.left, this.join(data,
					left.right, right));
		else if (this.height(right) > this.height(left) + 2)
			return this.balance(right.data, this.join(data, left, right.left),
					right.right);
		else
			return this.create(data, left, right);
	},

	take_min : function(root) {
		if (!root.left)
			return [ root.data, root.right ];
		var result = this.take_min(root.left);
		return [ result[0], this.join(root.data, result[1], root.right) ];
	},

	take_max : function(root) {
		if (!root.right)
			return [ root.data, root.left ];
		var result = this.take_max(root.right);
		return [ result[0], this.join(root.data, root.left, result[1]) ];
	},

	rereoot : function(left, right) {
		if (!left || !right)
			return left || right;
		if (this.height(left) > this.height(right)) {
			var max = this.take_max(left);
			return this.join(max[0], max[1], right);
		}
		var min = this.take_min(right);
		return this.join(min[0], left, min[1]);

	},

	take_min_iter : function(root) {
		if (!root)
			return null;
		if (!root.left)
			return [ root.data, root.left ];
		return this.take_min_iter(this.create(root.left.data, root.left.left,
				this.create(root.data, root.left.right, root.right)));
	},

	take_max_iter : function(root) {
		if (!root)
			return null;
		if (!root.right)
			return [ root.data, root.right ];
		return this.take_max_iter(this.create(root.right.data, this.create(
				root.data, root.left, root.right.left), root.right.right));
	}

};

BetaJS.Structures.TreeMap = {

	empty : function(compare) {
		return {
			root : null,
			length : 0,
			compare : compare || function(x, y) {
				return x > y ? 1 : x < y ? -1 : 0;
			}
		};
	},

	is_empty : function(t) {
		return !t.root;
	},

	length : function(t) {
		return t.length;
	},

	__add : function(key, value, t, node) {
		var kv = {
			key : key,
			value : value
		};
		if (!node) {
			t.length++;
			return BetaJS.Data.AvlTree.singleton(kv);
		}
		var c = t.compare(key, node.data.key);
		if (c === 0) {
			node.data = kv;
			return node;
		} else if (c < 0)
			return BetaJS.Data.AvlTree.balance(node.data, this.__add(key,
					value, t, node.left), node.right);
		else
			return BetaJS.Data.AvlTree.balance(node.data, node.left, this.__add(key, value, t, node.right));
	},

	add : function(key, value, t) {
		t.root = this.__add(key, value, t, t.root);
		return t;
	},

	singleton : function(key, value, compare) {
		return this.add(key, value, this.empty(compare));
	},

	__find : function(key, t, root) {
		if (!root)
			return null;
		var c = t.compare(key, root.data.key);
		return c === 0 ? root.data.value : this.__find(key, t, c < 0 ? root.left : root.right);
	},

	find : function(key, t) {
		return this.__find(key, t, t.root);
	},

	__iterate : function(t, node, callback, context) {
		if (!node)
			return true;
		return this.__iterate(t, node.left, callback, context) && (callback.call(context, node.data.key, node.data.value) !== false) && this.__iterate(t, node.right, callback, context);
	},

	iterate : function(t, callback, context) {
		this.__iterate(t, t.root, callback, context);
	},

	__iterate_from : function(key, t, node, callback, context) {
		if (!node)
			return true;
		var c = t.compare(key, node.data.key);
		if (c < 0 && !this.__iterate_from(key, t, node.left, callback, context))
			return false;
		if (c <= 0 && callback.call(context, node.data.key, node.data.value) === false)
			return false;
		return this.__iterate_from(key, t, node.right, callback, context);
	},

	iterate_from : function(key, t, callback, context) {
		this.__iterate_from(key, t, t.root, callback, context);
	},

	iterate_range : function(from_key, to_key, t, callback, context) {
		this.iterate_from(from_key, t, function(key, value) {
			return t.compare(key, to_key) <= 0 && callback.call(context, key, value) !== false;
		}, this);
	}

};

/*
 * <ul>
 *  <li>uri: target uri</li>
 *  <li>method: get, post, ...</li>
 *  <li>data: data as JSON to be passed with the request</li>
 *  <li>success_callback(data): will be called when request was successful</li>
 *  <li>failure_callback(status_code, status_text, data): will be called when request was not successful</li>
 *  <li>complete_callback(): will be called when the request has been made</li>
 * </ul>
 * 
 */
BetaJS.Class.extend("BetaJS.Net.AbstractAjax", {
	
	constructor: function (options) {
		this._inherited(BetaJS.Net.AbstractAjax, "constructor");
		this.__options = BetaJS.Objs.extend({
			"method": "GET",
			"data": {}
		}, options);
	},
	
	syncCall: function (options) {
		try {
			return this._syncCall(BetaJS.Objs.extend(BetaJS.Objs.clone(this.__options, 1), options));
		} catch (e) {
			e = BetaJS.Exceptions.ensure(e);
			e.assert(BetaJS.Net.AjaxException);
			throw e;
		}
	},
	
	asyncCall: function (options, callbacks) {
		this._asyncCall(BetaJS.Objs.extend(BetaJS.Objs.clone(this.__options, 1), options), callbacks);
	},
	
	call: function (options, callbacks) {
		return callbacks ? this.asyncCall(options, callbacks) : this.syncCall(options);
	},
	
	_syncCall: function (options) {},
	
	_asyncCall: function (options, callbacks) {}
	
});


BetaJS.Exceptions.Exception.extend("BetaJS.Net.AjaxException", {
	
	constructor: function (status_code, status_text, data) {
		this._inherited(BetaJS.Net.AjaxException, "constructor", status_code + ": " + status_text);
		this.__status_code = status_code;
		this.__status_text = status_text;
		this.__data = data;
	},
	
	status_code: function () {
		return this.__status_code;
	},
	
	status_text: function () {
		return this.__status_text;
	},
	
	data: function () {
		return this.__data;
	},
	
	json: function () {
		var obj = this._inherited(BetaJS.Net.AjaxException, "json");
		obj.data = this.data();
		return obj;
	}
	
});

BetaJS.Channels.Sender.extend("BetaJS.Net.SocketSenderChannel", {
	
	constructor: function (socket, message, ready) {
		this._inherited(BetaJS.Net.SocketSenderChannel, "constructor");
		this.__socket = socket;
		this.__message = message;
		this.__ready = BetaJS.Types.is_defined(ready) ? ready : true;
		this.__cache = [];
	},
	
	_send: function (message, data) {
		if (this.__ready) {
			this.__socket.emit(this.__message, {
				message: message,
				data: data
			});
		} else {
			this.__cache.push({
				message: message,
				data: data
			});
		}
	},
	
	ready: function () {
		this.__ready = true;
		for (var i = 0; i < this.__cache.length; ++i)
			this._send(this.__cache[i].message, this.__cache[i].data);
		this.__cache = [];
	},
	
	unready: function () {
	    this.__ready = false;
	},
	
	socket: function () {
	    if (arguments.length > 0)
	        this.__socket = arguments[0];
	    return this.__socket;
	}
	
});


BetaJS.Channels.Receiver.extend("BetaJS.Net.SocketReceiverChannel", {
	
	constructor: function (socket, message) {
		this._inherited(BetaJS.Net.SocketReceiverChannel, "constructor");
		this.__message = message;
		this.socket(socket);
	},
	
    socket: function () {
        if (arguments.length > 0) {
            this.__socket = arguments[0];
            if (this.__socket) {
                var self = this;
                this.__socket.on(this.__message, function (data) {
                    self._receive(data.message, data.data);
                });
            }
        }
        return this.__socket;
    }
	
});

BetaJS.Net = BetaJS.Net || {};

BetaJS.Net.HttpHeader = {
	
	HTTP_STATUS_OK : 200,
	HTTP_STATUS_CREATED : 201,
	HTTP_STATUS_PAYMENT_REQUIRED : 402,
	HTTP_STATUS_FORBIDDEN : 403,
	HTTP_STATUS_NOT_FOUND : 404,
	HTTP_STATUS_PRECONDITION_FAILED : 412,
	HTTP_STATUS_INTERNAL_SERVER_ERROR : 500,
	
	format: function (code, prepend_code) {
		var ret = "";
		if (code == this.HTTP_STATUS_OK)
			ret = "OK";
		else if (code == this.HTTP_STATUS_CREATED)
			ret = "Created";
		else if (code == this.HTTP_STATUS_PAYMENT_REQUIRED)
			ret = "Payment Required";
		else if (code == this.HTTP_STATUS_FORBIDDEN)
			ret = "Forbidden";
		else if (code == this.HTTP_STATUS_NOT_FOUND)
			ret = "Not found";
		else if (code == this.HTTP_STATUS_PRECONDITION_FAILED)
			ret = "Precondition Failed";
		else if (code == this.HTTP_STATUS_INTERNAL_SERVER_ERROR)
			ret = "Internal Server Error";
		else
			ret = "Other Error";
		return prepend_code ? (code + " " + ret) : ret;
	}
	
};
BetaJS.Net = BetaJS.Net || {};

BetaJS.Net.Uri = {
	
	build: function (obj) {
		var s = "";
		if (obj.username)
			s += obj.username + ":";
		if (obj.password)
			s += obj.password + "@";
		s += obj.server;
		if (obj.port)
			s += ":" + obj.port;
		if (obj.path)
			s += "/" + obj.path;
		return s;
	},
	
	encodeUriParams: function (arr, prefix) {
		prefix = prefix || "";
		var res = [];
		BetaJS.Objs.iter(arr, function (value, key) {
			if (BetaJS.Types.is_object(value))
				res = res.concat(this.encodeUriParams(value, prefix + key + "_"));
			else
				res.push(prefix + key + "=" + encodeURI(value));
		}, this);
		return res.join("&");
	},
	
	appendUriParams: function (uri, arr, prefix) {
		return BetaJS.Types.is_empty(arr) ? uri : (uri + (uri.indexOf("?") != -1 ? "&" : "?") + this.encodeUriParams(arr, prefix));
	},
	
	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License

	parse: function (str, strict) {
		var parser = strict ? this.__parse_strict_regex : this.__parse_loose_regex;
		var m = parser.exec(str);
		var uri = {};
		for (var i = 0; i < this.__parse_key.length; ++i)
			uri[this.__parse_key[i]] = m[i] || "";
		uri.queryKey = {};
		uri[this.__parse_key[12]].replace(this.__parse_key_parser, function ($0, $1, $2) {
			if ($1) uri.queryKey[$1] = $2;
		});

		return uri;
	},
	
	__parse_strict_regex: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
	__parse_loose_regex: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
	__parse_key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	__parse_key_parser: /(?:^|&)([^&=]*)=?([^&]*)/g

};