const _ = require('lodash');

const throwFieldErrors = require('../utilities/throwFieldErrors');

module.exports = {
    name: 'create-mysql-user',
    first: async (installer) => {
        throwFieldErrors([
            'wp.db.host',
            'wp.db.user',
            'wp.db.pass',
            {
                path: 'wp.db.user',
                test: (value) => value && value.length <= 32,
                msg: 'wp.db.user must be an alphanumeric value less or equal to 32.'
            }
        ]);
    },
    apply: async (installer) => {
        await installer.mysql.root.query(`FLUSH PRIVILEGES`);
        await installer.mysql.root.query(
            `CREATE USER '${installer.options.wp.db.user}'@'${installer.options.wp.db.host}' IDENTIFIED BY '${installer.options.wp.db.pass}'`
        );
    },
    undo: async (installer) => {
        await installer.mysql.root.query(
            `DROP USER IF EXISTS '${installer.options.wp.db.user}'@'${installer.options.wp.db.host}'`
        );
    }
};
