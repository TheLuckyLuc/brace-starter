const spawn = require('child_process').spawn;

module.exports = (command, args, options) => {
	return new Promise((resolve, reject) => {
		const cmd = spawn(command, args, options);

		cmd.on('close', () => {
			resolve();
		});

		cmd.on('error', (err) => {
			reject(err);
		});
	});
};
