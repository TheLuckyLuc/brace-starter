const inquirer = require('inquirer');
const chalk = require('chalk');
const validator = require('validator');

// Lib stuff
const sanitiseString = require('./sanitiseString');

module.exports = {
	starterQuestions: () => {
		const questions = [
			{
				name: 'projectName',
				type: 'input',
				message: 'Please provide a name for your project:',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return 'Really? Just provide a name please.';
					}
				},
				filter: (value) => {
					const clean = sanitiseString(value);
					return clean;
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
	},

	nextQuestions: () => {
		const questions = [
			{
				name: 'styledComponents',
				type: 'list',
				message:
					'Would you like your Next.js installation to come with support for Styled Components?',
				choices: ['Yes', 'No'],
				default: 'Yes',
			},
		];

		return inquirer.prompt(questions);
	},

	wordpressQuestions: () => {
		const questions = [
			{
				name: 'php',
				type: 'input',
				message: 'Enter the path to your php.exe:',
				suffix: ` (please ${chalk.red(
					"DON'T"
				)} escape any characters e.g. C:\\PHP\\php.exe)`,
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return "You need to provide the path to your php binary, otherwise this won't work :(";
					}
				},
			},
			{
				name: 'mysqlUser',
				type: 'input',
				message: 'Enter your username for mySQL:',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return "C'mon, please provide your username...";
					}
				},
				filter: (value) => {
					const clean = sanitiseString(value);
					return clean;
				},
			},
			{
				name: 'mysqlPass',
				type: 'password',
				message: 'Enter your password for mySQL:',
				suffix: " (Leave it blank if you haven't set a password)",
			},
			{
				name: 'mysqlHost',
				type: 'input',
				message: 'Enter your hostname for mySQL:',
				default: 'localhost',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return "You'll need to provide a hostname matey...";
					}
				},
			},
			{
				name: 'mysqlPort',
				type: 'input',
				message: 'Enter the port for mySQL:',
				suffix: ' (assumes 3306 if nothing provided)',
			},
			{
				name: 'dbName',
				type: 'input',
				message: 'Name your new database:',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return 'You need to provide a name for your new database';
					}
				},
				filter: (value) => {
					const clean = sanitiseString(value);
					return clean;
				},
			},
			{
				name: 'dbUser',
				type: 'input',
				message: 'Enter a username for the database:',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return 'You need to provide a username for your new database';
					}
				},
				filter: (value) => {
					const clean = sanitiseString(value);
					return clean;
				},
			},
			{
				name: 'dbPass',
				type: 'password',
				message: 'Enter a password for the new database:',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return 'You need to provide a password for your new database';
					}
				},
			},
			{
				name: 'dbPort',
				type: 'input',
				message:
					"Enter the port for your DB if it's different to the mySQL one you provided initially:",
				suffix: ' (assumes 3306 if nothing provided)',
			},
			{
				name: 'url',
				type: 'input',
				message:
					'Enter the full url you want this installation to be accessible from:',
				suffix: ' (e.g. http://localhost/my-site)',
				validate: (value) => {
					if (
						value &&
						validator.isURL(value, { require_tld: false })
					) {
						return true;
					} else {
						return 'Please enter a valid URL';
					}
				},
			},
			{
				name: 'title',
				type: 'input',
				message: 'Enter a title for your new WordPress site:',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return 'Please enter a title';
					}
				},
			},
			{
				name: 'admin',
				type: 'input',
				message: 'Enter a username for the WordPress admin dashboard:',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return 'Please enter a username';
					}
				},
			},
			{
				name: 'adminPassword',
				type: 'password',
				message: 'Enter a password for the WordPress admin dashboard:',
				validate: (value) => {
					if (value.length) {
						return true;
					} else {
						return 'Please enter a password';
					}
				},
			},
			{
				name: 'adminEmail',
				type: 'input',
				message:
					'Enter an email address for the WordPress admin dashboard:',
				validate: (value) => {
					if (value && validator.isEmail(value)) {
						return true;
					} else {
						return 'Please enter a valid email';
					}
				},
			},
		];

		return inquirer.prompt(questions);
	},
};
