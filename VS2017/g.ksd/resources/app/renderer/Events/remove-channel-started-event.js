/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoveChannelStartedEvent = /** @class */ (function () {
    function RemoveChannelStartedEvent(channelId) {
        this._channelId = channelId;
    }
    Object.defineProperty(RemoveChannelStartedEvent.prototype, "channelId", {
        get: function () {
            return this._channelId;
        },
        enumerable: true,
        configurable: true
    });
    return RemoveChannelStartedEvent;
}());
exports.RemoveChannelStartedEvent = RemoveChannelStartedEvent;
//# sourceMappingURL=remove-channel-started-event.js.map