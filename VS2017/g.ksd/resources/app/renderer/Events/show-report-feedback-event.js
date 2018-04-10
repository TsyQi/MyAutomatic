/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var ErrorNames = require("../../lib/error-names");
var ShowReportFeedbackEvent = /** @class */ (function () {
    function ShowReportFeedbackEvent(message, neutralMessage, launchFeedbackClientAction) {
        this._message = message;
        this._neutralMessage = neutralMessage;
        this._launchFeedbackClientAction = launchFeedbackClientAction;
    }
    ShowReportFeedbackEvent.CreateReportStreamClosedEvent = function (launchFeedbackClientAction) {
        return ShowReportFeedbackEvent.CreateShowReportFeedbackEvent(ResourceStrings_1.ResourceStrings.underlyingStreamClosedPrompt, ErrorNames.UNDERLYING_STREAM_CLOSED, launchFeedbackClientAction);
    };
    ShowReportFeedbackEvent.CreateUnknownErrorEvent = function (launchFeedbackClientAction) {
        return ShowReportFeedbackEvent.CreateShowReportFeedbackEvent(ResourceStrings_1.ResourceStrings.GenericErrorPrompt, ErrorNames.UNHANDLED_ERROR_CAUGHT, launchFeedbackClientAction);
    };
    ShowReportFeedbackEvent.CreateShowReportFeedbackEvent = function (message, neutralMessage, launchFeedbackClientAction) {
        return new ShowReportFeedbackEvent(message, neutralMessage, launchFeedbackClientAction);
    };
    Object.defineProperty(ShowReportFeedbackEvent.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowReportFeedbackEvent.prototype, "neutralMessage", {
        get: function () {
            return this._neutralMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowReportFeedbackEvent.prototype, "launchFeedbackClientAction", {
        get: function () {
            return this._launchFeedbackClientAction;
        },
        enumerable: true,
        configurable: true
    });
    return ShowReportFeedbackEvent;
}());
exports.ShowReportFeedbackEvent = ShowReportFeedbackEvent;
//# sourceMappingURL=show-report-feedback-event.js.map