Scoped.define("module:Codemirror", [
    "dynamics:Dynamic",
    "base:Strings",
    "base:Timers"
], function (Dynamic, Strings, Timers, scoped) {
	
	var Cls = Dynamic.extend({scoped: scoped}, {
		
		template : "<div><textarea>{{value}}</textarea></div>",
		
		initial : {
			
			attrs : {
				language: "html",
				value: ""
			},
			
			create : function() {
				if (this.initialContent)
					this.set("value", this.initialContent);
				if (this.get("trim") !== undefined)
					this.set("value", Strings.nltrim(this.get("value")));
				this.set("readonly", false);
				this.on("change:readonly", function(value) {
					this.codemirror.setOption("readOnly", value);
				}, this);
				if (this.get("auto-refresh") !== undefined) {
					this.auto_destroy(new Timers.Timer({
						delay : 100,
						fire : function () {
							this.call("refresh");
						},
						context : this
					}));
				}
				var element = this.element().find("textarea").get(0);
				var self = this;
				var language = this.cls.languages[this.get("language")] || {
					mode : this.get("language")
				};
				
				this.codemirror = CodeMirror(
						function(elt) {
							element.parentNode.replaceChild(elt, element);
						},
						{
							value : this.get("value"),
							mode : language.mode,
							tabMode : 'indent',
							readOnly : this.get("readonly"),
							highlightSelectionMatches : true,
							autoCloseBrackets : true,
							autoCloseTags : true,
							lineNumbers : true,
							// lineWrapping: true,
							extraKeys : {
								"Ctrl-Q" : function(cm) {
									cm
											.foldCode(
													cm.getCursor(),
													CodeMirror[language.fold]);
								},
								"Ctrl-Space" : function(cm) {
									CodeMirror.commands.autocomplete = function(
											cm) {
										CodeMirror
												.showHint(
														cm,
														CodeMirror[language.hint]);
									};
								}
							},
							foldGutter : true,
							gutters : [ language.gutters,
									"CodeMirror-linenumbers",
									"CodeMirror-foldgutter" ],
							lintWith : language.lint
						});
				this.codemirror.on("gutterClick", function(cm,
						where) {
					cm.foldCode(where, CodeMirror[language.fold]);
				});
				this.codemirror.setSize("100%", "100%");
				this.__suppressUpdate = false;
				this.codemirror.on("change", function() {
					self.__suppressUpdate = true;
					self.set("value", self.codemirror.getValue());
					self.__suppressUpdate = false;
				});
				this.on("change:value", function(value) {
					if (!this.__suppressUpdate)
						this.codemirror.setValue(value);
				}, this);
				this.codemirror.setSize("100%", "100%");
			},

			functions : {

				format : function() {
					this.codemirror.autoFormatRange({
						line : 0,
						ch : 0
					}, {
						line : this.codemirror.lineCount() - 1,
						ch : null
					});
					this.codemirror.setSelection({
						line : 0,
						ch : 0
					});
				},

				refresh : function() {
					if (this.codemirror)
						this.codemirror.refresh();
				}

			}
		}
	
	}, {
		languages : {
			html : {
				fold : 'tagRangeFinder',
				mode : "text/html",
				hint : 'htmlHint'
			},
			javascript : {
				fold : 'braceRangeFinder',
				mode : "javascript",
				hint : 'javascriptHint',
				gutters : "CodeMirror-lint-markers",
				lint : "javascriptValidator"
			},
			php : {
				fold : 'tagRangeFinder',
				mode : "application/x-httpd-php",
				hint : 'htmlHint'
			}
		}
	});
	
	Cls.register("ba-codemirror");
	
	return Cls;

});
