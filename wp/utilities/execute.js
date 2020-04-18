const { spawn } = require('child_process');

module.exports = (command, args, log) =>
    new Promise((resolve, reject) => {
        const process = spawn(command, args),
            buffers = [];

        process.stdout.on('data', (data) => {
            buffers.push(data);
            log && console.log(`${data}`);
        });

        process.stderr.on('data', (data) => {
            buffers.push(data);
            log && console.log(`[ERROR]: ${data}`);
        });

        process.on('error', (error) => reject(error));
        process.on('close', (code) => resolve(Buffer.concat(buffers)));
    });
