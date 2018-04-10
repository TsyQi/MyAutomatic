"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var null_workload_override_configuration_1 = require("./null-workload-override-configuration");
var workload_category_1 = require("./workload-category");
var ResourceStrings_1 = require("../ResourceStrings");
var map_utilities_1 = require("../map-utilities");
var WorkloadSorter = /** @class */ (function () {
    function WorkloadSorter(configuration) {
        if (configuration === void 0) { configuration = new null_workload_override_configuration_1.NullWorkloadOverrideConfig(); }
        this._configuration = configuration;
    }
    Object.defineProperty(WorkloadSorter.prototype, "configuration", {
        get: function () {
            return this._configuration;
        },
        enumerable: true,
        configurable: true
    });
    WorkloadSorter.prototype.sort = function (workloads) {
        workloads = workloads || [];
        var recommendedWorkloadIds = this._configuration.recommendedWorkloads || [];
        var configurationWorkloadIds = this._configuration.sortedWorkloadIds || [];
        var configurationResources = this._configuration.workloadResources || {};
        var remainingWorkloads = new Map();
        workloads.forEach(function (w) { return remainingWorkloads.set(w.id, w); });
        /**
         * Map of workload ID to category.
         */
        var categoryOverrides = new Map();
        Object.keys(configurationResources).forEach(function (workloadId) {
            var resource = configurationResources[workloadId];
            if (resource.category) {
                categoryOverrides.set(workloadId, resource.category);
            }
        });
        var categoriesMap = new Map();
        // Add the recommended workloads. Do not remove the workloads from the remaining workloads map.
        this.addRecommendedWorkloads(recommendedWorkloadIds, remainingWorkloads, categoriesMap);
        // Now add the workloads in the order they appear in the configuration.
        // This will add categories in the order that the workloads appear.
        this.addWorkloads(configurationWorkloadIds, remainingWorkloads, categoriesMap, categoryOverrides);
        // Add the remaining workloads since they had no overrides.
        this.addWorkloads(Array.from(remainingWorkloads.values()).map(function (r) { return r.id; }), remainingWorkloads, categoriesMap, categoryOverrides);
        // Convert the categories into WorkloadCategory objects, and filter out categories that have no workloads
        return Array.from(categoriesMap.entries())
            .filter(function (entry) { return entry[1] && entry[1].length > 0; })
            .map(function (value) { return new workload_category_1.WorkloadCategory(value[0], value[1]); });
    };
    /**
     * Adds the workloads into the categories map.
     * If the workload is not in the remaining resources it is not added.
     *
     * @param workloadIds The workloads to add
     * @param remainingWorkloadResources The remaining workload resources to get the values from.
     * @param categoriesMap The current map of categories to add the workload to.
     * @param removeWorkloads Specifies if the workload should be removed from the
     * remainingWorkloadResources when added. The default value is true.
     */
    WorkloadSorter.prototype.addWorkloads = function (workloadIds, remainingWorkloads, categoriesMap, categoryOverrides, removeWorkloads) {
        if (categoryOverrides === void 0) { categoryOverrides = new Map(); }
        if (removeWorkloads === void 0) { removeWorkloads = true; }
        workloadIds.forEach(function (id) {
            var workload = remainingWorkloads.get(id);
            // The workload is in the remaining resources, so add it to its category
            if (workload) {
                var category = categoryOverrides.get(id) || workload.category || ResourceStrings_1.ResourceStrings.uncategorized;
                var categoryWorkloads = map_utilities_1.getOrCreateArrayInMap(categoriesMap, category);
                categoryWorkloads.push(workload);
                // Remove the workload from the resources map
                if (removeWorkloads) {
                    remainingWorkloads.delete(id);
                }
            }
        });
    };
    WorkloadSorter.prototype.addRecommendedWorkloads = function (workloadIds, remainingWorkloads, categoriesMap) {
        var recommendedCategoryOverrides = new Map();
        workloadIds.forEach(function (id) { return recommendedCategoryOverrides.set(id, ResourceStrings_1.ResourceStrings.recommendedWorkloadCategory); });
        var removeWorkloads = false; // Do not remove recommended workloads from remaining.
        this.addWorkloads(workloadIds, remainingWorkloads, categoriesMap, recommendedCategoryOverrides, removeWorkloads);
    };
    return WorkloadSorter;
}());
exports.WorkloadSorter = WorkloadSorter;
//# sourceMappingURL=workload-sorter.js.map