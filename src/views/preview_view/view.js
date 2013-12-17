BetaJS.Views.View.extend("BetaJS.Views.PreviewView", {
	_templates : {
		"default" : BetaJS.Templates.Cached["preview-template"]
	},

	update: function (html_content, javascript_content, css_content, javascript_sources, css_sources) {
		this.invalidate();
		var self = this;
		var iframe = this.$("iframe");
		var inter = window.setInterval(function () {
			var iframeDoc = iframe.get(0).contentDocument || iframe.get(0).contentWindow.document;
            if (iframeDoc.readyState == "complete") {
                window.clearInterval(inter);
				self.trigger("attached", iframe.get(0));
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
                });
                
                BetaJS.Objs.iter(css_sources || [], function (source) {
					var style = document.createElement('link');
					style.href = source;
					style.rel = "stylesheet";
					head.appendChild(style);
                });
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
	
	iframeWindow: function () {
		return this.$("iframe").get(0).contentWindow;
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
