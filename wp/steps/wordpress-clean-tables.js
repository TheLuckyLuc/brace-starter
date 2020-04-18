module.exports = {
    name: 'wordpress-clean-tables',
    apply: async (installer) => {
        if (!installer.mysql.user) {
            return;
        }

        await installer.mysql.user.query(`DELETE FROM ${installer.options.wp.db.name}.wp_comments`);
        await installer.mysql.user.query(`DELETE FROM ${installer.options.wp.db.name}.wp_postmeta`);
        await installer.mysql.user.query(`DELETE FROM ${installer.options.wp.db.name}.wp_posts`);
    }
};
