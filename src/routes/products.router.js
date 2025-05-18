const express = require('express');
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager('./src/data/products.json');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});


router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock || status === undefined || !category) {
      return res.status(400).json({ error: 'Faltan datos del producto' });
    }
  
    try {
      const newProduct = await productManager.addProduct({ title, description, price, thumbnail, code, stock, status, category });
      res.status(201).json({ product: newProduct });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto' });
    }
  });

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
  
    if (!title || !description || !price || !thumbnail || !code || !stock || status === undefined || !category) {
      return res.status(400).json({ error: 'Faltan datos para actualizar el producto' });
    }
  
    try {
      const updatedProduct = await productManager.updateProduct(parseInt(pid), { title, description, price, thumbnail, code, stock, status, category });
      if (updatedProduct.error) {
        return res.status(404).json(updatedProduct);
      }
      res.json({ product: updatedProduct });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  }); 

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const result = await productManager.deleteProduct(parseInt(pid));
    if (result.error) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;