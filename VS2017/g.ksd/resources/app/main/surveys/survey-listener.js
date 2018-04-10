"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var window_options_1 = require("../../lib/window-options");
var browser_window_telemetry_1 = require("../Telemetry/browser-window-telemetry");
var browser_window_1 = require("../browser-window");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var survey_message_provider_1 = require("../../lib/surveys/survey-message-provider");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var promise_completion_source_1 = require("../../lib/promise-completion-source");
var SurveyListener = /** @class */ (function () {
    function SurveyListener(browserWindowFactory, logger, appInfo, telemetry, sessionIdPromise) {
        this._showSurveyBind = this.showSurvey.bind(this);
        this._openedWindowPromise = Promise.resolve();
        /**
         * Stores the survey URLs that have been shown to the user.
         * Event though we may have multiple rules with the same URL,
         * the URL is the actual survey. So, we only want to show the URL once per session.
         */
        this._surveyUrlsPrompted = new Set();
        this._browserWindowFactory = browserWindowFactory;
        this._logger = logger;
        this._appInfo = appInfo;
        this._telemetry = telemetry;
        this._telemetrySessionIdPromise = sessionIdPromise;
    }
    SurveyListener.prototype.register = function (survey) {
        survey.onShowSurvey(this._showSurveyBind);
    };
    SurveyListener.prototype.unregister = function (survey) {
        survey.removeListener(this._showSurveyBind);
    };
    SurveyListener.prototype.showSurvey = function (rule) {
        var _this = this;
        // Only show a single endpoint once per session.
        if (this._surveyUrlsPrompted.has(rule.surveyUrl)) {
            return;
        }
        // Add the url so we do not prompt for the same survey multiple times per session.
        this._surveyUrlsPrompted.add(rule.surveyUrl);
        // Queues up surveys to be shown one after another
        this._openedWindowPromise = this._openedWindowPromise
            .then(function () { return _this._telemetrySessionIdPromise; })
            .then(function (sessionId) {
            var surveyProperties = survey_message_provider_1.SurveyMessageProvider.getSurveyProperties(rule.resourceId);
            var queryOptions = {
                appVersion: _this._appInfo.appVersion,
                branch: _this._appInfo.branchName,
                locale: ResourceStrings_1.ResourceStrings.uiLocale(),
                surveyUrl: rule.surveyUrl,
                sessionId: sessionId,
                message: surveyProperties.message,
                title: surveyProperties.title,
                okText: surveyProperties.okText,
                cancelText: surveyProperties.cancelText
            };
            var surveyWindowUrl = _this._browserWindowFactory.formatUrlWithQueryOptions(browser_window_1.WindowType.Survey, queryOptions, null);
            var window = _this._browserWindowFactory.createWindow(window_options_1.surveyPromptWindowOptions(), surveyWindowUrl, new browser_window_telemetry_1.BrowserWindowTelemetry(_this._telemetry, _this._logger));
            if (_this._telemetry) {
                _this._telemetry.postOperation(TelemetryEventNames.SURVEY_PROMPT_SHOWN_TO_USER, vs_telemetry_api_1.TelemetryResult.Success, "User was prompted survey", {
                    "Survey.eventName": rule.eventName,
                    "Survey.surveyUrl": rule.surveyUrl,
                    "Survey.accept": JSON.stringify(rule.properties.accept),
                    "Survey.reject": JSON.stringify(rule.properties.reject),
                });
            }
            var openedWindowPromise = new promise_completion_source_1.PromiseCompletionSource();
            window.onClosed(function () { return openedWindowPromise.resolve(); });
            // Chain all window opens to show one survey at a time.
            return openedWindowPromise.promise;
        });
        return this._openedWindowPromise;
    };
    return SurveyListener;
}());
exports.SurveyListener = SurveyListener;
//# sourceMappingURL=survey-listener.js.map