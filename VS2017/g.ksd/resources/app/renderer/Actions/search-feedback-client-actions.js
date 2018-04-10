/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var feedback_client_factory_1 = require("../feedback/feedback-client-factory");
var get_solutions_events_1 = require("../Events/get-solutions-events");
var SearchFeedbackClientActions = /** @class */ (function () {
    function SearchFeedbackClientActions() {
    }
    SearchFeedbackClientActions.prototype.findSolutions = function (failedPackage) {
        var feedbackClient = feedback_client_factory_1.getFeedbackClient();
        feedbackClient.search(failedPackage)
            .then(function (result) {
            dispatcher_1.dispatcher.dispatch(new get_solutions_events_1.GetSolutionsFinishedEvent(result));
        }, function (_error) {
            var result = {
                bestResult: null,
                failedPackage: failedPackage,
                hasSolutions: false,
                hasAcceptedSolutions: false,
            };
            dispatcher_1.dispatcher.dispatch(new get_solutions_events_1.GetSolutionsFinishedEvent(result));
        });
    };
    return SearchFeedbackClientActions;
}());
exports.SearchFeedbackClientActions = SearchFeedbackClientActions;
exports.searchFeedbackClientActions = new SearchFeedbackClientActions();
//# sourceMappingURL=search-feedback-client-actions.js.map