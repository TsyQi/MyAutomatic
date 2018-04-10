/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
Object.defineProperty(exports, "__esModule", { value: true });
var error_message_response_1 = require("../interfaces/error-message-response");
var string_utilities_1 = require("../../lib/string-utilities");
var cancel_requested_event_1 = require("../Events/cancel-requested-event");
var CommandLine_1 = require("../../lib/CommandLine");
var read_progress_bar_event_1 = require("../Events/read-progress-bar-event");
var deep_clean_preview_installations_events_1 = require("../Events/deep-clean-preview-installations-events");
var FileSystem_1 = require("../../lib/FileSystem");
var begin_command_line_operation_event_1 = require("../Events/begin-command-line-operation-event");
var channel_1 = require("./channel");
var get_channel_info_finished_event_1 = require("../Events/get-channel-info-finished-event");
var get_summaries_finished_event_1 = require("../Events/get-summaries-finished-event");
var installed_product_received_event_1 = require("../Events/installed-product-received-event");
var complete_command_line_operation_event_1 = require("../Events/complete-command-line-operation-event");
var command_line_args_1 = require("../interfaces/command-line-args");
var command_line_operation_state_1 = require("../interfaces/command-line-operation-state");
var Product_1 = require("../../lib/Installer/Product");
var installed_product_errors_1 = require("../../lib/Installer/installed-product-errors");
var dispatcher_1 = require("../dispatcher");
var ElevationRequiredEvent_1 = require("../Events/ElevationRequiredEvent");
var KeyCodes_1 = require("../KeyCodes");
var error_dialog_mode_1 = require("../interfaces/error-dialog-mode");
var events_1 = require("events");
var HostUpdaterStatusChangedEvent_1 = require("../Events/HostUpdaterStatusChangedEvent");
var installed_or_installing_product_1 = require("../interfaces/installed-or-installing-product");
var installer_status_changed_event_1 = require("../Events/installer-status-changed-event");
var installer_notification_received_event_1 = require("../Events/installer-notification-received-event");
var InstallFinishedEvent_1 = require("../Events/InstallFinishedEvent");
var InstallingState_1 = require("../InstallingState");
var InstallProgressEvent_1 = require("../Events/InstallProgressEvent");
var InstallStartedEvent_1 = require("../Events/InstallStartedEvent");
var locale_handler_1 = require("../../lib/locale-handler");
var ModifyFinishedEvent_1 = require("../Events/ModifyFinishedEvent");
var ModifyStartedEvent_1 = require("../Events/ModifyStartedEvent");
var OperationFailedEvent_1 = require("../Events/OperationFailedEvent");
var launch_banner_closed_event_1 = require("../Events/launch-banner-closed-event");
var querystring_1 = require("querystring");
var pending_app_closure_1 = require("../interfaces/pending-app-closure");
var reboot_timing_1 = require("../interfaces/reboot-timing");
var remove_channel_finished_event_1 = require("../Events/remove-channel-finished-event");
var remove_channel_started_event_1 = require("../Events/remove-channel-started-event");
var RepairFinishedEvent_1 = require("../Events/RepairFinishedEvent");
var RepairStartedEvent_1 = require("../Events/RepairStartedEvent");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var show_product_event_1 = require("../Events/show-product-event");
var UninstallFinishedEvent_1 = require("../Events/UninstallFinishedEvent");
var UninstallSelfStatusChangedEvent_1 = require("../Events/UninstallSelfStatusChangedEvent");
var UninstallStartedEvent_1 = require("../Events/UninstallStartedEvent");
var update_finished_event_1 = require("../Events/update-finished-event");
var update_started_event_1 = require("../Events/update-started-event");
var window_close_request_event_1 = require("../Events/window-close-request-event");
var WindowStateChangedEvent_1 = require("../Events/WindowStateChangedEvent");
var errorNames = require("../../lib/error-names");
var features_1 = require("../../lib/feature-flags/features");
var nickname_helper_1 = require("../../renderer/nickname-helper");
var HostInstallState;
(function (HostInstallState) {
    HostInstallState[HostInstallState["Installed"] = 0] = "Installed";
    HostInstallState[HostInstallState["Uninstalling"] = 1] = "Uninstalling";
    HostInstallState[HostInstallState["UninstallFailed"] = 2] = "UninstallFailed";
    HostInstallState[HostInstallState["UninstallBlockedByRunningInstance"] = 3] = "UninstallBlockedByRunningInstance";
})(HostInstallState = exports.HostInstallState || (exports.HostInstallState = {}));
exports.ACCESSIBILITY_LOG_STRING_LIMIT = 20;
exports.UNINSTALL_SELF_PRODUCT_PROGRESS_KEY = "uninstall-self-product-progress";
var noAppClosure = pending_app_closure_1.PendingAppClosure.CreateNull();
/**
 * App Store: Contains state for the app
 */
var AppStore = /** @class */ (function (_super) {
    __extends(AppStore, _super);
    function AppStore(window, errorStore, utilities, channelProductFilterFactory, features) {
        var _this = _super.call(this) || this;
        _this._appVersion = "";
        _this._branch = "";
        _this._channels = [];
        _this._firstInstallExperienceSeen = false;
        _this._isFirstInstallExperience = false;
        _this._isWindowCloseRequestErrorVisible = false;
        _this._productsParseFailReason = null;
        _this._channelDownloadFailed = false;
        _this._productsReceived = false;
        _this._downloadProgressByInstallationPath = new Map();
        _this._installationsReceived = false;
        _this._channelInfoReceived = false;
        _this._installProgressByInstallationPath = new Map();
        _this._locale = "";
        _this._showReleaseNotesLink = false;
        _this._pendingAppClosure = noAppClosure;
        _this._pendingInstallerNotifications = new Map();
        _this._installedOrInstallingList = [];
        _this._accessibilityLog = [];
        _this._isDeepCleaningPreviewInstallations = false;
        _this._installerStatus = installer_status_changed_event_1.InstallerStatus.pending;
        /* tslint:disable:member-ordering */
        // Backing field. Use property instead.
        _this._hostUpdaterStatusEvent = new HostUpdaterStatusChangedEvent_1.HostUpdaterStatusChangedEvent(HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateNotAvailable, false);
        _this._featureStore = features;
        _this._errorStore = errorStore;
        _this._channelProductFilterFactory = channelProductFilterFactory;
        _this.windowState = new WindowStateChangedEvent_1.WindowState();
        // fetch version from window.location
        var queryString = window.location.search.substr(1);
        var queryStringParts = querystring_1.parse(queryString);
        var queryOptions = _this.queryOptionsFromQueryStringParts(queryStringParts, utilities);
        _this._appVersion = queryOptions.appVersion;
        _this._branch = queryOptions.branch;
        _this._locale = locale_handler_1.LocaleHandler.getSupportedLocale(queryOptions.locale);
        _this._argv = new command_line_args_1.CommandLineArgs(queryOptions);
        _this._showDownlevelSkus = !!queryOptions.showDownlevelSkus;
        _this._nicknameHelper = nickname_helper_1.createNicknameHelper(_this);
        _this._commandLineOperationState = (_this._argv.command)
            ? command_line_operation_state_1.CommandLineOperationState.Pending
            : command_line_operation_state_1.CommandLineOperationState.Unspecified;
        if (_this._argv.quiet || _this._argv.passive) {
            _this._errorStore.setErrorsToQuiet();
        }
        /* istanbul ignore next */
        window.addEventListener("keyup", function (ev) {
            if (ev.keyCode === KeyCodes_1.keyCodes.F12) {
                // if we're in debug mode, open dev tools when F12 is pressed,
                // if we're not in debug mode, open dev tools when Ctrl+Alt+Shift+F12 is pressed
                if (_this._argv.debug || (ev.ctrlKey && ev.altKey && ev.shiftKey)) {
                    utilities.openDevTools();
                }
            }
        });
        // when uninstalling, this value could be set to true to
        // notify us of another running instance
        /* istanbul ignore next */
        if (queryOptions.isAnotherInstanceRunning) {
            _this._hostInstallState = HostInstallState.UninstallBlockedByRunningInstance;
        }
        else {
            _this._hostInstallState = HostInstallState.Installed;
        }
        _this._eventHandlers = [
            { event: get_summaries_finished_event_1.GetSummariesFinishedEvent, callback: _this.onGetSummariesFinished.bind(_this) },
            { event: installed_product_received_event_1.InstalledProductReceivedEvent, callback: _this.onInstalledProductReceived.bind(_this) },
            { event: HostUpdaterStatusChangedEvent_1.HostUpdaterStatusChangedEvent, callback: _this.onHostUpdaterStatusChanged.bind(_this) },
            { event: InstallProgressEvent_1.InstallProgressEvent, callback: _this.onInstallProgressChanged.bind(_this) },
            { event: OperationFailedEvent_1.OperationFailedEvent, callback: _this.onOperationFailed.bind(_this) },
            { event: UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent, callback: _this.onUninstallSelfStatusChanged.bind(_this) },
            { event: installer_notification_received_event_1.InstallerNotificationReceivedEvent, callback: _this.onInstallerNotificationReceived.bind(_this) },
            { event: InstallFinishedEvent_1.InstallFinishedEvent, callback: _this.onInstallFinished.bind(_this) },
            { event: InstallStartedEvent_1.InstallStartedEvent, callback: _this.onInstallStarted.bind(_this) },
            { event: ModifyFinishedEvent_1.ModifyFinishedEvent, callback: _this.onModifyFinished.bind(_this) },
            { event: ModifyStartedEvent_1.ModifyStartedEvent, callback: _this.onModifyStarted.bind(_this) },
            { event: update_finished_event_1.UpdateFinishedEvent, callback: _this.onUpdateFinished.bind(_this) },
            { event: update_started_event_1.UpdateStartedEvent, callback: _this.onUpdateStarted.bind(_this) },
            { event: begin_command_line_operation_event_1.BeginCommandLineOperationEvent, callback: _this.beginCommandLineOperation.bind(_this) },
            { event: complete_command_line_operation_event_1.CompleteCommandLineOperationEvent, callback: _this.completeCommandLineOperation.bind(_this) },
            { event: launch_banner_closed_event_1.LaunchBannerClosedEvent, callback: _this.launchBannerClosed.bind(_this) },
            { event: show_product_event_1.ShowProductEvent, callback: _this.showProduct.bind(_this) },
            { event: UninstallFinishedEvent_1.UninstallFinishedEvent, callback: _this.onUninstallFinished.bind(_this) },
            { event: UninstallStartedEvent_1.UninstallStartedEvent, callback: _this.onUninstallStarted.bind(_this) },
            { event: WindowStateChangedEvent_1.WindowStateChangedEvent, callback: _this.onWindowStateChangedEvent.bind(_this) },
            { event: RepairFinishedEvent_1.RepairFinishedEvent, callback: _this.onRepairFinished.bind(_this) },
            { event: RepairStartedEvent_1.RepairStartedEvent, callback: _this.onRepairStarted.bind(_this) },
            { event: get_channel_info_finished_event_1.GetChannelInfoFinishedEvent, callback: _this.onGetChannelInfoFinished.bind(_this) },
            { event: window_close_request_event_1.WindowCloseRequestEvent, callback: _this.onWindowCloseRequest.bind(_this) },
            { event: ElevationRequiredEvent_1.ElevationRequiredEvent, callback: _this.onElevationRequired.bind(_this) },
            {
                event: deep_clean_preview_installations_events_1.DeepCleanPreviewInstallationsCompleted,
                callback: _this.onDeepCleanPreviewInstallationsCompleted.bind(_this)
            },
            {
                event: deep_clean_preview_installations_events_1.DeepCleanPreviewInstallationsStarted,
                callback: _this.onDeepCleanPreviewInstallationsStarted.bind(_this)
            },
            {
                event: installer_status_changed_event_1.InstallerStatusChangedEvent,
                callback: _this.onInstallerStatusChangedEvent.bind(_this)
            },
            {
                event: remove_channel_finished_event_1.RemoveChannelFinishedEvent,
                callback: _this.onRemoveChannelFinishedEvent.bind(_this)
            },
            {
                event: remove_channel_started_event_1.RemoveChannelStartedEvent,
                callback: _this.onRemoveChannelStartedEvent.bind(_this)
            },
            {
                event: cancel_requested_event_1.CancelRequestedEvent,
                callback: _this.onCancelRequestedEvent.bind(_this)
            },
            {
                event: read_progress_bar_event_1.ReadProgressBarEvent,
                callback: _this.readProgressBarEvent.bind(_this)
            },
        ];
        _this.registerEvents();
        return _this;
    }
    AppStore.makeProductFirstInChannels = function (channels, channelId, productId) {
        if (!channelId || !productId || !channels || channels.length === 0) {
            return;
        }
        // move the specified channel to the beginning of the list of channels
        channels.sort(AppStore.makeItemFirst(channelId));
        // if the first channel is the specified channel, move the specified product to the
        // beginning of its list of products
        if (string_utilities_1.caseInsensitiveAreEqual(channels[0].id, channelId)) {
            channels[0].products.sort(AppStore.makeItemFirst(productId));
        }
    };
    AppStore.makeItemFirst = function (id) {
        return function (a, b) {
            if (string_utilities_1.caseInsensitiveAreEqual(a.id, id)) {
                return -1;
            }
            else if (string_utilities_1.caseInsensitiveAreEqual(b.id, id)) {
                return 1;
            }
            return 0;
        };
    };
    Object.defineProperty(AppStore.prototype, "CHANGED_EVENT", {
        get: function () {
            return "CHANGED";
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.dispose = function () {
        this._accessibilityLog = [];
        this.unregisterEvents();
    };
    Object.defineProperty(AppStore.prototype, "argv", {
        get: function () {
            return this._argv;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "commandLineOperationState", {
        get: function () {
            return this._commandLineOperationState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "hasActiveCommandLineOperation", {
        /**
         * Returns true if there is an active command line operation (i.e. if
         * the command line operation state is not Unspecified or Complete).
         */
        get: function () {
            switch (this._commandLineOperationState) {
                case command_line_operation_state_1.CommandLineOperationState.Unspecified:
                case command_line_operation_state_1.CommandLineOperationState.Complete:
                    return false;
                default:
                    return true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "isFirstInstallExperience", {
        get: function () {
            return this._isFirstInstallExperience;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "nicknameHelper", {
        get: function () {
            return this._nicknameHelper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "pendingAppClosure", {
        get: function () {
            return this._pendingAppClosure;
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.clearPendingAppClosure = function () {
        if (this._pendingAppClosure !== noAppClosure) {
            this._pendingAppClosure = noAppClosure;
            this.emitChangedEvent();
        }
    };
    Object.defineProperty(AppStore.prototype, "loadFailed", {
        get: function () {
            return !!this._productsParseFailReason && !this._channelDownloadFailed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "loadFailReason", {
        get: function () {
            return this._productsParseFailReason || ResourceStrings_1.ResourceStrings.notConnected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "showReleaseNotesLink", {
        get: function () {
            return this._showReleaseNotesLink;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "isLoading", {
        /**
         * Show the loading screen while one of the following is true:
         *  * The installations have not been received.
         *  * Installations received, but 0 installations and no channels received.
         *  * Host updater is still checking for updates.
         */
        get: function () {
            return !this.loadFailed
                && (!this._installationsReceived
                    || (this._installationsReceived && this._installations.length === 0 && !this._productsReceived)
                    || this.hostUpdaterStatus === HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.Pending);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "appName", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.appWindowTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "hostInstallState", {
        get: function () {
            return this._hostInstallState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "maximized", {
        get: function () {
            return this.windowState.maximized;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "branch", {
        get: function () {
            return this._branch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "appLocale", {
        get: function () {
            return this._locale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "installedAndInstallingItems", {
        get: function () {
            return this._installedOrInstallingList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "productSummaryFromCommandLineArgs", {
        /**
         * Gets the matching IProductSummary or IInstalledProductSummary
         * for command line handling.
         */
        get: function () {
            // If no command line args are specified, return null.
            if (this._commandLineOperationState === command_line_operation_state_1.CommandLineOperationState.Unspecified) {
                return null;
            }
            var channelId = this._argv.channelId;
            var productId = this._argv.productId;
            var installPath = this._argv.installPath;
            var fromInstalledProducts = true;
            switch (this._argv.command) {
                case CommandLine_1.CommandNames.install:
                    // See if a matching product is already installed. If it is, return the installed summary,
                    // otherwise try to see if the product is available to install.
                    var productSummary = installPath
                        ? this.findInstalledProductSummary(installPath)
                        : this.findProductSummary(channelId, productId, fromInstalledProducts);
                    if (!productSummary) {
                        return this.findProductSummary(channelId, productId, !fromInstalledProducts);
                    }
                    return productSummary;
                case CommandLine_1.CommandNames.modify:
                case CommandLine_1.CommandNames.repair:
                case CommandLine_1.CommandNames.resume:
                case CommandLine_1.CommandNames.uninstall:
                case CommandLine_1.CommandNames.update:
                    // locate the installed product that we're going to operate on
                    // (--installPath takes precedence over --channelId/--productId)
                    return installPath
                        ? this.findInstalledProductSummary(installPath)
                        : this.findProductSummary(channelId, productId, fromInstalledProducts);
                default:
                    return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "isQuietOrPassive", {
        get: function () {
            return this.argv.quiet || this.argv.passive;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @returns {IProductSummaryBase} for the supplied parameters. null if the item is not found
     */
    AppStore.prototype.findProductSummary = function (channelId, id, fromInstalledProducts) {
        if (fromInstalledProducts) {
            return this._installations.find(function (installedProductSummary) {
                return string_utilities_1.caseInsensitiveAreEqual(installedProductSummary.channelId, channelId)
                    && string_utilities_1.caseInsensitiveAreEqual(installedProductSummary.id, id);
            });
        }
        var channel = this._channels.find(function (c) { return string_utilities_1.caseInsensitiveAreEqual(c.id, channelId); });
        if (channel) {
            return channel.products.find(function (productSummary) {
                return string_utilities_1.caseInsensitiveAreEqual(productSummary.channelId, channelId)
                    && string_utilities_1.caseInsensitiveAreEqual(productSummary.id, id);
            });
        }
        return null;
    };
    /**
     * @returns {IInstalledProductSummary} for the supplied path. null if the item is not found
     */
    AppStore.prototype.findInstalledProductSummary = function (installPath) {
        return this._installations.find(function (installedProductSummary) {
            return FileSystem_1.arePathsEqual(installPath, installedProductSummary.installationPath);
        });
    };
    AppStore.prototype.getAppVersion = function () {
        return this._appVersion;
    };
    AppStore.prototype.getInstallProgressByInstallationPath = function (installationPath) {
        return this._installProgressByInstallationPath.get(installationPath);
    };
    AppStore.prototype.getDownloadProgressByInstallationPath = function (installationPath) {
        return this._downloadProgressByInstallationPath.get(installationPath);
    };
    Object.defineProperty(AppStore.prototype, "numberOfVisibleChannels", {
        /**
         * Gets the number of channels with visible products.
         */
        get: function () {
            return this._channels.filter(function (channel) { return channel.visibleProducts.length !== 0; }).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "allChannels", {
        /**
         * Gets all the channels without any filtering
         */
        get: function () {
            return this._channels;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the channels with installable products.
     */
    AppStore.prototype.getInstallableChannels = function () {
        var channelProductFilter = this.createChannelFilter();
        var filteredChannels = channelProductFilter.filter(this._channels);
        // Sort the products within the filtered channels.
        this.sortChannelProducts(filteredChannels);
        return filteredChannels;
    };
    /**
     * Get all known installations, including ones that are in progress.
     */
    AppStore.prototype.getInstalledItems = function () {
        return this._installedOrInstallingList.map(function (item) { return item.product; });
    };
    Object.defineProperty(AppStore.prototype, "uninstallAllProgress", {
        get: function () {
            return this._uninstallAllProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "hostUpdaterStatus", {
        get: function () {
            return this._hostUpdaterStatusEvent.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "hostUpdaterStatusDownloadFailedMessage", {
        get: function () {
            if (this._hostUpdaterStatusEvent.status === HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateDownloadFailed) {
                if (this._hostUpdaterStatusEvent.error) {
                    return this._hostUpdaterStatusEvent.error.message;
                }
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "updateIsRequired", {
        get: function () {
            return this.shouldCheckForHostUpdates() && !!this._hostUpdaterStatusEvent.isRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "isInstallInProgress", {
        get: function () {
            return this.isOperationInProgressWithState(InstallingState_1.InstallingState.Installing);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "isUninstallInProgress", {
        get: function () {
            return this.isOperationInProgressWithState(InstallingState_1.InstallingState.Uninstalling);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "isModifyInProgress", {
        get: function () {
            return this.isOperationInProgressWithState(InstallingState_1.InstallingState.Modifying);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "isUpdateInProgress", {
        get: function () {
            return this.isOperationInProgressWithState(InstallingState_1.InstallingState.Updating);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "isRepairInProgress", {
        get: function () {
            return this.isOperationInProgressWithState(InstallingState_1.InstallingState.Repairing);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "accessibilityLogStrings", {
        get: function () {
            return this._accessibilityLog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "numberOfInstalls", {
        get: function () {
            return this.installedAndInstallingItems.length;
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.getProductInstallingStatus = function (product, installationPath) {
        var item = this._installedOrInstallingList
            .find(function (storedProduct) { return storedProduct.equals(product, installationPath); });
        if (item) {
            return item.installingState;
        }
        return InstallingState_1.InstallingState.NotInstalling;
    };
    Object.defineProperty(AppStore.prototype, "isOperationInProgress", {
        get: function () {
            return this._installedOrInstallingList
                .some(function (product) { return product.installingState !== InstallingState_1.InstallingState.NotInstalling; });
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.onWindowCloseRequest = function (event) {
        var _this = this;
        if (this.isOperationInProgress || this.hostInstallState === HostInstallState.Uninstalling) {
            if (!this._isWindowCloseRequestErrorVisible) {
                this._isWindowCloseRequestErrorVisible = true;
                var errorOptions = {
                    allowCancel: false,
                    errorLink: undefined,
                    okButtonText: ResourceStrings_1.ResourceStrings.ok,
                    message: [
                        ResourceStrings_1.ResourceStrings.cannotPerformOperationWhileInstalling,
                        "",
                        ResourceStrings_1.ResourceStrings.pleaseWaitUntilOperationFinished
                    ],
                    title: "",
                    errorName: errorNames.WINDOW_CLOSE_ERROR_NAME,
                };
                var errorDialogShow = this._errorStore.show(errorOptions);
                errorDialogShow.finally(function () {
                    _this._isWindowCloseRequestErrorVisible = false;
                });
            }
            event.preventDefault();
        }
    };
    Object.defineProperty(AppStore.prototype, "isDeepCleaningPreviewInstallations", {
        get: function () {
            return this._isDeepCleaningPreviewInstallations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "hasPreviewInstallations", {
        get: function () {
            return this._installations.some(Product_1.isPreviewProduct);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "installerStatus", {
        get: function () {
            return this._installerStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppStore.prototype, "runningOperationName", {
        /**
         * String used in telemetry to identify the running operation.
         */
        get: function () {
            if (this.isInstallInProgress) {
                return "install";
            }
            if (this.isUninstallInProgress) {
                return "uninstall";
            }
            if (this.isModifyInProgress) {
                return "modify";
            }
            if (this.isRepairInProgress) {
                return "repair";
            }
            if (this.isUpdateInProgress) {
                return "update";
            }
            return "none";
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.installedProductsForChannel = function (channelId) {
        return this.installedAndInstallingItems
            .filter(function (product) { return string_utilities_1.caseInsensitiveAreEqual(channelId, product.product.channelId); })
            .map(function (product) { return product.product; });
    };
    AppStore.prototype.createTelemetryContext = function (userRequestedOperation) {
        return {
            initiatedFromCommandLine: this.hasActiveCommandLineOperation,
            numberOfInstalls: this.numberOfInstalls,
            isFirstInstallExperience: this.isFirstInstallExperience,
            userRequestedOperation: userRequestedOperation,
        };
    };
    AppStore.prototype.launchBannerClosed = function (event) {
        this._isFirstInstallExperience = false;
        this.emitChangedEvent();
    };
    AppStore.prototype.showProduct = function (event) {
        var fromInstalledProducts = true;
        var product = this.findProductSummary(event.channelId, event.productId, fromInstalledProducts) ||
            this.findProductSummary(event.channelId, event.productId, !fromInstalledProducts);
        // only emit the changed event if the product is currently hidden
        if (product && product.hidden) {
            product.hidden = false;
            this.emitChangedEvent();
        }
    };
    AppStore.prototype.isOperationInProgressWithState = function (installingState) {
        return this._installedOrInstallingList
            .some(function (item) { return item.installingState === installingState; });
    };
    AppStore.prototype.registerEvents = function () {
        var register = true;
        this.registerOrUnregisterEvents(register);
    };
    AppStore.prototype.unregisterEvents = function () {
        var unregister = false;
        this.registerOrUnregisterEvents(unregister);
    };
    AppStore.prototype.registerOrUnregisterEvents = function (register) {
        var registerFunction = register
            ? dispatcher_1.dispatcher.register
            : dispatcher_1.dispatcher.unregister;
        this._eventHandlers.forEach(function (handler) {
            registerFunction.call(dispatcher_1.dispatcher, handler.event, handler.callback);
        });
    };
    AppStore.prototype.onInstallFinished = function (event) {
        var product = event.getProduct();
        var installation = product;
        // Create a cloned install product
        if (!Product_1.isTypeOfInstalledProduct(installation)) {
            installation = new Product_1.InstalledProductSummary(product.id, product.installerId, product.channel, product.name, product.description, product.longDescription, product.version, null, /* installationId */ event.installationPath, event.nickname, event.success ? Product_1.InstallState.Installed : Product_1.InstallState.Unknown, false /* isUpdateAvailable */, product.version, product.icon, product.hidden, event.isRebootRequired, new installed_product_errors_1.InstalledProductErrors([], [], !event.success, event.log), product.releaseNotes);
        }
        this.handleOperationFinished(installation, event, ResourceStrings_1.ResourceStrings.installFinished);
    };
    AppStore.prototype.onInstallStarted = function (event) {
        // Only set isFirstInstallExperience on the first install.
        if (!this._firstInstallExperienceSeen
            && this._installedOrInstallingList.length === 0) {
            this._isFirstInstallExperience = true;
            this._firstInstallExperienceSeen = true;
        }
        else {
            this._isFirstInstallExperience = false;
        }
        var product = event.product;
        var installation = new Product_1.InstalledProductSummary(product.id, product.installerId, product.channel, product.name, product.description, product.longDescription, product.version, null, /* installationId */ event.installationPath, event.nickname, Product_1.InstallState.NotInstalled, false /* isUpdateAvailable */, product.version, product.icon, product.hidden, false /* hasPendingReboot */, new installed_product_errors_1.InstalledProductErrors([], [], false, ""), product.releaseNotes);
        this.handleOperationStarted(installation, InstallingState_1.InstallingState.Installing, ResourceStrings_1.ResourceStrings.installing);
    };
    AppStore.prototype.onModifyFinished = function (event) {
        this.handleOperationFinished(event.getProduct(), event, ResourceStrings_1.ResourceStrings.modifyFinished);
    };
    AppStore.prototype.onModifyStarted = function (event) {
        this.handleOperationStarted(event.product, InstallingState_1.InstallingState.Modifying, ResourceStrings_1.ResourceStrings.modifying);
    };
    AppStore.prototype.onUpdateFinished = function (event) {
        this.handleOperationFinished(event.getProduct(), event, ResourceStrings_1.ResourceStrings.updateFinished);
    };
    AppStore.prototype.onUpdateStarted = function (event) {
        this.handleOperationStarted(event.product, InstallingState_1.InstallingState.Updating, ResourceStrings_1.ResourceStrings.updating);
    };
    AppStore.prototype.onRepairFinished = function (event) {
        this.handleOperationFinished(event.getProduct(), event, ResourceStrings_1.ResourceStrings.repairFinished);
    };
    AppStore.prototype.onRepairStarted = function (event) {
        this.handleOperationStarted(event.product, InstallingState_1.InstallingState.Repairing, ResourceStrings_1.ResourceStrings.repairing);
    };
    AppStore.prototype.onUninstallFinished = function (event) {
        this.handleOperationFinished(event.getProduct(), event, ResourceStrings_1.ResourceStrings.uninstallFinished, event.success);
    };
    AppStore.prototype.onUninstallStarted = function (event) {
        this.handleOperationStarted(event.product, InstallingState_1.InstallingState.Uninstalling, ResourceStrings_1.ResourceStrings.uninstalling);
    };
    AppStore.prototype.handleOperationStarted = function (product, installingState, messageToAddSelector) {
        this.setInstallingState(product, installingState, null);
        this.addMessageToAccessibilityLog(messageToAddSelector(product.name));
        this.emitChangedEvent();
    };
    AppStore.prototype.handleOperationFinished = function (product, event, messageToAddSelector, removeInstallation) {
        if (removeInstallation === void 0) { removeInstallation = false; }
        this.clearProgressEvents(event.installationPath);
        this.addMessageToAccessibilityLog(messageToAddSelector(product.name));
        if (removeInstallation) {
            this.removeInstallation(product, event.installationPath);
        }
        else {
            this.setInstallingState(product, InstallingState_1.InstallingState.NotInstalling, event.log);
        }
        if (!this.handleRebootRequired(event)) {
            this.closeIfQuiet(event.success);
        }
        this.emitChangedEvent();
    };
    AppStore.prototype.readProgressBarEvent = function (event) {
        if (!event) {
            return;
        }
        var downloadProgressEvent = this.getDownloadProgressByInstallationPath(event.installationPath);
        var installProgressEvent = this.getInstallProgressByInstallationPath(event.installationPath);
        // executes during uninstall
        if (this.isUninstallInProgress || this.hostInstallState === HostInstallState.Uninstalling) {
            this.addUninstallAccessibilityLog(installProgressEvent);
            // executes during uninstallAll
            if (event.installationPath === exports.UNINSTALL_SELF_PRODUCT_PROGRESS_KEY) {
                this.addUninstallAccessibilityLog(this.uninstallAllProgress);
            }
        }
        else {
            this.addDownloadAccessibilityText(downloadProgressEvent);
            this.addInstallAccessibilityText(installProgressEvent);
        }
        this.emitChangedEvent();
    };
    /* istanbul ignore next */
    AppStore.prototype.onCancelRequestedEvent = function (event) {
        var itemIndex = this._installedOrInstallingList.findIndex(function (item) {
            return string_utilities_1.caseInsensitiveAreEqual(item.product.installationPath, event.installationPath);
        });
        var previous = this._installedOrInstallingList[itemIndex];
        this._installedOrInstallingList[itemIndex] = new installed_or_installing_product_1.InstalledOrInstallingProduct(previous.product, InstallingState_1.InstallingState.Pausing, previous.log);
        this.emitChangedEvent();
    };
    AppStore.prototype.closeIfQuiet = function (success) {
        if (success === void 0) { success = true; }
        if (this._argv.quiet || this._argv.passive) {
            var isAppClosurePending = true;
            var exitCode = success ? 0 : 1;
            this._pendingAppClosure = new pending_app_closure_1.PendingAppClosure(success, isAppClosurePending, exitCode);
        }
    };
    AppStore.prototype.onGetSummariesFinished = function (event) {
        var _this = this;
        if (Array.isArray(event.products)) {
            this.processProductSummaries(event.products);
        }
        if (Array.isArray(event.installations)) {
            this._installationsReceived = true;
            // Update the list
            event.installations.forEach(function (install) {
                _this.setInstallingState(install, null, install.errorDetails.logFilePath);
            });
            // Remove the ones that are no longer supposed to be in the list
            this._installedOrInstallingList = this._installedOrInstallingList.filter(function (record) {
                return event.installations.some(function (installation) {
                    return record.equals(installation, installation.installationPath);
                });
            });
            // Disable first install experience if there are any installations:
            if (event.installations.length > 0) {
                this._firstInstallExperienceSeen = true;
            }
        }
        this._productsParseFailReason = event.channelsParseFailReason;
        this._showReleaseNotesLink = !event.timedOut;
        this.emitChangedEvent();
    };
    AppStore.prototype.processProductSummaries = function (productSummaries) {
        // Create grouped list of ChannelMetadata from ProductSummaryBase:
        this._productsReceived = true;
        var channels = [];
        var tempMap = new Map();
        productSummaries.forEach(function (product) {
            var channelId = product.channelId;
            if (tempMap.has(channelId)) {
                var channel = tempMap.get(channelId);
                channel.products.push(product);
            }
            else {
                var channelInfo = product.channel;
                var channel = new channel_1.Channel(channelInfo, [product]);
                tempMap.set(channelId, channel);
                // also add to channels array
                channels.push(channel);
            }
        });
        // Sort channels so prerelease is last
        this._channels = channels.sort(function (lhs, rhs) {
            if (lhs.isPrerelease === rhs.isPrerelease) {
                return string_utilities_1.caseInsensitiveCompare(lhs.name, rhs.name);
            }
            if (lhs.isPrerelease) {
                return 1;
            }
            if (rhs.isPrerelease) {
                return -1;
            }
            return 0;
        });
        this.sortChannelProducts(this._channels);
    };
    AppStore.prototype.sortChannelProducts = function (channels) {
        // If a product has been targeted on the command line, ensure that it is the first
        // in the list of channel products.
        if (this.commandLineOperationState !== command_line_operation_state_1.CommandLineOperationState.Unspecified) {
            AppStore.makeProductFirstInChannels(channels, this.argv.channelId, this.argv.productId);
        }
    };
    AppStore.prototype.onInstalledProductReceived = function (event) {
        if (event.installedProduct) {
            var install = event.installedProduct;
            this.setInstallingState(install, null, install.errorDetails.logFilePath);
        }
    };
    Object.defineProperty(AppStore.prototype, "_installations", {
        get: function () {
            return this._installedOrInstallingList
                .filter(function (item) { return item.installingState === InstallingState_1.InstallingState.NotInstalling; })
                .map(function (item) { return item.product; });
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.onGetChannelInfoFinished = function (event) {
        var _this = this;
        if (event.channelInfoList) {
            this._channelInfoMap = new Map();
            event.channelInfoList.forEach(function (channelInfo) { return _this._channelInfoMap.set(channelInfo.id, channelInfo); });
            if (this._productsReceived) {
                this._channels.forEach(function (channel) {
                    var channelInfo = _this._channelInfoMap.get(channel.id);
                    if (channelInfo) {
                        channel.setInfo(channelInfo);
                    }
                });
            }
        }
        this._channelInfoReceived = true;
        this.emitChangedEvent();
    };
    AppStore.prototype.handleRebootRequired = function (event) {
        var _this = this;
        if (!event || !event.isRebootRequired) {
            return false;
        }
        var options = {
            title: ResourceStrings_1.ResourceStrings.rebootRequiredTitle,
            message: "",
            allowCancel: true,
            okButtonText: ResourceStrings_1.ResourceStrings.restart,
            errorName: errorNames.REBOOT_REQUIRED_ERROR_NAME,
        };
        switch (event.rebootTiming) {
            case reboot_timing_1.RebootTiming.AfterInstall:
                options.message = ResourceStrings_1.ResourceStrings.postInstallRebootMessage(event.productName);
                options.cancelButtonText = ResourceStrings_1.ResourceStrings.notNow;
                break;
            case reboot_timing_1.RebootTiming.DuringInstall:
                options.message = ResourceStrings_1.ResourceStrings.rebootRequiredMessage;
                options.cancelButtonText = ResourceStrings_1.ResourceStrings.notNow;
                break;
        }
        this._errorStore.show(options)
            .then(function (response) {
            if (response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                _this.restart();
            }
        });
        return true;
    };
    AppStore.prototype.onElevationRequired = function (event) {
        var options = {
            title: ResourceStrings_1.ResourceStrings.elevationRequiredTitle,
            message: ResourceStrings_1.ResourceStrings.elevationRequiredMessage,
            allowCancel: false,
            hideSupportLink: true,
            errorName: errorNames.ELEVATION_REQUIRED_ERROR_NAME,
        };
        this._errorStore.show(options);
        this.emitChangedEvent();
    };
    AppStore.prototype.onDeepCleanPreviewInstallationsCompleted = function (event) {
        this._installedOrInstallingList.splice(0);
        this._isDeepCleaningPreviewInstallations = false;
        this.emitChangedEvent();
    };
    AppStore.prototype.onDeepCleanPreviewInstallationsStarted = function (event) {
        this._isDeepCleaningPreviewInstallations = true;
        this.emitChangedEvent();
    };
    AppStore.prototype.onInstallerStatusChangedEvent = function (event) {
        this._installerStatus = event.status;
        this.emitChangedEvent();
    };
    AppStore.prototype.onRemoveChannelStartedEvent = function (event) {
        if (event.channelId) {
            this._channels = this._channels.filter((function (channel) { return channel.id !== event.channelId; }));
        }
        this.emitChangedEvent();
    };
    AppStore.prototype.onRemoveChannelFinishedEvent = function (event) {
        if (Array.isArray(event.products)) {
            this.processProductSummaries(event.products);
        }
        else if (event.channelsParseFailReason) {
            this._productsParseFailReason = event.channelsParseFailReason;
            this._showReleaseNotesLink = !event.timedOut;
        }
        this.emitChangedEvent();
    };
    AppStore.prototype.restart = function () {
        var exitCode;
        if (this.argv.noRestart) {
            exitCode = pending_app_closure_1.PendingAppClosure.exitCodeRebootRequired;
        }
        else {
            exitCode = pending_app_closure_1.PendingAppClosure.exitCodeRebootRequested;
        }
        this._pendingAppClosure = new pending_app_closure_1.PendingAppClosure(true, true, exitCode);
        this.emitChangedEvent();
    };
    AppStore.prototype.onInstallProgressChanged = function (event) {
        /* istanbul ignore next */
        if (event.type === Product_1.ProgressType.Unknown) {
            return;
        }
        var map;
        if (event.type === Product_1.ProgressType.Install) {
            map = this._installProgressByInstallationPath;
        }
        else if (event.type === Product_1.ProgressType.Download) {
            map = this._downloadProgressByInstallationPath;
        }
        if (map) {
            // undefined progress and detail means to forget about progress for this item
            if (!isNaN(event.progress) && event.detail) {
                var key = event.installationPath;
                // If we are uninstalling ourselves the progress isn't for a product,
                // so set the UNINSTALL_SELF_PRODUCT_PROGRESS_KEY value.
                if (this._hostInstallState === HostInstallState.Uninstalling) {
                    key = exports.UNINSTALL_SELF_PRODUCT_PROGRESS_KEY;
                }
                map.set(key, event);
            }
            else {
                /* istanbul ignore next */
                if (this._hostInstallState === HostInstallState.Uninstalling) {
                    map.delete(exports.UNINSTALL_SELF_PRODUCT_PROGRESS_KEY);
                }
                else {
                    /* istanbul ignore next */
                    map.delete(event.installationPath);
                }
            }
        }
        else if (event.type === Product_1.ProgressType.UninstallAll) {
            this._uninstallAllProgress = event;
        }
        this.emitChangedEvent();
    };
    AppStore.prototype.onOperationFailed = function (event) {
        if (event.error) {
            var options = {
                title: event.title || ResourceStrings_1.ResourceStrings.setupOperationFailed,
                message: [event.error],
                // tslint:disable-next-line: no-bitwise
                allowCancel: (event.dialogMode & error_dialog_mode_1.ErrorDialogMode.Cancel) !== 0,
                errorLink: event.errorLink,
                errorName: event.errorName,
            };
            // if there's OK text, use it
            if (event.okText) {
                options.okButtonText = event.okText;
            }
            this._errorStore.show(options)
                .then(function (response) {
                if (response.buttonType !== error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                    return;
                }
                // if there's an OK action, invoke it
                if (event.okAction) {
                    event.okAction();
                }
            });
            this.emitChangedEvent();
        }
    };
    AppStore.prototype.onUninstallSelfStatusChanged = function (event) {
        var newHostInstallState;
        if (event.status === UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent.INSTALLED_STATUS) {
            /* istanbul ignore next */
            newHostInstallState = HostInstallState.Installed;
        }
        else if (event.status === UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent.FAILED_STATUS) {
            newHostInstallState = HostInstallState.UninstallFailed;
        }
        else if (event.status === UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent.UNINSTALLING_STATUS) {
            newHostInstallState = HostInstallState.Uninstalling;
        }
        else if (event.status === UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent.BLOCKED_BY_RUNNING_INSTANCE_STATUS) {
            newHostInstallState = HostInstallState.UninstallBlockedByRunningInstance;
        }
        this._hostInstallState = newHostInstallState;
    };
    AppStore.prototype.onInstallerNotificationReceived = function (event) {
        this._pendingInstallerNotifications.set(event.installPath, event.message);
        console.log("InstallerNotificationReceivedEvent: " + event.message);
    };
    Object.defineProperty(AppStore.prototype, "_hostInstallState", {
        /* tslint:enable */
        get: function () {
            return this.__hostInstallState;
        },
        set: function (value) {
            if (this.__hostInstallState !== value) {
                this.__hostInstallState = value;
                this.emitChangedEvent();
            }
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.onHostUpdaterStatusChanged = function (event) {
        if (!this._hostUpdaterStatusEvent || !this._hostUpdaterStatusEvent.equals(event)) {
            this._hostUpdaterStatusEvent = event;
            // Only emit the change event if we should check for updates
            if (this.shouldCheckForHostUpdates()) {
                this.emitChangedEvent();
            }
        }
    };
    /* tslint:enable */
    AppStore.prototype.onWindowStateChangedEvent = function (event) {
        this.windowState = event.windowState;
    };
    Object.defineProperty(AppStore.prototype, "windowState", {
        /* tslint:enable */
        get: function () {
            return this._windowState;
        },
        set: function (value) {
            if (!this._windowState || !this._windowState.equals(value)) {
                this._windowState = value;
                this.emitChangedEvent();
            }
        },
        enumerable: true,
        configurable: true
    });
    AppStore.prototype.beginCommandLineOperation = function () {
        // TODO:  This validation breaks unit tests that raise events.  The problem is that the
        // singleton AppStore created by this module isn't necessarily in the state expected by
        // the unit test, but it will receive events raised by the unit tests.
        //
        // We should refactor AppStore into an Impl class (in a separate module) and write all
        // unit tests against the impl.  When that's done, this module will do nothing but
        // create the singleton.
        //
        // if (this._commandLineOperationState !== CommandLineOperationState.Pending) {
        //     const currentStateName = CommandLineOperationState[this._commandLineOperationState];
        //     throw new Error(`Cannot begin a command line operation if the current operation state is not Pending.` +
        //                     ` The current operation state is ${currentStateName}.`);
        // }
        this._commandLineOperationState = command_line_operation_state_1.CommandLineOperationState.InProgress;
    };
    AppStore.prototype.completeCommandLineOperation = function () {
        // TODO:  This validation breaks unit tests that raise events.  The problem is that the
        // singleton AppStore created by this module isn't necessarily in the state expected by
        // the unit test, but it will receive events raised by the unit tests.
        //
        // We should refactor AppStore into an Impl class (in a separate module) and write all
        // unit tests against the impl.  When that's done, this module will do nothing but
        // create the singleton.
        //
        // if (this._commandLineOperationState !== CommandLineOperationState.InProgress) {
        //     const currentStateName = CommandLineOperationState[this._commandLineOperationState];
        //     throw new Error(`Cannot end a command line operation if the current operation state is not InProgress.` +
        //                     ` The current operation state is ${currentStateName}.`);
        // }
        this._commandLineOperationState = command_line_operation_state_1.CommandLineOperationState.Complete;
    };
    AppStore.prototype.clearProgressEvents = function (installationPath) {
        this._installProgressByInstallationPath.delete(installationPath);
        this._downloadProgressByInstallationPath.delete(installationPath);
    };
    AppStore.prototype.emitChangedEvent = function () {
        this.emit(this.CHANGED_EVENT);
    };
    /**
     * Updates the record in the list matching the install. The properties will be updated with
     * corresponding values from the install.
     * @param {IInstalledProductSummary} install - Used to update the matching record.
     * @param {InstallingState} installingState - The desired installState. If null, then the existing value is kept.
     * @param {string} log - The desired log file path.
     */
    AppStore.prototype.setInstallingState = function (install, installingState, log) {
        var index = this._installedOrInstallingList.findIndex(function (item) { return item.equals(install, install.installationPath); });
        // The item should stay in the list, but the installingState should be updated.
        if (index > -1) {
            var previousItem = this._installedOrInstallingList[index];
            // Checking against null because enum values can fail the falsey check.
            if (installingState === null) {
                installingState = previousItem.installingState;
            }
            var state = new installed_or_installing_product_1.InstalledOrInstallingProduct(install, installingState, log);
            this._installedOrInstallingList[index] = state;
        }
        else {
            // Checking against null because enum values can fail the falsey check.
            if (installingState === null) {
                installingState = InstallingState_1.InstallingState.NotInstalling;
            }
            var state = new installed_or_installing_product_1.InstalledOrInstallingProduct(install, installingState, log);
            this._installedOrInstallingList.push(state);
        }
    };
    AppStore.prototype.addDownloadAccessibilityText = function (current) {
        if (!current) {
            return;
        }
        var progress = Math.floor(current.progress * 100);
        var progressText = ResourceStrings_1.ResourceStrings.downloadProgressWithRate(progress);
        if (this._featureStore.isEnabled(features_1.Feature.ShowBitrate)) {
            progressText = ResourceStrings_1.ResourceStrings.acquiredProgressLabel(progress);
        }
        this.addMessageToAccessibilityLog(progressText);
    };
    AppStore.prototype.addUninstallAccessibilityLog = function (current) {
        if (current) {
            this.addMessageToAccessibilityLog(ResourceStrings_1.ResourceStrings.uninstalledProgressLabel(Math.floor(current.progress * 100)));
        }
    };
    AppStore.prototype.addInstallAccessibilityText = function (current) {
        if (!current) {
            return;
        }
        var progress = Math.floor(current.progress * 100);
        var progressText = ResourceStrings_1.ResourceStrings.installProgressWithRate(progress);
        if (this._featureStore.isEnabled(features_1.Feature.ShowBitrate)) {
            progressText = ResourceStrings_1.ResourceStrings.appliedProgressLabel(progress);
        }
        this.addMessageToAccessibilityLog(progressText);
    };
    AppStore.prototype.addMessageToAccessibilityLog = function (message) {
        if (message) {
            this._accessibilityLog.push(message);
            this.emitChangedEvent();
        }
    };
    AppStore.prototype.removeInstallation = function (product, installationPath) {
        var index = this._installedOrInstallingList.findIndex(function (item) { return item.equals(product, installationPath); });
        if (index === -1) {
            return;
        }
        this._installedOrInstallingList.splice(index, 1);
    };
    /**
     * queryStringParser returns all strings. This method will convert strings to their proper types.
     * When a new non-string value is added to the query string add the case in this method to convert it.
     */
    AppStore.prototype.queryOptionsFromQueryStringParts = function (queryStringParts, utilities) {
        var queryOptions = queryStringParts;
        queryOptions.isAnotherInstanceRunning = utilities.ensureBoolean(queryOptions.isAnotherInstanceRunning);
        queryOptions.showDownlevelSkus = utilities.ensureBoolean(queryOptions.showDownlevelSkus);
        return queryOptions;
    };
    AppStore.prototype.createChannelFilter = function () {
        var installedAndInstallingItems = this.getInstalledItems();
        var excludedProducts = [];
        // The user specified a command line operation
        if (this.commandLineOperationState !== command_line_operation_state_1.CommandLineOperationState.Unspecified) {
            var commandLineProduct = this.productSummaryFromCommandLineArgs;
            if (commandLineProduct) {
                // Do not filter out a command line product.
                excludedProducts.push(commandLineProduct);
            }
        }
        if (this._showDownlevelSkus) {
            return this._channelProductFilterFactory.createShowDownlevelFilter(installedAndInstallingItems);
        }
        var applyCrossChannel = true;
        if (applyCrossChannel) {
            return this._channelProductFilterFactory.createCrossChannelFilter(installedAndInstallingItems, excludedProducts);
        }
        return this._channelProductFilterFactory.createPerChannelFilter(installedAndInstallingItems, excludedProducts);
    };
    /**
     * Determines whether we should allow updating the installer.
     *
     * Bug 386763: Silent modifications of an installed product can fail if we detect
     * that an engine update is required.  We don't need to update the engine to modify
     * a product that's already installed, so we can ignore updates.
     *
     */
    AppStore.prototype.shouldCheckForHostUpdates = function () {
        if (this.isQuietOrPassive) {
            switch (this._argv.command) {
                // don't update for quiet modify, repair, resume or uninstall
                case CommandLine_1.CommandNames.modify:
                case CommandLine_1.CommandNames.repair:
                case CommandLine_1.CommandNames.resume:
                case CommandLine_1.CommandNames.uninstall:
                    return false;
            }
        }
        // If we are not quiet but are running a resume, only check for updates after it is done.
        if (this.hasActiveCommandLineOperation && this._argv.command === CommandLine_1.CommandNames.resume) {
            return false;
        }
        return true;
    };
    return AppStore;
}(events_1.EventEmitter));
exports.AppStore = AppStore;
//# sourceMappingURL=app-store.js.map