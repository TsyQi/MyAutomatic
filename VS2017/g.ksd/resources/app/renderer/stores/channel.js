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
var channel_info_1 = require("../../lib/Installer/channel-info");
var requires = require("../../lib/requires");
var Channel = /** @class */ (function (_super) {
    __extends(Channel, _super);
    function Channel(info, products) {
        var _this = this;
        requires.notNullOrUndefined(info, "info");
        requires.notNullOrUndefined(products, "products");
        _this = _super.call(this, info.id, info.name, info.description, info.suffix, info.isPrerelease) || this;
        _this._products = products;
        return _this;
    }
    Object.defineProperty(Channel.prototype, "products", {
        get: function () {
            return this._products;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Channel.prototype, "visibleProducts", {
        get: function () {
            return this._products.filter(function (product) { return !product.hidden; });
        },
        enumerable: true,
        configurable: true
    });
    Channel.prototype.setInfo = function (info) {
        this._name = info.name;
        this._description = info.description;
        this._suffix = info.suffix;
    };
    return Channel;
}(channel_info_1.ChannelInfo));
exports.Channel = Channel;
//# sourceMappingURL=channel.js.map