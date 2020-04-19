#!/usr/bin/env node

// NPM
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

// Local
const inquirer = require('./lib/inquirer');

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

	const run = require(`./${tech}/index`);

	await run(projectName, tech);

	console.log(
		`${chalk.green(
			'Setup complete! Enter your new project by typing this in your console:'
		)} ${chalk.yellow('cd ' + projectName)}`
	);
})();
