const fs = require('fs').promises;  // Para trabajar con archivos de manera asíncrona
const path = require('path');  // Para manejar rutas

class ProductManager {
  constructor(filePath) {
    this.path = filePath;  // La ruta al archivo donde se almacenarán los productos
  }

  // Método privado para leer el archivo JSON
  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');  // Si el archivo está vacío, retornamos un array vacío
    } catch (err) {
      return [];  // Si el archivo no existe, retornamos un array vacío
    }
  }

  // Método privado para escribir en el archivo JSON
  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));  // Guardamos los datos en el archivo
  }

  // Obtener todos los productos
  async getProducts() {
    return await this._readFile();
  }

  // Obtener un producto por su ID
  async getProductById(id) {
    const products = await this._readFile();
    return products.find(product => product.id === id);  // Buscamos el producto por ID
  }

  // Agregar un nuevo producto
  async addProduct(product) {
    const products = await this._readFile();
    const newProduct = {
      ...product,
      id: this._generateUniqueId(products),  // Generamos un ID único
    };

    products.push(newProduct);  // Añadimos el nuevo producto al arreglo
    await this._writeFile(products);  // Guardamos los productos en el archivo
    return newProduct;
  }

  // Actualizar un producto existente
  async updateProduct(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
      return { error: 'Producto no encontrado' };  // Si no se encuentra el producto, retornamos un error
    }

    // No se puede modificar el ID, por eso lo mantenemos igual
    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    await this._writeFile(products);  // Guardamos los productos actualizados
    return updatedProduct;
  }

  // Eliminar un producto
  async deleteProduct(id) {
    const products = await this._readFile();
    const newProducts = products.filter(product => product.id !== id);

    if (newProducts.length === products.length) {
      return { error: 'Producto no encontrado' };  // Si no se elimina nada, retornamos un error
    }

    await this._writeFile(newProducts);  // Guardamos el nuevo arreglo de productos
    return { message: 'Producto eliminado correctamente' };
  }

  // Método para generar un ID único para cada nuevo producto
  _generateUniqueId(products) {
    if (products.length === 0) return 1;  // Si no hay productos, el primer ID será 1
    const lastId = products[products.length - 1].id;
    return lastId + 1;  // El ID será el último + 1
  }
}

module.exports = ProductManager;