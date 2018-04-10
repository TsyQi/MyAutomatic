/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Describes whether a product should be launched or not.
 */
var ProductLaunchState;
(function (ProductLaunchState) {
    /**
     * The normal state of an installed product. Will not launch after an operation.
     */
    ProductLaunchState[ProductLaunchState["None"] = 0] = "None";
    /**
     * The state for a product that should be launched when installation completes.
     */
    ProductLaunchState[ProductLaunchState["LaunchAfterInstall"] = 1] = "LaunchAfterInstall";
})(ProductLaunchState = exports.ProductLaunchState || (exports.ProductLaunchState = {}));
//# sourceMappingURL=product-launch-state.js.map