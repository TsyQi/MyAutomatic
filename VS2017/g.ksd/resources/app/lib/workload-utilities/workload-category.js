"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var WorkloadCategory = /** @class */ (function () {
    function WorkloadCategory(name, workloads) {
        this._name = name;
        this._workloads = workloads;
    }
    Object.defineProperty(WorkloadCategory.prototype, "name", {
        get: function () {
            return this._name.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCategory.prototype, "workloads", {
        get: function () {
            return this._workloads.slice();
        },
        enumerable: true,
        configurable: true
    });
    return WorkloadCategory;
}());
exports.WorkloadCategory = WorkloadCategory;
//# sourceMappingURL=workload-category.js.map