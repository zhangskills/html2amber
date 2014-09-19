$(function() {

	var editor = ace.edit("editor");
	// editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/html");

	var resultE = ace.edit('result')
		// resultE.setTheme("ace/theme/monokai");
	resultE.getSession().setMode("ace/mode/jade");
	resultE.setReadOnly(true);

	var convert = function() {
		var html = editor.getValue();
		e = $(html);
		var s = show(e);

		resultE.setValue(s)
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
						if (attrName == 'id') {
							s += '#' + attrVal
						} else if (attrName == 'class') {
							s += '.' + attrVal
						} else {
							s += '[' + attrName + '="' + attrVal + '"]'
						}
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
			s += prefixTab
			if (tagName) {
				s += tagName.toLowerCase() + getTagAttr(t)
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
				s += '\n'
			}
		})
		return s
	}

	$('#handle').click(convert);
});