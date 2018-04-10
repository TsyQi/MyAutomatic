"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
/// <reference path="../../typings/riot-ts-missing-declares.d.ts" />
/// <reference path="../bower_components/riot-ts/riot-ts.d.ts" />
var factory_1 = require("../stores/factory");
var error_message_response_1 = require("../interfaces/error-message-response");
var css_styles_1 = require("../css-styles");
var features_1 = require("../../lib/feature-flags/features");
var Utilities_1 = require("../Utilities");
var Product_1 = require("../../lib/Installer/Product");
var InstallingState_1 = require("../InstallingState");
var progress_calculator_1 = require("../progress-calculator");
var InstallerActions_1 = require("../Actions/InstallerActions");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var router_1 = require("./router");
var WindowActions_1 = require("../Actions/WindowActions");
var window_action_constants_1 = require("../../lib/window-action-constants");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var errorNames = require("../../lib/error-names");
var command_line_actions_1 = require("../Actions/command-line-actions");
var command_line_operation_state_1 = require("../interfaces/command-line-operation-state");
var factory_2 = require("../Actions/factory");
var checkbox_state_1 = require("../interfaces/checkbox-state");
var product_launch_state_1 = require("../interfaces/product-launch-state");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var button_options_1 = require("../interfaces/button-options");
var button_click_event_1 = require("../Events/custom-events/button-click-event");
var exit_details_1 = require("../../lib/exit-details");
require("./available-product");
require("./information-pane-section");
require("./installed-product");
require("./list-view");
require("./channel-header");
require("./launch-banner");
require("./loading-view");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
var apply_mixins_1 = require("../mixins/apply-mixins");
/* istanbul ignore next */
var ProductsPage = /** @class */ (function (_super) {
    __extends(ProductsPage, _super);
    function ProductsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._visibilityChangedBind = _this.onVisibilityChanged.bind(_this);
        _this._onButtonClickBind = _this.onButtonClick.bind(_this);
        _this._informationPaneSections = [
            {
                header: ResourceStrings_1.ResourceStrings.welcomeTitle,
                content: [ResourceStrings_1.ResourceStrings.welcomeBody]
            }
        ];
        _this._downloadProgressBars = new Map();
        _this._installProgressBars = new Map();
        _this._progressCalculator = new progress_calculator_1.ProgressCalculator(factory_1.appStore);
        _this._handleReloadBind = _this.handleReload.bind(_this);
        _this._displayedPreviewDetectedDialog = false;
        return _this;
    }
    ProductsPage_1 = ProductsPage;
    ProductsPage.prototype.mounted = function () {
        this.hookEvents(true);
        this.handleReload();
        if (ProductsPage_1._firstTimeShowing === true) {
            ProductsPage_1._firstTimeShowing = false;
            TelemetryProxy_1.telemetryProxy.sendIpcAtomicEvent(TelemetryEventNames.APPLICATION_INITIALIZE, false);
        }
        if (!this.hasPreviewInstallations) {
            this.handleCommandLineOperation();
        }
    };
    ProductsPage.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    ProductsPage.prototype.handleReload = function () {
        if (!this.hasPreviewInstallations) {
            this.handleCommandLineOperation();
        }
        var productsToLaunch = factory_1.productLaunchStateStore.productsToLaunch;
        var telemetryContext = factory_1.appStore.createTelemetryContext("launch");
        factory_2.autolaunchActions.launchProducts(productsToLaunch, telemetryContext);
        this.scheduleUpdate();
    };
    Object.defineProperty(ProductsPage.prototype, "availableHeader", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.availableHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "installedHeader", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.installed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "installedAndInstallingList", {
        get: function () {
            return factory_1.appStore.installedAndInstallingItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "firstInstalledProduct", {
        get: function () {
            return this.installedAndInstallingList.find(function (p) {
                return p.installingState === InstallingState_1.InstallingState.NotInstalling
                    && p.product.installState === Product_1.InstallState.Installed;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "channels", {
        get: function () {
            return factory_1.appStore.getInstallableChannels().filter(function (c) { return c.visibleProducts.length > 0; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "progressCalculator", {
        get: function () {
            return this._progressCalculator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "informationPaneSections", {
        get: function () {
            return this._informationPaneSections;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "availableHeaderDivId", {
        get: function () {
            return "available-product-header";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "numberOfVisibleChannels", {
        get: function () {
            return factory_1.appStore.numberOfVisibleChannels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "isLoading", {
        get: function () {
            return factory_1.appStore.isLoading || this.isCommandLineProductLoading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "loadingScreenText", {
        get: function () {
            if (factory_1.productConfigurationStore.isLoadingDelayed) {
                return ResourceStrings_1.ResourceStrings.takingLongerThanExpected;
            }
            return factory_1.appStore.isLoading ? ResourceStrings_1.ResourceStrings.gettingThingsReady : ResourceStrings_1.ResourceStrings.almostThere;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "disableButtons", {
        get: function () {
            return factory_1.appStore.isOperationInProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "appVersion", {
        get: function () {
            return factory_1.appStore.getAppVersion();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "branch", {
        get: function () {
            return factory_1.appStore.branch;
        },
        enumerable: true,
        configurable: true
    });
    ProductsPage.prototype.productAndVersionText = function (product) {
        if (Product_1.isTypeOfInstalledProduct(product)) {
            return ResourceStrings_1.ResourceStrings.productNameWithVersionTitle(product.displayNameWithNickname, product.version.display);
        }
        return ResourceStrings_1.ResourceStrings.productNameWithVersionTitle(product.displayName, product.version.display);
    };
    ProductsPage.prototype.getInstalledOrInstallingProductCardId = function (item) {
        return this.getProductCardId(item.product);
    };
    ProductsPage.prototype.getProductCardId = function (summary) {
        return summary.channelId + ":" + summary.id;
    };
    ProductsPage.prototype.onButtonClick = function (event) {
        var telemetryContext = factory_1.appStore.createTelemetryContext(null);
        telemetryContext.initiatedFromCommandLine = false;
        telemetryContext.runningOperationToPause = factory_1.appStore.runningOperationName;
        var argv = factory_1.appStore.argv;
        var params = {
            isQuietOrPassive: factory_1.appStore.isQuietOrPassive,
            telemetryContext: telemetryContext,
            testMode: argv.testMode,
            // Only pass if there is a directed command line install operation.
            additionalOptions: null,
        };
        var details = event.detail;
        var installedProduct = details.product;
        // Special handle pause since it is a during install button
        if (details.id === button_options_1.ButtonIds.pause) {
            params.telemetryContext.userRequestedOperation = "pause";
            InstallerActions_1.pauseOperation(installedProduct, telemetryContext);
            return;
        }
        if (this.failIfOperationIsRunning()) {
            return;
        }
        switch (details.id) {
            case button_options_1.ButtonIds.install:
                // show the nickname field on the details page if we have at least one product
                var showNickname = factory_1.appStore.nicknameHelper.isNicknameRequired(details.product);
                var resetSelections = true;
                router_1.Router.goInstall(details.product, resetSelections, null, showNickname);
                break;
            case button_options_1.ButtonIds.launch:
                params.telemetryContext.userRequestedOperation = "launch";
                InstallerActions_1.launch(installedProduct, telemetryContext);
                break;
            case button_options_1.ButtonIds.retry:
            case button_options_1.ButtonIds.modify:
                router_1.Router.goModify(installedProduct, true /* resetSelections */);
                break;
            case button_options_1.ButtonIds.remove:
            case button_options_1.ButtonIds.uninstall:
                this.handleUninstall(installedProduct, params);
                break;
            case button_options_1.ButtonIds.repair:
                params.telemetryContext.userRequestedOperation = "repair";
                this.handleRepair(installedProduct, params);
                break;
            case button_options_1.ButtonIds.restart:
                WindowActions_1.windowActions.closeWindow(exit_details_1.CreateCustomExitDetails(null, null, window_action_constants_1.EXIT_CODE_REBOOT_REQUESTED));
                break;
            case button_options_1.ButtonIds.resume:
                params.telemetryContext.userRequestedOperation = "resume";
                InstallerActions_1.resume(installedProduct, params);
                break;
            case button_options_1.ButtonIds.update:
                params.telemetryContext.userRequestedOperation = "update";
                InstallerActions_1.update(installedProduct, params, argv.productKey, argv.force, argv.layoutPath);
                break;
        }
    };
    ProductsPage.prototype.handleRepair = function (product, params) {
        var options = {
            title: ResourceStrings_1.ResourceStrings.repairWarningTitle,
            message: [
                ResourceStrings_1.ResourceStrings.repairWarningMessage
            ],
            allowCancel: true,
            isCancelDefault: false,
            errorName: errorNames.REPAIR_PROMPT_ERROR_NAME,
        };
        factory_1.errorStore.show(options)
            .then(function (response) {
            if (response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                InstallerActions_1.repair(product, params);
            }
        });
    };
    ProductsPage.prototype.handleUninstall = function (product, params) {
        var options = {
            title: ResourceStrings_1.ResourceStrings.uninstallWarningTitle,
            message: [
                ResourceStrings_1.ResourceStrings.uninstallWarningMessage,
                "",
                product.displayNameWithNickname,
                product.installationPath,
                "",
                ResourceStrings_1.ResourceStrings.clickOKToContinueMessage
            ],
            allowCancel: true,
            isCancelDefault: true,
            errorName: errorNames.UNINSTALL_PROMPT_ERROR_NAME,
        };
        factory_1.errorStore.show(options)
            .then(function (response) {
            if (response.buttonType !== error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                return;
            }
            if (Product_1.isPreviewProduct(product)) {
                InstallerActions_1.deepCleanPreviewInstallations();
            }
            else {
                InstallerActions_1.uninstall(product, params);
            }
        });
    };
    ProductsPage.prototype.progressBar1 = function (item) {
        if (this.isUninstall(item)) {
            return this.progressBar(item.product, progress_calculator_1.ProgressDisplayType.Uninstall, this._installProgressBars);
        }
        if (item.installingState === InstallingState_1.InstallingState.Pausing) {
            return this.progressBar(item.product, progress_calculator_1.ProgressDisplayType.PausingDownload, this._downloadProgressBars);
        }
        if (item.product.installState === Product_1.InstallState.Unknown) {
            return {
                progress: 1,
                message: ResourceStrings_1.ResourceStrings.finishing,
                type: progress_calculator_1.ProgressDisplayType.Install,
            };
        }
        return this.progressBar(item.product, progress_calculator_1.ProgressDisplayType.Download, this._downloadProgressBars);
    };
    ProductsPage.prototype.progressBar2 = function (item) {
        if (this.isUninstall(item)
            || item.product.installState === Product_1.InstallState.Unknown) {
            return null;
        }
        if (item.installingState === InstallingState_1.InstallingState.Pausing) {
            return this.progressBar(item.product, progress_calculator_1.ProgressDisplayType.PausingInstall, this._installProgressBars);
        }
        return this.progressBar(item.product, progress_calculator_1.ProgressDisplayType.Install, this._installProgressBars);
    };
    /**
     * Only prevent pause on uninstall
     */
    ProductsPage.prototype.installSupportsPause = function (item) {
        return item.installingState !== InstallingState_1.InstallingState.Uninstalling
            && item.product.installState !== Product_1.InstallState.Unknown;
    };
    ProductsPage.prototype.showCheckbox = function (item) {
        // Do not show the checkbox when quiet or passive.
        if (factory_1.appStore.isQuietOrPassive) {
            return false;
        }
        // Show the checkbox if the product can autolaunch
        if (item && factory_1.productLaunchStateStore.canProductAutolaunch(item.product)) {
            return true;
        }
        return false;
    };
    Object.defineProperty(ProductsPage.prototype, "checkboxLabel", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.startAfterInstallation;
        },
        enumerable: true,
        configurable: true
    });
    ProductsPage.prototype.checkboxState = function (item) {
        if (!item || item.installingState !== InstallingState_1.InstallingState.Installing) {
            return checkbox_state_1.CheckboxState.None;
        }
        if (!this.showCheckbox(item)) {
            return checkbox_state_1.CheckboxState.None;
        }
        var productLaunchState = factory_1.productLaunchStateStore.productLaunchState(item.product);
        if (productLaunchState === product_launch_state_1.ProductLaunchState.LaunchAfterInstall) {
            return checkbox_state_1.CheckboxState.Checked;
        }
        if (productLaunchState === product_launch_state_1.ProductLaunchState.None) {
            return checkbox_state_1.CheckboxState.Unchecked;
        }
        return checkbox_state_1.CheckboxState.None;
    };
    ProductsPage.prototype.onCheckboxClickedCallback = function (product) {
        var _this = this;
        return function (ev) {
            var isChecked = _this.checkboxState(product) === checkbox_state_1.CheckboxState.Checked ? true : false;
            // Toggle the state by sending !isChecked
            factory_2.autolaunchActions.updateProductLaunchState(product.product, !isChecked);
        };
    };
    ProductsPage.prototype.productViewStyle = function (installing) {
        if (installing === void 0) { installing = false; }
        var style = css_styles_1.createStyleMap({
            display: "block",
            flex: "0 0 100%",
            height: "165px",
            marginBottom: "16px",
            maxWidth: "calc(100% - 75px)",
            padding: "5px",
            webkitMarginStart: "12px",
            webkitMarginEnd: "28px",
        });
        // Transition to multi-column layout.
        if (window.outerWidth > 1280) {
            style.width = "380px";
            style.flex = "0 0 auto";
            style.marginBottom = "30px";
        }
        if (factory_1.featureStore.isEnabled(features_1.Feature.ShowBitrate)) {
            if (window.outerWidth > 1280) {
                style.marginBottom = "16px";
            }
            style.height = "150px";
        }
        return style.toString();
    };
    /* tslint:disable:max-line-length */
    ProductsPage.prototype.progressBar = function (item, type, progressMap) {
        var progressBar = progressMap.get(item);
        if (!progressBar) {
            progressBar = {
                progress: this.progressCalculator.getProgress(item.installationPath, type),
                message: this.progressCalculator.getProgressMessage(item.installationPath, type),
                type: type,
            };
            progressMap.set(item, progressBar);
        }
        else {
            // Update the progress value and message
            progressBar.progress = this.progressCalculator.getProgress(item.installationPath, type);
            progressBar.message = this.progressCalculator.getProgressMessage(item.installationPath, type);
            progressBar.type = type;
        }
        return progressBar;
    };
    /* tslint:enable:max-line-length */
    ProductsPage.prototype.isUninstall = function (item) {
        return item.installingState === InstallingState_1.InstallingState.Uninstalling;
    };
    Object.defineProperty(ProductsPage.prototype, "installedProductsSectionStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                marginTop: "36px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "onlineContentMainDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 1 100%",
                overflow: "auto",
                /* Components should position relative to this element */
                position: "relative",
                webkitPaddingEnd: "4px",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "centeredStackedDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flex: "0 1 100%",
                flexDirection: "column",
                justifyContent: "center",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "launchBannerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                marginBottom: "36px",
                // +4px to stay under scrollbar
                width: "calc(100% + 4px)",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "productListStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "block",
                marginBottom: "8px",
                webkitMarginStart: "58px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "informationPaneStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 1 100%",
                padding: "34px 30px 0px",
                overflow: "auto",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "informationPaneSectionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                margin: "4px 0px 20px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "availableListHeaderStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "1.33rem",
                marginBottom: "20px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "installedListHeaderStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "1.33rem",
                marginBottom: "30px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "channelHeaderLayoutStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                marginBottom: "10px",
                webkitMarginStart: "17px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "reverseColumnStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column-reverse",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "footerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",
                height: "27px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "appVersionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                cursor: "text",
                fontSize: ".75rem",
                margin: "0px 17px",
                webkitUserSelect: "text",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "informationPaneDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                flex: "0 0 320px",
                justifyContent: "space-between",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "showLaunchBanner", {
        get: function () {
            if (factory_1.appStore.isOperationInProgress) {
                return false;
            }
            if (!this.firstInstalledProduct) {
                return false;
            }
            return factory_1.appStore.isFirstInstallExperience;
        },
        enumerable: true,
        configurable: true
    });
    ProductsPage.prototype.handleFatalProductConfigError = function () {
        if (factory_1.appStore.hasActiveCommandLineOperation && factory_1.appStore.isQuietOrPassive) {
            WindowActions_1.windowActions.closeWindow(exit_details_1.CreateSuccessExitDetails());
        }
    };
    ProductsPage.prototype.hookEvents = function (hook) {
        var hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.appStore, hook);
        hookMethod(factory_1.appStore.CHANGED_EVENT, this._handleReloadBind);
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.errorStore, hook);
        hookMethod(factory_1.errorStore.CHANGED_EVENT, this._handleReloadBind);
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.productConfigurationStore, hook);
        hookMethod(factory_1.productConfigurationStore.CHANGED_EVENT, this._handleReloadBind);
        hookMethod(factory_1.productConfigurationStore.FATAL_ERROR_EVENT, this.handleFatalProductConfigError);
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.productLaunchStateStore, hook);
        hookMethod(factory_1.productLaunchStateStore.CHANGED_EVENT, this._handleReloadBind);
        // Listen to resize for responsive styling.
        var windowHookMethod = Utilities_1.getEventHookMethodForTarget(window, hook);
        windowHookMethod("resize", this._visibilityChangedBind);
        windowHookMethod("visibilitychange", this._visibilityChangedBind);
        windowHookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        windowHookMethod(button_click_event_1.ButtonClickEvent.NAME, this._onButtonClickBind);
    };
    ProductsPage.prototype.onVisibilityChanged = function () {
        if (document && !document.hidden) {
            this.scheduleUpdate();
        }
    };
    Object.defineProperty(ProductsPage.prototype, "installBlocked", {
        get: function () {
            return factory_1.appStore.hasPreviewInstallations || this.disableButtons;
        },
        enumerable: true,
        configurable: true
    });
    ProductsPage.prototype.handleCommandLineOperation = function () {
        var argv = factory_1.appStore.argv;
        if (argv.quiet && factory_1.appStore.updateIsRequired) {
            WindowActions_1.windowActions.quitApp(exit_details_1.CreateCustomExitDetails(errorNames.UPDATE_REQUIRED_ERROR_NAME, ResourceStrings_1.ResourceStrings.installerUpdateRequired, 1));
        }
        // We want to wait until after we've loaded because we
        // need to know what products (installed or available) we
        // have before trying to perform command line operations on
        // them.
        if (factory_1.appStore.isLoading || factory_1.appStore.updateIsRequired) {
            return;
        }
        // if we don't have a command line operation to process, bail
        if (factory_1.appStore.commandLineOperationState !== command_line_operation_state_1.CommandLineOperationState.Pending) {
            return;
        }
        // Currently, do not try to do simultaneous operations.
        if (this.failIfOperationIsRunning()) {
            return;
        }
        var productSummary = factory_1.appStore.productSummaryFromCommandLineArgs;
        // show the nickname field on the details page if we have at least one product from the same channel or
        // or if --nickname was specified on the command line
        var showNickname = factory_1.appStore.nicknameHelper.isNicknameRequired(productSummary) || !!argv.nickname;
        var operation = argv.command;
        command_line_actions_1.handleCommandLineOperation(argv, factory_1.appStore.appLocale, productSummary, showNickname, factory_1.appStore.createTelemetryContext(operation));
    };
    /**
     * @returns {boolean} true if an error was shown to the user.
     */
    ProductsPage.prototype.failIfOperationIsRunning = function () {
        if (factory_1.appStore.isOperationInProgress) {
            factory_1.errorStore.showOperationIsRunningError();
            return true;
        }
        return false;
    };
    Object.defineProperty(ProductsPage.prototype, "hasPreviewInstallations", {
        get: function () {
            var hasPreviewInstallations = factory_1.appStore.hasPreviewInstallations;
            if (hasPreviewInstallations) {
                if (this._displayedPreviewDetectedDialog !== true) {
                    this._displayedPreviewDetectedDialog = true;
                    var options = {
                        title: ResourceStrings_1.ResourceStrings.uninstallPreviewTitle,
                        message: ResourceStrings_1.ResourceStrings.uninstallPreviewMessage,
                        okButtonText: ResourceStrings_1.ResourceStrings.uninstallPreview,
                        allowCancel: true,
                        errorName: errorNames.HAS_PREVIEW_PRODUCT_INSTALLED_ERROR_NAME,
                    };
                    factory_1.errorStore.show(options)
                        .then(function (response) {
                        if (response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                            InstallerActions_1.deepCleanPreviewInstallations();
                        }
                    });
                }
            }
            return hasPreviewInstallations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductsPage.prototype, "isCommandLineProductLoading", {
        /**
         * Gets a {Boolean} indicating if a product is loading and we have command line operation.
         */
        get: function () {
            return !factory_1.productConfigurationStore.isProductLoaded && factory_1.appStore.hasActiveCommandLineOperation;
        },
        enumerable: true,
        configurable: true
    });
    ProductsPage._firstTimeShowing = true;
    ProductsPage = ProductsPage_1 = __decorate([
        template("\n<products-page>\n    <div if={this.isLoading}\n         style={this.centeredStackedDivStyle}>\n        <div style={this.centeredStackedDivStyle}>\n            <loading-view loadingtext={this.loadingScreenText} />\n        </div>\n    </div>\n\n    <div if={!this.isLoading}\n         style={this.onlineContentMainDivStyle}>\n\n        <div each={this.showLaunchBanner ? [1] : []}\n            style={this.launchBannerStyle}>\n            <launch-banner\n                product={this.parent.firstInstalledProduct}></launch-banner>\n        </div>\n\n        <!-- Installed products -->\n        <div if={!this.showLaunchBanner}\n            style={this.installedProductsSectionStyle}>\n            <list-view if={this.installedAndInstallingList.length > 0}\n                       style={this.productListStyle}\n                       items={this.installedAndInstallingList}\n                       header={this.installedHeader}\n                       headerstyle={this.installedListHeaderStyle}\n                       listrole=\"group\">\n                <installed-product id={this.parent.parent.getInstalledOrInstallingProductCardId(item)}\n                                   style={this.parent.parent.productViewStyle()}\n                                   installed-product={item}\n                                   tabindex=\"0\"\n                                   aria-label={this.parent.parent.productAndVersionText(item.product)}\n                                   disable-buttons={this.parent.parent.disableButtons}\n                                   can-pause={this.parent.parent.installSupportsPause(item)}\n                                   progress-bar-one={this.parent.parent.progressBar1(item)}\n                                   progress-bar-two={this.parent.parent.progressBar2(item)}\n                                   progress-calculator={this.parent.parent.progressCalculator}\n                                   checkbox-state={this.parent.parent.checkboxState(item)}\n                                   checkbox-label={this.parent.parent.checkboxLabel}\n                                   on-checkbox-clicked={this.parent.parent.onCheckboxClickedCallback(item)} />\n            </list-view>\n        </div>\n\n        <div style={this.productListStyle}>\n            <!-- Available header -->\n            <div if={this.channels.length > 0}\n                id={this.availableHeaderDivId}\n                style={this.availableListHeaderStyle}\n                role=\"heading\">\n                {this.availableHeader}\n            </div>\n\n            <!-- Channels -->\n            <div class=\"products-page-channels-list\"\n                each={channel in this.channels}\n                role=\"group\"\n                aria-labelledby={this.availableHeaderDivId}\n                no-reorder>\n\n                <div style={this.reverseColumnStyle}>\n                    <!-- NOTE: We put the channel-header after the list of products and then put them in a flex-box with\n                        order reverse-column. This is because we want the header to appear before the products in the\n                        channel, but we want the tab ordering to be such that we tab to the products first, then the\n                        channel-header. -->\n                    <list-view items={channel.visibleProducts}\n                            listrole=\"group\">\n                        <available-product style={this.parent.parent.productViewStyle()}\n                                        id={this.parent.parent.getProductCardId(item)}\n                                        product={item}\n                                        installblocked={this.parent.parent.installBlocked}\n                                        installclicked={this.parent.parent.installClickedBind}\n                                        tabindex=\"0\"\n                                        aria-label={this.parent.parent.productAndVersionText(item)}\n                                        disablebuttons={this.parent.parent.disableButtons} />\n                    </list-view>\n                    <div if={this.parent.numberOfVisibleChannels > 1}\n                        style={this.parent.channelHeaderLayoutStyle}>\n                        <channel-header channel={channel} />\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- Information pane section -->\n    <div style={this.informationPaneDivStyle}\n         class=\"information-pane\">\n        <list-view style={this.informationPaneStyle}\n                   items={this.informationPaneSections}>\n            <div style={this.parent.informationPaneSectionStyle}>\n                <information-pane-section header={item.header}\n                                          content={item.content} />\n            </div>\n        </list-view>\n        <div style={this.footerStyle}>\n            <div style={this.appVersionStyle}\n                title={this.branch + \"@\" + this.appVersion}>\n                {this.appVersion}\n            </div>\n        </div>\n    </div>\n\n</products-page>")
    ], ProductsPage);
    return ProductsPage;
    var ProductsPage_1;
}(Riot.Element));
exports.ProductsPage = ProductsPage;
apply_mixins_1.applyMixins(ProductsPage, [scheduled_updater_1.ScheduledUpdater]);
//# sourceMappingURL=products-page.js.map