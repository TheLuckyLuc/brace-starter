// Function to add in scripts to the newly generated package.json file

const jsonfile = require('jsonfile');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const status = new Spinner('Adding scripts to package.json... ', [
	'⣾',
	'⣽',
	'⣻',
	'⢿',
	'⡿',
	'⣟',
	'⣯',
	'⣷',
]);

module.exports = (projectName, scripts) => {
	return new Promise((resolve) => {
		status.start();
		const file = jsonfile.readFileSync(`${projectName}/package.json`);

		for (const script of scripts) {
			file.scripts[script.key] = script.value;
		}

		delete file.scripts['test'];

		jsonfile.writeFileSync(`${projectName}/package.json`, file, {
			spaces: 2,
		});
		status.stop();
		console.log(
			`${chalk.green('Scripts in')} "${chalk.blue(
				'package.json'
			)}" ${chalk.green(
				'have been updated successfully! Enter your new project by typing:'
			)} ${chalk.yellow('cd ' + projectName)}`
		);
		resolve();
	});
};
