const util = require('util');
const extract = require('extract-zip');
const fs = require('fs-extra');
const path = require('path');
const globCb = require('glob');

const fileExists = require('../utilities/fileExists');

const unlink = util.promisify(fs.unlink);
const remove = util.promisify(fs.remove);
const readdir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);
const glob = util.promisify(globCb);

const { ROOT_DIR, WP_TEMP_ZIP } = require('../constants.json');

module.exports = {
	name: 'extract-wordpress',
	apply: async (installer) => {
		await extract(path.join(ROOT_DIR, WP_TEMP_ZIP), { dir: ROOT_DIR });
		await unlink(path.join(ROOT_DIR, WP_TEMP_ZIP));

		const items = await readdir(path.join(ROOT_DIR, 'wordpress'));
		for (let ii of items) {
			await rename(
				path.join(ROOT_DIR, 'wordpress', ii),
				path.join(ROOT_DIR, ii)
			);
		}

		await remove(path.join(ROOT_DIR, 'wordpress'));
	},
	undo: async (installer) => {
		const items = [
			path.join(ROOT_DIR, 'wp-admin'),
			path.join(ROOT_DIR, 'wp-content'),
			path.join(ROOT_DIR, 'wp-includes'),
			path.join(ROOT_DIR, 'index.php'),
			path.join(ROOT_DIR, 'license.txt'),
			path.join(ROOT_DIR, 'readme.html'),
			path.join(ROOT_DIR, 'wp-activate.php'),
			path.join(ROOT_DIR, 'wp-blog-header.php'),
			path.join(ROOT_DIR, 'wp-comments-post.php'),
			path.join(ROOT_DIR, 'wp-config-sample.php'),
			path.join(ROOT_DIR, 'wp-cron.php'),
			path.join(ROOT_DIR, 'wp-links-opml.php'),
			path.join(ROOT_DIR, 'wp-load.php'),
			path.join(ROOT_DIR, 'wp-login.php'),
			path.join(ROOT_DIR, 'wp-mail.php'),
			path.join(ROOT_DIR, 'wp-settings.php'),
			path.join(ROOT_DIR, 'wp-signup.php'),
			path.join(ROOT_DIR, 'wp-trackback.php'),
			path.join(ROOT_DIR, 'xmlrpc.php'),
		];

		for (let item of items) {
			const exists = await fileExists(item);
			exists && (await remove(item));
		}
	},
};
