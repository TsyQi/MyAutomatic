/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cp = require("child_process");
var CommandLine_1 = require("../lib/CommandLine");
var requires = require("../lib/requires");
var RunOnceRelauncher = /** @class */ (function () {
    function RunOnceRelauncher(command, args, timeout, commandLineParser) {
        requires.stringNotEmpty(command, "command");
        requires.notNullOrUndefined(args, "args");
        requires.numberOfRange(timeout, 0, 10000, "timeout"); // Limiting timeout to max 10 secs
        requires.notNullOrUndefined(commandLineParser, "commandLineParser");
        this._command = command;
        this._args = args;
        this._timeout = timeout;
        this._parser = commandLineParser;
    }
    Object.defineProperty(RunOnceRelauncher.prototype, "command", {
        get: function () {
            return this._command;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RunOnceRelauncher.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    RunOnceRelauncher.prototype.launch = function () {
        try {
            return this.relaunchWithoutRunOnce();
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    RunOnceRelauncher.prototype.relaunchWithoutRunOnce = function () {
        var _this = this;
        // Remove the runOnce argument
        this._args = this._parser.removeOptionFromArgumentList(this._args, CommandLine_1.OptionNames.runOnce);
        var process = this.spawnDetached(this._command, this._args);
        // This is best case detection. If we hit the timeout we assume that process is launched successfully
        // Else we emit a reject.
        var timeoutPromise = new Promise(function (resolve) {
            setTimeout(resolve, _this._timeout);
        });
        var errorPromise = new Promise(function (resolve, reject) {
            process.once("error", function (e) {
                reject(e);
            });
        });
        return Promise.race([timeoutPromise, errorPromise]);
    };
    /**
     * Calls spawn with the right set of options so the child process
     * is detached and unref'd from the parent.
     */
    RunOnceRelauncher.prototype.spawnDetached = function (command, args) {
        var child = cp.spawn(command, args, { detached: true, stdio: "ignore" });
        child.unref();
        return child;
    };
    return RunOnceRelauncher;
}());
exports.RunOnceRelauncher = RunOnceRelauncher;
//# sourceMappingURL=Relauncher.js.map