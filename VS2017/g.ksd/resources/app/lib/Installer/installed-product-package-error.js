/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var ResourceStrings_1 = require("../ResourceStrings");
/*
* these are the different actions on which package failure is resulted.
*/
var PackageFailureAction;
(function (PackageFailureAction) {
    PackageFailureAction[PackageFailureAction["None"] = 0] = "None";
    PackageFailureAction[PackageFailureAction["Install"] = 1] = "Install";
    PackageFailureAction[PackageFailureAction["Repair"] = 2] = "Repair";
    PackageFailureAction[PackageFailureAction["Uninstall"] = 3] = "Uninstall";
    PackageFailureAction[PackageFailureAction["DownloadPackage"] = 4] = "DownloadPackage";
    PackageFailureAction[PackageFailureAction["CachePackage"] = 5] = "CachePackage";
    PackageFailureAction[PackageFailureAction["Default"] = 6] = "Default";
})(PackageFailureAction = exports.PackageFailureAction || (exports.PackageFailureAction = {}));
var InstalledProductPackageError = /** @class */ (function () {
    function InstalledProductPackageError(id, action, returnCode) {
        this._actionType = PackageFailureAction.Default;
        requires.notNullOrUndefined(id, "id");
        requires.notNullOrUndefined(action, "action");
        requires.notNullOrUndefined(returnCode, "returnCode");
        this._action = action;
        this._id = id;
        this._returnCode = returnCode;
        this._actionType = this.convertToPackageFailureAction();
    }
    Object.defineProperty(InstalledProductPackageError.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductPackageError.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductPackageError.prototype, "returnCode", {
        get: function () {
            return this._returnCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductPackageError.prototype, "signature", {
        get: function () {
            if (this.returnCode !== "") {
                return "PackageId:" + this.id + ";PackageAction:" + this.action + ";ReturnCode:" + this.returnCode + ";";
            }
            return "PackageId:" + this.id + ";PackageAction:" + this.action + ";";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductPackageError.prototype, "actionWithIdText", {
        get: function () {
            var value;
            switch (this._actionType) {
                case PackageFailureAction.Install:
                    value = ResourceStrings_1.ResourceStrings.failedPackageActionInstall;
                    break;
                case PackageFailureAction.Repair:
                    value = ResourceStrings_1.ResourceStrings.failedPackageActionRepair;
                    break;
                case PackageFailureAction.Uninstall:
                    value = ResourceStrings_1.ResourceStrings.failedPackageActionUninstall;
                    break;
                case PackageFailureAction.DownloadPackage:
                    value = ResourceStrings_1.ResourceStrings.failedPackageActionDownload;
                    break;
                case PackageFailureAction.CachePackage:
                    value = ResourceStrings_1.ResourceStrings.failedPackageActionCache;
                    break;
                default:
                    value = ResourceStrings_1.ResourceStrings.failedPackageActionDefault;
                    break;
            }
            return ResourceStrings_1.ResourceStrings.failedPackageActionWithId(value, this._id);
        },
        enumerable: true,
        configurable: true
    });
    InstalledProductPackageError.prototype.convertToPackageFailureAction = function () {
        var actionType = PackageFailureAction[this._action];
        if (actionType === undefined) {
            return PackageFailureAction.Default;
        }
        return actionType;
    };
    return InstalledProductPackageError;
}());
exports.InstalledProductPackageError = InstalledProductPackageError;
//# sourceMappingURL=installed-product-package-error.js.map