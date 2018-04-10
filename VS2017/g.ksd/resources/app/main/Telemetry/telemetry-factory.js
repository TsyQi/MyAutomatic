/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var vs_telemetry_1 = require("vs-telemetry");
var Logger_1 = require("../../lib/Logger");
var telemetry_processor_1 = require("../../lib/Telemetry/telemetry-processor");
var VSTelemetryListener_1 = require("../../lib/Telemetry/Listeners/VSTelemetryListener");
var browser_window_factory_1 = require("../browser-window-factory");
var package_1 = require("../package");
var Telemetry_1 = require("../../lib/Telemetry/Telemetry");
var TelemetryService_1 = require("../Telemetry/TelemetryService");
var feature_store_factory_1 = require("../feature-flags/feature-store-factory");
var remote_settings_feature_processor_1 = require("../feature-flags/remote-settings-feature-processor");
var rpc_factory_1 = require("../rpc-factory");
var app_info_1 = require("../../lib/app-info");
var factory_1 = require("../surveys/factory");
var survey_listener_1 = require("../surveys/survey-listener");
var telemetry_survey_listener_1 = require("../../lib/Telemetry/Listeners/telemetry-survey-listener");
var mainDir = path.dirname(__dirname);
var rendererDir = path.join(path.dirname(mainDir), "renderer");
var logger = Logger_1.getLogger();
var telemetryRulesFileName = "survey-configuration.json";
var telemetryRulesPath = path.join(__dirname, telemetryRulesFileName);
var VS_TELEMETRY_PREFIX_PARTS = ["VS", "Willow"];
var TelemetryFactory = /** @class */ (function () {
    function TelemetryFactory(appInfo, surveysFactory) {
        this._appInfo = appInfo;
        this._surveysFactory = surveysFactory;
    }
    TelemetryFactory.getInstance = function () {
        var appInfo = new app_info_1.AppInfo(package_1.EXE_NAME, package_1.EXE_VERSION, package_1.BRANCH_NAME);
        var surveysFactory = factory_1.SurveysFactory.getInstance();
        return new TelemetryFactory(appInfo, surveysFactory);
    };
    TelemetryFactory.prototype.createVsTelemetryListener = function (telemetry, telemetryProcessor) {
        if (this._vsTelemetryListener) {
            return this._vsTelemetryListener;
        }
        telemetry = telemetry || this.getDefaultTelemetrySession();
        telemetryProcessor = telemetryProcessor || new telemetry_processor_1.TelemetryProcessor(VS_TELEMETRY_PREFIX_PARTS);
        this._vsTelemetryListener = new VSTelemetryListener_1.VSTelemetryListener(telemetry, telemetryProcessor, this._appInfo);
        return this._vsTelemetryListener;
    };
    TelemetryFactory.prototype.getDefaultTelemetrySession = function () {
        return vs_telemetry_1.TelemetryService.getDefaultSession();
    };
    TelemetryFactory.prototype.startTelemetrySession = function (remoteSettingsClientPromise) {
        var vsTelemetryListener = this.createVsTelemetryListener();
        Telemetry_1.telemetryConfiguration.addListener(vsTelemetryListener);
        if (remoteSettingsClientPromise) {
            var vsTelemetrySurveyListener = this.createVsTelemetrySurveyListener(remoteSettingsClientPromise);
            Telemetry_1.telemetryConfiguration.addListener(vsTelemetrySurveyListener);
        }
        return Telemetry_1.telemetryConfiguration;
    };
    TelemetryFactory.prototype.createRendererTelemetryListener = function () {
        if (!this._rendererTelemetryListener) {
            this._rendererTelemetryListener = new TelemetryService_1.TelemetryService(Telemetry_1.telemetryConfiguration);
        }
        return this._rendererTelemetryListener;
    };
    TelemetryFactory.prototype.createVsTelemetrySurveyListener = function (remoteSettingsClientPromise) {
        var telemetrySession = this.getDefaultTelemetrySession();
        var telemetryProcessor = new telemetry_processor_1.TelemetryProcessor(VS_TELEMETRY_PREFIX_PARTS);
        var listener = new telemetry_survey_listener_1.TelemetrySurveyListener(this.createSurveyProcessor(telemetrySession, Telemetry_1.telemetryConfiguration, remoteSettingsClientPromise), telemetryProcessor);
        return listener;
    };
    TelemetryFactory.prototype.createSurveyProcessor = function (telemetry, telemetryProvider, remoteSettingsClientPromise) {
        var remoteSettingsPromise = rpc_factory_1.getRemoteSettingsRpcService(remoteSettingsClientPromise);
        var processor = new remote_settings_feature_processor_1.RemoteSettingsFeatureProcessor(remoteSettingsPromise);
        var features = feature_store_factory_1.createFeatureStore(processor, telemetryProvider);
        var bwFactory = new browser_window_factory_1.BrowserWindowFactory(rendererDir);
        return this._surveysFactory.tryCreate(remoteSettingsClientPromise, features, telemetryProvider, [
            // Add a single SurveyListener to prompt for surveys
            new survey_listener_1.SurveyListener(bwFactory, logger, this._appInfo, Telemetry_1.telemetryConfiguration, telemetry.sessionId())
        ]);
    };
    return TelemetryFactory;
}());
exports.TelemetryFactory = TelemetryFactory;
//# sourceMappingURL=telemetry-factory.js.map