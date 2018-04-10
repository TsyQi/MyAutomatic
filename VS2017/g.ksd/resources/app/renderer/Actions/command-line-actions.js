/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var batch_selection_events_1 = require("../Events/batch-selection-events");
var error_message_response_1 = require("../interfaces/error-message-response");
var dispatcher_1 = require("../dispatcher");
var CommandLine_1 = require("../../lib/CommandLine");
var string_utilities_1 = require("../../lib/string-utilities");
var begin_command_line_operation_event_1 = require("../Events/begin-command-line-operation-event");
var complete_command_line_operation_event_1 = require("../Events/complete-command-line-operation-event");
var factory_1 = require("../stores/factory");
var InstallerActions_1 = require("./InstallerActions");
var factory_2 = require("../Installer/factory");
var language_config_1 = require("../language-config");
var Product_1 = require("../../lib/Installer/Product");
var ComponentSelectedAction_1 = require("./ComponentSelectedAction");
var UserSelectionActions_1 = require("./UserSelectionActions");
var WorkloadSelectedAction_1 = require("./WorkloadSelectedAction");
var router_1 = require("../Components/router");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var ErrorNames = require("../../lib/error-names");
var WindowActions_1 = require("./WindowActions");
var exit_details_1 = require("../../lib/exit-details");
var operation_parameters_1 = require("../../lib/Installer/operation-parameters");
function beginCommandLineOperation() {
    dispatcher_1.dispatcher.dispatch(new begin_command_line_operation_event_1.BeginCommandLineOperationEvent());
}
exports.beginCommandLineOperation = beginCommandLineOperation;
function completeCommandLineOperation() {
    dispatcher_1.dispatcher.dispatch(new complete_command_line_operation_event_1.CompleteCommandLineOperationEvent());
}
exports.completeCommandLineOperation = completeCommandLineOperation;
/* istanbul ignore next */
function selectArtifactIds(productSummary, idsToAdd, idsToRemove, installAll, installAllWorkloads, includeRecommended, includeOptional, languages, argv) {
    dispatcher_1.dispatcher.dispatch(new batch_selection_events_1.BatchSelectionStartedEvent());
    return UserSelectionActions_1.updateSelectedProduct(productSummary, languages, argv.vsixs)
        .then(function (product) {
        if (!product) {
            // when updateSelectedProduct fails to get the product...
            completeCommandLineOperation();
            dispatcher_1.dispatcher.dispatch(new batch_selection_events_1.BatchSelectionFinishedEvent([]));
            router_1.Router.goHome();
            return;
        }
        // figure out what to add
        var options = {
            checked: true,
            includeRequired: true,
            includeRecommended: includeRecommended,
            includeOptional: includeOptional,
        };
        if (installAll || installAllWorkloads) {
            // --all means ALL, including recommended and optional components;
            // override the passed-in includeRecommeded and includeOptional values
            if (installAll) {
                options.includeRecommended = true;
                options.includeOptional = true;
            }
            // select each installable workload
            product.workloads
                .filter(function (workload) { return workload.installable.state; })
                .forEach(function (workload) {
                // Bug 514911: (workaround) "hidden" components should only be selectable by --add
                var optionsCopy = Object.assign({}, options);
                if (workload.required) {
                    optionsCopy.includeOptional = false;
                }
                WorkloadSelectedAction_1.updateSelectedWorkloads(workload.id, workload.name, optionsCopy);
            });
        }
        // artifacts selected from here on should be individually selected
        options.isIndividuallySelected = true;
        // Keep a list of artifact warnings
        var artifactSelectionWarnings = [];
        // Bug 514911: (workaround) "hidden" components should only be selectable by --add
        var requiredWorkloads = product.workloads.filter(function (workload) { return workload.required; });
        var specialHiddenComponents = requiredWorkloads.reduce(function (prev, current) {
            current.optionalComponents.forEach(function (c) {
                prev.add(c);
            });
            return prev;
        }, new Set());
        // if we're installing everything, we can ignore idsToAdd altogether, just select all
        // installable components that aren't groups and aren't already selected
        if (installAll) {
            var components = product.allComponents
                .filter(function (component) {
                return component.installable.state
                    && !component.isUiGroup
                    && (component.selectedState === Product_1.SelectedState.NotSelected)
                    && !specialHiddenComponents.has(component);
            });
            ComponentSelectedAction_1.updateSelectedComponents(components, options);
        }
        else {
            idsToAdd.forEach(function (idToAdd) {
                // convert idToAdd into a workload or component to select
                var result = lookupArtifact(product, idToAdd);
                if (result.artifact) {
                    // include recommended commponents if we're doing so globally or if the artifact
                    // ID was annotated with ";includeRecommended"
                    options.includeRecommended = includeRecommended || result.includeRecommended;
                    // include optional commponents if we're doing so globally or if the artifact
                    // ID was annotated with ";includeOptional"
                    options.includeOptional = includeOptional || result.includeOptional;
                    if (result.isWorkload) {
                        var workload = result.artifact;
                        if (!workload.installable.state) {
                            var artifactWarning = new Product_1.ArtifactSelectionWarning(workload.id, workload.installable.reasons[0]);
                            artifactSelectionWarnings.push(artifactWarning);
                        }
                        else {
                            // Bug 514911: (workaround) "hidden" components should only be selectable by --add
                            var optionsCopy = Object.assign({}, options);
                            if (workload.required) {
                                optionsCopy.includeOptional = false;
                            }
                            WorkloadSelectedAction_1.updateSelectedWorkloads(workload.id, workload.name, optionsCopy);
                        }
                    }
                    else {
                        var component = result.artifact;
                        if (component.isUiGroup) {
                            options.isIndividuallySelected = false;
                        }
                        else {
                            options.isIndividuallySelected = true;
                        }
                        if (!component.installable.state) {
                            var artifactWarning = new Product_1.ArtifactSelectionWarning(component.id, component.installable.reasons[0]);
                            artifactSelectionWarnings.push(artifactWarning);
                        }
                        else {
                            ComponentSelectedAction_1.updateSelectedComponents(result.artifact, options);
                        }
                    }
                }
                else {
                    var artifactWarning = new Product_1.ArtifactSelectionWarning(idToAdd, ResourceStrings_1.ResourceStrings.invalidArtifactId);
                    artifactSelectionWarnings.push(artifactWarning);
                }
            });
        }
        options.checked = false;
        options.includeRecommended = true;
        options.includeOptional = false;
        // figure out what to remove
        var workloadsToRemove = [];
        var componentsToRemove = [];
        idsToRemove.forEach(function (idToRemove) {
            // convert id into a workload or component to deselect
            var result = lookupArtifact(product, idToRemove);
            if (result.artifact) {
                if (result.isWorkload) {
                    workloadsToRemove.push(result.artifact);
                }
                else {
                    componentsToRemove.push(result.artifact);
                }
            }
        });
        // Remove workloads first, so that we don't inadvertantly orphan any
        // when the components are also removed.
        workloadsToRemove.forEach(function (workload) {
            WorkloadSelectedAction_1.updateSelectedWorkloads(workload.id, workload.name, options);
        });
        // Deselect components in batch.
        ComponentSelectedAction_1.updateSelectedComponents(componentsToRemove, options);
        dispatcher_1.dispatcher.dispatch(new batch_selection_events_1.BatchSelectionFinishedEvent(artifactSelectionWarnings));
    })
        .catch(function (error) {
        var errorMessage = error ? error.localizedMessage || error.message : "";
        var artifactSelectionWarning = new Product_1.ArtifactSelectionWarning(productSummary.id, errorMessage);
        dispatcher_1.dispatcher.dispatch(new batch_selection_events_1.BatchSelectionFinishedEvent([artifactSelectionWarning]));
    });
}
exports.selectArtifactIds = selectArtifactIds;
/* istanbul ignore next */
function lookupArtifact(product, id) {
    var includeRecommended = false;
    var includeOptional = false;
    // examine the id for ";includeRecommeded" and ";includeOptional"
    var includeRecommendedDecorator = ";" + CommandLine_1.OptionNames.includeRecommended;
    var includeOptionalDecorator = ";" + CommandLine_1.OptionNames.includeOptional;
    while (true) {
        if (id.endsWith(includeRecommendedDecorator)) {
            includeRecommended = true;
            id = id.substring(0, id.length - includeRecommendedDecorator.length);
        }
        else if (id.endsWith(includeOptionalDecorator)) {
            includeOptional = true;
            id = id.substring(0, id.length - includeOptionalDecorator.length);
        }
        else {
            break;
        }
    }
    var artifact = null;
    var isWorkload;
    // is the artifact a workload?
    var index = product.workloads.findIndex(function (workload) { return string_utilities_1.caseInsensitiveAreEqual(workload.id, id); });
    if (index >= 0) {
        artifact = product.workloads[index];
        isWorkload = true;
    }
    else {
        // the artifact isn't a workload, is it a component?
        index = product.allComponents.findIndex(function (component) { return string_utilities_1.caseInsensitiveAreEqual(component.id, id); });
        if (index >= 0) {
            artifact = product.allComponents[index];
        }
    }
    return { artifact: artifact, isWorkload: isWorkload, includeRecommended: includeRecommended, includeOptional: includeOptional };
}
/* istanbul ignore next */
function handleCommandLineOperation(argv, appLocale, productSummary, showNickname, telemetryContext) {
    telemetryContext.initiatedFromCommandLine = true; // always from the command line if we are here.
    var additionalOptions = new operation_parameters_1.AdditionalOptions(argv.vsixs, argv.flights);
    var params = {
        isQuietOrPassive: argv.quiet || argv.passive,
        telemetryContext: telemetryContext,
        testMode: argv.testMode,
        additionalOptions: additionalOptions,
    };
    var languages = new language_config_1.LanguageConfig(argv.languagesToAdd, argv.languagesToRemove, appLocale);
    // Show an error if productSummary is null.
    if (!productSummary) {
        // Transition through the states to prevent re-entrancy.
        beginCommandLineOperation();
        completeCommandLineOperation();
        handleNoProductFoundError(argv);
        return;
    }
    var installedProductSummary = productSummary;
    switch (argv.command) {
        case CommandLine_1.CommandNames.install:
            // If an InstalledProductSummary was provided, handle it differently.
            if (Product_1.isTypeOfInstalledProduct(productSummary)) {
                handleCommandLineInstallForInstalledProduct(argv, productSummary, appLocale, telemetryContext);
                break;
            }
            // Otherwise, perform new install using the product summary.
            beginCommandLineOperation();
            selectArtifactIds(productSummary, argv.idsToAdd, argv.idsToRemove, argv.all, argv.allWorkloads, argv.includeRecommended, argv.includeOptional, languages, argv);
            var resetSelections = false;
            router_1.Router.goInstall(productSummary, resetSelections, argv.nickname, showNickname);
            break;
        case CommandLine_1.CommandNames.modify:
            beginCommandLineOperation();
            selectArtifactIds(productSummary, argv.idsToAdd, argv.idsToRemove, argv.all, argv.allWorkloads, argv.includeRecommended, argv.includeOptional, languages, argv);
            router_1.Router.goModify(installedProductSummary, false /* resetSelections */);
            break;
        case CommandLine_1.CommandNames.repair:
            beginCommandLineOperation();
            InstallerActions_1.repair(installedProductSummary, params);
            completeCommandLineOperation();
            break;
        case CommandLine_1.CommandNames.resume:
            beginCommandLineOperation();
            InstallerActions_1.resume(installedProductSummary, params);
            completeCommandLineOperation();
            break;
        case CommandLine_1.CommandNames.uninstall:
            beginCommandLineOperation();
            handleUninstall(productSummary, params);
            completeCommandLineOperation();
            break;
        case CommandLine_1.CommandNames.update:
            beginCommandLineOperation();
            // We need to ensure that the latest channel is fetched
            // and the latest catalog is downloaded.
            var fetchLatest = true;
            var withUpdatePackages = true;
            var getInstalledProductPromise = factory_2.installerProxy.getInstalledProduct(installedProductSummary.installationPath, withUpdatePackages, fetchLatest, argv.vsixs);
            getInstalledProductPromise
                .then(function (installedProduct) {
                if (!installedProduct.isUpdateAvailable) {
                    completeCommandLineOperation();
                    handleNoUpdateFound(argv);
                    return;
                }
                InstallerActions_1.update(installedProductSummary, params, argv.productKey, argv.force, argv.layoutPath);
                completeCommandLineOperation();
            }, function (error) {
                completeCommandLineOperation();
                showCmdLineError(argv.quiet || argv.passive, [error.message], "Failed to get installed product", false /* success */);
            });
            break;
        default:
            // Transition through the states to prevent re-entrancy.
            beginCommandLineOperation();
            completeCommandLineOperation();
            var errorOptions = {
                message: ResourceStrings_1.ResourceStrings.unsupportedCommandOnCommandLine(argv.command),
                errorName: ErrorNames.UNSUPPORTED_COMMAND
            };
            factory_1.errorStore.show(errorOptions);
            break;
    }
}
exports.handleCommandLineOperation = handleCommandLineOperation;
/* istanbul ignore next */
function handleUninstall(install, params) {
    var asInstalled = install;
    var targetedProduct = asInstalled.name;
    var installPath = asInstalled.installationPath;
    var options = {
        title: ResourceStrings_1.ResourceStrings.uninstallWarningTitle,
        message: [
            ResourceStrings_1.ResourceStrings.uninstallWarningMessage,
            "",
            targetedProduct,
            installPath,
            "",
            ResourceStrings_1.ResourceStrings.clickOKToContinueMessage,
        ],
        allowCancel: true,
        isCancelDefault: true,
        errorName: ErrorNames.UNINSTALL_PROMPT_ERROR_NAME,
    };
    params.telemetryContext.initiatedFromCommandLine = true;
    factory_1.errorStore.show(options)
        .then(function (response) {
        if (response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
            InstallerActions_1.uninstall(asInstalled, params);
        }
    });
}
/* istanbul ignore next */
function handleNoProductFoundError(argv) {
    // We didn't find a matching product or installed product.
    var isInstall = argv.command === CommandLine_1.CommandNames.install;
    var messageStart = isInstall ? ResourceStrings_1.ResourceStrings.noMatchingProduct : ResourceStrings_1.ResourceStrings.noMatchingInstalledProduct;
    var message = formatParameters(messageStart, argv);
    var errorName = ErrorNames.MATCHING_PRODUCT_NOT_FOUND_ERROR_NAME;
    var success = false;
    showCmdLineError(argv.quiet || argv.passive, message, errorName, success);
}
function handleNoUpdateFound(argv) {
    var messageStart = ResourceStrings_1.ResourceStrings.updateNotAvailable;
    var message = formatParameters(messageStart, argv);
    var errorName = ErrorNames.NO_UPDATE;
    var success = true;
    showCmdLineError(argv.quiet || argv.passive, message, errorName, success);
}
/* istanbul ignore next */
function showCmdLineError(isQuietOrPassive, message, errorName, success) {
    if (isQuietOrPassive) {
        var errorMessage = message.filter(function (line) { return line && line.length > 0; }).join(" ");
        var exitCode = (success === true) ? 0 : 1;
        WindowActions_1.windowActions.closeWindow(exit_details_1.CreateCustomExitDetails(errorName, errorMessage, exitCode));
    }
    else {
        var errorOptions = {
            message: message,
            errorName: errorName,
        };
        factory_1.errorStore.show(errorOptions);
    }
}
function formatParameters(messageStart, argv) {
    var message = [
        messageStart,
        "" // force a <br /> between messages
    ];
    var isInstall = argv.command === CommandLine_1.CommandNames.install;
    if (!isInstall && argv.installPath) {
        message.push(ResourceStrings_1.ResourceStrings.formatParameter(CommandLine_1.OptionNames.installPath, argv.installPath));
    }
    else {
        // if this is an install command, we want to display the channelId and productId, not installPath
        message.push(ResourceStrings_1.ResourceStrings.formatParameter(CommandLine_1.OptionNames.channelId, argv.channelId));
        message.push(ResourceStrings_1.ResourceStrings.formatParameter(CommandLine_1.OptionNames.productId, argv.productId));
    }
    return message;
}
/* istanbul ignore next */
function handleCommandLineInstallForInstalledProduct(argv, installedProductSummary, appLocale, telemetryContext) {
    // if left true, complete will be called in the finally
    var shouldCompleteOperation = true;
    beginCommandLineOperation();
    try {
        if (Product_1.isPreviewProduct(installedProductSummary)) {
            return;
        }
        // If the installed product has an update available, prompt the user to update now; otherwise
        // if there are any components to add/remove, go to modify. If neither condition is true, do nothing.
        if (installedProductSummary.isUpdateAvailable) {
            var productName = installedProductSummary.displayNameWithNickname;
            var options = {
                title: ResourceStrings_1.ResourceStrings.updateAvailable,
                message: [
                    "",
                    ResourceStrings_1.ResourceStrings.productIsAlreadyInstalled(productName),
                    ResourceStrings_1.ResourceStrings.clickToUpdateProduct(ResourceStrings_1.ResourceStrings.update, installedProductSummary.latestVersion.display)
                ],
                okButtonText: ResourceStrings_1.ResourceStrings.update,
                allowCancel: true,
                errorName: ErrorNames.PRODUCT_HAS_UPDATE_ERROR_NAME,
            };
            factory_1.errorStore.show(options)
                .then(function (response) {
                if (response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                    var additionalOptions = new operation_parameters_1.AdditionalOptions(argv.vsixs, argv.flights);
                    var params = {
                        isQuietOrPassive: argv.quiet || argv.passive,
                        telemetryContext: telemetryContext,
                        testMode: argv.testMode,
                        additionalOptions: additionalOptions
                    };
                    InstallerActions_1.update(installedProductSummary, params, argv.productKey, argv.force, argv.layoutPath);
                }
            });
        }
        else if (argv.idsToAdd.length || argv.idsToRemove.length) {
            // If not an update and component selection is changing, show the modify page.
            shouldCompleteOperation = false;
            var languages = new language_config_1.LanguageConfig(argv.languagesToAdd, argv.languagesToRemove, appLocale);
            selectArtifactIds(installedProductSummary, argv.idsToAdd, argv.idsToRemove, argv.all, argv.allWorkloads, argv.includeRecommended, argv.includeOptional, languages, argv);
            router_1.Router.goModify(installedProductSummary, false /* resetSelections */);
        }
        else {
            // noop
        }
    }
    finally {
        if (shouldCompleteOperation) {
            completeCommandLineOperation();
        }
    }
}
//# sourceMappingURL=command-line-actions.js.map