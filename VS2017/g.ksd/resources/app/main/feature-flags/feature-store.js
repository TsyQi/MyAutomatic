/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var features_1 = require("../../lib/feature-flags/features");
var feature_flag_1 = require("./feature-flag");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var vs_telemetry_api_1 = require("vs-telemetry-api");
/**
 * @FeatureFlag is a decorator function that ties our features to any feature specifier we want.
 */
var FeatureStore = /** @class */ (function () {
    function FeatureStore(defaultProcessor, telemetry) {
        // Caching of the feature values since we only need to get them once.
        this._featureValues = new Map();
        this._defaultProcessor = defaultProcessor;
        // Retrieve and cache all feature values on creation.
        this.initStore();
        if (telemetry) {
            this.sendFeatureTelemetry(telemetry);
        }
    }
    FeatureStore.prototype.isEnabled = function (feature) {
        var cachedValue = this._featureValues.get(feature);
        // If the feature value is not cached, default to off.
        return cachedValue || Promise.resolve(false);
    };
    FeatureStore.prototype.initStore = function () {
        var _this = this;
        Array.from(this.featureMap.keys()).forEach(function (key) {
            _this._featureValues.set(key, _this.getFeatureValue(key));
        });
    };
    /**
     * Gets the feature value from the feature processor.
     * Should only be called on init to cache the feature value.
     * The promises will always resolve and will return false if the original promise rejects.
     *
     * @param feature The feature to get the value of.
     * @returns The promise from the process call. Resolves with boolean of the feature setting.
     */
    FeatureStore.prototype.getFeatureValue = function (feature) {
        var remoteSettingsPath = this.featureMap.get(feature);
        var processor = this.processorMap.get(feature);
        var processPromise;
        if (processor) {
            processPromise = processor.process(remoteSettingsPath);
        }
        else {
            processPromise = this._defaultProcessor.process(remoteSettingsPath);
        }
        return processPromise.then(function (value) { return value; }, function (error) { return false; });
    };
    FeatureStore.prototype.sendFeatureTelemetry = function (telemetry) {
        var featureValueEntries = Array.from(this._featureValues.entries());
        var features = featureValueEntries.map(function (entry) { return entry[0]; });
        var valuePromises = featureValueEntries.map(function (entry) { return entry[1]; });
        // The promises in the cache always resolve, so no need to guard against rejection.
        Promise.all(valuePromises).then(function (values) {
            var properties = {};
            // Add each feature and its value to the property bag.
            values.forEach(function (value, index) {
                var featureName = features_1.Feature[features[index]];
                properties[featureName] = value.toString();
                telemetry.setCommonProperty(featureName, value.toString());
            });
            telemetry.postOperation(TelemetryEventNames.INIT_FEATURE_STORE, vs_telemetry_api_1.TelemetryResult.Success, "", properties);
        });
    };
    FeatureStore = __decorate([
        feature_flag_1.FeatureFlag(features_1.Feature.Surveys, "Installer\\Features\\Surveys"),
        feature_flag_1.FeatureFlag(features_1.Feature.RecommendSel, "Installer\\Features\\RecommendSel"),
        feature_flag_1.FeatureFlag(features_1.Feature.ShowBitrate, "Installer\\Features\\ShowBitrate"),
        feature_flag_1.FeatureFlag(features_1.Feature.SortWklds, "Installer\\Features\\SortWklds"),
        feature_flag_1.FeatureFlag(features_1.Feature.RecWklds, "Installer\\Features\\RecWklds"),
        feature_flag_1.FeatureFlag(features_1.Feature.CloudFirstDesc, "Installer\\Features\\CloudFirstDesc"),
        feature_flag_1.FeatureFlag(features_1.Feature.CloudNativeDesc, "Installer\\Features\\CloudNativeDesc")
    ], FeatureStore);
    return FeatureStore;
}());
exports.FeatureStore = FeatureStore;
//# sourceMappingURL=feature-store.js.map