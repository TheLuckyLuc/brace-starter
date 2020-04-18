const mysql = require('mysql');

const MySql = function (params) {
    this.connection = mysql.createConnection(params);
    this.connection.connect();
};

MySql.prototype.query = async function (query) {
    return new Promise((resolve, reject) =>
        this.connection.query(query, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        })
    );
};

MySql.prototype.end = function () {
    this.connection.end();
};

module.exports = MySql;
