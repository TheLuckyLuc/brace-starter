const util = require('util');
const fs = require('fs-extra');
const path = require('path');

const readdir = util.promisify(fs.readdir);
const remove = util.promisify(fs.remove);

(async () => {
	const { INSTALL_DIR } = require('../constants.json');

	const items = await readdir(INSTALL_DIR);
	for (let item of items) {
		if (
			[
				'.git',
				'install',
				'config.json',
				'config-sample.json',
				'cli.js',
				'lib',
				'next',
				'.gitignore',
				'package.json',
				'package-lock.json',
				'README.md',
				'wp',
			].includes(item)
		) {
			continue;
		}

		await remove(path.join(INSTALL_DIR, item));
	}

	await remove(path.join(INSTALL_DIR, 'wp-cli.phar'));
	await remove(path.join(INSTALL_DIR, 'wp-cli.yml'));
})();
