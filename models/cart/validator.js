const { Joi } = require('celebrate');

const cartValidationSchema = Joi.object().keys({
	token: Joi.string().error(new Error('Token is invalid')),
});

module.exports = { cartValidationSchema };
