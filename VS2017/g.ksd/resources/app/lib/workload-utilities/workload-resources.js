"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var WorkloadResources = /** @class */ (function () {
    function WorkloadResources(id, name, description, longDescription, icon) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._longDescription = longDescription;
        this._icon = icon;
    }
    WorkloadResources.create = function (workload) {
        if (!workload) {
            return null;
        }
        return new WorkloadResources(workload.id, workload.name, workload.description, workload.longDescription, workload.icon);
    };
    Object.defineProperty(WorkloadResources.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadResources.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadResources.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadResources.prototype, "longDescription", {
        get: function () {
            return this._longDescription;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadResources.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        enumerable: true,
        configurable: true
    });
    return WorkloadResources;
}());
exports.WorkloadResources = WorkloadResources;
//# sourceMappingURL=workload-resources.js.map