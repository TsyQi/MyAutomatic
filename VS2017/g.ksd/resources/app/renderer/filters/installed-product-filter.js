/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/* istanbul ignore next */
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
var channel_product_filter_1 = require("./channel-product-filter");
var channel_1 = require("../stores/channel");
var Product_1 = require("../../lib/Installer/Product");
var InstalledProductFilter = /** @class */ (function (_super) {
    __extends(InstalledProductFilter, _super);
    function InstalledProductFilter(installedProducts, nextFilter) {
        var _this = _super.call(this, nextFilter) || this;
        _this._installedProducts = installedProducts;
        return _this;
    }
    InstalledProductFilter.prototype.filterImpl = function (channels) {
        var _this = this;
        return channels.map(function (channel) {
            var filteredMetadata = new channel_1.Channel(channel, channel.products.filter(function (product) { return !_this.shouldHideProduct(product); }));
            return filteredMetadata;
        });
    };
    // We hide the product if it is installed or is a preview product
    InstalledProductFilter.prototype.shouldHideProduct = function (product) {
        var productIsInstalled = this._installedProducts.some(function (i) {
            return Product_1.areEquivalent(i, product);
        });
        return productIsInstalled;
    };
    return InstalledProductFilter;
}(channel_product_filter_1.ChannelProductFilter));
exports.InstalledProductFilter = InstalledProductFilter;
//# sourceMappingURL=installed-product-filter.js.map