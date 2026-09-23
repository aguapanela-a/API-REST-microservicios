require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function crearTablas() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS cliente (
            pk_id INTEGER PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL UNIQUE
        )
    `);
}

module.exports = {
    pool,
    crearTablas
};