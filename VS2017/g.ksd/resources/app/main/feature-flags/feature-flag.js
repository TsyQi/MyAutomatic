/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This constant serves as key for indexing into an IFeatures.featureMap. Use this variable if you want
// to modify the IFeature.featureMap property inside a decorator.
// E.g. constructor.prototype[FEATURE_MAP_PROPERTY] returns the IFeatures.featureMap
var FEATURE_MAP_PROPERTY = "featureMap";
// This constant serves as key for indexing into an IFeatures.processorMap. Use this variable if you want
// to modify the IFeature.processorMap property inside a decorator.
// E.g. constructor.prototype[PROCESSOR_MAP_PROPERTY] returns the IFeatures.processorMap
var PROCESSOR_MAP_PROPERTY = "processorMap";
/**
 * FeatureFlag() is a decorator factory that returns a decorator that will modify
 * an IFeatures featureMap and processorMap properties. Can only be used on classes
 * that implement IFeatures.
 *
 * @param feature The feature to process.
 * @param remoteSettingsPath The various flags that determine weather or not a feature is enabled.
 * @param processor An optional parameter that allows the caller to specify how the feature should be processed.
 */
function FeatureFlag(feature, remoteSettingsPath, processor) {
    return function (constructor) {
        // Ensure the featureMap is created in our class
        if (!constructor.prototype[FEATURE_MAP_PROPERTY]) {
            constructor.prototype[FEATURE_MAP_PROPERTY] = new Map();
        }
        // Ensure the processorMap is created in our class
        if (!constructor.prototype[PROCESSOR_MAP_PROPERTY]) {
            constructor.prototype[PROCESSOR_MAP_PROPERTY] = new Map();
        }
        var featureMap = constructor.prototype[FEATURE_MAP_PROPERTY];
        featureMap.set(feature, remoteSettingsPath);
        if (processor) {
            var processorMap = constructor.prototype[PROCESSOR_MAP_PROPERTY];
            processorMap.set(feature, processor);
        }
        return constructor;
    };
}
exports.FeatureFlag = FeatureFlag;
//# sourceMappingURL=feature-flag.js.map