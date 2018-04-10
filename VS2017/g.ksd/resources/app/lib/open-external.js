/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var child_process_1 = require("child_process");
var path = require("path");
var promise_completion_source_1 = require("./promise-completion-source");
/**
 * Bring the opened application to the foreground.
 * Default: true.
 */
function openExternal(url, options) {
    return electron_1.shell.openExternal(url, options);
}
exports.openExternal = openExternal;
function openTextFile(file) {
    var pcs = new promise_completion_source_1.PromiseCompletionSource();
    var windir = process.env.WinDir;
    var notepadPath = path.join(windir, "system32", "notepad.exe");
    var args = [file];
    var options = { detached: true };
    var childProcess = child_process_1.spawn(notepadPath, args, options);
    var resolved = false;
    childProcess.once("error", function () {
        if (!resolved) {
            resolved = true;
            pcs.resolve(showItemInFolder(file));
        }
    });
    childProcess.once("exit", function () {
        if (!resolved) {
            resolved = true;
            pcs.resolve(true);
        }
    });
    childProcess.unref();
    return pcs.promise;
}
exports.openTextFile = openTextFile;
function showItemInFolder(file) {
    return electron_1.shell.showItemInFolder(file);
}
//# sourceMappingURL=open-external.js.map