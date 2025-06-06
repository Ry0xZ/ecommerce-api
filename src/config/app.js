const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const productsRouter = require('../routes/products.router');
const cartsRouter = require('../routes/carts.router');
const viewsRouter = require('../routes/views.router');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(session({
  secret: 'CoderBackendapi',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 3600
  })
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

module.exports = app;