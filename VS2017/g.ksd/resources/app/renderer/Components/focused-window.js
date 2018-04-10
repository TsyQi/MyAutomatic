/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
/// <reference path="../bower_components/riot-ts/riot-ts.d.ts" />
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var factory_1 = require("../stores/factory");
var ComponentSelectedAction_1 = require("../Actions/ComponentSelectedAction");
var css_styles_1 = require("../css-styles");
var InstallerActions_1 = require("../Actions/InstallerActions");
var html_document_loader_1 = require("../html-document-loader");
var Product_1 = require("../../lib/Installer/Product");
var progress_calculator_1 = require("../progress-calculator");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var CommandLine_1 = require("../../lib/CommandLine");
var string_utilities_1 = require("../../lib/string-utilities");
var UserSelectionActions_1 = require("../Actions/UserSelectionActions");
var Utilities_1 = require("../Utilities");
var command_line_actions_1 = require("../Actions/command-line-actions");
var WindowActions_1 = require("../Actions/WindowActions");
var window_options_1 = require("../../lib/window-options");
var WorkloadSelectedAction_1 = require("../Actions/WorkloadSelectedAction");
var language_config_1 = require("../language-config");
var path_utilities_1 = require("../path-utilities");
var router_1 = require("./router");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var exit_details_1 = require("../../lib/exit-details");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
var apply_mixins_1 = require("../mixins/apply-mixins");
var operation_parameters_1 = require("../../lib/Installer/operation-parameters");
require("./app-header");
require("./error-dialog");
require("./license-terms-text");
require("./loading-view");
require("./progress-view");
var FocusedInstallOperation;
(function (FocusedInstallOperation) {
    FocusedInstallOperation[FocusedInstallOperation["Unknown"] = 0] = "Unknown";
    FocusedInstallOperation[FocusedInstallOperation["Install"] = 1] = "Install";
    FocusedInstallOperation[FocusedInstallOperation["Modify"] = 2] = "Modify";
})(FocusedInstallOperation || (FocusedInstallOperation = {}));
var FocusedInstallState;
(function (FocusedInstallState) {
    FocusedInstallState[FocusedInstallState["Loading"] = 0] = "Loading";
    FocusedInstallState[FocusedInstallState["NotStarted"] = 1] = "NotStarted";
    FocusedInstallState[FocusedInstallState["Started"] = 2] = "Started";
    FocusedInstallState[FocusedInstallState["InProgress"] = 3] = "InProgress";
    FocusedInstallState[FocusedInstallState["Completed"] = 4] = "Completed";
    FocusedInstallState[FocusedInstallState["Paused"] = 5] = "Paused";
})(FocusedInstallState || (FocusedInstallState = {}));
var FocusedWindow = /** @class */ (function (_super) {
    __extends(FocusedWindow, _super);
    function FocusedWindow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onAppStoreUpdateBind = _this.onAppStoreUpdate.bind(_this);
        _this._onProductConfigurationStoreUpdateBind = _this.onProductConfigurationStoreUpdate.bind(_this);
        _this._onErrorStoreUpdateBind = _this.onErrorStoreUpdate.bind(_this);
        _this._operation = FocusedInstallOperation.Unknown;
        _this._installState = FocusedInstallState.Loading;
        _this._progressCalculator = new progress_calculator_1.ProgressCalculator(factory_1.appStore);
        _this._showLaunchPrompt = false;
        _this._customDocumentLoadEvent = "customDocumentLoad";
        return _this;
    }
    FocusedWindow.initialize = function () {
        switch (factory_1.appStore.argv.command) {
            case CommandLine_1.CommandNames.install:
                var languages = new language_config_1.LanguageConfig(factory_1.appStore.argv.languagesToAdd, factory_1.appStore.argv.languagesToRemove, factory_1.appStore.appLocale);
                // get product summaries so our nickname validation will work
                InstallerActions_1.getProductSummaries();
                // get and select the product identified by channelId/productId
                UserSelectionActions_1.updateSelectedProductById(factory_1.appStore.argv.channelId, factory_1.appStore.argv.productId, languages, factory_1.appStore.argv.vsixs);
                break;
            case CommandLine_1.CommandNames.modify:
                // get and select the installed product located at the command line specified installation path
                UserSelectionActions_1.updateSelectedInstalledProductForPath(factory_1.appStore.argv.installPath, factory_1.appStore.argv.vsixs);
                break;
        }
    };
    FocusedWindow.prototype.mounted = function () {
        // Initialize installOperation based on the command line parameters.  We may try to install
        // a product that's already installed, in which case the operation should morph into a modify.
        // This will transition will happen in onProductConfigurationStoreUpdate if we discover that
        // the selectedProduct is already installed.
        switch (factory_1.appStore.argv.command) {
            case CommandLine_1.CommandNames.install:
                this.operation = FocusedInstallOperation.Install;
                break;
            case CommandLine_1.CommandNames.modify:
                this.operation = FocusedInstallOperation.Modify;
                break;
        }
        this.hookEvents(true);
        this.setWindowTitle();
        WindowActions_1.windowActions.startListeningForWindowClose(window);
    };
    FocusedWindow.prototype.unmounted = function () {
        this.hookEvents(false);
        WindowActions_1.windowActions.stopListeningForWindowClose(window);
    };
    FocusedWindow.prototype.updated = function () {
        var elementToFocus;
        if (this._installState === FocusedInstallState.Loading && !this.isLoading) {
            this._installState = FocusedInstallState.NotStarted;
            elementToFocus = document.getElementById(this.focusUiReasonTextId);
        }
        if (this._installState === FocusedInstallState.Started) {
            this._installState = FocusedInstallState.InProgress;
            elementToFocus = document.getElementById(this.progressViewId);
        }
        if (this.hasUpdateCompleted) {
            elementToFocus = document.getElementById(this.completedMessageId);
        }
        if (elementToFocus) {
            elementToFocus.focus();
        }
    };
    FocusedWindow.prototype.onAppStoreUpdate = function () {
        var pendingAppClosure = factory_1.appStore.pendingAppClosure;
        if (pendingAppClosure && pendingAppClosure.isAppClosurePending) {
            WindowActions_1.windowActions.quitApp(exit_details_1.CreateCustomExitDetails(null, null, pendingAppClosure.exitCode));
        }
        // We clicked pause and the pause operation finished, so close the window
        if (this.isOperationPaused && !factory_1.appStore.isOperationInProgress) {
            WindowActions_1.windowActions.closeWindow(exit_details_1.CreateSuccessExitDetails());
        }
        this.updateInstallState();
        this.scheduleUpdate();
    };
    FocusedWindow.prototype.onProductConfigurationStoreUpdate = function () {
        var _this = this;
        if (!this._workloadsToAdd || !this._componentsToAdd) {
            var product = this.selectedProduct;
            if (product) {
                var requestedOperation = this.operationNameFromOperation();
                // if the product is already installed ensure we're performing a modify operation,
                // regardless of the command line parameters
                if (product instanceof Product_1.InstalledProduct) {
                    this.operation = FocusedInstallOperation.Modify;
                }
                var telemetryProxy = new TelemetryProxy_1.TelemetryProxy();
                var result = vs_telemetry_api_1.TelemetryResult.None;
                var summary = "";
                var properties = {
                    requestedOperation: requestedOperation,
                    actualOperation: this.operationNameFromOperation(),
                };
                telemetryProxy.postOperation(TelemetryEventNames.SHOW_FOCUSED_UI, result, summary, properties);
                var idsToAdd_1 = factory_1.appStore.argv.idsToAdd;
                // Currently, there is no way to specify languages via command line for the focused ui
                // and there is no UI to change it. For now, just reselect the installed langs.
                product.languageOptions.forEach(function (language) {
                    if (language.isInstalled) {
                        language.isSelected = true;
                    }
                });
                // filter down the set of workloads and components to install to those that are not
                // currently installed and not hidden/required.
                this._workloadsToAdd = product.workloads
                    .filter(function (workload) { return workload.installState !== Product_1.InstallState.Installed
                    && !workload.required
                    && (idsToAdd_1.some(function (id) { return string_utilities_1.caseInsensitiveAreEqual(id, workload.id); })
                        || workload.selectedState !== Product_1.SelectedState.NotSelected); });
                this._componentsToAdd = product.allComponents
                    .filter(function (component) { return component.installState !== Product_1.InstallState.Installed
                    && component.visible
                    && (idsToAdd_1.some(function (id) { return string_utilities_1.caseInsensitiveAreEqual(id, component.id); })
                        || component.selectedState !== Product_1.SelectedState.NotSelected); });
                if (this.isModifyOperation && !this._workloadsToAdd.length && !this._componentsToAdd.length) {
                    this._showLaunchPrompt = true;
                }
                else {
                    // update the installed product configuration to select the workloads and
                    // components to install
                    // defer invoking the actions that will result in the store dispatching change events
                    // which may result in recursing this store change handler
                    setImmediate(function () {
                        var options = {
                            checked: true,
                            includeRequired: true,
                            includeRecommended: true,
                            includeOptional: false,
                            isIndividuallySelected: true,
                        };
                        _this._workloadsToAdd.forEach(function (workload) {
                            WorkloadSelectedAction_1.updateSelectedWorkloads(workload.id, workload.name, options);
                        });
                        _this._componentsToAdd.forEach(function (component) { return ComponentSelectedAction_1.updateSelectedComponents(component, options); });
                        // The product is now loaded and selected, so check the install parameters.
                        _this.checkInstallParameters();
                    });
                }
            }
        }
        this.scheduleUpdate();
    };
    Object.defineProperty(FocusedWindow.prototype, "completedMessageId", {
        get: function () {
            return "completed-message";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "modifyingAriaLabel", {
        get: function () {
            if (this.selectedProduct) {
                return ResourceStrings_1.ResourceStrings.modifying(this.selectedProduct.name);
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "progressViewId", {
        get: function () {
            return "progress-view";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "focusUiReasonTextId", {
        get: function () {
            return "focused-ui-reason-text";
        },
        enumerable: true,
        configurable: true
    });
    FocusedWindow.prototype.onErrorStoreUpdate = function () {
        this.scheduleUpdate();
    };
    Object.defineProperty(FocusedWindow.prototype, "acceptErrorCallback", {
        get: function () {
            return factory_1.errorStore.dismiss;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "branch", {
        get: function () {
            return factory_1.appStore.branch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "errorDialogMessage", {
        get: function () {
            return factory_1.errorStore.currentMessageData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "isErrorDialogVisible", {
        get: function () {
            return factory_1.errorStore.isErrorVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "pauseButtonText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.pause;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "closeButtonText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.closeButtonTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "launchButtonText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.launch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "launchPromptText", {
        get: function () {
            if (this.selectedProduct) {
                return ResourceStrings_1.ResourceStrings.focusedUiLaunchPrompt;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "showLaunchPrompt", {
        get: function () {
            return this._showLaunchPrompt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "installButtonText", {
        get: function () {
            return this.isModifyOperation ? ResourceStrings_1.ResourceStrings.install : ResourceStrings_1.ResourceStrings.continue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "isLoading", {
        get: function () {
            return !this.selectedProduct;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "selectedProduct", {
        get: function () {
            return factory_1.productConfigurationStore.getSelectedProduct();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "namesOfWorkloadsToAdd", {
        get: function () {
            return (this._workloadsToAdd || []).map(function (workload) { return workload.name; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "namesOfComponentsToAdd", {
        get: function () {
            return (this._componentsToAdd || []).map(function (component) { return component.displayedName; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "accessibilityLogStrings", {
        get: function () {
            return factory_1.appStore.accessibilityLogStrings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "productName", {
        get: function () {
            return (this.selectedProduct) ? this.selectedProduct.name : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "loadingText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.gettingThingsReady;
        },
        enumerable: true,
        configurable: true
    });
    FocusedWindow.prototype.installClicked = function () {
        this._installState = FocusedInstallState.Started;
        if (this.canInstall) {
            var argv = factory_1.appStore.argv;
            var operation = this.operationNameFromOperation();
            var vsixs = argv.vsixs;
            var flightInfo = argv.flights;
            var additionalOptions = new operation_parameters_1.AdditionalOptions(vsixs, flightInfo);
            var params = {
                isQuietOrPassive: argv.quiet || argv.passive,
                telemetryContext: factory_1.appStore.createTelemetryContext(operation),
                testMode: argv.testMode,
                additionalOptions: additionalOptions,
            };
            if (this.isInstallOperation) {
                command_line_actions_1.beginCommandLineOperation();
                InstallerActions_1.install(this.selectedProduct, params, this._nickname, this._installPath, factory_1.appStore.argv.layoutPath, factory_1.appStore.argv.productKey);
                // transition to the full UI to show progress
                this.loadFullUI().then(function () {
                    router_1.Router.goHome();
                    command_line_actions_1.completeCommandLineOperation();
                });
            }
            else {
                InstallerActions_1.modify(this.selectedProduct, params);
            }
        }
        else {
            this._installState = FocusedInstallState.Paused;
        }
        this.scheduleUpdate();
    };
    FocusedWindow.prototype.pauseClicked = function () {
        this._installState = FocusedInstallState.Paused;
        var operation = "cancel";
        InstallerActions_1.pauseOperation(this.selectedProduct, factory_1.appStore.createTelemetryContext(operation));
    };
    FocusedWindow.prototype.closeClicked = function () {
        WindowActions_1.windowActions.closeWindow(exit_details_1.CreateSuccessExitDetails());
    };
    FocusedWindow.prototype.launchClicked = function () {
        var product = this.selectedProduct;
        if (product) {
            var telemetryContext = factory_1.appStore.createTelemetryContext("launch");
            InstallerActions_1.launch(product, telemetryContext);
        }
    };
    Object.defineProperty(FocusedWindow.prototype, "installSizeText", {
        get: function () {
            if (!isNaN(this.installSize)) {
                return ResourceStrings_1.ResourceStrings.installSize(Utilities_1.formatSizeText(this.installSize));
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "isOperationPaused", {
        get: function () {
            return this._installState === FocusedInstallState.Paused;
        },
        enumerable: true,
        configurable: true
    });
    FocusedWindow.prototype.onCustomizeInstall = function (ev) {
        // Don't let Riot auto update from the click event,
        // since loadDocument will blow away the DOM anyway.
        ev.preventUpdate = true;
        var telemetryProxy = new TelemetryProxy_1.TelemetryProxy();
        var result = vs_telemetry_api_1.TelemetryResult.None;
        var summary = "";
        var properties = { operation: this.operationNameFromOperation() };
        telemetryProxy.postOperation(TelemetryEventNames.CUSTOMIZE_FROM_FOCUSED_UI, result, summary, properties);
        this.loadFullUI();
    };
    Object.defineProperty(FocusedWindow.prototype, "customizeInstallText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.customizeInstall;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "workloadsHeaderText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.workloadsHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "componentsHeaderText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.individualComponentsHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "focusUiReasonText", {
        get: function () {
            return this.isModifyOperation ? ResourceStrings_1.ResourceStrings.focusUiReason : ResourceStrings_1.ResourceStrings.focusUiReason_install;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "downloadProgressBar", {
        get: function () {
            var displayType = this.isOperationPaused ? progress_calculator_1.ProgressDisplayType.PausingDownload : progress_calculator_1.ProgressDisplayType.Download;
            return this.getProgressDetails(displayType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "installProgressBar", {
        get: function () {
            var displayType = this.isOperationPaused ? progress_calculator_1.ProgressDisplayType.PausingInstall : progress_calculator_1.ProgressDisplayType.Install;
            return this.getProgressDetails(displayType);
        },
        enumerable: true,
        configurable: true
    });
    FocusedWindow.prototype.getProgressDetails = function (displayType) {
        var product = this.selectedProduct;
        if (!product) {
            return { type: displayType, message: "", progress: 0 };
        }
        var installationPath = this.isInstallOperation
            ? this._installPath
            : product.installationPath;
        return {
            type: displayType,
            progress: this._progressCalculator.getProgress(installationPath, displayType),
            message: this._progressCalculator.getProgressMessage(installationPath, displayType)
        };
    };
    Object.defineProperty(FocusedWindow.prototype, "hasUpdateStarted", {
        get: function () {
            return this._installState !== FocusedInstallState.NotStarted &&
                this._installState !== FocusedInstallState.Loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "isOperationInProgress", {
        get: function () {
            return this._installState === FocusedInstallState.Started ||
                this._installState === FocusedInstallState.InProgress ||
                factory_1.appStore.isModifyInProgress ||
                this._installState === FocusedInstallState.Paused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "hasUpdateCompleted", {
        get: function () {
            return this._installState === FocusedInstallState.Completed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "completedMessageText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.focusedWindowCompleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "focusedWindowDivStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                fontSize: ".75rem",
                height: "100%",
                overflow: "auto"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "progressViewDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flex: "1 0 auto",
                justifyContent: "center",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "launchPromptDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flex: "1 0 0",
                flexDirection: "column",
                justifyContent: "center",
                overflow: "hidden",
                padding: "16px 24px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "launchPromptTextDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flex: "1 0 auto",
                textAlign: "center",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "launchButtonDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "updatingDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flex: "1 0 0",
                flexDirection: "column",
                justifyContent: "center",
                padding: "16px 24px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "titleBarStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "30px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "noDragDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "1 0 0",
                flexDirection: "column",
                webkitAppRegion: "no-drag"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "focusPageDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                padding: "0px 24px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "focusBodyStyleDiv", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "1 0 0",
                flexDirection: "column"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "alertStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 1 100%",
                paddingBottom: "5px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "focusPageButtonsDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "flex-end",
                display: "flex",
                flex: "0 0 auto",
                justifyContent: "flex-end",
                padding: "16px 0px",
                flexDirection: "column",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "buttonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                webkitMarginStart: "6px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "listStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                flexGrow: "1",
                height: "100%",
                listStyle: "none",
                overflowY: "auto",
                padding: "8px",
                webkitMarginAfter: "8px",
                webkitMarginBefore: "0px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "listItemStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                paddingBottom: (this.isModifyOperation) ? "11px" : "0px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "innerListStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                listStyle: "none",
                overflowY: "auto",
                webkitPaddingStart: "0px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "innerListItemStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                paddingBottom: "3px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "listHeaderDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontWeight: "bold",
                paddingBottom: "6px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "installSizeAndCustomizeDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                justifyContent: "space-between"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "reasonDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                padding: "10px 0px 18px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "completedMessageDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flex: "1 0 auto",
                justifyContent: "center",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "loadingAnimationStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flex: "1 0 0",
                justifyContent: "center",
                overflow: "hidden",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "flexDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "alertImageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "100%",
                marginTop: "1px",
                webkitMarginEnd: "4px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "progressViewStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                justifyContent: "center",
                width: "325px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "pauseButtonDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "invisibleAccessibilityLog", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "1px",
                width: "1px",
                position: "absolute",
                overflow: "hidden",
                top: "-10px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hooks or unhooks events for this component
     */
    FocusedWindow.prototype.hookEvents = function (hook) {
        // (un)hook events on the window
        var hookMethod = Utilities_1.getEventHookMethodForTarget(window, hook);
        hookMethod("resize", WindowActions_1.windowActions.requestWindowState);
        // (un)hook events on the app store
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.appStore, hook);
        hookMethod(factory_1.appStore.CHANGED_EVENT, this._onAppStoreUpdateBind);
        // (un)hook events on the product configuration store
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.productConfigurationStore, hook);
        hookMethod(factory_1.productConfigurationStore.CHANGED_EVENT, this._onProductConfigurationStoreUpdateBind);
        // (un)hook events on the error store
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.errorStore, hook);
        hookMethod(factory_1.errorStore.CHANGED_EVENT, this._onErrorStoreUpdateBind);
    };
    /* tslint:disable:no-unused-variable */
    FocusedWindow.prototype.getHeaderAndItemsEntries = function () {
        var headerAndItemsEntries = [
            {
                header: this.workloadsHeaderText,
                items: this.namesOfWorkloadsToAdd
            },
            {
                header: this.componentsHeaderText,
                items: this.namesOfComponentsToAdd
            }
        ];
        return headerAndItemsEntries.filter(function (headerAndItems) { return headerAndItems.items.length > 0; });
    };
    Object.defineProperty(FocusedWindow.prototype, "isEvaluatingInstallParameters", {
        /* tslint:enable */
        get: function () {
            return factory_1.productConfigurationStore.isEvaluatingInstallParameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "hasValidInstallParameters", {
        get: function () {
            return this.canInstall && !this.isEvaluatingInstallParameters;
        },
        enumerable: true,
        configurable: true
    });
    FocusedWindow.prototype.checkInstallParameters = function () {
        // if we don't have a selected product or we've already started the operation, no need to check
        if (!this.selectedProduct || this.hasUpdateStarted) {
            return;
        }
        var initiatedFromCommandLine = factory_1.appStore.hasActiveCommandLineOperation;
        var vsixs = initiatedFromCommandLine ? factory_1.appStore.argv.vsixs : [];
        if (this.isInstallOperation) {
            var product = this.selectedProduct;
            this._nickname = this.chooseNickname();
            this._installPath = path_utilities_1.getDefaultInstallPath(factory_1.appStore, product);
            InstallerActions_1.evaluateInstallParameters(product, this._nickname, this._installPath, null, initiatedFromCommandLine, vsixs);
        }
        else {
            var product = this.selectedProduct;
            var updateOnModify = false;
            InstallerActions_1.evaluateModifyParameters(product, initiatedFromCommandLine, updateOnModify, vsixs);
        }
    };
    FocusedWindow.prototype.chooseNickname = function () {
        var nickname = factory_1.appStore.argv.nickname;
        // if we got a nickname on the command line and it's valid, use it
        if (nickname && factory_1.appStore.nicknameHelper.validateNickname(nickname, this.selectedProduct).isValid) {
            return nickname;
        }
        // if we already have a product in that channel without a nickname, generate one
        if (factory_1.appStore.nicknameHelper.isNicknameRequired(this.selectedProduct)) {
            return factory_1.appStore.nicknameHelper.suggestNickname(this.selectedProduct);
        }
        // if we get here, no nickname
        return null;
    };
    FocusedWindow.prototype.updateInstallState = function () {
        switch (this._installState) {
            case FocusedInstallState.InProgress:
                if ((this.isModifyOperation && !factory_1.appStore.isModifyInProgress) ||
                    (this.isInstallOperation && !factory_1.appStore.isInstallInProgress)) {
                    this._installState = FocusedInstallState.Completed;
                }
                break;
        }
    };
    Object.defineProperty(FocusedWindow.prototype, "selectedWorkloads", {
        get: function () {
            return factory_1.productConfigurationStore.getSelectedWorkloadsOrdered();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "selectedComponents", {
        get: function () {
            return Array.from(factory_1.productConfigurationStore.getSelectedComponents().values());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "evaluationErrorMessage", {
        get: function () {
            if (!factory_1.productConfigurationStore.evaluation) {
                return "";
            }
            return factory_1.productConfigurationStore.evaluation.errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "errorMessage", {
        get: function () {
            return this.evaluationErrorMessage || factory_1.appStore.installerStatus.errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "canInstall", {
        get: function () {
            return !this.errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "wasInstallOperation", {
        get: function () {
            return factory_1.appStore.argv.command === CommandLine_1.CommandNames.install;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "isInstallOperation", {
        get: function () {
            return (this._operation === FocusedInstallOperation.Install);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "isModifyOperation", {
        get: function () {
            return (this._operation === FocusedInstallOperation.Modify);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "operation", {
        get: function () {
            return this._operation;
        },
        set: function (value) {
            this._operation = value;
            this.scheduleUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FocusedWindow.prototype, "installSize", {
        get: function () {
            var evaluation = factory_1.productConfigurationStore.evaluation;
            if (evaluation) {
                // TODO: until the UI design is finalized (Task 396445), show the sum of all drives for the size.
                return evaluation.totalDeltaSize;
            }
            return NaN;
        },
        enumerable: true,
        configurable: true
    });
    FocusedWindow.prototype.setWindowTitle = function () {
        // We don't have access to ResourceStrings from focused.html, so we set
        // the title here.
        document.title = ResourceStrings_1.ResourceStrings.appWindowTitle;
    };
    FocusedWindow.prototype.operationNameFromOperation = function () {
        return (this.isInstallOperation) ? "install" : "modify";
    };
    FocusedWindow.prototype.loadFullUI = function () {
        var _this = this;
        return html_document_loader_1.loadDocument("index.html").then(function () {
            // resize window
            var options = window_options_1.mainWindowOptions();
            var currentWindow = electron_1.remote.getCurrentWindow();
            currentWindow.setSize(options.width, options.height, true);
            currentWindow.setMinimumSize(options.minWidth, options.minHeight);
            currentWindow.center();
            // We have completed the load document. Fire an event to ensure that the correct CSS is applied to it.
            window.dispatchEvent(new CustomEvent(_this._customDocumentLoadEvent));
        });
    };
    FocusedWindow = __decorate([
        template("\n<focused-window>\n    <div style={this.focusedWindowDivStyle}>\n        <app-header class=\"title-bar\"\n                    style={this.titleBarStyle}\n                    branch={this.branch}\n                    vstextoverride={this.productName}\n                    showlogo={true} />\n\n        <!-- Hidden div that is the queue of messages to be read to the user -->\n        <div style={this.invisibleAccessibilityLog}\n             role=\"log\">\n            <virtual each={message in this.accessibilityLogStrings}>\n                {message} <br />\n            </virtual>\n        </div>\n\n        <div style={this.noDragDivStyle}>\n\n            <div if={this.isLoading}\n                 style={this.loadingAnimationStyle}>\n                <loading-view loadingtext={this.loadingText} />\n            </div>\n\n            <div if={this.isOperationInProgress}\n                 style={this.updatingDivStyle}>\n                <div style={this.progressViewDivStyle}>\n                    <progress-view progressbar1={this.downloadProgressBar}\n                                   progressbar2={this.installProgressBar}\n                                   style={this.progressViewStyle}\n                                   id={this.progressViewId}\n                                   tabindex=\"-1\"\n                                   aria-label={this.modifyingAriaLabel} />\n                </div>\n                <div style={this.pauseButtonDivStyle}>\n                    <button style={this.buttonStyle}\n                            disabled={this.isOperationPaused}\n                            onClick={this.pauseClicked}>\n                        {this.pauseButtonText}\n                    </button>\n                </div>\n            </div>\n\n            <div if={this.showLaunchPrompt}\n                style={this.launchPromptDivStyle}>\n                <div style={this.launchPromptTextDivStyle}>\n                    {this.launchPromptText}\n                </div>\n                <div style={this.launchButtonDivStyle}>\n                    <button style={this.buttonStyle}\n                            onClick={this.launchClicked}>\n                        {this.launchButtonText}\n                    </button>\n                </div>\n            </div>\n\n            <div if={!this.isLoading && !this.isOperationInProgress && !this.showLaunchPrompt}\n                 style={this.focusPageDivStyle}>\n                <div if={!this.hasUpdateStarted}\n                      style={this.focusBodyStyleDiv}>\n                    <div style={this.reasonDivStyle}\n                         id={this.focusUiReasonTextId}\n                         tabindex=\"0\"\n                         aria-label={this.focusUiReasonText}\n                         role=\"note\">\n                        {this.focusUiReasonText}\n                    </div>\n                    <ul class=\"focused-ui-item-border\"\n                        style={this.listStyle}>\n                        <li each={headerAndItemsEntry in this.getHeaderAndItemsEntries()}\n                            style={this.listItemStyle}>\n                            <div if={this.isModifyOperation}\n                                style={this.listHeaderDivStyle}>\n                                {headerAndItemsEntry.header}\n                            </div>\n                            <ul class=\"focused-ui-item\"\n                                style={this.innerListStyle}\n                                role=\"list\"\n                                aria-label={headerAndItemsEntry.header}\n                                tabindex=\"0\">\n                                <li style={this.innerListItemStyle}\n                                    each={item in headerAndItemsEntry.items}\n                                    tabindex=\"0\"\n                                    aria-label={item}>\n                                    {item}\n                                </li>\n                            </ul>\n                        </li>\n                    </ul>\n                    <div style={this.installSizeAndCustomizeDivStyle}>\n                        <div tabindex=\"0\"\n                             aria-label={this.installSizeText}\n                             role=\"note\">\n                            {this.installSizeText}\n                        </div>\n                        <a onclick={this.onCustomizeInstall.bind(this)}\n                           onkeypress={keyPressToClickHelper}\n                           tabindex=\"0\">\n                            {this.customizeInstallText}\n                        </a>\n                    </div>\n                </div>\n                <div if={this.hasUpdateCompleted}\n                     style={this.completedMessageDivStyle}\n                     id={this.completedMessageId}\n                     tabindex=\"0\"\n                     aria-label={this.completedMessageText}>\n                    {this.completedMessageText}\n                </div>\n                <div if={!this.isLoading}\n                     style={this.focusPageButtonsDivStyle}>\n                    <div if={!this.hasUpdateStarted}\n                         style={this.alertStyle}\n                         class=\"license-footer\">\n\n                        <div if={!this.canInstall}\n                             aria-atomic=\"true\"\n                             aria-live=\"polite\"\n                             aria-relevant=\"additions\"\n                             style={this.flexDivStyle}>\n                            <div style={this.alertImageStyle}>\n                                <img src=\"images/StatusCriticalError.svg\" />\n                            </div>\n                            <div tabindex=\"0\"\n                                 role=\"note\"\n                                 class=\"error-text\"\n                                 aria-label={this.errorMessage}>\n                                {this.errorMessage}\n                            </div>\n                        </div>\n                        <license-terms-text if={this.hasValidInstallParameters} />\n                    </div>\n                    <div>\n                        <button if={!this.hasUpdateStarted} style={this.buttonStyle}\n                                onClick={this.installClicked}\n                                disabled={!this.hasValidInstallParameters}>\n                            {this.installButtonText}\n                        </button>\n                        <button if={!this.wasInstallOperation && this.hasUpdateCompleted}\n                                style={this.buttonStyle}\n                                onClick={this.closeClicked}>\n                            {this.closeButtonText}\n                        </button>\n                        <button if={this.wasInstallOperation && this.hasUpdateCompleted}\n                                style={this.buttonStyle}\n                                onClick={this.launchClicked}>\n                            {this.launchButtonText}\n                        </button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <error-dialog if={this.isErrorDialogVisible}\n                      error-message={this.errorDialogMessage}\n                      onsubmit={this.acceptErrorCallback} />\n    </div>\n</focused-window>")
    ], FocusedWindow);
    return FocusedWindow;
}(Riot.Element));
exports.FocusedWindow = FocusedWindow;
apply_mixins_1.applyMixins(FocusedWindow, [scheduled_updater_1.ScheduledUpdater]);
// initialize the focused UI window
FocusedWindow.initialize();
riot.mount("*");
//# sourceMappingURL=focused-window.js.map