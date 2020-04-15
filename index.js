const { exec: execWithCallback } = require('child_process');
const { promisify } = require('util');
const exec = promisify(execWithCallback);
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const path = require('path');

const currentDirectory = process.cwd();

clear();

// figlet.fonts(function (err, fonts) {
// 	if (err) {
// 		console.log('something went wrong...');
// 		console.dir(err);
// 		return;
// 	}
// 	console.dir(fonts);
// });

console.log(
	chalk.yellow(
		figlet.textSync('Brace Starter', {
			font: 'ANSI Shadow',
			horizontalLayout: 'full',
		})
	)
);

const askQuestions = () => {
	const questions = [
		{
			name: 'project',
			type: 'input',
			message: 'Please provide a name for your project:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Really? Just provide a name please.';
				}
			},
		},
		{
			name: 'tech',
			type: 'list',
			message: 'Choose your library/framework/CMS:',
			choices: ['Next.js', 'React Skeleton', 'WordPress'],
			default: 'Next.js',
		},
	];

	return inquirer.prompt(questions);
};

const runProcess = async () => {
	const response = await askQuestions();

	// Sanitise the input name by removing any special characters apart from hyphens & underscores. Then replace multiple occurences of spaces with one space & replace it with a dash, so it's in a safe format for the package.json name.
	const { project: unsanitised } = response;
	const projectName = unsanitised
		.replace(/[^-0-9A-Za-z_ ]/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/\s/g, '-');

	try {
		await createDirectory(projectName);
		await initialisePackage(projectName);
		await installDependencies(projectName);
		console.log('Packages installed successfully!');
	} catch (error) {
		console.error(`process error: ${error}`);
		throw error;
	}
};

const createDirectory = async (projectDirectory) => {
	try {
		await exec(`mkdir "${projectDirectory}"`, { cwd: currentDirectory });
	} catch (error) {
		console.error(`exec error: ${error}`);
		throw error;
	}
};

const initialisePackage = async (projectDirectory) => {
	try {
		await exec('npm init -y', {
			cwd: path.join(currentDirectory, projectDirectory),
		});
	} catch (error) {
		console.error(`exec error: ${error}`);
		throw error;
	}
};

const installDependencies = async (projectDirectory) => {
	try {
		await exec('npm install react-dom', {
			cwd: path.join(currentDirectory, projectDirectory),
		});
	} catch (error) {
		console.error(`exec error: ${error}`);
		throw error;
	}
};

runProcess();
