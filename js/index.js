var str2dom = function(str) {

};


var convert = function() {
	var html = $('#editor').val();
	e = $(html)
	var s = show(e)
	console.log(s)
};

var getTagContent = function(e) {
	return e.html()
}
var getPrefixTab = function(num) {
	var s = ''
	for (var i = 0; i < num; i++) {
		s += '\t'
	}
	return s
}

var show = function(e, depth) {
	if (!depth) {
		depth = 0
	}
	var s = ''
	e.each(function() {
		var t = $(this)
		var tagName = t.get(0).tagName
		s += getPrefixTab(depth)
		if (tagName) {
			s += tagName
		}
		if (t.get(0).childElementCount > 0) {
			s += show(t.contents(), depth + 1)
		} else {
			var lines = t.get(0).textContent.split('\n')
			var rLines = []
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i].replace(/(^\s+)|(\s+$)/g, '')
				if (line) {
					rLines.push(line)
				}
			}
			// console.log(tagName, t.get(0).textContent, lines, rLines)
			if (rLines.length == 1) {
				if (tagName) {
					s += '\t' + rLines[0]
				} else {
					s += '\n' + getPrefixTab(depth) + '| ' + rLines[0]
				}
			} else {
				for (var i = 0; i < rLines.length; i++) {
					var line = rLines[i]
					if (line) {
						s += '\n'
						if (tagName) {
							s += '\t'
						}
						s += getPrefixTab(depth) + '| ' + line
					}
				}
			}
			s+='\n'
		}
	})
	return s
}

$(function() {
	var html = ""
	convert()
});