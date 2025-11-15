const express = require('express');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { createHash } = require('../utils/authUtils');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('cart');
    res.json({ status: 'success', users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findById(req.params.uid).populate('cart');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    res.json({ status: 'success', user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Datos incompletos' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
    }

    const cart = await Cart.create({ products: [] });

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role: role || 'user',
      cart: cart._id
    });

    res.status(201).json({ status: 'success', user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

router.put('/:uid', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    const updates = { first_name, last_name, email, age, role };

    if (password) {
      updates.password = createHash(password);
    }

    const user = await User.findByIdAndUpdate(req.params.uid, updates, { new: true });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

router.delete('/:uid', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.uid);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    res.json({ status: 'success', message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

module.exports = router;