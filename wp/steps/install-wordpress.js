const path = require('path');

const execute = require('../utilities/execute');

module.exports = {
	name: 'install-wordpress',
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
				'core',
				'install',
				`--url=${installer.options.wp.url}`,
				`--title=${installer.options.wp.title}`,
				`--admin_user=${installer.options.wp.admin}`,
				`--admin_password=${installer.options.wp.adminPassword}`,
				`--admin_email=${installer.options.wp.adminEmail}`,
				'--skip-email=1',
				`--path=${PROJECT_NAME}`,
			],
			true
		);
	},
	unfo: async (installer) => {
		if (!installer.mysql.user) {
			return;
		}

		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_options');
		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_users');
		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_usermeta');
		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_posts');
		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_postmeta');
		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_terms');
		await installer.mysql.user.query(
			'DROP TABLE IF EXISTS wp_term_relationships'
		);
		await installer.mysql.user.query(
			'DROP TABLE IF EXISTS wp_term_taxonomy'
		);
		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_comments');
		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_commentmeta');
		await installer.mysql.user.query('DROP TABLE IF EXISTS wp_links');
	},
};
