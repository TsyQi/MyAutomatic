/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var feature_store_1 = require("./feature-store");
var _featureStore;
function createFeatureStore(processor, telemetry) {
    if (_featureStore) {
        return _featureStore;
    }
    _featureStore = new feature_store_1.FeatureStore(processor, telemetry);
    return _featureStore;
}
exports.createFeatureStore = createFeatureStore;
//# sourceMappingURL=feature-store-factory.js.map