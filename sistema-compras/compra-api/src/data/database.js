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
        CREATE TABLE IF NOT EXISTS compra (
            pk_id INTEGER PRIMARY KEY,
            fk_cliente INTEGER NOT NULL,
            fk_producto INTEGER NOT NULL,
            cantidad INTEGER NOT NULL CHECK(cantidad >= 0),
            total NUMERIC(10,2) NOT NULL CHECK(total >= 0),
            fecha timestamp NOT NULL,

            CONSTRAINT fk_cliente
                FOREIGN KEY (fk_cliente)
                REFERENCES cliente(pk_id),
            CONSTRAINT fk_producto
                FOREIGN KEY (fk_producto)
                REFERENCES producto(pk_id)
        ) 
    `);
}

module.exports = {
    pool,
    crearTablas
};