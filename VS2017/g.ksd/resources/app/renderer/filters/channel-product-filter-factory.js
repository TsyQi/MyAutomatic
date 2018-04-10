/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_family_filter_1 = require("../filters/product-family-filter");
var installed_product_filter_1 = require("../filters/installed-product-filter");
var empty_channel_filter_1 = require("../filters/empty-channel-filter");
var preview_product_filter_1 = require("../filters/preview-product-filter");
var product_family_data_provider_1 = require("../stores/product-family-data-provider");
var ChannelProductFilterFactory = /** @class */ (function () {
    function ChannelProductFilterFactory() {
    }
    ChannelProductFilterFactory.prototype.createShowDownlevelFilter = function (installations) {
        var previewProductFilter = this.createPreviewProductAndEmptyChannelFilter();
        return new installed_product_filter_1.InstalledProductFilter(installations, previewProductFilter);
    };
    ChannelProductFilterFactory.prototype.createCrossChannelFilter = function (installations, excludedProducts, dataProvider) {
        if (dataProvider === void 0) { dataProvider = product_family_data_provider_1.defaultProductFamilyDataProvider; }
        var applyCrossChannel = true;
        return new product_family_filter_1.ProductFamilyFilter(dataProvider, installations, applyCrossChannel, excludedProducts, this.createShowDownlevelFilter(installations));
    };
    ChannelProductFilterFactory.prototype.createPerChannelFilter = function (installations, excludedProducts, dataProvider) {
        if (dataProvider === void 0) { dataProvider = product_family_data_provider_1.defaultProductFamilyDataProvider; }
        var applyCrossChannel = false;
        return new product_family_filter_1.ProductFamilyFilter(dataProvider, installations, applyCrossChannel, excludedProducts, this.createShowDownlevelFilter(installations));
    };
    /**
     * Creates a filter that filters preview products then empty channels.
     */
    ChannelProductFilterFactory.prototype.createPreviewProductAndEmptyChannelFilter = function () {
        return new preview_product_filter_1.PreviewProductFilter(new empty_channel_filter_1.EmptyChannelFilter());
    };
    return ChannelProductFilterFactory;
}());
exports.ChannelProductFilterFactory = ChannelProductFilterFactory;
//# sourceMappingURL=channel-product-filter-factory.js.map