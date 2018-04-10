/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
function appendTextSync(filename, text) {
    fs_1.appendFileSync(filename, text);
}
exports.appendTextSync = appendTextSync;
function writeFile(filename, data, encoding) {
    if (encoding === void 0) { encoding = "utf8"; }
    return new Promise(function (resolve, reject) {
        try {
            fs_1.writeFile(filename, data, { encoding: encoding }, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.writeFile = writeFile;
function deleteFile(filename) {
    return new Promise(function (resolve, reject) {
        fs_1.unlink(filename, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}
exports.deleteFile = deleteFile;
function makeDirectoryRecursive(directoryPath) {
    function makeDirectory() {
        return new Promise(function (resolve, reject) {
            fs_1.mkdir(directoryPath, 511, function (error) {
                if (!error) {
                    resolve(directoryPath);
                }
                else {
                    if (error.code && error.code === "EEXIST") {
                        fs_1.stat(directoryPath, function (statError, stat) {
                            if (stat.isDirectory()) {
                                resolve(directoryPath);
                            }
                            else {
                                reject(error);
                            }
                        });
                    }
                    else {
                        reject(error);
                    }
                }
            });
        });
    }
    return makeDirectory()
        .catch(function (error) {
        if (error.code === "ENOENT") {
            return makeDirectoryRecursive(path.dirname(directoryPath)).then(makeDirectory);
        }
        else {
            return Promise.reject(error);
        }
    });
}
exports.makeDirectoryRecursive = makeDirectoryRecursive;
function copyFile(sourcePath, destinationPath) {
    return new Promise(function (resolve, reject) {
        var readStream = fs_1.createReadStream(sourcePath);
        readStream
            .once("error", reject);
        var writeStream = fs_1.createWriteStream(destinationPath);
        writeStream
            .once("close", function () { return resolve(destinationPath); })
            .once("error", reject);
        readStream.pipe(writeStream);
    });
}
exports.copyFile = copyFile;
function copyFileToStream(sourcePath, writeStream) {
    return new Promise(function (resolve, reject) {
        var readStream = fs_1.createReadStream(sourcePath);
        readStream
            .once("error", reject);
        writeStream
            .once("close", resolve)
            .once("error", reject);
        readStream.pipe(writeStream);
    });
}
exports.copyFileToStream = copyFileToStream;
function readFileAsString(targetPath) {
    return new Promise(function (resolve, reject) {
        fs_1.readFile(targetPath, "utf8", function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.readFileAsString = readFileAsString;
function deleteDirectoryRecursiveSync(directoryPath) {
    try {
        fs_1.readdirSync(directoryPath)
            .forEach(function (child) {
            var childPath = path.join(directoryPath, child);
            if (fs_1.statSync(childPath).isDirectory()) {
                deleteDirectoryRecursiveSync(childPath);
            }
            else {
                fs_1.unlinkSync(childPath);
            }
        });
        fs_1.rmdirSync(directoryPath);
    }
    catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
}
exports.deleteDirectoryRecursiveSync = deleteDirectoryRecursiveSync;
/**
 * @returns {Promise<boolean>} - result is true if directory can be accessed
 */
function directoryExists(directoryPath) {
    return new Promise(function (resolve) {
        fs_1.access(directoryPath, function (err) {
            resolve(!err);
        });
    });
}
exports.directoryExists = directoryExists;
function selectWindowsProgramFilesDir() {
    // if %ProgramFiles(x86)% is defined, we're on a 64-bit system and we want
    // to use that as our default installation root
    var dir = process.env["ProgramFiles(x86)"];
    if (dir) {
        return dir;
    }
    // we're on a 32-bit system, so we'll use %ProgramFiles%
    return process.env.ProgramFiles;
}
exports.selectWindowsProgramFilesDir = selectWindowsProgramFilesDir;
function arePathsEqual(path1, path2) {
    return path.normalize(path1).toLowerCase() === path.normalize(path2).toLowerCase();
}
exports.arePathsEqual = arePathsEqual;
/**
 * Determines if the input path is a valid system path.
 * Note: The check is case-insensitive.
 * @returns {boolean} - true if the path is valid, false otherwise
 */
function isPathValid(targetPath) {
    return path.resolve(targetPath).toLowerCase() === targetPath.toLowerCase();
}
exports.isPathValid = isPathValid;
//# sourceMappingURL=FileSystem.js.map