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
screen.key(['q', 'C-c'], function(ch, key) {
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
	height: '100%-6',
	border: 'line',
	padding: {
		left: 1,
		right: 1
	}
});

var prompt = blessed.question({
	parent: screen,
	border: 'line',
	height: 'shrink',
	width: 'half',
	top: 'center',
	left: 'center',
	label: ' {blue-fg}Confirmation{/blue-fg} ',
	padding: 1,
	tags: true,
	keys: true,
	vi: true
});

var menuCommands = {
	'Containers': attachController(containersListController),
	'Images': attachController(imagesListController)
};

var context = {
	bus: bus,
	askConfirmation: askConfirmation
};

// Setup initial ui (containers list view) 
navigationController(context, menuCommands).then(createAttachHook(navigationContainer));
containersListController(context).spread(createAttachHook(contentContainer));

bus.on('info', renderInfo);
bus.on('warn', renderWarning);
bus.on('err', renderError);

setupEventHandlers(docker, bus);

// Refetch containers list
bus.on('containers updated', function syncList () {
	containersListController(context).spread(createAttachHook(contentContainer));
});

function attachController (controller) {
	return function attachElement () {
		controller(context).spread(createAttachHook(contentContainer));
	}
}

function createAttachHook (parent) {
	return function attachElement (el, subCommands) {
		// Clean up container
		parent.children.forEach(removeChild);
		subNavigationContainer.children.forEach(removeChild);

		// Append new element focus on it and render
		parent.append(el);
		el.focus();

		subNavigationContainer.append(createSubnavElement(subCommands));
		screen.render();
	}

	function removeChild (child) {
		parent.remove(child);
	}
}

function renderInfo (message) {
	infoContainer.style.bg = '#00875f';
	infoContainer.setContent(message);
	screen.render();
}

function renderWarning (message) {
	infoContainer.style.bg = '#d78700';
	infoContainer.setContent(message);
	screen.render();
}

function renderError (message) {
	infoContainer.style.bg = '#d75f00';
	infoContainer.setContent(message);
	screen.render();
}

function createSubnavElement (commands) {
	return blessed.listbar({
		parent: layout,
		width: 'shrink',
		height: 'shrink',
		scrollable: false,
		style: {
			item: { fg: 'green' },
			selected: { fg: 'green' }
		},
		commands: commands
	});
}

function askConfirmation (question) {
	return new Promise (function (resolve) {
		prompt.ask(question, function (err, result) {
			resolve(result);
			screen.render();
		});
	});
}
