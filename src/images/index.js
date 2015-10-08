var _ = require('lodash');
var blessed = require('blessed');
var createElement = require('./element')
var containersResource = require('./resource');

module.exports = function containersListController () {
	return containersResource.query().then(initializeListView);

	function initializeListView (images) {
		var listView = createElement();

		images = _.pluck(images, 'RepoTags').map(_.first);

		listView.setItems(images);

		return [listView];
	}
};
