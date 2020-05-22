const fetch = require('node-fetch');
const stripe = require('stripe')(
	'sk_test_6Qtc8kKAPJVEFZ69mObgzgSA00Sej2WCK9',
);

const nodemailer = require('nodemailer');
const Logger = require('../loaders/logger');

class OrderService {
	constructor({ db, services }) {
		this.db = db;
		this.services = services;
	}

	async getAllOrders() {
		try {
			const orders = await this.db.Order.find({});

			return { success: true, data: { orders } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async getOrder(idOrder) {
		try {
			const orders = await this.db.Order.find({
				_id: idOrder,
			});

			return { success: true, data: { orders } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async submit(req, cartService) {
		const payload = req.body;
		let DbCart;
		let okToken = true;
		let tokenUserId;

		const {
			token,
			email,
			userFirstName,
			userLastName,
			phoneNumber,
			userDeliveryAdress,
			paymentMethod,
		} = payload;

		if (token) {
			const bearer = `Bearer ${token}`;
			await fetch(
				'https://ip-accounts.herokuapp.com/api/users/auth',
				{
					method: 'GET',
					headers: {
						Authorization: bearer,
					},
				},
			)
				.then((res) => {
					return res.json();
				})
				.then((response) => {
					if (!response.success) {
						okToken = false;
					} else {
						tokenUserId = response.data.user[0]._id;
					}
				})
				.catch((error) => {
					Logger.error(error);
				});
			DbCart = (await cartService.getCart(token)).data;
		}

		const cart = req.session.cart
			? req.session.cart
			: {
					items: [
						{
							id: '5e9494d0dd757435187a6dc0',
							item: {
								price: 20,
								quantity: 1,
								product: 'Pizza',
							},
						},
					],
					totalPrice: 20,
					totalQty: 1,
			  };

		const orderData = {
			email,
			userFirstName,
			userLastName,
			phoneNumber,
			userDeliveryAdress,
			paymentMethod,
		};
		const date = new Date();
		date.setHours(date.getHours() + 3);
		orderData.orderDate = date;

		if (token && okToken) {
			orderData.guest = false;
			orderData.items = DbCart.cart[0].items;
			orderData.amount = DbCart.cart[0].totalPrice;
			orderData.userId = tokenUserId;
			orderData.restaurantId = DbCart.cart[0].providerId;
		} else {
			orderData.items = cart.items;
			orderData.amount = cart.totalPrice;
			orderData.restaurantId = cart.providerId;
		}

		const order = new this.db.Order(orderData);

		try {
			const existsOrder = await this.db.Order.findByData(
				email,
				date,
			);

			if (!okToken) {
				throw new Error('The user is not logged in.');
			}

			if (!existsOrder) {
				if (req.body.paymentMethod === 'card') {
					if (token && okToken) {
						await this.cardPayment(
							DbCart.cart[0],
							req.body.paymentToken,
						);
					} else {
						await this.cardPayment(
							cart,
							req.body.paymentToken,
						);
					}

					await this.sendPaymentMail(orderData);
				}
				await order.save();
				await this.sendOrderMail(orderData);

				if (token && okToken) {
					fetch(
						'https://ip-accounts.herokuapp.com/api/clients/addCommand',
						{
							method: 'POST',
							body: {
								clientId: order.userId,
								providerId: order.restaurantId,
								commandId: order._id,
							},
						},
					)
						.then((res) => {
							return res.json();
						})
						.catch((error) => {
							Logger.error(error);
						});
				}

				if (order.userId) {
					cartService.deleteCart(order.userId);
				} else {
					delete req.session.cart;
				}
			}

			return { success: true, data: { order } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async sendOrderMail(orderData) {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'restaurantapp20ip@gmail.com',
				pass: 'restaurantapp20!',
			},
			tls: {
				rejectUnauthorized: false,
			},
		});
		let products = ` `;
		for (let i = 0; i < orderData.items.length; i += 1) {
			products += `<p>nume: ${orderData.items[i].item.product},<br> pret: ${orderData.items[i].item.price},<br> cantitate:${orderData.items[i].item.quantity}<br></p>`;
		}
		const mailOptions = {
			from: 'restaurantapp20ip@gmail.com',
			to: 'ana.zanceanu@gmail.com',
			subject: 'Confirmare comanda',
			html: `<h2>Comanda a fost plasata cu success!</h2>${products} pret Total: ${orderData.amount} <br>`,
		};

		transporter.sendMail(mailOptions, function (error) {
			if (error) {
				Logger.error(error);
			} else {
				Logger.info(`Order Email sent`);
			}
		});
	}

	async sendPaymentMail(orderData) {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'restaurantapp20ip@gmail.com',
				pass: 'restaurantapp20!',
			},
		});

		const mailOptions = {
			from: 'restaurantapp20ip@gmail.com',
			to: 'andrasimion99@gmail.com',
			subject: 'Confirmare plata',
			html: `<h2>Plata comenzii s-a efectuat cu success!</h2>pret Total: ${orderData.amount} <br>`,
		};

		transporter.sendMail(mailOptions, function (error) {
			if (error) {
				Logger.error(error);
			} else {
				Logger.info(`Payment Email sent`);
			}
		});
	}

	async cardPayment(cart, tokenId) {
		stripe.charges.create(
			{
				amount: cart.totalPrice * 100,
				currency: 'usd',
				source: tokenId,
				description: 'Test Charge',
			},
			function (error) {
				if (error) {
					Logger.error(error);
				} else {
					Logger.info('Payment successfully made.');
				}
			},
		);
	}

	async deleteAll() {
		try {
			const order = await this.db.Order.deleteMany({});

			return { success: true, data: { order } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async deleteOrder(idOrder) {
		try {
			const order = await this.db.Order.deleteOne({
				_id: idOrder,
			});

			return { success: true, data: { order } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}
}

module.exports = OrderService;
