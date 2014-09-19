var str2dom = function(str) {

};


var convert = function() {
	var html = $('#editor').val();
	e = $(html)
	console.log(e)
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
		if (!tagName) {
			tagName = '==|'
		}
		s += getPrefixTab(depth) + tagName
		if (t.get(0).childElementCount > 0) {
			s += '\n' + show(t.contents(), depth + 1)
		} else {
			// console.log(t.get(0).textContent)
			var lines = t.get(0).textContent.split('\n')
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i].replace(/(^\s*)|(\s*$)/g, '');
				if (line) {
					s += '\n' + getPrefixTab(depth) + '|\t' + line
				}
			}
		}
		s += '\n'
	})
	return s
}

$(function() {
	var html = ""
	convert()
});