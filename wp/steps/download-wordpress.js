const util = require('util');
const request = require('request');
const fs = require('fs-extra');
const path = require('path');

const fileExists = require('../utilities/fileExists');

const remove = util.promisify(fs.remove);

module.exports = {
	name: 'download-wordpress',
	apply: async (installer) => {
		const {
			WP_DOWNLOAD_ENDPOINT,
			INSTALL_DIR,
			WP_TEMP_ZIP,
		} = require('../constants.json');

		await new Promise((resolve, reject) => {
			request({
				uri: WP_DOWNLOAD_ENDPOINT,
				gzip: true,
			})
				.pipe(fs.createWriteStream(path.join(INSTALL_DIR, WP_TEMP_ZIP)))
				.on('finish', resolve)
				.on('error', reject);
		});
	},
	undo: async (installer) => {
		const { INSTALL_DIR, WP_TEMP_ZIP } = require('../constants.json');

		const items = [path.join(INSTALL_DIR, WP_TEMP_ZIP)];

		for (let item of items) {
			const exists = await fileExists(item);
			exists && (await remove(item));
		}
	},
};
