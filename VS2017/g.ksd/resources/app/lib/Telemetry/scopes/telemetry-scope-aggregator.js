"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var TelemetryScopeAggregator = /** @class */ (function () {
    function TelemetryScopeAggregator(scopes) {
        this._scopes = scopes || [];
    }
    Object.defineProperty(TelemetryScopeAggregator.prototype, "scopes", {
        get: function () {
            return this._scopes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TelemetryScopeAggregator.prototype, "isEnded", {
        get: function () {
            return this._scopes.every(function (scope) { return scope.isEnded === true; });
        },
        enumerable: true,
        configurable: true
    });
    TelemetryScopeAggregator.prototype.end = function (result, properties) {
        this._scopes.forEach(function (scope) {
            if (!scope.isEnded) {
                scope.end(result, properties);
            }
        });
    };
    TelemetryScopeAggregator.prototype.correlate = function (events) {
        var _this = this;
        if (events) {
            events.forEach(function (event) {
                _this._scopes.forEach(function (scope) { return scope.correlate(event); });
            });
        }
    };
    TelemetryScopeAggregator.prototype.serializeCorrelations = function () {
        return this._scopes
            .map(function (scope) { return scope.getSerializedCorrelation(); })
            .filter(function (scope) { return !!scope; });
    };
    return TelemetryScopeAggregator;
}());
exports.TelemetryScopeAggregator = TelemetryScopeAggregator;
//# sourceMappingURL=telemetry-scope-aggregator.js.map