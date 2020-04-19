const util = require('util');
const fs = require('fs-extra');
const globCb = require('glob');
const path = require('path');

const glob = util.promisify(globCb);
const remove = util.promisify(fs.remove);

module.exports = {
	name: 'wordpress-clean-files',
	apply: async (installer) => {
		const { INSTALL_DIR } = require('../constants.json');

		/**
		 * Remove license file, readme and xmlrpc
		 */
		await remove(path.join(INSTALL_DIR, 'license.txt'));
		await remove(path.join(INSTALL_DIR, 'readme.html'));
		await remove(path.join(INSTALL_DIR, 'xmlrpc.php'));

		/**
		 * Remove the default WordPress themes
		 * but only if there is a theme set in the config
		 */
		if (installer.options.wp.theme) {
			for (let ii of await glob(
				path.join(INSTALL_DIR, 'wp-content', 'themes', 'twenty*')
			)) {
				await remove(ii);
			}
		}

		/**
		 * Remove the default WordPress plugins
		 * because nobody has ever used them in
		 * the history of WordPress
		 */
		await remove(
			path.join(INSTALL_DIR, 'wp-content', 'plugins', 'akismet')
		);
		await remove(
			path.join(INSTALL_DIR, 'wp-content', 'plugins', 'hello.php')
		);
	},
};
