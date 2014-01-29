'use strict';

var Promise = require('bluebird'),
	mysql = require('mysql'),
	pool = null;

/**
 * Setup the Database connection pool
 * @param  {Object} config
 */
exports.configure = function (config) {
	pool = mysql.createPool(config);
};

/**
 * Run DB query
 * @param  {String} query
 * @param  {Object} [params]
 * @return {Promise}
 */
exports.query = function (query, params) {
	var defer = Promise.defer();
	params = params || {};

	pool.getConnection(function (err, con) {
		if (err) {
			return defer.reject(err);
		}

		con.query(query, params, function (err) {
			if (err) {
				return defer.reject(err);
			}
			defer.resolve([].splice.call(arguments, 1));
			con.release();
		});
	});
	return defer.promise;
};
