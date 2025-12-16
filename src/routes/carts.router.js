const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Cart = require('../models/Cart');
const Product = require('../models/Product');

const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const passport = require('passport');
const { requireRole } = require('../middlewares/authz');

const ProductRepo = require('../repositories/product.repository');
const CartRepo = require('../repositories/cart.repository');
const TicketRepo = require('../repositories/ticket.repository');

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', cart: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear el carrito' });
  }
});


router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product');
    res.json({ status: 'success', carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener carritos' });
  }
});


router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    if (!isObjectId(cid)) return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });

    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
  }
});

router.post(
  '/:cid/product/:pid',
  passport.authenticate('current', { session: false }),
  requireRole('user'),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      if (!isObjectId(cid) || !isObjectId(pid)) {
        return res.status(400).json({ status: 'error', message: 'ID de carrito o producto inválido' });
      }

      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

      const product = await Product.findById(pid);
      if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

      const qty = Number(req.body?.quantity ?? 1);
      if (!Number.isFinite(qty) || qty < 1) {
        return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
      }

      const existing = cart.products.find(p => p.product.toString() === pid);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.products.push({ product: pid, quantity: qty });
      }

      await cart.save();
      res.json({ status: 'success', message: 'Producto agregado', cart });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito' });
    }
  }
);

router.delete(
  '/:cid/products/:pid',
  passport.authenticate('current', { session: false }),
  requireRole('user'),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      if (!isObjectId(cid) || !isObjectId(pid)) {
        return res.status(400).json({ status: 'error', message: 'ID inválido' });
      }

      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

      const before = cart.products.length;
      cart.products = cart.products.filter(p => p.product.toString() !== pid);

      if (cart.products.length === before) {
        return res.status(404).json({ status: 'error', message: 'El producto no estaba en el carrito' });
      }

      await cart.save();
      res.json({ status: 'success', message: 'Producto eliminado del carrito', cart });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Error al eliminar producto del carrito' });
    }
  }
);

router.put(
  '/:cid',
  passport.authenticate('current', { session: false }),
  requireRole('user'),
  async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    if (!isObjectId(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }
    if (!Array.isArray(products)) {
      return res.status(400).json({ status: 'error', message: 'El cuerpo debe contener un array de productos' });
    }

    try {
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

      for (const item of products) {
        if (!isObjectId(item.product) || typeof item.quantity !== 'number' || item.quantity < 1) {
          return res.status(400).json({ status: 'error', message: 'Formato de productos inválido' });
        }
      }

      cart.products = products.map(p => ({ product: p.product, quantity: p.quantity }));
      await cart.save();

      res.json({ status: 'success', message: 'Carrito actualizado', cart });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
    }
  }
);

router.put(
  '/:cid/products/:pid',
  passport.authenticate('current', { session: false }),
  requireRole('user'),
  async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!isObjectId(cid) || !isObjectId(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
    }

    try {
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

      const idx = cart.products.findIndex(p => p.product.toString() === pid);
      if (idx === -1) {
        cart.products.push({ product: pid, quantity });
      } else {
        cart.products[idx].quantity = quantity;
      }

      await cart.save();
      res.json({ status: 'success', message: 'Cantidad actualizada', cart });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Error al actualizar cantidad del producto' });
    }
  }
);

router.delete(
  '/:cid',
  passport.authenticate('current', { session: false }),
  requireRole('user'),
  async (req, res) => {
    try {
      const { cid } = req.params;
      if (!isObjectId(cid)) {
        return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
      }

      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

      cart.products = [];
      await cart.save();

      res.json({ status: 'success', message: 'Carrito vaciado', cart });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Error al vaciar el carrito' });
    }
  }
);

router.post(
  '/:cid/purchase',
  passport.authenticate('current', { session: false }),
  requireRole('user'),
  async (req, res) => {
    try {
      const { cid } = req.params;
      if (!isObjectId(cid)) return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });

      const cart = await CartRepo.getById(cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

      let amount = 0;
      const notProcessed = [];
      const purchasable = [];

      for (const item of cart.products) {
        const prod = await ProductRepo.getById(item.product);
        if (!prod) continue;

        const updated = await ProductRepo.decStock(prod._id, item.quantity);
        if (!updated) {
          notProcessed.push({ product: prod._id, wanted: item.quantity, available: prod.stock });
        } else {
          amount += prod.price * item.quantity;
          purchasable.push(item);
        }
      }

      let ticket = null;
      if (purchasable.length) {
        ticket = await TicketRepo.create({
          code: uuidv4(),
          purchase_datetime: dayjs().toDate(),
          amount,
          purchaser: req.user.email
        });
      }

      await CartRepo.setProducts(cid, notProcessed);

      res.json({
        status: 'success',
        ticket,
        notProcessed
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al procesar la compra' });
    }
  }
);

module.exports = router;