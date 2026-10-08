const express = require('express');
const router = express.Router();
const {
  obtenerTodos,
  obtenerUno,
  crear,
  actualizar,
  eliminar,
} = require('../controllers/compraController');

router.get('/',          obtenerTodos);
router.get('/:isbn',     obtenerUno);
router.post('/',         crear);
router.put('/:isbn',     actualizar);
router.delete('/:isbn',  eliminar);

module.exports = router;