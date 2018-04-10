/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../typings/lib-missing-declares.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppDispatcher = /** @class */ (function () {
    function AppDispatcher() {
        this.callbacks = {};
    }
    AppDispatcher.prototype.register = function (eventType, callback) {
        if (Array.isArray(this.callbacks[eventType.name])) {
            if (this.callbacks[eventType.name].indexOf(callback) === -1) {
                this.callbacks[eventType.name].push(callback);
            }
        }
        else {
            this.callbacks[eventType.name] = [callback];
        }
    };
    AppDispatcher.prototype.unregister = function (eventType, callback) {
        if (Array.isArray(this.callbacks[eventType.name])) {
            this.callbacks[eventType.name] =
                this.callbacks[eventType.name].filter(function (value) {
                    return value !== callback;
                });
        }
    };
    AppDispatcher.prototype.dispatch = function (event) {
        var callbacks = this.callbacks[event.constructor.name];
        if (Array.isArray(callbacks)) {
            callbacks.forEach(function (callback) {
                callback(event);
            });
        }
    };
    return AppDispatcher;
}());
exports.AppDispatcher = AppDispatcher;
exports.dispatcher = new AppDispatcher();
//# sourceMappingURL=dispatcher.js.map