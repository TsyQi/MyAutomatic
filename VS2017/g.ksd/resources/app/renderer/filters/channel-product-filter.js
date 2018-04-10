"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter used to filter channel products out of channels based on a set of rules.
 */
var ChannelProductFilter = /** @class */ (function () {
    function ChannelProductFilter(nextFilter) {
        this._nextFilter = nextFilter;
    }
    /**
     * Filters products out of the input channels.
     * Calls the next filter after it gets done filtering.
     *
     * @param  {IChannel[]} channels The channels to filter
     * @returns IChannel The filtered channels
     */
    ChannelProductFilter.prototype.filter = function (channels) {
        var filteredChannels = this.filterImpl(channels);
        if (this._nextFilter) {
            filteredChannels = this._nextFilter.filter(filteredChannels);
        }
        return filteredChannels;
    };
    Object.defineProperty(ChannelProductFilter.prototype, "nextFilter", {
        get: function () {
            return this._nextFilter;
        },
        enumerable: true,
        configurable: true
    });
    return ChannelProductFilter;
}());
exports.ChannelProductFilter = ChannelProductFilter;
//# sourceMappingURL=channel-product-filter.js.map