const Order = require('./order/index');
const { orderValidationSchema } = require('./order/validator');
const Cart = require('./cart/index');
const { cartValidationSchema } = require('./cart/validator');

module.exports = {
	Order,
	orderValidationSchema,
	Cart,
	cartValidationSchema,
};
