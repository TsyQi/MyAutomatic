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
var cancel_requested_event_1 = require("../Events/cancel-requested-event");
var string_utilities_1 = require("../../lib/string-utilities");
var clear_pending_product_launches_event_1 = require("../Events/clear-pending-product-launches-event");
var Product_1 = require("../../lib/Installer/Product");
var installed_product_errors_1 = require("../../lib/Installer/installed-product-errors");
var InstallFinishedEvent_1 = require("../Events/InstallFinishedEvent");
var InstallStartedEvent_1 = require("../Events/InstallStartedEvent");
var product_launch_state_changed_event_1 = require("../Events/product-launch-state-changed-event");
var product_launch_state_1 = require("../interfaces/product-launch-state");
var store_1 = require("./store");
var ProductLaunchStateStore = /** @class */ (function (_super) {
    __extends(ProductLaunchStateStore, _super);
    function ProductLaunchStateStore(dispatcher, isQuietOrPassive, featureStore) {
        var _this = _super.call(this, dispatcher) || this;
        _this._productLaunchStates = new Map();
        _this._pendingProductLaunches = [];
        _this._isQuietOrPassive = false;
        _this.registerEvents([
            { event: cancel_requested_event_1.CancelRequestedEvent, callback: _this.onCancelRequested.bind(_this) },
            { event: InstallFinishedEvent_1.InstallFinishedEvent, callback: _this.onInstallFinished.bind(_this) },
            { event: InstallStartedEvent_1.InstallStartedEvent, callback: _this.onInstallStarted.bind(_this) },
            { event: product_launch_state_changed_event_1.ProductLaunchStateChangedEvent, callback: _this.onProductLaunchStateChanged.bind(_this) },
            { event: clear_pending_product_launches_event_1.ClearPendingProductLaunchesEvent, callback: _this.onClearPendingProductLaunches.bind(_this) },
        ]);
        _this._isQuietOrPassive = isQuietOrPassive;
        _this._featureStore = featureStore;
        return _this;
    }
    Object.defineProperty(ProductLaunchStateStore.prototype, "productsToLaunch", {
        /**
         * Gets a list of the products that have ProductLaunchState.Pending and are fully installed.
         */
        get: function () {
            return this._pendingProductLaunches.slice();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the launch state of a product. Returns ProductLaunchState.None if the launch state is not set.
     * @param product The product to get the launch state of
     */
    ProductLaunchStateStore.prototype.productLaunchState = function (product) {
        if (!product) {
            return product_launch_state_1.ProductLaunchState.None;
        }
        var productLaunchState = this._productLaunchStates.get(product.installationPath);
        if (productLaunchState !== null && productLaunchState !== undefined) {
            return productLaunchState;
        }
        return product_launch_state_1.ProductLaunchState.None;
    };
    ProductLaunchStateStore.prototype.dispose = function () {
        this._pendingProductLaunches = [];
        this._productLaunchStates.clear();
        _super.prototype.dispose.call(this);
    };
    /**
     * Returns true if the product is a valid product to autolaunch.
     * TODO: Move this setting into remote settings when implemented.
     *
     * @param product The product to see if it can autolaunch.
     */
    ProductLaunchStateStore.prototype.canProductAutolaunch = function (product) {
        // Only these products can automatically launch
        var autolaunchProductIds = [
            "Microsoft.VisualStudio.Product.Community",
            "Microsoft.VisualStudio.Product.Professional",
            "Microsoft.VisualStudio.Product.Enterprise",
            "Microsoft.VisualStudio.Product.SQL",
            "Microsoft.VisualStudio.Product.TeamExplorer",
            "Microsoft.VisualStudio.Product.WDExpress",
        ];
        return product && autolaunchProductIds.some(function (id) { return string_utilities_1.caseInsensitiveAreEqual(product.id, id); });
    };
    ProductLaunchStateStore.prototype.onCancelRequested = function (event) {
        this._productLaunchStates.set(event.installationPath, product_launch_state_1.ProductLaunchState.None);
        this.emitChangedEvent();
    };
    ProductLaunchStateStore.prototype.onInstallFinished = function (event) {
        this.setFinalAutolaunchState(event);
        this.emitChangedEvent();
    };
    ProductLaunchStateStore.prototype.onInstallStarted = function (event) {
        this.setInitialAutolaunchState(event);
        this.emitChangedEvent();
    };
    ProductLaunchStateStore.prototype.onProductLaunchStateChanged = function (event) {
        if (!event.product) {
            return;
        }
        this._productLaunchStates.set(event.product.installationPath, event.launchState);
        this.emitChangedEvent();
    };
    ProductLaunchStateStore.prototype.onClearPendingProductLaunches = function (event) {
        this._pendingProductLaunches = [];
        this.emitChangedEvent();
    };
    ProductLaunchStateStore.prototype.setInitialAutolaunchState = function (event) {
        if (!event) {
            return;
        }
        var product = event.product;
        var installationPath = event.installationPath;
        // The product cannot autolaunch, so do nothing
        if (!this.canProductAutolaunch(product)) {
            return;
        }
        // Set the launch state to launch after installation
        this._productLaunchStates.set(installationPath, product_launch_state_1.ProductLaunchState.LaunchAfterInstall);
    };
    ProductLaunchStateStore.prototype.setFinalAutolaunchState = function (event) {
        if (!event) {
            return;
        }
        var product = event.getProduct();
        var productLaunchState = this._productLaunchStates.get(event.installationPath);
        // If the install was successful, the final state was set to launch,
        // we are not quiet, and the product can be automatically launched add
        // it to the pending launches.
        if (this.canProductAutolaunch(product) &&
            productLaunchState === product_launch_state_1.ProductLaunchState.LaunchAfterInstall &&
            event.success &&
            !this._isQuietOrPassive) {
            var installation = this.createInstalledProduct(event);
            this._pendingProductLaunches.push(installation);
        }
        // Always set product launch state to none when install completes.
        this._productLaunchStates.set(event.installationPath, product_launch_state_1.ProductLaunchState.None);
    };
    ProductLaunchStateStore.prototype.createInstalledProduct = function (event) {
        var product = event.getProduct();
        return new Product_1.InstalledProductSummary(product.id, product.installerId, product.channel, product.name, product.description, product.longDescription, product.version, null, /* installationId */ event.installationPath, event.nickname, event.success ? Product_1.InstallState.Installed : Product_1.InstallState.Unknown, false /* isUpdateAvailable */, product.version, product.icon, product.hidden, event.isRebootRequired, new installed_product_errors_1.InstalledProductErrors([], [], !event.success, event.log), product.releaseNotes);
    };
    return ProductLaunchStateStore;
}(store_1.Store));
exports.ProductLaunchStateStore = ProductLaunchStateStore;
//# sourceMappingURL=product-launch-state-store.js.map