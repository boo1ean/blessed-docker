var fmt = require('util').format;

module.exports = function setupEventHandlers (docker, bus) {
	bus.on('kill container', killContainer);

	function killContainer (container) {
		bus.emit('message', fmt('Killed container %s ', container.Id));
	}
};
