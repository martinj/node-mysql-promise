# mysql-promise

Small wrapper for mysql that use promises.

[![build status](https://secure.travis-ci.org/martinj/node-mysql-promise.png)](http://travis-ci.org/martinj/node-mysql-promise)

## Installation

This module is installed via npm:

``` bash
$ npm install mysql-promise
```

## Example Usage

``` js
var db = require('mysql-promise');
db.configure({
	"host": "localhost",
	"user": "foo",
	"password": "bar",
	"database": "db"
});

db.query('UPDATE foo SET key = ?', ['value']).then(function () {
	return db.query('SELECT * FROM foo');
}).spread(function (rows) {
	console.log('Loook at all the foo', rows);
});
```
