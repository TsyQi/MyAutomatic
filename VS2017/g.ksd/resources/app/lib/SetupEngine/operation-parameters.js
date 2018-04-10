/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var UpdateParameters = /** @class */ (function () {
    function UpdateParameters(installationPath, layoutPath, productKey, additionalOptions, updateFromVS) {
        requires.stringNotEmpty(installationPath, "installationPath");
        this._installationPath = installationPath;
        this._layoutPath = layoutPath;
        this._productKey = productKey || null;
        this._additionalOptions = additionalOptions;
        this._updateFromVS = updateFromVS;
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
    Object.defineProperty(UpdateParameters.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
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
    Object.defineProperty(UpdateParameters.prototype, "updateFromVS", {
        get: function () {
            return this._updateFromVS;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateParameters;
}());
exports.UpdateParameters = UpdateParameters;
var ModifyParameters = /** @class */ (function () {
    function ModifyParameters(installationPath, languages, selectedPackageReferences, updateOnModify, additionalOptions) {
        requires.stringNotEmpty(installationPath, "installationPath");
        requires.notNullOrUndefined(languages, "language");
        requires.notNullOrUndefined(selectedPackageReferences, "selectedPackageReferences");
        requires.notNullOrUndefined(updateOnModify, "updateOnModify");
        this._installationPath = installationPath;
        this._languages = languages;
        this._selectedPackageReferences = selectedPackageReferences;
        this._updateOnModify = updateOnModify;
        this._additionalOptions = additionalOptions;
    }
    Object.defineProperty(ModifyParameters.prototype, "languages", {
        get: function () {
            return this._languages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParameters.prototype, "selectedPackageReferences", {
        get: function () {
            return this._selectedPackageReferences;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParameters.prototype, "updateOnModify", {
        get: function () {
            return this._updateOnModify;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParameters.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
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
    function InstallParameters(channelId, productId, nickname, installationPath, layoutPath, languages, selectedPackageReferences, productKey, additionalOptions) {
        requires.stringNotEmpty(installationPath, "installationPath");
        requires.notNullOrUndefined(languages, "language");
        requires.notNullOrUndefined(selectedPackageReferences, "selectedPackageReferences");
        requires.notNullOrUndefined(channelId, "channelId");
        requires.notNullOrUndefined(productId, "productId");
        this._languages = languages;
        this._selectedPackageReferences = selectedPackageReferences;
        this._channelId = channelId;
        this._productId = productId;
        this._nickname = nickname;
        this._installationPath = installationPath;
        this._productKey = productKey || null;
        this._layoutPath = layoutPath;
        this._additionalOptions = additionalOptions;
    }
    Object.defineProperty(InstallParameters.prototype, "languages", {
        get: function () {
            return this._languages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "selectedPackageReferences", {
        get: function () {
            return this._selectedPackageReferences;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "channelId", {
        get: function () {
            return this._channelId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParameters.prototype, "productId", {
        get: function () {
            return this._productId;
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
    Object.defineProperty(InstallParameters.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
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