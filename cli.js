#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

// Lib stuff
const inquirer = require('./lib/inquirer');
const next = require('./lib/nextSetup');
const packageJSON = require('./lib/packageJSON');
const git = require('./lib/git');

clear();

console.log(
	chalk.yellow(
		figlet.textSync('Brace Starter', {
			font: 'ANSI Shadow',
			horizontalLayout: 'fitted',
		})
	)
);

const runProcess = async () => {
	const { project: unsanitised, tech } = await inquirer.starterQuestions();

	// Sanitises the input so it suits the package.json naming convention. If I find a cleaner way to write this, I'll be sure to tidy it up. Does the trick for now.
	const projectName = unsanitised
		.toLowerCase()
		.replace(/[^-0-9A-Za-z_ ]/g, '') // Removes any characters apart from alphanumeric characters, hyphens or underscores
		.replace(/\s{2,}/g, ' ') // Replaces repeated spaces with just one space
		.replace(/^\s*(\S.*\S)\s*$/, '$1') // Removes any leading or trailing spaces
		.replace(/\s/g, '-'); // Finally replaces spaces with hyphens

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
};

runProcess();
