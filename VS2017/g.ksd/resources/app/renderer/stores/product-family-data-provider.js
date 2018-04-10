"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultProductFamilyData = /** @class */ (function () {
    function DefaultProductFamilyData() {
        /**
         * The default ordering of the products.
         * Applies to all channels.
         * Per channel ordering overrides this.
         */
        this._defaultProductOrder = [
            [
                "Microsoft.VisualStudio.Product.Community",
                "Microsoft.VisualStudio.Product.Professional",
                "Microsoft.VisualStudio.Product.Enterprise",
            ]
        ];
        /**
         * Maps a channel string to product ordering.
         * Add custom channel orderings to this map.
         */
        this._channelOrderMap = new Map();
    }
    /**
     * Gets the product families associated with the input channel.
     * If no channel is provided or there is no product families defined
     * for the input channel, the default family set is returned.
     *
     * @param  {string} channelId The channel to get the families for.
     * @returns string[][] The set of product families.
     */
    DefaultProductFamilyData.prototype.getProductFamilies = function (channelId) {
        // Get the product ordering for the input channel from the channelOrderMap.
        // If the channel override is not present, return the default order.
        return this._channelOrderMap.get(channelId) || this._defaultProductOrder;
    };
    return DefaultProductFamilyData;
}());
exports.defaultProductFamilyDataProvider = new DefaultProductFamilyData();
//# sourceMappingURL=product-family-data-provider.js.map