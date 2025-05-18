const express = require('express');
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager('./src/data/carts.json');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json({ carts });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carritos' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
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
    const cart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
    if (cart.error) {
      return res.status(404).json(cart);
    }
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;