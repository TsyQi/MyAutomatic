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
var requires = require("../requires");
var InstallerError = /** @class */ (function (_super) {
    __extends(InstallerError, _super);
    function InstallerError(args) {
        var _this = this;
        requires.stringNotEmpty(args.name, "name");
        _this = _super.call(this, args.message) || this;
        Error.captureStackTrace(_this, _this.constructor);
        var builtinStack = _this.stack.split("\n");
        builtinStack[0] = args.name + ": " + (args.message ? args.message.split("\n")[0] : "");
        _this.stack = builtinStack.join("\n");
        _this.name = args.name;
        _this.message = args.message || "";
        _this.localizedMessage = args.localizedMessage || "";
        _this.log = args.log || "";
        _this.innerStack = args.innerStack || "";
        Object.setPrototypeOf(_this, InstallerError.prototype);
        return _this;
    }
    Object.defineProperty(InstallerError, "KEY_NOT_FOUND_NAME", {
        get: function () {
            return "KeyNotFoundException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "OPERATION_CANCELED_NAME", {
        get: function () {
            return "OperationCanceledException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "POST_INSTALL_REBOOT_REQUIRED_NAME", {
        get: function () {
            return "PostInstallRebootRequiredException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "REBOOT_REQUIRED_NAME", {
        get: function () {
            return "RebootRequiredException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "RECOVERABLE_FAILURE_NAME", {
        get: function () {
            return "RecoverableFailureException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "WIN_32_LAUNCH_ERROR_NAME", {
        get: function () {
            return "Win32Exception";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "UPDATE_REQUIRED_NAME", {
        get: function () {
            return "UpdateRequiredException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "CHANNEL_MANIFEST_DOWNLOAD_NAME", {
        get: function () {
            return "ChannelManifestDownloadException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "PRODUCT_MANIFEST_SIGN_ERROR_NAME", {
        get: function () {
            return "ManifestSignatureVerificationFailedException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "INVALID_SELECTED_PACKAGE", {
        get: function () {
            return "InvalidSelectedPackageException";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerError, "SIGNATURE_VERIFICATION_FAILED_ERROR_NAME", {
        get: function () {
            return "SignatureVerificationFailedException";
        },
        enumerable: true,
        configurable: true
    });
    return InstallerError;
}(Error));
exports.InstallerError = InstallerError;
var InstallerErrorNames;
(function (InstallerErrorNames) {
    "use strict";
    InstallerErrorNames.CHANNELS_LOCKED_EXCEPTION = "ChannelsLockedException";
})(InstallerErrorNames = exports.InstallerErrorNames || (exports.InstallerErrorNames = {}));
//# sourceMappingURL=InstallerError.js.map