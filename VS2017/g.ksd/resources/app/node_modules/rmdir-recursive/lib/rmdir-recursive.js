// rmdir-recursive.js

'use strict';

var fs = require('fs');
var path = require('path');


//######################################################################
/**
 * Function: remove directory recursively (async)
 * Param   : dir: path to make directory
 *           [cb]: {optional} callback(err) function
 */
function rmdirRecursive(dir, cb) {
  // check arguments
  if (typeof dir !== 'string') {
    throw new Error('rmdirRecursive: directory path required');
  }

  if (cb !== undefined && typeof cb !== 'function') {
    throw new Error('rmdirRecursive: callback must be function');
  }

  var ctx = this, called, results;

  fs.exists(dir, function existsCallback(exists) {

    // already removed? then nothing to do
    if (!exists) return rmdirRecursiveCallback(null);

    fs.stat(dir, function statCallback(err, stat) {

      if (err) return rmdirRecursiveCallback(err);

      if (!stat.isDirectory())
        return fs.unlink(dir, rmdirRecursiveCallback);

      var files = fs.readdir(dir, readdirCallback);

    }); // fs.stat callback...

    // fs.readdir callback...
    function readdirCallback(err, files) {

      if (err) return rmdirRecursiveCallback(err);

      var n = files.length;
      if (n === 0) return fs.rmdir(dir, rmdirRecursiveCallback);

      files.forEach(function (name) {

        rmdirRecursive(path.resolve(dir, name), function (err) {

          if (err) return rmdirRecursiveCallback(err);

          if (--n === 0)
            return fs.rmdir(dir, rmdirRecursiveCallback);

        }); // rmdirRecursive

      }); // files.forEach

    } // readdirCallback

  }); // fs.exists

  // rmdirRecursiveCallback(err)
  function rmdirRecursiveCallback(err) {
    if (err && err.code === 'ENOENT') err = arguments[0] = null;

    if (!results) results = arguments;
    if (!cb || called) return;
    called = true;
    cb.apply(ctx, results);
  } // rmdirRecursiveCallback

  // return rmdirRecursiveYieldable
  return function rmdirRecursiveYieldable(fn) {
    if (!cb) cb = fn;
    if (!results || called) return;
    called = true;
    cb.apply(ctx, results);
  }; // rmdirRecursiveYieldable

} // rmdirRecursive


//######################################################################
/**
 * Function: remove directory recursively (sync)
 * Param   : dir: path to remove directory
 */
function rmdirRecursiveSync(dir) {
  // check arguments
  if (typeof dir !== 'string')
    throw new Error('rmdirRecursiveSync: directory path required');

  // already removed? then nothing to do
  if (!fs.existsSync(dir)) return;

  // is file? is not directory? then remove file
  try {
    var stat = fs.statSync(dir);
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
  if (!stat.isDirectory()) {
    try {
      return fs.unlinkSync(dir);
    } catch (err) {
      if (err.code === 'ENOENT') return;
      throw err;
    }
  }

  // remove all contents in it
  fs.readdirSync(dir).forEach(function (name) {
    rmdirRecursiveSync(path.resolve(dir, name));
  });

  try {
    return fs.rmdirSync(dir);
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
}


exports = module.exports   = rmdirRecursive;
exports.rmdirRecursive     = rmdirRecursive;
exports.rmdirRecursiveSync = rmdirRecursiveSync;
exports.sync               = rmdirRecursiveSync;
