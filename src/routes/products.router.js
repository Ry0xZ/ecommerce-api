const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { requireRole } = require('../middlewares/authz');

const Product = require('../models/Product');

const router = express.Router();

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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
    const { pid } = req.params;
    if (!isObjectId(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    const product = await Product.findById(pid).lean();
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
  }
});

router.post('/',
  passport.authenticate('current', { session: false }),
  requireRole('admin'),
  async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;

    if (!title || !description || !price || !code || !stock || status === undefined || !category) {
      return res.status(400).json({ status: 'error', message: 'Faltan datos del producto' });
    }

    try {
      const existing = await Product.findOne({ code });
      if (existing) {
        return res.status(400).json({ status: 'error', message: 'El código ya está en uso' });
      }

      const newProduct = await Product.create({
        title, description, price, thumbnail, code, stock, status, category
      });

      res.status(201).json({ status: 'success', product: newProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al agregar el producto' });
    }
  }
);

router.put('/:pid',
  passport.authenticate('current', { session: false }),
  requireRole('admin'),
  async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;

    if (!isObjectId(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    if (!title || !description || !price || !code || !stock || status === undefined || !category) {
      return res.status(400).json({ status: 'error', message: 'Faltan datos para actualizar el producto' });
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        pid,
        { title, description, price, thumbnail, code, stock, status, category },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }

      res.json({ status: 'success', product: updatedProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al actualizar el producto' });
    }
  }
);

router.delete('/:pid',
  passport.authenticate('current', { session: false }),
  requireRole('admin'),
  async (req, res) => {
    try {
      const { pid } = req.params;
      if (!isObjectId(pid)) {
        return res.status(400).json({ status: 'error', message: 'ID inválido' });
      }

      const result = await Product.findByIdAndDelete(pid);
      if (!result) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }
      res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
    }
  }
);

module.exports = router;