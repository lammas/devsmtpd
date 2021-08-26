function appendItem(container, key, value, className) {
	var row = document.createElement('tr');

	var keyElement = document.createElement('td');
	keyElement.textContent = key;
	keyElement.classList.add('key');

	var valueElement = document.createElement('td');
	valueElement.textContent = value;
	valueElement.classList.add('value');

	if (className) {
		keyElement.classList.add(className);
		valueElement.classList.add(className);
	}

	row.appendChild(keyElement);
	row.appendChild(valueElement);
	container.appendChild(row);
}

function appendElement(container, key, element, className) {
	var row = document.createElement('tr');

	var keyElement = document.createElement('td');
	keyElement.textContent = key;
	keyElement.classList.add('key');

	var valueElement = document.createElement('td');
	valueElement.appendChild(element);
	valueElement.classList.add('value');

	if (className) {
		keyElement.classList.add(className);
		valueElement.classList.add(className);
	}

	row.appendChild(keyElement);
	row.appendChild(valueElement);
	container.appendChild(row);
}

function canDecodeAsBase64(data) {
	try {
		return !!atob(data);
	}
	catch (_err) {}
	return false;
}

function addDecodeBase64(div, display, data) {
	var decode = document.createElement('a');
	decode.href = '#';
	decode.textContent = 'decode base64';
	decode.onclick = function() {
		try {
			display.textContent = atob(data);
			decode.style.display = 'none';
		} catch (_err) {}
		return false;
	};
	div.appendChild(decode);
}

function addMessage(container, msg) {
	var msgElement = document.createElement('table');

	appendItem(msgElement, 'Timestamp', msg.timestamp);
	appendItem(msgElement, 'From', msg.from);
	for (var i = 0; i < msg.to.length; ++i) {
		appendItem(msgElement, 'To', msg.to[i]);
	}

	appendElement(msgElement, 'Headers', document.createElement('br'), 'header');
	for (var name in msg.headers) {
		appendItem(msgElement, name, msg.headers[name], 'header');
	}

	for (var i = 0; i < msg.message.length; ++i) {
		var div = document.createElement('div');
		var content = document.createElement('pre');
		div.appendChild(content);

		if (msg.message[i].filename) {
			content.textContent = 'Filename: ' + msg.message[i].filename + '\n\n' + msg.message[i].data;
			appendElement(msgElement, 'Attachment', div);
		}
		else {
			content.textContent = msg.message[i].data;
			appendElement(msgElement, 'Message', div);
		}

		if (canDecodeAsBase64(msg.message[i].data)) {
			addDecodeBase64(div, content, msg.message[i].data);
		}

		container.appendChild(msgElement);
	}

}

function load() {
	var container = document.getElementById('container');
	fetch('./api/messages')
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		container.innerHTML = '';
		for (var i = 0; i < data.messages.length; ++i) {
			addMessage(container, data.messages[i]);
		}
	})
	.catch(function(err) {
		console.error('Unable to fetch messages:', err);
	});
}
