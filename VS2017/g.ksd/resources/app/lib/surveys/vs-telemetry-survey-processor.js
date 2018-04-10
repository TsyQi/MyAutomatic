/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var requires = require("../requires");
var string_utilities_1 = require("../string-utilities");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var promise_completion_source_1 = require("../promise-completion-source");
var features_1 = require("../feature-flags/features");
var TelemetryEventNames = require("../Telemetry/TelemetryEventNames");
var telemetryResultProperty = "Reserved.DataModel.Action.Result";
var VsTelemetrySurveyProcessor = /** @class */ (function () {
    function VsTelemetrySurveyProcessor(configurationPromise, features, telemetry) {
        this._eventEmitter = new events_1.EventEmitter();
        this._showSurveyEvent = "show-survey";
        requires.notNullOrUndefined(configurationPromise, "configurationPromise");
        requires.notNullOrUndefined(features, "features");
        requires.notNullOrUndefined(telemetry, "telemetry");
        this._configurationPromise = configurationPromise;
        this._isEnabledPromise = features.isEnabled(features_1.Feature.Surveys);
        this.telemetryBasedSurveyRules
            .then(function (rules) {
            var surveyUrls = rules.map(function (rule) { return rule.surveyUrl; }).join(",");
            telemetry.postAsset(TelemetryEventNames.SURVEY_URLS, "surveys", 1, {
                surveyUrls: surveyUrls,
            });
        });
    }
    Object.defineProperty(VsTelemetrySurveyProcessor.prototype, "telemetryBasedSurveyRules", {
        get: function () {
            return this._configurationPromise
                .then(function (configuration) { return configuration.rules; })
                .catch(function () { return []; });
        },
        enumerable: true,
        configurable: true
    });
    VsTelemetrySurveyProcessor.prototype.onShowSurvey = function (callback) {
        this._eventEmitter.on(this._showSurveyEvent, callback);
    };
    VsTelemetrySurveyProcessor.prototype.removeListener = function (callback) {
        this._eventEmitter.removeListener(this._showSurveyEvent, callback);
    };
    VsTelemetrySurveyProcessor.prototype.processTelemetryEvent = function (event) {
        var _this = this;
        return this._isEnabledPromise
            .catch(function () { return false; })
            .then(function (isEnabled) {
            // If surveys are off, do nothing.
            if (!isEnabled) {
                return Promise.resolve();
            }
            return _this.telemetryBasedSurveyRules
                .then(function (rules) {
                var telemetryRules = rules
                    .filter(function (rule) { return string_utilities_1.caseInsensitiveAreEqual(rule.eventName, event.eventName); });
                var testResults = telemetryRules.map(function (telemetryRule) {
                    var accept = _this.testTelemetryProperties(telemetryRule.properties.accept, event.properties, event.sharedProperties, event.result, true);
                    // If we did not pass the accept properties, we fail. Return false.
                    if (!accept) {
                        return false;
                    }
                    return _this.testTelemetryProperties(telemetryRule.properties.reject, event.properties, event.sharedProperties, event.result, false);
                });
                var showPromises = testResults.map(function (result, index) {
                    if (result) {
                        var rule_1 = telemetryRules[index];
                        var pcs_1 = new promise_completion_source_1.PromiseCompletionSource();
                        setTimeout(function () { _this.emitShowSurvey(rule_1); pcs_1.resolve(); }, rule_1.delay);
                        return pcs_1.promise;
                    }
                    return Promise.resolve();
                });
                return Promise.all(showPromises).then(function () { return null; });
            });
        });
    };
    /**
     * Helper method that tests whether queryProperties are contained or not in the eventProperties
     */
    VsTelemetrySurveyProcessor.prototype.testTelemetryProperties = function (queryProperties, eventProperties, sharedProperties, eventResult, hasProperty) {
        if (!queryProperties) {
            // Since there are no properties, all the properties are matched.
            return true;
        }
        for (var _i = 0, _a = Object.keys(queryProperties); _i < _a.length; _i++) {
            var key = _a[_i];
            // telemetryResultProperty is a special case that must be handled differently.
            if (key === telemetryResultProperty) {
                if (this.hasTelemetryResult(queryProperties, eventResult) !== hasProperty) {
                    return false;
                }
            }
            else {
                var hasTelemetryProperty = this.hasTelemetryProperty(eventProperties, sharedProperties, key, queryProperties[key]);
                // If it has the property and shouldn't, or vice-versa, return false
                if (hasTelemetryProperty !== hasProperty) {
                    return false;
                }
            }
        }
        // We tested all properties and none failed, so return true.
        return true;
    };
    VsTelemetrySurveyProcessor.prototype.hasTelemetryProperty = function (eventProperties, sharedProperties, propertyKey, propertyValue) {
        var eventProperty = eventProperties[propertyKey];
        if (typeof (eventProperties[propertyKey]) !== "undefined") {
            return this.propertiesAreEqual(eventProperty, propertyValue);
        }
        return this.propertiesAreEqual(sharedProperties[propertyKey], propertyValue);
    };
    VsTelemetrySurveyProcessor.prototype.propertiesAreEqual = function (eventProperty, surveyProperty) {
        if (eventProperty instanceof vs_telemetry_api_1.PiiProperty) {
            return this.propertiesAreEqual(eventProperty.value, surveyProperty);
        }
        if (typeof eventProperty === "number") {
            return eventProperty.toString() === surveyProperty;
        }
        if (typeof eventProperty === "string") {
            return eventProperty === surveyProperty;
        }
        // The property is undefined or null, so they are not equal.
        return false;
    };
    VsTelemetrySurveyProcessor.prototype.hasTelemetryResult = function (telemetryProperties, result) {
        if (result === null || result === undefined) {
            return false;
        }
        return telemetryProperties[telemetryResultProperty] === result.toString();
    };
    VsTelemetrySurveyProcessor.prototype.emitShowSurvey = function (rule) {
        this._eventEmitter.emit(this._showSurveyEvent, rule);
    };
    return VsTelemetrySurveyProcessor;
}());
exports.VsTelemetrySurveyProcessor = VsTelemetrySurveyProcessor;
//# sourceMappingURL=vs-telemetry-survey-processor.js.map