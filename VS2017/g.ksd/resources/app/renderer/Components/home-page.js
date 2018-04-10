/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/riot-ts-missing-declares.d.ts" />
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
var error_message_response_1 = require("../interfaces/error-message-response");
var command_line_actions_1 = require("../Actions/command-line-actions");
var css_styles_1 = require("../css-styles");
var error_store_1 = require("../stores/error-store");
var InstallerActions_1 = require("../Actions/InstallerActions");
var HostUpdaterStatusChangedEvent_1 = require("../Events/HostUpdaterStatusChangedEvent");
var Product_1 = require("../../lib/Installer/Product");
var TabSwitchAction_1 = require("../Actions/TabSwitchAction");
var factory_2 = require("../Actions/factory");
var InstallingState_1 = require("../InstallingState");
var HostUpdaterActions_1 = require("../Actions/HostUpdaterActions");
var open_external_1 = require("../../lib/open-external");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var router_1 = require("./router");
var Tab_1 = require("../../lib/Tab");
var Utilities_1 = require("../Utilities");
var errorNames = require("../../lib/error-names");
var lightbox_1 = require("./lightbox");
var CommandLine_1 = require("../../lib/CommandLine");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
var apply_mixins_1 = require("../mixins/apply-mixins");
require("./app-logo");
require("./details-page");
require("./learn-page");
require("./lightbox");
require("./products-page");
require("./loading-view");
require("./tab-control");
require("./problems-dialog-v2");
// initial request for channel and user data
InstallerActions_1.getProductSummaries();
// don't check for elevation if we're in test mode
if (!factory_1.appStore.argv.testMode) {
    InstallerActions_1.checkProcessElevation();
}
var HomePage = /** @class */ (function (_super) {
    __extends(HomePage, _super);
    function HomePage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.INSTALL_STATE = Product_1.InstallState;
        _this._tabs = new Tab_1.TabCollection(new Tab_1.Tab(ResourceStrings_1.ResourceStrings.productsTabName, _this.productsTabId)
        // TODO add learn tab (bug264360)
        // new Tab(ResourceStrings.learnTabName, this.learnTabId)
        );
        _this._currentTab = _this.defaultTab; // tab control uses tab names
        _this._handleReloadBind = _this.handleReload.bind(_this);
        _this._updateBind = _this.scheduleUpdate.bind(_this);
        _this._tabSwitchedBind = _this.tabSwitched.bind(_this);
        _this._displayedUpdateRequiredDialog = false;
        _this._lightboxLoaded = false;
        return _this;
    }
    Object.defineProperty(HomePage.prototype, "canManageInstalls", {
        get: function () {
            // Don't allow managing when an update is required
            return factory_1.appStore.installedAndInstallingItems.length > 0
                && !factory_1.appStore.updateIsRequired
                && !this.isWaitingForCommandLineOperation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "showProductList", {
        get: function () {
            return this.isOperationInProgress ||
                this.canManageInstalls ||
                !this.loadFailedOrUpdateRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "showViewProblems", {
        get: function () {
            return factory_1.productConfigurationStore.viewProblemsActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "isOperationInProgress", {
        get: function () {
            return factory_1.appStore.isOperationInProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "isWaitingForCommandLineOperation", {
        get: function () {
            return factory_1.appStore.hasActiveCommandLineOperation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "requiredHostUpdateText", {
        get: function () {
            if (factory_1.appStore.updateIsRequired) {
                if (this.isHostUpdateDownloadFailed) {
                    return this.hostUpdateDownloadFailedReason;
                }
                return this.isHostUpdateDownloading && this.hostUpdateClicked
                    ? ResourceStrings_1.ResourceStrings.downloadingInstallerUpdate
                    : ResourceStrings_1.ResourceStrings.installerUpdateRequired;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "retryButtonText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.retry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "updateButtonName", {
        get: function () {
            return this.isHostUpdateDownloadFailed ?
                ResourceStrings_1.ResourceStrings.retry :
                ResourceStrings_1.ResourceStrings.update;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "isLoading", {
        get: function () {
            return factory_1.appStore.isLoading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "isHostUpdateDownloading", {
        get: function () {
            return factory_1.appStore.hostUpdaterStatus === HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateDownloading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "isHostUpdateDownloadFailed", {
        get: function () {
            return factory_1.appStore.hostUpdaterStatus === HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateDownloadFailed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "hostUpdateDownloadFailedReason", {
        get: function () {
            return factory_1.appStore.hostUpdaterStatusDownloadFailedMessage ||
                ResourceStrings_1.ResourceStrings.installerUpdateDownloadFailed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "lightboxSubtitle", {
        get: function () {
            return this.opts.detailsPageSubtitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "lightboxTitle", {
        get: function () {
            return this.opts.detailsPageTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "detailsPageNickname", {
        get: function () {
            return this.opts.detailsPageNickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "showDetailsPageNickname", {
        get: function () {
            return this.opts.showDetailsPageNickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "showUpdateOnDetailsPage", {
        get: function () {
            return this.opts.detailsPageShowUpdate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "defaultTab", {
        get: function () {
            return this._tabs.get(this.productsTabId);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "isProductLoading", {
        get: function () {
            return !factory_1.productConfigurationStore.isProductLoaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "lightboxMode", {
        // Use a small lightbox if there is only a single workload available for the product
        get: function () {
            if (this.isProductLoading) {
                return lightbox_1.LightboxMode.Loading;
            }
            return factory_1.productConfigurationStore.getSelectedProduct().workloads.length > 1 ?
                lightbox_1.LightboxMode.Normal :
                lightbox_1.LightboxMode.Small;
        },
        enumerable: true,
        configurable: true
    });
    HomePage.prototype.mounted = function () {
        this.hookEvents(true);
    };
    HomePage.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    HomePage.prototype.isSelectedTab = function (tabID) {
        return this.currentTab.tabID === tabID;
    };
    HomePage.prototype.viewLogClicked = function () {
        InstallerActions_1.openLog();
    };
    HomePage.prototype.releaseNotesClicked = function () {
        // show release notes
        open_external_1.openExternal("https://aka.ms/vsnewinstallerreadme");
    };
    HomePage.prototype.getTroubleshootingTipsClicked = function () {
        // open KB article for troubleshooting
        open_external_1.openExternal(error_store_1.TROUBLESHOOTING_KB_FWLINK);
    };
    Object.defineProperty(HomePage.prototype, "loadFailedOrUpdateRequired", {
        get: function () {
            return factory_1.appStore.loadFailed || factory_1.appStore.updateIsRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "tabs", {
        get: function () {
            return this._tabs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "currentTab", {
        get: function () {
            return this._currentTab;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "loadFailedReason", {
        get: function () {
            return factory_1.appStore.loadFailReason;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "showReleaseNotesLink", {
        get: function () {
            return factory_1.appStore.showReleaseNotesLink;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "productsTabId", {
        get: function () {
            return "Products";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "learnTabId", {
        get: function () {
            return "Learn";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "viewLogLinkText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.viewLog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "releaseNotesLinkText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.releaseNotes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "getTroubleshootingTipsLinkText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.getTroubleshootingTips;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "loadingText", {
        get: function () {
            if (factory_1.productConfigurationStore.isLoadingDelayed) {
                return ResourceStrings_1.ResourceStrings.takingLongerThanExpected;
            }
            return ResourceStrings_1.ResourceStrings.gettingThingsReady;
        },
        enumerable: true,
        configurable: true
    });
    HomePage.prototype.restartApp = function () {
        window.location.reload();
    };
    HomePage.prototype.installUpdateButtonClicked = function () {
        this.hostUpdateClicked = true;
        HostUpdaterActions_1.installUpdate(factory_1.appStore.hasActiveCommandLineOperation);
    };
    HomePage.prototype.closeLightbox = function () {
        // if a command line operation is in progress, make sure it's marked completed
        if (factory_1.appStore.hasActiveCommandLineOperation) {
            // If we're cancelling an install, make sure the product we were
            // installing is visible in the product list.  We do this to make
            // it easy to restart the install of a hidden product if it was cancelled.
            InstallerActions_1.showProduct(this.opts.channelId, this.opts.productId);
            command_line_actions_1.completeCommandLineOperation();
        }
        factory_2.detailsPageActions.endDetailsPageSessionWithUserCancel();
        router_1.Router.goHome();
    };
    HomePage.prototype.closeProblemsDialog = function () {
        factory_2.viewProblemsActions.hideViewProblems();
    };
    Object.defineProperty(HomePage.prototype, "appLogoStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "block",
                fontSize: "2.1rem",
                height: "52px",
                marginBottom: "30px",
                webkitAppRegion: "drag",
                webkitMarginStart: "47px",
                width: "360px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "bannerDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                margin: "0px 0px 30px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "onlineContentDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "row",
                flexGrow: "1",
                height: "100%",
                overflowY: "auto",
                webkitAppRegion: "no-drag",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "offlineContentDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                height: "0px",
                overflowY: "auto",
                webkitAppRegion: "no-drag"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "expanderDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flexGrow: "1"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "centeredStackedDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                maxWidth: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "offlineImageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "96px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "offlineTextStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                cursor: "text",
                fontSize: "1.5rem",
                maxWidth: "95%",
                margin: "30px 40px 10px 40px",
                outline: "none",
                overflow: "hidden",
                textAlign: "center",
                webkitUserSelect: "text",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "offlineButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "25px",
                marginTop: "40px",
                minWidth: "80px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "updateProgressBarStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                width: "180px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "tabContainerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                display: "flex",
                flex: "1 0 0",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "lightboxLoadingStyle", {
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
    Object.defineProperty(HomePage.prototype, "showLightbox", {
        /**
         * Gets a {Boolean} indicating if we should show the lightbox.
         */
        get: function () {
            // Only show the lightbox if the product is not loading from a command line operation
            return !!this.opts.showLightBox && !(this.isProductLoading && factory_1.appStore.hasActiveCommandLineOperation);
        },
        enumerable: true,
        configurable: true
    });
    HomePage.prototype.widthOnlyStyle = function (widthValue) {
        var style = css_styles_1.createStyleMap({
            minWidth: widthValue,
            maxWidth: widthValue
        });
        return style.toString();
    };
    Object.defineProperty(HomePage.prototype, "tabControlContainerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "0 0 auto",
                fontFamily: "Segoe UI SemiBold",
                fontSize: ".9167rem",
                margin: "0px 54px",
                // absolute position so it renders on top of the border.
                position: "absolute",
                top: "86px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "mainDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "learnPageDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "100%",
                overflowX: "auto",
                overflowY: "hidden",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hooks or unhooks events for this component
     */
    HomePage.prototype.hookEvents = function (hook) {
        // (un)hook events on the window
        var hookMethod = Utilities_1.getEventHookMethodForTarget(window, hook);
        hookMethod("online", this._updateBind);
        hookMethod("offline", this._updateBind);
        // (un)hook events on the component's root element
        hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod("tabclick", this._tabSwitchedBind);
        // (un)hook events on the app store
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.appStore, hook);
        hookMethod(factory_1.appStore.CHANGED_EVENT, this._handleReloadBind);
        // (un)hook events on the product configuration store
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.productConfigurationStore, hook);
        hookMethod(factory_1.productConfigurationStore.CHANGED_EVENT, this._handleReloadBind);
    };
    HomePage.prototype.handleReload = function () {
        var _this = this;
        // If the lightbox is showing, don't update the
        // home-page since the user won't see them and it
        // can be rather expensive.
        if (!this.opts.showLightBox) {
            // Reseting the host-update-button-has-been-clicked field if the update failed to download
            // enables the button to become enabled as the 'retry' update download.
            if (this.isHostUpdateDownloadFailed) {
                this.hostUpdateClicked = false;
            }
            if (factory_1.appStore.updateIsRequired) {
                // Update the Installer automatically, if there's an "install" or "update" command for a product
                // and no "noUpdateInstaller" flag.
                var installOrUpdateCommand = (factory_1.appStore.argv.command === CommandLine_1.CommandNames.install) ||
                    (factory_1.appStore.argv.command === CommandLine_1.CommandNames.update);
                if (installOrUpdateCommand &&
                    !this.hostUpdateClicked &&
                    !factory_1.appStore.argv.noUpdateInstaller) {
                    this.installUpdateButtonClicked();
                }
            }
            this.scheduleUpdate();
        }
        else {
            if (factory_1.appStore.updateIsRequired && !this._displayedUpdateRequiredDialog) {
                // inform the user that an update is required before losing their selection
                // state in the details window
                var options = {
                    message: ResourceStrings_1.ResourceStrings.installerUpdateRequired,
                    errorName: errorNames.UPDATE_REQUIRED_ERROR_NAME,
                };
                factory_1.errorStore.show(options)
                    .then(function (response) {
                    if (response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                        _this.opts.showLightBox = false;
                        _this.scheduleUpdate();
                    }
                });
                this._displayedUpdateRequiredDialog = true;
            }
            // If we were waiting for the lightbox to finish loading, update the UI since it is done now.
            if (!this.isProductLoading && !this._lightboxLoaded) {
                this._lightboxLoaded = true;
                this.scheduleUpdate();
            }
            else if (factory_1.productConfigurationStore.isLoadingDelayed && this.isProductLoading) {
                this.scheduleUpdate();
            }
        }
    };
    HomePage.prototype.tabSwitched = function (event) {
        event.stopPropagation();
        if (this.currentTab !== event.detail.tab) {
            try {
                var allInstalledProducts = factory_1.appStore.installedAndInstallingItems;
                var fullyInstalledProducts_1 = [];
                var installingProducts_1 = [];
                var uninstallingProducts_1 = [];
                var partialInstalls_1 = [];
                allInstalledProducts.forEach(function (product) {
                    switch (product.installingState) {
                        case InstallingState_1.InstallingState.Installing:
                        case InstallingState_1.InstallingState.Modifying:
                        case InstallingState_1.InstallingState.Repairing:
                        case InstallingState_1.InstallingState.Updating:
                            installingProducts_1.push(product.product.id);
                            break;
                        case InstallingState_1.InstallingState.Uninstalling:
                            uninstallingProducts_1.push(product.product.id);
                            break;
                        case InstallingState_1.InstallingState.NotInstalling:
                            switch (product.product.installState) {
                                case Product_1.InstallState.Installed:
                                    fullyInstalledProducts_1.push(product.product.id);
                                    break;
                                case Product_1.InstallState.NotInstalled:
                                case Product_1.InstallState.Partial:
                                case Product_1.InstallState.Unknown:
                                    partialInstalls_1.push(product.product.id);
                            }
                    }
                });
                TabSwitchAction_1.sendTabSwitchTelemetry(event.detail.tab, fullyInstalledProducts_1, installingProducts_1, uninstallingProducts_1, partialInstalls_1, factory_1.appStore.runningOperationName);
            }
            catch (e) {
                console.log(e);
            }
            this._currentTab = event.detail.tab;
            this.scheduleUpdate();
        }
    };
    HomePage = __decorate([
        template("\n<home-page>\n\n    <!-- Normal State -->\n    <div if={this.showProductList}\n         style={this.mainDivStyle}\n         aria-hidden={this.showLightbox}>\n\n        <!-- draggable region -->\n        <div style={this.bannerDivStyle}>\n            <app-logo class=\"home-page-logo\" style={this.appLogoStyle} />\n        </div>\n\n        <!-- Tabs -->\n        <div style={this.tabControlContainerStyle}>\n            <tab-control tabs={this.tabs}\n                defaulttab={this.defaultTab} />\n        </div>\n\n        <div class=\"home-page-tab-container\"\n            style={this.tabContainerStyle}>\n            <products-page if={this.isSelectedTab(this.productsTabId)}\n                           style={this.onlineContentDivStyle} />\n\n            <!-- Prevent learn page from being created/destroyed -->\n            <!-- <learn-page if={this.isSelectedTab(this.learnTabId)}\n                       style={this.learnPageDivStyle} /> -->\n        </div>\n    </div>\n\n    <!-- \"Offline\" state -->\n    <div if={!this.showProductList}\n         style={this.offlineContentDivStyle}>\n        <div style={this.expanderDivStyle} />\n        <div if={this.requiredHostUpdateText}\n             style={this.centeredStackedDivStyle}>\n            <img src=\"images/UpdateAvailable.svg\"\n                 style={this.offlineImageStyle} />\n            <div style={this.centeredStackedDivStyle}>\n                <div style={this.offlineTextStyle}\n                    aria-label={this.requiredHostUpdateText}\n                    tabindex=\"0\">\n                    {this.requiredHostUpdateText}\n                </div>\n                <div if={this.isHostUpdateDownloading && this.hostUpdateClicked}\n                     class=\"progress-bar progress-bar-blue\"\n                     style={this.updateProgressBarStyle}>\n                    <div class=\"progress-circle\" />\n                    <div class=\"progress-circle\" />\n                    <div class=\"progress-circle\" />\n                    <div class=\"progress-circle\" />\n                    <div class=\"progress-circle\" />\n                </div>\n                <div>\n                    <button style={this.offlineButtonStyle}\n                            onclick={this.installUpdateButtonClicked}\n                            disabled={this.hostUpdateClicked}>\n                        {this.updateButtonName}\n                    </button>\n                </div>\n            </div>\n        </div>\n        <div if={!this.requiredHostUpdateText}\n             style={this.centeredStackedDivStyle}>\n            <div style={this.centeredStackedDivStyle}>\n                <img src=\"images/ConnectionOffline.svg\"\n                     style={this.offlineImageStyle} />\n                <div style={this.offlineTextStyle}\n                    aria-label={this.loadFailedReason}\n                    tabindex=\"0\">\n                    {this.loadFailedReason}\n                </div>\n                <a href=\"#\"\n                   class=\"clickable\"\n                   onclick={this.viewLogClicked}\n                   tabindex=\"0\">\n                    {this.viewLogLinkText}\n                </a>\n                <a if={this.showReleaseNotesLink}\n                   href=\"#\"\n                   class=\"clickable\"\n                   onclick={this.releaseNotesClicked}\n                   tabindex=\"0\">\n                    {this.releaseNotesLinkText}\n                </a>\n                <a if={this.showReleaseNotesLink}\n                   href=\"#\"\n                   class=\"clickable\"\n                   onclick={this.getTroubleshootingTipsClicked}\n                   tabindex=\"0\">\n                    {this.getTroubleshootingTipsLinkText}\n                </a>\n                <div>\n                    <button style={this.offlineButtonStyle}\n                            onclick={restartApp}>\n                        {this.retryButtonText}\n                    </button>\n                </div>\n            </div>\n        </div>\n        <div style={this.expanderDivStyle} />\n    </div>\n    <div each={this.showLightbox ? [1] : []}>\n        <div if={this.parent.isProductLoading}>\n            <lightbox onclose={this.parent.closeLightbox}\n                      mode={this.parent.lightboxMode}>\n\n                <!-- Loading screen -->\n                <div style={this.parent.lightboxLoadingStyle}>\n                    <loading-view loadingtext={this.parent.loadingText} />\n                </div>\n\n            </lightbox>\n        </div>\n\n        <div each={!this.isProductLoading ? [1] : []}>\n            <lightbox onclose={this.parent.closeLightbox}\n                      pagetitle={this.parent.lightboxTitle}\n                      pagesubtitle={this.parent.lightboxSubtitle}\n                      mode={this.parent.lightboxMode}>\n\n                <details-page requestednickname={this.parent.detailsPageNickname}\n                              shownickname={this.parent.showDetailsPageNickname}\n                              show-update={this.parent.showUpdateOnDetailsPage} />\n\n            </lightbox>\n        </div>\n    </div>\n    <div each={this.showViewProblems ? [1] : []}>\n        <problems-dialog-v2 onclose={this.parent.closeProblemsDialog}></problems-dialog-v2>\n    </div>\n</home-page>")
    ], HomePage);
    return HomePage;
}(Riot.Element));
apply_mixins_1.applyMixins(HomePage, [scheduled_updater_1.ScheduledUpdater]);
//# sourceMappingURL=home-page.js.map