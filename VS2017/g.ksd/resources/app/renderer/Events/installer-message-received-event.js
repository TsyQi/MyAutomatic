/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product_1 = require("../../lib/Installer/Product");
var enum_1 = require("../../lib/enum");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
/**
 * Support these combinations:
 * + Retry / Ignore / Cancel
 * + OK
 * + Retry / Ignore / Abort
 * +
 */
var InstallerMessageReceivedEvent = /** @class */ (function () {
    function InstallerMessageReceivedEvent(dialogTitle, okButtonResponse, cancelButtonResponse, customButtons, installPath, message, promiseCompletionSource) {
        this._cancelButtonResponse = Product_1.MessageResultTypes.None;
        this._dialogTitle = "";
        this._okButtonResponse = Product_1.MessageResultTypes.None;
        this._customButtons = [];
        this._dialogTitle = dialogTitle;
        this._okButtonResponse = okButtonResponse;
        this._cancelButtonResponse = cancelButtonResponse;
        // Map any remaining buttons to the custom list
        this._customButtons = this.createCustomButtons(customButtons);
        this._installPath = installPath;
        this._message = message;
        this._promiseCompletionSource = promiseCompletionSource;
    }
    InstallerMessageReceivedEvent.Create = function (installPath, message, promiseCompletionSource) {
        // Map the cancel button (and esc key) to: Abort/Cancel/Ignore
        var cancelButtonResponse = message.GetCancelButtonInfo();
        // Map the ok button to the default response type
        var okButtonResponse = message.GetOKButtonInfo();
        var dialogTitle = message.GetDialogTitle();
        return new InstallerMessageReceivedEvent(dialogTitle, okButtonResponse, cancelButtonResponse, 
        /* tslint:disable:no-bitwise */
        message.acceptsResultTypes & (~cancelButtonResponse) & (~okButtonResponse), 
        /* tslint:enable */
        installPath, message, promiseCompletionSource);
    };
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "allowCancel", {
        get: function () {
            return this._cancelButtonResponse !== Product_1.MessageResultTypes.None;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "cancelButtonResponse", {
        get: function () {
            return this._cancelButtonResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "cancelButtonText", {
        get: function () {
            return this.getResourceForButton(this._cancelButtonResponse);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "customButtons", {
        get: function () {
            return this._customButtons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "dialogTitle", {
        get: function () {
            return this._dialogTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "installPath", {
        get: function () {
            return this._installPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "okButtonResponse", {
        get: function () {
            return this._okButtonResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "okButtonText", {
        get: function () {
            // Return empty string to hide the ok button
            if (this._okButtonResponse === Product_1.MessageResultTypes.None
                || this._okButtonResponse === this._cancelButtonResponse) {
                return "";
            }
            return this.getResourceForButton(this._okButtonResponse);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerMessageReceivedEvent.prototype, "promiseCompletionSource", {
        get: function () {
            return this._promiseCompletionSource;
        },
        enumerable: true,
        configurable: true
    });
    InstallerMessageReceivedEvent.prototype.getResourceForButton = function (resultType) {
        switch (resultType) {
            case Product_1.MessageResultTypes.Abort:
                return ResourceStrings_1.ResourceStrings.abort;
            case Product_1.MessageResultTypes.Cancel:
                return ResourceStrings_1.ResourceStrings.cancel;
            case Product_1.MessageResultTypes.Ignore:
                return ResourceStrings_1.ResourceStrings.ignore;
            /* istanbul ignore next */
            case Product_1.MessageResultTypes.None:
                return ResourceStrings_1.ResourceStrings.ok;
            case Product_1.MessageResultTypes.OK:
                return ResourceStrings_1.ResourceStrings.ok;
            case Product_1.MessageResultTypes.Retry:
                return ResourceStrings_1.ResourceStrings.retry;
            /* istanbul ignore next */
            case Product_1.MessageResultTypes.Text:
                throw new Error("Invalid response type: " + Product_1.MessageResultTypes[resultType]);
            /* istanbul ignore next */
            default:
                throw new Error("Invalid response type: " + Product_1.MessageResultTypes[resultType]);
        }
    };
    /**
     * Returns an array of additional buttons that should be
     * displayed.
     * @param resultTypes A bitmask of the accepted results
     */
    InstallerMessageReceivedEvent.prototype.createCustomButtons = function (resultTypes) {
        var _this = this;
        var customButtons = [];
        /* tslint:disable:no-bitwise */
        enum_1.EnumExtensions.getValues(Product_1.MessageResultTypes)
            .filter(function (value) {
            return typeof value === "number"
                && value !== Product_1.MessageResultTypes.None
                && (resultTypes & value) === value;
        })
            .forEach(function (value) {
            customButtons.push({
                id: Product_1.MessageResultTypes[value],
                response: value,
                text: _this.getResourceForButton(value),
            });
        });
        /* tslint:enable */
        return customButtons;
    };
    return InstallerMessageReceivedEvent;
}());
exports.InstallerMessageReceivedEvent = InstallerMessageReceivedEvent;
//# sourceMappingURL=installer-message-received-event.js.map