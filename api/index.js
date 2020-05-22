const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { Router } = require('express');

const app = Router();

// Import all the routers
const orderRouter = require('./routes/orderRouter');
const cartRouter = require('./routes/cartRouter');

// Add all the routers as middlewares
app.use(cookieParser());
app.use(
	session({
		name: 'cart.1',
		secret: 'cartSession',
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
		}),
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
			secure: false,
			httpOnly: false,
		},
	}),
);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);

module.exports = app;
