const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }


  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      return [];
    }
  }


  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }


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


  async getCarts() {
    return await this._readFile();
  }


  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(cart => cart.id === id);
  }


  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
      return { error: 'Carrito no encontrado' };
    }

    const productIndex = cart.products.findIndex(item => item.product === productId);
    if (productIndex === -1) {

      cart.products.push({ product: productId, quantity: 1 });
    } else {

      cart.products[productIndex].quantity += 1;
    }

    await this._writeFile(carts);
    return cart;
  }

  _generateUniqueId(carts) {
    if (carts.length === 0) return 1;
    const lastId = carts[carts.length - 1].id;
    return lastId + 1;
  }
}

module.exports = CartManager;