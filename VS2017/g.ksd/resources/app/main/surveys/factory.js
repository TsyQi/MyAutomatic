"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../../lib/Logger");
var vs_telemetry_survey_processor_1 = require("../../lib/surveys/vs-telemetry-survey-processor");
var rpc_factory_1 = require("../rpc-factory");
exports.SURVEYS_ACTION_PATH = "vs\\installer\\surveyactions";
var SurveysFactory = /** @class */ (function () {
    function SurveysFactory(logger) {
        this._logger = logger;
    }
    SurveysFactory.getInstance = function () {
        if (SurveysFactory._instance) {
            return SurveysFactory._instance;
        }
        var logger = Logger_1.getLogger();
        SurveysFactory._instance = new SurveysFactory(logger);
        return SurveysFactory._instance;
    };
    SurveysFactory.prototype.tryCreate = function (remoteSettingsClientPromise, features, telemetry, listeners) {
        var _this = this;
        if (listeners === void 0) { listeners = []; }
        if (this._surveyPromise) {
            return this._surveyPromise;
        }
        var surveyConfigurationProvider = rpc_factory_1.getSurveyConfigurationProvider(remoteSettingsClientPromise, telemetry, exports.SURVEYS_ACTION_PATH);
        this._logger.writeVerbose("Creating VS Telemetry Survey");
        this._surveyPromise = surveyConfigurationProvider
            .then(function (surveyRulesProvider) {
            _this._logger.writeVerbose("Getting the survey rules");
            var survey = new vs_telemetry_survey_processor_1.VsTelemetrySurveyProcessor(surveyRulesProvider.getSurveyConfiguration(), features, telemetry);
            listeners.forEach(function (listener) { return listener.register(survey); });
            return survey;
        })
            .catch(function (error) {
            _this._logger.writeError("Failed to create VS Telemetry Survey" +
                (" [error: " + error.message + " at " + error.stack + "]"));
            return null;
        });
        return this._surveyPromise;
    };
    return SurveysFactory;
}());
exports.SurveysFactory = SurveysFactory;
//# sourceMappingURL=factory.js.map