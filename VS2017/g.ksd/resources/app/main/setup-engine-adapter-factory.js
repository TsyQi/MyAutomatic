/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WindowsInstaller_1 = require("./WindowsInstaller");
var progress_reporter_1 = require("./Installer/progress-reporter");
var SetupEngineAdapter_1 = require("../lib/Installer/Adapters/SetupEngineAdapter");
var CommandLineParser_1 = require("./command-line/CommandLineParser");
var packageJson = require("./package");
var client_info_1 = require("../lib/Installer/client-info");
var SetupEngineAdapterFactory = /** @class */ (function () {
    function SetupEngineAdapterFactory() {
    }
    SetupEngineAdapterFactory.getSetupEngineAdapter = function (progressBar, locale, serializedTelemetrySession, installerOperation, campaign, appExePath, ignoreEngineUpdates, bootstrapperCommunicator, argv) {
        if (SetupEngineAdapterFactory._setupEngineAdapter) {
            return SetupEngineAdapterFactory._setupEngineAdapter;
        }
        var isUninstallingHost = installerOperation === WindowsInstaller_1.InstallerOperation.Uninstalling;
        var client = new client_info_1.ClientInfo(packageJson.APP_INFO, locale, serializedTelemetrySession, campaign);
        SetupEngineAdapterFactory._setupEngineAdapter = new SetupEngineAdapter_1.SetupEngineAdapter(appExePath, client, argv.channelUri, argv.installChannelUri, argv.installCatalogUri, this.createParametersForResumeFunction(argv.quiet, argv.passive, argv.productKey), bootstrapperCommunicator, ignoreEngineUpdates, isUninstallingHost /* ignore updates when uninstalling the host */);
        /* istanbul ignore next */
        if (!SetupEngineAdapterFactory._setupEngineAdapter) {
            throw new Error("unable to create new instance of SetupEngineAdapter.");
        }
        SetupEngineAdapterFactory._progressReporter = new progress_reporter_1.ProgressReporter(SetupEngineAdapterFactory._setupEngineAdapter, progressBar);
        return SetupEngineAdapterFactory._setupEngineAdapter;
    };
    /* istanbul ignore next */
    SetupEngineAdapterFactory.createParametersForResumeFunction = function (isQuiet, isPassive, productKey) {
        return function (installPath, installSessionId) {
            return CommandLineParser_1.CommandLineParser.getParametersForResume(installPath, installSessionId, isQuiet, isPassive, productKey);
        };
    };
    return SetupEngineAdapterFactory;
}());
exports.SetupEngineAdapterFactory = SetupEngineAdapterFactory;
//# sourceMappingURL=setup-engine-adapter-factory.js.map