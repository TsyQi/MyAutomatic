"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var workload_resources_1 = require("./workload-resources");
var WorkloadResourcesProvider = /** @class */ (function () {
    function WorkloadResourcesProvider(workloadResources) {
        if (workloadResources === void 0) { workloadResources = {}; }
        this._overrides = workloadResources || {};
    }
    Object.defineProperty(WorkloadResourcesProvider.prototype, "resources", {
        get: function () {
            return this._overrides;
        },
        enumerable: true,
        configurable: true
    });
    WorkloadResourcesProvider.prototype.getResources = function (workload) {
        var override = this._overrides[workload.id];
        if (!override) {
            return workload_resources_1.WorkloadResources.create(workload);
        }
        return new workload_resources_1.WorkloadResources(workload.id, override.name || workload.name, override.description || workload.description, override.longDescription || workload.longDescription, override.icon || workload.icon);
    };
    return WorkloadResourcesProvider;
}());
exports.WorkloadResourcesProvider = WorkloadResourcesProvider;
//# sourceMappingURL=workload-resources-provider.js.map