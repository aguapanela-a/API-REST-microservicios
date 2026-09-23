require("dotenv").config();
const express = require("express");
const comprasRoutes = require("./routes/compras.routes");
const { crearTablas } = require("./data/database");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use("/compras", comprasRoutes);

async function iniciarServidor() {
    try {
        await crearTablas();

        app.listen(PORT, () => {
            console.log(`compra-api escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
  res.status(200).json({ mensaje: "compra-api activa" });
});

iniciarServidor();