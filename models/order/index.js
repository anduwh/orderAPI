const mongoose = require('mongoose');
const orderSchema = require('./schema');

const statics = require('./statics');
const methods = require('./methods');
// const decorateWithHooks = require('./hooks');

Object.assign(orderSchema.methods, methods);
Object.assign(orderSchema.statics, statics);
// decorateWithHooks(reservationSchema);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
