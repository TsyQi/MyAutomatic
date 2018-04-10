/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_external_1 = require("../../lib/open-external");
var cancel_requested_event_1 = require("../Events/cancel-requested-event");
var deep_clean_preview_installations_events_1 = require("../Events/deep-clean-preview-installations-events");
var evaluate_install_parameters_events_1 = require("../Events/evaluate-install-parameters-events");
var Errors = require("../../lib/errors");
var dispatcher_1 = require("../dispatcher");
var ElevationRequiredEvent_1 = require("../Events/ElevationRequiredEvent");
var get_channel_info_finished_event_1 = require("../Events/get-channel-info-finished-event");
var get_summaries_finished_event_1 = require("../Events/get-summaries-finished-event");
var Product_1 = require("../../lib/Installer/Product");
var open_feedback_client_action_1 = require("./open-feedback-client-action");
var open_log_failed_event_1 = require("../Events/open-log-failed-event");
var operation_parameters_1 = require("../../lib/Installer/operation-parameters");
var show_install_retry_event_1 = require("../Events/show-install-retry-event");
var show_report_feedback_event_1 = require("../Events/show-report-feedback-event");
var factory_1 = require("../Installer/factory");
var installer_message_received_event_1 = require("../Events/installer-message-received-event");
var installer_notification_received_event_1 = require("../Events/installer-notification-received-event");
var InstallFinishedEvent_1 = require("../Events/InstallFinishedEvent");
var InstallProgressEvent_1 = require("../Events/InstallProgressEvent");
var reboot_timing_1 = require("../interfaces/reboot-timing");
var installer_status_changed_event_1 = require("../Events/installer-status-changed-event");
var InstallStartedEvent_1 = require("../Events/InstallStartedEvent");
var ModifyFinishedEvent_1 = require("../Events/ModifyFinishedEvent");
var ModifyStartedEvent_1 = require("../Events/ModifyStartedEvent");
var open_external_2 = require("../../lib/open-external");
var OperationFailedEvent_1 = require("../Events/OperationFailedEvent");
var promise_completion_source_1 = require("../../lib/promise-completion-source");
var promise_scheduler_1 = require("../../lib/promise-scheduler");
var RepairFinishedEvent_1 = require("../Events/RepairFinishedEvent");
var RepairStartedEvent_1 = require("../Events/RepairStartedEvent");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var app_store_telemetry_actions_1 = require("../actions/app-store-telemetry-actions");
var show_product_event_1 = require("../Events/show-product-event");
var UninstallFinishedEvent_1 = require("../Events/UninstallFinishedEvent");
var UninstallStartedEvent_1 = require("../Events/UninstallStartedEvent");
var update_finished_event_1 = require("../Events/update-finished-event");
var update_started_event_1 = require("../Events/update-started-event");
var factory_2 = require("./factory");
var telemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var remove_channel_finished_event_1 = require("../Events/remove-channel-finished-event");
var remove_channel_started_event_1 = require("../Events/remove-channel-started-event");
var errors_1 = require("../../lib/errors");
var bucket_parameters_1 = require("../../lib/Telemetry/bucket-parameters");
var progress_bar_proxy_1 = require("../progress-bar-proxy");
var CHECK_INSTALL_PARAMETERS_POLL_RATE = 5000;
var CHECK_INSTALL_PARAMETERS_POLL_RATE_WHEN_BLOCKING_PROCESS_IS_PRESENT = 1000;
var GET_CHANNELS_TIMEOUT_IN_MS = 180000; // 3 minutes
var evaluateParametersScheduler = new promise_scheduler_1.PromiseScheduler();
var installerStatus;
/**
 * Promise exposed for testing this file.
 * Once we are on Typescript 2 we can upgrade Sinon.js and use stub.callFake.
 *
 * ex: install = stub().callFake(() => promiseCompletionSource.resolve());
 * promiseCompletionSource.promise.then(() => {
 *      expect(true);
 * })
 */
exports.runningOperationPromise = null;
/* istanbul ignore next */
function showProduct(channelId, productId) {
    dispatcher_1.dispatcher.dispatch(new show_product_event_1.ShowProductEvent(channelId, productId));
}
exports.showProduct = showProduct;
function getProductSummaries(params) {
    // When isQuietOrPassive is true, we immediately quit, so no
    // need to refresh summaries. This would cause an exception.
    if (params && params.isQuietOrPassive) {
        return Promise.resolve();
    }
    var timeoutId;
    var productSummariesCache = null;
    var installedProductSummariesCache = null;
    // Send the request to get InstalledProductSummaries first.
    var getInstalledProducts = factory_1.installerProxy.getInstalledProductSummaries();
    getInstalledProducts
        .then(function (result) {
        installedProductSummariesCache = result.installedProductSummaries;
        var event = new get_summaries_finished_event_1.GetSummariesFinishedEvent(productSummariesCache, installedProductSummariesCache);
        dispatcher_1.dispatcher.dispatch(event);
    });
    var getProducts = factory_1.installerProxy.getProductSummaries();
    getProducts.then(function (productSummaries) {
        productSummariesCache = productSummaries;
        // Wait for installedProductSummaries to be received or failed, before dispatching new data.
        getInstalledProducts.finally(function () {
            // in the case that getInstalledProducts failed,
            // we still want to show installable products
            var event = new get_summaries_finished_event_1.GetSummariesFinishedEvent(productSummariesCache, installedProductSummariesCache || []);
            dispatcher_1.dispatcher.dispatch(event);
            clearTimeout(timeoutId);
        });
    });
    var timeoutPromise = new Promise(function (resolve, reject) {
        timeoutId = setTimeout(function () { return reject(new Error(ResourceStrings_1.ResourceStrings.notConnected)); }, GET_CHANNELS_TIMEOUT_IN_MS);
    });
    // The pending get product promises may complete sometime after the timeout. In that case,
    // the UI will render the completed query w/o requiring the user to retry.
    return Promise.race([timeoutPromise, getProducts, getInstalledProducts]).catch(function (error) {
        var event;
        var timedOut = true;
        if (error.message === ResourceStrings_1.ResourceStrings.notConnected) {
            event = new get_summaries_finished_event_1.GetSummariesFinishedEvent(null, null, ResourceStrings_1.ResourceStrings.notConnected, timedOut);
        }
        else if (error instanceof Errors.ChannelManifestDownloadError) {
            // if the ChannelManifestDownloadError carries a message, use that;
            // otherwise use the generic "not connected" message
            var message = error.message || ResourceStrings_1.ResourceStrings.notConnected;
            event = new get_summaries_finished_event_1.GetSummariesFinishedEvent(null, null, message, !timedOut);
        }
        else if (error instanceof Errors.ServiceHubUnavailableError) {
            // To get more information, we will ask users to submit feedback when presented with this type of error.
            dispatcher_1.dispatcher.dispatch(show_report_feedback_event_1.ShowReportFeedbackEvent.CreateUnknownErrorEvent(function () {
                // Create tags to allow easier querying on backend.
                var feedbackTags = [];
                feedbackTags.push({
                    type: "service-hub",
                    value: error.message
                });
                var initialReproText = "*" + ResourceStrings_1.ResourceStrings.describeIssue + "*";
                open_feedback_client_action_1.openFeedbackClient([], error.message, initialReproText, feedbackTags);
            }));
        }
        if (!event) {
            event = new get_summaries_finished_event_1.GetSummariesFinishedEvent(null, null, ResourceStrings_1.ResourceStrings.genericErrorMessage, !timedOut);
        }
        clearTimeout(timeoutId);
        dispatcher_1.dispatcher.dispatch(event);
    });
}
exports.getProductSummaries = getProductSummaries;
/* istanbul ignore next */
function getChannelInfo() {
    var timeoutId;
    var getChannelInfoPromise = factory_1.installerProxy.getChannelInfo();
    getChannelInfoPromise.then(function (channelInfoList) {
        var event = new get_channel_info_finished_event_1.GetChannelInfoFinishedEvent(channelInfoList);
        dispatcher_1.dispatcher.dispatch(event);
        clearTimeout(timeoutId);
        app_store_telemetry_actions_1.sendChannelInfoTelemetry(channelInfoList.map(function (c) { return c.id; }));
    });
    var timeoutPromise = new Promise(function (resolve, reject) {
        timeoutId = setTimeout(function () { return reject(new Error("getChannelInfo call timed out. Timeout in ms: " + GET_CHANNELS_TIMEOUT_IN_MS)); }, GET_CHANNELS_TIMEOUT_IN_MS);
    });
    Promise.race([timeoutPromise, getChannelInfoPromise]).catch(function (error) {
        dispatcher_1.dispatcher.dispatch(new get_channel_info_finished_event_1.GetChannelInfoFinishedEvent(null));
    });
}
exports.getChannelInfo = getChannelInfo;
/* istanbul ignore next */
function removeChannel(channelId) {
    var timeoutId;
    dispatcher_1.dispatcher.dispatch(new remove_channel_started_event_1.RemoveChannelStartedEvent(channelId));
    var removeChannelPromise = factory_1.installerProxy.removeChannel(channelId);
    removeChannelPromise.then(function (productSummaries) {
        var event = new remove_channel_finished_event_1.RemoveChannelFinishedEvent(productSummaries, null, false);
        dispatcher_1.dispatcher.dispatch(event);
        clearTimeout(timeoutId);
    });
    var timeoutPromise = new Promise(function (resolve, reject) {
        timeoutId = setTimeout(function () { return reject(new Error("removeChannel call timed out. Timeout in ms: " + GET_CHANNELS_TIMEOUT_IN_MS)); }, GET_CHANNELS_TIMEOUT_IN_MS);
    });
    Promise.race([timeoutPromise, removeChannelPromise]).catch(function (error) {
        dispatcher_1.dispatcher.dispatch(new remove_channel_finished_event_1.RemoveChannelFinishedEvent(null));
    });
}
exports.removeChannel = removeChannel;
function checkProcessElevation() {
    var serviceHubAvailable = true;
    /* istanbul ignore next */
    exports.runningOperationPromise = factory_1.installerProxy.isElevated()
        .catch(function (error) {
        if (error instanceof Errors.ServiceHubUnavailableError) {
            serviceHubAvailable = false;
        }
        return false;
    })
        .then(function (result) {
        if (!result && serviceHubAvailable) {
            dispatcher_1.dispatcher.dispatch(new ElevationRequiredEvent_1.ElevationRequiredEvent());
            app_store_telemetry_actions_1.sendElevationRequiredTelemetry();
        }
    });
}
exports.checkProcessElevation = checkProcessElevation;
/* istanbul ignore next */
function resetFailureAndProgress(installationPath) {
    dispatcher_1.dispatcher.dispatch(new InstallProgressEvent_1.InstallProgressEvent(installationPath, Product_1.ProgressType.Install, null, null, null));
}
exports.resetFailureAndProgress = resetFailureAndProgress;
/* istanbul ignore next */
function rebootTimingFromInstallOperationResult(result) {
    switch (result.rebootRequired) {
        default:
        case Product_1.RebootType.None:
            return reboot_timing_1.RebootTiming.None;
        case Product_1.RebootType.FinalReboot:
            return reboot_timing_1.RebootTiming.AfterInstall;
        case Product_1.RebootType.IntermediateReboot:
        case Product_1.RebootType.FinalizerReboot:
            return reboot_timing_1.RebootTiming.DuringInstall;
    }
}
function install(product, params, nickname, installationPath, layoutPath, productKey) {
    resetFailureAndProgress(installationPath);
    startProgressTimer(installationPath);
    var operation = "install";
    params.telemetryContext = ensureTelemetryContext(params.telemetryContext, operation);
    dispatcher_1.dispatcher.dispatch(new InstallStartedEvent_1.InstallStartedEvent(product, nickname, installationPath));
    // trim install path to be the path we pass setup engine
    installationPath = installationPath.trim();
    var installParameters = new operation_parameters_1.InstallParameters(product, nickname, installationPath, layoutPath, productKey, params.additionalOptions);
    /* istanbul ignore next */
    exports.runningOperationPromise = factory_1.installerProxy.install(installParameters, params.telemetryContext)
        .then(function (result) {
        handleOperationFinished(result);
        var success = result.isSuccess;
        var log = result.log;
        var rebootTiming = rebootTimingFromInstallOperationResult(result);
        var finalProduct = result.product || product; // use the final product if we have it.
        var finishedEvent = new InstallFinishedEvent_1.InstallFinishedEvent(finalProduct, nickname, installationPath, success, log, rebootTiming);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    }, function (error) {
        handleOperationError(error, function () {
            install(product, params, nickname, installationPath, layoutPath, productKey);
        });
        var success = false;
        var log = error.log || "";
        var finishedEvent = new InstallFinishedEvent_1.InstallFinishedEvent(product, nickname, installationPath, success, log);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    });
}
exports.install = install;
function handleOperationFinished(result) {
    // We have a core failure, not just a warning. Show the failure dialog.
    if (result.isFailure) {
        tryShowPackageFailures(result.error, result.product, result.log);
    }
    operationFinishedCommon();
}
function handleOperationError(error, retryAction) {
    operationFinishedCommon();
    // show retry dialog for channels locked exception
    if (error instanceof Errors.ChannelsLockedError) {
        dispatcher_1.dispatcher.dispatch(show_install_retry_event_1.ShowInstallRetryEvent.CreateChannelsLockedRetryEvent(retryAction));
        return;
    }
    if (Errors.isUnderlyingStreamHasClosedError(error)) {
        var initialReproText_1 = "*" + ResourceStrings_1.ResourceStrings.describeIssue + "*";
        dispatcher_1.dispatcher.dispatch(show_report_feedback_event_1.ShowReportFeedbackEvent.CreateReportStreamClosedEvent(function () {
            open_feedback_client_action_1.openFeedbackClient([], error.message, initialReproText_1);
        }));
        return;
    }
    // If the error has a localized message, display an error dialog with it
    if (error instanceof errors_1.CustomErrorBase && error.hasLocalizedMessage) {
        var options = {
            error: error.localizedMessage,
            link: {
                text: ResourceStrings_1.ResourceStrings.viewLog,
                callback: function () { return openLog(error.log); },
            },
            errorName: error.name,
            title: ResourceStrings_1.ResourceStrings.somethingWentWrong,
        };
        dispatcher_1.dispatcher.dispatch(new OperationFailedEvent_1.OperationFailedEvent(options));
        return;
    }
    // The error has no localized message and is not special cased, so show package failure dialog.
    tryShowPackageFailures(error, null, null);
}
function tryShowPackageFailures(error, installedProduct, logPath) {
    // On OperationCanceledError don't do anything
    if (Errors.isOperationCanceledError(error)) {
        return;
    }
    // If a product is provided, but no errors are detected, don't show
    // a failure dialog.
    if (installedProduct && !installedProduct.hasErrors) {
        return;
    }
    var customError = error;
    var log = logPath || (customError && customError.log);
    factory_2.viewProblemsActions.viewProblems(installedProduct, log);
}
function uninstall(product, params) {
    resetFailureAndProgress(product.installationPath);
    startProgressTimer(product.installationPath);
    var operation = "uninstall";
    params.telemetryContext = ensureTelemetryContext(params.telemetryContext, operation);
    dispatcher_1.dispatcher.dispatch(new UninstallStartedEvent_1.UninstallStartedEvent(product));
    var parameters = new operation_parameters_1.UninstallParameters(product);
    /* istanbul ignore next */
    exports.runningOperationPromise = factory_1.installerProxy.uninstall(parameters, params.telemetryContext)
        .then(function () {
        dispatcher_1.dispatcher.dispatch(new UninstallFinishedEvent_1.UninstallFinishedEvent(product, product.nickname, product.installationPath));
        getProductSummaries(params);
        operationFinishedCommon();
    }, function (error) {
        handleOperationError(error, function () {
            uninstall(product, params);
        });
        var success = false;
        var log = error.log || "";
        var finishedEvent = new UninstallFinishedEvent_1.UninstallFinishedEvent(product, product.nickname, product.installationPath, success, log);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    });
}
exports.uninstall = uninstall;
function update(product, params, productKey, updateFromVS, layoutPath) {
    resetFailureAndProgress(product.installationPath);
    startProgressTimer(product.installationPath);
    var operation = "update";
    params.telemetryContext = ensureTelemetryContext(params.telemetryContext, operation);
    dispatcher_1.dispatcher.dispatch(new update_started_event_1.UpdateStartedEvent(product));
    // the product isn't running, go ahead and update it
    var parameters = new operation_parameters_1.UpdateParameters(product, layoutPath, productKey, params.additionalOptions, updateFromVS);
    /* istanbul ignore next */
    exports.runningOperationPromise = factory_1.installerProxy.update(parameters, params.telemetryContext)
        .then(function (result) {
        handleOperationFinished(result);
        var success = result.isSuccess;
        var log = result.log;
        var rebootTiming = rebootTimingFromInstallOperationResult(result);
        var finalProduct = result.product || product;
        var finishedEvent = new update_finished_event_1.UpdateFinishedEvent(finalProduct, finalProduct.nickname, finalProduct.installationPath, success, log, rebootTiming);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    }, function (error) {
        handleOperationError(error, function () {
            update(product, params, productKey, updateFromVS, layoutPath);
        });
        var success = false;
        var log = error.log || "";
        var finishedEvent = new update_finished_event_1.UpdateFinishedEvent(product, product.nickname, product.installationPath, success, log);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    });
}
exports.update = update;
function modify(product, params) {
    var desiredProduct = product.clone();
    resetFailureAndProgress(desiredProduct.installationPath);
    startProgressTimer(desiredProduct.installationPath);
    var operation = "modify";
    params.telemetryContext = ensureTelemetryContext(params.telemetryContext, operation);
    dispatcher_1.dispatcher.dispatch(new ModifyStartedEvent_1.ModifyStartedEvent(desiredProduct));
    var modifyParameters = new operation_parameters_1.ModifyParameters(product, false /* updateOnModify */, params.additionalOptions);
    /* istanbul ignore next */
    exports.runningOperationPromise = factory_1.installerProxy.modify(modifyParameters, params.telemetryContext)
        .then(function (result) {
        handleOperationFinished(result);
        var success = result.isSuccess;
        var log = result.log;
        var rebootTiming = rebootTimingFromInstallOperationResult(result);
        var finalProduct = result.product || desiredProduct; // use the final product if we have it.
        var finishedEvent = new ModifyFinishedEvent_1.ModifyFinishedEvent(finalProduct, finalProduct.nickname, finalProduct.installationPath, success, log, rebootTiming);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    }, function (error) {
        handleOperationError(error, function () {
            modify(product, params);
        });
        var success = false;
        var log = error.log || "";
        var finishedEvent = new ModifyFinishedEvent_1.ModifyFinishedEvent(product, product.nickname, product.installationPath, success, log);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    });
}
exports.modify = modify;
function repair(product, params) {
    resetFailureAndProgress(product.installationId);
    startProgressTimer(product.installationPath);
    var operation = "repair";
    params.telemetryContext = ensureTelemetryContext(params.telemetryContext, operation);
    dispatcher_1.dispatcher.dispatch(new RepairStartedEvent_1.RepairStartedEvent(product));
    var parameters = new operation_parameters_1.RepairParameters(product);
    /* istanbul ignore next */
    exports.runningOperationPromise = factory_1.installerProxy.repair(parameters, params.telemetryContext)
        .then(function (result) {
        handleOperationFinished(result);
        var success = result.isSuccess;
        var log = result.log;
        var rebootTiming = rebootTimingFromInstallOperationResult(result);
        var finalProduct = result.product || product; // use the final product if we have it.
        var finishedEvent = new RepairFinishedEvent_1.RepairFinishedEvent(finalProduct, finalProduct.nickname, finalProduct.installationPath, success, log, rebootTiming);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    }, function (error) {
        handleOperationError(error, function () {
            repair(product, params);
        });
        var success = false;
        var log = error.log || "";
        var finishedEvent = new RepairFinishedEvent_1.RepairFinishedEvent(product, product.nickname, product.installationPath, success, log);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    });
}
exports.repair = repair;
/* istanbul ignore next */
function resume(product, params) {
    resetFailureAndProgress(product.installationId);
    startProgressTimer(product.installationPath);
    var operation = "resume";
    params.telemetryContext = ensureTelemetryContext(params.telemetryContext, operation);
    dispatcher_1.dispatcher.dispatch(new RepairStartedEvent_1.RepairStartedEvent(product));
    var parameters = new operation_parameters_1.ResumeParameters(product);
    exports.runningOperationPromise = factory_1.installerProxy.resume(parameters, params.telemetryContext)
        .then(function (result) {
        var success = result.isSuccess;
        var log = result.log;
        var rebootTiming = rebootTimingFromInstallOperationResult(result);
        handleOperationFinished(result);
        var finalProduct = result.product || product; // use the final product if we have it.
        var finishedEvent = new RepairFinishedEvent_1.RepairFinishedEvent(finalProduct, finalProduct.nickname, finalProduct.installationPath, success, log, rebootTiming);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    }, function (error) {
        handleOperationError(error, function () {
            resume(product, params);
        });
        var success = false;
        var log = error.log || "";
        var finishedEvent = new RepairFinishedEvent_1.RepairFinishedEvent(product, product.nickname, product.installationPath, success, log);
        dispatcher_1.dispatcher.dispatch(finishedEvent);
        getProductSummaries(params);
    });
}
exports.resume = resume;
/* istanbul ignore next */
function deepCleanPreviewInstallations() {
    dispatcher_1.dispatcher.dispatch(new deep_clean_preview_installations_events_1.DeepCleanPreviewInstallationsStarted());
    factory_1.installerProxy.deepCleanPreviewInstallations()
        .finally(function () {
        dispatcher_1.dispatcher.dispatch(new deep_clean_preview_installations_events_1.DeepCleanPreviewInstallationsCompleted());
        getProductSummaries();
    });
}
exports.deepCleanPreviewInstallations = deepCleanPreviewInstallations;
/* istanbul ignore next */
factory_1.installerProxy.onProgress(dispatchProgressMessage);
/* istanbul ignore next */
factory_1.installerProxy.onNotification(dispatchNotification);
/* istanbul ignore next */
factory_1.installerProxy.setMessageHandler(handleMessage);
/* istanbul ignore next */
factory_1.installerProxy.onInstalledProductUpdateAvailable(onInstalledProductUpdateAvailable);
/* istanbul ignore next */
factory_1.installerProxy.onProductUpdateAvailable(onProductUpdateAvailable);
/* istanbul ignore next */
function dispatchProgressMessage(installationPath, type, percentComplete, detail, progressInfo) {
    // filter out progress messages with invalid percentComplete values to avoid jumping in the UX
    if (percentComplete >= 0) {
        var event_1 = new InstallProgressEvent_1.InstallProgressEvent(installationPath, type, percentComplete, detail, progressInfo);
        dispatcher_1.dispatcher.dispatch(event_1);
    }
}
/* istanbul ignore next */
function dispatchNotification(installPath, message) {
    dispatcher_1.dispatcher.dispatch(new installer_notification_received_event_1.InstallerNotificationReceivedEvent(installPath, message));
}
function handleMessage(installPath, message) {
    var promiseSource = new promise_completion_source_1.PromiseCompletionSource();
    // Listen for cancel and emit a cancel requested event.
    promiseSource.promise.then(function (result) {
        if (result.type === Product_1.MessageResultTypes.Cancel) {
            dispatcher_1.dispatcher.dispatch(new cancel_requested_event_1.CancelRequestedEvent(installPath));
        }
        return result;
    });
    var event = installer_message_received_event_1.InstallerMessageReceivedEvent.Create(installPath, message, promiseSource);
    dispatcher_1.dispatcher.dispatch(event);
    return promiseSource.promise;
}
/* istanbul ignore next */
function onProductUpdateAvailable() {
    getProductSummaries();
}
/* istanbul ignore next */
function onInstalledProductUpdateAvailable() {
    getProductSummaries();
}
/* istanbul ignore next */
/**
 * Evaluates the install parameters using a scheduler,
 * so that multiple rapid calls are dropped.
 */
function evaluateInstallParameters(product, nickname, installationPath, layoutPath, initiatedFromCommandLine, vsixs) {
    var installParameters = new operation_parameters_1.InstallParameters(product, nickname, installationPath, layoutPath, "" /*productKey*/, null /* not used for evaluation */);
    scheduleEvaluation(function () {
        if (product.selectedLanguages.length === 0) {
            return Promise.resolve(new Product_1.InstallParametersEvaluation(null, /* systemDriveEvaluation */ null, /* targetDriveEvaluation */ null, /* sharedDriveEvaluation */ ResourceStrings_1.ResourceStrings.selectALanguagePack));
        }
        return factory_1.installerProxy.evaluateInstallParameters(installParameters);
    });
}
exports.evaluateInstallParameters = evaluateInstallParameters;
/* istanbul ignore next */
/**
 * Evaluates the modify parameters. See evaluateInstallParameters.
 */
function evaluateModifyParameters(product, initiatedFromCommandLine, updateOnModify, vsixs) {
    var modifyParameters = new operation_parameters_1.ModifyParameters(product, updateOnModify, null /* not used for evaluation */);
    scheduleEvaluation(function () {
        if (product.selectedLanguages.length === 0) {
            return Promise.resolve(new Product_1.InstallParametersEvaluation(null, /* systemDriveEvaluation */ null, /* targetDriveEvaluation */ null, /* sharedDriveEvaluation */ ResourceStrings_1.ResourceStrings.selectALanguagePack));
        }
        return factory_1.installerProxy.evaluateModifyParameters(modifyParameters);
    });
}
exports.evaluateModifyParameters = evaluateModifyParameters;
/* istanbul ignore next */
/**
 * Schedules the evaluation on the {PromiseScheduler}, and ensures
 * that only one pending evaluation is scheduled, while one is already
 * in progress.
 */
function scheduleEvaluation(evaluationFunction) {
    // fire started event.
    dispatcher_1.dispatcher.dispatch(new evaluate_install_parameters_events_1.EvaluateInstallParametersStartedEvent());
    var cb = function () {
        return evaluationFunction()
            .then(function (evaluation) {
            // fire the finished event when no more evaluations are pending.
            if (evaluateParametersScheduler.pendingTaskCount === 0) {
                dispatcher_1.dispatcher.dispatch(new evaluate_install_parameters_events_1.EvaluateInstallParametersFinishedEvent(evaluation));
            }
            return evaluation;
        }, function (error) {
            // On error...
            // This is really bad, there's no hope of recovery
            // we should show an error to the user.
            dispatcher_1.dispatcher.dispatch(new evaluate_install_parameters_events_1.EvaluateInstallParametersFinishedEvent(null, error));
        });
    };
    // drop all pending evaluations in the scheduler and schedule a new one.
    evaluateParametersScheduler.drop(evaluateParametersScheduler.pendingTaskCount);
    evaluateParametersScheduler.schedule(cb);
}
/* istanbul ignore next */
function pauseOperation(productSummary, telemetryContext) {
    startProgressTimer(productSummary.installationPath);
    var operation = "pause";
    telemetryContext = ensureTelemetryContext(telemetryContext, operation);
    telemetryContext.initiatedFromCommandLine = false; // Cancel is never from the command line
    dispatcher_1.dispatcher.dispatch(new cancel_requested_event_1.CancelRequestedEvent(productSummary.installationPath));
    var parameters = new operation_parameters_1.CancelParameters(productSummary);
    factory_1.installerProxy.cancel(parameters, telemetryContext);
}
exports.pauseOperation = pauseOperation;
function launch(product, telemetryContext) {
    resetFailureAndProgress(product.installationPath);
    var operation = "launch";
    telemetryContext = ensureTelemetryContext(telemetryContext, operation);
    telemetryContext.initiatedFromCommandLine = false; // launch never comes from the command line
    var parameters = new operation_parameters_1.LaunchParameters(product);
    exports.runningOperationPromise = factory_1.installerProxy.launch(parameters, telemetryContext).catch(function (error) {
        var options = {
            error: ResourceStrings_1.ResourceStrings.launchFailed,
            link: {
                text: ResourceStrings_1.ResourceStrings.viewLog,
                callback: openLog
            },
            errorName: error.name,
        };
        dispatcher_1.dispatcher.dispatch(new OperationFailedEvent_1.OperationFailedEvent(options));
    });
}
exports.launch = launch;
function openLog(path) {
    if (path) {
        return open_external_1.openTextFile(path).then(function (result) {
            if (!result) {
                var eventName = telemetryEventNames.OPEN_LOG_ERROR;
                TelemetryProxy_1.telemetryProxy.postError(eventName, "log failed to open", new bucket_parameters_1.BucketParameters("openLog", "InstallerActions"), new Error());
                dispatcher_1.dispatcher.dispatch(new open_log_failed_event_1.OpenLogFailedEvent(path));
            }
        });
    }
    // Fallback to client log if no path is provided.
    factory_1.installerProxy.openLog();
    return Promise.resolve();
}
exports.openLog = openLog;
/* istanbul ignore next */
function openLicense(url) {
    if (url) {
        open_external_2.openExternal(url);
    }
}
exports.openLicense = openLicense;
var getInstallerStatusTimer;
/* istanbul ignore next */
function startPollingIntallerStatus() {
    if (getInstallerStatusTimer) {
        return;
    }
    // reset the installer status so it is initially clear until status is retrieved from the installer service
    installerStatus = installer_status_changed_event_1.InstallerStatus.pending;
    dispatcher_1.dispatcher.dispatch(new installer_status_changed_event_1.InstallerStatusChangedEvent(installerStatus));
    beginInstallerStatusRepeating();
}
exports.startPollingIntallerStatus = startPollingIntallerStatus;
/* istanbul ignore next */
function stopPollingIntallerStatus() {
    if (getInstallerStatusTimer) {
        clearTimeout(getInstallerStatusTimer);
        getInstallerStatusTimer = null;
    }
}
exports.stopPollingIntallerStatus = stopPollingIntallerStatus;
/* istanbul ignore next */
function beginInstallerStatusRepeating() {
    getInstallerStatusTimer = getInstallerStatusRepeating(0);
}
/* istanbul ignore next */
function nextInstallerStatusRepeating() {
    // The get installer status timer is falsy when a request to stop polling installer status
    // has been made while a poll was in flight.
    if (!getInstallerStatusTimer) {
        return;
    }
    var interval = installerStatus.blockingProcessNames.length > 0 ?
        CHECK_INSTALL_PARAMETERS_POLL_RATE_WHEN_BLOCKING_PROCESS_IS_PRESENT :
        CHECK_INSTALL_PARAMETERS_POLL_RATE;
    getInstallerStatusTimer = getInstallerStatusRepeating(interval);
}
/* istanbul ignore next */
function getInstallerStatusRepeating(interval) {
    return setTimeout(function () {
        getInstallerStatus()
            .finally(function () {
            nextInstallerStatusRepeating();
        });
    }, interval);
}
/* istanbul ignore next */
function getInstallerStatus() {
    return factory_1.installerProxy.getStatus()
        .then(function (status) {
        installerStatus = status;
        dispatcher_1.dispatcher.dispatch(new installer_status_changed_event_1.InstallerStatusChangedEvent(installerStatus));
        return status;
    });
}
/* istanbul ignore next */
/**
 * Ensures that the telemetry context contains the user requested operation.
 */
function ensureTelemetryContext(telemetryContext, operationName) {
    if (telemetryContext) {
        telemetryContext.userRequestedOperation = operationName;
        return telemetryContext;
    }
    return {
        userRequestedOperation: operationName,
    };
}
function startProgressTimer(installationPath) {
    if (factory_2.progressTimerActions) {
        factory_2.progressTimerActions.startTimer(installationPath);
    }
}
function stopProgressTimer() {
    if (factory_2.progressTimerActions) {
        factory_2.progressTimerActions.stopTimer();
    }
}
function operationFinishedCommon() {
    stopProgressTimer();
    progress_bar_proxy_1.progressBarProxy.setFlashFrame(true);
}
//# sourceMappingURL=InstallerActions.js.map