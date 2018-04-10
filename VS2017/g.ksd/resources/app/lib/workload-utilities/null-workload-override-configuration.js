"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var NullWorkloadOverrideConfig = /** @class */ (function () {
    function NullWorkloadOverrideConfig() {
    }
    Object.defineProperty(NullWorkloadOverrideConfig.prototype, "recommendedWorkloads", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullWorkloadOverrideConfig.prototype, "sortedWorkloadIds", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullWorkloadOverrideConfig.prototype, "workloadResources", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    return NullWorkloadOverrideConfig;
}());
exports.NullWorkloadOverrideConfig = NullWorkloadOverrideConfig;
//# sourceMappingURL=null-workload-override-configuration.js.map