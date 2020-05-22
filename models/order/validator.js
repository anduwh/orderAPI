const { Joi } = require('celebrate');

const orderValidationSchema = Joi.object().keys({
	token: Joi.string().error(new Error('Token is invalid')),
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
