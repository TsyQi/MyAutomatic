"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var targeted_notifications_action_converter_1 = require("../../targeted-notifications/service/targeted-notifications-action-converter");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var survey_rule_type_converter_1 = require("./survey-rule-type-converter");
var RemoteSettingsSurveyActionsAdapter = /** @class */ (function () {
    function RemoteSettingsSurveyActionsAdapter(service, telemetry) {
        this._getSurveyActionsEventName = "get-surveyactions";
        this._service = service;
        this._telemetry = telemetry;
    }
    RemoteSettingsSurveyActionsAdapter.prototype.getSurveyActions = function (actionPath) {
        var scope = this._telemetry.startOperation(this._getSurveyActionsEventName, {
            actionPath: actionPath,
        });
        return this._service.getSurveyActionsAsync(actionPath)
            .then(function (actions) {
            scope.end(vs_telemetry_api_1.TelemetryResult.Success);
            /* istanbul ignore next */
            return actions
                .map(function (action) { return targeted_notifications_action_converter_1.actionFromService(action, survey_rule_type_converter_1.surveyConfigurationFromService); })
                .filter(function (configuration) { return !!configuration; });
        })
            .catch(function (error) {
            scope.end(vs_telemetry_api_1.TelemetryResult.Failure, {
                errorName: error.name,
                errorMessage: error.message,
            });
            throw error;
        });
    };
    return RemoteSettingsSurveyActionsAdapter;
}());
exports.RemoteSettingsSurveyActionsAdapter = RemoteSettingsSurveyActionsAdapter;
//# sourceMappingURL=remote-settings-survey-actions-adapter.js.map