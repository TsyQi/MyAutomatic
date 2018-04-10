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
Object.defineProperty(exports, "__esModule", { value: true });
var channel_product_filter_1 = require("./channel-product-filter");
var channel_1 = require("../stores/channel");
var Product_1 = require("../../lib/Installer/Product");
var string_utilities_1 = require("../../lib/string-utilities");
var requires = require("../../lib/requires");
var ProductFamilyFilter = /** @class */ (function (_super) {
    __extends(ProductFamilyFilter, _super);
    function ProductFamilyFilter(productFamilyDataProvider, installedProducts, applyCrossChannel, excludedProducts, nextFilter) {
        if (excludedProducts === void 0) { excludedProducts = []; }
        var _this = _super.call(this, nextFilter) || this;
        requires.notNullOrUndefined(productFamilyDataProvider, "productFamilyDataProvider");
        _this._productFamilyDataProvider = productFamilyDataProvider;
        _this._installedProducts = installedProducts;
        _this._applyCrossChannel = applyCrossChannel;
        _this._excludedProducts = excludedProducts || [];
        return _this;
    }
    Object.defineProperty(ProductFamilyFilter.prototype, "applyCrossChannel", {
        get: function () {
            return this._applyCrossChannel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductFamilyFilter.prototype, "productFamilyDataProvider", {
        get: function () {
            return this._productFamilyDataProvider;
        },
        enumerable: true,
        configurable: true
    });
    ProductFamilyFilter.prototype.filterImpl = function (channels) {
        var _this = this;
        return channels.map(function (channel) {
            var productFamilies = _this._applyCrossChannel ?
                _this._productFamilyDataProvider.getProductFamilies() :
                _this._productFamilyDataProvider.getProductFamilies(channel.id);
            var products = channel.products.slice();
            productFamilies.forEach(function (family) {
                products = _this.filterProducts(products, family);
            });
            return new channel_1.Channel(channel, products);
        });
    };
    /**
     * Filters the products out of the family and then sorts them by highest ordered products first.
     */
    ProductFamilyFilter.prototype.filterProducts = function (products, productFamily) {
        var _this = this;
        var filterIndex = this.highestInstalledProductIndex(products[0].channelId, productFamily);
        return products.filter(function (product) {
            // If the product is in the excluded list, keep it.
            if (_this._excludedProducts.some(function (excludedProduct) { return Product_1.areEquivalent(excludedProduct, product); })) {
                return true;
            }
            var productIndex = productFamily.findIndex(function (id) { return string_utilities_1.caseInsensitiveAreEqual(product.id, id); });
            // If the product is higher in the productFamily than the lowest installed product
            // or if the product is not in the family, do not filter it out.
            return productIndex >= filterIndex || productIndex === -1;
        }).sort(function (a, b) {
            var productIndex1 = productFamily.findIndex(function (id) { return string_utilities_1.caseInsensitiveAreEqual(a.id, id); });
            var productIndex2 = productFamily.findIndex(function (id) { return string_utilities_1.caseInsensitiveAreEqual(b.id, id); });
            // Higher index means it should appear before the other product.
            // So, move B before A.
            if (productIndex1 < productIndex2) {
                return 1;
            }
            // Move A before B
            if (productIndex2 < productIndex1) {
                return -1;
            }
            return 0;
        });
    };
    ProductFamilyFilter.prototype.highestInstalledProductIndex = function (channelId, productFamily) {
        var installedProducts = this._installedProducts.slice();
        // If we are not applying cross-channel, filter to only products from this channel.
        if (!this._applyCrossChannel) {
            installedProducts = installedProducts
                .filter(function (product) { return string_utilities_1.caseInsensitiveAreEqual(channelId, product.channel.id); });
        }
        var _loop_1 = function (index) {
            var productFamilyId = productFamily[index];
            if (installedProducts.some(function (p) { return string_utilities_1.caseInsensitiveAreEqual(p.id, productFamilyId); })) {
                return { value: index };
            }
        };
        // Find the index of the highest installed product in the product family.
        for (var index = productFamily.length - 1; index >= 0; index--) {
            var state_1 = _loop_1(index);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        // If no installed products are in the productFamily, filter none.
        return 0;
    };
    return ProductFamilyFilter;
}(channel_product_filter_1.ChannelProductFilter));
exports.ProductFamilyFilter = ProductFamilyFilter;
//# sourceMappingURL=product-family-filter.js.map