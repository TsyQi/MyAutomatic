/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventBase = /** @class */ (function () {
    function EventBase(error) {
        this._error = error;
        if (error) {
            var errorAsAny = error;
            // if error is an object that has a localizedMessage property (e.g. InstallerError,
            // CustomErrorBase), use that for the errorMessage
            if (errorAsAny.localizedMessage) {
                this._errorMessage = errorAsAny.localizedMessage;
            }
            else {
                // JsonRpc may have concatenated the native error message and callstack together into error.message.
                // Try to detect that and split them apart.  We'll assume that text followed by a newline, followed
                // by whitespace, followed by "at " is a combined message/callstack.
                var index = error.message.search(/\n\s+at /m);
                if (index > 0) {
                    this._errorMessage = error.message.substr(0, index);
                    this._stack = error.message.substr(index);
                }
                else {
                    this._errorMessage = error.message;
                }
            }
        }
    }
    Object.defineProperty(EventBase.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventBase.prototype, "errorMessage", {
        /**
         * The message for the error, if there is an error.  Some error sources will append the callstack to
         * the error's message.  This property represents our best attempt at detecting and removing the callstack
         * so if you're going to display the message to the user, you're better off using errorMessage rather
         * than error.message.
         */
        get: function () {
            return this._errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventBase.prototype, "stack", {
        get: function () {
            return this._stack;
        },
        enumerable: true,
        configurable: true
    });
    return EventBase;
}());
exports.EventBase = EventBase;
//# sourceMappingURL=event-base.js.map