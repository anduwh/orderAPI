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

	async getCart(idUser) {
		try {
			const cart = await this.db.Cart.find({
				userId: idUser,
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
		const { userId } = payload;

		const cartData = {
			userId,
		};
		const date = new Date();
		date.setHours(date.getHours() + 3);
		cartData.modifiedDate = date;

		cartData.items = cart.items;
		cartData.totalPrice = cart.totalPrice;
		cartData.totalQuantity = cart.totalQty;

		const cartObj = new this.db.Cart(cartData);

		try {
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
		const { idUser } = req.params;
		const { cart } = req.session;
		try {
			const cartObj = await this.db.Cart.updateOne(
				{ userId: idUser },
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

	async deleteCart(idUser) {
		try {
			const cart = await this.db.Cart.deleteOne({
				userId: idUser,
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
		await fetch(`http://localhost:4000/api/courses/${idProduct}`)
			.then((response) => response.json())
			.then(async function (data) {
				product = data.data[0];
			})
			.catch((err) => {
				throw new Error("product doesn't exsit.");
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
				cart.items.push(storedItem);
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
