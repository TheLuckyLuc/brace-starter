const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const childProcess = require('child_process');
const exec = promisify(childProcess.exec);
const mkdir = promisify(fs.mkdir);
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const currentDirectory = process.cwd();

// Lib stuff
const copyFiles = require('./copyFiles');
const promisifySpawn = require('./promisifySpawn');
const pong = require('./spinner');

module.exports = {
	runInstallation: async (projectName, styledComponents) => {
		const status = new Spinner('Creating directory... ', pong);

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

		await mkdir(path.join(currentDirectory, projectName));

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
			`${chalk.green('Project "')}${chalk.blue(projectName)}${chalk.green(
				'" created successfully!'
			)}`
		);
	},

	buildFolderStructure: async (projectName, styledComponents) => {
		const status = new Spinner('Building folder structure... ', pong);

		status.start();

		await mkdir(path.join(currentDirectory, projectName, 'pages'));

		let pageFiles = ['index.js'];

		if (styledComponents === 'Yes') {
			await copyFiles(
				path.join(__dirname, '../', 'nextFiles'),
				path.join(currentDirectory, projectName),
				['.babelrc']
			);

			pageFiles = pageFiles.concat(['_app.js', '_document.js']);
		}

		await copyFiles(
			path.join(__dirname, '../', 'nextFiles'),
			path.join(currentDirectory, projectName, 'pages'),
			pageFiles
		);

		status.stop();

		return console.log(chalk.green('Folder structure built!'));
	},
};
