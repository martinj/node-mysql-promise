'use strict';
var db = require('../');
require('should');

describe('mysql-promise', function () {
	it('should return correct instance', function () {
		var defaultDb = db();
		var namedDb = db('foo');
		namedDb.should.equal(db('foo'));
    namedDb.should.have.property('query').which.is.a.Function;
    namedDb.should.have.property('execute').which.is.a.Function;
		defaultDb.should.equal(db());
		defaultDb.should.not.equal(namedDb);
    defaultDb.should.have.property('query').which.is.a.Function;
    defaultDb.should.have.property('execute').which.is.a.Function;
	});
});