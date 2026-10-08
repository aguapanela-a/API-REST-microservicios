const express = require('express');
const app = express();

app.use(express.json());

// Rutas
const productoRoutes = require('./routes/productoDBRoutes');
app.use('/libros', productoRoutes);

module.exports = app;