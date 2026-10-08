const express = require('express');
const app = express();

app.use(express.json());

// Rutas
const compraRoutes = require('./routes/compraRoutes');
app.use('/compras', compraRoutes);

// Para agregar más entidades en el futuro:
// const otraRoutes = require('./routes/otraRoutes');
// app.use('/otra', otraRoutes);

module.exports = app;