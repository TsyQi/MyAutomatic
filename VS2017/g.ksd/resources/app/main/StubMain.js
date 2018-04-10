/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var UNCAUGHT_EXCEPTION_ERROR_CODE = -200;
var UNCAUGHT_EXCEPTION = "uncaughtException";
function uncaughtExceptionHandler(exception) {
    console.log(exception);
    electron_1.app.exit(UNCAUGHT_EXCEPTION_ERROR_CODE);
}
function removeExceptionHandler() {
    process.removeListener(UNCAUGHT_EXCEPTION, uncaughtExceptionHandler);
}
exports.removeExceptionHandler = removeExceptionHandler;
// Catch any exceptions that may be thrown before we initilize wer-reporter
process.on(UNCAUGHT_EXCEPTION, uncaughtExceptionHandler);
var ReportProblemLauncher_1 = require("./ReportProblemLauncher");
// If the command line specifies to launch the feedback ASARs
// do that quickly and avoid setup related initialization.
if (!ReportProblemLauncher_1.handleFeedbackSession()) {
    /* tslint:disable:no-var-requires no-require-imports */
    require("./Main");
    /* tslint:enable */
}
//# sourceMappingURL=StubMain.js.map