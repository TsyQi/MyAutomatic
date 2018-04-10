"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorage = /** @class */ (function () {
    function LocalStorage(key) {
        this._key = key;
    }
    LocalStorage.prototype.tryStoreItem = function (item) {
        try {
            window.localStorage.setItem(this._key, JSON.stringify(item));
            return true;
        }
        catch (err) {
            return false;
        }
    };
    LocalStorage.prototype.tryGetItem = function () {
        try {
            var json = window.localStorage.getItem(this._key);
            if (!json) {
                return null;
            }
            return JSON.parse(json);
        }
        catch (err) {
            return null;
        }
    };
    LocalStorage.prototype.tryRemoveItem = function () {
        try {
            window.localStorage.removeItem(this._key);
            return true;
        }
        catch (err) {
            return false;
        }
    };
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=local-storage.js.map