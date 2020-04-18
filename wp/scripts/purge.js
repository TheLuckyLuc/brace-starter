const Install = require('../utilities/Install');

const options = require('../../config.json');

(async () => {
    try {
        const install = new Install(options);

        install.add(require('../steps/load-php'));
        install.add(require('../steps/get-wp-cli'));
        install.add(require('../steps/establish-mysql-root'));
        install.add(require('../steps/create-mysql-db'));
        install.add(require('../steps/create-mysql-user'));
        install.add(require('../steps/grant-mysql-user'));
        install.add(require('../steps/establish-mysql-user'));
        install.add(require('../steps/download-wordpress'));
        install.add(require('../steps/extract-wordpress'));
        install.add(require('../steps/create-wp-config'));
        install.add(require('../steps/install-wordpress'));
        install.add(require('../steps/set-wordpress-theme'));

        await install.purge();
    } catch (err) {
        console.error('Something went wrong with the installer :( ...');
        console.error(err.message);
        process.exit();
    }
})();
