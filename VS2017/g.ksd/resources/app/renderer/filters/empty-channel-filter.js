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
var EmptyChannelFilter = /** @class */ (function (_super) {
    __extends(EmptyChannelFilter, _super);
    function EmptyChannelFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmptyChannelFilter.prototype.filterImpl = function (channels) {
        return channels.filter(function (channel) { return channel.products.length > 0; });
    };
    return EmptyChannelFilter;
}(channel_product_filter_1.ChannelProductFilter));
exports.EmptyChannelFilter = EmptyChannelFilter;
//# sourceMappingURL=empty-channel-filter.js.map