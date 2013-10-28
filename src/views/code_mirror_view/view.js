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