const util = require('util');
const fs = require('fs-extra');
const validator = require('validator');
const path = require('path');

const throwFieldErrors = require('../utilities/throwFieldErrors');
const execute = require('../utilities/execute');
const fileExists = require('../utilities/fileExists');

const remove = util.promisify(fs.remove);

module.exports = {
	name: 'create-wp-config',
	first: async (installer) => {
		throwFieldErrors([
			{
				path: 'wp.url',
				test: (value) =>
					value && validator.isURL(value, { require_tld: false }),
				msg: 'wp.url must be a valid URL',
			},
			'wp.title',
			'wp.admin',
			'wp.adminPassword',
			{
				path: 'wp.adminEmail',
				test: (value) => value && validator.isEmail(value),
				msg: 'wp.adminEmail must be a valid email address',
			},
		]);
	},
	apply: async (installer) => {
		const {
			INSTALL_DIR,
			WP_CLI_NAME,
			PROJECT_NAME,
		} = require('../constants.json');

		await execute(
			installer.options.php,
			[
				path.join(INSTALL_DIR, WP_CLI_NAME),
				'config',
				'create',
				`--dbname=${installer.options.wp.db.name}`,
				`--dbuser=${installer.options.wp.db.user}`,
				`--dbpass=${installer.options.wp.db.pass}`,
				`--dbhost=${installer.options.wp.db.host}${
					installer.options.wp.db.port
						? `:${installer.options.wp.db.port}`
						: ''
				}`,
				'--skip-check=1',
				`--path=${PROJECT_NAME}`,
			],
			true
		);
	},
	undo: async (installer) => {
		const { INSTALL_DIR } = require('../constants.json');

		const items = [path.join(INSTALL_DIR, 'wp-config.php')];

		for (let item of items) {
			const exists = await fileExists(item);
			exists && (await remove(item));
		}
	},
};
