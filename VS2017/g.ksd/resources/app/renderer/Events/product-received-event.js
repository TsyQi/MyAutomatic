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
var event_base_1 = require("./event-base");
var ProductReceivedEvent = /** @class */ (function (_super) {
    __extends(ProductReceivedEvent, _super);
    function ProductReceivedEvent(product, error) {
        var _this = _super.call(this, error) || this;
        _this._product = product;
        return _this;
    }
    Object.defineProperty(ProductReceivedEvent.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return ProductReceivedEvent;
}(event_base_1.EventBase));
exports.ProductReceivedEvent = ProductReceivedEvent;
//# sourceMappingURL=product-received-event.js.map