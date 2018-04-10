/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channelModule = require("./channel-info");
var errors_1 = require("../errors");
var InstallerError_1 = require("./InstallerError");
var Logger_1 = require("../Logger");
var productModule = require("./Product");
var installerStatusModule = require("./installer-status");
var driveSpaceModule = require("./drive-space-evaluation");
var installed_product_summary_result_1 = require("./installed-product-summary-result");
var requires = require("../requires");
var logger = Logger_1.getLogger();
/**
 * Defines the RPC serializable messages of the Installer interface.
 *
 * NOTE: All type definitions must match the case-sensitive spelling of the
 * JSON messages used with the Setup Engine.
 */
var SetupEngineRpc;
(function (SetupEngineRpc) {
    "use strict";
    var ProgressType;
    (function (ProgressType) {
        ProgressType[ProgressType["Unknown"] = 0] = "Unknown";
        ProgressType[ProgressType["Install"] = 1] = "Install";
        ProgressType[ProgressType["Download"] = 2] = "Download";
        ProgressType[ProgressType["UninstallAll"] = 3] = "UninstallAll";
    })(ProgressType = SetupEngineRpc.ProgressType || (SetupEngineRpc.ProgressType = {}));
    var DependencyType;
    (function (DependencyType) {
        DependencyType[DependencyType["Required"] = 0] = "Required";
        DependencyType[DependencyType["Recommended"] = 1] = "Recommended";
        DependencyType[DependencyType["Optional"] = 2] = "Optional";
    })(DependencyType = SetupEngineRpc.DependencyType || (SetupEngineRpc.DependencyType = {}));
    var InstallState;
    (function (InstallState) {
        InstallState[InstallState["Installed"] = 0] = "Installed";
        InstallState[InstallState["NotInstalled"] = 1] = "NotInstalled";
        InstallState[InstallState["Partial"] = 2] = "Partial";
        InstallState[InstallState["Paused"] = 3] = "Paused";
    })(InstallState = SetupEngineRpc.InstallState || (SetupEngineRpc.InstallState = {}));
    var SelectedState;
    (function (SelectedState) {
        SelectedState[SelectedState["NotSelected"] = 0] = "NotSelected";
        SelectedState[SelectedState["IndividuallySelected"] = 1] = "IndividuallySelected";
        SelectedState[SelectedState["GroupSelected"] = 2] = "GroupSelected";
    })(SelectedState = SetupEngineRpc.SelectedState || (SetupEngineRpc.SelectedState = {}));
    var MessageType;
    (function (MessageType) {
        MessageType[MessageType["Informational"] = 0] = "Informational";
        MessageType[MessageType["Warning"] = 1] = "Warning";
        MessageType[MessageType["Error"] = 2] = "Error";
        MessageType[MessageType["StartAction"] = 3] = "StartAction";
        MessageType[MessageType["EndAction"] = 4] = "EndAction";
        MessageType[MessageType["RebootRequired"] = 5] = "RebootRequired";
        MessageType[MessageType["SourceRequired"] = 6] = "SourceRequired";
    })(MessageType = SetupEngineRpc.MessageType || (SetupEngineRpc.MessageType = {}));
    var MessageResultTypes;
    (function (MessageResultTypes) {
        MessageResultTypes[MessageResultTypes["None"] = 0] = "None";
        MessageResultTypes[MessageResultTypes["OK"] = 1] = "OK";
        MessageResultTypes[MessageResultTypes["Cancel"] = 2] = "Cancel";
        MessageResultTypes[MessageResultTypes["Retry"] = 3] = "Retry";
        MessageResultTypes[MessageResultTypes["Abort"] = 4] = "Abort";
        MessageResultTypes[MessageResultTypes["Ignore"] = 5] = "Ignore";
        MessageResultTypes[MessageResultTypes["Text"] = 6] = "Text";
    })(MessageResultTypes = SetupEngineRpc.MessageResultTypes || (SetupEngineRpc.MessageResultTypes = {}));
    var ActivityType;
    (function (ActivityType) {
        ActivityType[ActivityType["Initialize"] = 0] = "Initialize";
        ActivityType[ActivityType["Plan"] = 1] = "Plan";
        ActivityType[ActivityType["Download"] = 2] = "Download";
        ActivityType[ActivityType["Install"] = 3] = "Install";
        ActivityType[ActivityType["Finalize"] = 4] = "Finalize";
    })(ActivityType = SetupEngineRpc.ActivityType || (SetupEngineRpc.ActivityType = {}));
    function hiddenFromRpc(hidden) {
        // If the Hidden is field is undefined on the Rpc object, we default
        // to false
        return !!hidden;
    }
    SetupEngineRpc.hiddenFromRpc = hiddenFromRpc;
    function versionFromRpc(version) {
        // TODO: Remove support for a parameter of type string once the Setup Service
        // starts providing the VersionBundle type.
        if (typeof version === "string") {
            return new productModule.VersionBundle(version);
        }
        else {
            return new productModule.VersionBundle(version.BuildVersion, version.DisplayVersion, version.SemanticVersion);
        }
    }
    SetupEngineRpc.versionFromRpc = versionFromRpc;
    function throwRpcError(error, object, description) {
        var message = "Invalid RPC " + description + ": \n" +
            (JSON.stringify(object, null, 2) + ", \n") +
            ("error: " + error.message + " at " + error.stack);
        logger.writeError(message);
        throw new errors_1.RpcError(message, null, null, null, error);
    }
    function installedProductSummaryFromRpc(productSummaryRpc) {
        if (!productSummaryRpc) {
            return null;
        }
        try {
            return new productModule.InstalledProductSummary(productSummaryRpc.Id, channelInfoFromRpc(productSummaryRpc.Channel), productSummaryRpc.Name, productSummaryRpc.Description, productSummaryRpc.LongDescription, versionFromRpc(productSummaryRpc.Version), productSummaryRpc.InstallationId, productSummaryRpc.InstallationPath, productSummaryRpc.Nickname, parseInstallState(productSummaryRpc.InstallState), productSummaryRpc.IsUpdateAvailable, versionFromRpc(productSummaryRpc.LatestVersion), iconFromRpc(productSummaryRpc.Icon), hiddenFromRpc(productSummaryRpc.Hidden), productSummaryRpc.HasPendingReboot, productSummaryRpc.ErrorDetails, productSummaryRpc.ReleaseNotes);
        }
        catch (error) {
            throwRpcError(error, productSummaryRpc, "installed product summary");
        }
    }
    SetupEngineRpc.installedProductSummaryFromRpc = installedProductSummaryFromRpc;
    /**
     * Converts productSummaries from RPC and, if an error is thrown converting one,
     * will store the error and move onto the next summary.
     */
    function installedProductSummariesResultFromRpc(rpcResults) {
        var results = [];
        var rpcErrors = [];
        for (var _i = 0, rpcResults_1 = rpcResults; _i < rpcResults_1.length; _i++) {
            var rpcResult = rpcResults_1[_i];
            try {
                var result = installedProductSummaryResultFromRpc(rpcResult);
                results.push(result);
            }
            catch (error) {
                rpcErrors.push(error);
            }
        }
        return new productModule.InstalledProductSummariesResult(rpcErrors, results);
    }
    SetupEngineRpc.installedProductSummariesResultFromRpc = installedProductSummariesResultFromRpc;
    function installedProductSummaryResultFromRpc(rpcResult) {
        return new installed_product_summary_result_1.InstalledProductSummaryResult(installedProductSummaryFromRpc(rpcResult.ProductSummary), installerErrorFromRpc(rpcResult.Error));
    }
    SetupEngineRpc.installedProductSummaryResultFromRpc = installedProductSummaryResultFromRpc;
    function dependencyTypeFromRpc(dependencyType) {
        switch (dependencyType) {
            default:
            case DependencyType.Recommended:
                return productModule.DependencyType.Recommended;
            case DependencyType.Optional:
                return productModule.DependencyType.Optional;
            case DependencyType.Required:
                return productModule.DependencyType.Required;
        }
    }
    SetupEngineRpc.dependencyTypeFromRpc = dependencyTypeFromRpc;
    function installStateFromRpc(installState) {
        switch (installState) {
            default:
            case InstallState.NotInstalled:
                return productModule.InstallState.NotInstalled;
            case InstallState.Installed:
                return productModule.InstallState.Installed;
        }
    }
    SetupEngineRpc.installStateFromRpc = installStateFromRpc;
    function selectedStateFromRpc(selectedState) {
        switch (selectedState) {
            default:
            case SelectedState.NotSelected:
                return productModule.SelectedState.NotSelected;
            case SelectedState.IndividuallySelected:
                return productModule.SelectedState.IndividuallySelected;
            case SelectedState.GroupSelected:
                return productModule.SelectedState.GroupSelected;
        }
    }
    SetupEngineRpc.selectedStateFromRpc = selectedStateFromRpc;
    function selectedStateToRpc(selectedState) {
        switch (selectedState) {
            default:
            case productModule.SelectedState.NotSelected:
                return SelectedState.NotSelected;
            case productModule.SelectedState.IndividuallySelected:
                return SelectedState.IndividuallySelected;
            case productModule.SelectedState.GroupSelected:
                return SelectedState.GroupSelected;
        }
    }
    SetupEngineRpc.selectedStateToRpc = selectedStateToRpc;
    function iconFromRpc(icon) {
        if (icon) {
            return new productModule.Icon(icon.MimeType, icon.Data);
        }
        return new productModule.Icon(null, null);
    }
    SetupEngineRpc.iconFromRpc = iconFromRpc;
    function componentDependencyFromRpc(componentDependency) {
        return new productModule.ComponentDependency(componentDependency.ComponentId.toLowerCase(), dependencyTypeFromRpc(parseDependencyType(componentDependency.DependencyType)));
    }
    function componentDependenciesFromRpc(componentDependencies) {
        return componentDependencies.map(componentDependencyFromRpc);
    }
    SetupEngineRpc.componentDependenciesFromRpc = componentDependenciesFromRpc;
    function componentsFromRpc(components) {
        return components.map(function (rpcComponent) {
            return new productModule.Component(rpcComponent.Id.toLowerCase(), rpcComponent.Name, rpcComponent.Description, rpcComponent.LongDescription, rpcComponent.Category, versionFromRpc(rpcComponent.Version), rpcComponent.License, parseInstallState(rpcComponent.InstallState), parseSelectedState(rpcComponent.SelectedState), componentDependenciesFromRpc(rpcComponent.ComponentDependencies), installableFromRpc(rpcComponent.Installable), rpcComponent.IsUiGroup);
        });
    }
    SetupEngineRpc.componentsFromRpc = componentsFromRpc;
    function workloadsFromRpc(workloads) {
        return workloads.map(function (workload) {
            return new productModule.Workload(workload.Id, workload.Name, workload.Description, workload.LongDescription, workload.Category, versionFromRpc(workload.Version), workload.Required, parseInstallState(workload.InstallState), parseSelectedState(workload.SelectedState), componentDependenciesFromRpc(workload.ComponentDependencies), installableFromRpc(workload.Installable), iconFromRpc(workload.Icon));
        });
    }
    SetupEngineRpc.workloadsFromRpc = workloadsFromRpc;
    function languageOptionsFromRpc(languageOptions) {
        return languageOptions.map(function (option) {
            var productModuleLanguageOption = new productModule.LanguageOption(option.Locale, option.IsInstalled, option.IsSelected);
            return productModuleLanguageOption;
        });
    }
    SetupEngineRpc.languageOptionsFromRpc = languageOptionsFromRpc;
    /**
     * Converts a product from RPC. Returns null if the input is null.
     *
     * @param productRpc The product to convert from RPC
     * @returns The installed product converted from RPC, or null if productRpc is null
     * @throws RpcError when the product is invalid
     */
    function installedProductFromRpc(productRpc) {
        if (!productRpc) {
            return null;
        }
        try {
            var components = componentsFromRpc(productRpc.Components);
            var workloads = workloadsFromRpc(productRpc.Workloads);
            var languageOptions = languageOptionsFromRpc(productRpc.LanguageOptions);
            return new productModule.InstalledProduct(productRpc.Id, channelInfoFromRpc(productRpc.Channel), productRpc.Name, productRpc.Description, productRpc.LongDescription, versionFromRpc(productRpc.Version), componentDependenciesFromRpc(productRpc.AdditionalComponentDependencies), components, workloads, productRpc.InstallationId, productRpc.InstallationPath, productRpc.Nickname, parseInstallState(productRpc.InstallState), productRpc.IsUpdateAvailable, versionFromRpc(productRpc.LatestVersion), iconFromRpc(productRpc.Icon), productRpc.InstallSize, languageOptions, hiddenFromRpc(productRpc.Hidden), productRpc.HasPendingReboot, productRpc.ErrorDetails, productRpc.HasUpdatePackages, productRpc.ReleaseNotes, productRpc.License, productRpc.ThirdPartyNotices, productRpc.RecommendSelection);
        }
        catch (error) {
            throwRpcError(error, productRpc, "installed product");
        }
    }
    SetupEngineRpc.installedProductFromRpc = installedProductFromRpc;
    function productSummaryFromRpc(productSummaryRpc) {
        try {
            return new productModule.ProductSummary(productSummaryRpc.Id, channelInfoFromRpc(productSummaryRpc.Channel), productSummaryRpc.Name, productSummaryRpc.Description, productSummaryRpc.LongDescription, versionFromRpc(productSummaryRpc.Version), installableFromRpc(productSummaryRpc.Installable), iconFromRpc(productSummaryRpc.Icon), hiddenFromRpc(productSummaryRpc.Hidden), productSummaryRpc.License, productSummaryRpc.ReleaseNotes);
        }
        catch (error) {
            throwRpcError(error, productSummaryRpc, "product summary");
        }
    }
    SetupEngineRpc.productSummaryFromRpc = productSummaryFromRpc;
    function productSummariesFromRpc(productSummaries) {
        return productSummaries.map(function (productSummary) { return productSummaryFromRpc(productSummary); });
    }
    SetupEngineRpc.productSummariesFromRpc = productSummariesFromRpc;
    function productFromRpc(productRpc) {
        try {
            var componentDependencies = componentDependenciesFromRpc(productRpc.AdditionalComponentDependencies);
            var components = componentsFromRpc(productRpc.Components);
            var workloads = workloadsFromRpc(productRpc.Workloads);
            var languageOptions = languageOptionsFromRpc(productRpc.LanguageOptions);
            return new productModule.Product(productRpc.Id, channelInfoFromRpc(productRpc.Channel), productRpc.Name, productRpc.Description, productRpc.LongDescription, versionFromRpc(productRpc.Version), componentDependencies, components, workloads, productRpc.DefaultInstallationPath, installableFromRpc(productRpc.Installable), iconFromRpc(productRpc.Icon), productRpc.InstallSize, languageOptions, hiddenFromRpc(productRpc.Hidden), productRpc.License, productRpc.ReleaseNotes, productRpc.ThirdPartyNotices, productRpc.RecommendSelection);
        }
        catch (error) {
            throwRpcError(error, productRpc, "product");
        }
    }
    SetupEngineRpc.productFromRpc = productFromRpc;
    function parseProgressType(progressType) {
        var parsedType = ProgressType[progressType];
        if (parsedType !== undefined) {
            return parsedType;
        }
        // default case - should we throw instead?
        return ProgressType.Unknown;
    }
    SetupEngineRpc.parseProgressType = parseProgressType;
    function parseDependencyType(dependencyType) {
        var parsedType = DependencyType[dependencyType];
        if (parsedType !== undefined) {
            return parsedType;
        }
        // default case - should we throw instead?
        return DependencyType.Optional;
    }
    SetupEngineRpc.parseDependencyType = parseDependencyType;
    function parseInstallState(installState) {
        var parsedType = InstallState[installState];
        if (parsedType !== undefined) {
            return parsedType;
        }
        // default case - should we throw instead?
        return InstallState.NotInstalled;
    }
    SetupEngineRpc.parseInstallState = parseInstallState;
    function parseSelectedState(selectedState) {
        var parsedType = SelectedState[selectedState];
        if (parsedType !== undefined) {
            return parsedType;
        }
        // default case - should we throw instead?
        return SelectedState.NotSelected;
    }
    SetupEngineRpc.parseSelectedState = parseSelectedState;
    function parseMessageType(messageType) {
        var parsedType = MessageType[messageType];
        if (parsedType !== undefined) {
            return parsedType;
        }
        throw new errors_1.InvalidParameterError("Unrecognized MessageType value '" + messageType + "'");
    }
    SetupEngineRpc.parseMessageType = parseMessageType;
    function parseActivityType(activityType) {
        var parsedType = ActivityType[activityType];
        if (parsedType !== undefined) {
            return parsedType;
        }
        throw new errors_1.InvalidParameterError("Unrecognized ActivityType value '" + activityType + "'");
    }
    SetupEngineRpc.parseActivityType = parseActivityType;
    function parseMessageResultType(messageResultType) {
        var parsedType = MessageResultTypes[messageResultType];
        if (parsedType !== undefined) {
            return parsedType;
        }
        throw new errors_1.InvalidParameterError("Unrecognized MessageResultTypes value '" + messageResultType + "'");
    }
    SetupEngineRpc.parseMessageResultType = parseMessageResultType;
    function acceptsResultTypesFromSetupEngine(acceptsResultTypes) {
        var resultTypes = productModule.MessageResultTypes.None;
        acceptsResultTypes.forEach(function (acceptsResultType) {
            /* tslint:disable:no-bitwise */
            resultTypes = resultTypes | messageResultTypesFromRpc(parseMessageResultType(acceptsResultType));
            /* tslint:enable */
        });
        return resultTypes;
    }
    SetupEngineRpc.acceptsResultTypesFromSetupEngine = acceptsResultTypesFromSetupEngine;
    function installerErrorFromRpc(installerError) {
        if (!installerError) {
            return null;
        }
        try {
            return new InstallerError_1.InstallerError({
                name: installerError.Name,
                message: installerError.Message,
                localizedMessage: installerError.LocalizedMessage,
                innerStack: installerError.Stack,
                log: installerError.LogPath,
                exitCode: 1,
            });
        }
        catch (error) {
            throwRpcError(error, installerError, "error");
        }
    }
    SetupEngineRpc.installerErrorFromRpc = installerErrorFromRpc;
    function installableFromRpc(installable) {
        return new productModule.Installable(installable.Reasons);
    }
    SetupEngineRpc.installableFromRpc = installableFromRpc;
    function installOperationResultFromRpc(result) {
        try {
            return new productModule.InstallOperationResult(installedProductFromRpc(result.Product), parseRebootType(result.RebootRequired), installerErrorFromRpc(result.Error));
        }
        catch (error) {
            throwRpcError(error, result, "installer operation result");
        }
    }
    SetupEngineRpc.installOperationResultFromRpc = installOperationResultFromRpc;
    function selectedPackageReferencesToRpc(refereces) {
        return refereces.map(selectedPackageReferenceToRpc);
    }
    SetupEngineRpc.selectedPackageReferencesToRpc = selectedPackageReferencesToRpc;
    function selectedPackageReferenceToRpc(referece) {
        return {
            PackageId: referece.packageId,
            SelectedState: SelectedState[selectedStateToRpc(referece.selectedState)]
        };
    }
    SetupEngineRpc.selectedPackageReferenceToRpc = selectedPackageReferenceToRpc;
    function modifyParametersToRpc(parameters) {
        return {
            InstallationPath: parameters.installationPath,
            Languages: parameters.languages,
            SelectedPackageReferences: selectedPackageReferencesToRpc(parameters.selectedPackageReferences),
            UpdateOnModify: parameters.updateOnModify,
            AdditionalOptions: additionalOptionsToRpc(parameters.additionalOptions),
        };
    }
    SetupEngineRpc.modifyParametersToRpc = modifyParametersToRpc;
    function updateParametersToRpc(parameters) {
        return {
            InstallationPath: parameters.installationPath,
            LayoutPath: parameters.layoutPath,
            ProductKey: parameters.productKey,
            AdditionalOptions: additionalOptionsToRpc(parameters.additionalOptions),
            UpdateFromVS: parameters.updateFromVS,
        };
    }
    SetupEngineRpc.updateParametersToRpc = updateParametersToRpc;
    function installParametersToRpc(parameters) {
        return {
            ChannelId: parameters.channelId,
            ProductId: parameters.productId,
            InstallationPath: parameters.installationPath,
            Nickname: parameters.nickname,
            LayoutPath: parameters.layoutPath,
            Languages: parameters.languages,
            SelectedPackageReferences: selectedPackageReferencesToRpc(parameters.selectedPackageReferences),
            ProductKey: parameters.productKey,
            AdditionalOptions: additionalOptionsToRpc(parameters.additionalOptions),
        };
    }
    SetupEngineRpc.installParametersToRpc = installParametersToRpc;
    function flightInfoListToRpc(flightInfo) {
        if (!flightInfo) {
            return [];
        }
        return flightInfo.map(function (info) { return flightInfoToRpc(info); });
    }
    SetupEngineRpc.flightInfoListToRpc = flightInfoListToRpc;
    function flightInfoToRpc(flightInfo) {
        return {
            Name: flightInfo.name,
            DurationInMinutes: flightInfo.durationInMinutes,
        };
    }
    SetupEngineRpc.flightInfoToRpc = flightInfoToRpc;
    function vsixReferencesToRpc(vsixs) {
        if (!vsixs) {
            return [];
        }
        return vsixs.map(function (vsix) { return vsixReferenceToRpc(vsix); });
    }
    SetupEngineRpc.vsixReferencesToRpc = vsixReferencesToRpc;
    function vsixReferenceToRpc(vsix) {
        requires.notNullOrUndefined(vsix, "vsix");
        return {
            Uri: vsix.uri,
        };
    }
    SetupEngineRpc.vsixReferenceToRpc = vsixReferenceToRpc;
    function additionalOptionsToRpc(options) {
        if (!options) {
            return null;
        }
        return {
            Vsixs: vsixReferencesToRpc(options.vsixs),
            Flights: flightInfoListToRpc(options.flights),
        };
    }
    SetupEngineRpc.additionalOptionsToRpc = additionalOptionsToRpc;
    function modifyParametersEvaluationFromRpc(evaluation) {
        try {
            return new productModule.ModifyParametersEvaluation(driveSpaceEvaluationFromRpc(evaluation.SystemDriveEvaluation), driveSpaceEvaluationFromRpc(evaluation.TargetDriveEvaluation), driveSpaceEvaluationFromRpc(evaluation.SharedDriveEvaluation));
        }
        catch (error) {
            throwRpcError(error, evaluation, "modify parameters evaluation");
        }
    }
    SetupEngineRpc.modifyParametersEvaluationFromRpc = modifyParametersEvaluationFromRpc;
    function installParametersEvaluationFromRpc(evaluation) {
        try {
            return new productModule.InstallParametersEvaluation(driveSpaceEvaluationFromRpc(evaluation.SystemDriveEvaluation), driveSpaceEvaluationFromRpc(evaluation.TargetDriveEvaluation), driveSpaceEvaluationFromRpc(evaluation.SharedDriveEvaluation), evaluation.InvalidInstallationPathMessage);
        }
        catch (error) {
            throwRpcError(error, evaluation, "install parameters evaluation");
        }
    }
    SetupEngineRpc.installParametersEvaluationFromRpc = installParametersEvaluationFromRpc;
    function progressTypeFromRpc(progressType) {
        switch (progressType) {
            default:
            case ProgressType.Unknown:
                return productModule.ProgressType.Unknown;
            case ProgressType.Download:
                return productModule.ProgressType.Download;
            case ProgressType.Install:
                return productModule.ProgressType.Install;
            case ProgressType.UninstallAll:
                return productModule.ProgressType.UninstallAll;
        }
    }
    SetupEngineRpc.progressTypeFromRpc = progressTypeFromRpc;
    function channelInfoFromRpc(channelInfo) {
        // Due to compatability reasons, name and description could be null.
        return new channelModule.ChannelInfo(channelInfo.Id, channelInfo.Name || "", channelInfo.Description || "", channelInfo.Suffix, channelInfo.IsPrerelease);
    }
    SetupEngineRpc.channelInfoFromRpc = channelInfoFromRpc;
    function channelInfoListFromRpc(channelInfoList) {
        return channelInfoList.map(function (rpcChannelInfo) { return channelInfoFromRpc(rpcChannelInfo); });
    }
    SetupEngineRpc.channelInfoListFromRpc = channelInfoListFromRpc;
    function parseRebootType(rebootRequired) {
        // Take advantage of typescript's enum lookup
        var productRebootRequired = productModule.RebootType[rebootRequired];
        if (productRebootRequired !== undefined) {
            return productRebootRequired;
        }
        throw new errors_1.InvalidParameterError("Unrecognized RebootType value '" + rebootRequired + "'");
    }
    SetupEngineRpc.parseRebootType = parseRebootType;
    function messageResultTypesToRpc(messageResultType) {
        switch (messageResultType) {
            default:
                throw new errors_1.InvalidParameterError("Unrecognized MessageResultTypes value '" + messageResultType + "'.");
            case productModule.MessageResultTypes.Abort:
                return MessageResultTypes.Abort;
            case productModule.MessageResultTypes.Cancel:
                return MessageResultTypes.Cancel;
            case productModule.MessageResultTypes.Ignore:
                return MessageResultTypes.Ignore;
            case productModule.MessageResultTypes.None:
                return MessageResultTypes.None;
            case productModule.MessageResultTypes.OK:
                return MessageResultTypes.OK;
            case productModule.MessageResultTypes.Retry:
                return MessageResultTypes.Retry;
            case productModule.MessageResultTypes.Text:
                return MessageResultTypes.Text;
        }
    }
    SetupEngineRpc.messageResultTypesToRpc = messageResultTypesToRpc;
    function messageResultTypesFromRpc(messageResultType) {
        switch (messageResultType) {
            default:
                throw new errors_1.InvalidParameterError("Unrecognized MessageResultTypes value '" + messageResultType + "'.");
            case MessageResultTypes.Abort:
                return productModule.MessageResultTypes.Abort;
            case MessageResultTypes.Cancel:
                return productModule.MessageResultTypes.Cancel;
            case MessageResultTypes.Ignore:
                return productModule.MessageResultTypes.Ignore;
            case MessageResultTypes.None:
                return productModule.MessageResultTypes.None;
            case MessageResultTypes.OK:
                return productModule.MessageResultTypes.OK;
            case MessageResultTypes.Retry:
                return productModule.MessageResultTypes.Retry;
            case MessageResultTypes.Text:
                return productModule.MessageResultTypes.Text;
        }
    }
    SetupEngineRpc.messageResultTypesFromRpc = messageResultTypesFromRpc;
    function messageFromRpc(rpcMessage) {
        try {
            return new productModule.Message(parseMessageType(rpcMessage.Type), acceptsResultTypesFromSetupEngine(rpcMessage.AcceptsResultTypes), messageResultTypesFromRpc(parseMessageResultType(rpcMessage.DefaultResultType)), rpcMessage.LocalizedString, rpcMessage.LogString, parseActivityType(rpcMessage.Activity));
        }
        catch (error) {
            throwRpcError(error, rpcMessage, "message");
        }
    }
    SetupEngineRpc.messageFromRpc = messageFromRpc;
    function messageResultToRpc(messageResult) {
        return {
            Type: MessageResultTypes[messageResultTypesToRpc(messageResult.type)],
            Result: messageResult.textValue
        };
    }
    SetupEngineRpc.messageResultToRpc = messageResultToRpc;
    function installerStatusFromRpc(rpcInstallerStatus) {
        try {
            return new installerStatusModule.InstallerStatus({
                isDisposed: rpcInstallerStatus.IsDisposed,
                rebootRequired: rpcInstallerStatus.RebootRequired,
                installationOperationRunning: rpcInstallerStatus.InstallationOperationRunning,
                blockingProcessNames: rpcInstallerStatus.BlockingProcessNames
            });
        }
        catch (error) {
            throwRpcError(error, rpcInstallerStatus, "installer status");
        }
    }
    SetupEngineRpc.installerStatusFromRpc = installerStatusFromRpc;
    function settingsToRpc(settings) {
        return {
            keepDownloadedPayloads: settings.keepDownloadedPayloads,
            noWeb: settings.noWeb,
            force: settings.force,
        };
    }
    SetupEngineRpc.settingsToRpc = settingsToRpc;
    function settingsFromRpc(rpcSettings) {
        return new productModule.Settings(rpcSettings.keepDownloadedPayloads, rpcSettings.noWeb, rpcSettings.force);
    }
    SetupEngineRpc.settingsFromRpc = settingsFromRpc;
    function driveSpaceEvaluationFromRpc(rpcDriveSpaceEvaluation) {
        // Disk drive evaluation can be null
        if (!rpcDriveSpaceEvaluation) {
            return null;
        }
        return new driveSpaceModule.DriveSpaceEvaluation(rpcDriveSpaceEvaluation.CurrentInstallSize, rpcDriveSpaceEvaluation.RequestedDeltaSize, rpcDriveSpaceEvaluation.HasSufficientDiskSpace, rpcDriveSpaceEvaluation.DriveName);
    }
    function telemetryContextToRpc(telemetryContext) {
        return {
            installSessionId: telemetryContext.installSessionId,
            serializedCorrelations: telemetryContext.serializedCorrelations,
            sessionId: telemetryContext.sessionId,
            userRequestedOperation: telemetryContext.userRequestedOperation,
        };
    }
    SetupEngineRpc.telemetryContextToRpc = telemetryContextToRpc;
    function progressInfoFromRpc(progressInfo) {
        if (!progressInfo) {
            return null;
        }
        return new productModule.ProgressInfo(progressInfo.CurrentPackage, progressInfo.TotalPackages, progressInfo.DownloadedSize, progressInfo.TotalSize, progressInfo.DownloadSpeed);
    }
    SetupEngineRpc.progressInfoFromRpc = progressInfoFromRpc;
    function clientInfoToRpc(client) {
        return {
            CampaignId: client.campaignId,
            Locale: client.locale,
            Name: client.name,
            SerializedTelemetrySession: client.serializedTelemetrySession,
            Version: client.version,
        };
    }
    SetupEngineRpc.clientInfoToRpc = clientInfoToRpc;
})(SetupEngineRpc = exports.SetupEngineRpc || (exports.SetupEngineRpc = {}));
//# sourceMappingURL=SetupEngineRpc.js.map