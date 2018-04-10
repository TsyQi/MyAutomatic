// require dependencies

'use strict';

var co = require('co');
try {
  var rmdirRecursive = require('../lib/rmdir-recursive');
} catch (err) {
  var rmdirRecursive = require('rmdir-recursive');
}

var fs = require('fs');

try { fs.mkdirSync('/tmp'); } catch (err) { /* ignore */ }
try { fs.mkdirSync('/tmp/deep'); } catch (err) { /* ignore */ }
try { fs.mkdirSync('/tmp/deep/more'); } catch (err) { /* ignore */ }

// co generator
var p = co(function *() {
  var dir = '/tmp/deep';
  try {
    yield rmdirRecursive(dir);
    console.log(dir + ' removed');
  } catch (err) {
    console.log(dir + ' cant removed with status ' + err);
  }
});

if (p && p.then && typeof p.then === 'function') p.then(function () {});
else if (typeof p === 'function') p();
else {
  console.log(require('util').inspect(p, {colors: true, depth: null}));
  throw new Error('what is the value returned from co: ' + typeof p);
}
