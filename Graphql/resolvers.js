const resolvers = {


    // primero la solgica de cada query

    clientes: async () => {

        const respuesta = await fetch(`${CLIENTE_API_URL}/clientes`);

        if (respuesta.status === 404) {
            return null;
        }

        if (!respuesta.ok) {
            throw new Error(`cliente-api respondió con estado ${respuesta.status}`);
        }

        return respuesta.json();
    },


    productos: async () => {
        const respuesta = await fetch(`${PRODUCTO_API_URL}/productos`);

        if (respuesta.status === 404) {
            return null;
        }

        if (!respuesta.ok) {
            throw new Error(`producto-api respondió con estado ${respuesta.status}`);
        }

        return respuesta.json();
    },

    compras: async () => {
        const respuesta = await fetch(`${COMPRA_API_URL}/compras`);

        if (respuesta.status === 404) {
            return null;
        }

        if (!respuesta.ok) {
            throw new Error(`compra-api respondió con estado ${respuesta.status}`);
        }

        return respuesta.json();
    }

};

module.exports = resolvers;

//  const respuesta = await fetch(`${PRODUCTO_API_URL}/productos/${id}`);
