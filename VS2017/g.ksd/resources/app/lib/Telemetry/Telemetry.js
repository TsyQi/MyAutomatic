/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vs_telemetry_api_1 = require("vs-telemetry-api");
var telemetry_scope_aggregator_1 = require("./scopes/telemetry-scope-aggregator");
var vs_telemetry_api_2 = require("vs-telemetry-api");
exports.TelemetryResult = vs_telemetry_api_2.TelemetryResult;
var UNIQUE_EVENT_ID = "Telemetry";
var TelemetryImpl = /** @class */ (function () {
    function TelemetryImpl() {
        this._listeners = [];
    }
    Object.defineProperty(TelemetryImpl.prototype, "id", {
        get: function () {
            return UNIQUE_EVENT_ID;
        },
        enumerable: true,
        configurable: true
    });
    TelemetryImpl.prototype.postAsset = function (name, assetId, assetVersion, properties, severity) {
        var assetEvents = [].concat.apply([], this._listeners.map(function (listener) {
            return listener.postAsset(name, assetId, assetVersion, properties, severity);
        }));
        return assetEvents;
    };
    TelemetryImpl.prototype.postError = function (name, description, bucketParameters, error, properties, severity) {
        var faultEvents = [].concat.apply([], this._listeners.map(function (listener) {
            return listener.postError(name, description, bucketParameters, error, properties, severity);
        }));
        return faultEvents;
    };
    TelemetryImpl.prototype.startOperation = function (opName, properties) {
        if (properties === void 0) { properties = {}; }
        var scopes = [];
        this._listeners.forEach(function (listener) {
            var tempScope = listener.startOperation(opName, properties);
            if (tempScope) {
                tempScope.scopes.forEach(function (s) { return scopes.push(s); });
            }
        });
        return new telemetry_scope_aggregator_1.TelemetryScopeAggregator(scopes);
    };
    TelemetryImpl.prototype.startUserTask = function (opName, properties) {
        if (properties === void 0) { properties = {}; }
        var scopes = [];
        this._listeners.forEach(function (listener) {
            var tempScope = listener.startUserTask(opName, properties);
            if (tempScope) {
                tempScope.scopes.forEach(function (s) { return scopes.push(s); });
            }
        });
        return new telemetry_scope_aggregator_1.TelemetryScopeAggregator(scopes);
    };
    TelemetryImpl.prototype.postOperation = function (opName, result, resultSummary, properties, severity, assetsToCorrelate) {
        if (properties === void 0) { properties = {}; }
        var operations = [].concat.apply([], this._listeners.map(function (listener) {
            if (assetsToCorrelate) {
                var filteredAssets_1 = [];
                assetsToCorrelate.forEach(function (asset) {
                    if (asset.id === listener.id) {
                        filteredAssets_1.push(asset);
                    }
                });
                return listener.postOperation(opName, result, resultSummary, properties, severity, filteredAssets_1);
            }
            else {
                return listener.postOperation(opName, result, resultSummary, properties, severity);
            }
        }));
        return operations;
    };
    TelemetryImpl.prototype.postUserTask = function (opName, result, resultSummary, properties, severity) {
        if (properties === void 0) { properties = {}; }
        var usertasks = [].concat.apply([], this._listeners.map(function (listener) {
            return listener.postUserTask(opName, result, resultSummary, properties, severity);
        }));
        return usertasks;
    };
    TelemetryImpl.prototype.postEventUnprefixed = function (name, properties) {
        return this._listeners
            .reduce(function (prev, listener) {
            var results = listener.postEventUnprefixed(name, properties);
            if (!results) {
                return prev;
            }
            return prev.concat(results);
        }, []);
    };
    TelemetryImpl.prototype.setCommonProperty = function (name, value, doNotPrefix) {
        if (doNotPrefix === void 0) { doNotPrefix = false; }
        this._listeners.forEach(function (listener) { return listener.setCommonProperty(name, value, doNotPrefix); });
    };
    TelemetryImpl.prototype.removeCommonProperty = function (name, doNotPrefix) {
        if (doNotPrefix === void 0) { doNotPrefix = false; }
        this._listeners.forEach(function (listener) { return listener.removeCommonProperty(name, doNotPrefix); });
    };
    TelemetryImpl.prototype.sendPendingData = function () {
        var promises = this._listeners.map(function (listener) { return listener.sendPendingData(); });
        return Promise.all(promises).then(function () { return null; });
    };
    TelemetryImpl.prototype.finalizeOperationsAndSendPendingData = function (properties) {
        if (properties === void 0) { properties = {}; }
        var promises = this._listeners.map(function (listener) { return listener.finalizeOperationsAndSendPendingData(properties); });
        return Promise.all(promises).then(function () { return null; });
    };
    TelemetryImpl.prototype.addListener = function (listener) {
        if (!listener) {
            return false;
        }
        this._listeners.push(listener);
        return true;
    };
    TelemetryImpl.prototype.removeListener = function (listener) {
        if (!listener) {
            return false;
        }
        var index = this._listeners.indexOf(listener);
        if (index === -1) {
            return false;
        }
        this._listeners.splice(index, 1);
        return true;
    };
    TelemetryImpl.prototype.getListeners = function () {
        // return a copy of the listeners; clients must use addListener, removeListener,
        // or clearListeners to change the set of listeners
        return this._listeners.slice(0);
    };
    TelemetryImpl.prototype.clearListeners = function () {
        this._listeners = [];
    };
    return TelemetryImpl;
}());
var telemetryImpl = new TelemetryImpl();
exports.telemetry = telemetryImpl;
exports.telemetryConfiguration = telemetryImpl;
function buildAppLaunchTelemetryProperties(argv, logger) {
    var properties = {};
    try {
        if (!argv) {
            return properties;
        }
        var keysToOmit_1 = ["_", "query", "queryParameters"];
        // copy all of the properties of argv to properties
        // (except those listed in keysToOmit),
        // converting values to hash strings
        Object.keys(argv).forEach(function (key) {
            if (keysToOmit_1.indexOf(key) >= 0) {
                return;
            }
            var value = argv[key];
            // ignore keys with null/undefined. e.g. command can be undefined.
            if (value === undefined || value === null) {
                return;
            }
            // modifying exe key from $0 to executable
            if (key === "$0") {
                var exeKey = "executable";
                properties[exeKey] = new vs_telemetry_api_1.PiiProperty(value, vs_telemetry_api_1.PiiAction.Hashed);
                return;
            }
            if (typeof value === "boolean") {
                properties[key] = value.toString();
                return;
            }
            if (Array.isArray(value)) {
                value.forEach(function (item, index) {
                    properties[key + "." + (index + 1)] = new vs_telemetry_api_1.PiiProperty(item, vs_telemetry_api_1.PiiAction.Hashed);
                });
                return;
            }
            properties[key] = new vs_telemetry_api_1.PiiProperty(value, vs_telemetry_api_1.PiiAction.Hashed);
        });
    }
    catch (error) {
        logger.writeError("Error while generating hash properties for telemetry. " +
            ("[error.name: " + error.name + ", error.message: " + error.message + "]"));
    }
    return properties;
}
exports.buildAppLaunchTelemetryProperties = buildAppLaunchTelemetryProperties;
//# sourceMappingURL=Telemetry.js.map