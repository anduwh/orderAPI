const mongoose = require('mongoose');
const cartSchema = require('./schema');

const statics = require('./statics');
const methods = require('./methods');

Object.assign(cartSchema.methods, methods);
Object.assign(cartSchema.statics, statics);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
