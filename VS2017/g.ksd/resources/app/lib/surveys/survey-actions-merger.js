"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var survey_configuration_1 = require("./survey-configuration");
/**
 * Class that merges all survey actions to one, regardless of precedence.
 */
var SurveyActionsMerger = /** @class */ (function () {
    function SurveyActionsMerger() {
    }
    SurveyActionsMerger.prototype.merge = function (actions) {
        return actions.reduce(function (previous, current) {
            (_a = previous.rules).push.apply(_a, current.action.rules);
            return previous;
            var _a;
        }, new survey_configuration_1.SurveyConfiguration([]));
    };
    return SurveyActionsMerger;
}());
exports.SurveyActionsMerger = SurveyActionsMerger;
//# sourceMappingURL=survey-actions-merger.js.map