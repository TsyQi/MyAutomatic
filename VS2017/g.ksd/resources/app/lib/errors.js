/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../typings/lib-missing-declares.d.ts" />
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
function isOperationCanceledError(error) {
    return error && error instanceof OperationCanceledError;
}
exports.isOperationCanceledError = isOperationCanceledError;
function isUnderlyingStreamHasClosedError(error) {
    return error && error instanceof Error && error.message.includes("underlying stream has closed");
}
exports.isUnderlyingStreamHasClosedError = isUnderlyingStreamHasClosedError;
/* tslint:disable */
exports.CustomErrorBase = function CustomErrorBase(message, localizedMessage, logPath, stack) {
    /* tslint:enable */
    if (message === void 0) { message = ""; }
    if (localizedMessage === void 0) { localizedMessage = ""; }
    if (logPath === void 0) { logPath = ""; }
    if (stack === void 0) { stack = ""; }
    // Do not allow null values as inputs
    message = message || "";
    localizedMessage = localizedMessage || "";
    logPath = logPath || "";
    stack = stack || "";
    var err = Error.call(this, message);
    this._message = message;
    this._localizedMessage = localizedMessage;
    this._log = logPath;
    this._stack = stack;
    this._name = this.constructor.name;
    if (!this._stack) {
        var stripStackCount = 3;
        var oldErrorStackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = oldErrorStackTraceLimit + stripStackCount - 1;
        var internalError = new Error(this._message);
        var internalStack = internalError.stack;
        try {
            // When capturing the stack in a custom error, the constructor chain
            // is included. Generally, stripping the lines 2-4 will produce
            // the expected exception. The first line is a header.
            var internalStackSplit = internalStack.split("\n");
            var header = internalStackSplit[0];
            var friendlyStack = internalStackSplit.slice(stripStackCount);
            this._stack = [header].concat(friendlyStack).join("\n");
        }
        catch (e) {
            this._stack = internalStack;
        }
        finally {
            Error.stackTraceLimit = oldErrorStackTraceLimit;
        }
    }
};
exports.CustomErrorBase.fromJson = function fromJson(errorJson) {
    var errorInfo = JSON.parse(errorJson);
    // Create the new object. Allows subclasses to override create to hold custom values.
    return exports[errorInfo._name].create(errorInfo);
};
// Create a protected method of CustomErrorBase
exports.CustomErrorBase.create = function create(errorInfo) {
    return new exports[errorInfo._name](errorInfo._message, errorInfo._localizedMessage, errorInfo._log, errorInfo._stack);
};
Object.defineProperty(exports.CustomErrorBase.prototype, "log", {
    get: function () {
        return this._log;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(exports.CustomErrorBase.prototype, "message", {
    get: function () {
        return this._message;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(exports.CustomErrorBase.prototype, "localizedMessage", {
    get: function () {
        return this._localizedMessage;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(exports.CustomErrorBase.prototype, "hasLocalizedMessage", {
    get: function () {
        return !!this._localizedMessage;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(exports.CustomErrorBase.prototype, "name", {
    get: function () {
        return this._name;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(exports.CustomErrorBase.prototype, "stack", {
    get: function () {
        return this._stack;
    },
    enumerable: true,
    configurable: true
});
exports.CustomErrorBase.prototype.toJson = function () {
    return JSON.stringify(this);
};
var InvalidParameterError = /** @class */ (function (_super) {
    __extends(InvalidParameterError, _super);
    function InvalidParameterError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidParameterError;
}(exports.CustomErrorBase));
exports.InvalidParameterError = InvalidParameterError;
var RpcError = /** @class */ (function (_super) {
    __extends(RpcError, _super);
    function RpcError(message, localizedMessage, log, stack, innerError) {
        var _this = _super.call(this, message, localizedMessage, log, stack) || this;
        _this.innerError = innerError;
        return _this;
    }
    return RpcError;
}(exports.CustomErrorBase));
exports.RpcError = RpcError;
var ItemNotFoundError = /** @class */ (function (_super) {
    __extends(ItemNotFoundError, _super);
    function ItemNotFoundError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ItemNotFoundError;
}(exports.CustomErrorBase));
exports.ItemNotFoundError = ItemNotFoundError;
var CommandLineParseError = /** @class */ (function (_super) {
    __extends(CommandLineParseError, _super);
    function CommandLineParseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CommandLineParseError;
}(exports.CustomErrorBase));
exports.CommandLineParseError = CommandLineParseError;
var NoMessageHandlerError = /** @class */ (function (_super) {
    __extends(NoMessageHandlerError, _super);
    function NoMessageHandlerError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoMessageHandlerError;
}(exports.CustomErrorBase));
exports.NoMessageHandlerError = NoMessageHandlerError;
/**
 * InstallerErrors begin.
 */
var InstallerError = /** @class */ (function (_super) {
    __extends(InstallerError, _super);
    function InstallerError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InstallerError;
}(exports.CustomErrorBase));
exports.InstallerError = InstallerError;
var OperationCanceledError = /** @class */ (function (_super) {
    __extends(OperationCanceledError, _super);
    function OperationCanceledError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OperationCanceledError;
}(exports.CustomErrorBase));
exports.OperationCanceledError = OperationCanceledError;
var VSIsRunningError = /** @class */ (function (_super) {
    __extends(VSIsRunningError, _super);
    function VSIsRunningError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VSIsRunningError;
}(exports.CustomErrorBase));
exports.VSIsRunningError = VSIsRunningError;
var InvalidSignatureError = /** @class */ (function (_super) {
    __extends(InvalidSignatureError, _super);
    function InvalidSignatureError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidSignatureError;
}(exports.CustomErrorBase));
exports.InvalidSignatureError = InvalidSignatureError;
var DirectoryNotEmptyError = /** @class */ (function (_super) {
    __extends(DirectoryNotEmptyError, _super);
    function DirectoryNotEmptyError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DirectoryNotEmptyError;
}(exports.CustomErrorBase));
exports.DirectoryNotEmptyError = DirectoryNotEmptyError;
var RebootRequiredError = /** @class */ (function (_super) {
    __extends(RebootRequiredError, _super);
    function RebootRequiredError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RebootRequiredError;
}(exports.CustomErrorBase));
exports.RebootRequiredError = RebootRequiredError;
var PostInstallRebootRequiredError = /** @class */ (function (_super) {
    __extends(PostInstallRebootRequiredError, _super);
    function PostInstallRebootRequiredError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PostInstallRebootRequiredError;
}(exports.CustomErrorBase));
exports.PostInstallRebootRequiredError = PostInstallRebootRequiredError;
var ItemNotInstalledError = /** @class */ (function (_super) {
    __extends(ItemNotInstalledError, _super);
    function ItemNotInstalledError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ItemNotInstalledError;
}(exports.CustomErrorBase));
exports.ItemNotInstalledError = ItemNotInstalledError;
var LaunchFailedError = /** @class */ (function (_super) {
    __extends(LaunchFailedError, _super);
    function LaunchFailedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LaunchFailedError;
}(exports.CustomErrorBase));
exports.LaunchFailedError = LaunchFailedError;
var ServiceUpdateRequireError = /** @class */ (function (_super) {
    __extends(ServiceUpdateRequireError, _super);
    function ServiceUpdateRequireError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServiceUpdateRequireError;
}(exports.CustomErrorBase));
exports.ServiceUpdateRequireError = ServiceUpdateRequireError;
var ChannelManifestDownloadError = /** @class */ (function (_super) {
    __extends(ChannelManifestDownloadError, _super);
    function ChannelManifestDownloadError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ChannelManifestDownloadError;
}(exports.CustomErrorBase));
exports.ChannelManifestDownloadError = ChannelManifestDownloadError;
var ManifestSignatureVerificationFailedError = /** @class */ (function (_super) {
    __extends(ManifestSignatureVerificationFailedError, _super);
    function ManifestSignatureVerificationFailedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ManifestSignatureVerificationFailedError;
}(exports.CustomErrorBase));
exports.ManifestSignatureVerificationFailedError = ManifestSignatureVerificationFailedError;
var InvalidSelectedPackagesError = /** @class */ (function (_super) {
    __extends(InvalidSelectedPackagesError, _super);
    function InvalidSelectedPackagesError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidSelectedPackagesError;
}(exports.CustomErrorBase));
exports.InvalidSelectedPackagesError = InvalidSelectedPackagesError;
var SignatureVerificationFailedError = /** @class */ (function (_super) {
    __extends(SignatureVerificationFailedError, _super);
    function SignatureVerificationFailedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SignatureVerificationFailedError;
}(exports.CustomErrorBase));
exports.SignatureVerificationFailedError = SignatureVerificationFailedError;
var ChannelsLockedError = /** @class */ (function (_super) {
    __extends(ChannelsLockedError, _super);
    function ChannelsLockedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ChannelsLockedError;
}(exports.CustomErrorBase));
exports.ChannelsLockedError = ChannelsLockedError;
var ServiceHubUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceHubUnavailableError, _super);
    function ServiceHubUnavailableError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServiceHubUnavailableError;
}(exports.CustomErrorBase));
exports.ServiceHubUnavailableError = ServiceHubUnavailableError;
//# sourceMappingURL=errors.js.map