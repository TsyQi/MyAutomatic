/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SUCCESS_RETURN_CODE = 0;
exports.ERROR_RETURN_CODE = 1;
function CreateSuccessExitDetails() {
    return {
        errorCode: null,
        errorMessage: null,
        exitCode: SUCCESS_RETURN_CODE
    };
}
exports.CreateSuccessExitDetails = CreateSuccessExitDetails;
function CreateCustomExitDetails(errorCode, message, exitCode) {
    if (errorCode === void 0) { errorCode = null; }
    if (message === void 0) { message = null; }
    return {
        errorCode: errorCode,
        errorMessage: message,
        exitCode: exitCode
    };
}
exports.CreateCustomExitDetails = CreateCustomExitDetails;
//# sourceMappingURL=exit-details.js.map