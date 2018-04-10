/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetChannelInfoFinishedEvent = /** @class */ (function () {
    function GetChannelInfoFinishedEvent(channelInfoList) {
        this._channelInfoList = channelInfoList;
    }
    Object.defineProperty(GetChannelInfoFinishedEvent.prototype, "channelInfoList", {
        get: function () {
            return this._channelInfoList;
        },
        enumerable: true,
        configurable: true
    });
    return GetChannelInfoFinishedEvent;
}());
exports.GetChannelInfoFinishedEvent = GetChannelInfoFinishedEvent;
//# sourceMappingURL=get-channel-info-finished-event.js.map