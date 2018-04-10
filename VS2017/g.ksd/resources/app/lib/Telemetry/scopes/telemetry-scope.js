"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var Scope = /** @class */ (function () {
    function Scope(id, scope, telemetryProcessor) {
        this.id = id;
        this.scope = scope;
        this.telemetryProcessor = telemetryProcessor;
    }
    Object.defineProperty(Scope.prototype, "isEnded", {
        get: function () {
            return this.scope.isEnded;
        },
        enumerable: true,
        configurable: true
    });
    Scope.prototype.end = function (result, properties) {
        var _this = this;
        if (properties === void 0) { properties = {}; }
        if (this.telemetryProcessor) {
            properties = this.telemetryProcessor.addPrefixToProperties(properties);
        }
        Object.keys(properties).forEach(function (key) {
            _this.scope.endEvent.properties[key] = properties[key];
        });
        this.scope.end(result);
    };
    Scope.prototype.correlate = function (event) {
        if (!event || event.id !== this.id) {
            return;
        }
        this.scope.endEvent.correlate(event.event.correlation);
    };
    Scope.prototype.getSerializedCorrelation = function () {
        return this.scope.correlation.serialize();
    };
    return Scope;
}());
exports.Scope = Scope;
//# sourceMappingURL=telemetry-scope.js.map