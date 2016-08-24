# Changelog

## 3.1.0

* [[a8b693f](../../commit/a8b693f)] Update deps: mysql@2.11.1
* [[b08d495](../../commit/b08d495)] chore(package): update bluebird to version 3.4.1

## 3.0.0

* [[ecd493a](../../commit/ecd493a)] Change mysql implementation selection to be passed as parameter to .configure() instead of the constructor.
* [[3ae597a](../../commit/3ae597a)] Update bluebird@3.4.0 and dev dependencies.

## 2.1.0

*  [[e62613e](../../commit/e62613e)] Add support for selecting mysql driver e.g mysql2.

## 2.0.0

Now uses bluebird@3.x which may contain breaking changes.

* [ebcb0aa](../../commit/ebcb0aa) - Remove deprecated bluebird functions. Added more tests.
* [6ec64e2](../../commit/6ec64e2) - Change linting.
* [7ca2cd4](../../commit/7ca2cd4) - chore(package): update dependencies

## 1.5.0

- *Changed* dependencies bluebird@2.10.2, mysql@2.10.2
- *Added* isConfigured() on the DB instance to check if a pool has been configured.
