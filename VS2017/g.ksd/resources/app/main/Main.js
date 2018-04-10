/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
/// <reference path="../typings/node-missing-declares.d.ts" />
/// <reference path="../typings/report-errors-electron-missing-declares.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var APPLICATION_START_TIME = Date.now();
var moduleName = "main";
/* tslint:disable:no-use-before-declare */
var electron_1 = require("electron");
/* tslint:enable */
var fs = require("fs");
var path = require("path");
var ShutdownUtilities_1 = require("../lib/ShutdownUtilities");
var windowConstants = require("../lib/window-action-constants");
var leak_detector_1 = require("../lib/leak-detector");
var Relauncher_1 = require("./Relauncher");
var errors_1 = require("../lib/errors");
var promise_completion_source_1 = require("../lib/promise-completion-source");
var browser_window_1 = require("./browser-window");
var package_1 = require("./package");
var remote_settings_1 = require("../lib/remote-settings/remote-settings");
// Only used for taskbar
var appExeName = "vs_installer.exe";
var appExePath = electron_1.app.getPath("exe");
var Logger_1 = require("../lib/Logger");
var logger = Logger_1.getLogger();
var version = package_1.BRANCH_NAME ? package_1.EXE_VERSION + " : " + package_1.BRANCH_NAME : "" + package_1.EXE_VERSION;
logger.writeVerbose(package_1.APPLICATION_NAME + " (" + version + ") " + JSON.stringify(process.argv));
/**
 * The time we wait for telemetry to send before shutting down.
 */
var APPLICATION_SHUTDOWN_TIMEOUT_IN_MS = 60 * 1000; // one minute
/**
 * The time we wait for the bootstrapper pipe connect event before showing the window
 */
var WINDOW_HIDDEN_TIMEOUT_IN_MS = 15 * 1000; // 15 seconds
// extend Promise with finally
require("../lib/PromiseFinallyMixin");
// parse the command line
var argument_preprocessor_factory_1 = require("./command-line/argument-preprocessors/argument-preprocessor-factory");
var dev_build_preprocessor_1 = require("./command-line/argument-preprocessors/dev-build-preprocessor");
var CommandLineParser_1 = require("./command-line/CommandLineParser");
var command_line_error_handler_factory_1 = require("./command-line/command-line-error-handler-factory");
var CommandLine_1 = require("../lib/CommandLine");
var ConsoleLogger_1 = require("../lib/ConsoleLogger");
var isDevBuild = dev_build_preprocessor_1.DevBuildPreprocessor.isDevBuild(process.argv);
// watch for leaks in the main process
var captureHeapDumps = isDevBuild;
var enableLeakLogging = isDevBuild;
var leakDetector = new leak_detector_1.LeakDetector("Main", captureHeapDumps, enableLeakLogging);
leakDetector.on(leak_detector_1.LeakDetector.leakDetectedEvent, onLeakDetected);
function onLeakDetected(info) {
    function log(message) {
        logger.writeVerbose(message);
    }
    log("Potential leak detected in " + info.processName + " process:");
    log("    Heap Size: " + info.heapSize.toLocaleString() + " bytes");
    log("    Average Leak Size: " + info.averageLeakSize.toLocaleString() + " bytes/GC");
    if (info.beforeSnapshotName) {
        log("    \"Before\" snapshot name: " + (info.beforeSnapshotName || "(none)"));
    }
    if (info.afterSnapshotName) {
        log("    \"After\"  snapshot name: " + (info.afterSnapshotName || "(none)"));
    }
    if (telemetry) {
        telemetry.postOperation(TelemetryEventNames.APPLICATION_LEAK_DETECTED, vs_telemetry_api_1.TelemetryResult.None, "leak detected", {
            processType: info.processName,
            heapSize: info.heapSize,
            averageLeakSize: info.averageLeakSize,
        });
    }
}
var consoleLogger = new ConsoleLogger_1.ConsoleLogger();
// We do not want to show an error dialog in --passive or --quiet, since then it will block the
// user.
var showDialogOnError = !CommandLineParser_1.CommandLineParser.argsContainQuietOrPassive(process.argv);
// Create parser and argument preprocessor
var commandLineParser = new CommandLineParser_1.CommandLineParser(consoleLogger, showDialogOnError, new command_line_error_handler_factory_1.CommandLineErrorHandlerFactory());
var argumentPreprocessor = new argument_preprocessor_factory_1.ArgumentPreprocessorFactory(electron_1.app.getAppPath()).createArgumentPreprocessor();
function applicationInitializationDurationProperties() {
    return {
        applicationStartTime: APPLICATION_START_TIME,
        applicationRunTimeDuration: Date.now() - APPLICATION_START_TIME
    };
}
var argv;
// Import and initialize Telemetry before other modules are loaded.
var vs_telemetry_api_1 = require("vs-telemetry-api");
var Telemetry_1 = require("../lib/Telemetry/Telemetry");
var TelemetryEventNames = require("../lib/Telemetry/TelemetryEventNames");
var telemetry_factory_1 = require("./Telemetry/telemetry-factory");
var user_data_store_factory_1 = require("./user-data-store-factory");
var bucket_parameters_1 = require("../lib/Telemetry/bucket-parameters");
var rpc_factory_1 = require("./rpc-factory");
var flight_info_1 = require("../lib/command-line/flight-info");
var flightInfoFactory = flight_info_1.FlightInfoFromArgVFactory.getInstance();
var telemetryFactory = telemetry_factory_1.TelemetryFactory.getInstance();
var telemetry;
var appRunOperation;
try {
    var processArgsResult = argumentPreprocessor.tryProcess(process.argv);
    if (processArgsResult.error) {
        logger.writeWarning("Failed to preprocess the args with error: " + processArgsResult.error.message);
    }
    argv = commandLineParser.parse(processArgsResult.args, isDevBuild);
    // Ensure remote settings client is initalized with seeded flights, before
    // any other path can create it.
    var remoteSettingsClientPromise = rpc_factory_1.getRemoteSettingsClient(package_1.EXE_NAME, package_1.EXE_VERSION, remote_settings_1.remoteSettingsFileName, telemetryFactory.getDefaultTelemetrySession().serializeSettings(), flightInfoFactory.create(argv.installerFlight));
    telemetry = telemetryFactory.startTelemetrySession(remoteSettingsClientPromise);
    if (argv.version) {
        console.log(electron_1.app.getVersion());
        electron_1.app.exit(0);
    }
    if (argv.runOnce) {
        var timeout = 1000;
        var argsCopy = process.argv.slice();
        argsCopy.splice(0, 1); // Remove first argument as its the app path.
        var runOnceRelauncher = new Relauncher_1.RunOnceRelauncher(appExePath, argsCopy, timeout, commandLineParser);
        runOnceRelauncher.launch()
            .then(function () {
            // timeout called.
            logger.writeVerbose("This process is created due to a Windows restart relaunching setup " +
                "via the runOnce registry key. It has launched another Visual Studio Installer instance, " +
                "without the runOnce parameter to complete the requested operation " +
                "and will return so that Windows can continue with boot-up. " +
                "The child Visual Studio Installer process has not returned any errors " +
                "within the timeout period. " +
                "To examine the setup process, look for another log that is approximately one second newer " +
                "than this log file.");
            electron_1.app.exit(0);
        })
            .catch(function () {
            // Error was called before timeout
            logger.writeError("Failed to relaunch installer without RunOnce parameter");
            electron_1.app.exit(1);
        });
    }
    if (argv.quiet) {
        logger.shouldWriteToConsole = true;
    }
    // log the campaign ID and the activity ID (if present) on all telemetry events
    if (argv.campaign || argv.activityId) {
        if (argv.campaign) {
            telemetry.setCommonProperty(CommandLine_1.OptionNames.campaign, argv.campaign);
        }
        if (argv.activityId) {
            telemetry.setCommonProperty(CommandLine_1.OptionNames.activityId, argv.activityId);
        }
    }
    // Log quiet and passive with all events
    telemetry.setCommonProperty(CommandLine_1.OptionNames.quiet, argv.quiet ? "true" : "false");
    telemetry.setCommonProperty(CommandLine_1.OptionNames.passive, argv.passive ? "true" : "false");
    // Add how we were started. If we have an activityId then we were indirectly started by some other exe (e.g. VS)
    // No activity ID indicates the user directly ran us, so start method is direct.
    telemetry.setCommonProperty("startMethod", argv.activityId ? "indirect" : "direct");
    // Start app
    var properties = Telemetry_1.buildAppLaunchTelemetryProperties(argv, logger);
    appRunOperation = telemetry.startOperation(TelemetryEventNames.APPLICATION_RUN, properties);
    telemetry.postOperation(TelemetryEventNames.APPLICATION_INITIALIZE_PRE_TELEMETRY, vs_telemetry_api_1.TelemetryResult.Success, null, applicationInitializationDurationProperties());
}
catch (error) {
    logger.writeError(error.stack);
    var event_1;
    if (!telemetry) {
        telemetry = telemetryFactory.startTelemetrySession(null);
    }
    // If the error is a parse error, do not post a fault event but post an operation event.
    if (error instanceof errors_1.CommandLineParseError) {
        event_1 = telemetry.postOperation(TelemetryEventNames.APPLICATION_PARSE_CMDLINE, vs_telemetry_api_1.TelemetryResult.UserFault, "Failed to parse the commnand line with error " + error.message);
    }
    else {
        event_1 = telemetry.postError(TelemetryEventNames.APPLICATION_CMDLINE_ERROR, error.message, new bucket_parameters_1.BucketParameters("parse", moduleName), error);
    }
    if (!appRunOperation) {
        appRunOperation = telemetry.startOperation(TelemetryEventNames.APPLICATION_RUN, null);
    }
    telemetry.postOperation(TelemetryEventNames.APPLICATION_INITIALIZE_PRE_TELEMETRY, vs_telemetry_api_1.TelemetryResult.Failure, null, applicationInitializationDurationProperties());
    appRunOperation.correlate(event_1);
    var errorProperties = { ResultDetails: error.message };
    appRunOperation.end(vs_telemetry_api_1.TelemetryResult.Failure, errorProperties);
    var telemetryFinalizePromise = telemetry.finalizeOperationsAndSendPendingData();
    var timeoutPromise = new Promise(function (resolve, reject) {
        var timeoutError = new Error("Timed out during application cleanup.");
        setTimeout(function () {
            logger.writeError(timeoutError.message);
            reject(timeoutError);
        }, APPLICATION_SHUTDOWN_TIMEOUT_IN_MS);
    });
    Promise.race([telemetryFinalizePromise, timeoutPromise]).finally(function () { return electron_1.app.exit(1); });
}
// Add Error Handling
// Allow Wer to handle native crashes
var enable_wer_windows_1 = require("enable-wer-windows");
var enableWerOperation = telemetry.startOperation(TelemetryEventNames.APPLICATION_ENABLE_WER, null);
enable_wer_windows_1.default();
enableWerOperation.end(vs_telemetry_api_1.TelemetryResult.Success);
var report_errors_electron_1 = require("report-errors-electron");
var report_errors_1 = require("report-errors");
var wer_reporter_1 = require("wer-reporter");
var StubMain_1 = require("./StubMain");
var errorHandler = new report_errors_electron_1.ErrorHandlerMain();
// print the raw stack to the console
errorHandler.addReportingChannel(new report_errors_1.ConsoleReporter());
if (!isDevBuild) {
    // report the failure to Watson, also resulting in a Watson crash dialog
    errorHandler.addReportingChannel(new wer_reporter_1.WatsonReporter());
}
// write the wer error log file to the default logging location
errorHandler.addReportingChannel(new report_errors_1.FileReporter(Logger_1.DEFAULT_LOGGER_DIRECTORY, "dd_client_" + Logger_1.getLogFileDateTime() + "_wer.log", true));
// Allows the program to react to reporting being finished or failing.
errorHandler.onReportingFinished(function (results) {
    logger.writeError("results: " + results);
});
errorHandler.onAsyncFailure(function (err) { logger.writeError("async rep failure: " + err.stack); });
errorHandler.onInternalError(function (int) { return console.log(int); });
// Once wer-reporter is running, stop the process for listening for uncaughtExceptions.
StubMain_1.removeExceptionHandler();
// add telemtry reporter
var TelemetryReporter_1 = require("../lib/TelemetryReporter");
if (!isDevBuild) {
    var telemReport = new TelemetryReporter_1.TelemetryReporter(telemetry, TelemetryEventNames.APPLICATION_CRASH, appRunOperation);
    errorHandler.addReportingChannel(telemReport);
}
// If running in electron prebuilt, set the ServiceHub controller executable path
// to this process module path.
// Note: this must be done before requiring ServiceHub modules.
if (appExePath.includes("electron")) {
    var serviceHubConfigPath = path.join(path.dirname(__dirname), "servicehub.config.json");
    /* tslint:disable */
    var serviceHubConfig = require(serviceHubConfigPath);
    /* tslint:enable */
    serviceHubConfig.controller.executable = appExePath;
    fs.writeFileSync(serviceHubConfigPath, JSON.stringify(serviceHubConfig, null, 2));
}
// localization
var ResourceStrings_1 = require("../lib/ResourceStrings");
var locale_handler_1 = require("../lib/locale-handler");
var browser_window_telemetry_1 = require("./Telemetry/browser-window-telemetry");
var BrowserWindowEventSenderAdapter_1 = require("../lib/EventSender/BrowserWindowEventSenderAdapter");
var HostUpdater_1 = require("./HostUpdater");
var HostUpdaterTelemetry_1 = require("./HostUpdaterTelemetry");
var HostUpdaterEvents_1 = require("./HostUpdaterEvents");
var HostUpdaterService_1 = require("./HostUpdaterService");
var InstallerServiceEvents_1 = require("./InstallerServiceEvents");
var windowManager = require("./WindowManager");
var HostInstaller = require("./WindowsInstaller");
var FeedbackManagerFactory_1 = require("./FeedbackManagerFactory");
var telemetry_filter_1 = require("../lib/Installer/telemetry/telemetry-filter");
var InstallerTelemetryDecorator_1 = require("../lib/Installer/InstallerTelemetryDecorator");
var InstallerService_1 = require("./Installer/InstallerService");
var TelemetryAssetManager_1 = require("../lib/Telemetry/TelemetryAssetManager");
var setup_engine_adapter_factory_1 = require("./setup-engine-adapter-factory");
var ipc_rpc_factory_1 = require("./ipc-rpc-factory");
var progress_bar_service_1 = require("./progress-bar/progress-bar-service");
var bootstrapper_communicator_1 = require("../lib/bootstrapper-communicator/bootstrapper-communicator");
var installerTelemetryDecorator;
function createSetupEngineAdapter(progressBar, locale, serializedTelemetrySession, installerOperation, campaign, bootstrapperCommunicator) {
    // The exe version is used to detect updates. During development,
    // checking for updates is undesired. Typically, a true release version
    // looks like "x.y.build.qfe", otherwise the version is "x.y.z".
    // Passing null for version skips checking for updates.
    var exeVersionParts = package_1.EXE_VERSION.split(".");
    var ignoreEngineUpdates = exeVersionParts.length <= 3;
    var setupEngineAdapter = setup_engine_adapter_factory_1.SetupEngineAdapterFactory.getSetupEngineAdapter(progressBar, locale, serializedTelemetrySession, installerOperation, campaign, appExePath, ignoreEngineUpdates, bootstrapperCommunicator, argv);
    // Update the setup engine policy if requested on the command line.
    var noWeb = undefined;
    if (argv.noWeb) {
        telemetry.setCommonProperty("NoWeb", "true");
        noWeb = true;
    }
    var force = undefined;
    if (argv.force) {
        telemetry.setCommonProperty("Force", "true");
        force = true;
    }
    var cache = undefined;
    if (argv.cache) {
        cache = true;
    }
    else if (argv.nocache) {
        cache = false;
    }
    if (typeof cache === "boolean" || typeof noWeb === "boolean" || typeof force === "boolean") {
        return setupEngineAdapter.getSettings()
            .then(function (settings) {
            if (typeof cache === "boolean") {
                settings.keepDownloadedPayloads = cache;
            }
            if (typeof noWeb === "boolean") {
                settings.noWeb = noWeb;
            }
            if (typeof force === "boolean") {
                settings.force = force;
            }
            return setupEngineAdapter.setSettings(settings);
        })
            .then(function () {
            return setupEngineAdapter;
        });
    }
    else {
        return Promise.resolve(setupEngineAdapter);
    }
}
function createInstallerService(sessionId, installer) {
    var installerWithTelemetry = new InstallerTelemetryDecorator_1.InstallerTelemetryDecorator(installer, telemetry_filter_1.getInstallerTelemetry(), sessionId, argv.installSessionId);
    return {
        installer: installer,
        installerService: new InstallerService_1.InstallerService(installerWithTelemetry),
        installerTelemetryDecorator: installerWithTelemetry
    };
}
if (argv && !argv.runOnce) {
    HostInstaller.eventEmitter.on(HostInstaller.FINALIZE_INSTALL_FAILED, function (error) {
        var fault = telemetry.postError(TelemetryEventNames.APPLICATION_FINALIZE_FAILED, "finalize install failed", new bucket_parameters_1.BucketParameters("HostInstaller.on(" + HostInstaller.FINALIZE_INSTALL_FAILED + ")", moduleName), error, {}, vs_telemetry_api_1.TelemetrySeverity.High);
        appRunOperation.correlate(fault);
    });
    var installerOperation_1 = HostInstaller.processArguments(process.argv);
    (function startup() {
        var isInstalling = false;
        // We cache the locale after ready for use with windowManager.handleIncomingArgs
        var locale;
        // Keep a list of arguments passed from other instances
        var incomingArgs = [];
        // callback will be called when a new instance attempts to start
        var isAnotherInstanceRunning = electron_1.app.makeSingleInstance(function (args, workingDirectory) {
            var otherInstanceIsUninstalling = HostInstaller.hasUninstallParameter(args);
            // don't focus this instance's main window if the other instance is performing an uninstall
            if (!otherInstanceIsUninstalling) {
                var processArgsResult = argumentPreprocessor.tryProcess(args);
                var isIncomingDevBuild = dev_build_preprocessor_1.DevBuildPreprocessor.isDevBuild(args);
                var parseResult = commandLineParser.tryParse(processArgsResult.args, isIncomingDevBuild);
                if (parseResult.error) {
                    logger.writeError("Failed to parse new arguments");
                }
                else {
                    var incomingArgv = parseResult.argv;
                    incomingArgs.push(incomingArgv);
                    // If a second instance is opened while the first instance's window has not yet loaded,
                    // ignore the input from the second instance and let the first instance load. The first
                    // instance window must be loaded before we can handle the input of other instances, or
                    // the installer will crash.
                    if (!mainWindow) {
                        return;
                    }
                    // If the current client instance is uninstalling, warn the user.
                    if (installerOperation_1 === HostInstaller.InstallerOperation.Uninstalling) {
                        electron_1.dialog.showErrorBox(ResourceStrings_1.ResourceStrings.installerRunning(package_1.APPLICATION_NAME), ResourceStrings_1.ResourceStrings.pleaseWaitUntilOperationFinished);
                    }
                    else {
                        var dataStore = user_data_store_factory_1.getUserDataStore();
                        if (!isInstalling && incomingArgv.campaign && incomingArgv.campaign !== dataStore.campaign) {
                            var originalCampaign = dataStore.campaign;
                            // Update the campaign in the data store.
                            dataStore.storeCampaign(incomingArgv.campaign);
                            // Update the shared property.
                            telemetry.setCommonProperty(CommandLine_1.OptionNames.campaign, incomingArgv.campaign);
                            // Post an event notifying of the campaign switch.
                            telemetry.postOperation(TelemetryEventNames.UPDATE_CAMPAIGN, vs_telemetry_api_1.TelemetryResult.Success, "The campaign ID is being updated on relaunch", {
                                previousCampaign: originalCampaign,
                                newCampaign: incomingArgv.campaign,
                            });
                        }
                        if (incomingArgv.command) {
                            var queryParameters = commandLineParser.computeQueryParameters(incomingArgv);
                            var setupEngineAdapter = setup_engine_adapter_factory_1.SetupEngineAdapterFactory.getSetupEngineAdapter(mainWindow.progressBar, locale, null, installerOperation_1, null, appExePath, null, bootstrapperCommunicator, argv);
                            setupEngineAdapter.addChannel(incomingArgv.channelUri, incomingArgv.installChannelUri, incomingArgv.installCatalogUri)
                                .catch(function (error) {
                                logger.writeError("Error while adding channel. Message: " + error.message);
                            });
                            if (queryParameters) {
                                windowManager.handleIncomingArgs(package_1.BRANCH_NAME, locale, queryParameters);
                                var message = "Relaunching the application with new commands. " +
                                    ("Args: " + JSON.stringify(args));
                                logger.writeVerbose(message);
                                var properties = Telemetry_1.buildAppLaunchTelemetryProperties(incomingArgv, logger);
                                telemetry.postOperation(TelemetryEventNames.RELAUNCH_WINDOW, vs_telemetry_api_1.TelemetryResult.Success, message, properties);
                            }
                        }
                    }
                }
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }
                mainWindow.focus();
            }
        });
        // isAnotherInstanceRunning will be true if there is already a main instance running
        // close this instance unless uninstalling
        if (isAnotherInstanceRunning && (installerOperation_1 !== HostInstaller.InstallerOperation.Uninstalling)) {
            var communicator = new bootstrapper_communicator_1.BootstrapperCommunicator(null, logger, argv.pipe, argv.quiet, !!argv.command);
            communicator.dismiss();
            // Indicate that we've handed off this instances command line options to the main instance of Willow
            var properties = { ResultDetails: TelemetryEventNames.APPLICATION_SHUTDOWN_PARAMETERS_FORWARDED };
            EndAppRunTelemetryEvent(vs_telemetry_api_1.TelemetryResult.Success, properties);
            electron_1.app.quit();
            return;
        }
        // Normal app launch:
        var hostUpdater;
        var hostUpdaterService;
        var installerService;
        var mainWindow;
        var bootstrapperCommunicator;
        var telemetryService = telemetryFactory.createRendererTelemetryListener();
        var appCleanupPromise;
        function appCleanup() {
            if (appCleanupPromise) {
                return appCleanupPromise;
            }
            // Hide all windows before cleaning up resources and flushing telemetry
            windowManager.hideAllWindows();
            // Release the single instance so other instances can start up while we clean up this instance
            electron_1.app.releaseSingleInstance();
            if (telemetryService) {
                telemetryService.dispose();
            }
            EndAppRunTelemetryEvent(vs_telemetry_api_1.TelemetryResult.None);
            var installerServiceDisposePromise = installerService ?
                installerService.dispose() :
                Promise.resolve();
            var telemetrySendPendingDataPromise = installerServiceDisposePromise
                .then(function () { return telemetry.finalizeOperationsAndSendPendingData(); });
            var timeoutPromise = new Promise(function (resolve, reject) {
                var timeoutError = new Error("Timed out during application cleanup.");
                setTimeout(function () { return reject(timeoutError); }, APPLICATION_SHUTDOWN_TIMEOUT_IN_MS);
            });
            var userData = user_data_store_factory_1.getUserDataStore();
            appCleanupPromise = Promise.race([telemetrySendPendingDataPromise, timeoutPromise]);
            return appCleanupPromise
                .catch(function (err) { return logger.writeError("App cleanup rejected with an error: " + err.message); })
                .then(function () { return userData.clearTelemetrySessionId(); });
        }
        electron_1.app.on("ready", function () {
            telemetry.postOperation(TelemetryEventNames.APPLICATION_READY, vs_telemetry_api_1.TelemetryResult.Success, null, applicationInitializationDurationProperties());
            logger.writeVerbose("Received the application ready notification");
            // fetch or create local user data
            // Note: This must be created after the "Ready" event.
            var userData = user_data_store_factory_1.getUserDataStore();
            // Create Window as early as possible.
            var mainReadyPromiseSource = new promise_completion_source_1.PromiseCompletionSource();
            // If running from the electron prebuilt, simply pass the electron path
            // else use the path to the vs_installer.exe
            var relaunchCommand = appExePath.includes("electron") ?
                appExePath : path.join(path.dirname(appExePath), appExeName);
            var windowType = browser_window_1.WindowType.Default;
            if (installerOperation_1 === HostInstaller.InstallerOperation.Uninstalling) {
                windowType = browser_window_1.WindowType.Uninstall;
                relaunchCommand = relaunchCommand + " /" + CommandLine_1.CommandNames.uninstall;
            }
            else if (argv.focusedUi) {
                windowType = browser_window_1.WindowType.FocusedUi;
            }
            locale = locale_handler_1.LocaleHandler.getSupportedLocale(argv.locale || userData.locale);
            var queryOptions = windowManager.createQueryOptions(package_1.BRANCH_NAME, locale, userData.showDownlevelSkus, isAnotherInstanceRunning);
            var windowTelemetry = new browser_window_telemetry_1.BrowserWindowTelemetry(telemetry, logger);
            // Sets the App User Model ID for the main process.
            electron_1.app.setAppUserModelId(windowManager.appUserModelID);
            var isHidden = argv.quiet || !!argv.pipe;
            mainWindow = windowManager.init(windowType, queryOptions, isHidden, mainReadyPromiseSource.promise, windowTelemetry, commandLineParser.computeQueryParameters(argv), relaunchCommand);
            // End of window creation
            bootstrapperCommunicator = new bootstrapper_communicator_1.BootstrapperCommunicator(mainWindow, logger, argv.pipe, argv.quiet, !!argv.command);
            if (!argv.quiet && argv.pipe) {
                // Timeout to always show the window if it is hidden from the pipe argument.
                // This is covering the scenario where we take too long to load or we fail to connect to the pipe.
                setTimeout(function () {
                    if (!bootstrapperCommunicator.isDismissed) {
                        bootstrapperCommunicator.dismiss();
                    }
                    // If the window is still not visible, show it
                    if (!mainWindow.isVisible) {
                        mainWindow.show();
                    }
                }, WINDOW_HIDDEN_TIMEOUT_IN_MS);
            }
            var _progressBarService = new progress_bar_service_1.ProgressBarService(electron_1.ipcMain, "progress-bar", logger, mainWindow.progressBar);
            // Monitor for suspend/resume
            electron_1.powerMonitor.on("suspend", function () {
                var message = "System is suspending";
                logger.writeVerbose(message);
                telemetry.postUserTask(TelemetryEventNames.SYSTEM_SUSPEND, vs_telemetry_api_1.TelemetryResult.Success, message, {} /* no properties */);
            });
            electron_1.powerMonitor.on("resume", function () {
                var message = "System is resuming";
                logger.writeVerbose(message);
                telemetry.postUserTask(TelemetryEventNames.SYSTEM_RESUME, vs_telemetry_api_1.TelemetryResult.Success, message, {} /* no properties */);
            });
            // Overwrite default locale if locale is given as cmdline parameter.
            if (argv.locale) {
                userData.storeLocale(locale);
            }
            // Update campaign Id from argument.
            if (argv.campaign) {
                userData.storeCampaign(argv.campaign);
            }
            if (userData.campaign) {
                telemetry.setCommonProperty(CommandLine_1.OptionNames.campaign, userData.campaign);
            }
            // Set the shared property so locale is sent with every telemetry event
            var localeTelemetryPropertyName = "locale";
            telemetry.setCommonProperty(localeTelemetryPropertyName, locale);
            if (userData.previousSessionId) {
                var abnormalShutdownSessionProperty = "abnormalShutdownSession";
                telemetry.setCommonProperty(abnormalShutdownSessionProperty, userData.previousSessionId);
                telemetry.postOperation(TelemetryEventNames.ABNORMAL_SHUTDOWN_DETECTED, vs_telemetry_api_1.TelemetryResult.Success, "An abnormal shutdown was detected from the previous telemetry session", { abnormalShutdownSession: userData.previousSessionId });
            }
            ResourceStrings_1.ResourceStrings.config(userData.locale, true);
            var serviceInitTelemetryScope = telemetry.startOperation(TelemetryEventNames.APPLICATION_SERVICE_INITIALIZE, applicationInitializationDurationProperties());
            var vsTelemetryListener = telemetryFactory.createVsTelemetryListener();
            // create the logger service
            ipc_rpc_factory_1.createLoggerIpcRpcService(logger);
            Promise.all([
                vsTelemetryListener.sessionId(),
                vsTelemetryListener.serializedSession(),
                // Start Features Ipc Channel
                ipc_rpc_factory_1.getFeaturesIpcRpcService(package_1.EXE_NAME, package_1.EXE_VERSION, vsTelemetryListener),
            ])
                .then(function (results) {
                var sessionId = results[0];
                var serializedTelemetrySession = results[1];
                logSessionId(sessionId);
                userData.storeTelemetrySessionId(sessionId);
                return createSetupEngineAdapter(mainWindow.progressBar, userData.locale, serializedTelemetrySession, installerOperation_1, userData.campaign, bootstrapperCommunicator)
                    .then(function (setupEngineAdapter) {
                    return createInstallerService(sessionId, setupEngineAdapter);
                });
            })
                .then(function (installerServices) {
                installerTelemetryDecorator = installerServices.installerTelemetryDecorator;
                installerService = installerServices.installerService;
                // Setup listener for installing/finishing.
                installerServices.installer.onNotification(function (installPath, message) {
                    if (message.IsInstallStartingEvent()) {
                        isInstalling = true;
                    }
                    if (message.IsInstallFinishedEvent()) {
                        isInstalling = false;
                    }
                });
                FeedbackManagerFactory_1.createFeedbackManager(telemetryFactory.createVsTelemetryListener(), installerServices.installer, package_1.EXE_NAME, package_1.EXE_VERSION, package_1.BRANCH_NAME, electron_1.app.getLocale(), userData.locale);
                ipc_rpc_factory_1.getFeedbackIpcRpcService(telemetryFactory.createVsTelemetryListener(), electron_1.app.getLocale(), userData.locale, package_1.BRANCH_NAME, package_1.EXE_NAME, package_1.EXE_VERSION);
                if (installerOperation_1 !== HostInstaller.InstallerOperation.Uninstalling) {
                    // start the Host Updater
                    var bootstrapperArguments = process.argv.slice(1); // do not include the program name
                    var setupEngineAdapter = installerServices.installer;
                    hostUpdater = HostUpdater_1.create(setupEngineAdapter, bootstrapperArguments, HostInstaller.getInstallerFinalizeInstallParameter());
                    /* tslint:disable:no-unused-expression */
                    new HostUpdaterTelemetry_1.HostUpdaterTelemetry(hostUpdater, telemetry);
                    /* tslint:enable */
                    // Create shortcuts
                    if (installerOperation_1 === HostInstaller.InstallerOperation.FinalizedInstall) {
                        var directoryPath = path.dirname(electron_1.app.getPath("exe"));
                        var targetPath = path.join(directoryPath, appExeName);
                        setupEngineAdapter.createStartMenuShortcut(package_1.APPLICATION_NAME, targetPath)
                            .catch(function (error) {
                            logger.writeError("Create shortcut failed: " + error.message);
                            var err = telemetry.postError(TelemetryEventNames.CREATE_SHORTCUT_FAILED, error.message, new bucket_parameters_1.BucketParameters("createStartMenuShortcut", moduleName), error, {}, vs_telemetry_api_1.TelemetrySeverity.High);
                            appRunOperation.correlate(err);
                        });
                    }
                    hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_STARTING, function (event) {
                        var properties = { ResultDetails: HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_STARTING };
                        EndAppRunTelemetryEvent(vs_telemetry_api_1.TelemetryResult.Success, properties);
                        event.deferrals.push(appCleanup().catch(function (error) {
                            // failing to clean up the application must not block starting the update
                            logger.writeError("Failed cleaning up the application " +
                                ("[error.name: " + error.name + ", error.message: " + error.message + "]"));
                        }));
                    });
                    hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_STARTED, function () {
                        electron_1.app.quit();
                    });
                    // if user.json has debug=true and we don't already have argv.debug=true,
                    // set argv.debug=true and recompute the query string
                    if (userData.debug && !argv.debug) {
                        argv.debug = true;
                    }
                    // Wire up the install manager
                    var eventSender = new BrowserWindowEventSenderAdapter_1.BrowserWindowEventSenderAdapter(electron_1.webContents);
                    installerService.init(eventSender);
                    if (hostUpdater != null) {
                        hostUpdaterService = new HostUpdaterService_1.HostUpdaterService(eventSender, hostUpdater);
                    }
                }
                else {
                    // we are Uninstalling xStation
                    telemetry.postUserTask(TelemetryEventNames.APPLICATION_UNINSTALL_SELF_REQUESTED, vs_telemetry_api_1.TelemetryResult.Success, "Beginning uninstallation");
                    electron_1.ipcMain.on(InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_REQUEST, function (source) {
                        source.sender.send(InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_STARTED);
                        telemetry.postOperation(TelemetryEventNames.APPLICATION_UNINSTALL_SELF, vs_telemetry_api_1.TelemetryResult.Success, "Beginning uninstallation");
                        installerServices.installer.deleteStartMenuShortcut(package_1.APPLICATION_NAME)
                            .catch(function (error) {
                            logger.writeError("Delete shortcut failed: " + error.message);
                            var err = telemetry.postError(TelemetryEventNames.DELETE_SHORTCUT_FAILED, error.message, new bucket_parameters_1.BucketParameters("deleteStartMenuShortcut", moduleName), error, {}, vs_telemetry_api_1.TelemetrySeverity.High);
                            appRunOperation.correlate(err);
                        });
                        installerServices.installerTelemetryDecorator
                            .uninstallAll().finally(function () { return HostInstaller.uninstall(!!argv.quiet || !!argv.passive); });
                        var properties = { ResultDetails: TelemetryEventNames.APPLICATION_UNINSTALL_SELF };
                        EndAppRunTelemetryEvent(vs_telemetry_api_1.TelemetryResult.Success, properties);
                        // forward uninstall failure back to renderer
                        HostInstaller.eventEmitter.on(HostInstaller.UNINSTALL_SELF_FAILED_EVENT, function (error) {
                            source.sender.send(InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_FAILED);
                            var methodName = "HostInstaller.on(" + HostInstaller.UNINSTALL_SELF_FAILED_EVENT + ")";
                            var err = telemetry.postError(TelemetryEventNames.APPLICATION_UNINSTALL_SELF_FAILED, "Failed to uninstall the installer", new bucket_parameters_1.BucketParameters(methodName, moduleName), error, {}, vs_telemetry_api_1.TelemetrySeverity.High);
                            appRunOperation.correlate(err);
                            var errorProps = { ResultDetails: InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_FAILED };
                            EndAppRunTelemetryEvent(vs_telemetry_api_1.TelemetryResult.Failure, errorProps);
                        });
                    });
                    // Wire up the install manager
                    var eventSender = new BrowserWindowEventSenderAdapter_1.BrowserWindowEventSenderAdapter(electron_1.webContents);
                    installerService.init(eventSender);
                    if (isAnotherInstanceRunning) {
                        setTimeout(checkIfSingletonAndReport, 1000);
                    }
                }
                logger.writeVerbose("Service creation finished");
                mainReadyPromiseSource.resolve(null);
                serviceInitTelemetryScope.end(vs_telemetry_api_1.TelemetryResult.Success, applicationInitializationDurationProperties());
            })
                .catch(function (error) {
                logger.writeError("Failed to initialize the app services. " +
                    ("[error: " + error.message + " at " + error.stack + "]"));
                var telemetryProps = Object.assign({
                    errorMessage: error.message,
                    errorStack: error.stack,
                }, applicationInitializationDurationProperties());
                serviceInitTelemetryScope.end(vs_telemetry_api_1.TelemetryResult.Failure, telemetryProps);
                appCleanup().finally(function () { return electron_1.app.exit(windowConstants.ERROR_INSTALL_FAILURE); });
            });
        });
        function checkIfSingletonAndReport() {
            if (isAnotherInstanceRunning) {
                isAnotherInstanceRunning = electron_1.app.makeSingleInstance(function () { return true; });
            }
            // send the is-singleton status to the renderer
            // it is important to check the webContents member before sending the message;
            // webContents becomes undefined if the user clicks 'cancel' in the uninstall window
            var eventSender = new BrowserWindowEventSenderAdapter_1.BrowserWindowEventSenderAdapter(electron_1.webContents);
            eventSender.trySend(InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_IS_SINGLETON, !isAnotherInstanceRunning);
            if (isAnotherInstanceRunning) {
                setTimeout(checkIfSingletonAndReport, 1000);
            }
        }
        electron_1.ipcMain.on(windowConstants.MINIMIZE_WINDOW, function () {
            windowManager.minimize();
        });
        var quitting = false;
        electron_1.app.on("will-quit", function (event) {
            if (!quitting) {
                quitting = true;
                event.preventDefault();
                var appQuit_1 = electron_1.app.quit;
                electron_1.app.quit = function () { };
                appCleanup().finally(function () { return setImmediate(appQuit_1); });
            }
        });
        electron_1.ipcMain.on(windowConstants.MAXIMIZE_RESTORE_WINDOW, function () {
            windowManager.maximizeOrRestore();
        });
        electron_1.ipcMain.on(windowConstants.WINDOW_STATE_REQUEST, function (event) {
            var browserWindow = electron_1.BrowserWindow.fromWebContents(event.sender);
            if (!browserWindow || browserWindow.isDestroyed()) {
                return;
            }
            var isMaximized = browserWindow.isMaximized();
            event.sender.send(windowConstants.WINDOW_STATE_RESPONSE, { maximized: isMaximized });
        });
        electron_1.ipcMain.on(windowConstants.CLOSE_WINDOW, function (event, exitDetails) {
            var returnCode = exitDetails.exitCode;
            var errorMessage = exitDetails.errorMessage;
            var result = returnCode === 0 ? vs_telemetry_api_1.TelemetryResult.Success : vs_telemetry_api_1.TelemetryResult.Failure;
            if (errorMessage) {
                logger.writeError(errorMessage);
            }
            var properties = {
                ResultDetails: windowConstants.CLOSE_WINDOW,
                ReturnCode: returnCode,
                ErrorCode: exitDetails.errorCode
            };
            EndAppRunTelemetryEvent(result, properties);
            logger.writeVerbose("Closing installer. Return code: " + returnCode + ".");
            appCleanup().finally(function () {
                if (returnCode === windowConstants.EXIT_CODE_REBOOT_REQUESTED) {
                    logger.writeVerbose("Restarting the system after an installation operation.");
                    ShutdownUtilities_1.restartWindows();
                }
                electron_1.app.exit(returnCode);
            });
        });
        electron_1.ipcMain.on("browse-dialog", function (event, browsePath) {
            var filenames = electron_1.dialog.showOpenDialog({
                defaultPath: browsePath,
                properties: ["openDirectory", "createDirectory"]
            });
            if (!filenames) {
                filenames = [];
            }
            event.returnValue = filenames;
        });
        electron_1.ipcMain.on(leak_detector_1.LeakDetector.leakDetectedEvent, function (event, info) {
            onLeakDetected(info);
        });
        function EndAppRunTelemetryEvent(result, properties) {
            if (!properties) {
                properties = {};
            }
            if (incomingArgs.length > 0) {
                var numberOfRelaunches = "numberOfRelaunches";
                properties[numberOfRelaunches] = incomingArgs.length;
            }
            if (appRunOperation.isEnded === false) {
                try {
                    if (installerTelemetryDecorator) {
                        installerTelemetryDecorator.addProductAssetsToEventProperties(properties, TelemetryAssetManager_1.AssetTypes.All);
                    }
                    appRunOperation.end(result, properties);
                }
                catch (error) {
                    // failing to send telemetry must not block starting the update
                    logger.writeError("Failed ending application run operation telemetry " +
                        ("[error.name: " + error.name + ", error.message: " + error.message + "]"));
                }
            }
        }
    })();
}
function logSessionId(sessionId) {
    logger.writeVerbose("Telemetry Session ID: " + sessionId);
}
//# sourceMappingURL=Main.js.map