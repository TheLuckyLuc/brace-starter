const path = require('path');
const fs = require('fs-extra');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const currentDirectory = process.cwd();

const gitRepo = 'https://github.com/TheLuckyLuc/react-skeleton.git';

// Lib stuff
const pong = require('./spinner');

module.exports = {
	initialise: async (projectName, tech) => {
		const status = new Spinner('Creating .gitignore file... ', pong);

		const git = require('simple-git/promise')(
			path.join(currentDirectory, projectName)
		);

		status.start();

		if (tech !== 'React Skeleton') {
			await fs.outputFile(
				path.join(currentDirectory, projectName, '.gitignore'),
				'node_modules\n.next'
			);

			console.log(
				`${chalk.green('"')}${chalk.blueBright(
					'.gitignore'
				)}${chalk.green('" created!')}`
			);
		}

		status.message('Initialising git repo & adding first commit... ');
		await git.init();
		await git.add('.');
		await git.commit('Initial commit');
		console.log(chalk.green('Inital commit done!'));

		status.stop();

		return console.log(
			`${chalk.green(
				'Setup complete! Enter your new project by typing this in your console:'
			)} ${chalk.yellow('cd ' + projectName)}`
		);
	},

	clone: async (projectName) => {
		if (fs.existsSync(projectName)) {
			console.log(
				`${chalk.red('The directory')} "${chalk.blueBright(
					projectName
				)}" ${chalk.red(
					'already exists! Please try again with a different name.'
				)}`
			);
			process.exit(1);
		}

		const status = new Spinner('Cloning repo... ', pong);
		status.start();

		await fs.mkdirp(path.join(currentDirectory, projectName));

		const git = require('simple-git/promise')(
			path.join(currentDirectory, projectName)
		);

		await git.clone(gitRepo, path.join(currentDirectory, projectName));

		// Remove the existing .git folder from the clone
		await fs.remove(path.join(currentDirectory, projectName, '.git'));

		status.stop();

		return console.log(chalk.green('Directory cloned!'));
	},
};
