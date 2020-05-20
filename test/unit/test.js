const request = require('supertest');
const { describe, it } = require('mocha');
const express = require('express');
const assert = require('assert');
const chai = require('chai');

const expect = chai.expect;

const url = 'http://localhost:3000/api/v1';

describe('/orders ROUTES', function () {
	this.timeout(5000);
	it('GET /orders route works', (done) => {
		request(url)
			.get('/orders')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(true);
				expect(res.body.data.orders).to.be.a('array');
				done();
			});
	});

	it("GET /orders when id doesn't exist", (done) => {
		request(url)
			.get('/orders/1')
			.expect('Content-Type', /json/)
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(false);
				done();
			});
	});

	it('POST /orders route works', (done) => {
		request(url)
			.post('/orders')
			.send({
				email: 'test@yahoo.com',
				userFirstName: 'Test',
				userLastName: 'Test',
				phoneNumber: '2341341227',
				restaurantId: '5eb16d673a637d28884dc226',
				paymentMethod: 'cash',
				userDeliveryAdress: 'Str. Palat 10',
			})
			.expect('Content-Type', /json/)
			.expect(201)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(true);
				expect(res.body.data.order).to.be.a('object');
				expect(res.body.data.order.email).to.equal(
					'test@yahoo.com',
				);
				done();
			});
	});

	it('POST /orders when data is not valid', (done) => {
		request(url)
			.post('/orders')
			.send({
				email: 'rffd',
				userFirstName: '',
				userLastName: '',
				phoneNumber: '2',
				restaurantId: '5e',
				paymentMethod: 'ca',
				userDeliveryAdress: '45r3',
			})
			.expect('Content-Type', /json/)
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(false);
				done();
			});
	});
});

describe('/cart ROUTES', function () {
	this.timeout(5000);
	it("/cart/add-product/:idProduct with invalid Product returns product doesn't exsit.", (done) => {
		request(url)
			.get('/cart/add-product/1')
			.expect('Content-Type', /json/)
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(false);
				expect(res.body.error.message).to.equal(
					"product doesn't exsit.",
				);
				done();
			});
	});

	it('/cart/add-product/:idProduct with valid Product returns success:true', (done) => {
		request(url)
			.get('/cart/add-product/5ec045778c937258547fd0d9')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(true);
				expect(res.body.data.cart.items).to.be.a('array');
				done();
			});
	});

	it('/cart/clear route works and it deletes the cart session', (done) => {
		request(url)
			.get('/cart/clear')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(true);
				expect(res.body.data).to.equal('Cart cleared');
				done();
			});
	});

	it('/cart/:idUser route works and it deletes the cart for the user.', (done) => {
		request(url)
			.delete('/cart/5eb16fdf4afbf654966cb68d')
			.expect(204, done);
	});

	it('/cart/:idUser with invalid User route works and it returns error', (done) => {
		request(url)
			.delete('/cart/1')
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(false);
				expect(res.body.error.message).to.be.a('string');
				done();
			});
	});
});
