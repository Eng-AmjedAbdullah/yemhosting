const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host:             process.env.MYSQL_HOST     || 'localhost',
  port:             Number(process.env.MYSQL_PORT) || 3306,
  database:         process.env.MYSQL_DB       || 'yemen_heritage',
  user:             process.env.MYSQL_USER     || 'root',
  password:         process.env.MYSQL_PASS     || '',
  charset:          process.env.MYSQL_CHARSET  || 'utf8mb4',
  waitForConnections: true,
  connectionLimit:  10,
  timezone:         '+00:00',
})

module.exports = pool
