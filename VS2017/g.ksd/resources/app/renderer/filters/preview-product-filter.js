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
var PreviewProductFilter = /** @class */ (function (_super) {
    __extends(PreviewProductFilter, _super);
    function PreviewProductFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Filter the preview products out of the channel
    PreviewProductFilter.prototype.filterImpl = function (channels) {
        return channels.map(function (channel) {
            var filteredMetadata = new channel_1.Channel(channel, channel.products.filter(function (product) { return !Product_1.isPreviewProduct(product); }));
            return filteredMetadata;
        });
    };
    return PreviewProductFilter;
}(channel_product_filter_1.ChannelProductFilter));
exports.PreviewProductFilter = PreviewProductFilter;
//# sourceMappingURL=preview-product-filter.js.map