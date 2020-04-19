// Native
const path = require('path');

// NPM
const fs = require('fs-extra');

module.exports = (src, dest, files) => {
	return Promise.all(
		files.map((file) => {
			return fs.copy(path.join(src, file), path.join(dest, file));
		})
	);
};
