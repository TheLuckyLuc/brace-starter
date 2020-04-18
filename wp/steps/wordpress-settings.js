const path = require('path');

module.exports = {
    name: 'wordpress-settings',
    apply: async (installer) => {
        if (!installer.mysql.user) {
            return;
        }

        await installer.mysql.user.query(
            `UPDATE ${installer.options.wp.db.name}.wp_options SET option_value='' WHERE option_name='blogdescription'`
        );
        await installer.mysql.user.query(
            `UPDATE ${installer.options.wp.db.name}.wp_options SET option_value='' WHERE option_name='default_pingback_flag'`
        );
        await installer.mysql.user.query(
            `UPDATE ${installer.options.wp.db.name}.wp_options SET option_value='' WHERE option_name='default_ping_status'`
        );
        await installer.mysql.user.query(
            `UPDATE ${installer.options.wp.db.name}.wp_options SET option_value='' WHERE option_name='default_comment_status'`
        );
        await installer.mysql.user.query(
            `UPDATE ${installer.options.wp.db.name}.wp_options SET option_value='' WHERE option_name='show_avatars'`
        );
    }
};
