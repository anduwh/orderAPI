const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		required: false,
	},
	modifiedDate: {
		type: Date,
		required: true,
	},
	totalQuantity: {
		type: Number,
		min: 1,
		required: true,
	},
	totalPrice: {
		type: Number,
		min: 1,
		required: true,
	},
	items: [
		{
			id: {
				type: mongoose.Types.ObjectId,
				required: true,
			},
			item: {
				price: { type: Number, required: true, min: 1 },
				quantity: { type: Number, required: true, min: 1 },
				product: { type: String, required: true },
			},
		},
	],
});

module.exports = cartSchema;
