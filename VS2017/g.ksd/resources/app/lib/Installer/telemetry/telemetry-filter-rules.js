/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorFilterRule = /** @class */ (function () {
    function ErrorFilterRule(message) {
        this._message = message.toLowerCase();
    }
    ErrorFilterRule.prototype.isMatch = function (input) {
        return input
            && input.message
            && input.message.toLowerCase().includes(this._message);
    };
    return ErrorFilterRule;
}());
exports.ErrorFilterRule = ErrorFilterRule;
/**
 * A helper class which caches the return value of some telemetry
 * APIs and ensures they are not called multiple times until a reset.
 */
var TelemetryFilterRules = /** @class */ (function () {
    function TelemetryFilterRules(errorRules) {
        this._cache = new Map();
        this._errorRules = errorRules;
    }
    TelemetryFilterRules.getInstance = function () {
        /* istanbul ignore next */
        return new TelemetryFilterRules([
            new ErrorFilterRule("stream closed"),
        ]);
    };
    TelemetryFilterRules.prototype.reset = function () {
        this._cache.clear();
    };
    TelemetryFilterRules.prototype.postErrorFiltered = function (error, cb) {
        var rule = this.findErrorRule(error);
        if (rule) {
            var value = this.getCachedValue(rule, function () { return cb(); });
            return value;
        }
        return cb();
    };
    TelemetryFilterRules.prototype.getCachedValue = function (rule, getValue) {
        var value = this._cache.get(rule);
        if (!value && !this._cache.has(rule)) {
            value = getValue();
            this._cache.set(rule, value);
        }
        return value;
    };
    /**
     * Determine if a rule exists and return it,
     * otherwise return null.
     * @param error the error to find a rule for.
     */
    TelemetryFilterRules.prototype.findErrorRule = function (error) {
        for (var _i = 0, _a = this._errorRules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule.isMatch(error)) {
                return rule;
            }
        }
        return null;
    };
    return TelemetryFilterRules;
}());
exports.TelemetryFilterRules = TelemetryFilterRules;
//# sourceMappingURL=telemetry-filter-rules.js.map