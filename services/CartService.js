const fetch = require('node-fetch');
const Logger = require('../loaders/logger');

class CartService {
	constructor({ db, services }) {
		this.db = db;
		this.services = services;
	}

	async getAllCarts() {
		try {
			const carts = await this.db.Cart.find({});

			return { success: true, data: { carts } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async getCart(token) {
		let tokenIdUser;
		let okToken = true;
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
					if (response.success) {
						tokenIdUser = response.data.user[0]._id;
					} else {
						okToken = false;
					}
				})
				.catch((error) => {
					Logger.error(error);
				});
		} else {
			okToken = false;
		}
		try {
			if (!okToken) {
				throw new Error('The user is not logged in.');
			}
			const cart = await this.db.Cart.find({
				userId: tokenIdUser,
			});
			return { success: true, data: { cart } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async add(req) {
		const payload = req.body;
		const { cart } = req.session;
		const { token } = payload;
		let cartData;
		let okToken = true;
		let cartObj;
		let tokenUserId;

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
					if (response.success) {
						tokenUserId = response.data.user[0]._id;
					} else {
						okToken = false;
					}
				})
				.catch((error) => {
					Logger.error(error);
				});
		} else {
			okToken = false;
		}

		try {
			if (!okToken) {
				throw new Error('The user is not logged in.');
			}
			cartData = {
				token,
			};
			const date = new Date();
			date.setHours(date.getHours() + 3);
			cartData.modifiedDate = date;

			cartData.items = cart.items;
			cartData.totalPrice = cart.totalPrice;
			cartData.totalQty = cart.totalQty;
			cartData.userId = tokenUserId;
			cartData.providerId = cart.providerId;

			cartObj = new this.db.Cart(cartData);
			await cartObj.save();

			return { success: true, data: { cartObj } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async update(req) {
		const { token } = req.query;
		const { cart } = req.session;
		let tokenIdUser;
		let okToken = true;
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
					if (response.success) {
						tokenIdUser = response.data.user[0]._id;
					} else {
						okToken = false;
					}
				})
				.catch((error) => {
					Logger.error(error);
				});
		} else {
			okToken = false;
		}
		try {
			if (!okToken) {
				throw new Error('The user is not logged in.');
			}
			const cartObj = await this.db.Cart.updateOne(
				{ userId: tokenIdUser },
				cart,
			);

			return { success: true, data: { cartObj } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async deleteAll() {
		try {
			const cart = await this.db.Cart.deleteMany({});

			return { success: true, data: { cart } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async deleteCart(token) {
		let tokenIdUser;
		let okToken = true;
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
					if (response.success) {
						tokenIdUser = response.data.user[0]._id;
					} else {
						okToken = false;
					}
				})
				.catch((error) => {
					Logger.error(error);
				});
		} else {
			okToken = false;
		}
		try {
			if (!okToken) {
				throw new Error('The user is not logged in.');
			}
			const cart = await this.db.Cart.deleteOne({
				userId: tokenIdUser,
			});

			return { success: true, data: { cart } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async getProduct(idProduct) {
		let product;
		await fetch(
			`https://ip-accounts.herokuapp.com/api/courses/${idProduct}`,
		)
			.then((response) => response.json())
			.then(async function (data) {
				product = data.data[0];
				Logger.error(product);
			})
			.catch((err) => {
				throw new Error("Product doesn't exist.");
			});
		return product;
	}

	async addProduct(idProduct, cart) {
		let storedItem;

		try {
			const storedProduct = await this.getProduct(idProduct);
			if (Object.keys(cart).length === 0) {
				cart.items = [];
				cart.totalPrice = 0;
				cart.totalQty = 0;
				cart.providerId = '';
			}
			storedItem = cart.items.find((elem) => {
				return elem.id === idProduct;
			});
			if (!storedItem) {
				storedItem = {
					id: storedProduct._id,
					item: {
						price: storedProduct.price,
						quantity: 1,
						product: storedProduct.name,
					},
				};
				if (cart.providerId === '') {
					cart.providerId = storedProduct.providerId;
					cart.items.push(storedItem);
				} else if (
					cart.providerId == storedProduct.providerId
				) {
					cart.items.push(storedItem);
				} else {
					throw new Error(
						'Product is from different provider.',
					);
				}
			} else {
				if (
					cart.items[cart.items.indexOf(storedItem)].item
						.quantity === 100
				) {
					return {
						success: false,
						data: {
							mesaj:
								'Cantitatea maxima a prdusului comandat este de 100.',
							cart,
						},
					};
				}
				storedItem.item.quantity += 1;
			}
			cart.totalPrice += storedItem.item.price;
			cart.totalQty += 1;

			return { success: true, data: { cart } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async addQuantity(idProduct, cart) {
		let storedItem;
		try {
			storedItem = cart.items.find((elem) => {
				return elem.id === idProduct;
			});

			if (storedItem) {
				if (
					cart.items[cart.items.indexOf(storedItem)].item
						.quantity === 100
				) {
					return {
						success: false,
						data: {
							mesaj:
								'Cantitatea maxima a prdusului comandat este de 100.',
							cart,
						},
					};
				}
				cart.items[
					cart.items.indexOf(storedItem)
				].item.quantity += 1;
				cart.totalQty += 1;
				cart.totalPrice += storedItem.item.price;
			}

			return { success: true, data: { cart } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async substractQuantity(idProduct, cart) {
		let storedItem;
		try {
			storedItem = cart.items.find((elem) => {
				return elem.id === idProduct;
			});

			if (storedItem) {
				cart.items[
					cart.items.indexOf(storedItem)
				].item.quantity -= 1;
				cart.totalQty -= 1;
				cart.totalPrice -= storedItem.item.price;
				if (
					cart.items[cart.items.indexOf(storedItem)].item
						.quantity === 0
				) {
					this.deleteProduct(idProduct, cart);
				}
			}

			return { success: true, data: { cart } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async deleteProduct(idProduct, cart) {
		let storedItem;
		try {
			storedItem = cart.items.find((elem) => {
				return elem.id === idProduct;
			});
			cart.totalQty -= storedItem.item.quantity;
			cart.totalPrice -=
				storedItem.item.quantity * storedItem.item.price;
			cart.items.splice(cart.items.indexOf(storedItem), 1);

			return { success: true, data: { cart } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}
}

module.exports = CartService;
