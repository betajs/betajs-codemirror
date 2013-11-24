/*!
  betajs-codemirror - v0.0.1 - 2013-11-24
  Copyright (c) Victor Lingenthal
  MIT Software License.
*/
BetaJS.Templates.Cached = BetaJS.Templates.Cached || {};
BetaJS.Templates.Cached['preview-template'] = '  <iframe class="preview-iframe">    </iframe>  <div class="preview-overlay" style="display:none">  </div> ';

BetaJS.Templates.Cached['simple-code-mirror-view-template'] = '  <div class="simple-code-mirror-main">   <textarea></textarea>  </div> ';

BetaJS.Views.View.extend("BetaJS.Views.SimpleCodeMirrorView", {
	_templates : {
		"default" : BetaJS.Templates.Cached["simple-code-mirror-view-template"]
	},

	constructor : function(options) {
		this._inherited(BetaJS.Views.SimpleCodeMirrorView, "constructor", options);
		this._setOptionProperty(options, "content", "");
		this._setOption(options, "language", "");
		this._setOptionProperty(options, "readonly", false);
		this.on("change:readonly", function (value) {
			this.__code_mirror.setOption("readOnly", value);
			if (value)
				this.$(".cm-s-default").addClass("simple-code-mirror-readonly");
			else
				this.$(".cm-s-default").removeClass("simple-code-mirror-readonly");
		}, this);
	},

	_render : function() {
		this._inherited(BetaJS.Views.SimpleCodeMirrorView, "_render");
		this.__initializeCodeMirror();
	},

	__initializeCodeMirror : function() {
		var element = this.$("textarea").get(0);
		var self = this;
		function fold(cm, where) {
			cm.foldCode(where, self.__getRangeFinder());
		}
		this.__code_mirror = CodeMirror(function(elt) {
			element.parentNode.replaceChild(elt, element);
		}, {
			value : this.get("content"),
			mode : this.__getMode(),
			tabMode : 'indent',
			readOnly: this.get("readonly"),
			highlightSelectionMatches : true,
			autoCloseBrackets : true,
			autoCloseTags : true,
			lineNumbers : true,
			//lineWrapping: true,
			extraKeys : {
				"Ctrl-Q" : function(cm) {
					fold(cm, cm.getCursor());
				},
				"Ctrl-Space" : "__autoComplete"
			},
			foldGutter: true,
			gutters : [this.__getGutters(),"CodeMirror-linenumbers", "CodeMirror-foldgutter"],
			lintWith : this.__getLintWith()
		});
		this.__code_mirror.on("gutterClick", fold);
		this.__code_mirror.setSize("100%", "100%");
		this.__suppress_update = false;
		this.__code_mirror.on("change", function () {
			self.__suppress_update = true;
			self.set("content", self.__code_mirror.getValue());
			self.__suppress_update = false;
		});
		this.on("change:content", function (value) {
			if (!this.__suppress_update)
				this.__code_mirror.setValue(value);
		}, this);
	},
	
	__getMode : function() {
		if (this.__language == "html")
			return "text/html";
		return this.__language;
	},

	// TODO: Fix Autocomplete
	__autoComplete : function() {
		if (this.__language == "html")
			CodeMirror.commands.autocomplete = function(cm) {
				CodeMirror.showHint(cm, CodeMirror.htmlHint);
			};
		else if (this.__language == "javascript")
			CodeMirror.commands.autocomplete = function(cm) {
				CodeMirror.showHint(cm, CodeMirror.javascriptHint);
			};
	},

	__getRangeFinder : function() {
		return this.__language == "html" ? CodeMirror.tagRangeFinder : CodeMirror.braceRangeFinder;
	},
	
	__getGutters : function() {
		// TODO: Only show linter if there are errors
		return this.__language == "javascript" ? "CodeMirror-lint-markers" : null;
	},
	
	__getLintWith : function() {
		return this.__language == "javascript" ? CodeMirror.javascriptValidator : null;
	},

	__content : function() {
		return this.__code_mirror.getValue();
	},

	formatContent : function() {
		var totalLines = this.__code_mirror.lineCount() - 1;
    	this.__code_mirror.autoFormatRange({line:0, ch:0}, {line: totalLines, ch: null});
    	this.__code_mirror.setSelection({line:0, ch:0});
	}   
	
});

BetaJS.Views.ListContainerView.extend("BetaJS.Views.CodeMirrorView", {
	
	constructor: function(options) {
		options = options || {};
		options.alignment = 'vertical';
		options.positioning = "computed";
		this._inherited(BetaJS.Views.CodeMirrorView, "constructor", options);
		this.toggle_bar_view = this.addChild(new BetaJS.Views.ListContainerView({
			el_classes: "code-mirror-header",
			visible: false
		}));
/*		
		this.select_language_view = this.toggle_bar_view.addChild(new BetaJS.Views.View({
			html: '<select style="margin: 6px;"><option>HTML</option><option>HAML</option></select>',
		}));
*/		/*
		this.toggle_button_view = this.addChild(new BetaJS.Views.ButtonView({
			button_container_element: "span",
			children_classes: 'code-mirror-icon-record'
		}), {
			type: 'ignore'
		});
		*/
		/*
		this.toggle_button_view.on("click", function () {
			this.toggle_bar_view.toggle();
		}, this);
		*/
		this._setOptionProperty(options, "readonly", false);
		this._setOptionProperty(options, "content", "");
		var language = options["language"] || '';
		this.addChild(new BetaJS.Views.View({
			html: '<span class="code-mirror-window-label">' + language + '</span>'
		}), {
			type: "ignore"
		});	
		this.code_mirror_view = this.addChild(new BetaJS.Views.SimpleCodeMirrorView({
			content: this.binding("content"),
			language: language,
			readonly: this.binding("readonly"),
			el_classes: 'simple-code-mirror-main'
		}), {
			type: "dynamic"
		});
	},
	
	formatContent : function() {
		this.code_mirror_view.formatContent();
	}
	
});
BetaJS.Views.View.extend("BetaJS.Views.PreviewView", {
	_templates : {
		"default" : BetaJS.Templates.Cached["preview-template"]
	},

	update: function (html_content, javascript_content, css_content, javascript_sources, css_sources) {
		this.invalidate();
		var iframe = this.$("iframe");
		var inter = window.setInterval(function () {
			var iframeDoc = iframe.get(0).contentDocument || iframe.get(0).contentWindow.document;
            if (iframeDoc.readyState == "complete") {
                window.clearInterval(inter);
                var $head = iframe.contents().find("head");
                var head = $head[0];
                var $body = iframe.contents().find("body");
                var body = $body[0];
                var load_count = 0;
                BetaJS.Objs.iter(javascript_sources || [], function (source) {
					var script = document.createElement('script');
					script.src = source;
					load_count++;
					script.onload = function () {
						load_count--;
						main_script();
					};
					head.appendChild(script);
                }, this);
                
                BetaJS.Objs.iter(css_sources || [], function (source) {
					var style = document.createElement('link');
					style.href = source;
					style.rel = "stylesheet";
					head.appendChild(style);
                }, this);
				$body.html(html_content);
				$body.append("<style>" + css_content + "</style>");
				var main_script = function () {
					if (load_count === 0) {
						var script = document.createElement('script');
						script.text = javascript_content;
						body.appendChild(script);
					}
				};
				main_script();
			}
		}, 10);		
	},
	
	_bindParent: function () {
		this.getParent().on("dragstart", this.show_overlay, this).on("dragstop", this.hide_overlay, this);		
	},

	hide_overlay: function () {
		this.$(".preview-overlay").css("display", "none");
	},
	
	show_overlay: function () {
		this.$(".preview-overlay").css("display", "");
	}

});
