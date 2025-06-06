const express = require('express');
const Product = require('../models/Product');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = { $regex: new RegExp(query, 'i') };
      }
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
      lean: true
    };

    const result = await Product.paginate(filter, options);

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
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

  if (!title || !description || !price || !code || !stock || status === undefined || !category) {
    return res.status(400).json({ error: 'Faltan datos del producto' });
  }

  try {
    const existing = await Product.findOne({ code });
    if (existing) {
      return res.status(400).json({ error: 'El código ya está en uso' });
    }

    const newProduct = await Product.create({ title, description, price, thumbnail, code, stock, status, category });
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});


router.put('/:pid', async (req, res) => {
  const { title, description, price, thumbnail, code, stock, status, category } = req.body;

  if (!title || !description || !price || !code || !stock || status === undefined || !category) {
    return res.status(400).json({ error: 'Faltan datos para actualizar el producto' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.pid,
      { title, description, price, thumbnail, code, stock, status, category },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


router.delete('/:pid', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.pid);
    if (!result) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;