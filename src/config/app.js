const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const productsRouter = require('../routes/products.router');
const cartsRouter = require('../routes/carts.router');
const viewsRouter = require('../routes/views.router');
const sessionsRouter = require('../routes/sessions.router');
const usersRouter = require('../routes/users.router');
const passport = require('passport');
const passwordRouter = require('../routes/password.router');
const initializePassport = require('./passport.config');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsession',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60 * 24,
  }),
   cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false 
   }
}));



initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '..', 'public')));


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/api/password', passwordRouter);

module.exports = app;