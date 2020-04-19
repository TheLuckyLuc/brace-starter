// Native
const path = require('path');

// NPM
const fs = require('fs-extra');

// Local
const createConstants = require('../lib/createConstants');
const inquirer = require('../lib/inquirer');
const wpInstall = require('./scripts/index');

module.exports = async (projectName) => {
	try {
		await createConstants(projectName);

		const {
			php,
			mysqlUser,
			mysqlPass,
			mysqlHost,
			mysqlPort,
			dbName,
			dbUser,
			dbPass,
			dbPort,
			url,
			title,
			admin,
			adminPassword,
			adminEmail,
		} = await inquirer.wordpressQuestions();

		await fs.mkdirp(projectName);

		await fs.writeJson(
			path.join(__dirname, 'config.json'),
			{
				php,
				mysql_ROOT: {
					user: mysqlUser,
					pass: mysqlPass,
					host: mysqlHost,
					port: mysqlPort,
				},
				wp: {
					db: {
						name: dbName,
						user: dbUser,
						pass: dbPass,
						host: mysqlHost,
						port: dbPort,
					},
					url,
					title,
					admin,
					adminPassword,
					adminEmail,
				},
			},
			{ spaces: 4 }
		);

		await wpInstall();
	} catch (err) {
		console.error(`Setup error: ${err}`);
		process.exit(1);
	}
};
