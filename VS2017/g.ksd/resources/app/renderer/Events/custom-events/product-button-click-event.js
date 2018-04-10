/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
var button_click_event_1 = require("./button-click-event");
var custom_event_factory_1 = require("./custom-event-factory");
var ProductButtonClickEvent = /** @class */ (function (_super) {
    __extends(ProductButtonClickEvent, _super);
    /* istanbul ignore next */
    function ProductButtonClickEvent(id, product, eventFactory) {
        if (eventFactory === void 0) { eventFactory = custom_event_factory_1.CustomEventFactory.default; }
        var _this = this;
        var detail = {
            id: id,
            product: product,
        };
        _this = _super.call(this, detail, eventFactory) || this;
        return _this;
    }
    return ProductButtonClickEvent;
}(button_click_event_1.ButtonClickEvent));
exports.ProductButtonClickEvent = ProductButtonClickEvent;
//# sourceMappingURL=product-button-click-event.js.map