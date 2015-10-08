var fmt = require('util').format;

module.exports = function setupEventHandlers (docker, bus) {
	bus.on('kill container', performContainerAction('kill'));
	bus.on('restart container', performContainerAction('restart'));

	// Container actions factory function.
	// Returns function which performs specified action on container
	function performContainerAction (action) {
		return function performAction (container) {
			var containerId = container.Id;
			var container = docker.getContainer(container.Id);

			container[action](function emitContainerActionResultEvents (err) {
				if (err) {
					bus.emit('err', err.json);
				}

				bus.emit('containers updated');
				bus.emit('info', fmt('%sed container %s ', action, containerId));
			});
		}
	}
};
