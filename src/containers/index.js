var blessed = require('blessed');
var createElement = require('./element')
var containersResource = require('./resource');

module.exports = function containersListController (bus) {
	return containersResource.query().then(initializeListView);

	function initializeListView (containers) {
		var listView = createElement();

		listView.setItems(containers.map(getContainerName));
		listView.key(['d'], killContainer);

		function killContainer () {
			var containerIndex = this.selected;
			bus.emit('kill container', containers[containerIndex]);
		}

		return listView;
	}
};

function getContainerName (container) {
	return container.Names[0];
}
