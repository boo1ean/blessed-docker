var blessed = require('blessed');

module.exports = function createElement () {
	return new blessed.list({
		width: 'shrink',
		height: '100%-2',
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
