const express = require("express");
const router = express.Router();
const productos = require("../data/productos");//Data quemada
const { pool } = require("../data/database"); //Conexión BD

let siguienteId = 3;

// GET /productos
router.get("/db", async (req, res) => {
  try {
        const productos = await pool.query(
            "SELECT * FROM producto"
        );

        res.json(productos.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener los productos"
        });
    }
});

// GET /productos/:id
router.get("/db/:id", async (req, res) => {
  const id = Number(req.params.id);
  
  try {
        const producto = await pool.query(
            "SELECT * FROM producto WHERE pk_id = $1", 
            [id]
        );


        if (!producto) {
          return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.status(200).json(producto.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener el producto"
        });
    }
  
});

// POST /productos
router.post("/db", async (req, res) => {
  const { id, nombre, precio, stock } = req.body;

  if (!id || !nombre || !precio || !stock) {
    return res
      .status(400)
      .json({ mensaje: "Los campos 'id', 'nombre', 'precio' y 'stock' son obligatorios" });
  }

  try {
    const nuevoProducto = await pool.query(
      `INSERT INTO producto (pk_id, nombre, precio, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING pk_id, nombre, precio, stock`,
      [id, nombre, precio, stock]
    );

    res.status(201).json(nuevoProducto.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear el producto"
    });
  }
});

// ------------------------------------------------------------
// PUT /productos/:id
// Actualiza un producto existente identificado por su id.
// ------------------------------------------------------------
router.put("/db/:id", async (req, res) => {
  const id = Number(req.params.id);
  const {nombre, precio, stock} = req.body;

  if (nombre === undefined && precio === undefined && stock === undefined) {
    return res.status(400).json({
      mensaje: "Debe proporcionar al menos un campo para actualizar"
    });
  }

  try{

    const producto = await pool.query(
      `UPDATE producto
       SET
         nombre = COALESCE($1, nombre),
         precio = COALESCE($2, precio),
         stock = COALESCE($3, stock)
       WHERE pk_id = $4
       RETURNING pk_id, nombre, precio, stock`,
      [nombre, precio, stock, id]
    );

    if (producto.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json(producto.rows[0]);
    

  } catch (error){
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar el producto"
    });
  }
});

// ------------------------------------------------------------
// DELETE /productos/:id
// Elimina un producto identificado por su id.
// ------------------------------------------------------------
router.delete("/db/:id", async(req, res) => {
  const id = Number(req.params.id);
  
  try{
    const result = await pool.query(
      "DELETE FROM producto WHERE pk_id = $1 RETURNING pk_id",
      [id]
    );

    if(result.rows.length === 0){
      res.status(404).json({
        mensaje: "No se encontró el producto"
      });
    }

    res.status(204).send();

  } catch (error){
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar el producto"
    });
  }
});

// GET /productos
router.get("/", (req, res) => {
  res.status(200).json(productos);
});

// GET /productos/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((producto) => producto.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  res.status(200).json(producto);
});

// POST /productos
router.post("/", (req, res) => {
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({
      mensaje: "Los campos 'nombre', 'precio' y 'stock' son obligatorios"
    });
  }

  const nuevoProducto = { id: siguienteId++, nombre, precio, stock };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// ------------------------------------------------------------
// PUT /productos/:id
// Actualiza un producto existente identificado por su id.
// ------------------------------------------------------------
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((producto) => producto.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  const {nombre, precio, stock} = req.body;

  if (nombre !== undefined) producto.nombre = nombre;
  if (precio !== undefined) producto.precio = precio;
  if (stock !== undefined) producto.stock = stock;


  res.status(200).json(producto);
});

// ------------------------------------------------------------
// DELETE /productos/:id
// Elimina un producto identificado por su id.
// ------------------------------------------------------------
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = productos.findIndex((producto) => producto.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  productos.splice(indice, 1);
  res.status(204).send();
});

module.exports = router;