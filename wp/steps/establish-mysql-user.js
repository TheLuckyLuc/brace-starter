const MySql = require('../utilities/MySql');

module.exports = {
    name: 'establish-mysql-user',
    apply: async (installer) => {
        installer.mysql.user = new MySql({
            db: installer.options.wp.db.name,
            host: installer.options.wp.db.host,
            port: installer.options.wp.db.port,
            user: installer.options.wp.db.user,
            password: installer.options.wp.db.pass
        });

        await installer.mysql.user.query('SELECT 1');
    },
    cleanup: async (installer) => installer.mysql.user && installer.mysql.user.end()
};
