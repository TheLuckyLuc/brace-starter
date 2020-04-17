#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

// Lib stuff
const inquirer = require('./lib/inquirer');
const next = require('./lib/nextSetup');
const addScripts = require('./lib/addScripts');
const gitInitialise = require('./lib/git');

clear();

console.log(
	chalk.yellow(
		figlet.textSync('Brace Starter', {
			font: 'ANSI Shadow',
			horizontalLayout: 'full',
		})
	)
);

const runProcess = async () => {
	const { project: unsanitised, tech } = await inquirer.starterQuestions();

	// Sanitise the input name by removing any special characters apart from hyphens & underscores. Then replace multiple occurences of spaces with one space & replace it with a dash, so it's in a safe format for the package.json name.
	const projectName = unsanitised
		.replace(/[^-0-9A-Za-z_ ]/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/\s/g, '-');

	if (tech === 'Next.js') {
		try {
			const { styledComponents } = await inquirer.nextQuestions();

			// Let's add all the Next.js stuff
			await next.runInstallation(projectName, styledComponents);

			// Now let's add the starter scripts to the package.json
			await addScripts(projectName, [
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
			await gitInitialise(projectName);
		} catch (err) {
			// Let's make sure we exit the process if we encounter an error
			console.error(`Setup error: ${err}`);
			process.exit(1);
		}
	} else {
		console.log("This feature hasn't been built yet. Sowwy :(");
	}
};

runProcess();
