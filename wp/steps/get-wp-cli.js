const util = require('util');
const request = require('request');
const fs = require('fs-extra');
const path = require('path');

const execute = require('../utilities/execute');
const fileExists = require('../utilities/fileExists');

const writeFile = util.promisify(fs.writeFile);
const remove = util.promisify(fs.remove);

const {
	WP_CLI_DOWNLOAD_ENDPOINT,
	INSTALL_DIR,
	WP_CLI_NAME,
	WP_CLI_CONFIG_NAME,
	ROOT_DIR,
} = require('../constants.json');

module.exports = {
	name: 'get-wp-cli',
	apply: async (installer) => {
		await new Promise((resolve, reject) => {
			request({
				uri: WP_CLI_DOWNLOAD_ENDPOINT,
				gzip: true,
			})
				.pipe(fs.createWriteStream(path.join(INSTALL_DIR, WP_CLI_NAME)))
				.on('finish', resolve)
				.on('error', reject);
		});

		const wpCliInfo = await execute(installer.options.php, [
			path.join(INSTALL_DIR, WP_CLI_NAME),
			'--info',
		]);

		if (wpCliInfo.toString().indexOf('WP-CLI root dir') === -1) {
			throw new Error('WP-CLI is not available');
		}

		/**
		 * Create wp-cli configuration file
		 */
		await writeFile(
			path.join(INSTALL_DIR, WP_CLI_CONFIG_NAME),
			`path: ${ROOT_DIR}\n`
		);
	},
	undo: async (installer) => {
		const items = [
			path.join(INSTALL_DIR, WP_CLI_NAME),
			path.join(INSTALL_DIR, WP_CLI_CONFIG_NAME),
		];

		for (let item of items) {
			const exists = await fileExists(item);
			exists && (await remove(item));
		}
	},
};
