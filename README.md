# API-REST-microservicios
API - REST pequeña para hacer microservicios es express.js y node.js

# Integrantes
Nicolás Castro Rivera - 20221020055
Erick Santiago Buitrago Peña - 20221020072
Juan Andrés Jiménez Palomino - 20221020087

# cURLs de Prueba para cada servicio
En este apartado, se agregaran distintos cURLs para probar cada microservicio

## Cliente-API
**Consultar**
* Un solo cliente por id: 
``
curl http://localhost:3001/clientes/2
``
* Todos los clientes:
``
curl http://localhost:3001/clientes
``

**Crear**
``
curl -X POST http://localhost:3001/clientes -H "Content-Type: application/json" -d '{"nombre":"Nico","email":"nicocadoavocado@gmail.com"}'
``

**Actualizar**
``
curl -X PUT http://localhost:3001/clientes/3 -H "Content-Type: application/json" -d '{"email":"nicolas@gmail.com"}'
``

**Eliminar**
``
curl -X DELETE http://localhost:3001/clientes/3
``

## Producto-API
**Consultar**
* Un solo producto por id: 
``
curl http://localhost:3002/productos/2
``
* Todos los productos:
``
curl http://localhost:3002/productos
``

**Crear**
``
curl -X POST http://localhost:3002/productos -H "Content-Type: application/json" -d '{"nombre":"Awa de owo","precio":"5500", "stock":"35"}'
``

**Actualizar**
``
curl -X PUT http://localhost:3002/productos/3 -H "Content-Type: application/json" -d '{"precio":"3500"}'
``

**Eliminar**
``
curl -X DELETE http://localhost:3002/productos/3
``

## Compra-API
**Consultar**
* Una solo compra por id: 
``
curl http://localhost:3003/compras/1
``
* Todas las compras:
``
curl http://localhost:3003/compras
``

**Crear**
``
curl -X POST http://localhost:3003/compras -H "Content-Type: application/json" -d '{"clienteId":"1","productoId":"2", "cantidad":"1"}'
``

**Actualizar**
``
curl -X PUT http://localhost:3003/compras/1 -H "Content-Type: application/json" -d '{"cantidad":"2"}'
``

**Eliminar**
``
curl -X DELETE http://localhost:3003/compras/1
``