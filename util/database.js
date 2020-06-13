const mysql = require('mysql2');

// Creating connection pool so we don't have to create new connection for every query
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'family',
    password: '',
});

// Promise chains instead of many nested callbacks
module.exports = pool.promise();
