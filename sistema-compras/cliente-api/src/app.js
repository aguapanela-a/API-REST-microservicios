// registro de rutas de este microservicio

const express = require("express");
const app = express();

app.use(express.json());

const clienteRoutes = require("./routes/clientes.routes");
app.use("/clientes", clienteRoutes);

module.exports = app;