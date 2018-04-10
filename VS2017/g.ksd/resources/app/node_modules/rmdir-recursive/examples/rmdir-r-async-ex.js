// require dependencies

'use strict';

try {
  var rmdirRecursive = require('../lib/rmdir-recursive');
} catch (err) {
  var rmdirRecursive = require('rmdir-recursive');
}

var fs = require('fs');

try { fs.mkdirSync('/tmp'); } catch (err) { /* ignore */ }
try { fs.mkdirSync('/tmp/deep'); } catch (err) { /* ignore */ }
try { fs.mkdirSync('/tmp/deep/more'); } catch (err) { /* ignore */ }

var dir = '/tmp/deep';
rmdirRecursive(dir, function (err) {
  if (err) {
    console.log(dir + ' cant removed with status ' + err);
  } else {
    console.log(dir + ' removed');
  }
});
rmdirRecursive(dir, function (err) {
  if (err) {
    console.log(dir + ' cant removed with status ' + err);
  } else {
    console.log(dir + ' removed');
  }
});
rmdirRecursive(dir, function (err) {
  if (err) {
    console.log(dir + ' cant removed with status ' + err);
  } else {
    console.log(dir + ' removed');
  }
});
rmdirRecursive(dir, function (err) {
  if (err) {
    console.log(dir + ' cant removed with status ' + err);
  } else {
    console.log(dir + ' removed');
  }
});
