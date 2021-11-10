const mysql = require('mysql2');

module.exports = mysql.createPool({
  host: 'localhost',
  user: 'phpmyadmin',
  password: process.env.DB_PASSWORD || "",
  database: 'szte_adatbazisok_etr'
}).promise();