const mysql = require('mysql');
require('dotenv').config();


const masterPool = mysql.createConnection({
    connectionLimit: 1,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    dateStrings: true
});

masterPool.connect(function (err) {
    if (err) throw err;
})

module.exports = {
    masterPool
}