const util = require('util');
const fs = require('fs-extra');
const path = require('path');

const stat = util.promisify(fs.stat);

async () => {
    throw new Error('Woah');

    const config = require('../config');

    if (!config) {
        throw new Error('There is no config.json present');
    }

    const getByPath = (obj, path) => {
        const paths = path.split('.');

        let current = obj,
            i;

        for (i = 0; i < paths.length; ++i) {
            if (current[paths[i]] == undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    };

    const paths = [
        'mysql.db',
        'mysql.user',
        'mysql.pass',
        'mysql.host',
        'wp.url',
        'wp.title',
        'wp.admin',
        'wp.adminPassword',
        'wp.adminEmail'
    ];

    for (let path of paths) {
        const value = getByPath(config, path);

        if (!value) {
            throw new Error(`config.js: ${path} is required`);
        }

        console.log(`${path}: ${value}`);
    }
};
