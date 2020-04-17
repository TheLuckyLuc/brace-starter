const util = require('util');
const path = require('path');
const fs = require('fs');
const copyFile = util.promisify(fs.copyFile);

module.exports = (src, dest, files) => {
	return Promise.all(
		files.map((file) => {
			return copyFile(path.join(src, file), path.join(dest, file));
		})
	);
};
