const { exec: execWithCallback } = require('child_process');
const { promisify } = require('util');
const exec = promisify(execWithCallback);
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const path = require('path');

// Lib stuff
const inquirer = require('./lib/inquirer');
const next = require('./lib/nextSetup');
const addScripts = require('./lib/addScripts');

clear();

// figlet.fonts(function (err, fonts) {
// 	if (err) {
// 		console.log('something went wrong...');
// 		console.dir(err);
// 		return;
// 	}
// 	console.dir(fonts);
// });

console.log(
	chalk.yellow(
		figlet.textSync('Brace Starter', {
			font: 'ANSI Shadow',
			horizontalLayout: 'full',
		})
	)
);

const runProcess = async () => {
	const { project: unsanitised, tech } = await inquirer.askQuestions();

	// Sanitise the input name by removing any special characters apart from hyphens & underscores. Then replace multiple occurences of spaces with one space & replace it with a dash, so it's in a safe format for the package.json name.
	const projectName = unsanitised
		.replace(/[^-0-9A-Za-z_ ]/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/\s/g, '-');

	if (tech === 'Next.js') {
		try {
			await next.runInstallation(projectName);
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
		} catch (err) {
			console.error(err);
		}
	} else {
		console.log('Nothing yet.');
	}
};

runProcess();
