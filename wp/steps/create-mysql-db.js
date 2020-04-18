const throwFieldErrors = require('../utilities/throwFieldErrors');

module.exports = {
    name: 'create-mysql-db',
    first: async (installer) => {
        throwFieldErrors(['wp.db.name']);
    },
    apply: async (installer) => {
        await installer.mysql.root.query(`CREATE DATABASE ${installer.options.wp.db.name}`);
    },
    undo: async (installer, step) => {
        await installer.mysql.root.query(`DROP DATABASE IF EXISTS ${installer.options.wp.db.name}`);
    }
};
