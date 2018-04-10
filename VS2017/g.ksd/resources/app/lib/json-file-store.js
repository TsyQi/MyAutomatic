/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var UTF8_ENCODING = { encoding: "utf8" };
var JSONFileStore = /** @class */ (function () {
    function JSONFileStore(path) {
        if (path === void 0) { path = null; }
        this._path = path;
    }
    JSONFileStore.prototype.exists = function () {
        var fileExists = false;
        try {
            // following line throws <=> we do not have write access
            fs.accessSync(this._path, fs.constants.W_OK);
            fileExists = true;
        }
        catch (e) {
            console.log(e.message);
        }
        return fileExists;
    };
    JSONFileStore.prototype.read = function () {
        return JSON.parse(fs.readFileSync(this._path, UTF8_ENCODING));
    };
    JSONFileStore.prototype.write = function (data) {
        fs.writeFileSync(this._path, JSON.stringify(data, null, 4), UTF8_ENCODING);
    };
    Object.defineProperty(JSONFileStore.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    return JSONFileStore;
}());
exports.JSONFileStore = JSONFileStore;
//# sourceMappingURL=json-file-store.js.map