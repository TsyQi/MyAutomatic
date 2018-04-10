/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
require("../PromiseFinallyMixin");
var FileDownloadManager_1 = require("./FileDownloadManager");
var HttpsDownloadManager_1 = require("./HttpsDownloadManager");
var RepeatingTimeout_1 = require("../RepeatingTimeout");
function getGetResourceAsStringBoundToPath(sourcePath) {
    return sourcePath.startsWith("https://")
        ? function () { return HttpsDownloadManager_1.getResourceAsString(sourcePath); }
        : function () { return FileDownloadManager_1.getResourceAsString(sourcePath); };
}
/* istanbul ignore next */
function getGetResourceBoundToPathAndWriteStream(sourcePath, writeStream) {
    return sourcePath.startsWith("https://")
        ? function () { return HttpsDownloadManager_1.getResource(sourcePath, writeStream); }
        : function () { return FileDownloadManager_1.getResource(sourcePath, writeStream); };
}
/* istanbul ignore next */
function getResource(sourcePath, targetPath) {
    return new Promise(function (resolve, reject) {
        var writeStream = fs_1.createWriteStream(targetPath);
        writeStream.once("close", function () { return resolve(targetPath); });
        getGetResourceBoundToPathAndWriteStream(sourcePath, writeStream)()
            .catch(reject)
            .finally(function () { return writeStream.end(); });
    });
}
exports.getResource = getResource;
function getResourceAsString(sourcePath) {
    return getGetResourceAsStringBoundToPath(sourcePath)();
}
exports.getResourceAsString = getResourceAsString;
function createStringResourcePoller(path, dueTime, period, callback) {
    return new StringResourcePoller(dueTime, period, getGetResourceAsStringBoundToPath(path), callback);
}
exports.createStringResourcePoller = createStringResourcePoller;
var StringResourcePoller = /** @class */ (function () {
    function StringResourcePoller(dueTime, period, getStringResource, callback) {
        var _this = this;
        this._repeatingTimeout = new RepeatingTimeout_1.RepeatingTimeout(dueTime, period, function () { return _this.onTimeout(); });
        this._getStringResource = getStringResource;
        this._callback = callback;
        this._droppedTimeouts = 0;
    }
    StringResourcePoller.prototype.start = function (dueTime) {
        if (dueTime === void 0) { dueTime = 0; }
        this._repeatingTimeout.start(dueTime);
    };
    StringResourcePoller.prototype.stop = function () {
        this._repeatingTimeout.stop();
    };
    StringResourcePoller.prototype.change = function (period) {
        this._repeatingTimeout.change(period);
    };
    StringResourcePoller.prototype.now = function () {
        this._repeatingTimeout.now();
    };
    Object.defineProperty(StringResourcePoller.prototype, "isRunning", {
        get: function () {
            return this._repeatingTimeout.isRunning;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StringResourcePoller.prototype, "droppedTimeouts", {
        /**
         * gets the number of timeouts that occurred while a promise was pending
         * this is really just here as a test hook
         */
        get: function () {
            return this._droppedTimeouts;
        },
        enumerable: true,
        configurable: true
    });
    StringResourcePoller.prototype.onTimeout = function () {
        var _this = this;
        if (this._pendingPromise) {
            this._droppedTimeouts++;
            return true;
        }
        this._droppedTimeouts = 0;
        this._pendingPromise = this._getStringResource()
            .then(function (content) {
            _this._pendingPromise = null;
            if (_this._repeatingTimeout.isRunning) {
                return _this._callback(null, content);
            }
        })
            .catch(function (error) {
            _this._pendingPromise = null;
            if (_this._repeatingTimeout.isRunning) {
                return _this._callback(error);
            }
        });
        return true;
    };
    return StringResourcePoller;
}());
exports.StringResourcePoller = StringResourcePoller;
//# sourceMappingURL=DownloadManager.js.map