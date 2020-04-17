const path = require('path');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const currentDirectory = process.cwd();

// Lib stuff
const pong = require('./spinner');

const status = new Spinner('Creating .gitignore file... ', pong);

module.exports = async (projectName) => {
	const git = require('simple-git')(path.join(currentDirectory, projectName));

	status.start();
	await writeFile(
		path.join(currentDirectory, projectName, '.gitignore'),
		'node_modules\n.next'
	);
	console.log(chalk.green('.gitignore created!'));

	status.message('Initialising git repo & adding first commit... ');
	git.init().add('.').commit('Initial commit');
	console.log(chalk.green('Inital commit done!'));
	status.stop();

	return console.log(
		`${chalk.green(
			'Setup complete! Enter your new project by typing this in your console:'
		)} ${chalk.yellow('cd ' + projectName)}`
	);
};
