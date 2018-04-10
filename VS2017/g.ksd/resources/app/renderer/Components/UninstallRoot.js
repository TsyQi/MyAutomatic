/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/riot-ts-missing-declares.d.ts" />
/// <reference path="../../typings/modules/SemVer/index.d.ts" />
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
var factory_1 = require("../stores/factory");
var css_styles_1 = require("../css-styles");
var Utilities_1 = require("../Utilities");
var progress_calculator_1 = require("../progress-calculator");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var InstallActions_1 = require("../Actions/InstallActions");
var InstallerActions_1 = require("../Actions/InstallerActions");
var app_store_1 = require("../stores/app-store");
var WindowActions_1 = require("../Actions/WindowActions");
require("./app-header");
require("./error-dialog");
require("./progress-view");
var exit_details_1 = require("../../lib/exit-details");
var errorNames = require("../../lib/error-names");
var factory_2 = require("../Actions/factory");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
var apply_mixins_1 = require("../mixins/apply-mixins");
/* tslint:disable:max-line-length */
var UninstallRoot = /** @class */ (function (_super) {
    __extends(UninstallRoot, _super);
    function UninstallRoot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._handleReloadBind = _this.handleReload.bind(_this);
        _this._progressCalculator = new progress_calculator_1.ProgressCalculator(factory_1.appStore);
        return _this;
    }
    Object.defineProperty(UninstallRoot.prototype, "productUninstallProgressBar", {
        get: function () {
            var type = progress_calculator_1.ProgressDisplayType.Uninstall;
            var key = app_store_1.UNINSTALL_SELF_PRODUCT_PROGRESS_KEY;
            return {
                progress: this._progressCalculator.getProgress(key, type),
                message: this._progressCalculator.getProgressMessage(key, type),
                type: type,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "uninstallAllProgressBar", {
        get: function () {
            return {
                progress: this._progressCalculator.uninstallAllProgress,
                message: this._progressCalculator.uninstallAllMessage,
                type: progress_calculator_1.ProgressDisplayType.Uninstall,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "appName", {
        get: function () {
            return factory_1.appStore.appName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "branch", {
        get: function () {
            return factory_1.appStore.branch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "isAnotherInstanceRunning", {
        get: function () {
            return this.hostInstallState === app_store_1.HostInstallState.UninstallBlockedByRunningInstance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "isReadyToUninstall", {
        get: function () {
            return this.hostInstallState === app_store_1.HostInstallState.Installed &&
                !factory_1.appStore.installerStatus.isPending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "isUninstalling", {
        get: function () {
            return this.hostInstallState === app_store_1.HostInstallState.Uninstalling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "isFailed", {
        get: function () {
            return this.hostInstallState === app_store_1.HostInstallState.UninstallFailed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "errorMessage", {
        get: function () {
            return factory_1.errorStore.currentMessageData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "isErrorVisible", {
        get: function () {
            return factory_1.errorStore.isErrorVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "acceptErrorCallback", {
        get: function () {
            return factory_1.errorStore.dismiss;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "errorStateMessage", {
        get: function () {
            return this.isAnotherInstanceRunning ? this.anotherInstallerRunningText : this.failedToUninstallText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "accessibilityLogStrings", {
        get: function () {
            return factory_1.appStore.accessibilityLogStrings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "titleBarStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "errorImgStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                webkitMarginEnd: "10px",
                width: "24px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    UninstallRoot.prototype.mounted = function () {
        this.hookEvents(true);
        this.setWindowTitle();
        this.handleCommandLineOperation();
        InstallerActions_1.startPollingIntallerStatus();
    };
    UninstallRoot.prototype.unmounted = function () {
        this.hookEvents(false);
        InstallerActions_1.stopPollingIntallerStatus();
    };
    UninstallRoot.prototype.beginUninstallBtnClicked = function (ev) {
        factory_2.progressTimerActions.startTimer(app_store_1.UNINSTALL_SELF_PRODUCT_PROGRESS_KEY);
        InstallActions_1.uninstallSelf();
    };
    UninstallRoot.prototype.onCancelClicked = function () {
        WindowActions_1.windowActions.closeWindow(exit_details_1.CreateSuccessExitDetails());
    };
    Object.defineProperty(UninstallRoot.prototype, "hostInstallState", {
        get: function () {
            return factory_1.appStore.hostInstallState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "appVersion", {
        get: function () {
            return factory_1.appStore.getAppVersion();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "installedList", {
        get: function () {
            return factory_1.appStore.getInstalledItems();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "hasBlockedFromUninstallMessage", {
        get: function () {
            return !!this.blockedFromUninstallMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "blockedFromUninstallMessage", {
        get: function () {
            return factory_1.appStore.installerStatus.errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    UninstallRoot.prototype.handleReload = function () {
        this.handleCommandLineOperation();
        this.scheduleUpdate();
    };
    Object.defineProperty(UninstallRoot.prototype, "failedToUninstallText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.errorUninstalling(this.appName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "uninstallInstallerAndAllProductsText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.removeVS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "anotherInstallerRunningText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.installerRunning(this.appName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "uninstallText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.uninstall;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "cancelText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.cancel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "mainDivStyle", {
        // styles
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                height: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "messageDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                alignSelf: "center",
                display: "flex",
                flex: "1 0 0",
                justifyContent: "center",
                textAlign: "center",
                width: "40ch",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "uninstallButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "25px",
                webkitMarginEnd: "6px",
                width: "auto"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "cancelButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "25px",
                width: "auto"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "buttonsDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "flex-end",
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "uninstallDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "1 0 0px",
                flexFlow: "column nowrap",
                justifyContent: "space-between",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "uninstallInProgressDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flex: "1 0 auto",
                flexFlow: "column nowrap",
                justifyContent: "center",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "uninstallPageDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "1 0 auto",
                padding: "12px",
                position: "relative",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "progressViewStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                width: "325px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "errorCancelDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                justifyContent: "flex-end",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "blockedUninstallMessageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "2.25rem",
                textAlign: "center",
                fontSize: ".75rem",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UninstallRoot.prototype, "invisibleAccessibilityLog", {
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
    UninstallRoot.prototype.hookEvents = function (hook) {
        var hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.appStore, hook);
        hookMethod(factory_1.appStore.CHANGED_EVENT, this._handleReloadBind);
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.errorStore, hook);
        hookMethod(factory_1.errorStore.CHANGED_EVENT, this._handleReloadBind);
    };
    UninstallRoot.prototype.handleCommandLineOperation = function () {
        var argv = factory_1.appStore.argv;
        var isQuietOrPassive = argv.quiet || argv.passive;
        // Do not kick off uninstall if already uninstalling
        if (this.isUninstalling) {
            return;
        }
        if (this.isAnotherInstanceRunning || this.isFailed) {
            // Only close the window on failure for quiet
            if (argv.quiet) {
                if (this.isAnotherInstanceRunning) {
                    WindowActions_1.windowActions.quitApp(exit_details_1.CreateCustomExitDetails(errorNames.OPERATION_IS_RUNNING_ERROR_NAME, this.errorStateMessage, exit_details_1.ERROR_RETURN_CODE));
                }
                else {
                    WindowActions_1.windowActions.quitApp(exit_details_1.CreateCustomExitDetails(errorNames.FAILED_TO_UNINSTALL, this.errorStateMessage, exit_details_1.ERROR_RETURN_CODE));
                }
            }
            return;
        }
        // If we are quiet or passive, begin uninstalling
        if (isQuietOrPassive && this.isReadyToUninstall) {
            InstallActions_1.uninstallSelf();
        }
    };
    UninstallRoot.prototype.setWindowTitle = function () {
        // We don't have access to ResourceStrings from uninstall.html, so we set
        // the title here.
        document.title = ResourceStrings_1.ResourceStrings.appUninstallWindowTitle;
    };
    UninstallRoot = __decorate([
        template("\n<uninstall-root>\n    <div style={this.mainDivStyle}>\n        <app-header style={this.titleBarStyle}\n                    appversion={this.appVersion}\n                    hidefeedback={true}\n                    hidemaximize={true}\n                    branch={this.branch}\n                    showlogo={true} />\n        <div id=\"content\"\n            class=\"segoe-semilight\"\n            style={this.uninstallPageDivStyle}>\n\n            <!-- Ready to uninstall Installer and its products. -->\n            <div if={this.isReadyToUninstall}\n                    style={this.uninstallDivStyle}>\n                <div style={this.messageDivStyle}>\n                    {this.uninstallInstallerAndAllProductsText}\n                </div>\n\n                <!-- blocked from uninstall message -->\n                <div aria-atomic=\"true\"\n                    aria-live=\"polite\"\n                    aria-relevant=\"additions\"\n                    style=\"{this.blockedUninstallMessageStyle}\">\n                    <div if={this.hasBlockedFromUninstallMessage}\n                        tabindex=\"0\"\n                        role=\"note\"\n                        class=\"error-text\"\n                        aria-label={this.blockedFromUninstallMessage}>\n                        {this.blockedFromUninstallMessage}\n                    </div>\n                </div>\n\n                <div style={this.buttonsDivStyle}>\n                    <button style={this.uninstallButtonStyle}\n                            disabled={this.hasBlockedFromUninstallMessage}\n                            onclick={this.beginUninstallBtnClicked}>\n                        {this.uninstallText}\n                    </button>\n                    <button style={this.cancelButtonStyle}\n                            onclick={this.onCancelClicked}>\n                        {this.cancelText}\n                    </button>\n                </div>\n            </div>\n\n            <!-- Uninstall in progress -->\n            <div if={this.isUninstalling}\n                    style={this.uninstallInProgressDivStyle}>\n                <progress-view progressBar1={this.productUninstallProgressBar}\n                            progressBar2={this.uninstallAllProgressBar}\n                            style={this.progressViewStyle} />\n            </div>\n\n            <!-- Error state. The uninstall is blocked by another running Installer or it has failed. -->\n            <div if={this.isAnotherInstanceRunning || this.isFailed}\n                style={this.uninstallDivStyle}>\n                <div style={this.messageDivStyle}>\n                    <img src=\"images/StatusCriticalError.svg\"\n                        style={this.errorImgStyle}>\n                    </img>\n                    <div>\n                        {this.errorStateMessage}\n                    </div>\n                </div>\n                <div style={this.errorCancelDivStyle}>\n                    <button style={this.cancelButtonStyle}\n                        onclick={window.close}>\n                        {this.cancelText}\n                    </button>\n                </div>\n            </div>\n        </div>\n\n        <error-dialog if={this.isErrorVisible}\n                    error-message={this.errorMessage}\n                    onsubmit={this.acceptErrorCallback} />\n\n        <!-- Hidden div that is the queue of messages to be read to the user -->\n        <div style={this.invisibleAccessibilityLog}\n                role=\"log\">\n            <virtual each={message in this.accessibilityLogStrings}>\n                {message} <br />\n            </virtual>\n        </div>\n    </div>\n</uninstall-root>")
        /* tslint:enable */
    ], UninstallRoot);
    return UninstallRoot;
}(Riot.Element));
exports.UninstallRoot = UninstallRoot;
apply_mixins_1.applyMixins(UninstallRoot, [scheduled_updater_1.ScheduledUpdater]);
//# sourceMappingURL=UninstallRoot.js.map