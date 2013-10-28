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
				this.$(".cm-s-default").addClass("simple-code-mirror-readonly")
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
				"Ctrl-Space" : "__autoComplete",
			},
			foldGutter: true,
			gutters : [this.__getGutters(),"CodeMirror-linenumbers", "CodeMirror-foldgutter"],
			lintWith : this.__getLintWith(),
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
