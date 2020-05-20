const findByData = async function (email, date) {
	const order = await this.findOne({
		email,
		date,
	});

	if (order) {
		throw new Error('Order already exists.');
	}

	return order;
};

module.exports = {
	findByData,
};
