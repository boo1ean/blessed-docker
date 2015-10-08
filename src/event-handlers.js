var fmt = require('util').format;

module.exports = function setupEventHandlers (docker, bus) {
	bus.on('kill container', killContainer);

	function killContainer (container) {
		var containerId = container.Id;
		var container = docker.getContainer(container.Id);

		container.kill(function emitInfoMessage (err) {
			if (err) {
				return bus.emit('err', err.json);
			}

			bus.emit('containers updated');
			bus.emit('info', fmt('Killed container %s ', containerId));
		});
	}
};
