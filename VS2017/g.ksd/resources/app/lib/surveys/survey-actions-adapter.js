"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adapter class that will convert targeted notifications actions to survey rules.
 */
var SurveyActionsAdapter = /** @class */ (function () {
    function SurveyActionsAdapter(actionProvider, actionMerger, actionPath) {
        this._actionProvider = actionProvider;
        this._actionMerger = actionMerger;
        this._actionPath = actionPath;
    }
    SurveyActionsAdapter.prototype.getSurveyConfiguration = function () {
        var _this = this;
        return this._actionProvider.getSurveyActions(this._actionPath)
            .then(function (actions) {
            return _this._actionMerger.merge(actions);
        });
    };
    return SurveyActionsAdapter;
}());
exports.SurveyActionsAdapter = SurveyActionsAdapter;
//# sourceMappingURL=survey-actions-adapter.js.map