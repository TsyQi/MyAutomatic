/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var enum_1 = require("../../lib/enum");
var features_1 = require("../../lib/feature-flags/features");
var features_changed_event_1 = require("../Events/features-changed-event");
var features_factory_1 = require("../features-factory");
var proxy = features_factory_1.getFeatures();
var featureIds = enum_1.EnumExtensions.getNames(features_1.Feature);
function loadFeatures() {
    var results = [];
    var fetchPromise = featureIds.map(function (id) {
        return proxy.isEnabled(features_1.Feature[id])
            .catch(function () { return false; })
            .then(function (isEnabled) {
            if (isEnabled) {
                results.push(id);
            }
        });
    });
    Promise.all(fetchPromise)
        .then(function () {
        dispatcher_1.dispatcher.dispatch(new features_changed_event_1.FeaturesChangedEvent(results));
    });
}
exports.loadFeatures = loadFeatures;
//# sourceMappingURL=features-actions.js.map