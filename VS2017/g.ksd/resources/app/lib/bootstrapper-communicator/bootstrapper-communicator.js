/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = require("net");
var PIPE_PATH = "\\\\.\\pipe\\";
var BootstrapperCommunicator = /** @class */ (function () {
    function BootstrapperCommunicator(browserWindow, logger, pipeName, isQuiet, hasCommands) {
        this._browerserWindow = browserWindow;
        this._logger = logger;
        this._pipeName = pipeName;
        this._isDismissed = false;
        if (!hasCommands) {
            this.dismiss();
        }
        if (isQuiet) {
            this._isDismissed = true;
        }
    }
    Object.defineProperty(BootstrapperCommunicator.prototype, "isDismissed", {
        get: function () {
            return this._isDismissed;
        },
        enumerable: true,
        configurable: true
    });
    BootstrapperCommunicator.prototype.dismiss = function () {
        var _this = this;
        if (this._isDismissed) {
            return;
        }
        if (this._browerserWindow) {
            this._browerserWindow.show();
        }
        if (this._pipeName) {
            var pipe_1 = PIPE_PATH + this._pipeName;
            try {
                var pipeConnection_1 = net_1.connect(pipe_1);
                pipeConnection_1.on("connect", function () {
                    var message = "Pipe: " + pipe_1 + " connection is established";
                    _this._logger.writeVerbose(message);
                });
                pipeConnection_1.on("end", function () {
                    pipeConnection_1.end();
                    _this._logger.writeVerbose("Pipe is closed");
                });
                pipeConnection_1.on("error", function () {
                    var message = "No pipe connection";
                    _this._logger.writeVerbose(message);
                });
            }
            catch (ex) {
                this._logger.writeError(ex.toString());
            }
        }
        this._isDismissed = true;
    };
    return BootstrapperCommunicator;
}());
exports.BootstrapperCommunicator = BootstrapperCommunicator;
//# sourceMappingURL=bootstrapper-communicator.js.map