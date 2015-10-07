var blessed = require('blessed');

module.exports = function createElement () {
	return new blessed.list({
		label: '{bold}{cyan-fg}Containers{/cyan-fg}{/bold} ',
		tags: true,
		width: 'shrink',
		height: '90%',
		keys: true,
		vi: true,
		interactive: true,
		style: {
			item: {
				hover: {
					bg: 'blue'
				}
			},
			selected: {
				bg: 'blue',
				bold: true
			}
		}
	});
};
