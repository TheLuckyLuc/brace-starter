// Native
const path = require('path');

// NPM
const fs = require('fs-extra');

module.exports = (projectName) => {
	return fs.writeJson(
		path.join(__dirname, '../', 'wp', 'constants.json'),
		{
			PROJECT_NAME: projectName,
			ROOT_DIR: process.cwd(),
			INSTALL_DIR: path.join(process.cwd(), projectName),
			WP_TEMP_ZIP: 'wp.zip',
			WP_DOWNLOAD_ENDPOINT:
				'https://en-gb.wordpress.org/latest-en_GB.zip',
			WP_CLI_NAME: 'wp-cli.phar',
			WP_CLI_CONFIG_NAME: 'wp-cli.yml',
			WP_CLI_DOWNLOAD_ENDPOINT:
				'https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar',
		},
		{
			spaces: 4,
		}
	);
};
