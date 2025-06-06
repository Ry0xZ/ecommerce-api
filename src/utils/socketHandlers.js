module.exports = (io, productManager) => {
  io.on('connection', async (socket) => {
    console.log('🟢 Cliente conectado');

    try {
      const products = await productManager.getProducts();
      socket.emit('updateProducts', products);
    } catch (err) {
      console.error('❌ Error al obtener productos iniciales:', err.message);
    }

    socket.on('newProduct', async (data) => {
      try {
        await productManager.addProduct(data);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
      } catch (err) {
        console.error('❌ Error al agregar producto:', err.message);
        socket.emit('errorMessage', 'Error al agregar producto');
      }
    });

    socket.on('deleteProduct', async (id) => {
      try {
        await productManager.deleteProduct(id);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
      } catch (err) {
        console.error('❌ Error al eliminar producto:', err.message);
        socket.emit('errorMessage', 'Error al eliminar producto');
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado');
    });
  });
};