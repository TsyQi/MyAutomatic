/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var default_settings_1 = require("../lib/remote-settings/default-settings");
var Logger_1 = require("../lib/Logger");
var remote_settings_adapter_1 = require("../lib/remote-settings/service-hub/remote-settings-adapter");
var remote_settings_client_1 = require("../lib/remote-settings/service-hub/remote-settings-client");
var experimentation_telemetry_adapter_1 = require("../lib/remote-settings/service-hub/experiments/experimentation-telemetry-adapter");
var Telemetry_1 = require("../lib/Telemetry/Telemetry");
var FileSystem_1 = require("../lib/FileSystem");
var survey_actions_adapter_1 = require("../lib/surveys/survey-actions-adapter");
var remote_settings_survey_actions_adapter_1 = require("../lib/surveys/service/remote-settings-survey-actions-adapter");
var survey_actions_merger_1 = require("../lib/surveys/survey-actions-merger");
var remoteSettingsTypeConverter = require("../lib/remote-settings/remote-settings-type-converter");
/**
 * Used as the Channel or Product ID field for targeted notifications.
 * This must match what is expected for rules on the TN portal.
 * See https://targetednotifications.vsdata.io/create/rule
 */
exports.TARGETED_NOTIFICATIONS_PRODUCT_CHANNEL_NAME = "VS Installer";
/**
 * The GUID for the installer appId
 */
var APP_ID_GUID = "42123B45-5471-4B16-81E7-5404CD93BCF1";
var logger = Logger_1.getLogger();
// Get path to default-settings.json
var srcFolder = path.dirname(__dirname);
var defaultSettingsFilePath = path.join(srcFolder, "./lib/remote-settings/default-settings.json");
var _remoteSettingsClient;
function getRemoteSettingsClient(clientName, clientVersion, remoteSettingsFileName, serializedTelemetrySessionPromise, installerFlights) {
    if (_remoteSettingsClient) {
        return _remoteSettingsClient;
    }
    _remoteSettingsClient = serializedTelemetrySessionPromise
        .then(function (serializedTelemetrySession) {
        var flightsConverted = remoteSettingsTypeConverter.flightsToServiceHub(installerFlights);
        return remote_settings_client_1.startRemoteSettingsClient(new experimentation_telemetry_adapter_1.ExperimentationTelemetryAdapter(Telemetry_1.telemetryConfiguration), logger, clientName, clientVersion, remoteSettingsFileName, serializedTelemetrySession, exports.TARGETED_NOTIFICATIONS_PRODUCT_CHANNEL_NAME, APP_ID_GUID, flightsConverted);
    });
    return _remoteSettingsClient;
}
exports.getRemoteSettingsClient = getRemoteSettingsClient;
var _remoteSettingsService;
function getRemoteSettingsRpcService(remoteSettingsClientPromise) {
    if (_remoteSettingsService) {
        logger.writeWarning("getRemoteSettingsIpcService called more than once.");
        return _remoteSettingsService;
    }
    var defaultSettingsPromise = FileSystem_1.readFileAsString(defaultSettingsFilePath)
        .then(function (settings) { return new default_settings_1.DefaultSettings(settings); });
    _remoteSettingsService = Promise.all([remoteSettingsClientPromise, defaultSettingsPromise])
        .then(function (_a) {
        var client = _a[0], defaultSettings = _a[1];
        return new remote_settings_adapter_1.ServiceHubRemoteSettingsAdapter(client, defaultSettings);
    })
        .catch(function (error) {
        logger.writeError("Remote Settings Ipc Service creation failed.\nerror: [" + error.name + "] " + error.message + " at " + error.stack);
        return null;
    });
    return _remoteSettingsService;
}
exports.getRemoteSettingsRpcService = getRemoteSettingsRpcService;
var _surveyRulesProvider;
function getSurveyConfigurationProvider(remoteSettingsClientPromise, telemetry, actionPath) {
    if (_surveyRulesProvider) {
        return _surveyRulesProvider;
    }
    _surveyRulesProvider = remoteSettingsClientPromise
        .then(function (remoteSettingsClient) {
        return new remote_settings_survey_actions_adapter_1.RemoteSettingsSurveyActionsAdapter(remoteSettingsClient, telemetry);
    })
        .then(function (surveyActionProvider) {
        var surveyActionsMerger = new survey_actions_merger_1.SurveyActionsMerger();
        return new survey_actions_adapter_1.SurveyActionsAdapter(surveyActionProvider, surveyActionsMerger, actionPath);
    });
    return _surveyRulesProvider;
}
exports.getSurveyConfigurationProvider = getSurveyConfigurationProvider;
//# sourceMappingURL=rpc-factory.js.map