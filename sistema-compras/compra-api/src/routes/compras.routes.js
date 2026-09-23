const express = require("express");
const router = express.Router();
const compras = require("../data/compras");
const { pool } = require("../data/database");

const { obtenerCliente, obtenerClienteDB } = require("../services/clienteService");
const { obtenerProducto, obtenerProductoDB } = require("../services/productoService");

let siguienteId = 1;

// GET /compras
router.get("/db", async(req, res) => {
  try {
        const compras = await pool.query(
            "SELECT * FROM compra"
        );

        res.json(compras.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener las compras"
        });
    }
  });

// GET /compras/:id
router.get("/db/:id", async (req, res) => {
  const id = Number(req.params.id);
  
  try {
        const compra = await pool.query(
            "SELECT * FROM compra WHERE pk_id = $1", 
            [id]
        );


        if (!compra) {
          return res.status(404).json({ mensaje: "Compra no encontrada" });
        }

        res.status(200).json(compra.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener la compra"
        });
    }
});

// POST /compras
router.post("/db", async (req, res) => {
  const { id, clienteId, productoId, cantidad } = req.body;

  if (!id || !clienteId || !productoId || !cantidad) {
    return res.status(400).json({
      mensaje: "Los campos 'id', 'clienteId', 'productoId' y 'cantidad' son obligatorios"
    });
  }
  let cliente;
  let producto;

  try {
    try {
      cliente = await obtenerClienteDB(clienteId);
      producto = await obtenerProductoDB(productoId);
    } catch (error) {
      return res.status(503).json({
        mensaje: "No se pudo validar la compra porque uno de los servicios no respondió",
        detalle: error.message
      });
    }

    if (!cliente) {
      return res.status(404).json({ mensaje: `El cliente ${clienteId} no existe` });
    }

    if (!producto) {
      return res.status(404).json({ mensaje: `El producto ${productoId} no existe` });
    }

    if (producto.stock < cantidad) {
      return res.status(400).json({
        mensaje: `Stock insuficiente. Disponible: ${producto.stock}, solicitado: ${cantidad}`
      });
    }

    const total =  producto.precio * cantidad;
    const fecha = new Date().toISOString();

    const nuevaCompra = await pool.query(
      `INSERT INTO compra (pk_id, fk_cliente, fk_producto, cantidad, total, fecha)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING pk_id, fk_cliente, fk_producto, cantidad, total, fecha`,
      [id, clienteId, productoId, cantidad, total, fecha]
    );

    res.status(201).json(nuevaCompra.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear la compra"
    });
  }
});

// PUT /compras/:id
router.put("/db/:id", async (req, res) => {

  const id = Number(req.params.id);

  const {clienteId, productoId, cantidad, total, fecha} = req.body;

  if (clienteId === undefined && productoId === undefined && cantidad === undefined && total === undefined && fecha === undefined) {
    return res.status(400).json({
      mensaje: "Debe proporcionar al menos un campo para actualizar"
    });
  }

  try{

    const compra = await pool.query(
      `UPDATE compra
       SET
         fk_cliente = COALESCE($1, fk_cliente),
         fk_producto = COALESCE($2, fk_producto),
         cantidad = COALESCE($3, cantidad),
         total = COALESCE($4, total),
         fecha = COALESCE($5, fecha)
       WHERE pk_id = $6
       RETURNING pk_id, fk_cliente, fk_producto, cantidad, total, fecha`,
      [clienteId, productoId, cantidad, total, fecha, id]
    );

    if (compra.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Compra no encontrado"
      });
    }

    res.status(200).json(compra.rows[0]);
    

  } catch (error){
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar la compra"
    });
  }
})

// DELETE
// /compras/:id
router.delete("/db/:id", async (req, res) => {

  const id = Number(req.params.id)

  try{
    const result = await pool.query(
      "DELETE FROM compra WHERE pk_id = $1 RETURNING pk_id",
      [id]
    );

    if(result.rows.length === 0){
      res.status(404).json({
        mensaje: "No se encontró la compra"
      });
    }

    res.status(204).send();

  } catch (error){
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar la compra"
    });
  }
})

// GET /compras
router.get("/", (req, res) => {
  res.status(200).json(compras);
});

// GET /compras/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const compra = compras.find((compra) => compra.id === id);

  if (!compra) {
    return res.status(404).json({ mensaje: "Compra no encontrada" });
  }

  res.status(200).json(compra);
});

// POST /compras
router.post("/", async (req, res) => {
  const { clienteId, productoId, cantidad } = req.body;

  if (!clienteId || !productoId || !cantidad) {
    return res.status(400).json({
      mensaje: "Los campos 'clienteId', 'productoId' y 'cantidad' son obligatorios"
    });
  }

  let cliente;
  let producto;

  try {
    cliente = await obtenerCliente(clienteId);
    producto = await obtenerProducto(productoId);
  } catch (error) {
    return res.status(503).json({
      mensaje: "No se pudo validar la compra porque uno de los servicios no respondió",
      detalle: error.message
    });
  }

  if (!cliente) {
    return res.status(404).json({ mensaje: `El cliente ${clienteId} no existe` });
  }

  if (!producto) {
    return res.status(404).json({ mensaje: `El producto ${productoId} no existe` });
  }

  if (producto.stock < cantidad) {
    return res.status(400).json({
      mensaje: `Stock insuficiente. Disponible: ${producto.stock}, solicitado: ${cantidad}`
    });
  }

  const nuevaCompra = {
    id: siguienteId++,
    clienteId,
    productoId,
    cantidad,
    total: producto.precio * cantidad,
    fecha: new Date().toISOString()
  };

  compras.push(nuevaCompra);
  res.status(201).json(nuevaCompra);
});

// PUT /compras/:id
router.put("/:id", async (req, res) => {

  const id = Number(req.params.id);
  const compra = compras.find((compra) => compra.id === id);

  if (!compra) {
    return res.status(404).json({ mensaje: "Compra no encontrado" });
  }

  let { clienteId, productoId, cantidad } = req.body;

  let cliente;
  let producto

  if (clienteId == undefined) clienteId = compra.clienteId
  if (productoId == undefined) productoId = compra.productoId
  if (cantidad == undefined) cantidad = compra.cantidad

  try {
    cliente = await obtenerCliente(clienteId);
    producto = await obtenerProducto(productoId);
  } catch (error) {
    return res.status(503).json({
      mensaje: "No se pudo validar la compra porque uno de los servicios no respondió",
      detalle: error.message
    });
  }

  if (!cliente) {
    return res.status(404).json({ mensaje: `El cliente ${clienteId} no existe` });
  }

  if (!producto) {
    return res.status(404).json({ mensaje: `El producto ${productoId} no existe` });
  }

  if (producto.stock < cantidad) {
    return res.status(400).json({
      mensaje: `Stock insuficiente. Disponible: ${producto.stock}, solicitado: ${cantidad}`
    });
  }

  compra.clienteId = clienteId
  compra.productoId = productoId
  compra.cantidad = cantidad

  res.status(200).json(compra)

})

// DELETE
// /compras/:id
router.delete("/:id", (req, res) => {

  const id = Number(req.params.id)
  const index = compras.findIndex((compra) => compra.id === id)

  if (index === -1) {
    return res.status(404).json({ mensaje: "Compra no encontrada" })
  }

  compras.splice(index, 1)
  res.status(200).json({ mensaje: "Compra eliminada correctamente" })
})

module.exports = router;