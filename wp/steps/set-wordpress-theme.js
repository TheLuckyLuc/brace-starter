const util = require('util');
const fs = require('fs-extra');
const path = require('path');

const execute = require('../utilities/execute');
const fileExists = require('../utilities/fileExists');

const copy = util.promisify(fs.copy);

const { ROOT_DIR, INSTALL_DIR, WP_CLI_NAME } = require('../constants.json');

module.exports = {
	name: 'set-wordpress-theme',
	first: async (installer) => {
		if (!installer.options.wp.theme) {
			return;
		}

		installer.themePath = path.join(
			ROOT_DIR,
			'wp-content',
			'themes',
			installer.options.wp.theme
		);

		if (!(await fileExists(installer.themePath))) {
			throw new Error(
				`The theme defined (${installer.options.wp.theme}) was not found. Expected it here: ${installer.themePath}`
			);
		}
	},
	apply: async (installer) => {
		if (!installer.options.wp.theme) {
			return;
		}

		/**
		 * Copy theme directory structure to wp-content/themes
		 */
		await copy(
			path.join(INSTALL_DIR, 'themes', installer.options.wp.theme),
			installer.themePath
		);

		/**
		 * Activate the theme that was copied
		 */
		await execute(
			installer.options.php,
			[
				path.join(INSTALL_DIR, WP_CLI_NAME),
				'theme',
				'activate',
				installer.options.wp.theme,
			],
			true
		);
	},
};
