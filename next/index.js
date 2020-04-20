// Local
const inquirer = require('../lib/inquirer');
const next = require('./nextSetup');
const git = require('../lib/git');
const packageJSON = require('../lib/packageJSON');

module.exports = async (projectName, tech) => {
	try {
		const { styledComponents, tailwind } = await inquirer.nextQuestions();

		// Let's add all the Next.js stuff
		await next.runInstallation(projectName, { styledComponents, tailwind });

		// Now let's add the starter scripts to the package.json
		await packageJSON.addScripts(projectName, [
			{
				key: 'dev',
				value: 'next',
			},
			{
				key: 'build',
				value: 'next build',
			},
			{
				key: 'start',
				value: 'next start',
			},
		]);

		// Build the initial folder structure
		await next.buildFolderStructure(projectName, {
			styledComponents,
			tailwind,
		});

		// Lastly let's initialise a git repo and make the first commit
		await git.initialise(projectName, tech);
	} catch (err) {
		// Let's make sure we exit the process if we encounter an error
		console.error(`Setup error: ${err}`);
		process.exit(1);
	}
};
