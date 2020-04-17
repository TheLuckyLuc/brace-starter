const inquirer = require('inquirer');

module.exports = {
	starterQuestions: () => {
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
};
