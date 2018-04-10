/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product_1 = require("../Product");
var channel_info_1 = require("../channel-info");
var installer_status_1 = require("../installer-status");
var installed_product_errors_1 = require("../installed-product-errors");
var installed_product_package_error_1 = require("../installed-product-package-error");
var SetupEngineProduct = require("../../SetupEngine/Product");
var SetupEngineOperationParameters = require("../../SetupEngine/operation-parameters");
var drive_space_evaluation_1 = require("../drive-space-evaluation");
var errors_1 = require("../../errors");
var ResourceStrings_1 = require("../../ResourceStrings");
var InstallerError_1 = require("../../SetupEngine/InstallerError");
var installed_product_summary_result_1 = require("../installed-product-summary-result");
var flight_info_1 = require("../../SetupEngine/flight-info");
var vsix_reference_1 = require("../../SetupEngine/vsix-reference");
var requires = require("../../requires");
var client_info_1 = require("../../SetupEngine/client-info");
function productSummaryFromSetupEngine(productSummary, installerId) {
    return new Product_1.ProductSummary(productSummary.id, installerId, productSummary.channel, productSummary.name, productSummary.description, productSummary.longDescription, versionFromSetupEngine(productSummary.version), installableFromSetupEngine(productSummary.installable), iconFromSetupEngine(productSummary.icon), productSummary.hidden, productSummary.license, productSummary.releaseNotes);
}
exports.productSummaryFromSetupEngine = productSummaryFromSetupEngine;
function productSummariesFromSetupEngine(productSummaries, installerId) {
    return productSummaries
        .map(function (productSummary) { return productSummaryFromSetupEngine(productSummary, installerId); });
}
exports.productSummariesFromSetupEngine = productSummariesFromSetupEngine;
function channelInfoListFromSetupEngine(channelInfoList) {
    return channelInfoList.map(function (channelInfo) {
        return new channel_info_1.ChannelInfo(channelInfo.id, channelInfo.name, channelInfo.description, channelInfo.suffix, channelInfo.isPrerelease);
    });
}
exports.channelInfoListFromSetupEngine = channelInfoListFromSetupEngine;
function productFromSetupEngine(product, installerId) {
    var productComponents = productComponentsFromSetupEngine(product);
    var icon = iconFromSetupEngine(product.icon);
    return new Product_1.Product(product.id, installerId, product.channel, product.name, product.description, product.longDescription, versionFromSetupEngine(product.version), product.defaultInstallationPath, product.componentDependencies, productComponents.allComponents, productComponents.workloads, installableFromSetupEngine(product.installable), icon, product.installSize, languageOptionsFromSetupEngine(product.languageOptions), product.hidden, product.license, product.releaseNotes, product.thirdPartyNotices, product.recommendSelection);
}
exports.productFromSetupEngine = productFromSetupEngine;
function installedProductSummaryFromSetupEngine(productSummary, installerId) {
    if (!productSummary) {
        return null;
    }
    return new Product_1.InstalledProductSummary(productSummary.id, installerId, productSummary.channel, productSummary.name, productSummary.description, productSummary.longDescription, versionFromSetupEngine(productSummary.version), productSummary.installationId, productSummary.installationPath, productSummary.nickname, installStateFromSetupEngine(productSummary.installState), productSummary.isUpdateAvailable, versionFromSetupEngine(productSummary.latestVersion), iconFromSetupEngine(productSummary.icon), productSummary.hidden, productSummary.hasPendingReboot, installedProductErrorsFromSetupEngine(productSummary.errorDetails), productSummary.releaseNotes);
}
exports.installedProductSummaryFromSetupEngine = installedProductSummaryFromSetupEngine;
function installedProductPackageErrorsFromSetupEngine(installedProductPackageErrors) {
    return installedProductPackageErrors.map(function (p) {
        return new installed_product_package_error_1.InstalledProductPackageError(p.Id, p.Action || "", p.ReturnCode || "");
    });
}
exports.installedProductPackageErrorsFromSetupEngine = installedProductPackageErrorsFromSetupEngine;
function installedProductErrorsFromSetupEngine(installedProductErrors) {
    return new installed_product_errors_1.InstalledProductErrors(installedProductPackageErrorsFromSetupEngine(installedProductErrors.FailedPackages || []), installedProductErrors.SkippedPackageIds || [], installedProductErrors.HasCorePackageFailures, installedProductErrors.LogFilePath || "");
}
exports.installedProductErrorsFromSetupEngine = installedProductErrorsFromSetupEngine;
function installedProductSummariesFromSetupEngine(productSummaries, installerId) {
    return productSummaries.map(function (productSummary) {
        return installedProductSummaryFromSetupEngine(productSummary, installerId);
    });
}
exports.installedProductSummariesFromSetupEngine = installedProductSummariesFromSetupEngine;
/**
 * Converts the product from the setup engine. Returns null if the input is null.
 *
 * @param product The product to convert from the setup engine
 * @param installerId The id of the installer
 * @returns The converted product, or null if the input is null.
 */
function installedProductFromSetupEngine(product, installerId) {
    if (!product) {
        return null;
    }
    var productComponents = productComponentsFromSetupEngine(product);
    var icon = iconFromSetupEngine(product.icon);
    return new Product_1.InstalledProduct(product.id, installerId, product.channel, product.name, product.description, product.longDescription, versionFromSetupEngine(product.version), product.componentDependencies, productComponents.allComponents, productComponents.workloads, product.installationId, product.installationPath, product.nickname, product.installSize, installStateFromSetupEngine(product.installState), product.isUpdateAvailable, versionFromSetupEngine(product.latestVersion), icon, languageOptionsFromSetupEngine(product.languageOptions), product.hidden, product.hasPendingReboot, installedProductErrorsFromSetupEngine(product.errorDetails), product.hasUpdatePackages, product.releaseNotes, product.license, product.thirdPartyNotices, product.recommendSelection);
}
exports.installedProductFromSetupEngine = installedProductFromSetupEngine;
function progressTypeFromSetupEngine(progressType) {
    switch (progressType) {
        default:
        case SetupEngineProduct.ProgressType.Unknown:
            return Product_1.ProgressType.Unknown;
        case SetupEngineProduct.ProgressType.Download:
            return Product_1.ProgressType.Download;
        case SetupEngineProduct.ProgressType.Install:
            return Product_1.ProgressType.Install;
        case SetupEngineProduct.ProgressType.UninstallAll:
            return Product_1.ProgressType.UninstallAll;
    }
}
exports.progressTypeFromSetupEngine = progressTypeFromSetupEngine;
function progressInfoFromSetupEngine(progressInfo) {
    if (!progressInfo) {
        return null;
    }
    return new Product_1.ProgressInfo(progressInfo.currentPackage, progressInfo.totalPackages, progressInfo.downloadedSize, progressInfo.totalSize, progressInfo.downloadSpeed);
}
exports.progressInfoFromSetupEngine = progressInfoFromSetupEngine;
function installStateFromSetupEngine(installState) {
    switch (installState) {
        default:
        case SetupEngineProduct.InstallState.NotInstalled:
            return Product_1.InstallState.NotInstalled;
        case SetupEngineProduct.InstallState.Installed:
            return Product_1.InstallState.Installed;
        case SetupEngineProduct.InstallState.Partial:
            return Product_1.InstallState.Partial;
        case SetupEngineProduct.InstallState.Paused:
            return Product_1.InstallState.Paused;
    }
}
exports.installStateFromSetupEngine = installStateFromSetupEngine;
function installStateToSetupEngine(installState) {
    switch (installState) {
        default:
        case Product_1.InstallState.NotInstalled:
            return SetupEngineProduct.InstallState.NotInstalled;
        case Product_1.InstallState.Installed:
            return SetupEngineProduct.InstallState.Installed;
        case Product_1.InstallState.Partial:
            return SetupEngineProduct.InstallState.Partial;
    }
}
exports.installStateToSetupEngine = installStateToSetupEngine;
function selectedStateFromSetupEngine(selectedState) {
    switch (selectedState) {
        default:
        case SetupEngineProduct.SelectedState.NotSelected:
            return Product_1.SelectedState.NotSelected;
        case SetupEngineProduct.SelectedState.IndividuallySelected:
            return Product_1.SelectedState.IndividuallySelected;
        case SetupEngineProduct.SelectedState.GroupSelected:
            return Product_1.SelectedState.GroupSelected;
    }
}
exports.selectedStateFromSetupEngine = selectedStateFromSetupEngine;
function selectedStateToSetupEngine(selectedState) {
    switch (selectedState) {
        default:
        case Product_1.SelectedState.NotSelected:
            return SetupEngineProduct.SelectedState.NotSelected;
        case Product_1.SelectedState.IndividuallySelected:
            return SetupEngineProduct.SelectedState.IndividuallySelected;
        case Product_1.SelectedState.GroupSelected:
            return SetupEngineProduct.SelectedState.GroupSelected;
    }
}
exports.selectedStateToSetupEngine = selectedStateToSetupEngine;
function workloadFromSetupEngine(workload, allComponents) {
    return new Product_1.Workload(workload.id, workload.name, workload.description, workload.longDescription, workload.category, installStateFromSetupEngine(workload.installState), selectedStateFromSetupEngine(workload.selectedState), versionFromSetupEngine(workload.version), allComponents, workload.componentDependencies, workload.required, installableFromSetupEngine(workload.installable), iconFromSetupEngine(workload.icon));
}
function workloadsFromSetupEngine(workloads, allComponents) {
    return workloads.map(function (workload, index) {
        return workloadFromSetupEngine(workload, allComponents);
    });
}
function componentFromSetupEngine(component, allComponents) {
    return new Product_1.Component(component.id, component.name, component.description, component.longDescription, component.category, versionFromSetupEngine(component.version), component.license, component.componentDependencies, allComponents, installStateFromSetupEngine(component.installState), selectedStateFromSetupEngine(component.selectedState), installableFromSetupEngine(component.installable), component.isUiGroup);
}
function componentsFromSetupEngine(components) {
    var allComponents = new Product_1.ComponentMap();
    components.forEach(function (component) { return allComponents.add(componentFromSetupEngine(component, allComponents)); });
    return allComponents;
}
function productComponentsFromSetupEngine(product) {
    var allComponents = componentsFromSetupEngine(product.components);
    var workloads = workloadsFromSetupEngine(product.workloads, allComponents);
    return {
        workloads: workloads,
        allComponents: allComponents
    };
}
function languageOptionsFromSetupEngine(languageOptions) {
    return languageOptions.map(function (option) {
        return new Product_1.LanguageOption(option.locale, option.isInstalled, option.isSelected);
    });
}
function installableFromSetupEngine(installable) {
    return new Product_1.Installable(installable.reasons);
}
exports.installableFromSetupEngine = installableFromSetupEngine;
function iconFromSetupEngine(icon) {
    if (icon) {
        return new Product_1.Icon(icon.mimeType, icon.base64);
    }
    return new Product_1.Icon(null, null);
}
exports.iconFromSetupEngine = iconFromSetupEngine;
function installOperationResultFromSetupEngine(result, installerId) {
    return new Product_1.InstallOperationResult(installedProductFromSetupEngine(result.product, installerId), rebootRequiredFromSetupEngine(result.rebootRequired), installerErrorFromSetupEngine(result.error));
}
exports.installOperationResultFromSetupEngine = installOperationResultFromSetupEngine;
function installParametersToSetupEngine(parameters) {
    var selectedPackageReferences = setupEnginePackageReferencesFromProduct(parameters.product);
    var product = parameters.product;
    return new SetupEngineOperationParameters.InstallParameters(product.channel.id, product.id, parameters.nickname, parameters.installationPath, parameters.layoutPath, product.selectedLanguages, selectedPackageReferences, parameters.productKey, additionalOptionsToSetupEngine(parameters.additionalOptions));
}
exports.installParametersToSetupEngine = installParametersToSetupEngine;
function modifyParametersToSetupEngine(parameters) {
    var product = parameters.product;
    var selectedPackageReferences = setupEnginePackageReferencesFromProduct(product);
    return new SetupEngineOperationParameters.ModifyParameters(product.installationPath, product.selectedLanguages, selectedPackageReferences, parameters.updateOnModify, additionalOptionsToSetupEngine(parameters.additionalOptions));
}
exports.modifyParametersToSetupEngine = modifyParametersToSetupEngine;
function updateParametersToSetupEngine(parameters) {
    return new SetupEngineOperationParameters.UpdateParameters(parameters.product.installationPath, parameters.layoutPath, parameters.productKey, additionalOptionsToSetupEngine(parameters.additionalOptions), parameters.updateFromVS);
}
exports.updateParametersToSetupEngine = updateParametersToSetupEngine;
function flightInfoListToSetupEngine(flightInfo) {
    return flightInfo.map(function (info) { return flightInfoToSetupEngine(info); });
}
exports.flightInfoListToSetupEngine = flightInfoListToSetupEngine;
function flightInfoToSetupEngine(flightInfo) {
    return new flight_info_1.FlightInfo(flightInfo.name, flightInfo.durationInMinutes);
}
exports.flightInfoToSetupEngine = flightInfoToSetupEngine;
function vsixReferencesToSetupEngine(vsixs) {
    if (!vsixs) {
        return [];
    }
    return vsixs.map(function (vsix) { return vsixReferenceToSetupEngine(vsix); });
}
exports.vsixReferencesToSetupEngine = vsixReferencesToSetupEngine;
function vsixReferenceToSetupEngine(vsix) {
    requires.notNullOrUndefined(vsix, "vsix");
    return new vsix_reference_1.VsixReference(vsix.uri);
}
exports.vsixReferenceToSetupEngine = vsixReferenceToSetupEngine;
function additionalOptionsToSetupEngine(options) {
    if (!options) {
        return null;
    }
    return new SetupEngineOperationParameters.AdditionalOptions(vsixReferencesToSetupEngine(options.vsixs), flightInfoListToSetupEngine(options.flights));
}
exports.additionalOptionsToSetupEngine = additionalOptionsToSetupEngine;
function installParametersEvaluationFromSetupEngine(evaluation) {
    return new Product_1.InstallParametersEvaluation(driveSpaceEvaluationFromSetupEngine(evaluation.systemDriveEvaluation), driveSpaceEvaluationFromSetupEngine(evaluation.targetDriveEvaluation), driveSpaceEvaluationFromSetupEngine(evaluation.sharedDriveEvaluation), evaluation.invalidInstallationPathMessage);
}
exports.installParametersEvaluationFromSetupEngine = installParametersEvaluationFromSetupEngine;
function modifyParametersEvaluationFromSetupEngine(evaluation) {
    return new Product_1.ModifyParametersEvaluation(driveSpaceEvaluationFromSetupEngine(evaluation.systemDriveEvaluation), driveSpaceEvaluationFromSetupEngine(evaluation.targetDriveEvaluation), driveSpaceEvaluationFromSetupEngine(evaluation.sharedDriveEvaluation));
}
exports.modifyParametersEvaluationFromSetupEngine = modifyParametersEvaluationFromSetupEngine;
function rebootRequiredFromSetupEngine(rebootRequired) {
    switch (rebootRequired) {
        default:
            throw new errors_1.InvalidParameterError("Unhandled RebootType value '" + rebootRequired);
        case SetupEngineProduct.RebootType.FinalReboot:
            return Product_1.RebootType.FinalReboot;
        case SetupEngineProduct.RebootType.IntermediateReboot:
            return Product_1.RebootType.IntermediateReboot;
        case SetupEngineProduct.RebootType.None:
            return Product_1.RebootType.None;
        case SetupEngineProduct.RebootType.FinalizerReboot:
            return Product_1.RebootType.FinalizerReboot;
    }
}
exports.rebootRequiredFromSetupEngine = rebootRequiredFromSetupEngine;
function messageTypeFromSetupEngine(messageType) {
    switch (messageType) {
        default:
            throw new errors_1.InvalidParameterError("Unhandled MessageType value '" + messageType + "'");
        case SetupEngineProduct.MessageType.EndAction:
            return Product_1.MessageType.EndAction;
        case SetupEngineProduct.MessageType.Error:
            return Product_1.MessageType.Error;
        case SetupEngineProduct.MessageType.Informational:
            return Product_1.MessageType.Informational;
        case SetupEngineProduct.MessageType.RebootRequired:
            return Product_1.MessageType.RebootRequired;
        case SetupEngineProduct.MessageType.SourceRequired:
            return Product_1.MessageType.SourceRequired;
        case SetupEngineProduct.MessageType.StartAction:
            return Product_1.MessageType.StartAction;
        case SetupEngineProduct.MessageType.Warning:
            return Product_1.MessageType.Warning;
    }
}
exports.messageTypeFromSetupEngine = messageTypeFromSetupEngine;
function messageResultTypesToSetupEngine(messageResultTypes) {
    switch (messageResultTypes) {
        default:
            throw new errors_1.InvalidParameterError("Unhandled MessageResultTypes value '" + messageResultTypes + "'");
        case Product_1.MessageResultTypes.Abort:
            return SetupEngineProduct.MessageResultTypes.Abort;
        case Product_1.MessageResultTypes.Cancel:
            return SetupEngineProduct.MessageResultTypes.Cancel;
        case Product_1.MessageResultTypes.Ignore:
            return SetupEngineProduct.MessageResultTypes.Ignore;
        case Product_1.MessageResultTypes.None:
            return SetupEngineProduct.MessageResultTypes.None;
        case Product_1.MessageResultTypes.OK:
            return SetupEngineProduct.MessageResultTypes.OK;
        case Product_1.MessageResultTypes.Retry:
            return SetupEngineProduct.MessageResultTypes.Retry;
        case Product_1.MessageResultTypes.Text:
            return SetupEngineProduct.MessageResultTypes.Text;
    }
}
exports.messageResultTypesToSetupEngine = messageResultTypesToSetupEngine;
function acceptsResultTypesFromSetupEngine(resultTypes) {
    return [
        { engine: SetupEngineProduct.MessageResultTypes.Abort, installer: Product_1.MessageResultTypes.Abort },
        { engine: SetupEngineProduct.MessageResultTypes.Cancel, installer: Product_1.MessageResultTypes.Cancel },
        { engine: SetupEngineProduct.MessageResultTypes.Ignore, installer: Product_1.MessageResultTypes.Ignore },
        { engine: SetupEngineProduct.MessageResultTypes.None, installer: Product_1.MessageResultTypes.None },
        { engine: SetupEngineProduct.MessageResultTypes.OK, installer: Product_1.MessageResultTypes.OK },
        { engine: SetupEngineProduct.MessageResultTypes.Retry, installer: Product_1.MessageResultTypes.Retry },
        { engine: SetupEngineProduct.MessageResultTypes.Text, installer: Product_1.MessageResultTypes.Text }
    ].reduce(function (aggregate, current) {
        /* tslint:disable:no-bitwise */
        if ((resultTypes & current.engine) === current.engine) {
            aggregate = aggregate | current.installer;
        }
        /* tslint:enable */
        return aggregate;
    }, Product_1.MessageResultTypes.None);
}
exports.acceptsResultTypesFromSetupEngine = acceptsResultTypesFromSetupEngine;
function activityTypeFromSetupEngine(activityType) {
    switch (activityType) {
        default:
            throw new errors_1.InvalidParameterError("Unhandled ActivityType value '" + activityType + "'");
        case Product_1.ActivityType.Initialize:
            return SetupEngineProduct.ActivityType.Initialize;
        case Product_1.ActivityType.Plan:
            return SetupEngineProduct.ActivityType.Plan;
        case Product_1.ActivityType.Download:
            return SetupEngineProduct.ActivityType.Download;
        case Product_1.ActivityType.Install:
            return SetupEngineProduct.ActivityType.Install;
        case Product_1.ActivityType.Finalize:
            return SetupEngineProduct.ActivityType.Finalize;
    }
}
exports.activityTypeFromSetupEngine = activityTypeFromSetupEngine;
function messageFromSetupEngine(message) {
    return new Product_1.Message(messageTypeFromSetupEngine(message.type), acceptsResultTypesFromSetupEngine(message.acceptsResultTypes), acceptsResultTypesFromSetupEngine(message.defaultResultType), message.localizedString, message.logString, activityTypeFromSetupEngine(message.activity));
}
exports.messageFromSetupEngine = messageFromSetupEngine;
function messageResultToSetupEngine(messageResult) {
    return new SetupEngineProduct.MessageResult(messageResultTypesToSetupEngine(messageResult.type), messageResult.textValue);
}
exports.messageResultToSetupEngine = messageResultToSetupEngine;
function installerStatusFromSetupEngine(installerStatus) {
    // A response from the setup engine indicates that the request is no longer pending.
    var isPending = false;
    return new installer_status_1.InstallerStatus({
        isPending: isPending,
        isDisposed: installerStatus.isDisposed,
        rebootRequired: installerStatus.rebootRequired,
        installationOperationRunning: installerStatus.installationOperationRunning,
        blockingProcessNames: installerStatus.blockingProcessNames
    });
}
exports.installerStatusFromSetupEngine = installerStatusFromSetupEngine;
function versionFromSetupEngine(version) {
    return new Product_1.VersionBundle(version.build, version.display, version.semantic);
}
exports.versionFromSetupEngine = versionFromSetupEngine;
function telemetryContextToSetupEngine(telemetryContext) {
    return {
        installSessionId: telemetryContext.installSessionId,
        serializedCorrelations: telemetryContext.serializedCorrelations,
        sessionId: telemetryContext.sessionId,
        userRequestedOperation: telemetryContext.userRequestedOperation,
    };
}
exports.telemetryContextToSetupEngine = telemetryContextToSetupEngine;
function settingsToSetupEngine(settings) {
    return new SetupEngineProduct.Settings(settings.keepDownloadedPayloads, settings.noWeb, settings.force);
}
exports.settingsToSetupEngine = settingsToSetupEngine;
function settingsFromSetupEngine(settings) {
    return new Product_1.Settings(settings.keepDownloadedPayloads, settings.noWeb, settings.force);
}
exports.settingsFromSetupEngine = settingsFromSetupEngine;
/**
 * Converts a SetupEngineInstallerError to a CustomErrorBase. Returns null if error is null.
 *
 * @param error The error to convert from the setup engine installer error
 * @param productName The name of the product associated with the error
 * @returns The error converted to a CustomErrorBase
 */
function installerErrorFromSetupEngine(error, productName) {
    if (productName === void 0) { productName = null; }
    var errorMessage = null;
    if (!error) {
        return null;
    }
    // if it's a typed error and ours, return it with a more accurate type
    switch (error.name) {
        case InstallerError_1.InstallerError.OPERATION_CANCELED_NAME:
            return new errors_1.OperationCanceledError(error.message, error.localizedMessage, error.log);
        case InstallerError_1.InstallerError.RECOVERABLE_FAILURE_NAME:
            errorMessage = ResourceStrings_1.ResourceStrings.vsIsRunning;
            return new errors_1.VSIsRunningError(errorMessage, errorMessage, error.log);
        case InstallerError_1.InstallerError.REBOOT_REQUIRED_NAME:
            return new errors_1.RebootRequiredError(error.message, error.localizedMessage, error.log);
        case InstallerError_1.InstallerError.POST_INSTALL_REBOOT_REQUIRED_NAME:
            return new errors_1.PostInstallRebootRequiredError(productName, error.localizedMessage, error.log);
        case InstallerError_1.InstallerError.KEY_NOT_FOUND_NAME:
            return new errors_1.ItemNotInstalledError(error.message, error.localizedMessage, error.log);
        case InstallerError_1.InstallerError.WIN_32_LAUNCH_ERROR_NAME:
            return new errors_1.LaunchFailedError(error.message, error.localizedMessage, error.log);
        case InstallerError_1.InstallerError.UPDATE_REQUIRED_NAME:
            errorMessage = ResourceStrings_1.ResourceStrings.installerUpdateRequired;
            return new errors_1.ServiceUpdateRequireError(errorMessage, errorMessage, error.log);
        case InstallerError_1.InstallerError.CHANNEL_MANIFEST_DOWNLOAD_NAME:
            return new errors_1.ChannelManifestDownloadError(error.message, error.localizedMessage, error.log);
        case InstallerError_1.InstallerError.PRODUCT_MANIFEST_SIGN_ERROR_NAME:
            return new errors_1.ManifestSignatureVerificationFailedError(error.message, error.localizedMessage, error.log);
        case InstallerError_1.InstallerError.INVALID_SELECTED_PACKAGE:
            return new errors_1.InvalidSelectedPackagesError(error.message, error.localizedMessage, error.log);
        case InstallerError_1.InstallerError.SIGNATURE_VERIFICATION_FAILED_ERROR_NAME:
            return new errors_1.SignatureVerificationFailedError(error.message, error.localizedMessage, error.log);
        case InstallerError_1.InstallerErrorNames.CHANNELS_LOCKED_EXCEPTION:
            return new errors_1.ChannelsLockedError(error.message, error.localizedMessage, error.log);
        default:
            // This error is not implemented, so wrap it in an InstallerError.
            return new errors_1.InstallerError(error.message, error.localizedMessage, error.log);
    }
}
exports.installerErrorFromSetupEngine = installerErrorFromSetupEngine;
/**
 * Converts a Setup Engine InstalledProductSummariesResult to the installer equivalent.
 *
 * @param result The setup engine InstalledProductSummariesResult to convert
 * @param installerId The ID of the installer
 */
function installedProductSummariesResultFromSetupEngine(result, installerId) {
    return new Product_1.InstalledProductSummariesResult(result.rpcErrors, result.installedProductSummaryResults.map(function (r) {
        return installedProductSummaryResultFromSetupEngine(r, installerId);
    }));
}
exports.installedProductSummariesResultFromSetupEngine = installedProductSummariesResultFromSetupEngine;
/**
 * Converts the Setup Engine InstalledProductSummaryResult to the installer equivalent.
 *
 * @param results The Setup Engine InstalledProductSummaryResult to convert.
 * @param installerId The ID of the installer.
 */
function installedProductSummaryResultFromSetupEngine(result, installerId) {
    return new installed_product_summary_result_1.InstalledProductSummaryResult(installedProductSummaryFromSetupEngine(result.productSummary, installerId), installerErrorFromSetupEngine(result.error));
}
exports.installedProductSummaryResultFromSetupEngine = installedProductSummaryResultFromSetupEngine;
function driveSpaceEvaluationFromSetupEngine(driveSpaceEvaluation) {
    // disk drive evaluation can be null
    if (!driveSpaceEvaluation) {
        return null;
    }
    return new drive_space_evaluation_1.DriveSpaceEvaluation(driveSpaceEvaluation.currentInstallSize, driveSpaceEvaluation.requestedDeltaSize, driveSpaceEvaluation.hasSufficientDiskSpace, driveSpaceEvaluation.driveName);
}
function setupEnginePackageReferencesFromProduct(product) {
    var selectedWorkloadReferences = product.selectedWorkloads
        .map(function (workload) {
        return new SetupEngineProduct.SelectedPackageReference(workload.id, selectedStateToSetupEngine(workload.selectedState));
    });
    var selectedComponentReferences = product.selectedComponents
        .map(function (component) {
        return new SetupEngineProduct.SelectedPackageReference(component.id, selectedStateToSetupEngine(component.selectedState));
    });
    return selectedWorkloadReferences.concat(selectedComponentReferences);
}
function clientInfoToSetupEngine(client, ignoreVersion) {
    return new client_info_1.ClientInfo(client.appInfo.appName, ignoreVersion ? null : client.appInfo.appVersion, client.locale, client.serializedTelemetrySession, client.campaignId);
}
exports.clientInfoToSetupEngine = clientInfoToSetupEngine;
//# sourceMappingURL=SetupEngineTypeConverter.js.map