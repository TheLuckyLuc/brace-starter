const _ = require('lodash');

const throwFieldErrors = require('../utilities/throwFieldErrors');
const MySql = require('../utilities/MySql');

module.exports = {
    name: 'establish-mysql-root',
    first: async (installer) => {
        throwFieldErrors(['mysql_ROOT.host', 'mysql_ROOT.user']);

        installer.mysql.root = new MySql({
            host: installer.options.mysql_ROOT.host,
            port: installer.options.mysql_ROOT.port,
            user: installer.options.mysql_ROOT.user,
            password: installer.options.mysql_ROOT.pass
        });

        await installer.mysql.root.query('SELECT 1');
    },
    cleanup: async (installer) => installer.mysql.root && installer.mysql.root.end()
};
