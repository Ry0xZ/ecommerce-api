const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filePath) {
    this.path = filePath;  // Ruta donde se almacenarán los carritos
  }

  // Método privado para leer el archivo JSON
  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      return [];
    }
  }

  // Método privado para escribir en el archivo JSON
  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  // Crear un carrito nuevo
  async createCart() {
    const carts = await this._readFile();
    const newCart = {
      id: this._generateUniqueId(carts),
      products: []
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  // Obtener todos los carritos
  async getCarts() {
    return await this._readFile();
  }

  // Obtener un carrito por su ID
  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(cart => cart.id === id);
  }

  // Agregar un producto a un carrito
  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
      return { error: 'Carrito no encontrado' };
    }

    const productIndex = cart.products.findIndex(item => item.product === productId);
    if (productIndex === -1) {
      // Si el producto no está en el carrito, lo agregamos con cantidad 1
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      // Si el producto ya está en el carrito, aumentamos la cantidad
      cart.products[productIndex].quantity += 1;
    }

    await this._writeFile(carts);
    return cart;
  }

  // Método para generar un ID único para cada carrito
  _generateUniqueId(carts) {
    if (carts.length === 0) return 1;
    const lastId = carts[carts.length - 1].id;
    return lastId + 1;
  }
}

module.exports = CartManager;