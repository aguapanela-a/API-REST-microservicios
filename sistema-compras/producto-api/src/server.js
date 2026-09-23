require("dotenv").config();
const express = require("express");
const productosRoutes = require("./routes/productos.routes");
const { crearTablas } = require("./data/database");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use("/productos", productosRoutes);

async function iniciarServidor() {
    try {
        await crearTablas();

        app.listen(PORT, () => {
            console.log(`producto-api escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
  res.status(200).json({ mensaje: "producto-api activa" });
});

iniciarServidor();