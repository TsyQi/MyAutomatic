"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var SurveyTelemetryScope = /** @class */ (function () {
    function SurveyTelemetryScope(telemetryProcessor, surveyProcessorPromise, eventName, properties, commonProperties) {
        this._isEnded = false;
        this._telemetryProcessor = telemetryProcessor;
        this._surveyProcessorPromise = surveyProcessorPromise || Promise.resolve(null);
        this._eventName = eventName;
        this._properties = properties || {};
        this._commonProperties = commonProperties;
    }
    Object.defineProperty(SurveyTelemetryScope.prototype, "isEnded", {
        get: function () {
            return this._isEnded;
        },
        enumerable: true,
        configurable: true
    });
    SurveyTelemetryScope.prototype.end = function (result, properties) {
        if (properties === void 0) { properties = {}; }
        if (this._isEnded) {
            return;
        }
        this._isEnded = true;
        properties = this._telemetryProcessor.addPrefixToProperties(properties);
        this._properties = Object.assign(this._properties, properties);
        var event = {
            eventName: this._eventName,
            properties: this._properties,
            result: result,
            sharedProperties: this._commonProperties,
        };
        return this.processEvent(event);
    };
    SurveyTelemetryScope.prototype.correlate = function (event) {
        // No need to correlate.
        return;
    };
    SurveyTelemetryScope.prototype.getSerializedCorrelation = function () {
        return "";
    };
    SurveyTelemetryScope.prototype.processEvent = function (event) {
        return this._surveyProcessorPromise
            .catch(function () { return null; })
            .then(function (surveyProcessor) {
            if (surveyProcessor) {
                return surveyProcessor.processTelemetryEvent(event);
            }
        });
    };
    return SurveyTelemetryScope;
}());
exports.SurveyTelemetryScope = SurveyTelemetryScope;
//# sourceMappingURL=survey-telemetry-scope.js.map