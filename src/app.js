const express = require('express');
const app = express();
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager('./data/products.json');

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); 

app.use('/', viewsRouter);

io.on('connection', socket => {
  console.log('🔌 Cliente conectado con WebSocket');

  socket.on('newProduct', async (data) => {
    await productManager.addProduct(data);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
  });
});

module.exports = { httpServer, io };