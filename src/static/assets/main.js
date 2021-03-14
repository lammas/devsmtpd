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

	var content = document.createElement('pre');
	content.textContent = msg.message;
	appendElement(msgElement, 'Message', content);
	container.appendChild(msgElement);
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
