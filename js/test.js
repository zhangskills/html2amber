$(function() {
	var trim = function(s) {
		return s.replace(/(^\s*)|(\s*$)/g, '');
	};
	var foreach = function(items, fn) {
		for (var i = 0, len = items.length; i < len; i++) {
			// console.log(items[i], toString.apply(items[i]))
			fn(items[i]);
		}
		// console.log('')
	};
	var getPrefixTab = function(num) {
		var s = '';
		for (var i = 0; i < num; i++) {
			s += '\t';
		}
		return s;
	};

	var getNodeNameAndAttr = function(node) {
		if (node.nodeName.indexOf('#') == 0) {
			if (node.nodeName == '#comment') {
				return '//';
			}
			return '|';
			// return '|'+node.nodeName;
		}
		var s = node.nodeName.toLowerCase();
		if (node.id) {
			if (node.id.indexOf(' ') > 0) {
				s += '[id="' + node.id + '"]';
			} else {
				s += '#' + node.id;
			}
		}
		if (node.classList) {
			foreach(node.classList, function(cl) {
				s += '.' + cl;
			});
		}
		foreach(node.attributes, function(attr) {
			if (attr.nodeName != 'id' && attr.nodeName != 'class') {
				s += '[' + attr.nodeName + '="' + attr.value + '"]';
			}
		});
		return s;
	};

	var isEmptyTag = function(nodeNameAndAttr) {
		var emptyTag = ['br', 'input', 'img', 'link', 'meta']
		var b = false;
		foreach(emptyTag, function(tag) {
			if (!b && nodeNameAndAttr.indexOf(tag) == 0) {
				b = true;
			}
		});
		return b;
	};

	var html2amber = function(node, depth) {
		if (!node) {
			return '';
		}
		if (!depth) {
			depth = 0;
		}
		var s = '';
		if (toString.apply(node) === '[object NodeList]') {
			foreach(node, function(n) {
				s += html2amber(n);
			});
			return s;
		}

		var prefixTab = getPrefixTab(depth);
		var nodeNameAndAttr = getNodeNameAndAttr(node);
		if (node.childNodes.length <= 1) {
			var content = trim(node.textContent);
			if (isEmptyTag(nodeNameAndAttr)) {
				s += prefixTab + nodeNameAndAttr;
			} else if (content) {
				s += prefixTab + nodeNameAndAttr + ' ' + content.replace(/\s+/, ' ') + '\n';
			}
		} else if (node.childNodes.length > 1) {
			s += prefixTab + nodeNameAndAttr + '\n';

			foreach(node.childNodes, function(node) {
				s += html2amber(node, depth + 1);
			});
		} else {
			console.log(node);
		}
		return s;
	};

	var editor = ace.edit("editor");
	// editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/html");

	editor.setValue('<div class="row">\n <div class="col-xs-12 col-sm-6 col-md-8">.col-xs-12 .col-sm-6 .col-md-8</div>\n <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>\n </div>\n <div class="row">\n <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>\n <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>\n <!-- Optional: clear the XS cols if their content doesn\'t match in height -->\n <div class="clearfix visible-xs-block"></div>\n <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>\n </div>')

	var resultE = ace.edit('result')
		// resultE.setTheme("ace/theme/monokai");
	resultE.getSession().setMode("ace/mode/jade");
	resultE.setReadOnly(true);


	var iframe = document.getElementById('html2amber_iframe');
	idocument = iframe.contentDocument;
	var parser = new DOMParser();

	function writeIframe(content) {
		idocument.open();
		idocument.write(content)
		idocument.close();
	}

	$('#handle').click(function() {
		var html = editor.getValue();
		doc = parser.parseFromString(html, "text/xml");
		if (doc.getElementsByTagName('parsererror').length == 1) {
			console.log('iframe')
			writeIframe(editor.getValue())
			s = html2amber(idocument.body.childNodes);
		} else {
			console.log('doc')
			s = html2amber(doc.documentElement);
		}

		resultE.setValue(s)
	}).click();


});