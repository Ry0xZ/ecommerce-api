const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');

router.use(async (req, res, next) => {
  if (!req.cookies.cartId) {
    const newCart = await Cart.create({ products: [] });
    res.cookie('cartId', newCart._id.toString(), { httpOnly: true });
    req.cartId = newCart._id;
  } else {
    req.cartId = req.cookies.cartId;
  }
  next();
});

router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = {};
  if (query) {
    if (query === 'true' || query === 'false') {
      filter.status = query === 'true';
    } else {
      filter.category = query;
    }
  }

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    lean: true
  };

  try {
    const result = await Product.paginate(filter, options);

    res.render('products', {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      cartId: req.cartId
    });
  } catch (err) {
    res.status(500).send('Error al cargar productos');
  }
});


router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetail', { product, cartId: req.cartId  });
  } catch (err) {
    res.status(500).send('Error al cargar el producto');
  }
});


router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cartDetail', { cart });
  } catch (err) {
    res.status(500).send('Error al cargar el carrito');
  }
});


router.get('/', async (req, res) => {
  const products = await Product.find().lean();
  res.render('home', { products });
});


router.get('/realtimeproducts', async (req, res) => {
  const products = await Product.find().lean();
  res.render('realTimeProducts', { products });
});

module.exports = router;