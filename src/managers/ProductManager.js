const path = require('path');
const { readFile, writeFile } = require('../utils/fileManager');

class ProductManager {
  constructor(filePath) {
    this.path = path.resolve(__dirname, '..', filePath);
  }

  async getProducts() {
    return await readFile(this.path);
  }

  async getProductById(id) {
    const products = await readFile(this.path);
    return products.find(product => product.id === id);
  }

  async addProduct(product) {
    const products = await readFile(this.path);

    const exists = products.some(p => p.code === product.code);
    if (exists) {
      throw new Error('Ya existe un producto con ese código');
    }

    const newProduct = {
      ...product,
      id: this._generateUniqueId(products),
    };

    products.push(newProduct);
    await writeFile(this.path, products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await readFile(this.path);
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
      return { error: 'Producto no encontrado' };
    }

    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    await writeFile(this.path, products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await readFile(this.path);
    const newProducts = products.filter(product => product.id !== id);

    if (newProducts.length === products.length) {
      return { error: 'Producto no encontrado' };
    }

    await writeFile(this.path, newProducts);
    return { message: 'Producto eliminado correctamente' };
  }

  _generateUniqueId(products) {
    if (products.length === 0) return 1;
    const lastId = products[products.length - 1].id;
    return lastId + 1;
  }
}

module.exports = ProductManager;