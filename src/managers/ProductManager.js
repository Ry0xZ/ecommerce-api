const fs = require('fs').promises;  
const path = require('path');  

class ProductManager {
  constructor(filePath) {
    this.path = path.resolve(__dirname, '..', filePath);
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(product => product.id === id);
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newProduct = {
      ...product,
      id: this._generateUniqueId(products),
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
      return { error: 'Producto no encontrado' };
    }

   
    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    await this._writeFile(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const newProducts = products.filter(product => product.id !== id);

    if (newProducts.length === products.length) {
      return { error: 'Producto no encontrado' };
    }

    await this._writeFile(newProducts);
    return { message: 'Producto eliminado correctamente' };
  }

  _generateUniqueId(products) {
    if (products.length === 0) return 1;
    const lastId = products[products.length - 1].id;
    return lastId + 1;
  }
}

module.exports = ProductManager;