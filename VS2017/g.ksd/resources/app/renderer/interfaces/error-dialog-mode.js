/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * These are the modes the error-dialog tag
 * supports.
 *
 * OkCancel - Show both Ok and Cancel buttons
 * Ok - Show only Ok button
 */
var ErrorDialogMode;
(function (ErrorDialogMode) {
    ErrorDialogMode[ErrorDialogMode["None"] = 0] = "None";
    ErrorDialogMode[ErrorDialogMode["OK"] = 1] = "OK";
    ErrorDialogMode[ErrorDialogMode["Cancel"] = 2] = "Cancel";
    ErrorDialogMode[ErrorDialogMode["OptOut"] = 4] = "OptOut";
    // tslint:disable-next-line: no-bitwise
    ErrorDialogMode[ErrorDialogMode["OKCancel"] = 3] = "OKCancel";
})(ErrorDialogMode = exports.ErrorDialogMode || (exports.ErrorDialogMode = {}));
//# sourceMappingURL=error-dialog-mode.js.map