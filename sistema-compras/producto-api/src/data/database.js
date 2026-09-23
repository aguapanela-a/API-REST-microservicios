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
        CREATE TABLE IF NOT EXISTS producto (
            pk_id INTEGER PRIMARY KEY,
            precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
            stock INTEGER NOT NULL CHECK (stock >= 0)
        ) 
    `);
}

module.exports = {
    pool,
    crearTablas
};