/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/* istanbul ignore next */
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
var operation_finished_event_1 = require("./operation-finished-event");
var reboot_timing_1 = require("../interfaces/reboot-timing");
var InstallFinishedEvent = /** @class */ (function (_super) {
    __extends(InstallFinishedEvent, _super);
    function InstallFinishedEvent(product, nickname, installationPath, success, log, rebootTiming) {
        if (success === void 0) { success = true; }
        if (log === void 0) { log = ""; }
        if (rebootTiming === void 0) { rebootTiming = reboot_timing_1.RebootTiming.None; }
        var _this = _super.call(this, product, nickname, installationPath, success, log, rebootTiming) || this;
        _this._product = product;
        return _this;
    }
    InstallFinishedEvent.prototype.getProduct = function () {
        return this._product;
    };
    return InstallFinishedEvent;
}(operation_finished_event_1.OperationFinishedEvent));
exports.InstallFinishedEvent = InstallFinishedEvent;
//# sourceMappingURL=InstallFinishedEvent.js.map