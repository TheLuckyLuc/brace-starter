const util = require('util');
const fs = require('fs-extra');
const path = require('path');

const readdir = util.promisify(fs.readdir);
const remove = util.promisify(fs.remove);

const ROOT_DIR = path.resolve(__dirname, '../');
const INSTALL_DIR = __dirname;

(async () => {
    const items = await readdir(ROOT_DIR);
    for (let item of items) {
        if (['.git', 'install', 'config.json', 'config-sample.json'].includes(item)) {
            continue;
        }

        await remove(path.join(ROOT_DIR, item));
    }

    await remove(path.join(INSTALL_DIR, 'wp-cli.phar'));
    await remove(path.join(INSTALL_DIR, 'wp-cli.yml'));
})();
