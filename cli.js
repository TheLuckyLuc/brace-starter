#!/usr/bin/env node

const path = require('path');

const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const fs = require('fs-extra');

// Lib stuff
const inquirer = require('./lib/inquirer');
const next = require('./lib/nextSetup');
const packageJSON = require('./lib/packageJSON');
const git = require('./lib/git');
const createConstants = require('./lib/createConstants');

const wpInstall = require('./wp/scripts/index');

clear();

console.log(
	chalk.yellow(
		figlet.textSync('Brace Starter', {
			font: 'ANSI Shadow',
			horizontalLayout: 'fitted',
		})
	)
);

(async () => {
	const { projectName, tech } = await inquirer.starterQuestions();

	if (tech === 'Next.js') {
		try {
			const { styledComponents } = await inquirer.nextQuestions();

			// Let's add all the Next.js stuff
			await next.runInstallation(projectName, styledComponents);

			// Now let's add the starter scripts to the package.json
			await packageJSON.addScripts(projectName, [
				{
					key: 'dev',
					value: 'next',
				},
				{
					key: 'build',
					value: 'next build',
				},
				{
					key: 'start',
					value: 'next start',
				},
			]);

			// Build the initial folder structure
			await next.buildFolderStructure(projectName, styledComponents);

			// Lastly let's initialise a git repo and make the first commit
			await git.initialise(projectName, tech);
		} catch (err) {
			// Let's make sure we exit the process if we encounter an error
			console.error(`Setup error: ${err}`);
			process.exit(1);
		}
	}

	if (tech === 'React Skeleton') {
		try {
			// Clone the React Skeleton repo
			await git.clone(projectName);

			// Rename the package.json name to the project directory
			await packageJSON.renameFile(projectName);

			// Initialise new git repo
			await git.initialise(projectName, tech);
		} catch (err) {
			console.error(`Setup error: ${err}`);
			process.exit(1);
		}
	}

	if (tech === 'WordPress') {
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
				path.join(__dirname, 'wp', 'config.json'),
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

			wpInstall();
		} catch (err) {
			console.error(`Setup error: ${err}`);
			process.exit(1);
		}
	}
})();
