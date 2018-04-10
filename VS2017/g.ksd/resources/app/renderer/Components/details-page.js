/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../renderer/bower_components/riot-ts/riot-ts.d.ts" />
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
var factory_1 = require("../stores/factory");
var command_line_actions_1 = require("../Actions/command-line-actions");
var Product_1 = require("../../lib/Installer/Product");
var css_styles_1 = require("../css-styles");
var InstallerActions_1 = require("../Actions/InstallerActions");
var Utilities_1 = require("../Utilities");
var locale_handler_1 = require("../../lib/locale-handler");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var router_1 = require("./router");
var Tab_1 = require("../../lib/Tab");
var WindowActions_1 = require("../Actions/WindowActions");
var factory_2 = require("../Actions/factory");
var errorNames = require("../../lib/error-names");
var open_external_1 = require("../../lib/open-external");
var features_1 = require("../../lib/feature-flags/features");
var error_message_response_1 = require("../interfaces/error-message-response");
var path_utilities_1 = require("../path-utilities");
var exit_details_1 = require("../../lib/exit-details");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
var apply_mixins_1 = require("../mixins/apply-mixins");
var operation_parameters_1 = require("../../lib/Installer/operation-parameters");
require("./directory-picker");
require("./individual-components-page");
require("./install-size-breakdown");
require("./language-packs-page");
require("./license-terms-text");
require("./nickname-picker");
require("./product-install-summary");
require("./tab-control");
require("./workloads-page");
/* istanbul ignore next */
var DetailsPage = /** @class */ (function (_super) {
    __extends(DetailsPage, _super);
    function DetailsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._tabs = new Tab_1.TabCollection();
        _this._currentTab = null;
        _this._tabSwitchedBind = _this.tabSwitched.bind(_this);
        _this._handleReloadBind = _this.handleReload.bind(_this);
        _this._handleErrorBind = _this.handleError.bind(_this);
        _this._handleProductStoreChangeBind = _this.handleProductStoreChange.bind(_this);
        _this._nickname = "";
        _this._onChangeBind = _this.onChange.bind(_this);
        _this._originalSelectedComponentIds = [];
        _this._originalSelectedWorkloadIds = [];
        _this._installModifyStarted = false;
        _this._hasInsufficientDiskSpaceShown = false;
        _this._directoryChangedBind = _this.directoryChanged.bind(_this);
        return _this;
    }
    DetailsPage.prototype.mounted = function () {
        this.hookEvents(true);
        this.initPage();
        this.checkInstallParameters();
    };
    DetailsPage.prototype.updated = function () {
        // If the scrollbar is not present, set the border to be 2px to divide the summary pane from content
        var tabpanel = document.getElementById(this.tabPanelId);
        if (tabpanel) {
            if (tabpanel.scrollHeight === tabpanel.clientHeight) {
                tabpanel.style.borderRightWidth = "2px";
            }
            else {
                tabpanel.style.borderRightWidth = "0px";
            }
        }
    };
    DetailsPage.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    DetailsPage.prototype.initPage = function () {
        if (this.selectedProduct.workloads.length > 1) {
            this._tabs.add(new Tab_1.Tab(ResourceStrings_1.ResourceStrings.workloadsHeader, this.workloadsTabId));
            this._currentTab = this.tabs.get(this.workloadsTabId);
        }
        if (Utilities_1.getDisplayedComponents(this.selectedProduct.allComponents).length > 0) {
            this._tabs.add(new Tab_1.Tab(ResourceStrings_1.ResourceStrings.individualComponentsHeader, this.componentsTabId));
            if (!this._currentTab) {
                this._currentTab = this.tabs.get(this.componentsTabId);
            }
        }
        if (this.selectedProduct.availableLanguages.length > 1) {
            this._tabs.add(new Tab_1.Tab(ResourceStrings_1.ResourceStrings.languagePacksHeader, this.langPacksTabId));
            if (!this._currentTab) {
                this._currentTab = this.tabs.get(this.langPacksTabId);
            }
        }
        this.initializeNickname();
        this.captureOriginallySelectedPackageIds();
    };
    DetailsPage.prototype.handleProductStoreChange = function () {
        if (this.isReady) {
            if (!this._installModifyStarted && !factory_1.errorStore.isErrorVisible && !this.isEvaluatingParameters) {
                // if we got --passive or --quiet on the command line, immediately begin the install/modify
                if (factory_1.appStore.hasActiveCommandLineOperation && (factory_1.appStore.argv.passive || factory_1.appStore.argv.quiet)) {
                    if (this.canInstall) {
                        this.doInstallModify();
                    }
                    else {
                        WindowActions_1.windowActions.closeWindow(this.errorMessageForTelemetry);
                    }
                }
            }
        }
        var evaluation = factory_1.productConfigurationStore.evaluation;
        // If the warning has not been shown before, send the shown telemetry.
        if (evaluation &&
            evaluation.systemDriveEvaluation &&
            !evaluation.systemDriveEvaluation.hasSufficientDiskSpace &&
            !this._hasInsufficientDiskSpaceShown) {
            this._hasInsufficientDiskSpaceShown = true;
            factory_2.detailsPageActions.sendDiskSizeWarningShown();
        }
        this.scheduleUpdate();
    };
    DetailsPage.prototype.nicknameChanged = function (ev) {
        this._nickname = ev.detail.nickname;
        this.validateNickname(this._nickname);
    };
    DetailsPage.prototype.directoryChanged = function (ev) {
        if (this._installDir !== ev.detail.path) {
            this._installDir = ev.detail.path;
        }
    };
    DetailsPage.prototype.installModifyClicked = function (ev) {
        if (this.canRecommendSelection()) {
            this.showRecommendSelection();
        }
        else {
            this.doInstallModify();
        }
    };
    DetailsPage.prototype.isSelectedTab = function (tabId) {
        if (!this._currentTab) {
            return false;
        }
        return this._currentTab.tabID === tabId;
    };
    Object.defineProperty(DetailsPage.prototype, "locationText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.location;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "summaryText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.summary;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "tabs", {
        get: function () {
            return this._tabs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "tabPanelId", {
        /**
         * @returns {string} an id used by tab-control for accessibility
         */
        get: function () {
            return "tabpanel";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "workloadsTabId", {
        get: function () {
            return "Workloads";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "componentsTabId", {
        get: function () {
            return "Individual Components";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "langPacksTabId", {
        get: function () {
            return "Language Packs";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "isEvaluatingParameters", {
        get: function () {
            return factory_1.productConfigurationStore.isEvaluatingInstallParameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "evaluation", {
        get: function () {
            return factory_1.productConfigurationStore.evaluation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "supportedLanguageCodes", {
        get: function () {
            if (this.selectedProduct) {
                return this.selectedProduct.availableLanguages;
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "selectedComponents", {
        get: function () {
            var selectedComponents = factory_1.productConfigurationStore.getSelectedComponents();
            return Array.from(selectedComponents.values());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "selectedIndividualComponents", {
        get: function () {
            if (this.selectedProduct) {
                return factory_1.productConfigurationStore.getVirtualWorkloadComponents();
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "installedIndividualComponents", {
        get: function () {
            if (this.selectedProduct) {
                return factory_1.productConfigurationStore.getInstalledIndividualComponents();
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "defaultTab", {
        get: function () {
            var tab = this.tabs.get(this.workloadsTabId);
            if (!tab) {
                tab = this.tabs.get(this.componentsTabId);
            }
            if (!tab) {
                tab = this.tabs.get(this.langPacksTabId);
            }
            return tab;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "selectedProduct", {
        get: function () {
            return factory_1.productConfigurationStore.getSelectedProduct();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "selectedWorkloads", {
        get: function () {
            return factory_1.productConfigurationStore.getSelectedWorkloadsOrdered();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "workloadCategories", {
        get: function () {
            return factory_1.productConfigurationStore.getWorkloadCategories();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "isInstalledProduct", {
        get: function () {
            var product = this.selectedProduct;
            return product && (product.installState !== undefined);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "isModifyWithUpdate", {
        get: function () {
            return this.opts.showUpdate || false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "installDir", {
        get: function () {
            if (this.isReady && this._installDir === undefined) {
                if (this.isInstallOperation) {
                    // if this is a new install, use the default install location
                    this._installDir = this.defaultInstallDir;
                }
                else if (this.selectedProduct) {
                    // if this is a modify install, get the actual install location
                    this._installDir = this.selectedProduct.installationPath;
                }
            }
            return this._installDir || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "isReady", {
        get: function () {
            return !!factory_1.productConfigurationStore.getSelectedProduct()
                && !factory_1.productConfigurationStore.isBatchSelectionInProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "defaultInstallDir", {
        get: function () {
            return path_utilities_1.getDefaultInstallPath(factory_1.appStore, this.selectedProduct);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "installModifyText", {
        get: function () {
            if (this.isInstallOperation) {
                return ResourceStrings_1.ResourceStrings.install;
            }
            else if (this.isModifyWithUpdate) {
                return ResourceStrings_1.ResourceStrings.update;
            }
            else if (this.isRequestedProductChanged) {
                return ResourceStrings_1.ResourceStrings.modify;
            }
            else {
                return ResourceStrings_1.ResourceStrings.closeButtonTitle;
            }
        },
        enumerable: true,
        configurable: true
    });
    DetailsPage.prototype.tabSwitched = function (event) {
        this._currentTab = event.detail.tab;
        event.stopPropagation();
        this.scheduleUpdate();
    };
    Object.defineProperty(DetailsPage.prototype, "acceptText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.accept;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "detailsPageDivStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "tabControlStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                marginBottom: "-1px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "mainContentContainerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                boxSizing: "border-box",
                flex: "1 0 0",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "mainContentSpacerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 8px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "summaryPaneContentStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                boxSizing: "border-box",
                display: "block",
                height: "100%",
                webkitMarginStart: "20px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "summaryPaneStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0",
                overflow: "hidden",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "tabDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderRightStyle: "solid",
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                flex: "1 0 auto",
                overflow: "auto",
                width: "0"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "tabControlContainerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                fontFamily: "Segoe UI SemiBold",
                fontSize: ".9167rem",
                margin: "8px 16px 0px",
                zIndex: "1",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "workloadsTabStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "100%",
                marginTop: "8px",
                webkitPaddingStart: "8px",
                // reserve space for scrollbar
                width: "calc(100% - 18px)"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "installLocationStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px 0px 0px 0px",
                display: "flex",
                flexDirection: "row",
                minHeight: "95px",
                padding: "5px 10px 10px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "nickname", {
        get: function () {
            return this._nickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "directoryPickerDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                marginBottom: "5px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "controlContainerDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "2 3 775px",
                flexDirection: "column",
                justifyContent: "space-between",
                webkitMarginEnd: "14px",
                webkitMarginBefore: "5px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "directoryPickerAndFolderModeToggleDivStyle", {
        // The style for the "location" label, textbox, and checkbox for separate folder mode.
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "0 1 100%",
                flexDirection: "column",
                justifyContent: "space-between",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "directoryPickerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "individualComponentsStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexGrow: "1",
                marginTop: "8px",
                height: "0px",
                webkitMarginStart: "15px",
                // reserve space for scrollbar and margin
                width: "calc(100% - 33px)"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "installDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "flex-end",
                display: "flex",
                flex: "1 1 300px",
                flexDirection: "column",
                justifyContent: "space-between",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "summaryPaneWithLicenseStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "0 0 370px",
                flexDirection: "column",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "errorAlertImageStyle", {
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
    Object.defineProperty(DetailsPage.prototype, "imageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "14px",
                width: "14px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "errorMessageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                display: "flex",
                fontSize: ".67rem",
                lineHeight: "1.35",
                webkitMarginAfter: "7px",
                webkitMarginBefore: "12px",
                webkitMarginEnd: "20px",
                webkitMarginStart: "20px",
                webkitPaddingBefore: "10px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "nicknamePickerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "showNickname", {
        get: function () {
            // if we have a nickname (this may be true if we're modifying), show the nickname field
            if (this.nickname) {
                return true;
            }
            // if we're configured to show the nickname field, show it
            if (this.opts.shownickname) {
                return true;
            }
            // if we get this far, don't show the nickname field
            return false;
        },
        enumerable: true,
        configurable: true
    });
    DetailsPage.prototype.onChange = function (ev) {
        this.checkInstallParameters();
    };
    DetailsPage.prototype.hookEvents = function (hook) {
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod("tabclick", this._tabSwitchedBind);
        hookMethod("change", this._onChangeBind);
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.appStore, hook);
        hookMethod(factory_1.appStore.CHANGED_EVENT, this._handleReloadBind);
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.productConfigurationStore, hook);
        hookMethod(factory_1.productConfigurationStore.CHANGED_EVENT, this._handleProductStoreChangeBind);
        hookMethod(factory_1.productConfigurationStore.FATAL_ERROR_EVENT, this._handleErrorBind);
    };
    DetailsPage.prototype.captureOriginallySelectedPackageIds = function () {
        this._originalSelectedWorkloadIds = this.selectedWorkloads.map(function (workload) { return workload.id.toLowerCase(); });
        this._originalSelectedComponentIds = this.selectedComponents.map(function (component) { return component.id.toLowerCase(); });
    };
    DetailsPage.prototype.handleReload = function () {
        // Check if we were just notified due to an install starting.
        if (factory_1.appStore.isOperationInProgress) {
            var initiatedFromCommandLine = factory_1.appStore.hasActiveCommandLineOperation;
            if (initiatedFromCommandLine) {
                command_line_actions_1.completeCommandLineOperation();
            }
            // If the last evaluation showed invalid disk space, send ignored telemetry.
            var evaluation = factory_1.productConfigurationStore.evaluation;
            if (evaluation &&
                evaluation.systemDriveEvaluation &&
                !evaluation.systemDriveEvaluation.hasSufficientDiskSpace) {
                factory_2.detailsPageActions.sendDiskSizeWarningIgnored();
            }
            factory_2.detailsPageActions.endDetailsPageSessionWithSuccess();
            // No need to continue updating after goHome was just called.
            router_1.Router.goHome();
            return;
        }
        this.scheduleUpdate();
    };
    DetailsPage.prototype.handleError = function () {
        factory_2.detailsPageActions.endDetailsPageSessionWithFail();
        // If we got an error and we're quiet or passive, quit the app
        if (factory_1.appStore.argv.quiet || factory_1.appStore.argv.passive) {
            WindowActions_1.windowActions.closeWindow(this.errorMessageForTelemetry);
        }
        // if we got an error, close the pane
        router_1.Router.goHome();
    };
    Object.defineProperty(DetailsPage.prototype, "isInstallOperation", {
        get: function () {
            return !this.isInstalledProduct;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "isModifyOperation", {
        get: function () {
            return !this.isInstallOperation;
        },
        enumerable: true,
        configurable: true
    });
    DetailsPage.prototype.doInstallModify = function (rejectRecommendedSelection) {
        if (this._installModifyStarted) {
            return;
        }
        var argv = factory_1.appStore.argv;
        // Only assign if this is a command line directed operation.
        var vsixRefs = factory_1.appStore.hasActiveCommandLineOperation ? argv.vsixs : [];
        // Only assign if this is a command line directed operation.
        var flightInfo = factory_1.appStore.hasActiveCommandLineOperation ? argv.flights : [];
        var additionalOptions = new operation_parameters_1.AdditionalOptions(vsixRefs, flightInfo);
        var params = {
            isQuietOrPassive: argv.quiet || argv.passive,
            telemetryContext: factory_1.appStore.createTelemetryContext(this.isInstallOperation ? "install" : "modify"),
            testMode: argv.testMode,
            additionalOptions: additionalOptions,
        };
        if (params.telemetryContext) {
            params.telemetryContext.rejectRecommendedSelection = rejectRecommendedSelection;
        }
        this._installModifyStarted = true;
        if (this.isInstallOperation) {
            InstallerActions_1.install(this.selectedProduct, params, this.nickname, this.installDir, factory_1.appStore.argv.layoutPath, argv.productKey);
        }
        else {
            var installedProduct = this.selectedProduct;
            if (this.isRequestedProductChanged || (installedProduct.hasUpdatePackages && this.isModifyWithUpdate)) {
                InstallerActions_1.modify(installedProduct, params);
            }
            else {
                // If we are quiet or passive, quit with nothing to do.
                if (factory_1.appStore.argv.quiet || factory_1.appStore.argv.passive) {
                    WindowActions_1.windowActions.closeWindow(exit_details_1.CreateSuccessExitDetails());
                }
                // Nothing to do, just close the dialog.
                router_1.Router.goHome();
            }
        }
    };
    DetailsPage.prototype.showRecommendSelection = function () {
        var _this = this;
        var options = {
            title: ResourceStrings_1.ResourceStrings.recommendWorkloadSelectionTitle,
            message: [
                ResourceStrings_1.ResourceStrings.recommendWorkloadSelectionMessage
            ],
            allowCancel: true,
            isCancelDefault: true,
            okButtonText: ResourceStrings_1.ResourceStrings.ignore,
            cancelButtonText: ResourceStrings_1.ResourceStrings.addWorkloads,
            errorName: errorNames.RECOMMEND_WORKLOAD_SELECTION,
            errorLink: {
                callback: function () { open_external_1.openExternal("https://go.microsoft.com/fwlink/?linkid=856109"); },
                text: ResourceStrings_1.ResourceStrings.recommendWorkloadSelectionLinkText,
            },
        };
        factory_1.errorStore.show(options)
            .then(function (result) {
            if (result.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                _this.doInstallModify(true);
            }
        });
    };
    DetailsPage.prototype.canRecommendSelection = function () {
        if (!this.isInstallOperation) {
            return false;
        }
        if (!factory_1.featureStore.isEnabled(features_1.Feature.RecommendSel)) {
            return false;
        }
        if (!this.selectedProduct.recommendSelection) {
            return false;
        }
        if (!this.selectedWorkloads.every(function (w) { return w.required; })) {
            return false;
        }
        return true;
    };
    DetailsPage.prototype.checkInstallParameters = function () {
        // if we don't have a selected product or we've already started the install/modify, no need to check
        if (!this.selectedProduct || this._installModifyStarted) {
            return;
        }
        var initiatedFromCommandLine = factory_1.appStore.hasActiveCommandLineOperation;
        if (this.isInstalledProduct) {
            InstallerActions_1.evaluateModifyParameters(this.selectedProduct, initiatedFromCommandLine, false /* updateOnModify */, []);
        }
        else {
            if (this.installDir.trim() === "") {
                return;
            }
            var nickname = this.nickname;
            InstallerActions_1.evaluateInstallParameters(this.selectedProduct, nickname, this.installDir, factory_1.appStore.argv.layoutPath, initiatedFromCommandLine, []);
        }
    };
    Object.defineProperty(DetailsPage.prototype, "evaluationErrorMessage", {
        get: function () {
            if (!factory_1.productConfigurationStore.evaluation) {
                return "";
            }
            return factory_1.productConfigurationStore.evaluation.errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "hasErrorMessage", {
        get: function () {
            return !!this.errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "errorMessageImageSrc", {
        get: function () {
            return "images/StatusCriticalError.svg";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "hasCriticalError", {
        // A critical error is either an evaluation error message, local error message, or installer error message.
        // If an evaluation is in process and the previous error message was critical, we return true to prevent
        // the error image from changing.
        get: function () {
            var isInstallDirEmpty = this.installDir.trim().length === 0;
            var evaluationHasError = !!this.evaluationErrorMessage;
            var installerStatusHasError = !!this.installerStatusErrorMessage;
            var hasLocalError = !!(this._localError && !this._localError.isValid);
            return isInstallDirEmpty
                || evaluationHasError
                || installerStatusHasError
                || hasLocalError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "errorMessage", {
        // Any warning messages must be at the end so we show blocking messages first
        get: function () {
            if (this._localError) {
                if (!this._localError.isValid) {
                    return this._localError.errorMessage;
                }
            }
            if (this.evaluationErrorMessage) {
                return this.evaluationErrorMessage;
            }
            if (this.installerStatusErrorMessage) {
                return this.installerStatusErrorMessage.message;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "errorMessageForTelemetry", {
        get: function () {
            if (this._localError && !this._localError.isValid) {
                return exit_details_1.CreateCustomExitDetails(this._localError.errorCode, this._localError.errorMessage, exit_details_1.ERROR_RETURN_CODE);
            }
            var evaluationError = this.evaluationErrorMessage;
            if (evaluationError) {
                return exit_details_1.CreateCustomExitDetails(errorNames.EVALUATION_ERROR, evaluationError, exit_details_1.ERROR_RETURN_CODE);
            }
            var installerStatusError = this.installerStatusErrorMessage;
            if (installerStatusError) {
                return exit_details_1.CreateCustomExitDetails(installerStatusError.name, installerStatusError.message, installerStatusError.exitCode);
            }
            return exit_details_1.CreateSuccessExitDetails();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "installerStatusErrorMessage", {
        get: function () {
            // Bug 378908: We don't want to verify that there are no blocking processes until the
            // user clicks Install or Modify (so we don't have to poll on GetStatus).  We'll ignored
            // blocking processes at this point.
            var includeBlockingProcessErrors = false;
            return factory_1.appStore.installerStatus.getErrorWithName(includeBlockingProcessErrors);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "isRequestedProductChanged", {
        /**
         * @returns true if the selectedProduct is a new install or the user
         *          has made selections that would change the selectedProduct
         */
        get: function () {
            var _this = this;
            // Enable the close button while waiting for the product record to load in case the user
            // chooses to cancel the operation.
            if (!this.selectedProduct) {
                return true;
            }
            // An uninstalled product is always a change request due to the implicit product and required package
            // selections.
            if (!this.isInstalledProduct) {
                return true;
            }
            // The installed product is always a change request when the desired installation is partial.
            var installedProduct = this.selectedProduct;
            if (installedProduct.installState === Product_1.InstallState.Partial) {
                return true;
            }
            // The installed product has a change request when the UI selected workloads doesn't match the originally
            // selected workloads.
            var workloadIds = this.selectedWorkloads.map(function (workload) { return workload.id.toLowerCase(); });
            if (workloadIds.length !== this._originalSelectedWorkloadIds.length ||
                workloadIds.some(function (id) { return _this._originalSelectedWorkloadIds.indexOf(id) === -1; })) {
                return true;
            }
            // The installed product has a change request when the UI selected components doesn't match the originally
            // components workloads.
            var componentIds = this.selectedComponents.map(function (component) { return component.id.toLowerCase(); });
            if (componentIds.length !== this._originalSelectedComponentIds.length ||
                componentIds.some(function (id) { return _this._originalSelectedComponentIds.indexOf(id) === -1; })) {
                return true;
            }
            // The installed product has a change request when the UI selected workloads are not currently installed.
            var installedWorkloadIds = this.selectedProduct.workloads
                .filter(function (workload) { return workload.installState === Product_1.InstallState.Installed; })
                .map(function (workload) { return workload.id.toLowerCase(); });
            if (workloadIds.length !== installedWorkloadIds.length ||
                workloadIds.some(function (id) { return installedWorkloadIds.indexOf(id) === -1; })) {
                return true;
            }
            // The installed product has a change request when the UI selected components are not currently installed.
            var installedComponentIds = this.selectedProduct.allComponents
                .filter(function (component) { return component.installState === Product_1.InstallState.Installed; })
                .map(function (component) { return component.id.toLowerCase(); });
            if (componentIds.length !== installedComponentIds.length ||
                componentIds.some(function (id) { return installedComponentIds.indexOf(id) === -1; })) {
                return true;
            }
            // The installed product has a change request when the selected languages are not currently installed.
            var selectedLanguages = installedProduct.selectedLanguages;
            var installedLanguages = installedProduct.installedLanguages
                .map(function (language) { return locale_handler_1.LocaleHandler.getSupportedLocale(language); });
            if (selectedLanguages.length !== installedLanguages.length ||
                !selectedLanguages.every(function (locale) {
                    return installedLanguages.findIndex(function (language) { return locale === language; }) !== -1;
                })) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsPage.prototype, "canInstall", {
        get: function () {
            return !this.isEvaluatingParameters && !this.hasCriticalError && !this._installModifyStarted;
        },
        enumerable: true,
        configurable: true
    });
    DetailsPage.prototype.initializeNickname = function () {
        if (this.isInstalledProduct) {
            // init the nickname field from the installed product's nickname
            this._nickname = this.selectedProduct.nickname;
        }
        else {
            // if we were given a requested nickname, use it; otherwise,
            // if we already have a product without a nickname, suggest a
            // nickname that doesn't conflict with an existing nickname
            if (this.opts.requestednickname) {
                this._nickname = this.opts.requestednickname;
            }
            else if (factory_1.appStore.nicknameHelper.isNicknameRequired(this.selectedProduct)) {
                this._nickname = factory_1.appStore.nicknameHelper.suggestNickname(this.selectedProduct);
            }
            this.validateNickname(this._nickname);
        }
    };
    DetailsPage.prototype.validateNickname = function (nickname) {
        var result = factory_1.appStore.nicknameHelper.validateNickname(nickname, this.selectedProduct);
        this._localError = result;
        return result.isValid;
    };
    DetailsPage = __decorate([
        template("\n<details-page>\n    <div style={this.detailsPageDivStyle}>\n        <div style={this.tabControlContainerStyle}>\n            <tab-control each={this.tabs.length > 0 ? [1] : []}\n                         tabs={this.parent.tabs}\n                         style={this.parent.tabControlStyle}\n                         defaulttab={this.parent.defaultTab}\n                         tabpanelid={this.parent.tabPanelId} />\n        </div>\n        <div style={this.mainContentContainerStyle}>\n            <div class=\"details-page-tab-container\"\n                 style={this.tabDivStyle}\n                 id={this.tabPanelId}\n                 role=\"tabpanel\">\n                <!-- Workloads Tab -->\n                <workloads-page each={this.isSelectedTab(this.workloadsTabId) ? [1] : []}\n                                style={this.parent.workloadsTabStyle}\n                                categories={this.parent.workloadCategories} />\n\n                <!-- Components Tab -->\n                <individual-components-page each={this.isSelectedTab(this.componentsTabId) ? [1] : []}\n                                            style={this.parent.individualComponentsStyle}\n                                            product={this.parent.selectedProduct}\n                                            selectedcomponents={this.parent.selectedComponents} />\n\n                <!-- Languages Tab -->\n                <language-packs-page each={this.isSelectedTab(this.langPacksTabId) ? [1]: []}\n                                     style={this.parent.individualComponentsStyle}\n                                     product={this.parent.selectedProduct} />\n            </div>\n            <div style={this.summaryPaneWithLicenseStyle}>\n                <div style={this.summaryPaneStyle}\n                     role=\"log\"\n                     aria-relevant=\"additions removals\"\n                     aria-label={summaryText}>\n                    <product-install-summary class=\"install-summary-pane\"\n                                             style={summaryPaneContentStyle}\n                                             product={this.selectedProduct}\n                                             selectedworkloads={this.selectedWorkloads}\n                                             installed-individual-components={this.installedIndividualComponents}\n                                             individualcomponents={this.selectedIndividualComponents} />\n                </div>\n\n                <!-- error message -->\n                <div class=\"summary-footer\"\n                     if={this.hasErrorMessage}\n                     role=\"alert\"\n                     aria-atomic=\"true\"\n                     aria-live=\"polite\"\n                     style=\"{this.errorMessageStyle}\">\n                    <div style={this.errorAlertImageStyle}>\n                        <img src={this.errorMessageImageSrc} />\n                    </div>\n                    <div tabindex=\"0\"\n                         role=\"note\"\n                         class=\"error-text\"\n                         aria-label={this.errorMessage}>\n                        {this.errorMessage}\n                    </div>\n                </div>\n\n            </div>\n        </div>\n\n        <div class=\"install-location\"\n                style={this.installLocationStyle}>\n\n            <!-- container for directory/nickname pickers and error message -->\n            <div style={this.controlContainerDivStyle}>\n                <div style={this.directoryPickerDivStyle}>\n                    <!-- directory picker -->\n                    <div style={this.directoryPickerAndFolderModeToggleDivStyle}>\n                        <directory-picker style={this.directoryPickerStyle}\n                                          label={locationText}\n                                          isreadonly={this.isInstalledProduct}\n                                          default-value={this.defaultInstallDir}\n                                          onChange={this._directoryChangedBind} />\n                    </div>\n\n                    <nickname-picker if={this.showNickname}\n                                     style={this.nicknamePickerStyle}\n                                     isreadonly={this.isInstalledProduct}\n                                     initialnickname={this.nickname}\n                                     onChange={this.nicknameChanged} />\n                </div>\n\n                <license-terms-text />\n            </div>\n\n            <!-- install size, button -->\n            <div style={this.installDivStyle}>\n                <install-size-breakdown is-evaluating-parameters={this.isEvaluatingParameters}\n                                       evaluation={this.evaluation}\n                                       can-install={this.canInstall} />\n\n                <button onClick={this.installModifyClicked}\n                        id=\"installModifyButton\"\n                        type=\"submit\"\n                        disabled={!this.canInstall}>\n                    {this.installModifyText}\n                </button>\n            </div>\n        </div>\n    </div>\n</details-page>")
    ], DetailsPage);
    return DetailsPage;
}(Riot.Element));
exports.DetailsPage = DetailsPage;
apply_mixins_1.applyMixins(DetailsPage, [scheduled_updater_1.ScheduledUpdater]);
//# sourceMappingURL=details-page.js.map