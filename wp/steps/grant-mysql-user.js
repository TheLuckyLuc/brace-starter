module.exports = {
    name: 'grant-mysql-user',
    apply: async (installer) => {
        await installer.mysql.root.query(
            `GRANT ALL PRIVILEGES ON ${installer.options.wp.db.name}.* TO '${installer.options.wp.db.user}'@'${installer.options.wp.db.host}';`
        );

        installer.data.mysqlGranted = true;
    },
    undo: async (installer) => {
        if (!installer.data.mysqlGranted) {
            return;
        }

        await installer.mysql.root.query(
            `REVOKE ALL PRIVILEGES, GRANT OPTION FROM '${installer.options.wp.db.user}'@'${installer.options.wp.db.host}'`
        );
        await installer.mysql.root.query('FLUSH PRIVILEGES');
    }
};
