// Import all the users models
const db = require('../models/index');

// Import all the service constructors
const OrderService = require('./OrderService');
const CartService = require('./CartService');

// Create the service objects with dependencies
const orderService = new OrderService({
	db: {
		Order: db.Order,
		Cart: db.Cart,
	},
	services: {},
});

const cartService = new CartService({
	db: {
		Cart: db.Cart,
	},
	services: {},
});

// Export the service object
module.exports = {
	orderService,
	cartService,
};
