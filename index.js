'use strict';

var Promise = require('bluebird');
var instances = {};
var defaultMysqlDriver;

/**
 * Constructor
 */
function DB() {
	this.pool = null;
}

/**
 * Setup the Database connection pool for this instance
 * @param  {Object} config
 * @param {Object} [mysql] mysql driver
 */
DB.prototype.configure = function (config, mysql) {
	if (!mysql) {
		if (!defaultMysqlDriver) {
			defaultMysqlDriver = require('mysql');
		}
		mysql = defaultMysqlDriver;
	}

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
	var self = this;
	params = params || {};

	return new Promise(function (resolve, reject) {
		self.pool.getConnection(function (err, con) {
			if (err) {
				if (con) {
					con.release();
				}
				return reject(err);
			}

			con.query(query, params, function (err) {
				if (err) {
					if (con) {
						con.release();
					}
					return reject(err);
				}
				resolve([].splice.call(arguments, 1));
				con.release();
			});
		});
	});
};

/**
 * End DB pool connections
 * @return {Promise}
 */
DB.prototype.end = function () {
	var self = this;

	return new Promise(function (resolve, reject) {
		self.pool.end(function (err) {
			if (err) {
				return reject(err);
			}

			resolve();
		});
	});
};

module.exports = function (name) {
	name = name || '_default_';
	if (!instances[name]) {
		instances[name] = new DB();
	}
	return instances[name];
};

/**
 * Get all instances
 * @return {Object}
 */
module.exports.getInstances = function () {
	return instances;
};
