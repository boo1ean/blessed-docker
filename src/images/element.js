var blessed = require('blessed');

module.exports = function createElement () {
	return new blessed.list({
		label: '{bold}{cyan-fg}Containers{/cyan-fg}{/bold} ',
		tags: true,
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
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
