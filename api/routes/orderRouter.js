const { Router } = require('express');
const { celebrate } = require('celebrate');
const { orderService } = require('../../services/index');
const { cartService } = require('../../services/index');
const { statusCodes } = require('../../config/index');

const { orderValidationSchema } = require('../../models/index');

const router = Router();

// Here we have all the controllers
router.get('/', async (req, res) => {
	const result = await orderService.getAllOrders();
	const statusCode = result.success
		? statusCodes.OK
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.get('/:idOrder', async (req, res) => {
	const result = await orderService.getOrder(req.params.idOrder);
	const statusCode = result.success
		? statusCodes.OK
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.post(
	'/',
	celebrate({
		body: orderValidationSchema,
	}),
	async function (req, res) {
		let result;

		if (req.body.userId) {
			result = await orderService.submit(req, cartService);
		} else {
			result = await orderService.submit(req);
		}

		const statusCode = result.success
			? statusCodes.CREATED
			: statusCodes.BAD_REQUEST;

		res.status(statusCode).json(result);
	},
);

router.delete('/all', async (req, res) => {
	const result = await orderService.deleteAll();
	const statusCode = result.success
		? statusCodes.NO_CONTENT
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.delete('/:idOrder', async (req, res) => {
	const result = await orderService.deleteOrder(req.params.idOrder);
	const statusCode = result.success
		? statusCodes.NO_CONTENT
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

module.exports = router;
