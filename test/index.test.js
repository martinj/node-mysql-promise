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
});