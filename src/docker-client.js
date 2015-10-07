var Promise = require('bluebird');
var Docker = require('dockerode');

module.exports = Promise.promisifyAll(new Docker({
}));
