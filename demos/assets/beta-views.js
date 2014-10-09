/*!
betajs-views - v1.0.0 - 2014-10-02
Copyright (c) Oliver Friedmann,Victor Lingenthal
MIT Software License.
*/
BetaJS.$ = "jQuery" in window ? window.jQuery : null;

BetaJS.Exceptions.Exception.extend("BetaJS.Views.ViewException");

/** @class */
BetaJS.Views.View = BetaJS.Class.extend("BetaJS.Views.View", [
    BetaJS.Events.EventsMixin,                                            
	BetaJS.Events.ListenMixin,
	BetaJS.Properties.PropertiesMixin,
	BetaJS.Classes.ModuleMixin,
	/** @lends BetaJS.Views.View.prototype */
	{
		
    /** Container html element of the view as jquery object
     */
	$el: null,
	
    
    /** Returns all templates to be pre-loaded.
     * <p>It should return an associative array of templates. The keys are user-defined identifiers, the values are either the template strings or a jquery object containing the template.</p>
     * @return associative array of templates
     * @example
     * return {
     * 	"default": BetaJS.Templates.Cached["my-view-template"],
     *  "inner": $("#inner-template"),
     *  "item": '< p >{%= item.get("text") %}< /p >'
     * }
     */
	_templates: function () {
		return {};
	},
	
    /** Returns all dynamics to be pre-loaded.
     * <p>It should return an associative array of dynamics. The keys are user-defined identifiers, the values are either the template strings or a jquery object containing the template.</p>
     * @return associative array of dynamics
     */
	_dynamics: function () {
		// {"name": "string" or jquery selector}
		return {};
	},
	
	/** Returns all events that the view is listening to.
	 * <p>It should return an associative array of event bindings. The keys are strings composed of the event name and the jquery selector that specifies to which elements the event should be bound to. The value is the name of the method that should be called when the event is fired.</p>
	 * <p>Note: It is also possible to return an array of associative arrays. You should do that if you want to bind more than one method to a single key.</p> 
	 * @return associative array of events
	 * @example
	 * return {
	 * 	"click #button": "_clickButton",
	 *  "change #input": "_inputChanged",
	 *  "blur": "_containerElementBlur"
	 * }  
	 */
	_events: function () {
		// [{"event selector": "function"}]
		return [];
	},
	
	_global_events: function () {
		// [{"event selector": "function"}]
		return [];
	},

	/** Returns all default css classes that should be used for this view. 
	 * <p>They can be overwritten by the parent view or by options.
	 * The keys are internal identifiers that the view uses to lookup the css classed that are to be used.
	 * The values are the actual names of the css classes.</p>
	 * @return associative array of css classes
	 * @example
	 * return {
	 * 	"main-class": "default-main-class",
	 *  "item-class": "default-item-class"
	 * }
	 */
	_css: function () {
		// {"identifier": "css-class"}
		return {};
	},
	
	/** Returns css class by identifier.
	 * <p>The return strategy has the following priorities: options, parent, defaults.</p>
	 * @param ident identifier of class
	 * @example
	 * this.css("main_class")
	 */
	css: function (ident) {
		if (this.__css[ident])
			return this.__css[ident];
		var css = null;
		if (this.__parent) {
			css = this.__parent.css(ident);
			if (css && css != ident)
				return css;
		}
		css = this._css();
		if (css[ident])
			return css[ident];
		return ident;
	},
	
	/** Is called by the view when the view needs to be rendered.
	 * <p>By default, the function renders the template or dynamic named "default" and passes the default arguments to it.</p>
	 * 
	 */
	_render: function () {
		if (this.__html)
			this.$el.html(this.__html);
		else if (this.__templates["default"])
			this.$el.html(this.evaluateTemplate("default", {}));
		else if (this.__dynamics["default"])
			this.evaluateDynamics("default", this.$el, {}, {name: "default"});
	},
	
	/** Returns a template associated with the view
	 * @param key identifier of template
	 * @return template object
	 */
	templates: function (key) {
		return key in this.__templates ? this.__templates[key] : null;
	},
	
	/** Returns a dynamic associated with the view
	 * @param key identifier of dynamic
	 * @return template object
	 */
	dynamics: function (key) {
		return key in this.__dynamics ? this.__dynamics[key] : null;
	},

	/** Support Routines for Templates and Dynamics
	 * <ul>
	 *  <li>supp.css(key): Returns css class associated with key</li>
	 *  <li>supp.attrs(obj): Returns html code for all html attributes specified by obj</li>
	 *  <li>supp.styles(obj): Returns html code for all styles specified by obj</li>
	 *  <li>supp.selector(name): Returns html code for data-selector='name'</li>
	 * </ul>
	 * @example
	 * < label class="{%= supp.css("main-class") %}" {%= supp.attrs({id: "test", title: "foo"}) %} {%= supp.selector("bar") %} > < /label >
	 * results in
	 * < label class="default-main-class" id="test" title="foo" data-selector="bar" > < /label >
	 */
	_supp: function () {
		return {
			__context: this,
			css: function (key) {
				return this.__context.css(key);
			},
			attrs: function (obj) {
				var s = "";
				for (var key in obj)
					s += (!obj[key] ? key : (key + "='" + obj[key] + "'")) + " ";
				return s;
			},
			styles: function (obj) {
				var s = "";
				for (var key in obj)
					s += (key + ":" + obj[key] + "") + ";";
				return s;
			},
			selector: function (name) {
				return "data-selector='" + name + "' ";
			},
			view_id: this.cid()
		};
	},
	
	/** Returns all arguments that are passed to every template by default.
	 * <p>By default, this function returns the support routines supp and all properties that have been set via this.set or that have been set via this._setOptionProperty</p>
	 * @return associative array of template arguments  
	 */
	templateArguments: function () {
		var args = this.getAll();
		args.supp = this._supp();
		return args;
	},
	
	/** Evaluates a template with used-defined arguments.
	 * 
	 * @param key identifier of template 
	 * @param args arguments to be given to the template (optional)
	 * @return html string of evaluated template
	 */
	evaluateTemplate: function (key, args) {
		args = args || {};
		return this.__templates[key].evaluate(BetaJS.Objs.extend(args, this.templateArguments()));
	},
	
	/** Evaluates a dynamic and binds it to a given element with used-defined arguments and options.
	 * 
	 * @param key identifier of dynamic
	 * @param element jquery element to which the dynamic should be bound to 
	 * @param args arguments to be given to the dynamic (optional)
	 * @param options options to be passed to the dynamic (name is the most important one, see documentation)
	 * @return dynamic instance
	 */
	evaluateDynamics: function (key, element, args, options) {
		return this.__dynamics[key].renderInstance(element, BetaJS.Objs.extend(options || {}, {args: args || {}}));
	},

	/** Sets a private variable from an option array
	 * @param options option associative array
	 * @param key name of option
	 * @param value default value of option if not given
	 * @param prefix (optional) per default is "__"
	 */
	_setOption: function (options, key, value, prefix) {
		prefix = prefix ? prefix : "__";
		this[prefix + key] = (options && key in options) && (BetaJS.Types.is_defined(options[key])) ? options[key] : value;
	},
	
	/** Sets a private typed variable from an option array
	 * @param options option associative array
	 * @param key name of option
	 * @param value default value of option if not given
	 * @param type param type
	 * @param prefix (optional) per default is "__"
	 */
	_setOptionTyped: function (options, key, value, type, prefix) {
		this._setOption(options, key, this.cls._parseType(value, type), prefix);
	},

	/** Sets property variable (that will be passed to templates and dynamics by default) from an option array
	 * @param options option associative array
	 * @param key name of option
	 * @param value default value of option if not given
	 */
	_setOptionProperty: function (options, key, value) {
		this.set(key, (options && key in options) && (BetaJS.Types.is_defined(options[key])) ? options[key] : value);
	},
	
	/** Sets typed property variable (that will be passed to templates and dynamics by default) from an option array
	 * @param options option associative array
	 * @param key name of option
	 * @param value default value of option if not given
	 * @param type param type
	 */
	_setOptionPropertyTyped: function (options, key, value, typed) {
		this._setOptionProperty(options, key, this.cls._parseType(value, type));
	},
	
	/** Creates a new view with options
	 * <ul>
	 *  <li>el: the element to which the view should bind to; either a jquery selector or a jquery element</li> 
	 *  <li>visible: (default true) should the view be visible initially</li>
	 *  <li>html: (default null) string that should be used as default rendering</li>
	 *  <li>events: (default []) events that should be used additionally</li>
	 *  <li>attributes: (default {}) attributes that should be attached to container</li>
	 *  <li>el_classes: (default []) css classes that should be attached to container</li>
	 *  <li>el_styles: (default {}) styles that should be attached to container</li>
	 *  <li>children_classes: (default []) css classes that should be attached to all direct children</li>
	 *  <li>children_styles: (default {}) styles that should be attached to all direct children</li>
	 *  <li>css: (default {}) css classes that should be overwritten</li>
	 *  <li>templates: (default {}) templates that should be overwritten</li>
	 *  <li>dynamics: (default: {}) dynamics that should be overwritten</li>
	 *  <li>properties: (default: {}) properties that should be added (and passed to templates and dynamics)</li>
	 *  <li>invalidate_on_change: (default: false) rerender view on property change</li>
	 *  <li>invalidate_on_show: (default: false) invalidate view on show</li>
	 *  <li>append_to_el: (default: false) append to el instead of replacing content</li>
	 * </ul>
	 * @param options options
	 */
	constructor: function (options) {
		options = options || {};
		this._inherited(BetaJS.Views.View, "constructor");
		this._setOption(options, "el", null);
		this._setOption(options, "visible", true);
		this._setOption(options, "html", null);
		this._setOption(options, "events", []);
		this._setOption(options, "attributes", {});
		this._setOption(options, "invalidate_on_show", false);
		this._setOption(options, "append_to_el", false);
		this.__old_attributes = {};
		this._setOption(options, "el_classes", []);
		if (BetaJS.Types.is_string(this.__el_classes))
			this.__el_classes = this.__el_classes.split(" ");
		this.__added_el_classes = [];
		this._setOption(options, "el_styles", {});
		this._setOption(options, "children_styles", {});
		this._setOption(options, "children_classes", []);
		if (BetaJS.Types.is_string(this.__children_classes))
			this.__children_classes = this.__children_classes.split(" ");
		this._setOption(options, "invalidate_on_change", false);
		this.__old_el_styles = {};
		this._setOption(options, "css", {});
		this.__parent = null;
		this.__children = {};
		this.__active = false;
		this.$el = null;
		var events = BetaJS.Types.is_function(this._events) ? this._events() : this._events;
		if (!BetaJS.Types.is_array(events))
			events = [events]; 
		this.__events = events.concat(this.__events);

		var global_events = BetaJS.Types.is_function(this._global_events) ? this._global_events() : this._global_events;
		if (!BetaJS.Types.is_array(global_events))
			global_events = [global_events]; 
		this.__global_events = global_events;

		var templates = BetaJS.Objs.extend(BetaJS.Types.is_function(this._templates) ? this._templates() : this._templates, options["templates"] || {});
		if ("template" in options)
			templates["default"] = options["template"];
		this.__templates = {};
		var key = null;
		for (key in templates) {
			if (!templates[key])
				throw new BetaJS.Views.ViewException("Could not find template '" + key + "' in View '" + this.cls.classname + "'");
			this.__templates[key] = new BetaJS.Templates.Template(BetaJS.Types.is_string(templates[key]) ? templates[key] : templates[key].html());
		}

		var dynamics = BetaJS.Objs.extend(BetaJS.Types.is_function(this._dynamics) ? this._dynamics() : this._dynamics, options["dynamics"] || {});
		if ("dynamic" in options)
			dynamics["default"] = options["dynamic"];
		this.__dynamics = {};
		for (key in dynamics)
			this.__dynamics[key] = new BetaJS.Views.DynamicTemplate(this, BetaJS.Types.is_string(dynamics[key]) ? dynamics[key] : dynamics[key].html());

		this.setAll(options["properties"] || {});
		if (this.__invalidate_on_change)
			this.on("change", function () {
				this.invalidate();
			}, this);

		this.__modules = {};
		BetaJS.Objs.iter(options.modules || [], this.add_module, this);

		this._notify("created", options);
		this.ns = {};
		var domain = this._domain();
		var domain_defaults = this._domain_defaults();
		var view_name = null;
		if (!BetaJS.Types.is_empty(domain)) {
			var viewlist = [];
			for (view_name in domain)
				viewlist.push({
					name: view_name,
					data: domain[view_name]
				});
			viewlist = BetaJS.Sort.dependency_sort(viewlist, function (data) {
				return data.name;
			}, function (data) {
				return data.data.before || [];
			}, function (data) {
				var after = data.data.after || [];
				if (data.data.parent)
					after.push(data.data.parent);
				return after;
			});
			for (var i = 0; i < viewlist.length; ++i) {
				view_name = viewlist[i].name;
				var record = viewlist[i].data;
				var record_options = record.options || {};
				if (BetaJS.Types.is_function(record_options))
					record_options = record_options.apply(this, [this]);
				var default_options = domain_defaults[record.type] || {};
				if (BetaJS.Types.is_function(default_options))
					default_options = default_options.apply(this, [this]);
				record_options = BetaJS.Objs.tree_merge(default_options, record_options);
				if (record.type in BetaJS.Views)
					record.type = BetaJS.Views[record.type];
				if (BetaJS.Types.is_string(record.type))
					record.type = BetaJS.Scopes.resolve(record.type);
				var view = new record.type(record_options);
				this.ns[view_name] = view;
				var parent_options = record.parent_options || {};
				var parent = this;
				if (record.parent)
					parent = BetaJS.Scopes.resolve(record.parent, this.ns);
				if (record.method)
					record.method(parent, view);
				else
					parent.addChild(view, parent_options);
				view.domain = this;
				var event = null;
				for (event in record.events || {})
					view.on(event, record.events[event], view);
				for (event in record.listeners || {})
					this.on(event, record.listeners[event], view);
			}		
		}
	},
	
	_domain: function () {
		return {};
	},
	
	_domain_defaults: function () {
		return {};
	},

	/** Returns whether this view is active (i.e. bound and rendered) 
	 * @return active  
	 */
	isActive: function () {
		return this.__active;
	},
	
	/** Activates view and all added sub views
	 *  
	 */
	activate: function () {
		if (this.isActive())
			return this;
		if (this.__parent && !this.__parent.isActive())
			return null;
		if (this.__parent)
			this.$el = !this.__el ? this.__parent.$el : this.__parent.$(this.__el);
		else
			this.$el = BetaJS.$(this.__el);
		if (this.$el.size() === 0)
			this.$el = null;
		if (!this.$el)
			return null;
		if (this.__append_to_el) {
			this.$el.append("<div data-view-id='" + this.cid() + "'></div>");
			this.$el = this.$el.find("[data-view-id='" + this.cid() + "']");
		}
		this.__old_attributes = {};
		var key = null;
		var old_value = null;
		for (key in this.__attributes) {
			old_value = this.$el.attr(key);
			if (BetaJS.Types.is_defined(old_value))
				this.__old_attributes[key] = old_value;
			else
				this.__old_attributes[key] = null;
			this.$el.attr(key, this.__attributes[key]);
		}
		this.__added_el_classes = [];
		var new_el_classes = this._el_classes().concat(this.__el_classes);
		for (var i = 0; i < new_el_classes.length; ++i) {
			if (!this.$el.hasClass(new_el_classes[i])) {
				this.$el.addClass(new_el_classes[i]);
				this.__added_el_classes.push(new_el_classes[i]);
			}
		}
		this.__old_el_styles = {};
		var new_el_styles = BetaJS.Objs.extend(this._el_styles(), this.__el_styles);
		for (key in new_el_styles)  {
			old_value = this.$el.css(key);
			if (BetaJS.Types.is_defined(old_value))
				this.__old_el_styles[key] = old_value;
			else
				this.__old_el_styles[key] = null;
			this.$el.css(key, new_el_styles[key]);
		}
		this.__bind();
		if (!this.__visible)
			this.$el.css("display", this.__visible ? "" : "none");
		this.__active = true;
		this.__render();
		this._notify("preactivate");
		BetaJS.Objs.iter(this.__children, function (child) {
			child.view.activate();
		});
		this._notify("activate");
		this.trigger("activate");
		if (this.__visible)
			this.trigger("show");
		this.trigger("visibility", this.__visible);
		this.trigger("resize");
		return this;
	},
	
	/** Deactivates view and all added sub views
	 * 
	 */
	deactivate: function () {
		if (!this.isActive())
			return false;
		if (this.__visible)
			this.trigger("hide");
		this.trigger("visibility", false);
		this._notify("deactivate");
		this.trigger("deactivate");
		BetaJS.Objs.iter(this.__children, function (child) {
			child.view.deactivate();
		});
		this.__active = false;
		BetaJS.Objs.iter(this.__dynamics, function (dynamic) {
			dynamic.reset();
		}, this);
		this.__unbind();
		this.$el.html("");
		var key = null;
		for (key in this.__old_attributes) 
			this.$el.attr(key, this.__old_attributes[key]);
		for (var i = 0; i < this.__added_el_classes.length; ++i)
			this.$el.removeClass(this.__added_el_classes[i]);
		for (key in this.__old_el_styles) 
			this.$el.css(key, this.__old_el_styles[key]);
		if (this.__append_to_el)
			this.$el.remove();
		this.$el = null;
		return true;
	},
	
	/** Returns an associate array of styles that should be attached to the element
	 * @return styles
	 * @example
	 * return {"color": "red"};
	 * or
	 * var styles = {};
	 * styles.color = "red";
	 * return styles; 
	 */
	_el_styles: function () {
		return {};
	},
	
	/** Returns an array of classes that should be attached to the element
	 * @return classes
	 * @example
	 * return ["test-css-class"]
	 */
	_el_classes: function () {
		return [];
	},
	
	/** Finds an element within the container of the view
	 * @param selector a jquery selector
	 * @return the jquery element(s) it matched 
	 */
	$: function(selector) {
		return this.$el.find(selector);
	},
	
	/** Finds an element within a subelement that matches a set of data attributes
	 * 
	 * @param selectors associative array, e.g. {"selector": "container", "view-id": this.cid()}
	 * @param elem (optional, default is $el) the element we search in
	 * @return the jquery element(s) it matched
	 */
	$data: function(selectors, elem) {
		if (!elem)
			elem = this.$el;
		var s = "";
		for (var key in selectors)
			s += "[data-" + key + "='" + selectors[key] + "']";
		return elem.find(s);
	},
	
	/** Destroys the view
	 * 
	 */
	destroy: function () {
		this.deactivate();
		this.setParent(null);
		var c = this.__children;
		this.__children = {};		
		BetaJS.Objs.iter(c, function (child) {
			child.view.destroy();
		});
		this.__children = {};
		BetaJS.Objs.iter(this.__dynamics, function (dynamic) {
			dynamic.destroy();
		}, this);
		BetaJS.Objs.iter(this.__templates, function (template) {
			template.destroy();
		}, this);
		this.trigger("destroy");
		this._inherited(BetaJS.Views.View, "destroy");
	},
	
	/** Makes the view visible
	 * 
	 */
	show: function () {
		this.setVisibility(true);
	},
	
	/** Makes the view invisible
	 * 
	 */
	hide: function () {
		this.setVisibility(false);
	},
	
	isVisible: function () {
		return this.__visible;
	},
	
	/** Sets the visibility of the view
	 * @param visible visibility
	 */
	setVisibility: function (visible) {
		if (visible == this.__visible)
			return;
		this.__visible = visible;
		if (this.isActive()) {
			this.$el.css("display", this.__visible ? "" : "none");
			if (this.__visible) {
				this.trigger("resize");
				if (this.__invalidate_on_show)
					this.invalidate();	
			}
			this.trigger(visible ? "show" : "hide");
			this.trigger("visibility", visible);		
		}
		if (this.__parent)
			this.__parent.updateChildVisibility(this);	
	},
	
	updateChildVisibility: function (child) {		
	},
	
	toggle: function () {
		this.setVisibility(!this.isVisible());
	},
	
	__bind: function () {
		var self = this;
		this.__unbind();
		BetaJS.Objs.iter(this.__events, function (obj) {
			BetaJS.Objs.iter(obj, function (value, key) {
				var func = BetaJS.Types.is_function(value) ? value : self[value];
		        var match = key.match(BetaJS.Views.BIND_EVENT_SPLITTER);
		        var event = match[1];
		        var selector = match[2];
		        event = event + ".events" + self.cid();
		        var method = BetaJS.Functions.as_method(func, self);
		        if (selector === '')
		        	self.$el.on(event, method);
		        else
		        	self.$el.on(event, selector, method);
			});
		});
		BetaJS.Objs.iter(this.__global_events, function (obj) {
			BetaJS.Objs.iter(obj, function (value, key) {
				var func = BetaJS.Types.is_function(value) ? value : self[value];
		        var match = key.match(BetaJS.Views.BIND_EVENT_SPLITTER);
		        var event = match[1];
		        var selector = match[2];
		        event = event + ".events" + self.cid();
		        var method = BetaJS.Functions.as_method(func, self);
		        if (selector === '')
		        	BetaJS.$(document).on(event, method);
		        else
		        	BetaJS.$(document).on(event, selector, method);
			});
		});
	},
	
	__unbind: function () {
		this.$el.off('.events' + this.cid());
		BetaJS.$(document).off('.events' + this.cid());
	},
	
	__render: function () {
		if (!this.isActive())
			return;
		this._render();
		var q = this.$el.children();
		if (!BetaJS.Types.is_empty(this.__children_styles)) {
			for (var key in this.__children_styles)
				q.css(key, this.__children_styles[key]);
		}
		BetaJS.Objs.iter(this.__children_classes, function (cls) {
			q.addClass(cls);	
		});
		this.trigger("render");
	},
	
	/** Manually triggers rerendering of the view
	 * 
	 */
	invalidate: function () {
		if (!this.isActive())
			return;
		BetaJS.Objs.iter(this.__children, function (child) {
			child.view.deactivate();
		});
		BetaJS.Objs.iter(this.__dynamics, function (dynamic) {
			dynamic.reset();
		}, this);
		this.__render();
		BetaJS.Objs.iter(this.__children, function (child) {
			child.view.activate();
		});
	},
	
	/** Sets the container element of the view
	 * @param el new container element
 	 */
	setEl: function (el) {
		if (this.isActive()) {
			this.deactivate();
			this.__el = el;
			this.activate();
		}
		else
			this.__el = el;
	},
	
	/** Returns the parent view
	 * @return parent view
	 */
	getParent: function () {
		return this.__parent;
	},
	
	/** Checks whether a view has been added as a child
	 * 
 	 * @param child view in question
 	 * @return true if view has been added
	 */
	hasChild: function (child) {
		return child && child.cid() in this.__children;
	},
	
	/** Changes the parent view
	 * @param parent the new parent
	 */
	setParent: function (parent) {
		if (parent == this.__parent)
			return;
		this.deactivate();
		if (this.__parent) {
			this._unbindParent(this.__parent);
			var old_parent = this.__parent;
			this.__parent.off(null, null, this);
			this.__parent = null;
			old_parent.removeChild(this);
		}
		if (parent) {
			this.__parent = parent;
			parent.addChild(this);
			this._bindParent(parent);
			if (parent.isActive())
				this.activate();
		}
	},
	
	_bindParent: function () {		
	},

	_unbindParent: function () {		
	},
	
	/** Returns all child views
	 * @return array of child views 
	 */
	children: function () {
		var children = {};
		BetaJS.Objs.iter(this.__children, function (child, key) {
			children[key] = child.view;
		}, this);
		return children;
	},
	
	childOptions: function (child) {
		return this.__children[child.cid()].options;
	},
	
	/** Adds an array of child views
	 * 
 	 * @param children array of views
	 */
	addChildren: function (children) {
		BetaJS.Objs.iter(children, function (child) {
			this.addChild(child);
		}, this);
	},

	/** Adds a child view
	 * 
 	 * @param child view
	 */	
	addChild: function (child, options) {
		if (!this.hasChild(child)) {
			options = options || {};
			this.__children[child.cid()] = {
				view: child,
				options: options
			};
			this._notify("addChild", child, options);
			child.setParent(this);
			if (this.isActive() && this.isVisible())
				this.trigger("resize");
			return child;
		}
		return null;
	},
	
	/** Removes an array of child views
	 * 
 	 * @param children array of views
	 */
	removeChildren: function (children) {
		BetaJS.Objs.iter(children, function (child) {
			this.removeChild(child);
		}, this);
	},
	
	/** Removes a child view
	 * 
 	 * @param child view
	 */	
	removeChild: function (child) {
		if (this.hasChild(child)) {
			delete this.__children[child.cid()];
			child.setParent(null);
			child.off(null, null, this);
			this._notify("removeChild", child);
			if (this.isActive() && this.isVisible())
				this.trigger("resize");
		}
	},
	
	/** Returns the width (excluding margin, border, and padding) of the view
	 * @return width
	 */
	width: function () {
		return this.$el.width();
	},
	
	/** Returns the inner width (excluding margin, border, but including padding) of the view
	 * @return inner width
	 */
	innerWidth: function () {
		return this.$el.innerWidth();
	},

	/** Returns the outer width (including margin, border, and padding) of the view
	 * @return outer width
	 */
	outerWidth: function () {
		return this.$el.outerWidth();
	},

	/** Returns the height (excluding margin, border, and padding) of the view
	 * @return height
	 */
	height: function () {
		return this.$el.height();
	},
	
	/** Returns the inner height (excluding margin, border, but including padding) of the view
	 * @return inner height
	 */
	innerHeight: function () {
		return this.$el.innerHeight();
	},

	/** Returns the outer height (including margin, border, and padding) of the view
	 * @return outer height
	 */
	outerHeight: function () {
		return this.$el.outerHeight();
	}
	
}], {
	
	parseType: function (value, type) {
		if (BetaJS.Types.is_defined(value) && BetaJS.Types.is_string(value)) {
			value = value.replace(/\s+/g, '');
			if (type == "int")
				return parseInt(value, 10);
			else if (type == "array")
				return value.split(",");
			else if (type == "bool")
				return value === "" || BetaJS.Types.parseBool(value);
			else if (type == "object" || type == "function")
				return BetaJS.Scopes.resolve(value);
		}
		return value;
	}

});

BetaJS.Views.BIND_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

BetaJS.Class.extend("BetaJS.Views.DynamicTemplate", {
	
	constructor: function (parent, template_string) {
		this._inherited(BetaJS.Views.DynamicTemplate, "constructor");
		this.__parent = parent;
		this.__template = new BetaJS.Templates.Template(template_string);
		this.__instances = {};
		this.__instances_by_name = {};
	},
	
	reset: function () {
		BetaJS.Objs.iter(this.__instances, function (instance) {
			this.removeInstance(instance);
		}, this);
	},
	
	destroy: function () {
		this.reset();
		this._inherited(BetaJS.Views.DynamicTemplate, "destroy");
	},
	
	renderInstance: function (binder, options) {
		options = options || {};
		if (options["name"])
			this.removeInstanceByName(options["name"]);
		var instance = new BetaJS.Views.DynamicTemplateInstance(this, binder, options);
		this.__instances[instance.cid()] = instance;
		if (options["name"])
			this.__instances_by_name[name] = instance;
	},
	
	removeInstanceByName: function (name) {
		if (name in this.__instances_by_name)
			this.removeInstance(this.__instances_by_name[name]);
	},
	
	removeInstance: function (instance) {
		delete this.__instances[instance.cid()];
		delete this.__instances_by_name[instance.name()];
		instance.destroy();
	},
	
	view: function () {
		return this.__parent;
	},
	
	template: function () {
		return this.__template;
	}
	
});

BetaJS.Class.extend("BetaJS.Views.DynamicTemplateInstance", [
	BetaJS.Events.ListenMixin, {
		
	__bind: {
		attr: function (attribute, variable) {
			return this.__context.__bind_attribute(attribute, variable);
		},
		attrs: function (attributes) {
			var s = "";
			for (attribute in attributes)
				s += this.attr(attribute, attributes[attribute]) + " ";
			return s;
		},
		value: function (variable) {
			return this.__context.__bind_value(variable);
		},
		inner: function (variable) {
			return this.__context.__bind_inner(variable);
		},
		css_if: function (css, variable) {
			return this.__context.__bind_css_if(css, variable, true);
		},
		css_if_not: function (css, variable) {
			return this.__context.__bind_css_if(css, variable, false);
		}
	},
	
	__new_element: function (base) {
		var id = BetaJS.Ids.uniqueId();
		this.__elements[id] = BetaJS.Objs.extend({
			id: id,
			$el: null
		}, base);
		return this.__elements[id];
	},
	
	__decompose_variable: function (variable) {
		var parts = variable.split(".");
		return {
			object: parts.length == 1 ? this.__parent.view() : this.__args[parts[0]],
			key: parts.length == 1 ? variable : parts[1]
		};
	},
	
	__get_variable: function (variable) {
		var dec = this.__decompose_variable(variable);
		return dec.object.get(dec.key);
	},
	
	__set_variable: function (variable, value) {
		var dec = this.__decompose_variable(variable);
		return dec.object.set(dec.key, value);
	},

	__update_element: function (element) {
		var value = this.__get_variable(element.variable);
		if (element.type == "inner")
			element.$el.html(value);
		else if (element.type == "value") {
			if (element.$el.val() != value)
				element.$el.val(value);
		} else if (element.type == "attribute")
			element.$el.attr(element.attribute, value);
		else if (element.type == "css") {
			if (!element.positive)
				value = !value;
			if (value)
				element.$el.addClass(this.__parent.view().css(element.css));
			else
				element.$el.removeClass(this.__parent.view().css(element.css));
		}
	},
	
	__prepare_element: function (element) {
		var self = this;
		element.$el = this.$el.find(element.selector);
		if (element.type == "inner" || element.type == "css")
			this.__update_element(element);
		else if (element.type == "value")
			element.$el.on("change input keyup paste", function () {
				self.__set_variable(element.variable, element.$el.val());
			});
	},
	
	__bind_attribute: function (attribute, variable) {
		var element = this.__new_element({
			type: "attribute",
			attribute: attribute,
			variable: variable
		});
		var selector = "data-bind-" + attribute + "='" + element.id + "'";
		element.selector = "[" + selector + "]";
		var dec = this.__decompose_variable(variable);
		this.listenOn(dec.object, "change:" + dec.key, function () { this.__update_element(element); }, this);
		return selector + " " + attribute + "='" + dec.object.get(dec.key) + "'";
	},
	
	__bind_css_if: function (css, variable, positive) {
		var element = this.__new_element({
			type: "css",
			css: css,
			variable: variable,
			positive: positive
		});
		var selector = "data-bind-css-" + css + "='" + element.id + "'";
		element.selector = "[" + selector + "]";
		var dec = this.__decompose_variable(variable);
		this.listenOn(dec.object, "change:" + dec.key, function () { this.__update_element(element); }, this);
		return selector;
	},
	
	__bind_value: function (variable) {
		var element = this.__new_element({
			type: "value",
			variable: variable
		});
		var selector = "data-bind-value='" + element.id + "'";
		element.selector = "[" + selector + "]";
		var dec = this.__decompose_variable(variable);
		this.listenOn(dec.object, "change:" + dec.key, function () { this.__update_element(element); }, this);
		return selector + " value='" + dec.object.get(dec.key) + "'";
	},

	__bind_inner: function (variable) {
		var element = this.__new_element({
			type: "inner",
			variable: variable
		});
		var selector = "data-bind-inner='" + element.id + "'";
		element.selector = "[" + selector + "]";
		var dec = this.__decompose_variable(variable);
		this.listenOn(dec.object, "change:" + dec.key, function () { this.__update_element(element); }, this);
		return selector;
	},

	constructor: function (parent, binder, options) {
		this._inherited(BetaJS.Views.DynamicTemplateInstance, "constructor");
		this.__elements = {};
		this.__inners = {};
		options = options || {};
		if (options["name"])
			this.__name = name;
		this.__parent = parent;
		this.$el = binder;
		this.__args = BetaJS.Objs.extend(options["args"] || {}, this.__parent.view().templateArguments());
		this.__args.bind = BetaJS.Objs.extend({__context: this}, this.__bind);
		this.$el.html(parent.template().evaluate(this.__args));
		BetaJS.Objs.iter(this.__elements, function (element) { this.__prepare_element(element); }, this);
	},
	
	destroy: function () {
		BetaJS.Objs.iter(this.__elements, function (element) {
			element.$el.off();
		}, this);
		this._inherited(BetaJS.Views.DynamicTemplateInstance, "destroy");
	},
	
	name: function () {
		return this.__name;
	}
	
}]);

BetaJS.Views.ActiveDom = {
	
	__prefix_alias: ["bjs", "betajs"],
	
	__view_alias: {},
	
	__views: {},
	
	__active: false,
	
	__on_add_element: function (event) {
		var element = BetaJS.$(event.target);
		if (!element)
			return;
		var done = false;
		if (element.prop("tagName")) {
			BetaJS.Objs.iter(BetaJS.Views.ActiveDom.__prefix_alias, function (alias) {
				if (element.prop("tagName").toLowerCase() == alias + "view") {
					BetaJS.Views.ActiveDom.__attach(element);
					done = true;
				}
			});
			BetaJS.Objs.iter(BetaJS.Views.ActiveDom.__view_alias, function (data, alias) {
				if (element.prop("tagName").toLowerCase() == alias) {
					BetaJS.Views.ActiveDom.__attach(element, data);
					done = true;
				}
			});
		}
		if (!done) {
			BetaJS.Objs.iter(BetaJS.Views.ActiveDom.__prefix_alias, function (alias) {
				element.find(alias + "view").each(function () {
					BetaJS.Views.ActiveDom.__attach(BetaJS.$(this));
				});
			});
			BetaJS.Objs.iter(BetaJS.Views.ActiveDom.__view_alias, function (data, alias) {
				element.find(alias).each(function () {
					BetaJS.Views.ActiveDom.__attach(BetaJS.$(this), data);
				});
			});
		}
	},
	
	__on_remove_element: function (event) {
		var element = BetaJS.$(event.target); 
		if (element.attr("data-active-dom-id") in BetaJS.Views.ActiveDom.__views)
			BetaJS.Views.ActiveDom.__views[element.attr("data-active-dom-id")].destroy();
		else {
			element.find("[data-active-dom-id]").each(function () {
				var el = BetaJS.$(this);
				if (el.attr("data-active-dom-id") in BetaJS.Views.ActiveDom.__views)
					BetaJS.Views.ActiveDom.__views[el.attr("data-active-dom-id")].destroy();
			});
		}
	},
	
	__attach: function (element, meta_attrs) {
		// Prevent double attachment
		if (element.attr("data-active-dom-element"))
			return;
		var process = function (key, value) {
			var i = 0;
			while (i < BetaJS.Views.ActiveDom.__prefix_alias.length) {
				var alias = BetaJS.Views.ActiveDom.__prefix_alias[i];
				if (BetaJS.Strings.starts_with(key, alias + "-")) {
					key = BetaJS.Strings.strip_start(key, alias + "-");
					if (BetaJS.Strings.starts_with(key, "child-")) {
						key = BetaJS.Strings.strip_start(key, "child-");
						dom_child_attrs[key] = value;
					} else if (key in meta_attrs_scheme)
						meta_attrs[key] = value;
					else
						option_attrs[key] = value;
					return;
				} else
				++i;
			}
			dom_attrs[key] = value;			
		};
		var element_data = function (element) {
			var query = element.find("script[type='text/param']");
			return BetaJS.Strings.nltrim(query.length > 0 ? query.html() : element.html());
		};
		var dom_attrs = {};
		var dom_child_attrs = {};
		var option_attrs = {};
		var meta_attrs_scheme = {type: "View", "default": null, name: null, "keep-tag": true};
		meta_attrs = BetaJS.Objs.extend(BetaJS.Objs.clone(meta_attrs_scheme, 1), meta_attrs || {});
		var attrs = element.get(0).attributes;
		for (var i = 0; i < attrs.length; ++i) 
			process(attrs.item(i).nodeName, attrs.item(i).nodeValue);
		BetaJS.Objs.iter(BetaJS.Views.ActiveDom.__prefix_alias, function (alias) {
			element.children(alias + "param").each(function () {
				var child = BetaJS.$(this);
				process(alias + "-" + child.attr(alias + "-key"), element_data(child));
			});
		});
		if (meta_attrs["default"])
			option_attrs[meta_attrs["default"]] = element_data(element);
		if (meta_attrs.type in BetaJS.Views)
			meta_attrs.type = BetaJS.Views[meta_attrs.type];
		if (BetaJS.Types.is_string(meta_attrs.type))
			meta_attrs.type = BetaJS.Scopes.resolve(meta_attrs.type);
		var view = new meta_attrs.type(option_attrs);
		view.setEl("[data-active-dom-id='" + view.cid() + "']");
		var replacement = "<div data-active-dom-id='" + view.cid() + "'></div>";
		if (meta_attrs["keep-tag"])
			replacement = "<" + element.prop("tagName") + " data-active-dom-element='" + view.cid() + "'>" + replacement + "</" + element.prop("tagName") + ">";
		element.replaceWith(replacement);
		element = BetaJS.$("[data-active-dom-id='" + view.cid() + "']");
		var key = null;
		for (key in dom_attrs)
			element.attr(key, dom_attrs[key]);
		view.on("destroy", function () {
			delete BetaJS.Views.ActiveDom.__views[view.cid()];
		});
		BetaJS.Views.ActiveDom.__views[view.cid()] = view;
		view.activate();
		for (key in dom_child_attrs)
			element.children().attr(key, dom_child_attrs[key]);
		if (meta_attrs["name"])
			BetaJS.Scopes.set(view, meta_attrs["name"]);
	},
	
	activate: function () {
		BetaJS.$(document).ready(function () {
			if (BetaJS.Views.ActiveDom.__active)
				return;
			if (document.addEventListener) {
				document.addEventListener("DOMNodeInserted", BetaJS.Views.ActiveDom.__on_add_element);
				document.addEventListener("DOMNodeRemoved", BetaJS.Views.ActiveDom.__on_remove_element);
			} else {
				document.attachEvent("DOMNodeInserted", BetaJS.Views.ActiveDom.__on_add_element);
				document.attachEvent("DOMNodeRemoved", BetaJS.Views.ActiveDom.__on_remove_element);
			}
			BetaJS.Objs.iter(BetaJS.Views.ActiveDom.__prefix_alias, function (alias) {
				BetaJS.$(alias + "view").each(function () {
					BetaJS.Views.ActiveDom.__attach(BetaJS.$(this));
				});
			});
			BetaJS.Objs.iter(BetaJS.Views.ActiveDom.__view_alias, function (data, alias) {
				BetaJS.$(alias).each(function () {
					BetaJS.Views.ActiveDom.__attach(BetaJS.$(this), data);
				});
			});
			BetaJS.Views.ActiveDom.__active = true;
		});
	},
	
	deactivate: function () {
		BetaJS.$(document).ready(function () {
			if (!BetaJS.Views.ActiveDom.__active)
				return;
			document.removeEventListener("DOMNodeInserted", BetaJS.Views.ActiveDom.__on_add_element);
			document.removeEventListener("DOMNodeRemoved", BetaJS.Views.ActiveDom.__on_remove_element);
			BetaJS.Objs.iter(BetaJS.Views.ActiveDom.__views, function (view) {
				view.destroy();
			});
			BetaJS.Views.ActiveDom.__active = false;
		});
	},
	
	registerPrefixAlias: function (alias) {
		this.__prefix_alias.push(alias);
	},
	
	registerViewAlias: function (alias, type, def) {
		this.__view_alias[alias] = { type: type };
		this.__view_alias[alias]["default"] = def;
	}
	
};
BetaJS.Classes.Module.extend("BetaJS.Views.Modules.Centering", {
	
	constructor: function (options) {
		this._inherited(BetaJS.Views.Modules.Centering, "constructor", options);
		this.__vertical = "vertical" in options ? options.vertical : false;
		this.__horizontal = "horizontal" in options ? options.horizontal : false;
	},
	
	_register: function (object, data) {
		object.on("resize", function () {
			if (object.isVisible())
				this.__update(object);
		}, this);
		if (object.isActive() && object.isVisible())
			this.__update(object);
	},
	
	__update: function (object) {
		if (this.__vertical) {
			object.$el.css("top", "50%");
			object.$el.css("margin-top", Math.round(-object.$el.height() / 2) + "px");
		}
		if (this.__horizontal) {
			object.$el.css("left", "50%");
			object.$el.css("margin-left", Math.round(-object.$el.width() / 2) + "px");
		}
	}
	
}, {
	
	__vertical: null,
	
	vertical: function () {
		if (!this.__vertical)
			this.__vertical = new this({auto_destroy: false, vertical: true, horizontal: false});
		return this.__vertical;
	},
	
	__horizontal: null,
	
	horizontal: function () {
		if (!this.__horizontal)
			this.__horizontal = new this({auto_destroy: false, horizontal: true, vertical: false});
		return this.__horizontal;
	},
	
	__both: null,
	
	both: function () {
		if (!this.__both)
			this.__both = new this({auto_destroy: false, vertical: true, horizontal: true});
		return this.__both;
	}
	
});

BetaJS.Classes.Module.extend("BetaJS.Views.Modules.BindOnActivate", {
	
	_register: function (object, data) {
		data.bound = false;
		object.on("activate", function () { this.__bind(object); }, this);
		object.on("deactivate", function () { this.__unbind(object); }, this);
		if (object.isActive())
			this.__bind(object);
	},
	
	_unregister: function (object, data) {
		this.__unbind(object);
	},
	
	__bind: function (object) {
		var data = this._data(object);
		if (data.bound)
			return;
		this._bind(object, data);
		data.bound = true;
	},
	
	__unbind: function (object) {
		var data = this._data(object);
		if (!data.bound)
			return;
		this._unbind(object, data);
		data.bound = false;
	},
	
	_bind: function (object, data) {},
	
	_unbind: function (object, data) {}
	
});

BetaJS.Classes.Module.extend("BetaJS.Views.Modules.BindOnVisible", {
	
	_register: function (object, data) {
		data.bound = false;
		object.on("visibility", function (visible) {
			if (visible)
				this.__bind(object);
			else
				this.__unbind(object);
		}, this);
		if (object.isActive() && object.isVisible())
			this.__bind(object);
	},
	
	_unregister: function (object, data) {
		this.__unbind(object);
	},
	
	__bind: function (object) {
		var data = this._data(object);
		if (data.bound)
			return;
		this._bind(object, data);
		data.bound = true;
	},
	
	__unbind: function (object) {
		var data = this._data(object);
		if (!data.bound)
			return;
		this._unbind(object, data);
		data.bound = false;
	},
	
	_bind: function (object, data) {},
	
	_unbind: function (object, data) {}
	
});

BetaJS.Views.Modules.BindOnVisible.extend("BetaJS.Views.Modules.HideOnLeave", {
		
	_bind: function (object, data) {
		var el = object.$el.get(0);
		data.hide_on_leave_func = function (e) {
			if (data.hide_on_leave_skip) {
				data.hide_on_leave_skip = false;
				return;
			}
			if (document.contains(e.target) && e.target !== el && !BetaJS.$.contains(el, e.target))
				object.hide();
		};
		data.hide_on_leave_skip = true;
		BetaJS.$(document.body).on("click", data.hide_on_leave_func);
	},
	
	_unbind: function (object, data) {
		BetaJS.$(document.body).unbind("click", data.hide_on_leave_func);
	}
	
});

BetaJS.Views.Modules.BindOnActivate.extend("BetaJS.Views.Modules.Hotkeys", {
		
	constructor: function (options) {
		this._inherited(BetaJS.Views.Modules.Hotkeys, "constructor", options);
		this.__hotkeys = options.hotkeys;
	},

	_bind: function (object, data) {
		data.hotkeys = {};
		BetaJS.Objs.iter(this.__hotkeys, function (f, hotkey) {
			data.hotkeys[hotkey] = BetaJS.Browser.Hotkeys.register(hotkey, BetaJS.Types.is_function(f) ? f : object[f], object); 
		}, this);
	},
	
	_unbind: function (object, data) {
		BetaJS.Objs.iter(data.hotkeys, function (handle) {
			BetaJS.Browser.Hotkeys.unregister(handle);
		}, this);
		data.hotkeys = {};
	}
	
});
BetaJS.Templates.Cached = BetaJS.Templates.Cached || {};
BetaJS.Templates.Cached['holygrail-view-template'] = '  <div data-selector="right" class=\'holygrail-view-right-container\'></div>  <div data-selector="left" class=\'holygrail-view-left-container\'></div>  <div data-selector="center" class=\'holygrail-view-center-container\'></div> ';

BetaJS.Templates.Cached['list-container-view-item-template'] = '  <{%= container_element %} data-view-id="{%= cid %}"></{%= container_element %}> ';

BetaJS.Templates.Cached['switch-container-view-item-template'] = '  <div data-view-id="{%= cid %}" data-selector="switch-container-item"></div> ';

BetaJS.Templates.Cached['button-view-template'] = '   <{%= button_container_element %} type="button" data-selector="button-inner" class="{%= supp.css("default") %}"    {%= bind.css_if("disabled", "disabled") %}    {%= bind.css_if("selected", "selected") %}    {%= bind.inner("label") %}>   </{%= button_container_element %}>  ';

BetaJS.Templates.Cached['check-box-view-template'] = '  <input type="checkbox" {%= checked ? "checked" : "" %} id="check-{%= supp.view_id %}" />  <label for="check-{%= supp.view_id %}">{%= label %}</label> ';

BetaJS.Templates.Cached['input-view-template'] = '  <input class="input-view" type="{%= input_type %}" {%= bind.value("value") %} {%= bind.attr("placeholder", "placeholder") %} {%= bind.css_if("input-horizontal-fill", "horizontal_fill") %} /> ';

BetaJS.Templates.Cached['label-view-template'] = '  <{%= element %} class="{%= supp.css(\'label\') %}" {%= bind.inner("label") %}></{%= element %}> ';

BetaJS.Templates.Cached['link-view-template'] = '  <a href="javascript:{}" {%= bind.inner("label") %}></a> ';

BetaJS.Templates.Cached['text-area-template'] = '   <textarea {%= bind.value("value") %} {%= bind.attr("placeholder", "placeholder") %}             {%= bind.css_if_not("text-area-no-resize", "resizable") %}             {%= readonly ? \'readonly\' : \'\' %}             style="resize: {%= horizontal_resize ? (vertical_resize ? \'both\' : \'horizontal\') : (vertical_resize ? \'vertical\' : \'none\') %}"             {%= bind.css_if("text-area-horizontal-fill", "horizontal_fill") %}></textarea>  ';

BetaJS.Templates.Cached['progress-template'] = '  <div class="{%= supp.css(\'outer\') %}">   <div data-selector="inner" class="{%= supp.css(\'inner\') %}" style="{%= horizontal ? \'width\': \'height\' %}:{%= value*100 %}%">   </div>   <div class="progress-view-overlay" data-selector="label">    {%= label %}   </div>  </div> ';

BetaJS.Templates.Cached['list-view-template'] = '   <{%= list_container_element %}    {%= supp.attrs(list_container_attrs) %}    class="{%= list_container_classes %}"    data-selector="list">   </{%= list_container_element %}>  ';
BetaJS.Templates.Cached['list-view-item-container-template'] = '   <{%= item_container_element %}    {%= supp.attrs(item_container_attrs) %}    class="{%= item_container_classes %}"    {%= supp.list_item_attr(item) %}>   </{%= item_container_element %}>  ';

BetaJS.Templates.Cached['overlay-view-template'] = '  <div data-selector="container"></div> ';

BetaJS.Templates.Cached['fullscreen-overlay-view-template'] = '  <div class="fullscreen-overlay-background" data-selector="outer"></div>  <div class="fullscreen-overlay" data-selector="container">   <div class="fullscreen-overlay-inner" data-selector="inner"></div>  </div> ';

BetaJS.Views.View.extend("BetaJS.Views.HolygrailView", {
	_templates: {
		"default": BetaJS.Templates.Cached["holygrail-view-template"]
	},
	constructor: function (options) {
		this._inherited(BetaJS.Views.HolygrailView, "constructor", options);
		this.__left = null;
		this.__center = null;
		this.__right = null;
	},
	getLeft: function () {
		return this.__left;
	},
	setLeft: function (view) {
		return this.__setView("left", view);
	},
	getCenter: function () {
		return this.__center;
	},
	setCenter: function (view) {
		return this.__setView("center", view);
	},
	getRight: function () {
		return this.__right;
	},
	setRight: function (view) {
		return this.__setView("right", view);
	},
	__setView: function(key, view) {
		// Remove old child in case we had one
		this.removeChild(this["__" + key]);
		// Set old child attribute to null
		this["__" + key] = null;
		// If we have a new view (i.e. set view was not called with null)
		if (view) {
			// bind new view to selector
			view.setEl('[data-selector="' + key + '"]');
			// store new view as child attribute and add the view
			this["__" + key] = this.addChild(view);
		}
		return view;
	}
});
BetaJS.Views.View.extend("BetaJS.Views.ListContainerView", {
	
	_templates: {
		"item": BetaJS.Templates.Cached["list-container-view-item-template"]
	},
	
	_notifications: {
		"addChild": "__addChildContainer",
		"removeChild": "__removeChildContainer"
	},
	
	constructor: function (options) {
		options = options || {};
		this._inherited(BetaJS.Views.ListContainerView, "constructor", options);
		this._setOption(options, "alignment", "horizontal");
		this._setOption(options, "positioning", "float"); // float, computed, none
		this._setOption(options, "clear_float", false);
		this._setOption(options, "container_element", "div");
		this.on("show", function () {
			if (this.__positioning == "computed")
				this.__updatePositioning();
		}, this);
	},
	
	isHorizontal: function () {
		return this.__alignment == "horizontal";
	},
	
	_render: function () {
		if (this.__clear_float)
			this.$el.html("<div data-selector='clearboth' style='clear:both'></div>");
		else
			this.$el.html("");
		BetaJS.Objs.iter(this.children(), function (child) {
			this.__addChildContainer(child);
		}, this);
	},
	
	__addChildContainer: function (child) {
		var options = this.childOptions(child);
		if (this.isActive()) {
			var rendered = this.evaluateTemplate("item", {cid: child.cid(), container_element: this.__container_element});
			if (this.__clear_float)
				this.$("[data-selector='clearboth']").before(rendered);
			else
				this.$el.append(rendered);
		}
		child.setEl("[data-view-id='" + child.cid() + "']");
		if (this.isHorizontal() && !("float" in options) && this.__positioning == "float")
			options["float"] = "left";
		if (this.isActive() && "float" in options && this.__positioning == "float") {
			var container = this.$("[data-view-id='" + child.cid() + "']");
			container.css("float", options["float"]);
		}			
	},
	
	__removeChildContainer: function (child) {
		this.$data({"view-id": child.cid()}).remove();
	},
	
	__updatePositioningHelper: function (arr, pos_string, size_string) {
		var pos = 0;
		BetaJS.Objs.iter(arr, function (child) {
			var opts = this.childOptions(child);
			if (!(opts['type'] && opts['type'] == 'ignore')) {
				child.$el.css(pos_string, pos + 'px');
				if (child.isVisible())
					pos += parseInt(child.$el.css(size_string), 10);
				if (opts['type'] && opts['type'] == 'dynamic')
					return false;
			}
		}, this);
	},
	
	__updatePositioning: function () {
		var ltr = BetaJS.Objs.values(this.children());
		var rtl = BetaJS.Objs.clone(ltr, 1).reverse();
		var left_string = this.isHorizontal() ? "left" : "top";
		var right_string = this.isHorizontal() ? "right" : "bottom";
		var width_string = this.isHorizontal() ? "width" : "height";
		this.__updatePositioningHelper(rtl, right_string, width_string);
		this.__updatePositioningHelper(ltr, left_string, width_string);
	},

	updateChildVisibility: function (child) {
		this._inherited(BetaJS.Views.ListContainerView, "updateChildVisibility", child);
		if (this.__positioning == "computed")
			this.__updatePositioning();
	}
	
	
});
BetaJS.Views.View.extend("BetaJS.Views.SingleContainerView", {
	constructor: function (options) {
		this._inherited(BetaJS.Views.SingleContainerView, "constructor", options);
		this.__view = null;
	},
	getView: function () {
		return this.__view;
	},
	setView: function(view) {
		this.removeChild(this.__view);
		if (view) {
			view.setEl("");
			this.__view = this.addChild(view);
		}
		return view;
	}
});
BetaJS.Views.View.extend("BetaJS.Views.SwitchContainerView", {
	
	_templates: {
		"item": BetaJS.Templates.Cached["switch-container-view-item-template"]
	},
	
	_notifications: {
		"addChild": "__addChildContainer",
		"removeChild": "__removeChildContainer"
	},
	
	constructor: function (options) {
		this._inherited(BetaJS.Views.SwitchContainerView, "constructor", options);
		this.__selected = null;
	},

	_render: function () {
		this.$el.html("");
		BetaJS.Objs.iter(this.children(), function (child) {
			this.__addChildContainer(child);
		}, this);
	
	},
	
	__addChildContainer: function (child) {
		if (this.isActive())
			this.$el.append(this.evaluateTemplate("item", {cid: child.cid()}));
		child.setEl("[data-view-id='" + child.cid() + "']");
		this.__selected = this.__selected || child;
		child.setVisibility(this.__selected == child);
	},
	
	__removeChildContainer: function (child) {
		this.$data({"view-id": child.cid()}).remove();
		if (this.__selected == child)
			this.__selected = null;
	},
	
	select: function (child) {
		this.__selected = child;
		BetaJS.Objs.iter(this.children(), function (child) {
			child.setVisibility(this.__selected == child);
		}, this);
	},
	
	selected: function () {
		return this.__selected;
	}
	
});
BetaJS.Views.ListContainerView.extend("BetaJS.Views.TabbedView", {
	
	constructor: function (options) {
		options = BetaJS.Objs.extend(options || {}, {
			"alignment": "vertical",
			"positioning": "none"
		});
		this._inherited(BetaJS.Views.TabbedView, "constructor", options);
		this.toolbar = this.addChild(new BetaJS.Views.ToolBarView());
		this.container = this.addChild(new BetaJS.Views.SwitchContainerView());
		this.toolbar.on("item:click", function (view) {
			this.select(view);
		}, this);
		if (options.tabs) {
			BetaJS.Objs.iter(options.tabs, function (tab) {
				this.addTab(tab);
			}, this);
		}
	},
	
	addTab: function (options) {
		options = BetaJS.Objs.extend(options, {
			selectable: true,
			deselect_all: true						
		});
		var button = this.toolbar.addItem(options);
		button.__tabView = this.container.addChild(options.view);
		options.view.__tabButton = button;
		if (options.selected)
			this.select(button);
		return button.__tabView;
	},
	
	select: function (item_ident_or_view) {
		var tab_view = null;
		if (BetaJS.Types.is_string(item_ident_or_view))
			tab_view = this.toolbar.itemByIdent(item_ident_or_view).__tabView;
		else if (item_ident_or_view.__tabButton)
			tab_view = item_ident_or_view;
		else
			tab_view = item_ident_or_view.__tabView;
		this.container.select(tab_view);
		tab_view.__tabButton.select();
		this.trigger("select", tab_view);
		return tab_view;
	}
	
});
BetaJS.Views.View.extend("BetaJS.Views.ButtonView", {
	_dynamics: {
		"default": BetaJS.Templates.Cached["button-view-template"]
	},
	_css: function () {
		return {
			"disabled": "",
			"default": "",
			"selected": ""
		};
	},
	constructor: function(options) {
		options = options || {};
		this._inherited(BetaJS.Views.ButtonView, "constructor", options);
		this._setOptionProperty(options, "label", "");
		this._setOptionProperty(options, "button_container_element", "button");
		this._setOptionProperty(options, "disabled", false);
		this._setOptionProperty(options, "selected", false);
		this._setOption(options, "selectable", false);
		this._setOption(options, "deselect_all", false);
		if (options.hotkey) {
			var hotkeys = {};
			hotkeys[options.hotkey] = function () {
				this.click();
			};
			this.add_module(new BetaJS.Views.Modules.Hotkeys({hotkeys: hotkeys}));
		}
	},
	_events: function () {
		return this._inherited(BetaJS.Views.ButtonView, "_events").concat([{
			"click [data-selector='button-inner']": "click"
		}]);
	},
	click: function () {
		if (!this.get("disabled")) {
			if (this.__selectable)
				this.select();
			this.trigger("click");
		}
	},
	_bindParent: function (parent) {
		parent.on("deselect", function () {
			this.unselect();
		}, this);
	},
	
	_unbindParent: function (parent) {
		parent.off("deselect", this);
	},
	
	select: function () {
		if (!this.__selectable)
			return;
		if (this.__deselect_all)
			this.getParent().trigger("deselect");
		this.getParent().trigger("select", this);
		this.set("selected", true);
	},
	
	unselect: function () {
		if (!this.__selectable)
			return;
		this.set("selected", false);
	},
	
	isSelected: function () {
		return this.get("selected");
	}
});
BetaJS.Views.View.extend("BetaJS.Views.CheckBoxView", {
	_templates: {
		"default": BetaJS.Templates.Cached["check-box-view-template"]
	},
	_events: function () {
		return this._inherited(BetaJS.Views.ButtonView, "_events").concat([{
			"click input": "__click"
		}]);
	},
	constructor: function(options) {
		options = options || {};
		options["invalidate_on_change"] = true;
		this._inherited(BetaJS.Views.CheckBoxView, "constructor", options);
		this._setOptionProperty(options, "checked", false);
		this._setOptionProperty(options, "label", "");
	},
	__click: function () {
		this.set("checked", this.$("input").is(":checked"));
		this.trigger("check", this.get("checked"));
	}
});
BetaJS.Views.SwitchContainerView.extend("BetaJS.Views.InputLabelView", {

	constructor: function(options) {
		this._inherited(BetaJS.Views.InputLabelView, "constructor", options);
		this._setOptionProperty(options, "value", "");
		this._setOptionProperty(options, "placeholder", "");
		this._setOption(options, "edit_on_click", true);
		this._setOption(options, "label_mode", true);
		this._setOption(options, "read_only", false);
		this.label = this.addChild(new BetaJS.Views.LabelView({
			label: this.binding("value"),
			el_classes: options["label_el_classes"],
			children_classes: options["label_children_classes"]
		}));
		this.input = this.addChild(new BetaJS.Views.InputView({
			value: this.binding("value"),
			placeholder: this.binding("placeholder")
		}));
		if (!this.__label_mode)
			this.select(this.input);
		this.input.on("leave enter_key", function () {
			this.label_mode();
		}, this);
		if (this.__edit_on_click)
			this.label.on("click", function () {
				this.edit_mode();
			}, this);
	},
	
	is_label_mode: function () {
		return this.__label_mode;
	},
	
	is_edit_mode: function () {
		return !this.__label_mode;
	},

	label_mode: function () {
		if (this.is_label_mode())
			return;
		this.__label_mode = true;
		this.select(this.label);		
	},
	
	edit_mode: function () {
		if (this.is_edit_mode() || this.__read_only)
			return;
		this.__label_mode = false;
		this.select(this.input);
		this.input.focus(true);
	}

});
BetaJS.Views.View.extend("BetaJS.Views.InputView", {
	_dynamics: {
		"default": BetaJS.Templates.Cached["input-view-template"]
	},
	_events: function () {
		return [{
			"blur input": "__leaveEvent",
			"keyup input": "__changeEvent",
			"change input": "__changeEvent",
			"input input": "__changeEvent",
			"paste input": "__changeEvent"
		}, {
			"keyup input": "__keyupEvent"
		}];
	},
	constructor: function(options) {
		this._inherited(BetaJS.Views.InputView, "constructor", options);
		this._setOptionProperty(options, "value", "");
		this._setOptionProperty(options, "placeholder", "");	
		this._setOptionProperty(options, "clear_after_enter", false);	
		this._setOptionProperty(options, "horizontal_fill", false);
		this._setOptionProperty(options, "input_type", "text");
	},
	__keyupEvent: function (e) {
		var key = e.keyCode || e.which;
        if (key == 13) {
			this.trigger("enter_key", this.get("value"));
			if (this.get("clear_after_enter"))
				this.set("value", "");
		}
    },
	__leaveEvent: function () {
		this.trigger("leave");
	},
	__changeEvent: function () {
		this.trigger("change", this.get("value"));
	},
	focus: function (select_all) {
		this.$("input").focus();
		this.$("input").focus();
		if (select_all)
			this.$("input").select();
	}
});
BetaJS.Views.View.extend("BetaJS.Views.LabelView", {
	_dynamics: {
		"default": BetaJS.Templates.Cached["label-view-template"]
	},
	_css: function () {
		return {"label": "label-view-class"};
	},
	_events: function () {
		return [{
			"click": "__clickEvent"	
		}];
	},
	constructor: function(options) {
		this._inherited(BetaJS.Views.LabelView, "constructor", options);
		this._setOptionProperty(options, "label", "");
		this._setOptionProperty(options, "element", "span");
	},
	__clickEvent: function () {
		this.trigger("click");
	}
});
BetaJS.Views.View.extend("BetaJS.Views.LinkView", {
	_dynamics: {
		"default": BetaJS.Templates.Cached["link-view-template"]
	},
	constructor: function(options) {
		this._inherited(BetaJS.Views.LinkView, "constructor", options);
		this._setOptionProperty(options, "label", "");
	},
	_events: function () {
		return this._inherited(BetaJS.Views.LinkView, "_events").concat([{
			"click a": "__click"
		}]);
	},
	__click: function () {
		this.trigger("click");
	}
});
BetaJS.Views.View.extend("BetaJS.Views.ProgressView", {
	_templates: {
		"default": BetaJS.Templates.Cached["progress-template"]
	},
	
	_css: function () {
		return {
			outer: "",
			inner: ""
		};
	},
	
	constructor: function(options) {
		this._inherited(BetaJS.Views.ProgressView, "constructor", options);
		this._setOptionProperty(options, "label", "");
		this._setOptionProperty(options, "horizontal", true);
		this._setOptionProperty(options, "value", 1);
		this.on("change:value", function (value) {
			if (this.isActive())
				this.$("[data-selector='inner']").css(this.get("horizontal") ? 'width' : 'height', (value * 100) + "%");
		}, this);
		this.on("change:label", function (label) {
			if (this.isActive())
				this.$("[data-selector='label']").html(label);
		}, this);
	}
	
});

BetaJS.Views.View.extend("BetaJS.Views.TextAreaView", {
	_dynamics: {
		"default": BetaJS.Templates.Cached["text-area-template"]
	},
	constructor: function(options) {
		this._inherited(BetaJS.Views.TextAreaView, "constructor", options);
		this._setOptionProperty(options, "value", "");
		this._setOptionProperty(options, "placeholder", "");
		this._setOptionProperty(options, "horizontal_resize", false);
		this._setOptionProperty(options, "vertical_resize", true);
		this._setOptionProperty(options, "horizontal_fill", false);
		this._setOptionProperty(options, "readonly", false);
		this.on("change:readonly", function () {
			if (this.get("readonly"))
				this.$("textarea").attr("readonly", "readonly");
			else
				this.$("textarea").removeAttr("readonly");
		}, this);
	},
	
	addLine: function (s) {
		if (this.get("value"))
			this.set("value", this.get("value") + "\n" + s);
		else
			this.set("value", s);
		this.scrollToEnd();
	},
	
	scrollToEnd: function () {
		var t = this.$("textarea").get(0);
		t.scrollTop = t.scrollHeight;		
	}
});
BetaJS.Views.View.extend("BetaJS.Views.CustomListView", {
	
	_templates: function () {
		return {
			"default": BetaJS.Templates.Cached["list-view-template"],
			"item-container": BetaJS.Templates.Cached["list-view-item-container-template"]
		};
	},
	
	_supp: function () {
		return BetaJS.Objs.extend(this._inherited(BetaJS.Views.CustomListView, "_supp"), {
			list_item_attr: function (item) {
				return this.attrs({
					"data-view-id": this.__context.cid(),
					"data-cid": BetaJS.Ids.objectId(item),
					"data-index": this.__context.__collection.getIndex(item)
				});
			}
		});
	},
	
	_notifications: {
		activate: "__activateItems",
		deactivate: "__deactivateItems"
	},
	
	_events: function () {
		return [{
			"click": "__click"
		}];
	},	
	
	constructor: function(options) {
		this._inherited(BetaJS.Views.CustomListView, "constructor", options);
		this._setOption(options, "list_container_element", "ul");
		this._setOption(options, "list_container_attrs", {});
		this._setOption(options, "list_container_classes", "");
		this._setOption(options, "item_container_element", "li");
		this._setOption(options, "item_container_classes", "");
		this._setOption(options, "selectable", true);
		this._setOption(options, "multi_select", false);
		this._setOption(options, "click_select", false);
		this.__itemData = {};
		if ("table" in options) {
			var table = this.cls.parseType(options.table, "object");
			this.active_query = new BetaJS.Queries.ActiveQuery(table.active_query_engine(), {});
			options.collection = this.active_query.collection();
			options.destroy_collection = true;
		}
		if ("compare" in options)
			options.compare = this.cls.parseType(options.compare, "function");
		if ("collection" in options) {
			this.__collection = options.collection;
			this.__destroy_collection = "destroy_collection" in options ? options.destroy_collection : false;
			if ("compare" in options)
				this.__collection.set_compare(options["compare"]);
		} else {
			var col_options = {};
			if ("objects" in options) 
				col_options["objects"] = options["objects"];
			if ("compare" in options) 
				col_options["compare"] = options["compare"];
			this.__collection = new BetaJS.Collections.Collection(col_options);
			this.__destroy_collection = true;
		}
		this.__collection.on("add", function (item) {
			this._addItem(item);
		}, this);
		this.__collection.on("remove", function (item) {
			this._removeItem(item);
		}, this);
		this.__collection.on("change", function (item) {
			this._changeItem(item);
		}, this);
		this.__collection.on("index", function (item, index) {
			this.__updateItemIndex(item, index);
		}, this);
		this.__collection.on("reindexed", function (item) {
			this.__reIndexItem(item);
		}, this);
		this.__collection.on("sorted", function () {
			this.__sort();
		}, this);
		this.__collection.iterate(function (item) {
			this._registerItem(item);
		}, this);
	},
	
	destroy: function () {
		this.__collection.iterate(function (item) {
			this._unregisterItem(item);
		}, this);
		this.__collection.off(null, null, this);
		if (this.__destroy_collection)
			this.__collection.destroy();
		this._inherited(BetaJS.Views.CustomListView, "destroy");
	},
	
	_itemBySubElement: function (element) {
		var container = element.closest("[data-view-id='" + this.cid() + "']");
		return container.length === 0 ? null : this.__collection.getById(container.attr("data-cid"));
	},
	
	__click: function (e) {
		if (this.__click_select && this.__selectable) {
			var item = this._itemBySubElement(BetaJS.$(e.target));
			if (item)
				this.select(item);
		}
	},
	
	collection: function () {
		return this.__collection;
	},
	
	add: function (item) {
		this.__collection.add(item);						
	},
	
	remove: function (item) {
		this.__collection.remove(item);
	},
	
	_render: function () {
		this.$selector_list = this._renderListContainer();
	},
	
	_renderListContainer: function () {
		this.$el.html(this.evaluateTemplate("default", {
			list_container_element: this.__list_container_element,
			list_container_attrs: this.__list_container_attrs,
			list_container_classes: this.__list_container_classes
		}));
		return this.$data({"selector": "list"});
	},
	
	invalidate: function () {
		if (this.isActive())
			this.__deactivateItems();
		this._inherited(BetaJS.Views.CustomListView, "invalidate");
		if (this.isActive())
			this.__activateItems();
	},
	
	__activateItems: function () {
		this.__collection.iterate(function (item) {
			this._activateItem(item);
		}, this);
	},
	
	__deactivateItems: function () {
		this.__collection.iterate(function (item) {
			this._deactivateItem(item);
		}, this);
	},

	itemElement: function (item) {
		return this.$data({
			"view-id": this.cid(),
			"cid": BetaJS.Ids.objectId(item)
		}, this.$selector_list);
	},
	
	_findIndexElement: function (index) {
		return this.$data({
			"view-id": this.cid(),
			"index": index
		}, this.$selector_list);
	},

	_changeItem: function (item) {},

	__updateItemIndex: function (item, index) {
		var element = this.itemElement(item);
		element.attr("data-index", index);
		this._updateItemIndex(item, element);
	},

	__reIndexItem: function (item) {
		var element = this.itemElement(item);
		var index = this.collection().getIndex(item);
		if (index === 0)
			this.$selector_list.prepend(element);
		else {
			var before = this._findIndexElement(index - 1);
			before.after(element);
		}
	},
	
	_updateItemIndex: function (item, index) {},
	
	__sort: function () {
		for (var index = this.collection().count() - 1; index >= 0; index--)
			this.$selector_list.prepend(this._findIndexElement(index));
	},
	
	itemData: function (item) {
		return this.__itemData[item.cid()];
	},

	_registerItem: function (item) {
		this.__itemData[item.cid()] = {
			properties: new BetaJS.Properties.Properties({
				selected: false,
				new_element: false
			})
		};
	},
	
	_unregisterItem: function (item) {
		if (!this.__itemData[item.cid()])
			return;
		this.__itemData[item.cid()].properties.destroy();
		delete this.__itemData[item.cid()];
	},
	
	_activateItem: function (item) {
		var container = this.evaluateTemplate("item-container", {
			item: item,
			item_container_element: this.__item_container_element, 
			item_container_attrs: this.__item_container_attrs,
			item_container_classes: this.__item_container_classes			
		});
		var index = this.__collection.getIndex(item);
		if (index === 0)
			this.$selector_list.prepend(container);
		else {
			var before = this._findIndexElement(index - 1);
			if (before.length > 0) 
				before.after(container);
			else {
				var after = this._findIndexElement(index + 1);
				if (after.length > 0)
					after.before(container);
				else
					this.$selector_list.append(container);
			}
		}
		this.trigger("activate_item", item);
	},
	
	_deactivateItem: function (item) {
		this.itemData(item).new_element = false;
		var element = this.itemElement(item);
		element.remove();
	},
	
	_addItem: function (item) {
		this._registerItem(item);
		if (this.isActive()) {
			this.itemData(item).new_element = true;
			this._activateItem(item);
		}
	},
	
	_removeItem: function (item) {
		if (this.isActive())
			this._deactivateItem(item);
		this._unregisterItem(item);
	},
	
	isSelected: function (item) {
		return this.itemData(item).properties.get("selected");
	},
	
	select: function (item) {
		var data = this.itemData(item);
		if (this.__selectable && !this.isSelected(item)) {
			if (!this.__multi_select)
				this.collection().iterate(function (object) {
					this.unselect(object);
				}, this);
			data.properties.set("selected", true);
			this.trigger("select", item);
		}
		return data;
	},
	
	unselect: function (item) {
		var data = this.itemData(item);
		if (this.__selectable && this.isSelected(item)) {
			data.properties.set("selected", false);
			this.trigger("unselect", item);
		}
		return data;
	}	
	
});



BetaJS.Views.CustomListView.extend("BetaJS.Views.ListView", {
	
	constructor: function(options) {
		options = options || {};
		if ("item_template" in options)
			options.templates = {item: options.item_template};
		if ("item_dynamic" in options)
			options.dynamics = {item: options.item_dynamic};
		this._inherited(BetaJS.Views.ListView, "constructor", options);
		this._setOption(options, "item_label", "label");
		this._setOption(options, "render_item_on_change", BetaJS.Types.is_defined(this.dynamics("item")));
	},
	
	_changeItem: function (item) {
		this._inherited(BetaJS.Views.ListView, "_changeItem", item);
		if (this.__render_item_on_change && this.isActive())
			this._renderItem(item);
	},
	
	_activateItem: function (item) {
		this._inherited(BetaJS.Views.ListView, "_activateItem", item);
		this._renderItem(item);
	},
	
	_renderItem: function (item) {
		var element = this.itemElement(item);
		var properties = this.itemData(item).properties;
		if (this.templates("item"))
			element.html(this.evaluateTemplate("item", {item: item, properties: properties}));
		else if (this.dynamics("item"))
			this.evaluateDynamics("item", element, {item: item, properties: properties}, {name: "item-" + BetaJS.Ids.objectId(item)});
		else
			element.html(item.get(this.__item_label)); 
	},
	
	_deactivateItem: function (item) {
		if (this.dynamics("item"))
			this.dynamics("item").removeInstanceByName("item-" + BetaJS.Ids.objectId(item));
		this._inherited(BetaJS.Views.ListView, "_deactivateItem", item);
	}
	
});


BetaJS.Views.CustomListView.extend("BetaJS.Views.SubViewListView", {
	
	_sub_view: BetaJS.Views.View,
	
	_sub_view_options: function (item) {
		return {
			item: item,
			item_properties: this.itemData(item).properties
		};
	},
	
	_property_map: function (item) {},
	
	constructor: function(options) {
		this._inherited(BetaJS.Views.SubViewListView, "constructor", options);
		if ("create_view" in options)
			this._create_view = options.create_view;
		if ("sub_view" in options)
			this._sub_view = this.cls.parseType(options.sub_view, "object");
		if ("sub_view_options" in options)
			this._sub_view_options_param = options.sub_view_options;
		if ("property_map" in options)
			this._property_map_param = options.property_map;
	},
	
	_create_view: function (item, element) {
		var properties = BetaJS.Objs.extend(
			BetaJS.Types.is_function(this._property_map) ? this._property_map.apply(this, [item]) : this._property_map,
			BetaJS.Types.is_function(this._property_map_param) ? this._property_map_param.apply(this, [item]) : this._property_map_param);
		var options = BetaJS.Objs.extend(
			BetaJS.Types.is_function(this._sub_view_options) ? this._sub_view_options.apply(this, [item]) : this._sub_view_options,
			BetaJS.Objs.extend(
				BetaJS.Types.is_function(this._sub_view_options_param) ? this._sub_view_options_param.apply(this, [item]) : this._sub_view_options_param || {},
				BetaJS.Objs.map(properties, item.get, item)));
		options.el = this.itemElement(item);
		return new this._sub_view(options);
	},
	
	_activateItem: function (item) {
		this._inherited(BetaJS.Views.SubViewListView, "_activateItem", item);
		var view = this._create_view(item); 
		this.delegateEvents(null, view, "item", [view, item]);
		this.itemData(item).view = view;
		this.addChild(view);
	},
	
	_deactivateItem: function (item) {
		var view = this.itemData(item).view;
		this.removeChild(view);
		view.destroy();
		this._inherited(BetaJS.Views.SubViewListView, "_deactivateItem", item);
	}
	
});


BetaJS.Classes.Module.extend("BetaJS.Views.Modules.ListViewAnimation", {

	_register: function (object, data) {
		object.on("activate_item", function (item) {
			if (object.itemData(item).new_element) {
				var element = object.itemElement(item);
				element.css("display", "none");
				element.fadeIn();
			}
		}, this);
	}
	
}, {
	
	__singleton: null,
	
	singleton: function () {
		if (!this.__singleton)
			this.__singleton = new this({auto_destroy: false});
		return this.__singleton;
	}
	
});

BetaJS.Views.View.extend("BetaJS.Views.OverlayView", {
	
	_templates: {
		"default": BetaJS.Templates.Cached["overlay-view-template"]
	},

	/*
	 * overlay_inner (optional) : sub view to be bound to the overlay
	 * 
	 * anchor: "none" | "absolute" | "element" | "relative"
     *
	 * overlay_left
	 * overlay_top
     *
	 * overlay_align_vertical: "top" | "center" | "bottom"
	 * overlay_align_horizontal: "left" | "center" | "right"
	 *
	 * element-align-vertical: "top" | "center" | "bottom"
	 * element-align-horizontal: "left" | "center" | "right"
     *
	 * element
	 */
	constructor: function (options) {
		options = options || {};
		options.anchor = options.anchor || "absolute";
		//options.hide_on_leave = "hide_on_leave" in options ? options.hide_on_leave : true;
		options.visible = "visible" in options ? options.visible : false;
		options.children_classes = options.children_classes || [];
		if (BetaJS.Types.is_string(options.children_classes))
			options.children_classes = options.children_classes.split(" ");
		options.children_classes.push("overlay-container-class");
		this._inherited(BetaJS.Views.OverlayView, "constructor", options);
		this._setOption(options, "anchor", "none");
		this._setOption(options, "element", "");
		this._setOption(options, "overlay_left", 0);
		this._setOption(options, "overlay_top", 0);
		this._setOption(options, "overlay_align_vertical", "top");
		this._setOption(options, "overlay_align_horizontal", "left");
		this._setOption(options, "element_align_vertical", "bottom");
		this._setOption(options, "element_align_horizontal", "left");
		if (options.overlay_inner) {
			options.overlay_inner.setEl('[data-selector="container"]');
			this.overlay_inner = this.addChild(options.overlay_inner);
		}
		if (!("hide_on_leave" in options) || options.hide_on_leave)
			this.add_module(BetaJS.Views.Modules.HideOnLeave.singleton());
		this.on("show", this._after_show, this);
	},
	
	_after_show: function () {	
		if (this.__anchor == "none")
			return;
		var overlay = this.$(".overlay-container-class");
		var width = overlay.outerWidth();
		var height = overlay.outerHeight();

		var left = this.__overlay_left;
		var top = this.__overlay_top;
		
		if (this.__overlay_align_vertical == "bottom")
			top -= height;
		else if (this.__overlay_align_vertical == "center")
			top -= Math.round(height/2);

		if (this.__overlay_align_horizontal == "right")
			left -= width;
		else if (this.__overlay_align_horizontal == "center")
			left -= Math.round(width/2);
			
		var element = this.$el;
		if (this.__anchor == "element" && this.__element) {
			element = this.__element;
			if (BetaJS.Types.is_string(element))
				element = BetaJS.$(element);
			else if (BetaJS.Class.is_class_instance(element))
				element = element.$el;
		}
		if (this.__anchor == "relative" || this.__anchor == "element") {
			element_width = element.outerWidth();
			element_height = element.outerHeight();
			left += element.offset().left - BetaJS.$(window).scrollLeft();
			top += element.offset().top - BetaJS.$(window).scrollTop();
			if (this.__element_align_vertical == "bottom")
				top += element_height;
			else if (this.__element_align_vertical == "center")
				top += Math.round(element_height/2);
			if (this.__element_align_horizontal == "right")
				left += element_width;
			else if (this.__element_align_horizontal == "center")
				left += Math.round(element_width/2);
		}
		overlay.css("left", left + "px");
		overlay.css("top", top + "px");
	}

});
BetaJS.Views.View.extend("BetaJS.Views.FullscreenOverlayView", {
	
	_templates: {
		"default": BetaJS.Templates.Cached["fullscreen-overlay-view-template"]
	},
	
	_events: function () {
		return [{
			'click [data-selector="outer"]': "unfocus",
			'touchstart [data-selector="outer"]': "unfocus"
		}];
	},

	constructor: function (options) {
		options = options || {};
		options.el = options.el || "body";
		options.append_to_el = "append_to_el" in options ? options.append_to_el : true;
		options.visible = "visible" in options ? options.visible : false;
		this._inherited(BetaJS.Views.FullscreenOverlayView, "constructor", options);
		options.overlay_inner.setEl('[data-selector="inner"]');
		this.overlay_inner = this.addChild(options.overlay_inner);
		this._setOption(options, "hide_on_unfocus", true);
		this._setOption(options, "destroy_on_unfocus", false);
		this.on("show", this._after_show, this);
		this.on("hide", this._after_hide, this);
	},
	
	_after_show: function () {	
		var outer = this.$('[data-selector="outer"]');
		var inner = this.$('[data-selector="inner"]');
		var container = this.$('[data-selector="container"]');
		container.removeClass("fullscreen-overlay-float");
		container.removeClass("fullscreen-overlay-fit");
		var outer_width = outer.outerWidth();
		var outer_height = outer.outerHeight();
		var inner_width = inner.outerWidth();
		var inner_height = inner.outerHeight();
		var left = Math.floor((outer_width - inner_width) / 2);
		var top = Math.floor((outer_height - inner_height) / 2);
		if (left >= 0 && top >= 0) {
			container.css("left", left + "px");
			container.css("top", top + "px");
			container.addClass("fullscreen-overlay-float");
		} else {
			container.css("left", "0px");
			container.css("top", "0px");
			container.addClass("fullscreen-overlay-fit");
		}
		BetaJS.$("body").addClass("fullscreen-overlay-body");
	},
	
	_after_hide: function () {
		BetaJS.$("body").removeClass("fullscreen-overlay-body");
	},
	
	unfocus: function () {
		if (this.__destroy_on_unfocus)
			this.destroy();
		else if (this.__hide_on_unfocus)
			this.hide();
	}

});
BetaJS.Views.ListContainerView.extend("BetaJS.Views.FormControlView", {
	
	constructor: function (options) {
		this._inherited(BetaJS.Views.FormControlView, "constructor", options);
		this._model = options.model;
		this._property = options.property;
		this._setOption(options, "validate_on_change", false);
		this._setOption(options, "validate_on_show", false);
		this._setOption(options, "error_classes", "");
		this.control_view = this.addChild(this._createControl(this._model, this._property, options.control_options || {}));
		this.label_view = this.addChild(new BetaJS.Views.LabelView(BetaJS.Objs.extend(options.label_options || {}, {visible: false})));
		if (this.__validate_on_change)
			this._model.on("change:" + this._property, this.validate, this);
		if (this.__validate_on_show)
			this.on("show", this.validate, this);
		this._model.on("validate:" + this._property, this.validate, this);
	},
	
	validate: function () {
		if (this.isActive()) {
			var result = this._model.validateAttr(this._property);
			this.label_view.setVisibility(!result);
			if (result) {
				this.$el.removeClass(this.__error_classes);
			} else {
				this.$el.addClass(this.__error_classes);
				this.label_view.set("label", this._model.getError(this._property));
			}
		}			
	},
	
	_createControl: function (model, property, options) {}
	
});

BetaJS.Views.FormControlView.extend("BetaJS.Views.FormInputView", {
	
	_createControl: function (model, property, options) {
		return new BetaJS.Views.InputView(BetaJS.Objs.extend(options, {
			value: model.binding(property)
		}));
	}
	
});

BetaJS.Views.FormControlView.extend("BetaJS.Views.FormCheckBoxView", {
	
	_createControl: function (model, property, options) {
		return new BetaJS.Views.CheckBoxView(BetaJS.Objs.extend(options, {
			checked: model.binding(property)
		}));
	}
	
});

BetaJS.Views.ListContainerView.extend("BetaJS.Views.ToolBarView", {
	
	_css: function () {
		return {
			"divider": "divider",
			"group": "group"
		};
	},

	constructor: function (options) {
		options = BetaJS.Objs.extend({
			clear_float: true
		}, options || {});
		this._inherited(BetaJS.Views.ToolBarView, "constructor", options);
		this.__group_by_ident = {};
		this.__item_by_ident = {};
		if (options.groups) {
			BetaJS.Objs.iter(options.groups, function (group) {
				this.addGroup(group);
			}, this);
		}
		if (options.items) {
			BetaJS.Objs.iter(options.items, function (item) {
				this.addItem(item);
			}, this);
		}
	},
	
	__group_parent_options: BetaJS.Objs.objectify([
		"group_ident", "group_type", "group_options"
	]),

	addGroup: function (options) {
		var parent_options = {
			group_type: "container"
		};
		var group_options = {};
		BetaJS.Objs.iter(options || {}, function (value, key) {
			if (key in this.__group_parent_options)
				parent_options[key] = value;
			else
				group_options[key] = value;
		}, this);
		var view = null;
		if (parent_options.group_type == "container") {
			group_options.el_classes = this.css("group");
			view = this.addChild(new BetaJS.Views.ListContainerView(group_options), parent_options);
			if (parent_options.group_ident) {
				if (parent_options.group_ident in this.__group_by_ident)
					throw ("Group identifier already registered: " + parent_options.group_ident);
				this.__group_by_ident[parent_options.group_ident] = view;
			}
			return view;			
		} else if (parent_options.group_type == "divider") {
			group_options.el_classes = this.css("divider");
			view = this.addChild(new BetaJS.Views.View(group_options), parent_options);
		} else throw ("Unknown group type: " + parent_options.group_type);
		return view;			
	},
	
	__item_parent_options: BetaJS.Objs.objectify([
		"item_ident", "item_type", "item_group"
	]),
	
	addItem: function (options) {
		var parent_options = {
			item_type: "ButtonView"
		};
		var item_options = {};
		BetaJS.Objs.iter(options || {}, function (value, key) {
			if (key in this.__item_parent_options)
				parent_options[key] = value;
			else
				item_options[key] = value;
		}, this);
		if (parent_options.item_type in BetaJS.Views)
			parent_options.item_type = BetaJS.Views[parent_options.item_type];
		if (BetaJS.Types.is_string(parent_options.item_type))
			parent_options.item_type = BetaJS.Scopes.resolve(parent_options.item_type);
		var parent = this;
		if (parent_options.item_group) {
			if (parent_options.item_group in this.__group_by_ident) {
				parent = this.__group_by_ident[parent_options.item_group];
				var group_options = this.childOptions(parent);
				item_options = BetaJS.Objs.extend(group_options.group_options || {}, item_options);
			} else
				throw ("Unknown group identifier: " + parent_options.item_group);
		}
		var view = parent.addChild(new parent_options.item_type(item_options), parent_options);
		this.delegateEvents(null, view, "item", [view, parent_options]);
		if (parent_options.item_ident)
			this.delegateEvents(null, view, "item-" + parent_options.item_ident, [view, parent_options]);
		if (parent_options.item_ident) {
			if (parent_options.item_ident in this.__item_by_ident)
				throw ("Item identifier already registered: " + parent_options.item_ident);
			this.__item_by_ident[parent_options.item_ident] = view;
		}
		return view;
	},
	
	itemByIdent: function (ident) {
		return this.__item_by_ident[ident];
	}
		
});
