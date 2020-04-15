const inquirer = require('inquirer');

module.exports = {
	askQuestions: () => {
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
};
