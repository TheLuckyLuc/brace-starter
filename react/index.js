// Local
const git = require('../lib/git');
const packageJSON = require('../lib/packageJSON');

module.exports = async (projectName, tech) => {
	try {
		// Clone the React Skeleton repo
		await git.clone(projectName);

		// Rename the package.json name to the project directory
		await packageJSON.renameFile(projectName);

		// Initialise new git repo
		await git.initialise(projectName, tech);
	} catch (err) {
		console.error(`Setup error: ${err}`);
		process.exit(1);
	}
};
