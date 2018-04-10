/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/modules/yargs/index.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var requires = require("../../lib/requires");
var errors_1 = require("../../lib/errors");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var CommandLineErrorHandler = /** @class */ (function () {
    function CommandLineErrorHandler(parser, logger, showDialog) {
        requires.notNullOrUndefined(parser, "parser");
        requires.notNullOrUndefined(logger, "logger");
        this._parser = parser;
        this._logger = logger;
        this._showDialog = showDialog;
    }
    CommandLineErrorHandler.prototype.emitError = function (message) {
        this.emit(message);
    };
    CommandLineErrorHandler.prototype.emitHelp = function () {
        this.emit(null);
    };
    CommandLineErrorHandler.prototype.emit = function (message) {
        var _this = this;
        var displayMessage = function (helpText) {
            var longDisplay;
            if (message) {
                _this._logger.writeError("" + ResourceStrings_1.ResourceStrings.errorMessagePrefix + message);
                longDisplay =
                    "\n" + message + "\n\n" + helpText + "\n";
            }
            else {
                _this._logger.writeVerbose(helpText);
                longDisplay = helpText;
            }
            if (_this._showDialog) {
                electron.dialog.showErrorBox(ResourceStrings_1.ResourceStrings.appWindowTitle, longDisplay);
            }
        };
        this._parser.showHelp(displayMessage);
        var errorMessage = message || "'--help' specified. Exiting process.";
        throw new errors_1.CommandLineParseError(errorMessage);
    };
    return CommandLineErrorHandler;
}());
exports.CommandLineErrorHandler = CommandLineErrorHandler;
//# sourceMappingURL=command-line-error-handler.js.map