"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var telemetry_scope_aggregator_1 = require("../scopes/telemetry-scope-aggregator");
var survey_telemetry_scope_1 = require("../scopes/survey-telemetry-scope");
var TelemetrySurveyListener = /** @class */ (function () {
    function TelemetrySurveyListener(surveyProcessorPromise, telemetryProcessor) {
        this.id = "TelemetrySurveyListener";
        this._commonProperties = {};
        this._processingPromise = Promise.resolve();
        this._surveyProcessorPromise = surveyProcessorPromise;
        this._telemetryProcessor = telemetryProcessor;
    }
    Object.defineProperty(TelemetrySurveyListener.prototype, "commonProperties", {
        get: function () {
            return Object.assign({}, this._commonProperties);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TelemetrySurveyListener.prototype, "processingPromise", {
        get: function () {
            return this._processingPromise;
        },
        enumerable: true,
        configurable: true
    });
    TelemetrySurveyListener.prototype.sendPendingData = function () {
        return Promise.resolve();
    };
    TelemetrySurveyListener.prototype.finalizeOperationsAndSendPendingData = function (properties) {
        if (properties === void 0) { properties = {}; }
        return Promise.resolve();
    };
    TelemetrySurveyListener.prototype.setCommonProperty = function (name, value, doNotPrefix) {
        if (!doNotPrefix) {
            name = this._telemetryProcessor.getPropertyName(name);
        }
        name = this.getCommonPropertyName(name);
        this._commonProperties[name] = value;
    };
    TelemetrySurveyListener.prototype.removeCommonProperty = function (name, doNotPrefix) {
        if (!doNotPrefix) {
            name = this._telemetryProcessor.getPropertyName(name);
        }
        name = this.getCommonPropertyName(name);
        delete this._commonProperties[name];
    };
    TelemetrySurveyListener.prototype.postAsset = function (name, assetId, assetVersion, properties, severity) {
        this.processEvent(name, properties);
        return [];
    };
    TelemetrySurveyListener.prototype.postError = function (name, description, bucketParameters, error, properties, severity) {
        this.processEvent(name, properties);
        return [];
    };
    TelemetrySurveyListener.prototype.postUserTask = function (opName, result, resultSummary, properties, severity) {
        this.processEvent(opName, properties, result);
        return [];
    };
    TelemetrySurveyListener.prototype.postOperation = function (opName, result, resultSummary, properties, severity, assetsToCorrelate) {
        this.processEvent(opName, properties, result);
        return [];
    };
    TelemetrySurveyListener.prototype.postEventUnprefixed = function (name, properties) {
        var event = {
            eventName: name,
            properties: properties,
            result: null,
            sharedProperties: this._commonProperties,
        };
        this.processEventUnprefixed(event);
        return [];
    };
    TelemetrySurveyListener.prototype.startOperation = function (opName, properties) {
        this.processEvent(opName, properties);
        return this.createScope(opName, properties);
    };
    TelemetrySurveyListener.prototype.startUserTask = function (opName, properties) {
        this.processEvent(opName, properties);
        return this.createScope(opName, properties);
    };
    TelemetrySurveyListener.prototype.processEvent = function (name, properties, result) {
        if (result === void 0) { result = null; }
        var fullName = this._telemetryProcessor.getEventName(name);
        var prefixedProperties = this._telemetryProcessor.addPrefixToProperties(properties);
        var event = {
            eventName: fullName,
            properties: prefixedProperties,
            result: result,
            sharedProperties: this._commonProperties,
        };
        this.processEventUnprefixed(event);
    };
    TelemetrySurveyListener.prototype.processEventUnprefixed = function (event) {
        this._processingPromise = this._surveyProcessorPromise
            .catch(function () { return null; })
            .then(function (surveyProcessor) {
            if (surveyProcessor) {
                return surveyProcessor.processTelemetryEvent(event);
            }
        });
    };
    TelemetrySurveyListener.prototype.createScope = function (name, properties) {
        var fullName = this._telemetryProcessor.getEventName(name);
        var prefixedProperties = this._telemetryProcessor.addPrefixToProperties(properties);
        var scope = new survey_telemetry_scope_1.SurveyTelemetryScope(this._telemetryProcessor, this._surveyProcessorPromise, fullName, prefixedProperties, this._commonProperties);
        return new telemetry_scope_aggregator_1.TelemetryScopeAggregator([scope]);
    };
    TelemetrySurveyListener.prototype.getCommonPropertyName = function (name) {
        return TelemetrySurveyListener.SHARED_PROPERTY_PREFIX + "." + name;
    };
    TelemetrySurveyListener.SHARED_PROPERTY_PREFIX = "Context.Default";
    return TelemetrySurveyListener;
}());
exports.TelemetrySurveyListener = TelemetrySurveyListener;
//# sourceMappingURL=telemetry-survey-listener.js.map