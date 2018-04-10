/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var LaunchParameters = /** @class */ (function () {
    function LaunchParameters(product) {
        requires.notNullOrUndefined(product, "product");
        this._product = product;
    }
    Object.defineProperty(LaunchParameters.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return LaunchParameters;
}());
exports.LaunchParameters = LaunchParameters;
var UninstallParameters = /** @class */ (function () {
    function UninstallParameters(product) {
        requires.notNullOrUndefined(product, "product");
        this._product = product;
    }
    Object.defineProperty(UninstallParameters.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return UninstallParameters;
}());
exports.UninstallParameters = UninstallParameters;
var RepairParameters = /** @class */ (function () {
    function RepairParameters(product) {
        requires.notNullOrUndefined(product, "product");
        this._product = product;
    }
    Object.defineProperty(RepairParameters.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return RepairParameters;
}());
exports.RepairParameters = RepairParameters;
var ResumeParameters = /** @class */ (function () {
    function ResumeParameters(product) {
        requires.notNullOrUndefined(product, "product");
        this._product = product;
    }
    Object.defineProperty(ResumeParameters.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return ResumeParameters;
}());
exports.ResumeParameters = ResumeParameters;
var CancelParameters = /** @class */ (function () {
    function CancelParameters(product) {
        requires.notNullOrUndefined(product, "product");
        this._product = product;
    }
    Object.defineProperty(CancelParameters.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return CancelParameters;
}());
exports.CancelParameters = CancelParameters;
var UpdateParameters = /** @class */ (function () {
    function UpdateParameters(product, layoutPath, productKey, additionalOptions, updateFromVS) {
        requires.notNullOrUndefined(product, "product");
        this._product = product;
        this._layoutPath = layoutPath;
        this._productKey = productKey || null;
        this._additionalOptions = additionalOptions;
        this._updateFromVS = updateFromVS || false;
    }
    Object.defineProperty(UpdateParameters.prototype, "layoutPath", {
        get: function () {
            return this._layoutPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateParameters.prototype, "productKey", {
        get: function () {
            return this._productKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateParameters.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateParameters.prototype, "updateFromVS", {
        get: function () {
            return this._updateFromVS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateParameters.prototype, "vsixs", {
        get: function () {
            return this._additionalOptions
                ? this._additionalOptions.vsixs
                : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateParameters.prototype, "additionalOptions", {
        get: function () {
            return this._additionalOptions;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateParameters;
}());
exports.UpdateParameters = UpdateParameters;
var ModifyParameters = /** @class */ (function () {
    function ModifyParameters(product, updateOnModify, additionalOptions) {
        requires.notNullOrUndefined(product, "product");
        requires.notNullOrUndefined(updateOnModify, "updateOnModify");
        this._product = product;
        this._updateOnModify = updateOnModify;
        this._additionalOptions = additionalOptions;
    }
    Object.defineProperty(ModifyParameters.prototype, "updateOnModify", {
        get: function () {
            return this._updateOnModify;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParameters.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParameters.prototype, "additionalOptions", {
        get: function () {
            return this._additionalOptions;
        },
        enumerable: true,
        configurable: true
    });
    return ModifyParameters;
}());
exports.ModifyParameters = ModifyParameters;
var InstallParameters = /** @class */ (function () {
    function InstallParameters(product, nickname, installationPath, layoutPath, productKey, additionalOptions) {
        requires.notNullOrUndefined(product, "product");
        requires.stringNotEmpty(installationPath, "installationPath");
        this._product = product;
        this._installationPath = installationPath;
        this._nickname = nickname;
        this._layoutPath = layoutPath;
        this._productKey = productKey || null;
        this._additionalOptions = additionalOptions;
    }
    Object.defineProperty(InstallParameters.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "nickname", {
        get: function () {
            return this._nickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "layoutPath", {
        get: function () {
            return this._layoutPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "productKey", {
        get: function () {
            return this._productKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "vsixs", {
        get: function () {
            return this._additionalOptions
                ? this._additionalOptions.vsixs
                : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "additionalOptions", {
        get: function () {
            return this._additionalOptions;
        },
        enumerable: true,
        configurable: true
    });
    return InstallParameters;
}());
exports.InstallParameters = InstallParameters;
var AdditionalOptions = /** @class */ (function () {
    function AdditionalOptions(vsixs, flights) {
        this._vsixs = vsixs || [];
        this._flights = flights || [];
    }
    Object.defineProperty(AdditionalOptions.prototype, "vsixs", {
        get: function () {
            return this._vsixs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdditionalOptions.prototype, "flights", {
        get: function () {
            return this._flights;
        },
        enumerable: true,
        configurable: true
    });
    return AdditionalOptions;
}());
exports.AdditionalOptions = AdditionalOptions;
//# sourceMappingURL=operation-parameters.js.map