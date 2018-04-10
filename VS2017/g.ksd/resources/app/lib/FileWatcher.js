/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var events_1 = require("events");
var FS_WATCHER_RETRY_TIMEOUT_MS = 30 * 1000;
var FileWatcher = /** @class */ (function (_super) {
    __extends(FileWatcher, _super);
    function FileWatcher(filename) {
        var _this = _super.call(this) || this;
        _this.wireUpAttempts = 0;
        _this.closed = false;
        _this.tryWireUpWatcher(filename);
        return _this;
    }
    FileWatcher.prototype.close = function () {
        this.closed = true;
        if (this.internalWatcher) {
            this.internalWatcher.close();
        }
        this.internalWatcher = null;
    };
    FileWatcher.prototype.tryWireUpWatcher = function (filename) {
        var _this = this;
        ++this.wireUpAttempts;
        if (!this.closed) {
            try {
                var throttled_1 = false;
                this.internalWatcher = fs_1.watch(filename, function (event, newFilename) {
                    // event is "rename" or "change"
                    if (event === "rename" && newFilename !== filename) {
                        return;
                    }
                    if (!throttled_1) {
                        // workaround nodejs bug: https://github.com/nodejs/node-v0.x-archive/issues/2126
                        throttled_1 = true;
                        setTimeout(function () { return throttled_1 = false; }, 50);
                        _this.emit("change", event, newFilename);
                    }
                });
                this.internalWatcher.on("error", function (err) {
                    _this.emit("error", err);
                    setTimeout(function () { return _this.tryWireUpWatcher(filename); }, FS_WATCHER_RETRY_TIMEOUT_MS);
                });
                // fire extra change event only if we failed to watch the file the first time
                if (this.wireUpAttempts > 1) {
                    this.wireUpAttempts = 0;
                    this.emit("change", "change");
                }
            }
            catch (e) {
                setTimeout(function () { return _this.tryWireUpWatcher(filename); }, FS_WATCHER_RETRY_TIMEOUT_MS);
            }
        }
    };
    return FileWatcher;
}(events_1.EventEmitter));
function watch(filename, cb) {
    var emitter = new FileWatcher(filename);
    emitter.on("change", cb);
    // listen for errors so electron does not crash
    // the retry logic in the FileWatcher will handle polling and
    // re-attaching the watcher
    emitter.on("error", function () { return 0; });
    return emitter;
}
exports.watch = watch;
//# sourceMappingURL=FileWatcher.js.map