/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystem_1 = require("../FileSystem");
/**
 * Downloads the content retrieved from a file to the writable stream.
 *
 * @param path The path to the file.
 * @param writableStream The writable stream to write the file's content to.
 * @return A promise.
 */
function getResource(path, writeStream) {
    return FileSystem_1.copyFileToStream(path, writeStream);
}
exports.getResource = getResource;
/**
 * Downloads the content retrieved from a file as a string.
 *
 * @param path The path to the file.
 * @return A promise with a value containing the content as a stream.
 */
function getResourceAsString(path) {
    return FileSystem_1.readFileAsString(path);
}
exports.getResourceAsString = getResourceAsString;
//# sourceMappingURL=FileDownloadManager.js.map