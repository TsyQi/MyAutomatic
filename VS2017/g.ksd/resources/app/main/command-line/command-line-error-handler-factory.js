/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/modules/yargs/index.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_error_handler_1 = require("./command-line-error-handler");
var CommandLineErrorHandlerFactory = /** @class */ (function () {
    function CommandLineErrorHandlerFactory() {
    }
    CommandLineErrorHandlerFactory.prototype.createErrorHandler = function (parser, logger, showDialog) {
        return new command_line_error_handler_1.CommandLineErrorHandler(parser, logger, showDialog);
    };
    return CommandLineErrorHandlerFactory;
}());
exports.CommandLineErrorHandlerFactory = CommandLineErrorHandlerFactory;
//# sourceMappingURL=command-line-error-handler-factory.js.map