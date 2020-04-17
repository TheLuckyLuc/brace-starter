const util = require('util');

const rimraf = require('rimraf');
const rmdir = util.promisify(rimraf);

module.exports = (path) => {
	return rmdir(path);
};
