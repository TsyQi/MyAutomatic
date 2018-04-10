/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <disable>JS2055</disable>
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class that adapts from an Electron-style BrowserWindow to an IEventSender.
 */
var BrowserWindowEventSenderAdapter = /** @class */ (function () {
    function BrowserWindowEventSenderAdapter(webContents) {
        this._webContents = webContents;
    }
    BrowserWindowEventSenderAdapter.prototype.trySend = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var allWebContents = this._webContents.getAllWebContents();
        var result = allWebContents.map(function (target) {
            return _this.trySendToWindow.apply(_this, [target, event].concat(args));
        });
        return result.every(function (r) { return r === true; });
    };
    BrowserWindowEventSenderAdapter.prototype.trySendToWindow = function (window, event) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        try {
            window.send.apply(window, [event].concat(args));
            return true;
        }
        catch (e) {
            return false;
        }
    };
    return BrowserWindowEventSenderAdapter;
}());
exports.BrowserWindowEventSenderAdapter = BrowserWindowEventSenderAdapter;
//# sourceMappingURL=BrowserWindowEventSenderAdapter.js.map