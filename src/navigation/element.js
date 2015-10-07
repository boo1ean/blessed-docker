var blessed = require('blessed');

module.exports = function createElement (menuCommands) {
	return blessed.listbar({
		bottom: 0,
		left: 0,
		width: '100%',
		height: 'shrink',
		autoCommandKeys: true,
		commands: menuCommands
	});
};
