/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Telemetry_1 = require("../../Telemetry/Telemetry");
var telemetry_filter_rules_1 = require("./telemetry-filter-rules");
/**
 * An implementation of {ITelemetry} which filters
 * some telemetry events so they are not emitted
 * multiple times.
 *
 */
var TelemetryFilter = /** @class */ (function () {
    function TelemetryFilter(telemetryImpl, rules) {
        this._rules = rules;
        this._telemetryImpl = telemetryImpl;
    }
    TelemetryFilter.prototype.postAsset = function (name, assetId, assetVersion, properties, severity) {
        return this._telemetryImpl.postAsset(name, assetId, assetVersion, properties, severity);
    };
    TelemetryFilter.prototype.postUserTask = function (opName, result, resultSummary, properties, severity) {
        return this._telemetryImpl.postUserTask(opName, result, resultSummary, properties, severity);
    };
    TelemetryFilter.prototype.postOperation = function (opName, result, resultSummary, properties, severity, assetsToCorrelate) {
        return this._telemetryImpl.postOperation(opName, result, resultSummary, properties, severity, assetsToCorrelate);
    };
    TelemetryFilter.prototype.postEventUnprefixed = function (name, properties) {
        return this._telemetryImpl.postEventUnprefixed(name, properties);
    };
    TelemetryFilter.prototype.startOperation = function (opName, properties) {
        // Every startOperation call should reset the state of the filtering rules
        this._rules.reset();
        return this._telemetryImpl.startOperation(opName, properties);
    };
    TelemetryFilter.prototype.startUserTask = function (opName, properties) {
        return this._telemetryImpl.startUserTask(opName, properties);
    };
    TelemetryFilter.prototype.postError = function (eventName, description, bucketParameters, error, additionalProperties, severity) {
        var _this = this;
        // postError can be called multiple times for the same
        // error when servicehub crashes in the middle of multiple
        // pending operations. Use a filtered call to ensure
        // only one instance of the error is emitted between startOperation
        // calls.
        return this._rules.postErrorFiltered(error, function () {
            return _this._telemetryImpl.postError(eventName, description, bucketParameters, error, additionalProperties, severity);
        });
    };
    return TelemetryFilter;
}());
exports.TelemetryFilter = TelemetryFilter;
function getInstallerTelemetry() {
    return new TelemetryFilter(Telemetry_1.telemetry, telemetry_filter_rules_1.TelemetryFilterRules.getInstance());
}
exports.getInstallerTelemetry = getInstallerTelemetry;
//# sourceMappingURL=telemetry-filter.js.map