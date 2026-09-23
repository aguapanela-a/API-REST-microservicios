const express = require("express");
const router = express.Router();
const clientes = require("../data/clientes"); //Data quemada
const { pool } = require("../data/database"); //Conexión BD

let siguienteId = 3;

// GET /clientes
router.get("/db", async (req, res) => {
  try {
        const clientes = await pool.execute(
            "SELECT * FROM cliente"
        );

        res.json(clientes.rows);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los clientes"
        });
    }
});

// GET /clientes/:id
router.get("/db/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
        const cliente = await pool.execute(
            "SELECT * FROM cliente WHERE pk_id = $1", 
            [id]
        );


        if (!cliente) {
          return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        res.status(200).json(cliente.rows[0]);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los clientes"
        });
    }
});

// POST /clientes
router.post("/db", async (req, res) => {
  const { id, nombre, email } = req.body;

  if (!id || !nombre || !email) {
    return res
      .status(400)
      .json({ mensaje: "Los campos 'id', 'nombre' e 'email' son obligatorios" });
  }

  try {
    const nuevoCliente = await pool.query(
      `INSERT INTO cliente (pk_id, nombre, email)
       VALUES ($1, $2, $3)
       RETURNING pk_id, nombre, email`,
      [id, nombre, email]
    );

    res.status(201).json(nuevoCliente.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear el cliente"
    });
  }
});

// PUT /clientes/:id
router.put("/db/:id", async (req, res) => {
  const id = Number(req.params.id);
  const {nombre, email} = req.body;

  if (nombre === undefined && email === undefined) {
    return res.status(400).json({
      mensaje: "Debe proporcionar al menos un campo para actualizar"
    });
  }

  try{

    const cliente = await pool.query(
      `UPDATE cliente
       SET
         nombre = COALESCE($1, nombre),
         email = COALESCE($2, email)
       WHERE pk_id = $3
       RETURNING pk_id, nombre, email`,
      [nombre, email, id]
    );

    if (cliente.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.status(200).json(cliente.rows[0]);
    

  } catch (error){
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar el cliente"
    });
  }
  
  res.status(200).json(cliente);

})

// Delete /clientes/:id
router.delete("/db/:id", async (req, res) => {
  const id = Number(req.params.id);

  try{
    const result = await pool.query(
      "DELETE FROM cliente WHERE pk_id = $1 RETURNING id",
      [id]
    );

    if(result.rows.length === 0){
      res.status(404).json({
        mensaje: "No se encontró el cliente"
      });
    }

    res.status(204).send();

  } catch (error){
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar el cliente"
    });
  }
})

// GET /clientes
router.get("/", (req, res) => {
  res.status(200).json(clientes);
});

// GET /clientes/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const cliente = clientes.find((cliente) => cliente.id === id);

  if (!cliente) {
    return res.status(404).json({ mensaje: "Cliente no encontrado" });
  }

  res.status(200).json(cliente);
});

// POST /clientes
router.post("/", (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res
      .status(400)
      .json({ mensaje: "Los campos 'nombre' y 'email' son obligatorios" });
  }

  const nuevoCliente = { id: siguienteId++, nombre, email };
  clientes.push(nuevoCliente);
  res.status(201).json(nuevoCliente);
});

// PUT /clientes/:id
router.put("/:id",(req, res) => {
  const id = Number(req.params.id);
  const cliente = clientes.find((cliente) => cliente.id === id);

  if(!cliente){
    return res.status(404).json({ mensaje: "Cliente no encontrado" });
  }

  const {nombre, email} = req.body;

  if (nombre !== undefined) cliente.nombre = nombre;
  if (email !== undefined) cliente.email = email;

  res.status(200).json(cliente);

})

// Delete /clientes/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = clientes.findIndex((cliente) => cliente.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Cliente no encontrado" });
  }

  clientes.splice(indice, 1);
  res.status(204).send();
})

module.exports = router;