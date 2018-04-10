/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../../lib/requires");
var SurveyRule = /** @class */ (function () {
    function SurveyRule(eventName, surveyUrl, properties, surveyResourceId, delay) {
        if (surveyResourceId === void 0) { surveyResourceId = null; }
        if (delay === void 0) { delay = 0; }
        requires.stringNotEmpty(eventName, "eventName");
        requires.stringNotEmpty(surveyUrl, "surveyUrl");
        requires.notNullOrUndefined(properties, "properties");
        this.eventName = eventName;
        this.surveyUrl = surveyUrl;
        this.properties = properties;
        this.resourceId = surveyResourceId;
        this.delay = delay;
    }
    return SurveyRule;
}());
exports.SurveyRule = SurveyRule;
//# sourceMappingURL=survey-rule.js.map