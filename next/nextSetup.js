// Native
const path = require('path');
const { promisify } = require('util');
const childProcess = require('child_process');
const exec = promisify(childProcess.exec);

// NPM
const fs = require('fs-extra');
const chalk = require('chalk');
const CLI = require('clui');
const Spinner = CLI.Spinner;

// Local
const copyFiles = require('../lib/copyFiles');
const promisifySpawn = require('../lib/promisifySpawn');
const pong = require('../lib/spinner');

const currentDirectory = process.cwd();

module.exports = {
	runInstallation: async (projectName, styledComponents) => {
		const status = new Spinner('Creating directory... ', pong);
		status.start();

		await fs.mkdirp(path.join(currentDirectory, projectName));

		status.message('Initialising package.json... ');
		await exec('npm init -y', {
			cwd: path.join(currentDirectory, projectName),
		});

		status.message('Installing required dependencies... ');

		const arguments = ['i', '--save', 'next', 'react', 'react-dom'];

		if (styledComponents === 'Yes') {
			arguments.push('styled-components');
		}

		await promisifySpawn(
			/^win/.test(process.platform) ? 'npm.cmd' : 'npm',
			arguments,
			{
				cwd: path.join(currentDirectory, projectName),
				stdio: 'inherit',
			}
		);

		if (styledComponents === 'Yes') {
			await promisifySpawn(
				/^win/.test(process.platform) ? 'npm.cmd' : 'npm',
				['i', '--save-dev', 'babel-plugin-styled-components'],
				{
					cwd: path.join(currentDirectory, projectName),
					stdio: 'inherit',
				}
			);
		}

		status.stop();

		return console.log(
			`${chalk.green('Project "')}${chalk.blueBright(
				projectName
			)}${chalk.green('" created successfully!')}`
		);
	},

	buildFolderStructure: async (projectName, styledComponents) => {
		const status = new Spinner('Building folder structure... ', pong);

		status.start();

		await fs.mkdirp(path.join(currentDirectory, projectName, 'pages'));

		let pageFiles = ['index.js'];

		if (styledComponents === 'Yes') {
			await copyFiles(
				path.join(__dirname, '../', 'next', 'files'),
				path.join(currentDirectory, projectName),
				['.babelrc']
			);

			pageFiles = pageFiles.concat(['_app.js', '_document.js']);
		}

		await copyFiles(
			path.join(__dirname, '../', 'next', 'files'),
			path.join(currentDirectory, projectName, 'pages'),
			pageFiles
		);

		status.stop();

		return console.log(chalk.green('Folder structure built!'));
	},
};
