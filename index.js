var blessed = require('blessed');
var Promise = require('bluebird');

var docker = require('./src/docker-client');
var bus = require('./src/event-bus');
var setupEventHandlers = require('./src/event-handlers');
var containersListController = require('./src/containers');
var imagesListController = require('./src/images');
var navigationController = require('./src/navigation');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'Blessed Docker';

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

var layout = blessed.box({
	parent: screen,
	width: '100%',
	height: '100%'
});

var subNavigationContainer = blessed.box({
	parent: layout,
	width: '100%',
	height: 'shrink',
	content: 'SUBTAV',
	padding: {
		left: 1,
		right: 1
	},
	bottom: 2
});

var navigationContainer = blessed.box({
	parent: layout,
	width: '100%',
	height: 'shrink',
	bottom: 0
});

var infoContainer = blessed.box({
	parent: layout,
	width: "100%",
	height: 'shrink',
	bottom: 4,
	padding: {
		left: 1,
		right: 1
	},
	content: 'infa4'
});

var contentContainer = blessed.box({
	parent: layout,
	width: '100%',
	height: 'shrink',
	border: 'line',
	padding: {
		left: 1,
		right: 1
	}
});

var menuCommands = {
	'Containers': attachController(containersListController),
	'Images': attachController(imagesListController)
};

// Setup initial ui (containers list view) 
navigationController(bus, menuCommands).then(createAttachHook(navigationContainer));
containersListController(bus).then(createAttachHook(contentContainer));

bus.on('message', renderIntoInfoContainer);
setupEventHandlers(docker, bus);

function attachController (controller) {
	return function attachElement () {
		controller(bus).then(createAttachHook(contentContainer));
	}
}

function createAttachHook (parent) {
	return function attachElement (el) {
		// Clean up container
		parent.children.forEach(removeChild);

		// Append new element focus on it and render
		parent.append(el);
		el.focus();
		screen.render();
	}

	function removeChild (child) {
		parent.remove(child);
	}
}

function renderIntoInfoContainer (message) {
	infoContainer.setContent(message);
	screen.render();
}
