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

module.exports = {
	name: 'extract-wordpress',
	apply: async (installer) => {
		const { INSTALL_DIR, WP_TEMP_ZIP } = require('../constants.json');

		await extract(path.join(INSTALL_DIR, WP_TEMP_ZIP), {
			dir: INSTALL_DIR,
		});
		await unlink(path.join(INSTALL_DIR, WP_TEMP_ZIP));

		const items = await readdir(path.join(INSTALL_DIR, 'wordpress'));
		for (let ii of items) {
			await rename(
				path.join(INSTALL_DIR, 'wordpress', ii),
				path.join(INSTALL_DIR, ii)
			);
		}

		await remove(path.join(INSTALL_DIR, 'wordpress'));
	},
	undo: async (installer) => {
		const { INSTALL_DIR } = require('../constants.json');

		const items = [
			path.join(INSTALL_DIR, 'wp-admin'),
			path.join(INSTALL_DIR, 'wp-content'),
			path.join(INSTALL_DIR, 'wp-includes'),
			path.join(INSTALL_DIR, 'index.php'),
			path.join(INSTALL_DIR, 'license.txt'),
			path.join(INSTALL_DIR, 'readme.html'),
			path.join(INSTALL_DIR, 'wp-activate.php'),
			path.join(INSTALL_DIR, 'wp-blog-header.php'),
			path.join(INSTALL_DIR, 'wp-comments-post.php'),
			path.join(INSTALL_DIR, 'wp-config-sample.php'),
			path.join(INSTALL_DIR, 'wp-cron.php'),
			path.join(INSTALL_DIR, 'wp-links-opml.php'),
			path.join(INSTALL_DIR, 'wp-load.php'),
			path.join(INSTALL_DIR, 'wp-login.php'),
			path.join(INSTALL_DIR, 'wp-mail.php'),
			path.join(INSTALL_DIR, 'wp-settings.php'),
			path.join(INSTALL_DIR, 'wp-signup.php'),
			path.join(INSTALL_DIR, 'wp-trackback.php'),
			path.join(INSTALL_DIR, 'xmlrpc.php'),
		];

		for (let item of items) {
			const exists = await fileExists(item);
			exists && (await remove(item));
		}
	},
};
