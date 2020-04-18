const util = require('util');
const request = require('request');
const fs = require('fs-extra');
const path = require('path');

const fileExists = require('../utilities/fileExists');

const remove = util.promisify(fs.remove);

const {
	WP_DOWNLOAD_ENDPOINT,
	ROOT_DIR,
	WP_TEMP_ZIP,
} = require('../constants.json');

module.exports = {
	name: 'download-wordpress',
	apply: async (installer) => {
		await new Promise((resolve, reject) => {
			request({
				uri: WP_DOWNLOAD_ENDPOINT,
				gzip: true,
			})
				.pipe(fs.createWriteStream(path.join(ROOT_DIR, WP_TEMP_ZIP)))
				.on('finish', resolve)
				.on('error', reject);
		});
	},
	undo: async (installer) => {
		const items = [path.join(ROOT_DIR, WP_TEMP_ZIP)];

		for (let item of items) {
			const exists = await fileExists(item);
			exists && (await remove(item));
		}
	},
};
