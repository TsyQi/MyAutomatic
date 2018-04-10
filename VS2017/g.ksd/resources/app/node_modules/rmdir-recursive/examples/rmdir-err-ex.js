'use strict';

var fs = require('fs');

console.log('mkdir');
fs.mkdirSync('./test');
console.log('rmdir');
fs.rmdirSync('./test');
console.log('rmdir');
fs.rmdirSync('./test');

/*
mkdir
rmdir
rmdir

fs.js:612
  return binding.rmdir(pathModule._makeLong(path));
                 ^
Error: ENOENT, no such file or directory 'xxx\test'
    at Object.fs.rmdirSync (fs.js:612:18)
    at Object.<anonymous> (xxx\rmdir-err-ex.js:10:4)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Function.Module.runMain (module.js:497:10)
    at startup (node.js:119:16)
    at node.js:906:3
*/
