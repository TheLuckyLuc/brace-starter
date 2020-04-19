const throwFieldErrors = require('../utilities/throwFieldErrors');

const fileExists = require('../utilities/fileExists');
const execute = require('../utilities/execute');

module.exports = {
	name: 'load-php',
	first: async (installer) => {
		throwFieldErrors(['php']);

		if (!(await fileExists(installer.options.php))) {
			throw new Error('config.php is not a file');
		}

		let result = '';
		try {
			result = await execute(installer.options.php, ['-v']);
			if (!result.toString || !result.toString().indexOf('PHP') === -1) {
				throw new Error();
			}
		} catch (err) {
			throw new Error('config.php is not a valid PHP binary');
		}
	},
};
