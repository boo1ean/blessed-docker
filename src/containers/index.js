var blessed = require('blessed');
var createElement = require('./element')
var containersResource = require('./resource');
var blessed = require('blessed');

module.exports = function containersListController (context) {
	return containersResource.query().then(initializeListView);

	function initializeListView (containers) {
		var containersCommands = {
			'kill': { keys: ['d'], callback: createEventTrigger('kill container') },
			'restart': { keys: ['r'], callback: createEventTrigger('restart container') },
			//'full commands list': { keys: ['?'], callback: createEventTrigger('additional commands') }
		};

		var listView = createElement();
		listView.setItems(containers.map(getContainerName));

		return [listView, containersCommands];

		function createEventTrigger (name) {
			return function triggerEvent () {
				if (!containers.length) {
					return context.bus.emit('warn', 'No containers selected');
				}

				context.askConfirmation(name + '?').then(function actuallyTrigger (ok) {
					if (ok) {
						var containerIndex = listView.selected;
						context.bus.emit(name, containers[containerIndex]);
					}
				});
			}
		}
	}
};

function getContainerName (container) {
	return container.Names[0];
}
