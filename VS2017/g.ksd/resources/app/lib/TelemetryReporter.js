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
var error_reporter_base_1 = require("report-errors/error-reporter-base");
var advanced_1 = require("report-errors/advanced");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var bucket_parameters_1 = require("../lib/Telemetry/bucket-parameters");
// telemetry reporter
var TelemetryReporter = /** @class */ (function (_super) {
    __extends(TelemetryReporter, _super);
    function TelemetryReporter(telemetry, eventName, appRunOperation) {
        var _this = _super.call(this) || this;
        _this.telemetry = telemetry;
        _this.eventName = eventName;
        _this.appRunOperations = appRunOperation;
        return _this;
    }
    TelemetryReporter.prototype.report = function (err) {
        // Telemetry only allows peroperties a length of 1024, so shorten if needed.
        var stack = truncate("" + err.errorName + (err.errorMessage ? ":" : "") + " " + err.errorMessage + "\n\n" + err.getVerboseStack(), 1023);
        var props = {
            Stack: stack,
            ResultDetails: err.errorType,
            ErrorName: err.errorName,
        };
        var error = this.telemetry.postError(this.eventName, err.errorName, new bucket_parameters_1.BucketParameters("report", this.constructor.name), err.rawError, props);
        this.appRunOperations.correlate(error);
        // Only end the apprun operation if we're going to crash.
        if (err.errorType !== error_reporter_base_1.ErrorType[error_reporter_base_1.ErrorType.Rejection]) {
            this.appRunOperations.end(vs_telemetry_api_1.TelemetryResult.Failure, props);
            return this.telemetry.finalizeOperationsAndSendPendingData();
        }
        return Promise.resolve();
    };
    return TelemetryReporter;
}(advanced_1.ReportingChannel));
exports.TelemetryReporter = TelemetryReporter;
function truncate(input, maxLength) {
    if (input.length > maxLength) {
        return input.substr(0, maxLength);
    }
    return input;
}
//# sourceMappingURL=TelemetryReporter.js.map