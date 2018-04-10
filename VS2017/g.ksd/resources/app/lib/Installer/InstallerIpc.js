"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var installerStatusModule = require("./installer-status");
var productModule = require("./Product");
var channelModule = require("./channel-info");
var errors_1 = require("../errors");
var installed_product_package_error_1 = require("./installed-product-package-error");
var installed_product_errors_1 = require("./installed-product-errors");
var driveSpaceModule = require("./drive-space-evaluation");
var operationParametersModule = require("./operation-parameters");
var installed_product_summary_result_1 = require("./installed-product-summary-result");
var vsix_reference_1 = require("./vsix-reference");
var FlightInfoModule = require("./flight-info");
/**
 * Defines the IPC serializable messages of the Installer interface.
 */
var InstallerIpc;
(function (InstallerIpc) {
    "use strict";
    // Installer.cancel(installationPath: string): Promise<void>
    InstallerIpc.CANCEL_PRODUCT_REQUEST = "INSTALLER-CANCEL-PRODUCT-REQUEST";
    InstallerIpc.CANCEL_PRODUCT_RESPONSE = "INSTALLER-CANCEL-PRODUCT-RESPONSE";
    // public getInstalledProduct(
    //     installationPath: string,
    //     withUpdatePackages?: boolean,
    //     fetchLatest?: boolean,
    //     vsixs?: VsixReference[],
    //     telemetryContext?: TelemetryContext): Promise <IInstalledProduct>
    InstallerIpc.GET_INSTALLED_PRODUCT_REQUEST = "INSTALLER-GET-INSTALLED-PRODUCT-REQUEST";
    InstallerIpc.GET_INSTALLED_PRODUCT_RESPONSE = "INSTALLER-GET-INSTALLED-PRODUCT-RESPONSE";
    // Installer.getInstalledProductSummaries(): Promise<InstalledProductSummary[]>
    InstallerIpc.GET_INSTALLED_PRODUCT_SUMMARIES_REQUEST = "INSTALLER-GET-INSTALLED-PRODUCT-SUMMARIES-REQUEST";
    InstallerIpc.GET_INSTALLED_PRODUCT_SUMMARIES_RESPONSE = "INSTALLER-GET-INSTALLED-PRODUCT-SUMMARIES-RESPONSE";
    // getProduct(
    //     channelId: string,
    //     productId: string,
    //     vsixs: VsixReference[],
    //     telemetryContext?: TelemetryContext): Promise <IProduct>
    InstallerIpc.GET_PRODUCT_REQUEST = "INSTALLER-GET-PRODUCT-REQUEST";
    InstallerIpc.GET_PRODUCT_RESPONSE = "INSTALLER-GET-PRODUCT-RESPONSE";
    // Installer.getProductSummaries(): Promise<ProductSummary[]>
    InstallerIpc.GET_PRODUCT_SUMMARIES_REQUEST = "INSTALLER-GET-PRODUCT-SUMMARIES-REQUEST";
    InstallerIpc.GET_PRODUCT_SUMMARIES_RESPONSE = "INSTALLER-GET-PRODUCT-SUMMARIES-RESPONSE";
    // Installer.getChannelInfo(): Promise<ChannelInfo[]>
    InstallerIpc.GET_CHANNEL_INFO_REQUEST = "INSTALLER-GET-CHANNEL-INFO-REQUEST";
    InstallerIpc.GET_CHANNEL_INFO_RESPONSE = "INSTALLER-GET-CHANNEL-INFO-RESPONSE";
    // Installer.removeChannel(): Promise<ProductSummary[]>
    InstallerIpc.REMOVE_CHANNEL_REQUEST = "INSTALLER-REMOVE_CHANNEL-REQUEST";
    InstallerIpc.REMOVE_CHANNEL_RESPONSE = "INSTALLER-REMOVE_CHANNEL-RESPONSE";
    // Installer.evaluateInstallParameters(parameters: InstallParameters): Promise<InstallParametersEvaluation>
    InstallerIpc.EVALUATE_INSTALL_PARAMETERS_REQUEST = "EVALUATE-INSTALL-PARAMETERS-REQUEST";
    InstallerIpc.EVALUATE_INSTALL_PARAMETERS_RESPONSE = "EVALUATE-INSTALL-PARAMETERS-RESPONSE";
    // Installer.evaluateModifyParameters(parameters: ModifyParameters): Promise<ModifyParametersEvaluation>
    InstallerIpc.EVALUATE_MODIFY_PARAMETERS_REQUEST = "EVALUATE-MODIFY-PARAMETERS-REQUEST";
    InstallerIpc.EVALUATE_MODIFY_PARAMETERS_RESPONSE = "EVALUATE-MODIFY-PARAMETERS-RESPONSE";
    // Installer.install(parameters: InstallParameters): Promise<InstalledProduct>
    InstallerIpc.INSTALL_PRODUCT_REQUEST = "INSTALLER-INSTALL-PRODUCT-REQUEST";
    InstallerIpc.INSTALL_PRODUCT_RESPONSE = "INSTALLER-INSTALL-PRODUCT-RESPONSE";
    // Installer.modify(parameters: ModifyParameters): Promise<InstalledProduct>
    InstallerIpc.MODIFY_PRODUCT_REQUEST = "INSTALLER-MODIFY-PRODUCT-REQUEST";
    InstallerIpc.MODIFY_PRODUCT_RESPONSE = "INSTALLER-MODIFY-PRODUCT-RESPONSE";
    // Installer.launch(installationPath: string): Promise<void>
    InstallerIpc.LAUNCH_PRODUCT_REQUEST = "INSTALLER-LAUNCH-PRODUCT-REQUEST";
    InstallerIpc.LAUNCH_PRODUCT_RESPONSE = "INSTALLER-LAUNCH-PRODUCT-RESPONSE";
    // Installer.uninstall(installationPath: string): Promise<void>)
    InstallerIpc.UNINSTALL_PRODUCT_REQUEST = "INSTALLER-UNINSTALL-PRODUCT-REQUEST";
    InstallerIpc.UNINSTALL_PRODUCT_RESPONSE = "INSTALLER-UNINSTALL-PRODUCT-RESPONSE";
    // Installer.update(product: InstalledProduct): Promise<InstalledProduct>
    InstallerIpc.UPDATE_PRODUCT_REQUEST = "INSTALLER-UPDATE-PRODUCT-REQUEST";
    InstallerIpc.UPDATE_PRODUCT_RESPONSE = "INSTALLER-UPDATE-PRODUCT-RESPONSE";
    // Installer.repair(installationPath: string): Promise<InstalledProduct>
    InstallerIpc.REPAIR_PRODUCT_REQUEST = "INSTALLER-REPAIR-PRODUCT-REQUEST";
    InstallerIpc.REPAIR_PRODUCT_RESPONSE = "INSTALLER-REPAIR-PRODUCT-RESPONSE";
    // Installer.resume(installationPath: string): Promise<InstalledProduct>
    InstallerIpc.RESUME_PRODUCT_REQUEST = "INSTALLER-RESUME-PRODUCT-REQUEST";
    InstallerIpc.RESUME_PRODUCT_RESPONSE = "INSTALLER-RESUME-PRODUCT-RESPONSE";
    // Installer.openLog(productSummary: IProductSummary): void
    InstallerIpc.OPEN_LOG_REQUEST = "OPEN-LOG-REQUEST";
    // Installer.deepCleanPreviewInstallations(previewInstallationPath: string): Promise<void>)
    InstallerIpc.DEEP_CLEAN_PREVIEW_INSTALLATIONS_REQUEST = "DEEP-CLEAN-PREVIEW-INSTALLATIONS-REQUEST";
    InstallerIpc.DEEP_CLEAN_PREVIEW_INSTALLATIONS_RESPONSE = "DEEP-CLEAN-PREVIEW-INSTALLATIONS-RESPONSE";
    // Installer.onProductUpdateAvailable(callback: OnUpdateAvailable): void
    // Installer.onInstalledProductUpdateAvailable(callback: OnUpdateAvailable): void
    InstallerIpc.PRODUCT_UPDATE_AVAILABLE_EVENT = "INSTALLER-PRODUCT-UPDATE-AVAILABLE-EVENT";
    InstallerIpc.INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT = "INSTALLER-INSTALLED-PRODUCT-UPDATE-AVAILABLE-EVENT";
    // Installer.onProgress(callback: OnProgressCallback): void
    InstallerIpc.PROGRESS_EVENT = "INSTALLER-PROGRESS-EVENT";
    // Installer.onNotification(callback: OnNotificationCallback): void
    InstallerIpc.NOTIFICATION_EVENT = "INSTALLER-NOTIFICATION-EVENT";
    // Installer.onMessage(message: Message): Promise<MessageResult>
    InstallerIpc.MESSAGE_REQUEST = "INSTALLER-MESSAGE-REQUEST";
    InstallerIpc.MESSAGE_RESPONSE = "INSTALLER-MESSAGE-RESPONSE";
    // Installer.getStatus(): Promise<InstallerStatus>
    InstallerIpc.GET_STATUS_REQUEST = "INSTALLER-GET-STATUS-REQUEST";
    InstallerIpc.GET_STATUS_RESPONSE = "INSTALLER-GET-STATUS-RESPONSE";
    InstallerIpc.IS_ELEVATED_REQUEST = "INSTALLER-IS-ELEVATED-REQUEST";
    InstallerIpc.IS_ELEVATED_RESPONSE = "INSTALLER-IS-ELEVATED-RESPONSE";
    InstallerIpc.LOG_PRODUCTS_WITH_OPERATION_REQUEST = "INSTALLER-LOG-PRODUCTS-WITH-OPERATION-REQUEST";
    InstallerIpc.LOG_PRODUCTS_WITH_OPERATION_RESPONSE = "INSTALLER-LOG-PRODUCTS-WITH-OPERATION-RESPONSE";
    function installedProductSummaryFromIpc(productSummary) {
        if (!productSummary) {
            return null;
        }
        return new productModule.InstalledProductSummary(productSummary.id, productSummary.installerId, channelInfoFromIpc(productSummary.channel), productSummary.name, productSummary.description, productSummary.longDescription, versionFromIpc(productSummary.version), productSummary.installationId, productSummary.installationPath, productSummary.nickname, productSummary.installState, productSummary.isUpdateAvailable, versionFromIpc(productSummary.latestVersion), iconFromIpc(productSummary.icon), productSummary.hidden, productSummary.hasPendingReboot, installedProductErrorsFromIpc(productSummary.errorDetails), productSummary.releaseNotes);
    }
    InstallerIpc.installedProductSummaryFromIpc = installedProductSummaryFromIpc;
    function installedProductSummariesFromIpc(productSummaries) {
        return productSummaries.map(installedProductSummaryFromIpc);
    }
    InstallerIpc.installedProductSummariesFromIpc = installedProductSummariesFromIpc;
    function installedProductSummaryToIpc(productSummary) {
        if (!productSummary) {
            return null;
        }
        return {
            id: productSummary.id,
            installerId: productSummary.installerId,
            channel: channelInfoToIpc(productSummary.channel),
            name: productSummary.name,
            description: productSummary.description,
            longDescription: productSummary.longDescription,
            version: versionToIpc(productSummary.version),
            installationId: productSummary.installationId,
            installationPath: productSummary.installationPath,
            nickname: productSummary.nickname,
            installState: productSummary.installState,
            isUpdateAvailable: productSummary.isUpdateAvailable,
            latestVersion: versionToIpc(productSummary.latestVersion),
            icon: iconToIpc(productSummary.icon),
            hidden: productSummary.hidden,
            hasPendingReboot: productSummary.hasPendingReboot,
            errorDetails: installedProductErrorsToIpc(productSummary.errorDetails),
            releaseNotes: productSummary.releaseNotes,
        };
    }
    InstallerIpc.installedProductSummaryToIpc = installedProductSummaryToIpc;
    function installedProductSummariesToIpc(productSummaries) {
        return productSummaries.map(installedProductSummaryToIpc);
    }
    InstallerIpc.installedProductSummariesToIpc = installedProductSummariesToIpc;
    function messageToIpc(message) {
        return {
            type: message.type,
            acceptsResultTypes: message.acceptsResultTypes,
            defaultResultType: message.defaultResultType,
            localizedString: message.localizedString,
            logString: message.logString,
            activity: message.activity,
        };
    }
    InstallerIpc.messageToIpc = messageToIpc;
    function progressInfoToIpc(progress) {
        if (!progress) {
            return null;
        }
        return {
            currentPackage: progress.currentPackage,
            totalPackages: progress.totalPackages,
            downloadedSize: progress.downloadedSize,
            totalSize: progress.totalSize,
            downloadSpeed: progress.downloadSpeed
        };
    }
    InstallerIpc.progressInfoToIpc = progressInfoToIpc;
    function progressInfoFromIpc(progress) {
        if (!progress) {
            return null;
        }
        return new productModule.ProgressInfo(progress.currentPackage, progress.totalPackages, progress.downloadedSize, progress.totalSize, progress.downloadSpeed);
    }
    InstallerIpc.progressInfoFromIpc = progressInfoFromIpc;
    function messageFromIpc(message) {
        return new productModule.Message(message.type, message.acceptsResultTypes, message.defaultResultType, message.localizedString, message.logString, message.activity);
    }
    InstallerIpc.messageFromIpc = messageFromIpc;
    function messageResultToIpc(messageResult) {
        return {
            type: messageResult.type,
            textValue: messageResult.textValue
        };
    }
    InstallerIpc.messageResultToIpc = messageResultToIpc;
    function messageResultFromIpc(messageResult) {
        return new productModule.MessageResult(messageResult.type, messageResult.textValue);
    }
    InstallerIpc.messageResultFromIpc = messageResultFromIpc;
    function componentDependencyToIpc(componentDependency) {
        return {
            id: componentDependency.id,
            type: componentDependency.type
        };
    }
    function componentDependencyFromIpc(componentDependency) {
        return new productModule.ComponentDependency(componentDependency.id, componentDependency.type);
    }
    function componentDependenciesToIpc(componentDependencies) {
        return componentDependencies.map(componentDependencyToIpc);
    }
    InstallerIpc.componentDependenciesToIpc = componentDependenciesToIpc;
    function componentDependenciesFromIpc(componentDependencies) {
        return componentDependencies.map(componentDependencyFromIpc);
    }
    function componentToIpc(component) {
        return {
            category: component.category,
            componentDependencies: componentDependenciesToIpc(component.componentDependencies),
            description: component.description,
            longDescription: component.longDescription,
            id: component.id,
            installState: component.installState,
            selectedState: component.selectedState,
            license: component.license,
            name: component.name,
            version: versionToIpc(component.version),
            installable: installableToIpc(component.installable),
            isUiGroup: component.isUiGroup
        };
    }
    function componentsToIpc(components) {
        return components.map(componentToIpc);
    }
    function languageOptionFromIpc(option) {
        var productLanguageOption = new productModule.LanguageOption(option.locale, option.isInstalled, option.isSelected);
        return productLanguageOption;
    }
    function languageOptionsFromIpc(languageOptions) {
        return languageOptions.map(languageOptionFromIpc);
    }
    function languageOptionToIpc(languageOption) {
        return {
            locale: languageOption.locale,
            isInstalled: languageOption.isInstalled,
            isSelected: languageOption.isSelected
        };
    }
    function languageOptionsToIpc(languageOptions) {
        return languageOptions.map(languageOptionToIpc);
    }
    function workloadToIpc(workload) {
        return {
            id: workload.id,
            name: workload.name,
            description: workload.description,
            longDescription: workload.longDescription,
            category: workload.category,
            installState: workload.installState,
            selectedState: workload.selectedState,
            componentDependencies: componentDependenciesToIpc(workload.componentDependencies),
            version: versionToIpc(workload.version),
            required: workload.required,
            installable: installableToIpc(workload.installable),
            icon: iconToIpc(workload.icon)
        };
    }
    function workloadFromIpc(workload, components) {
        return new productModule.Workload(workload.id, workload.name, workload.description, workload.longDescription, workload.category, workload.installState, workload.selectedState, versionFromIpc(workload.version), components, componentDependenciesFromIpc(workload.componentDependencies), workload.required, installableFromIpc(workload.installable), iconFromIpc(workload.icon));
    }
    function productComponentsFromIpc(product) {
        var components = new productModule.ComponentMap();
        product.components.forEach(function (componentIpc) {
            var component = new productModule.Component(componentIpc.id, componentIpc.name, componentIpc.description, componentIpc.longDescription, componentIpc.category, versionFromIpc(componentIpc.version), componentIpc.license, componentDependenciesFromIpc(componentIpc.componentDependencies), components, componentIpc.installState, componentIpc.selectedState, installableFromIpc(componentIpc.installable), componentIpc.isUiGroup);
            components.add(component);
        });
        var workloads = product.workloads.map(function (workload) { return workloadFromIpc(workload, components); });
        return { workloads: workloads, components: components };
    }
    function installedProductPackageErrorsFromIpc(packageErrors) {
        return packageErrors.map(function (p) { return new installed_product_package_error_1.InstalledProductPackageError(p.id, p.action, p.returnCode); });
    }
    InstallerIpc.installedProductPackageErrorsFromIpc = installedProductPackageErrorsFromIpc;
    function installedProductPackageErrorsToIpc(packageErrors) {
        return packageErrors.map(function (p) {
            return {
                id: p.id,
                action: p.action,
                returnCode: p.returnCode,
            };
        });
    }
    InstallerIpc.installedProductPackageErrorsToIpc = installedProductPackageErrorsToIpc;
    function installedProductErrorsFromIpc(errorDetails) {
        return new installed_product_errors_1.InstalledProductErrors(installedProductPackageErrorsFromIpc(errorDetails.failedPackages), errorDetails.skippedPackageIds, errorDetails.hasCorePackageFailures, errorDetails.logFilePath);
    }
    InstallerIpc.installedProductErrorsFromIpc = installedProductErrorsFromIpc;
    function installedProductErrorsToIpc(errorDetails) {
        return {
            failedPackages: installedProductPackageErrorsToIpc(errorDetails.failedPackages),
            skippedPackageIds: errorDetails.skippedPackageIds,
            hasCorePackageFailures: errorDetails.hasCorePackageFailures,
            logFilePath: errorDetails.logFilePath,
        };
    }
    InstallerIpc.installedProductErrorsToIpc = installedProductErrorsToIpc;
    function installedProductFromIpc(productIpc) {
        if (!productIpc) {
            return null;
        }
        var productComponents = productComponentsFromIpc(productIpc);
        var icon = iconFromIpc(productIpc.icon);
        var languageOptions = languageOptionsFromIpc(productIpc.languageOptions);
        return new productModule.InstalledProduct(productIpc.id, productIpc.installerId, channelInfoFromIpc(productIpc.channel), productIpc.name, productIpc.description, productIpc.longDescription, versionFromIpc(productIpc.version), componentDependenciesFromIpc(productIpc.componentDependencies), productComponents.components, productComponents.workloads, productIpc.installationId, productIpc.installationPath, productIpc.nickname, productIpc.installSize, productIpc.installState, productIpc.isUpdateAvailable, versionFromIpc(productIpc.latestVersion), icon, languageOptions, productIpc.hidden, productIpc.hasPendingReboot, installedProductErrorsFromIpc(productIpc.errorDetails), productIpc.hasUpdatePackages, productIpc.releaseNotes, productIpc.license, productIpc.thirdPartyNotices, productIpc.recommendSelection);
    }
    InstallerIpc.installedProductFromIpc = installedProductFromIpc;
    function installedProductToIpc(product) {
        if (!product) {
            return null;
        }
        var components = componentsToIpc(product.allComponents);
        var workloads = product.workloads.map(workloadToIpc);
        return {
            id: product.id,
            installerId: product.installerId,
            channel: channelInfoToIpc(product.channel),
            name: product.name,
            description: product.description,
            longDescription: product.longDescription,
            version: versionToIpc(product.version),
            components: components,
            workloads: workloads,
            componentDependencies: componentDependenciesToIpc(product.componentDependencies),
            installationId: product.installationId,
            installationPath: product.installationPath,
            nickname: product.nickname,
            installSize: product.installSize,
            installState: product.installState,
            isUpdateAvailable: product.isUpdateAvailable,
            latestVersion: versionToIpc(product.latestVersion),
            icon: iconToIpc(product.icon),
            languageOptions: languageOptionsToIpc(product.languageOptions),
            hidden: product.hidden,
            hasPendingReboot: product.hasPendingReboot,
            errorDetails: installedProductErrorsToIpc(product.errorDetails),
            releaseNotes: product.releaseNotes,
            hasUpdatePackages: product.hasUpdatePackages,
            license: product.license,
            thirdPartyNotices: product.thirdPartyNotices,
            recommendSelection: product.recommendSelection
        };
    }
    InstallerIpc.installedProductToIpc = installedProductToIpc;
    function iconFromIpc(icon) {
        if (icon) {
            return new productModule.Icon(icon.mimeType, icon.base64);
        }
        return new productModule.Icon(null, null);
    }
    InstallerIpc.iconFromIpc = iconFromIpc;
    function iconToIpc(icon) {
        if (icon) {
            return {
                mimeType: icon.mimeType,
                base64: icon.base64
            };
        }
        return {
            mimeType: null,
            base64: null
        };
    }
    InstallerIpc.iconToIpc = iconToIpc;
    function productSummaryFromIpc(productSummary) {
        return new productModule.ProductSummary(productSummary.id, productSummary.installerId, channelInfoFromIpc(productSummary.channel), productSummary.name, productSummary.description, productSummary.longDescription, versionFromIpc(productSummary.version), installableFromIpc(productSummary.installable), iconFromIpc(productSummary.icon), productSummary.hidden, productSummary.license, productSummary.releaseNotes);
    }
    InstallerIpc.productSummaryFromIpc = productSummaryFromIpc;
    function productSummariesFromIpc(productSummaries) {
        return productSummaries.map(productSummaryFromIpc);
    }
    InstallerIpc.productSummariesFromIpc = productSummariesFromIpc;
    function productSummaryToIpc(productSummary) {
        return {
            id: productSummary.id,
            installerId: productSummary.installerId,
            channel: channelInfoToIpc(productSummary.channel),
            name: productSummary.name,
            description: productSummary.description,
            longDescription: productSummary.longDescription,
            version: versionToIpc(productSummary.version),
            installable: installableToIpc(productSummary.installable),
            icon: iconToIpc(productSummary.icon),
            hidden: productSummary.hidden,
            license: productSummary.license,
            releaseNotes: productSummary.releaseNotes,
        };
    }
    InstallerIpc.productSummaryToIpc = productSummaryToIpc;
    function productSummariesToIpc(productSummaries) {
        return productSummaries.map(productSummaryToIpc);
    }
    InstallerIpc.productSummariesToIpc = productSummariesToIpc;
    function productFromIpc(product) {
        var productComponents = productComponentsFromIpc(product);
        var icon = iconFromIpc(product.icon);
        var languageOptions = languageOptionsFromIpc(product.languageOptions);
        return new productModule.Product(product.id, product.installerId, channelInfoFromIpc(product.channel), product.name, product.description, product.longDescription, versionFromIpc(product.version), product.defaultInstallDirectory, componentDependenciesFromIpc(product.componentDependencies), productComponents.components, productComponents.workloads, installableFromIpc(product.installable), icon, product.installSize, languageOptions, product.hidden, product.license, product.releaseNotes, product.thirdPartyNotices, product.recommendSelection);
    }
    InstallerIpc.productFromIpc = productFromIpc;
    function productToIpc(product) {
        var components = componentsToIpc(product.allComponents);
        var workloads = product.workloads.map(workloadToIpc);
        return {
            id: product.id,
            installerId: product.installerId,
            channel: channelInfoToIpc(product.channel),
            name: product.name,
            description: product.description,
            longDescription: product.longDescription,
            version: versionToIpc(product.version),
            defaultInstallDirectory: product.defaultInstallDirectory,
            components: components,
            workloads: workloads,
            componentDependencies: componentDependenciesToIpc(product.componentDependencies),
            installable: installableToIpc(product.installable),
            installSize: product.installSize,
            icon: iconToIpc(product.icon),
            languageOptions: languageOptionsToIpc(product.languageOptions),
            hidden: product.hidden,
            license: product.license,
            releaseNotes: product.releaseNotes,
            thirdPartyNotices: product.thirdPartyNotices,
            recommendSelection: product.recommendSelection
        };
    }
    InstallerIpc.productToIpc = productToIpc;
    function installableFromIpc(installable) {
        return new productModule.Installable(installable.reasons);
    }
    InstallerIpc.installableFromIpc = installableFromIpc;
    function installableToIpc(installable) {
        return { reasons: installable.reasons };
    }
    InstallerIpc.installableToIpc = installableToIpc;
    function installOperationResultFromIpc(result) {
        return new productModule.InstallOperationResult(installedProductFromIpc(result.product), result.rebootRequired, result.error && errors_1.CustomErrorBase.fromJson(result.error));
    }
    InstallerIpc.installOperationResultFromIpc = installOperationResultFromIpc;
    function installOperationResultToIpc(result) {
        return {
            product: installedProductToIpc(result.product),
            rebootRequired: result.rebootRequired,
            error: result.error && result.error.toJson(),
        };
    }
    InstallerIpc.installOperationResultToIpc = installOperationResultToIpc;
    function launchParametersToIpc(parameters) {
        return { product: installedProductSummaryToIpc(parameters.product) };
    }
    InstallerIpc.launchParametersToIpc = launchParametersToIpc;
    function launchParametersFromIpc(parameters) {
        return new operationParametersModule.LaunchParameters(installedProductSummaryFromIpc(parameters.product));
    }
    InstallerIpc.launchParametersFromIpc = launchParametersFromIpc;
    function uninstallParametersToIpc(parameters) {
        return { product: installedProductSummaryToIpc(parameters.product) };
    }
    InstallerIpc.uninstallParametersToIpc = uninstallParametersToIpc;
    function uninstallParametersFromIpc(parameters) {
        return new operationParametersModule.UninstallParameters(installedProductSummaryFromIpc(parameters.product));
    }
    InstallerIpc.uninstallParametersFromIpc = uninstallParametersFromIpc;
    function repairParametersToIpc(parameters) {
        return { product: installedProductSummaryToIpc(parameters.product) };
    }
    InstallerIpc.repairParametersToIpc = repairParametersToIpc;
    function repairParametersFromIpc(parameters) {
        return new operationParametersModule.RepairParameters(installedProductSummaryFromIpc(parameters.product));
    }
    InstallerIpc.repairParametersFromIpc = repairParametersFromIpc;
    function resumeParametersToIpc(parameters) {
        return { product: installedProductSummaryToIpc(parameters.product) };
    }
    InstallerIpc.resumeParametersToIpc = resumeParametersToIpc;
    function resumeParametersFromIpc(parameters) {
        return new operationParametersModule.ResumeParameters(installedProductSummaryFromIpc(parameters.product));
    }
    InstallerIpc.resumeParametersFromIpc = resumeParametersFromIpc;
    function cancelParametersToIpc(parameters) {
        return {
            product: installedProductSummaryToIpc(parameters.product),
        };
    }
    InstallerIpc.cancelParametersToIpc = cancelParametersToIpc;
    function cancelParametersFromIpc(parameters) {
        return new operationParametersModule.CancelParameters(installedProductSummaryFromIpc(parameters.product));
    }
    InstallerIpc.cancelParametersFromIpc = cancelParametersFromIpc;
    function flightInfoListToIpc(flightInfo) {
        if (!flightInfo) {
            return [];
        }
        return flightInfo.map(function (info) { return flightInfoToIpc(info); });
    }
    InstallerIpc.flightInfoListToIpc = flightInfoListToIpc;
    function flightInfoToIpc(flightInfo) {
        return {
            name: flightInfo.name,
            durationInMinutes: flightInfo.durationInMinutes,
        };
    }
    InstallerIpc.flightInfoToIpc = flightInfoToIpc;
    function flightInfoListFromIpc(flightInfo) {
        if (!flightInfo) {
            return [];
        }
        return flightInfo.map(function (info) { return flightInfoFromIpc(info); });
    }
    InstallerIpc.flightInfoListFromIpc = flightInfoListFromIpc;
    function flightInfoFromIpc(flightInfo) {
        return new FlightInfoModule.FlightInfo(flightInfo.name, flightInfo.durationInMinutes);
    }
    InstallerIpc.flightInfoFromIpc = flightInfoFromIpc;
    function vsixReferencesToIpc(vsixs) {
        if (!vsixs) {
            return [];
        }
        return vsixs.map(function (vsix) { return vsixReferenceToIpc(vsix); });
    }
    InstallerIpc.vsixReferencesToIpc = vsixReferencesToIpc;
    function vsixReferenceToIpc(vsix) {
        return {
            uri: vsix.uri,
        };
    }
    InstallerIpc.vsixReferenceToIpc = vsixReferenceToIpc;
    function vsixReferencesFromIpc(vsixs) {
        if (!vsixs) {
            return [];
        }
        return vsixs.map(function (vsix) { return vsixReferenceFromIpc(vsix); });
    }
    InstallerIpc.vsixReferencesFromIpc = vsixReferencesFromIpc;
    function vsixReferenceFromIpc(vsix) {
        return new vsix_reference_1.VsixReference(vsix.uri);
    }
    InstallerIpc.vsixReferenceFromIpc = vsixReferenceFromIpc;
    function additionalOptionsToIpc(options) {
        if (!options) {
            return null;
        }
        return {
            flights: flightInfoListToIpc(options.flights),
            vsixs: vsixReferencesToIpc(options.vsixs),
        };
    }
    InstallerIpc.additionalOptionsToIpc = additionalOptionsToIpc;
    function additionalOptionsFromIpc(options) {
        if (!options) {
            return null;
        }
        return new operationParametersModule.AdditionalOptions(vsixReferencesFromIpc(options.vsixs), flightInfoListFromIpc(options.flights));
    }
    InstallerIpc.additionalOptionsFromIpc = additionalOptionsFromIpc;
    function updateParametersToIpc(parameters) {
        return {
            product: installedProductSummaryToIpc(parameters.product),
            layoutPath: parameters.layoutPath,
            productKey: parameters.productKey,
            additionalOptions: additionalOptionsToIpc(parameters.additionalOptions),
            updateFromVS: parameters.updateFromVS,
        };
    }
    InstallerIpc.updateParametersToIpc = updateParametersToIpc;
    function updateParametersFromIpc(parameters) {
        return new operationParametersModule.UpdateParameters(installedProductSummaryFromIpc(parameters.product), parameters.layoutPath, parameters.productKey, additionalOptionsFromIpc(parameters.additionalOptions), parameters.updateFromVS);
    }
    InstallerIpc.updateParametersFromIpc = updateParametersFromIpc;
    function modifyParametersToIpc(parameters) {
        return {
            product: installedProductToIpc(parameters.product),
            updateOnModify: parameters.updateOnModify,
            additionalOptions: additionalOptionsToIpc(parameters.additionalOptions),
        };
    }
    InstallerIpc.modifyParametersToIpc = modifyParametersToIpc;
    function modifyParametersFromIpc(parameters) {
        return new operationParametersModule.ModifyParameters(installedProductFromIpc(parameters.product), parameters.updateOnModify, additionalOptionsFromIpc(parameters.additionalOptions));
    }
    InstallerIpc.modifyParametersFromIpc = modifyParametersFromIpc;
    function modifyParametersEvaluationToIpc(evaluation) {
        return {
            systemDriveEvaluation: driveSpaceEvaluationToIpc(evaluation.systemDriveEvaluation),
            targetDriveEvaluation: driveSpaceEvaluationToIpc(evaluation.targetDriveEvaluation),
            sharedDriveEvaluation: driveSpaceEvaluationToIpc(evaluation.sharedDriveEvaluation),
        };
    }
    InstallerIpc.modifyParametersEvaluationToIpc = modifyParametersEvaluationToIpc;
    function modifyParametersEvaluationFromIpc(evaluation) {
        return new productModule.ModifyParametersEvaluation(driveSpaceEvaluationFromIpc(evaluation.systemDriveEvaluation), driveSpaceEvaluationFromIpc(evaluation.targetDriveEvaluation), driveSpaceEvaluationFromIpc(evaluation.sharedDriveEvaluation));
    }
    InstallerIpc.modifyParametersEvaluationFromIpc = modifyParametersEvaluationFromIpc;
    function installParametersToIpc(parameters) {
        return {
            product: productToIpc(parameters.product),
            nickname: parameters.nickname,
            installationPath: parameters.installationPath,
            layoutPath: parameters.layoutPath,
            productKey: parameters.productKey,
            additionalOptions: additionalOptionsToIpc(parameters.additionalOptions),
        };
    }
    InstallerIpc.installParametersToIpc = installParametersToIpc;
    function installParametersFromIpc(parameters) {
        return new operationParametersModule.InstallParameters(productFromIpc(parameters.product), parameters.nickname, parameters.installationPath, parameters.layoutPath, parameters.productKey, additionalOptionsFromIpc(parameters.additionalOptions));
    }
    InstallerIpc.installParametersFromIpc = installParametersFromIpc;
    function installParametersEvaluationToIpc(evaluation) {
        return {
            systemDriveEvaluation: driveSpaceEvaluationToIpc(evaluation.systemDriveEvaluation),
            targetDriveEvaluation: driveSpaceEvaluationToIpc(evaluation.targetDriveEvaluation),
            sharedDriveEvaluation: driveSpaceEvaluationToIpc(evaluation.sharedDriveEvaluation),
            invalidInstallationPathMessage: evaluation.invalidInstallationPathMessage,
        };
    }
    InstallerIpc.installParametersEvaluationToIpc = installParametersEvaluationToIpc;
    function installParametersEvaluationFromIpc(evaluation) {
        return new productModule.InstallParametersEvaluation(driveSpaceEvaluationFromIpc(evaluation.systemDriveEvaluation), driveSpaceEvaluationFromIpc(evaluation.targetDriveEvaluation), driveSpaceEvaluationFromIpc(evaluation.sharedDriveEvaluation), evaluation.invalidInstallationPathMessage);
    }
    InstallerIpc.installParametersEvaluationFromIpc = installParametersEvaluationFromIpc;
    function channelInfoToIpc(channelInfo) {
        return {
            id: channelInfo.id,
            name: channelInfo.name,
            description: channelInfo.description,
            suffix: channelInfo.suffix,
            isPrerelease: channelInfo.isPrerelease,
        };
    }
    InstallerIpc.channelInfoToIpc = channelInfoToIpc;
    function channelInfoListToIpc(channelInfoList) {
        return channelInfoList.map(channelInfoToIpc);
    }
    InstallerIpc.channelInfoListToIpc = channelInfoListToIpc;
    function channelInfoFromIpc(channelInfo) {
        return new channelModule.ChannelInfo(channelInfo.id, channelInfo.name, channelInfo.description, channelInfo.suffix, channelInfo.isPrerelease);
    }
    InstallerIpc.channelInfoFromIpc = channelInfoFromIpc;
    function channelInfoListFromIpc(channelInfoList) {
        return channelInfoList.map(channelInfoFromIpc);
    }
    InstallerIpc.channelInfoListFromIpc = channelInfoListFromIpc;
    function installerStatusToIpc(installerStatus) {
        return {
            blockingProcessNames: installerStatus.blockingProcessNames,
            installationOperationRunning: installerStatus.installationOperationRunning,
            isDisposed: installerStatus.isDisposed,
            rebootRequired: installerStatus.rebootRequired
        };
    }
    InstallerIpc.installerStatusToIpc = installerStatusToIpc;
    function installerStatusFromIpc(installerStatus) {
        // A response from the service indicates that the request is no longer pending.
        var isPending = false;
        return new installerStatusModule.InstallerStatus({
            isPending: isPending,
            isDisposed: installerStatus.isDisposed,
            rebootRequired: installerStatus.rebootRequired,
            installationOperationRunning: installerStatus.installationOperationRunning,
            blockingProcessNames: installerStatus.blockingProcessNames
        });
    }
    InstallerIpc.installerStatusFromIpc = installerStatusFromIpc;
    function installedProductSummariesResultFromIpc(installedProductSummariesResult) {
        return new productModule.InstalledProductSummariesResult(installedProductSummariesResult.rpcErrors.map(function (error) { return errors_1.CustomErrorBase.fromJson(error); }), installedProductSummariesResult.installedProductSummaryResults.map(function (result) {
            return installedProductSummaryResultFromIpc(result);
        }));
    }
    InstallerIpc.installedProductSummariesResultFromIpc = installedProductSummariesResultFromIpc;
    function installedProductSummariesResultToIpc(installedProductSummariesResult) {
        return {
            rpcErrors: installedProductSummariesResult.rpcErrors.map(function (error) { return error.toJson(); }),
            installedProductSummaryResults: installedProductSummariesResult.installedProductSummaryResults
                .map(function (result) { return installedProductSummaryResultToIpc(result); }),
        };
    }
    InstallerIpc.installedProductSummariesResultToIpc = installedProductSummariesResultToIpc;
    function installedProductSummaryResultFromIpc(ipcResult) {
        return new installed_product_summary_result_1.InstalledProductSummaryResult(installedProductSummaryFromIpc(ipcResult.installedProductSummary), ipcResult.error && errors_1.CustomErrorBase.fromJson(ipcResult.error));
    }
    InstallerIpc.installedProductSummaryResultFromIpc = installedProductSummaryResultFromIpc;
    function installedProductSummaryResultToIpc(result) {
        return {
            error: result.error && result.error.toJson(),
            installedProductSummary: installedProductSummaryToIpc(result.productSummary),
        };
    }
    InstallerIpc.installedProductSummaryResultToIpc = installedProductSummaryResultToIpc;
    function versionFromIpc(version) {
        return new productModule.VersionBundle(version.build, version.display, version.semantic);
    }
    InstallerIpc.versionFromIpc = versionFromIpc;
    function versionToIpc(version) {
        return {
            build: version.build,
            display: version.display,
            semantic: version.semantic,
        };
    }
    InstallerIpc.versionToIpc = versionToIpc;
    function driveSpaceEvaluationToIpc(driveSpaceEvaluation) {
        // disk drive evaluation can be null
        if (!driveSpaceEvaluation) {
            return null;
        }
        return {
            currentInstallSize: driveSpaceEvaluation.currentInstallSize,
            requestedDeltaSize: driveSpaceEvaluation.requestedDeltaSize,
            hasSufficientDiskSpace: driveSpaceEvaluation.hasSufficientDiskSpace,
            driveName: driveSpaceEvaluation.driveName,
        };
    }
    function driveSpaceEvaluationFromIpc(driveSpaceEvaluation) {
        // disk drive evaluation can be null
        if (!driveSpaceEvaluation) {
            return null;
        }
        return new driveSpaceModule.DriveSpaceEvaluation(driveSpaceEvaluation.currentInstallSize, driveSpaceEvaluation.requestedDeltaSize, driveSpaceEvaluation.hasSufficientDiskSpace, driveSpaceEvaluation.driveName);
    }
    function telemtryContextToIpc(telemetryContext) {
        if (!telemetryContext) {
            return null;
        }
        return {
            initiatedFromCommandLine: telemetryContext.initiatedFromCommandLine,
            installSessionId: telemetryContext.installSessionId,
            serializedCorrelations: telemetryContext.serializedCorrelations,
            sessionId: telemetryContext.sessionId,
            userRequestedOperation: telemetryContext.userRequestedOperation,
            numberOfInstalls: telemetryContext.numberOfInstalls,
            isFirstInstallExperience: telemetryContext.isFirstInstallExperience,
            isAutolaunch: telemetryContext.isAutolaunch,
            rejectRecommendedSelection: telemetryContext.rejectRecommendedSelection,
            runningOperationToPause: telemetryContext.runningOperationToPause,
        };
    }
    InstallerIpc.telemtryContextToIpc = telemtryContextToIpc;
    function telemtryContextFromIpc(telemetryContext) {
        if (!telemetryContext) {
            return null;
        }
        return {
            initiatedFromCommandLine: telemetryContext.initiatedFromCommandLine,
            installSessionId: telemetryContext.installSessionId,
            serializedCorrelations: telemetryContext.serializedCorrelations,
            sessionId: telemetryContext.sessionId,
            userRequestedOperation: telemetryContext.userRequestedOperation,
            numberOfInstalls: telemetryContext.numberOfInstalls,
            isFirstInstallExperience: telemetryContext.isFirstInstallExperience,
            isAutolaunch: telemetryContext.isAutolaunch,
            rejectRecommendedSelection: telemetryContext.rejectRecommendedSelection,
            runningOperationToPause: telemetryContext.runningOperationToPause,
        };
    }
    InstallerIpc.telemtryContextFromIpc = telemtryContextFromIpc;
})(InstallerIpc = exports.InstallerIpc || (exports.InstallerIpc = {}));
//# sourceMappingURL=InstallerIpc.js.map