/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceStrings_1 = require("../../lib/ResourceStrings");
/**
 * Add known survey dialog resources to this enum
 */
var SurveyResourceId;
(function (SurveyResourceId) {
    SurveyResourceId[SurveyResourceId["RejectRecommendedSelection"] = 0] = "RejectRecommendedSelection";
    SurveyResourceId[SurveyResourceId["CloseDetailsPage"] = 1] = "CloseDetailsPage";
})(SurveyResourceId = exports.SurveyResourceId || (exports.SurveyResourceId = {}));
/**
 * Support for Survey Message Provider APIs
 */
var SurveyMessageProvider = /** @class */ (function () {
    function SurveyMessageProvider() {
    }
    /**
     * Fetches the respective ResourceString values for given SurveyId
     */
    SurveyMessageProvider.getSurveyProperties = function (resourceId) {
        var surveyProperties = {
            message: ResourceStrings_1.ResourceStrings.surveyPrompt,
            title: ResourceStrings_1.ResourceStrings.surveyPromptTitle,
            okText: ResourceStrings_1.ResourceStrings.yes,
            cancelText: ResourceStrings_1.ResourceStrings.no,
        };
        switch (resourceId) {
            case SurveyResourceId.RejectRecommendedSelection:
                surveyProperties.message = ResourceStrings_1.ResourceStrings.duringInstallSurveyMessage;
                surveyProperties.title = ResourceStrings_1.ResourceStrings.pleaseTellUsMore;
                surveyProperties.okText = ResourceStrings_1.ResourceStrings.takeSurvey;
                surveyProperties.cancelText = ResourceStrings_1.ResourceStrings.closeButtonTitle;
                break;
            case SurveyResourceId.CloseDetailsPage:
                surveyProperties.message = ResourceStrings_1.ResourceStrings.notInstallingVisualStudioSurveyMessage;
                surveyProperties.title = ResourceStrings_1.ResourceStrings.pleaseTellUsMore;
                surveyProperties.okText = ResourceStrings_1.ResourceStrings.takeSurvey;
                surveyProperties.cancelText = ResourceStrings_1.ResourceStrings.closeButtonTitle;
                break;
            default:
                break;
        }
        return surveyProperties;
    };
    return SurveyMessageProvider;
}());
exports.SurveyMessageProvider = SurveyMessageProvider;
//# sourceMappingURL=survey-message-provider.js.map