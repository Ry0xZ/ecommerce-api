const express = require('express');
const passport = require('passport');

const User = require('../models/User');
const Cart = require('../models/Cart');
const UserDTO = require('../dtos/user.dto');
const { createHash, generateToken } = require('../utils/authUtils');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son obligatorios.'
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        status: 'error',
        message: 'El email ya está registrado.'
      });
    }

    const cart = await Cart.create({ products: [] });

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: cart._id
    });

    const safeUser = new UserDTO(user);

    return res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente.',
      user: safeUser
    });
  } catch (error) {
    console.error('Error en /api/sessions/register:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor.'
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error en estrategia login:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor.'
      });
    }

    if (!user) {
      let message = 'Usuario o contraseña inválidos.';
      if (info?.message === 'User not found') message = 'El usuario no existe.';
      else if (info?.message === 'Incorrect password') message = 'Contraseña incorrecta.';

      return res.status(401).json({ status: 'error', message });
    }

    const token = generateToken(user);
    const safeUser = new UserDTO(user);

    return res.json({
      status: 'success',
      message: 'Login exitoso.',
      token,
      user: safeUser
    });
  })(req, res, next);
});

router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    const safeUser = new UserDTO(req.user);
    return res.json({
      status: 'success',
      user: safeUser
    });
  }
);

module.exports = router;