const util = require('util');
const fs = require('fs-extra');

const stat = util.promisify(fs.stat);

module.exports = async (path) => {
    try {
        await stat(path);
        return true;
    } catch (err) {}

    return false;
};
