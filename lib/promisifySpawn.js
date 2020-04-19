// Native
const { spawn } = require('child_process');

module.exports = (command, args, options) => {
	return new Promise((resolve, reject) => {
		const cmd = spawn(command, args, options);

		cmd.on('error', (err) => {
			reject(err);
		});

		cmd.on('close', (code) => {
			resolve(`child process exited with code ${code}`);
		});
	});
};
