/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("./store");
var features_1 = require("../../lib/feature-flags/features");
var features_changed_event_1 = require("../Events/features-changed-event");
var FeaturesStore = /** @class */ (function (_super) {
    __extends(FeaturesStore, _super);
    function FeaturesStore(dispatcher) {
        var _this = _super.call(this, dispatcher) || this;
        _this._featuresIds = [];
        _this._featuresLoaded = false;
        _this.registerEvents([
            { event: features_changed_event_1.FeaturesChangedEvent, callback: _this.onFeaturesChanged.bind(_this) },
        ]);
        return _this;
    }
    Object.defineProperty(FeaturesStore, "CHANGED_EVENT", {
        get: function () {
            return "CHANGED";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeaturesStore.prototype, "featuresLoaded", {
        get: function () {
            return this._featuresLoaded;
        },
        enumerable: true,
        configurable: true
    });
    FeaturesStore.prototype.isEnabled = function (feature) {
        return this._featuresIds.indexOf(features_1.Feature[feature]) > -1;
    };
    FeaturesStore.prototype.onFeaturesChanged = function (ev) {
        this._featuresLoaded = true;
        this._featuresIds = ev.enabledFeatures;
        this.emit(FeaturesStore.CHANGED_EVENT);
    };
    return FeaturesStore;
}(store_1.Store));
exports.FeaturesStore = FeaturesStore;
//# sourceMappingURL=features-store.js.map