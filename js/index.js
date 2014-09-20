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
		var s = ''
		for (var i = 0; i < num; i++) {
			s += '\t'
		}
		return s
	};
	var trim = function(s) {
		return s.replace(/(^\s*)|(\s*$)/g, '');
	};

	var getTagContentLines = function(e) {
		var lines = trim(e.get(0).textContent).split('\n')
		var rLines = []
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (line) {
				rLines.push(line)
			}
		}
		// console.log(lines, rLines)
		return rLines
	};

	var getTagNameAndAttr = function(e) {
		var nodeName = e.get(0).nodeName;
		var s = nodeName.toLowerCase();
		if (s == '#comment') {
			return '//';
		} else if (nodeName.indexOf('#') == 0) {
			return ''
		} else if (e.get(0).attributes.length > 0) {
			var attrs = e.get(0).attributes;
			for (var i = 0; i < attrs.length; i++) {
				var attrVals = attrs[i].value.split(/\s+/);
				for (var j = 0; j < attrVals.length; j++) {
					var attrVal = attrVals[j]
					if (attrVal) {
						s += '[' + attrs[i].name + '="' + attrVal + '"]'
					}
				}
			}
		}
		return s;
	};


	var show = function(e, depth) {
		if (!depth) {
			depth = 0
		}
		var s = ''
		e.each(function() {
			var t = $(this)
			var prefixTab = getPrefixTab(depth)
			var tagNameAndAttr = getTagNameAndAttr(t);
			var prefix = '';
			if (tagNameAndAttr) {
				prefix = '\n' + prefixTab + tagNameAndAttr;
			}

			if (t.get(0).childElementCount > 0) {
				s += prefix + show(t.contents(), depth + 1)
			} else {
				var lines = getTagContentLines(t)
				if (lines.length == 1) {
					s += prefix + ' ' + lines[0]
				} else if (lines.length > 1) {
					s += prefix
					for (var i = 0; i < lines.length; i++) {
						if (lines[i]) {
							s += '\n' + prefixTab + '| ' + lines[i]
						}
					}
				}
			}
		})
		return s
	}

	convert();
	$('#handle').click(convert);
});