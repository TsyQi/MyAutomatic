/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var name_prefixer_1 = require("../name-prefixer");
/**
 * Helper class for constructing the names of telemetry events and properties.
 */
var TelemetryProcessor = /** @class */ (function () {
    function TelemetryProcessor(orderedPrefixParts) {
        requires.arrayNotNullorUndefinedorEmpty(orderedPrefixParts, "orderedPrefixParts");
        this._eventNamePrefixer = new name_prefixer_1.NamePrefixer(orderedPrefixParts, "/");
        this._propsPrefixer = new name_prefixer_1.NamePrefixer(orderedPrefixParts, ".");
    }
    Object.defineProperty(TelemetryProcessor.prototype, "eventPrefix", {
        get: function () {
            return this._eventNamePrefixer.prefix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TelemetryProcessor.prototype, "propertyPrefix", {
        get: function () {
            return this._propsPrefixer.prefix;
        },
        enumerable: true,
        configurable: true
    });
    TelemetryProcessor.prototype.getEventName = function (eventName) {
        return this._eventNamePrefixer.getPrefixedName(eventName);
    };
    TelemetryProcessor.prototype.getPropertyName = function (propertyName) {
        return this._propsPrefixer.getPrefixedName(propertyName);
    };
    TelemetryProcessor.prototype.addPrefixToProperties = function (properties) {
        if (!properties) {
            return {};
        }
        var prefixedProperties = {};
        for (var _i = 0, _a = Object.keys(properties); _i < _a.length; _i++) {
            var key = _a[_i];
            var propertyName = this.getPropertyName(key);
            prefixedProperties[propertyName] = properties[key];
        }
        return prefixedProperties;
    };
    return TelemetryProcessor;
}());
exports.TelemetryProcessor = TelemetryProcessor;
//# sourceMappingURL=telemetry-processor.js.map