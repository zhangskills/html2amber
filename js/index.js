$(function() {

	var editor = ace.edit("editor");
	// editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/html");

	editor.setValue('<div class="row">\n <div class="col-xs-12 col-sm-6 col-md-8">.col-xs-12 .col-sm-6 .col-md-8</div>\n <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>\n </div>\n <div class="row">\n <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>\n <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>\n <!-- Optional: clear the XS cols if their content doesn\'t match in height -->\n <div class="clearfix visible-xs-block"></div>\n <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>\n </div>')
	var resultE = ace.edit('result')
		// resultE.setTheme("ace/theme/monokai");
	resultE.getSession().setMode("ace/mode/jade");
	resultE.setReadOnly(true);

	var convert = function() {
		var html = editor.getValue();
		e = $(html);
		var s = show(e);

		resultE.setValue(s.substr(1))
		// console.log(s.substr(1))
	};

	var getPrefixTab = function(num) {
		var s = '';
		for (var i = 0; i < num; i++) {
			s += '\t';
		}
		return s;
	};
	var trim = function(s) {
		return s.replace(/(^\s*)|(\s*$)/g, '');
	};
	var foreach = function(items, fn) {
		for (var i = 0, len = items.length; i < len; i++) {
			fn(items[i]);
		}
	};

	var getTagContentLines = function(e) {
		var lines = trim(e.textContent).split('\n');
		var rLines = [];
		foreach(lines, function(line) {
			if (line) {
				rLines.push(line);
			}
		});
		// console.log(lines, rLines);
		return rLines;
	};

	var getTagNameAndAttr = function(e) {
		var nodeName = e.nodeName;
		var s = nodeName.toLowerCase();
		if (s == '#comment') {
			return '//';
		} else if (nodeName.indexOf('#') == 0) {
			return '';
		} else if (e.attributes.length > 0) {
			var attrs = e.attributes;
			foreach(attrs, function(attr) {
				var tagName = attr.name.toLowerCase();
				if (tagName == 'id') {
					tagName = '#'
				} else if (tagName == 'class') {
					tagName = '.'
				} else {
					s += '[' + tagName + '="' + attr.value + '"]';
					return
				}
				foreach(attr.value.split(/\s+/), function(attrVal) {
					if (attrVal) {
						s += tagName + attrVal
					}
				});
			});
		}
		// console.log(s);
		return s;
	};


	var show = function(e, depth) {
		if (!depth) {
			depth = 0;
		}
		var s = '';
		e.each(function() {
			var t = $(this);
			var prefixTab = getPrefixTab(depth);
			var tagNameAndAttr = getTagNameAndAttr(t.get(0));
			var prefix = '';
			if (tagNameAndAttr) {
				prefix = '\n' + prefixTab + tagNameAndAttr;
			}

			if (t.get(0).childElementCount > 0) {
				s += prefix + show(t.contents(), depth + 1);
			} else {
				var lines = getTagContentLines(t.get(0))
				if (tagNameAndAttr) {
					s += prefix;
				}
				if (prefix && lines.length == 1) {
					s += ' ' + lines[0];
				} else if (lines.length > 0) {
					foreach(lines, function(line) {
						if (line) {
							s += '\n' + prefixTab + '| ' + line;
						}
					});
				}
			}
		})
		return s
	}

	convert();
	$('#handle').click(convert);
});