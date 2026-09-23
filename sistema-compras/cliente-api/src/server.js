require("dotenv").config();
const express = require("express");
const clientesRoutes = require("./routes/clientes.routes");
const { crearTablas } = require("./data/database")

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/clientes", clientesRoutes);

async function iniciarServidor() {
    try {
        await crearTablas();

        app.listen(PORT, () => {
            console.log(`cliente-api escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
  res.status(200).json({ mensaje: "cliente-api activa" });
});

iniciarServidor();
