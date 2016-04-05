'use strict';
var db = require('../');
require('should');

describe('mysql-promise', function () {
	it('should return correct instance', function () {
		var defaultDb = db();
		var namedDb = db('foo');
		namedDb.should.equal(db('foo'));
		defaultDb.should.equal(db());
		defaultDb.should.not.equal(namedDb);
	});

	describe('isConfigured()', function () {

		it('should return false if it has no pool configured', function () {
			var defaultDb = db();
			defaultDb.isConfigured().should.be.false;
		});

		it('should return false if it has no pool configured', function () {
			var defaultDb = db();
			defaultDb.configure({
				host: 'localhost',
				user: 'foo',
				password: 'bar',
				database: 'db'
			});
			defaultDb.isConfigured().should.be.true;
		});

	});

});
