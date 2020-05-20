const { Joi } = require('celebrate');

const orderValidationSchema = Joi.object().keys({
	userId: Joi.string()
		.regex(/^[a-fA-F0-9]{24}$/)
		.error(new Error('User id invalid')),
	email: Joi.string()
		.email()
		.required()
		.error(new Error('Email required')),
	userFirstName: Joi.string()
		.required()
		.min(2)
		.error(new Error('First name required')),
	userLastName: Joi.string()
		.required()
		.min(2)
		.error(new Error('Last name required')),
	phoneNumber: Joi.string()
		.required()
		.trim()
		.regex(/^[0-9]{7,10}$/)
		.error(new Error('Phone Number required')),
	restaurantId: Joi.string()
		.regex(/^[a-fA-F0-9]{24}$/)
		.required()
		.error(new Error('Restaurant id invalid')),
	userDeliveryAdress: Joi.string().error(
		new Error('Adress invalid'),
	),
	paymentMethod: Joi.string()
		.regex(/^(cash|card)$/)
		.error(new Error('Payment Method invalid')),
	paymentToken: Joi.string().error(
		new Error('Payment Token invalid'),
	),
});

module.exports = { orderValidationSchema };
