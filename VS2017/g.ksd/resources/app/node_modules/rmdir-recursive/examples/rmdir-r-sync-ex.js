// require dependencies

'use strict';

try {
  var rmdirRecursiveSync = require('../lib/rmdir-recursive').sync;
} catch (err) {
  var rmdirRecursiveSync = require('rmdir-recursive').sync;
}

var fs = require('fs');

try { fs.mkdirSync('/tmp'); } catch (err) { /* ignore */ }
try { fs.mkdirSync('/tmp/deep'); } catch (err) { /* ignore */ }
try { fs.mkdirSync('/tmp/deep/more'); } catch (err) { /* ignore */ }

var dir = '/tmp/deep';
try {
  rmdirRecursiveSync(dir);
  console.log(dir + ' removed');
} catch (err) {
  console.log(dir + ' cant removed with status ' + err);
}
