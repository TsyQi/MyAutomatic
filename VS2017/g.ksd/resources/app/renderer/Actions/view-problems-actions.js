/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get_solutions_events_1 = require("../Events/get-solutions-events");
var view_problems_events_1 = require("../Events/view-problems-events");
var telemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
exports.NUM_FAILED_PACKAGES = 3;
var ViewProblemsActions = /** @class */ (function () {
    function ViewProblemsActions(dispatcher, openFeedbackClientModule, telemetryProxy) {
        this._dispatcher = dispatcher;
        this._openFeedbackClientModule = openFeedbackClientModule;
        this._telemetryProxy = telemetryProxy;
    }
    ViewProblemsActions.prototype.viewProblems = function (product, log) {
        var topFailedPackages = this.topFailedPackages(product);
        this._telemetryProxy.sendIpcAtomicEvent(telemetryEventNames.VIEW_PROBLEMS, true, {
            numPackageIdsShown: topFailedPackages.length
        });
        this._dispatcher.dispatch(new get_solutions_events_1.GetSolutionsStartedEvent());
        this._dispatcher.dispatch(new view_problems_events_1.ShowViewProblemsEvent(product, log, topFailedPackages));
    };
    ViewProblemsActions.prototype.hideViewProblems = function () {
        this._dispatcher.dispatch(new view_problems_events_1.HideViewProblemsEvent());
    };
    ViewProblemsActions.prototype.openFeedbackClient = function (failedPackage, channels, searchString) {
        var channelIds = channels.map(function (channel) { return channel.id; });
        var initialReproText = "*" + ResourceStrings_1.ResourceStrings.describeIssue + "*\n\n\n==== " + ResourceStrings_1.ResourceStrings.doNotEdit + "====\n" + searchString;
        var setupTags = this.createTags(failedPackage);
        this._openFeedbackClientModule.openFeedbackClient(channelIds, searchString, initialReproText, setupTags);
    };
    ViewProblemsActions.prototype.createTags = function (failedPackage) {
        var setupTags = [
            {
                "type": "setup-operation",
                "value": failedPackage.action
            },
            {
                "type": "setup-package-id",
                "value": failedPackage.id
            },
            {
                "type": "setup-code",
                "value": failedPackage.returnCode
            },
        ];
        return setupTags;
    };
    ViewProblemsActions.prototype.topFailedPackages = function (product) {
        if (product !== null && product.errorDetails !== null && product.errorDetails.failedPackages !== null) {
            return product.errorDetails.failedPackages.filter(function (p) { return p.action !== "" && p.id !== ""; })
                .slice(0, exports.NUM_FAILED_PACKAGES);
        }
        return [];
    };
    return ViewProblemsActions;
}());
exports.ViewProblemsActions = ViewProblemsActions;
//# sourceMappingURL=view-problems-actions.js.map