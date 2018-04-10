/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var custom_event_factory_1 = require("./custom-event-factory");
var ButtonClickEvent = /** @class */ (function () {
    /* istanbul ignore next */
    function ButtonClickEvent(detail, eventFactory, bubbles, cancelable) {
        if (eventFactory === void 0) { eventFactory = custom_event_factory_1.CustomEventFactory.default; }
        if (bubbles === void 0) { bubbles = true; }
        if (cancelable === void 0) { cancelable = true; }
        var eventInit = {
            bubbles: bubbles,
            cancelable: cancelable,
            detail: detail,
        };
        this._event = eventFactory.createEvent(ButtonClickEvent.NAME, eventInit);
    }
    Object.defineProperty(ButtonClickEvent.prototype, "event", {
        get: function () {
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    ButtonClickEvent.prototype.dispatch = function (target) {
        target.dispatchEvent(this._event);
    };
    ButtonClickEvent.NAME = "button-click";
    return ButtonClickEvent;
}());
exports.ButtonClickEvent = ButtonClickEvent;
//# sourceMappingURL=button-click-event.js.map