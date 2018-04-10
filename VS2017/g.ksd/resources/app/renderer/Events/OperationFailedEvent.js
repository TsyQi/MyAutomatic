/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_dialog_mode_1 = require("../interfaces/error-dialog-mode");
var OperationFailedEvent = /** @class */ (function () {
    function OperationFailedEvent(options) {
        this._error = options.error;
        this._title = options.title;
        this._errorLink = options.link;
        this._dialogMode = (options.dialogMode === undefined) ? error_dialog_mode_1.ErrorDialogMode.OK : options.dialogMode;
        this._okAction = options.okAction;
        this._okText = options.okText;
        this._errorName = options.errorName;
    }
    Object.defineProperty(OperationFailedEvent.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFailedEvent.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFailedEvent.prototype, "errorLink", {
        get: function () {
            return this._errorLink;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFailedEvent.prototype, "dialogMode", {
        get: function () {
            return this._dialogMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFailedEvent.prototype, "okAction", {
        get: function () {
            return this._okAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFailedEvent.prototype, "okText", {
        get: function () {
            return this._okText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFailedEvent.prototype, "errorName", {
        get: function () {
            return this._errorName;
        },
        enumerable: true,
        configurable: true
    });
    return OperationFailedEvent;
}());
exports.OperationFailedEvent = OperationFailedEvent;
//# sourceMappingURL=OperationFailedEvent.js.map