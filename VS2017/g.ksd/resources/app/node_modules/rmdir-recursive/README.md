rmdir-recursive
===============

  **rmdir-recursive** is a function like `rmdir -r`.

  This function is yieldable, thunkified, useful with co.

Installation
------------

```bash
$ npm install rmdir-recursive
```

Usage
-----

```js
var rmdirRecursive = require('rmdir-recursive');
```

### `rmdirRecursive`

#### **dir** - directory path name

#### **[callback]** - {optional} function callback(err)

#### **retuns** - thunk for `co`

### `rmdirRecursive.sync` or `rmdirRecursive.rmdirRecursiveSync`

#### **dir** - directory path name

Examples
--------

### co example

```js
// require dependencies
var co = require('co');
var rmdirRecursive = require('rmdir-recursive');

// co generator
co(function *() {
  var dir = '/tmp/deep';
  try {
    yield rmdirRecursive(dir);
    console.log(dir + ' removed');
  } catch (err) {
    console.log(dir + ' cant removed with status ' + err);
  }
}).then(function () {});
```

### async example

```js
// require dependencies
var rmdirRecursive = require('rmdir-recursive');

var dir = '/tmp/deep';
rmdirRecursive(dir, function (err) {
  if (err) {
    console.log(dir + ' cant removed with status ' + err);
  } else {
    console.log(dir + ' removed');
  }
});
```


### sync example

```js
// require dependencies
var rmdirRecursiveSync = require('rmdir-recursive').sync;

var dir = '/tmp/deep';
try {
  rmdirRecursiveSync(dir);
  console.log(dir + ' removed');
} catch (err) {
  console.log(dir + ' cant removed with status ' + err);
}
```

License
-------

  MIT
