const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { exec: execWithCallback } = require('child_process');
const exec = promisify(execWithCallback);
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const currentDirectory = process.cwd();

const status = new Spinner('Creating directory... ', [
	'⣾',
	'⣽',
	'⣻',
	'⢿',
	'⡿',
	'⣟',
	'⣯',
	'⣷',
]);

module.exports = {
	runInstallation: async (projectName) => {
		try {
			status.start();

			if (fs.existsSync(projectName)) {
				console.log(
					`${chalk.red('The directory')} "${chalk.blue(
						projectName
					)}" ${chalk.red(
						'already exists! Please try again with a different name.'
					)}`
				);
				status.stop();
				process.exit(1);
			}

			await exec(`mkdir "${projectName}"`, {
				cwd: currentDirectory,
			});

			status.message('Initialising package.json... ');
			await exec('npm init -y', {
				cwd: path.join(currentDirectory, projectName),
			});

			status.message('Installing required dependencies... ');
			await exec('npm install react-dom', {
				cwd: path.join(currentDirectory, projectName),
			});

			status.stop();

			console.log(
				`${chalk.blue(projectName)} ${chalk.green(
					'created successfully!'
				)}`
			);
		} catch (err) {
			console.error(`execution error: ${err}`);
			throw err;
		}
	},
};
