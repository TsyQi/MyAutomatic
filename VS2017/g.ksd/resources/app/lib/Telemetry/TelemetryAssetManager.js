/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product_1 = require("../../lib/Installer/Product");
var string_utilities_1 = require("../string-utilities");
// const ASSET_PRODUCT = "product";
// const TELEMETRY_PROPERTY_PREFIX = "Install.";
// const TELEMETRY_PROPERTY_ITEM_TELEMETRY_ID = TELEMETRY_PROPERTY_PREFIX + "ItemTelemetryId";
// const TELEMETRY_PROPERTY_INSTALL_STATE = TELEMETRY_PROPERTY_PREFIX + "InstallState";
var ProductTelemetryAssetInformation = /** @class */ (function () {
    function ProductTelemetryAssetInformation(properties) {
        this._properties = properties;
        this._assetVersion = 0;
    }
    ProductTelemetryAssetInformation.makeUniqueKeyForProduct = function (channelId, id, version, installationId) {
        var baseString = channelId + "/" + id + "/" + version;
        return installationId ? baseString + ("/" + installationId) : baseString;
    };
    ProductTelemetryAssetInformation.isUpdateRequired = function (left, right) {
        if (left.telemetryId !== right.telemetryId ||
            left.installState !== right.installState) {
            return true;
        }
        if (left.properties.isSummary && right.properties.isSummary) {
            if (left.properties.isSummary === "true" && right.properties.isSummary === "false") {
                return true;
            }
            else if (left.properties.isSummary === "false" && right.properties.isSummary === "true") {
                return false;
            }
        }
        // If any values in the left are not in the right or they changed, update.
        return Object.keys(left.properties).some(function (key) {
            return right.properties[key] !== left.properties[key];
        });
    };
    ProductTelemetryAssetInformation.prototype.absorbe = function (targetToAbsorb) {
        this._assetVersion += 1;
        this._properties = targetToAbsorb.properties;
    };
    ProductTelemetryAssetInformation.prototype.equals = function (otherProduct) {
        return this.properties &&
            otherProduct.properties &&
            string_utilities_1.caseInsensitiveAreEqual(this.properties.channelId, otherProduct.properties.channelId) &&
            string_utilities_1.caseInsensitiveAreEqual(this.properties.id, otherProduct.properties.id) &&
            string_utilities_1.caseInsensitiveAreEqual(this.properties.installationId, otherProduct.properties.installationId);
    };
    Object.defineProperty(ProductTelemetryAssetInformation.prototype, "properties", {
        get: function () {
            return this._properties || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductTelemetryAssetInformation.prototype, "assetVersion", {
        get: function () {
            return this._assetVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductTelemetryAssetInformation.prototype, "telemetryId", {
        get: function () {
            var channelId = this._properties.channelId;
            var productId = this._properties.id;
            var version = this._properties.version;
            var installationId = this._properties.installationId;
            return ProductTelemetryAssetInformation.makeUniqueKeyForProduct(channelId, productId, version, installationId);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductTelemetryAssetInformation.prototype, "installState", {
        get: function () {
            return this._properties.installState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductTelemetryAssetInformation.prototype, "assetEvent", {
        get: function () {
            return this._assetEvent;
        },
        set: function (event) {
            this._assetEvent = event;
        },
        enumerable: true,
        configurable: true
    });
    return ProductTelemetryAssetInformation;
}());
exports.ProductTelemetryAssetInformation = ProductTelemetryAssetInformation;
var AssetTypes;
(function (AssetTypes) {
    AssetTypes[AssetTypes["All"] = 0] = "All";
    AssetTypes[AssetTypes["Installed"] = 1] = "Installed";
    AssetTypes[AssetTypes["Available"] = 2] = "Available";
})(AssetTypes = exports.AssetTypes || (exports.AssetTypes = {}));
var TelemetryAssetManager = /** @class */ (function () {
    // private static populateProductSummaryProperties(
    //     product: ProductTelemetryAssetInformation): IProductTelemetryProperties {
    //     // Create a shallow copy of the product's properties
    //     const properties: IProductTelemetryProperties = {};
    //     Object.keys(product.properties).forEach(key => properties[key] = product.properties[key]);
    //     properties[TELEMETRY_PROPERTY_ITEM_TELEMETRY_ID] = product.telemetryId;
    //     if (product.installState) {
    //         properties[TELEMETRY_PROPERTY_INSTALL_STATE] = product.installState;
    //     }
    //     return properties;
    // }
    function TelemetryAssetManager(telemetry) {
        this._products = [];
        this._telemetry = telemetry;
    }
    /**
     * Updates the list of installed products by removing them all and adding the new ones.
     */
    TelemetryAssetManager.prototype.updateInstalledProductSummaries = function (products) {
        var _this = this;
        var productAssets = products.map(function (product) {
            var properties = product.getPropertiesAsLoggableBag();
            return new ProductTelemetryAssetInformation(properties);
        });
        // Remove products no longer in the installed list
        this._products = this._products.filter(function (product) {
            return product.installState === Product_1.TELEMETRY_PRODUCT_STATE_AVAILABLE ||
                productAssets.some(function (asset) { return product.equals(asset); });
        });
        // add or update the products
        products.forEach(function (product) { return _this.addProduct(product); });
    };
    /**
     * Updates the list of available products.
     */
    TelemetryAssetManager.prototype.updateAvailableProductSummaries = function (products) {
        var _this = this;
        var productAssets = products.map(function (product) {
            var properties = product.getPropertiesAsLoggableBag();
            return new ProductTelemetryAssetInformation(properties);
        });
        // Remove products no longer in the available list
        this._products = this._products.filter(function (product) {
            return product.installState !== Product_1.TELEMETRY_PRODUCT_STATE_AVAILABLE ||
                productAssets.some(function (asset) { return product.equals(asset); });
        });
        // add or update the products
        products.forEach(function (product) { return _this.addProduct(product); });
    };
    TelemetryAssetManager.prototype.addProduct = function (product) {
        if (!product) {
            return;
        }
        var properties = product.getPropertiesAsLoggableBag();
        var productSummary = new ProductTelemetryAssetInformation(properties);
        var indexOfProduct = this._products.findIndex(function (innerProduct) { return productSummary.equals(innerProduct); });
        if (indexOfProduct < 0) {
            this._products.push(productSummary);
            this.logProductAsset(productSummary);
        }
        else {
            if (ProductTelemetryAssetInformation.isUpdateRequired(this._products[indexOfProduct], productSummary)) {
                this._products[indexOfProduct].absorbe(productSummary);
                this.logProductAsset(this._products[indexOfProduct]);
            }
        }
    };
    TelemetryAssetManager.prototype.getProductListAsString = function (type) {
        var assetsToAttach = this.getAssetsByType(type);
        var assetList = assetsToAttach.map(function (productEvent) { return productEvent.telemetryId; });
        return assetList.join(",");
    };
    /**
     * Bug Id - 425132: commented these lines to reduce the noise for vs/willow/product event.
     * @param product
     */
    TelemetryAssetManager.prototype.logProductAsset = function (product) {
        // const properties = TelemetryAssetManager.populateProductSummaryProperties(product);
        // product.assetEvent = this._telemetry.postAsset(
        //     ASSET_PRODUCT,
        //     product.telemetryId,
        //     product.assetVersion,
        //     properties);
    };
    TelemetryAssetManager.prototype.getAssetsByType = function (type) {
        if (type === AssetTypes.Available) {
            return this._products.filter(function (product) {
                return product.installState === Product_1.TELEMETRY_PRODUCT_STATE_AVAILABLE;
            });
        }
        else if (type === AssetTypes.Installed) {
            return this._products.filter(function (product) {
                return product.installState !== Product_1.TELEMETRY_PRODUCT_STATE_AVAILABLE;
            });
        }
        else {
            return this._products;
        }
    };
    return TelemetryAssetManager;
}());
exports.TelemetryAssetManager = TelemetryAssetManager;
//# sourceMappingURL=TelemetryAssetManager.js.map