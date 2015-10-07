var Promise = require('bluebird');
var createElement = require('./element');

module.exports = function navigationController (bus, menuCommands) {
	return Promise.resolve(createElement(menuCommands));
}
