var docker = require('../docker-client');

module.exports = {
	query: query
};

function query () {
	return docker.listContainersAsync();
}
