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
	runInstallation: async (projectName, { styledComponents, tailwind }) => {
		const status = new Spinner('Creating directory... ', pong);
		status.start();

		await fs.mkdirp(path.join(currentDirectory, projectName));

		status.message('Initialising package.json... ');
		await exec('npm init -y', {
			cwd: path.join(currentDirectory, projectName),
		});

		status.message('Installing required dependencies... ');

		const dependencies = ['i', '--save', 'next', 'react', 'react-dom'];

		if (styledComponents) {
			dependencies.push('styled-components');
		}

		await promisifySpawn(
			/^win/.test(process.platform) ? 'npm.cmd' : 'npm',
			dependencies,
			{
				cwd: path.join(currentDirectory, projectName),
				stdio: 'inherit',
			}
		);

		let devDependencies = ['i', '--save-dev'];

		if (styledComponents) {
			devDependencies = devDependencies.concat([
				'babel-plugin-styled-components',
			]);
		}

		if (tailwind) {
			devDependencies = devDependencies.concat([
				'@fullhuman/postcss-purgecss',
				'postcss-preset-env',
				'tailwindcss',
			]);
		}

		if (styledComponents || tailwind) {
			status.message('Installing required devDependencies now... ');

			await promisifySpawn(
				/^win/.test(process.platform) ? 'npm.cmd' : 'npm',
				devDependencies,
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

	buildFolderStructure: async (
		projectName,
		{ styledComponents, tailwind }
	) => {
		const status = new Spinner('Building folder structure... ', pong);

		status.start();

		await fs.mkdirp(path.join(currentDirectory, projectName, 'pages'));
		await fs.mkdirp(path.join(currentDirectory, projectName, 'styles'));

		let rootFiles = [];
		let pageFiles = ['index.js'];

		if (styledComponents && tailwind) {
			rootFiles = rootFiles.concat(['.babelrc', 'postcss.config.js']);
			pageFiles = pageFiles.concat(['_app.js', '_document.js']);
		}

		if (styledComponents && !tailwind) {
			rootFiles = rootFiles.concat(['.babelrc']);
			pageFiles = pageFiles.concat(['_app.js', '_document.js']);
		}

		if (!styledComponents && tailwind) {
			rootFiles = rootFiles.concat(['postcss.config.js']);

			await fs.copy(
				path.join(
					__dirname,
					'../',
					'next',
					'files',
					'tailwind',
					'_app.js'
				),
				path.join(currentDirectory, projectName, 'pages', '_app.js')
			);

			await fs.copy(
				path.join(
					__dirname,
					'../',
					'next',
					'files',
					'tailwind',
					'index.css'
				),
				path.join(currentDirectory, projectName, 'styles', 'index.css')
			);
		}

		await copyFiles(
			path.join(__dirname, '../', 'next', 'files'),
			path.join(currentDirectory, projectName),
			rootFiles
		);

		await copyFiles(
			path.join(__dirname, '../', 'next', 'files'),
			path.join(currentDirectory, projectName, 'pages'),
			pageFiles
		);

		status.stop();

		return console.log(chalk.green('Folder structure built!'));
	},
};
