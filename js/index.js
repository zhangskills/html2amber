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

		resultE.setValue(s)
		console.log(s)
	};

	var getPrefixTab = function(num) {
		var s = ''
		for (var i = 0; i < num; i++) {
			s += '\t'
		}
		return s
	}

	var getTagContentLines = function(e) {
		var lines = e.get(0).textContent.split('\n')
		var rLines = []
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i].replace(/(^\s+)|(\s+$)/g, '')
			if (line) {
				rLines.push(line)
			}
		}
		// console.log(lines, rLines)
		return rLines
	};
	var getTagAttr = function(e) {
		var s = '';
		if (e.get(0).attributes.length > 0) {
			var attrs = e.get(0).attributes;
			for (var i = 0; i < attrs.length; i++) {
				var attrName = attrs[i].name;
				var attrVals = attrs[i].value.split(/\s+/);
				for (var j = 0; j < attrVals.length; j++) {
					var attrVal = attrVals[j]
					if (attrVal) {
						s += '[' + attrName + '="' + attrVal + '"]'
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
			var tagName = t.get(0).tagName
			if (tagName) {
				s +='\n'+prefixTab+ tagName.toLowerCase() + getTagAttr(t)
			}
			if (t.get(0).childElementCount > 0) {
				s += show(t.contents(), depth + 1)
			} else {
				var lines = getTagContentLines(t)
				if (lines.length == 1) {
					if (tagName) {
						s += ' ' + lines[0]
					} else {
						s += '\n' + prefixTab + '| ' + lines[0]
					}
				} else {
					for (var i = 0; i < lines.length; i++) {
						var line = lines[i]
						if (line) {
							s += '\n'
							if (tagName) {
								s += '\t'
							}
							s += prefixTab + '| ' + line
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