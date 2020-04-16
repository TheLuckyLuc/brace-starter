// Function to add in scripts to the newly generated package.json file
const path = require('path');
const jsonfile = require('jsonfile');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const currentDirectory = process.cwd();

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

module.exports = async (projectName, scripts) => {
	status.start();
	const file = await jsonfile.readFile(
		path.join(currentDirectory, projectName, 'package.json')
	);

	for (const script of scripts) {
		file.scripts[script.key] = script.value;
	}

	delete file.scripts['test'];

	await jsonfile.writeFile(
		path.join(currentDirectory, projectName, 'package.json'),
		file,
		{
			spaces: 2,
		}
	);
	status.stop();
	return console.log(
		`${chalk.green('Scripts in')} "${chalk.blue(
			'package.json'
		)}" ${chalk.green('have been updated successfully!')}`
	);
};
