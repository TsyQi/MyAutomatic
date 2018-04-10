/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FeaturesChangedEvent = /** @class */ (function () {
    function FeaturesChangedEvent(enabledFeatures) {
        this._enabledFeatures = enabledFeatures;
    }
    Object.defineProperty(FeaturesChangedEvent.prototype, "enabledFeatures", {
        get: function () {
            return this._enabledFeatures;
        },
        enumerable: true,
        configurable: true
    });
    return FeaturesChangedEvent;
}());
exports.FeaturesChangedEvent = FeaturesChangedEvent;
//# sourceMappingURL=features-changed-event.js.map