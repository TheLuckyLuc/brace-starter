// Native
const path = require('path');

// NPM
const fs = require('fs-extra');
const chalk = require('chalk');
const CLI = require('clui');
const Spinner = CLI.Spinner;

// Local
const pong = require('./spinner');

const currentDirectory = process.cwd();
const gitRepo = 'https://github.com/TheLuckyLuc/react-skeleton.git';

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

		return;
	},

	clone: async (projectName) => {
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
