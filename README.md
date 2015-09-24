# mysql-promise

Small wrapper for [mysql](https://www.npmjs.com/package/mysql) that use promises.

[![build status](https://secure.travis-ci.org/martinj/node-mysql-promise.png)](http://travis-ci.org/martinj/node-mysql-promise)

## Installation

This module is installed via npm:

``` bash
$ npm install mysql-promise
```

## Example Usage

``` js
var db = require('mysql-promise')();

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

//using multiple databases, giving it a name 'second-db' so it can be retrieved inside other modules/files.
var db2 = require('mysql-promise')('second-db');

db2.configure({
	"host": "localhost",
	"user": "foo",
	"password": "bar",
	"database": "another-db"
});

db2.query('SELECT * FROM users').spread(function (users) {
	console.log('Hello users', users);
});

```
