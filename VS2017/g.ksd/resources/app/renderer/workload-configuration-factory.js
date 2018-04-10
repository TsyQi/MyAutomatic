"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var workload_sorter_1 = require("../lib/workload-utilities/workload-sorter");
var features_1 = require("../lib/feature-flags/features");
var factory_1 = require("./stores/factory");
var TelemetryProxy_1 = require("./Telemetry/TelemetryProxy");
var lazy_1 = require("../lib/lazy");
var ResourceStrings_1 = require("../lib/ResourceStrings");
var workload_resources_provider_1 = require("../lib/workload-utilities/workload-resources-provider");
exports.WORKLOAD_SORT_CONFIGURATION_PROPERTY = "workloadSortingConfiguration";
exports.RECOMMENDED_WORKLOAD_CONFIGURATION = "recommended workload configuration";
exports.SORTED_WORKLOAD_CONFIGURATION = "sorted workload configuration";
exports.DEFAULT_SORTING_CONFIGURATION = "no changes";
exports.CLOUD_FIRST_WORKLOAD_DESC_CONFIGURATION = "azure cloud first description";
exports.CLOUD_NATIVE_WORKLOAD_DESC_CONFIGURATION = "azure cloud native description";
exports.sortedWorkloadConfiguration = {
    sortedWorkloadIds: [
        "Microsoft.VisualStudio.Workload.ManagedDesktop",
        "Microsoft.VisualStudio.Workload.NativeDesktop",
        "Microsoft.VisualStudio.Workload.Universal",
    ]
};
exports.recommendedWorkloadConfiguration = {
    recommendedWorkloads: [
        "Microsoft.VisualStudio.Workload.ManagedDesktop",
        "Microsoft.VisualStudio.Workload.NetWeb",
        "Microsoft.VisualStudio.Workload.NativeDesktop",
    ],
};
/* tslint:disable:max-line-length */
exports.cloudFirstAzureDescription = {
    workloadResources: {
        "Microsoft.VisualStudio.Workload.Azure": {
            description: "Build cloud-first apps using ASP.NET, Azure Functions, Azure App Service, Docker containers, Azure SDK and tools.",
            longDescription: "Build cloud-first apps using ASP.NET, Azure Functions, Azure App Service, Docker containers, Azure SDK and tools.",
        },
    },
};
/* tslint:enable:max-line-length */
/* tslint:disable:max-line-length */
exports.cloudNativeAzureDescription = {
    workloadResources: {
        "Microsoft.VisualStudio.Workload.Azure": {
            description: "Build cloud-native apps using ASP.NET, Azure Functions, Azure App Service, Docker containers, Azure SDK and tools.",
            longDescription: "Build cloud-native apps using ASP.NET, Azure Functions, Azure App Service, Docker containers, Azure SDK and tools.",
        },
    },
};
var WorkloadConfigurationFactory = /** @class */ (function () {
    function WorkloadConfigurationFactory(store, telemetry) {
        var _this = this;
        this._featureStore = store;
        this._telemetry = telemetry;
        this._configurationProviders = new lazy_1.Lazy(function () { return _this.createProviders(); });
    }
    WorkloadConfigurationFactory.getInstance = function () {
        return this._instance.value;
    };
    WorkloadConfigurationFactory.prototype.getSorter = function () {
        return this._configurationProviders.value.sorter;
    };
    WorkloadConfigurationFactory.prototype.getResourcesProvider = function () {
        return this._configurationProviders.value.resourcesProvider;
    };
    WorkloadConfigurationFactory.prototype.createProviders = function () {
        var isEnglish = ResourceStrings_1.ResourceStrings.uiLocale().startsWith("en");
        if (isEnglish && this._featureStore.isEnabled(features_1.Feature.RecWklds)) {
            this._telemetry.setCommonProperty(exports.WORKLOAD_SORT_CONFIGURATION_PROPERTY, exports.RECOMMENDED_WORKLOAD_CONFIGURATION);
            var sorter = new workload_sorter_1.WorkloadSorter(exports.recommendedWorkloadConfiguration);
            var resourcesProvider = new workload_resources_provider_1.WorkloadResourcesProvider(exports.recommendedWorkloadConfiguration.workloadResources);
            return {
                sorter: sorter,
                resourcesProvider: resourcesProvider,
            };
        }
        if (this._featureStore.isEnabled(features_1.Feature.SortWklds)) {
            this._telemetry.setCommonProperty(exports.WORKLOAD_SORT_CONFIGURATION_PROPERTY, exports.SORTED_WORKLOAD_CONFIGURATION);
            var sorter = new workload_sorter_1.WorkloadSorter(exports.sortedWorkloadConfiguration);
            var resourcesProvider = new workload_resources_provider_1.WorkloadResourcesProvider(exports.sortedWorkloadConfiguration.workloadResources);
            return {
                sorter: sorter,
                resourcesProvider: resourcesProvider,
            };
        }
        if (isEnglish && this._featureStore.isEnabled(features_1.Feature.CloudFirstDesc)) {
            this._telemetry.setCommonProperty(exports.WORKLOAD_SORT_CONFIGURATION_PROPERTY, exports.CLOUD_FIRST_WORKLOAD_DESC_CONFIGURATION);
            var sorter = new workload_sorter_1.WorkloadSorter(exports.cloudFirstAzureDescription);
            var resourcesProvider = new workload_resources_provider_1.WorkloadResourcesProvider(exports.cloudFirstAzureDescription.workloadResources);
            return {
                sorter: sorter,
                resourcesProvider: resourcesProvider,
            };
        }
        if (isEnglish && this._featureStore.isEnabled(features_1.Feature.CloudNativeDesc)) {
            this._telemetry.setCommonProperty(exports.WORKLOAD_SORT_CONFIGURATION_PROPERTY, exports.CLOUD_NATIVE_WORKLOAD_DESC_CONFIGURATION);
            var sorter = new workload_sorter_1.WorkloadSorter(exports.cloudNativeAzureDescription);
            var resourcesProvider = new workload_resources_provider_1.WorkloadResourcesProvider(exports.cloudNativeAzureDescription.workloadResources);
            return {
                sorter: sorter,
                resourcesProvider: resourcesProvider,
            };
        }
        // The features are not on, so create default sorter and resources provider.
        this._telemetry.setCommonProperty(exports.WORKLOAD_SORT_CONFIGURATION_PROPERTY, exports.DEFAULT_SORTING_CONFIGURATION);
        var defaultSorter = new workload_sorter_1.WorkloadSorter();
        var defaultResourcesProvider = new workload_resources_provider_1.WorkloadResourcesProvider();
        return {
            sorter: defaultSorter,
            resourcesProvider: defaultResourcesProvider,
        };
    };
    WorkloadConfigurationFactory._instance = new lazy_1.Lazy(function () {
        return new WorkloadConfigurationFactory(factory_1.featureStore, TelemetryProxy_1.telemetryProxy);
    });
    return WorkloadConfigurationFactory;
}());
exports.WorkloadConfigurationFactory = WorkloadConfigurationFactory;
//# sourceMappingURL=workload-configuration-factory.js.map