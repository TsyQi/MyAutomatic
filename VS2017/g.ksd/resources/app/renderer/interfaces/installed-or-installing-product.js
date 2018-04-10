/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product_1 = require("../../lib/Installer/Product");
var string_utilities_1 = require("../../lib/string-utilities");
var InstalledOrInstallingProduct = /** @class */ (function () {
    function InstalledOrInstallingProduct(product, installingState, log) {
        this._installingState = installingState;
        this._log = log;
        this._product = product;
    }
    Object.defineProperty(InstalledOrInstallingProduct.prototype, "installingState", {
        get: function () {
            return this._installingState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledOrInstallingProduct.prototype, "log", {
        get: function () {
            return this._log;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledOrInstallingProduct.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    InstalledOrInstallingProduct.prototype.equals = function (product, installationPath) {
        return Product_1.areEquivalent(product, this._product) &&
            string_utilities_1.caseInsensitiveAreEqual(installationPath, this._product.installationPath);
    };
    return InstalledOrInstallingProduct;
}());
exports.InstalledOrInstallingProduct = InstalledOrInstallingProduct;
//# sourceMappingURL=installed-or-installing-product.js.map