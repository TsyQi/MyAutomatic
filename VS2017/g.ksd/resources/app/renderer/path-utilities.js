/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product_1 = require("../lib/Installer/Product");
function getDefaultInstallPath(appStore, product) {
    // if the product is installed, use its install path
    if (Product_1.isTypeOfInstalledProduct(product)) {
        return product.installationPath;
    }
    // if we're processing a command line install, use the --installPath from the command line
    if (appStore.hasActiveCommandLineOperation && appStore.argv.installPath) {
        return appStore.argv.installPath;
    }
    // if we have a product with a recommended install location, use that
    if (Product_1.isTypeOfProduct(product)) {
        return product.defaultInstallDirectory;
    }
    return "";
}
exports.getDefaultInstallPath = getDefaultInstallPath;
//# sourceMappingURL=path-utilities.js.map