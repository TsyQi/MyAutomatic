/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_names_1 = require("../../lib/error-names");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var ShowInstallRetryEvent = /** @class */ (function () {
    function ShowInstallRetryEvent(message, neutralMessage, retryAction) {
        this._retryAction = retryAction;
        this._neutralMessage = neutralMessage;
        this._message = message;
    }
    ShowInstallRetryEvent.CreateChannelsLockedRetryEvent = function (retryAction) {
        return new ShowInstallRetryEvent(ResourceStrings_1.ResourceStrings.installBlockedByChannelOperation, error_names_1.CHANNELS_LOCKED_ERROR, retryAction);
    };
    Object.defineProperty(ShowInstallRetryEvent.prototype, "retryAction", {
        get: function () {
            return this._retryAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowInstallRetryEvent.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowInstallRetryEvent.prototype, "neutralMessage", {
        get: function () {
            return this._neutralMessage;
        },
        enumerable: true,
        configurable: true
    });
    return ShowInstallRetryEvent;
}());
exports.ShowInstallRetryEvent = ShowInstallRetryEvent;
//# sourceMappingURL=show-install-retry-event.js.map