"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wraps a promise's resolve and reject methods.
 *
 * This class is used to cache the entries when sending an IPC request
 * so the asynchronous response can access the promise's resolve and
 * reject methods outside of the promise's executor closure.
 */
var PromiseCompletionSource = /** @class */ (function () {
    function PromiseCompletionSource() {
        var _this = this;
        this._promise = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
    }
    Object.defineProperty(PromiseCompletionSource.prototype, "promise", {
        get: function () {
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    PromiseCompletionSource.prototype.resolve = function (value) {
        return this._resolve(value);
    };
    PromiseCompletionSource.prototype.reject = function (error) {
        return this._reject(error);
    };
    return PromiseCompletionSource;
}());
exports.PromiseCompletionSource = PromiseCompletionSource;
//# sourceMappingURL=promise-completion-source.js.map