const { Router } = require('express');
const { celebrate } = require('celebrate');
const { cartService } = require('../../services/index');
const { statusCodes } = require('../../config/index');

const { cartValidationSchema } = require('../../models/index');

const router = Router();

// Here we have all the controllers
router.get('/session', async (req, res) => {
	const result = {
		success: true,
		data: req.session.cart ? req.session.cart : 'empty cart',
	};

	res.status(statusCodes.OK).json(result);
});

router.get('/', async (req, res) => {
	const result = await cartService.getAllCarts();
	const statusCode = result.success
		? statusCodes.OK
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.get('/clear', async (req, res) => {
	delete req.session.cart;

	res.status(statusCodes.OK).json({
		success: true,
		data: 'Cart cleared',
	});
});

router.get('/:idUser', async (req, res) => {
	const result = await cartService.getCart(req.params.idUser);
	const statusCode = result.success
		? statusCodes.OK
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.post(
	'/',
	celebrate({
		body: cartValidationSchema,
	}),
	async function (req, res) {
		const result = await cartService.add(req);
		const statusCode = result.success
			? statusCodes.CREATED
			: statusCodes.BAD_REQUEST;

		res.status(statusCode).json(result);
	},
);

router.patch('/:idUser', async function (req, res) {
	const result = await cartService.update(req);
	const statusCode = result.success
		? statusCodes.ACCEPTED
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.delete('/all', async (req, res) => {
	const result = await cartService.deleteAll();
	const statusCode = result.success
		? statusCodes.NO_CONTENT
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.delete('/:idUser', async (req, res) => {
	const result = await cartService.deleteCart(req.params.idUser);
	const statusCode = result.success
		? statusCodes.NO_CONTENT
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.get('/add-product/:idProduct', async (req, res) => {
	const result = await cartService.addProduct(
		req.params.idProduct,
		req.session.cart ? req.session.cart : {},
	);

	const statusCode = result.success
		? statusCodes.OK
		: statusCodes.BAD_REQUEST;
	if (statusCode === statusCodes.OK) {
		req.session.cart = result.data.cart;
	}

	res.status(statusCode).json(result);
});

router.get('/add-quantity/:idProduct', async (req, res) => {
	const result = await cartService.addQuantity(
		req.params.idProduct,
		req.session.cart ? req.session.cart : {},
	);
	req.session.cart = result.data.cart;
	const statusCode = result.success
		? statusCodes.OK
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.get('/substract-quantity/:idProduct', async (req, res) => {
	const result = await cartService.substractQuantity(
		req.params.idProduct,
		req.session.cart ? req.session.cart : {},
	);
	req.session.cart = result.data.cart;
	const statusCode = result.success
		? statusCodes.OK
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

router.get('/delete-product/:idProduct', async (req, res) => {
	const result = await cartService.deleteProduct(
		req.params.idProduct,
		req.session.cart ? req.session.cart : {},
	);
	req.session.cart = result.data.cart;
	const statusCode = result.success
		? statusCodes.OK
		: statusCodes.BAD_REQUEST;

	res.status(statusCode).json(result);
});

module.exports = router;
