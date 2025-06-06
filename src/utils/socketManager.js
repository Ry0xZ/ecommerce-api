const Product = require('../models/Product'); 

const socketManager = (io) => {
  io.on('connection', async (socket) => {
    console.log('🟢 Cliente conectado por socket.io');

    try {
      const products = await Product.find().lean();
      socket.emit('updateProducts', products);
    } catch (error) {
      console.error('❌ Error al obtener productos iniciales:', error.message);
    }

    socket.on('newProduct', async (data) => {
      try {
        await Product.create(data);
        const updatedProducts = await Product.find().lean();
        io.emit('updateProducts', updatedProducts);
      } catch (error) {
        console.error('❌ Error al agregar producto:', error.message);
      }
    });

    socket.on('deleteProduct', async (id) => {
      try {
        await Product.findByIdAndDelete(id);
        const updatedProducts = await Product.find().lean();
        io.emit('updateProducts', updatedProducts);
      } catch (error) {
        console.error('❌ Error al eliminar producto:', error.message);
      }
    });
  });
};

module.exports = socketManager;