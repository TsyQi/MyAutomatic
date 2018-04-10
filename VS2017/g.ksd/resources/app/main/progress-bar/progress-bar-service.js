/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ipc_rpc_service_1 = require("../../lib/ipc/ipc-rpc-service");
var ProgressBarService = /** @class */ (function (_super) {
    __extends(ProgressBarService, _super);
    function ProgressBarService(ipc, channelId, logger, progressBar) {
        var _this = _super.call(this, ipc, channelId, logger) || this;
        _this._progressBar = progressBar;
        return _this;
    }
    ProgressBarService.prototype.setValue = function (value, options) {
        this._progressBar.setValue(value, options);
    };
    ProgressBarService.prototype.getValue = function () {
        return this._progressBar.getValue();
    };
    ProgressBarService.prototype.setError = function () {
        this._progressBar.setError();
    };
    ProgressBarService.prototype.resetError = function () {
        this._progressBar.resetError();
    };
    ProgressBarService.prototype.clearValue = function () {
        this._progressBar.clearValue();
    };
    ProgressBarService.prototype.setFlashFrame = function (isFlashing) {
        this._progressBar.setFlashFrame(isFlashing);
    };
    ProgressBarService.prototype.setOverlayIcon = function (path, description) {
        this._progressBar.setOverlayIcon(path, description);
    };
    return ProgressBarService;
}(ipc_rpc_service_1.IpcRpcService));
exports.ProgressBarService = ProgressBarService;
//# sourceMappingURL=progress-bar-service.js.map