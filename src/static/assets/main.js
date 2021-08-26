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
		var content = document.createElement('pre');
		if (msg.message[i].filename) {
			content.textContent = 'Filename: ' + msg.message[i].filename + '\n\n' + msg.message[i].data;
			appendElement(msgElement, 'Attachment', content);
		}
		else {
			var div = document.createElement('div');
			div.appendChild(content);

			var canDecode = false;
			try {
					atob(msg.message[i].data);
					canDecode = true;
			} catch (_err) {}

			if (canDecode) {
					var decode = document.createElement('a');
					decode.href = '#';
					decode.textContent = 'Decode as Base64';
					decode.onclick = function() {
							content.textContent = atob(content.textContent);
							decode.style.display = 'none';
							return false;
					};
					div.appendChild(decode);
			}
			content.textContent = msg.message[i].data;
			appendElement(msgElement, 'Message', div);
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
