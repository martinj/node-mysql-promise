'use strict';

var Promise = require('bluebird');
var mysql = require('mysql');
var instances = {};

function DB() {
	this.pool = null;
}

/**
 * Setup the Database connection pool for this instance
 * @param  {Object} config
 */
DB.prototype.configure = function (config) {
	this.pool = mysql.createPool(config);
};

/**
 * Check if a pool has been configured for this instane.
 * @return {Boolean}
 */
DB.prototype.isConfigured = function () {
	return Boolean(this.pool);
};

/**
 * Run DB query
 * @param  {String} query
 * @param  {Object} [params]
 * @return {Promise}
 */
DB.prototype.query = function (query, params) {
	var defer = Promise.defer();
	params = params || {};

	this.pool.getConnection(function (err, con) {
		if (err) {
			if (con) {
				con.release();
			}
			return defer.reject(err);
		}

		con.query(query, params, function (err) {
			if (err) {
				if (con) {
					con.release();
				}
				return defer.reject(err);
			}
			defer.resolve([].splice.call(arguments, 1));
			con.release();
		});
	});
	return defer.promise;
};

/**
 * End DB pool connections
 * @return {Promise}
 */
DB.prototype.end = function () {
	var defer = Promise.defer();

	this.pool.end(function (err) {
		if (err) {
			return defer.reject(err);
		}

		defer.resolve();
	});
	return defer.promise;
};

module.exports = function (name) {
	name = name || '_default_';
	if (!instances[name]) {
		instances[name] = new DB();
	}
	return instances[name];
};
