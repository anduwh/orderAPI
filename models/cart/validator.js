const { Joi } = require('celebrate');

const cartValidationSchema = Joi.object().keys({
	userId: Joi.string()
		.regex(/^[a-fA-F0-9]{24}$/)
		.error(new Error('User id invalid')),
});

module.exports = { cartValidationSchema };
