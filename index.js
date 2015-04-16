'use strict';

var Promise = require('bluebird'),
	mysql = require('mysql'),
	instances = {};

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

module.exports = function (name) {
	name = name || '_default_';
	if (!instances[name]) {
		instances[name] = new DB();
	}
	return instances[name];
};
