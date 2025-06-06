const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});


router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product');
    res.json({ carts });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carritos' });
  }
});


router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const existing = cart.products.find(p => p.product.toString() === req.params.pid);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.json({ message: 'Producto agregado', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});


router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
});


router.put('/:cid', async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'El cuerpo debe contener un array de productos' });
  }

  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products }, { new: true });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ message: 'Carrito actualizado', cart });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});


router.put('/:cid/products/:pid', async (req, res) => {
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
    if (productIndex === -1) {
      cart.products.push({ product: req.params.pid, quantity });
    } else {
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ message: 'Cantidad actualizada', cart });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar cantidad del producto' });
  }
});


router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ message: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
});

module.exports = router;