const express = require('express');
const app = express();
const PORT = 8080;

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

// Manejo de JSON
app.use(express.json()); 

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); 

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});