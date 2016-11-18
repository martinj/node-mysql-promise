'use strict';
var mysql = require('../');
var mysql2 = require('mysql2');
var sinon = require('sinon');

var dbConfig = {
	host: 'localhost',
	user: 'travis',
	database: 'mysqlpromise'
};

var should = require('should');

describe('mysql-promise', function () {
	it('should return correct instance', function () {
		var db = mysql();
		var namedDb = mysql('foo');
		namedDb.should.equal(mysql('foo'));
		db.should.equal(mysql());
		db.should.not.equal(namedDb);
	});

	describe('isConfigured()', function () {

		it('should return false if it has no pool configured', function () {
			var db = mysql();
			db.isConfigured().should.be.false;
		});

		it('should return false if it has no pool configured', function () {
			var db = mysql();
			db.configure({
				host: 'localhost',
				user: 'foo',
				password: 'bar',
				database: 'db'
			});
			db.isConfigured().should.be.true;
		});

	});

	describe('getConnection()', function () {

		it('should return a connection', function (done) {
			var db = mysql('connection');
			db.configure(dbConfig);
			db.getConnection()
				.then(function (con) {
					should(con).exist;
					con.release();
					done();
				})
				.catch(done);
		});

		it('should reject if it fails to open a connection', function (done) {
			var db = mysql('connectFail');
			db.configure({
				host: 'localhost',
				port: 1123,
				user: 'foo',
				password: 'bar',
				database: 'db',
				connectTimeout: 5
			});

			db.getConnection()
				.catch({ code: 'ECONNREFUSED' }, done.bind(null, null))
				.catch(done);
		});

	});
	describe('query()', function () {

		beforeEach(function (done) {
			var db = mysql('query');
			db.configure(dbConfig);

			db.query('DELETE FROM test')
				.then(done.bind(null, null))
				.catch(done);
		});

		it('should return results', function (done) {
			var db = mysql('query');

			db.query('INSERT INTO test SET ?', { id: 1, foobar: 'monkey' })
				.spread(function (res) {
					res.affectedRows.should.equal(1);
					return db.query('SELECT * FROM test');
				})
				.spread(function (rows) {
					rows.should.have.a.lengthOf(1);
					rows[0].id.should.equal(1);
					rows[0].foobar.should.equal('monkey');
					done();
				})
				.catch(done);
		});

		it('should reject on error', function (done) {
			var db = mysql('query');

			db.query('SELECT * FROM non_existing_table')
				.catch({ code: 'ER_NO_SUCH_TABLE' }, function (err) {
					err.should.exist;
					done();
				})
				.catch(done);

		});
	});

	describe('end()', function () {

		it('should close all connections in the pool', function (done) {
			var db = mysql('end');
			db.configure(dbConfig);
			db.query('SELECT * FROM test')
				.then(function () {
					db.pool._allConnections.should.have.a.lengthOf(1);
					return db.end();
				})
				.then(function () {
					db.pool._allConnections.should.have.a.lengthOf(0);
					done();
				})
				.catch(done);
		});

	});

	describe('Specifying mysql driver', function () {

		beforeEach(function () {
			sinon.spy(mysql2, 'createPool');
		});

		afterEach(function () {
			mysql2.createPool.restore();
		});

		it('should use mysql2', function (done) {
			var db = mysql('mysql2');
			db.configure(dbConfig, mysql2);
			mysql2.createPool.calledOnce.should.be.true();

			db.query('SELECT * FROM non_existing_table')
				.catch({ code: 'ER_NO_SUCH_TABLE' }, function (err) {
					err.should.exist;
					done();
				})
				.catch(done);
		});
	});
});
