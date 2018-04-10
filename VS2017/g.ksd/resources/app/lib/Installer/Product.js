/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var ResourceStrings_1 = require("../ResourceStrings");
var string_utilities_1 = require("../string-utilities");
var errors_1 = require("../errors");
var locale_handler_1 = require("../locale-handler");
var visitors_1 = require("../../lib/Installer/visitors");
var workload_category_1 = require("../workload-utilities/workload-category");
var lazy_1 = require("../lazy");
var workload_resources_1 = require("../workload-utilities/workload-resources");
exports.TELEMETRY_PRODUCT_STATE_AVAILABLE = "Available";
var InstallState;
(function (InstallState) {
    InstallState[InstallState["Installed"] = 0] = "Installed";
    InstallState[InstallState["NotInstalled"] = 1] = "NotInstalled";
    InstallState[InstallState["Partial"] = 2] = "Partial";
    InstallState[InstallState["Paused"] = 3] = "Paused";
    InstallState[InstallState["Unknown"] = 4] = "Unknown";
})(InstallState = exports.InstallState || (exports.InstallState = {}));
var ProgressType;
(function (ProgressType) {
    ProgressType[ProgressType["Unknown"] = 0] = "Unknown";
    ProgressType[ProgressType["Install"] = 1] = "Install";
    ProgressType[ProgressType["Download"] = 2] = "Download";
    ProgressType[ProgressType["UninstallAll"] = 3] = "UninstallAll";
})(ProgressType = exports.ProgressType || (exports.ProgressType = {}));
var DependencyType;
(function (DependencyType) {
    DependencyType[DependencyType["Required"] = 0] = "Required";
    DependencyType[DependencyType["Recommended"] = 1] = "Recommended";
    DependencyType[DependencyType["Optional"] = 2] = "Optional";
})(DependencyType = exports.DependencyType || (exports.DependencyType = {}));
var RebootType;
(function (RebootType) {
    RebootType[RebootType["None"] = 0] = "None";
    RebootType[RebootType["FinalReboot"] = 1] = "FinalReboot";
    RebootType[RebootType["FinalizerReboot"] = 2] = "FinalizerReboot";
    RebootType[RebootType["IntermediateReboot"] = 3] = "IntermediateReboot";
})(RebootType = exports.RebootType || (exports.RebootType = {}));
var SelectedState;
(function (SelectedState) {
    SelectedState[SelectedState["NotSelected"] = 0] = "NotSelected";
    SelectedState[SelectedState["IndividuallySelected"] = 1] = "IndividuallySelected";
    SelectedState[SelectedState["GroupSelected"] = 2] = "GroupSelected";
})(SelectedState = exports.SelectedState || (exports.SelectedState = {}));
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Informational"] = 0] = "Informational";
    MessageType[MessageType["Warning"] = 1] = "Warning";
    MessageType[MessageType["Error"] = 2] = "Error";
    MessageType[MessageType["StartAction"] = 3] = "StartAction";
    MessageType[MessageType["EndAction"] = 4] = "EndAction";
    MessageType[MessageType["RebootRequired"] = 5] = "RebootRequired";
    MessageType[MessageType["SourceRequired"] = 6] = "SourceRequired";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MessageResultTypes;
(function (MessageResultTypes) {
    MessageResultTypes[MessageResultTypes["None"] = 0] = "None";
    MessageResultTypes[MessageResultTypes["OK"] = 1] = "OK";
    MessageResultTypes[MessageResultTypes["Cancel"] = 2] = "Cancel";
    MessageResultTypes[MessageResultTypes["Retry"] = 4] = "Retry";
    MessageResultTypes[MessageResultTypes["Abort"] = 8] = "Abort";
    MessageResultTypes[MessageResultTypes["Ignore"] = 16] = "Ignore";
    MessageResultTypes[MessageResultTypes["Text"] = 32] = "Text";
})(MessageResultTypes = exports.MessageResultTypes || (exports.MessageResultTypes = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType[ActivityType["Initialize"] = 0] = "Initialize";
    ActivityType[ActivityType["Plan"] = 1] = "Plan";
    ActivityType[ActivityType["Download"] = 2] = "Download";
    ActivityType[ActivityType["Install"] = 3] = "Install";
    ActivityType[ActivityType["Finalize"] = 4] = "Finalize";
})(ActivityType = exports.ActivityType || (exports.ActivityType = {}));
var ArtifactSelectionWarning = /** @class */ (function () {
    function ArtifactSelectionWarning(artifactId, reason) {
        requires.stringNotEmpty(artifactId, "artifactId");
        requires.stringNotEmpty(reason, "reason");
        this._artifactId = artifactId;
        this._reason = reason;
    }
    Object.defineProperty(ArtifactSelectionWarning.prototype, "artifactId", {
        get: function () {
            return this._artifactId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArtifactSelectionWarning.prototype, "reason", {
        get: function () {
            return this._reason;
        },
        enumerable: true,
        configurable: true
    });
    return ArtifactSelectionWarning;
}());
exports.ArtifactSelectionWarning = ArtifactSelectionWarning;
var InstalledProductSummariesResult = /** @class */ (function () {
    function InstalledProductSummariesResult(rpcErrors, installedProductSummaryResults) {
        requires.notNullOrUndefined(rpcErrors, "rpcErrors");
        requires.notNullOrUndefined(installedProductSummaryResults, "installedProductSummaryResults");
        this._rpcErrors = rpcErrors;
        this._installedProductSummaryResults = installedProductSummaryResults;
    }
    Object.defineProperty(InstalledProductSummariesResult.prototype, "rpcErrors", {
        /**
         * Gets all RPC errors thrown when converting the products from RPC.
         */
        get: function () {
            return this._rpcErrors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummariesResult.prototype, "installedProductSummaryResults", {
        /**
         * Gets all the summary result objects. Contains error and product summary information.
         */
        get: function () {
            return this._installedProductSummaryResults;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummariesResult.prototype, "installedProductSummaries", {
        /**
         * Gets all non-null product-summaries.
         */
        get: function () {
            return this._installedProductSummaryResults
                .filter(function (result) { return !!result.productSummary; })
                .map(function (result) { return result.productSummary; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummariesResult.prototype, "installedProductSummaryErrors", {
        /**
         * Gets all errors thrown when getting product summaries.
         */
        get: function () {
            return this._installedProductSummaryResults
                .map(function (result) { return result.error; })
                .filter(function (error) { return !!error; });
        },
        enumerable: true,
        configurable: true
    });
    return InstalledProductSummariesResult;
}());
exports.InstalledProductSummariesResult = InstalledProductSummariesResult;
var OperationResult;
(function (OperationResult) {
    OperationResult[OperationResult["None"] = 0] = "None";
    OperationResult[OperationResult["UserCancel"] = 1] = "UserCancel";
    OperationResult[OperationResult["Failure"] = 2] = "Failure";
    OperationResult[OperationResult["Warning"] = 3] = "Warning";
    OperationResult[OperationResult["Success"] = 4] = "Success";
    OperationResult[OperationResult["RebootRequired"] = 5] = "RebootRequired";
})(OperationResult = exports.OperationResult || (exports.OperationResult = {}));
var InstallOperationResult = /** @class */ (function () {
    function InstallOperationResult(product, rebootRequired, error) {
        requires.notNullOrUndefined(rebootRequired, "rebootRequired");
        this._product = product;
        this._rebootRequired = rebootRequired;
        this._error = error;
    }
    Object.defineProperty(InstallOperationResult.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallOperationResult.prototype, "isRebootRequired", {
        get: function () {
            return this._rebootRequired !== RebootType.None;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallOperationResult.prototype, "rebootRequired", {
        get: function () {
            return this._rebootRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallOperationResult.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallOperationResult.prototype, "log", {
        get: function () {
            return this._product && this._product.errorDetails && this._product.errorDetails.logFilePath ||
                this._error && this._error.log ||
                "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallOperationResult.prototype, "isSuccess", {
        get: function () {
            return this.operationResult === OperationResult.Success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallOperationResult.prototype, "isFailure", {
        get: function () {
            return this.operationResult === OperationResult.Failure;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallOperationResult.prototype, "isWarning", {
        get: function () {
            return this.operationResult === OperationResult.Warning;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallOperationResult.prototype, "operationResult", {
        get: function () {
            var errorDetails = this.product && this.product.errorDetails;
            if (errors_1.isOperationCanceledError(this.error)) {
                return OperationResult.UserCancel;
            }
            if (this.isRebootRequired) {
                return OperationResult.RebootRequired;
            }
            // Has a core package failure, so this is a failure
            if (errorDetails && errorDetails.hasCorePackageFailures) {
                return OperationResult.Failure;
            }
            // Has non-core package failures, so it is a warning
            if (errorDetails && errorDetails.hasErrors) {
                return OperationResult.Warning;
            }
            // No error and a valid product with no errors, so this is a success.
            if (!this.error && this.product) {
                return OperationResult.Success;
            }
            // Have an error and no product, so this is a failure
            if (!this.product && this._error) {
                return OperationResult.Failure;
            }
            return OperationResult.None;
        },
        enumerable: true,
        configurable: true
    });
    return InstallOperationResult;
}());
exports.InstallOperationResult = InstallOperationResult;
var Icon = /** @class */ (function () {
    function Icon(mimeType, base64) {
        this._mimeType = mimeType;
        this._base64 = base64;
    }
    Object.defineProperty(Icon.prototype, "mimeType", {
        get: function () {
            return this._mimeType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon.prototype, "base64", {
        get: function () {
            return this._base64;
        },
        enumerable: true,
        configurable: true
    });
    Icon.prototype.isValid = function () {
        return !!this.mimeType && !!this.base64;
    };
    return Icon;
}());
exports.Icon = Icon;
var LanguageOption = /** @class */ (function () {
    function LanguageOption(localeCode, isInstalled, isSelected) {
        this._localeCode = locale_handler_1.LocaleHandler.getSupportedLocale(localeCode);
        this._uiName = locale_handler_1.LocaleHandler.getUIName(this._localeCode);
        this._isInstalled = isInstalled;
        this._isSelected = isSelected;
    }
    Object.defineProperty(LanguageOption.prototype, "locale", {
        get: function () {
            return this._localeCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageOption.prototype, "isInstalled", {
        get: function () {
            return this._isInstalled;
        },
        set: function (installed) {
            this._isInstalled = installed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageOption.prototype, "isSelected", {
        get: function () {
            return this._isSelected;
        },
        set: function (selected) {
            this._isSelected = selected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageOption.prototype, "uiName", {
        get: function () {
            return this._uiName;
        },
        enumerable: true,
        configurable: true
    });
    return LanguageOption;
}());
exports.LanguageOption = LanguageOption;
var ComponentDependency = /** @class */ (function () {
    function ComponentDependency(id, type) {
        this._id = id;
        this._type = type;
    }
    Object.defineProperty(ComponentDependency.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentDependency.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return ComponentDependency;
}());
exports.ComponentDependency = ComponentDependency;
var Component = /** @class */ (function () {
    function Component(id, name, description, longDescription, category, version, license, componentDependencies, allComponents, installState, selectedState, installable, isUiGroup) {
        requires.stringNotEmpty(id, "id");
        requires.notNullOrUndefined(name, "name");
        requires.notNullOrUndefined(description, "description");
        requires.notNullOrUndefined(longDescription, "longDescription");
        requires.notNullOrUndefined(category, "category");
        requires.notNullOrUndefined(version, "version");
        requires.notNullOrUndefined(license, "license");
        requires.notNullOrUndefined(componentDependencies, "componentDependencies");
        requires.notNullOrUndefined(allComponents, "allComponents");
        requires.notNullOrUndefined(installState, "installState");
        requires.notNullOrUndefined(installable, "installable");
        this._id = id;
        this._name = name;
        this._description = description;
        this._longDescription = longDescription;
        this._category = category;
        this._version = version;
        this._license = license;
        this._installState = installState;
        this._selectedState = selectedState;
        this._componentDependencies = componentDependencies;
        this._allComponents = allComponents;
        this._visible = true;
        this._installable = installable;
        this._isUiGroup = isUiGroup;
    }
    Object.defineProperty(Component.prototype, "components", {
        /**
         * Gets directly referenced components. Does not walk.
         */
        get: function () {
            return this.componentsByDependencyType(DependencyType.Required, DependencyType.Recommended, DependencyType.Optional);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "displayedName", {
        get: function () {
            return this._name || this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "longDescription", {
        get: function () {
            return this._longDescription;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "category", {
        get: function () {
            return this._category;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "componentDependencies", {
        get: function () {
            return this._componentDependencies;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "license", {
        get: function () {
            return this._license;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "installState", {
        get: function () {
            return this._installState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "selectedState", {
        get: function () {
            return this._selectedState;
        },
        set: function (state) {
            this._selectedState = state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "optionalComponents", {
        get: function () {
            return this.componentsByDependencyType(DependencyType.Optional);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "recommendedComponents", {
        get: function () {
            return this.componentsByDependencyType(DependencyType.Recommended);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "requiredComponents", {
        get: function () {
            return this.componentsByDependencyType(DependencyType.Required);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (visible) {
            this._visible = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "installable", {
        get: function () {
            return this._installable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "isUiGroup", {
        get: function () {
            return this._isUiGroup;
        },
        enumerable: true,
        configurable: true
    });
    Component.prototype.clone = function (allComponents) {
        return new Component(this.id, this.name, this.description, this.longDescription, this.category, this.version, this.license, this._componentDependencies, allComponents, this.installState, this.selectedState, this.installable, this.isUiGroup);
    };
    Component.prototype.componentsByDependencyType = function () {
        var _this = this;
        var dependencyTypes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dependencyTypes[_i] = arguments[_i];
        }
        var componentIds = [];
        dependencyTypes.forEach(function (dependencyType) {
            componentIds.push.apply(componentIds, componentIdsByDependencyType(_this._componentDependencies, dependencyType));
        });
        return (_a = this._allComponents).filterById.apply(_a, componentIds);
        var _a;
    };
    return Component;
}());
exports.Component = Component;
var ComponentMap = /** @class */ (function () {
    function ComponentMap() {
        this._componentMap = new Map();
    }
    ComponentMap.prototype.add = function () {
        var _this = this;
        var components = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            components[_i] = arguments[_i];
        }
        components.forEach(function (component) {
            _this._componentMap.set(component.id, component);
        });
    };
    ComponentMap.prototype.filterById = function () {
        var _this = this;
        var ids = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ids[_i] = arguments[_i];
        }
        return ids.map(function (id) { return _this._componentMap.get(id); });
    };
    ComponentMap.prototype.forEach = function (callback) {
        this._componentMap.forEach(callback);
    };
    ComponentMap.prototype.toArray = function () {
        return Array.from(this._componentMap.values());
    };
    return ComponentMap;
}());
exports.ComponentMap = ComponentMap;
var Workload = /** @class */ (function () {
    function Workload(id, name, description, longDescription, category, installState, selectedState, version, allComponents, componentDependencies, isRequired, installable, icon) {
        requires.stringNotEmpty(id, "id");
        requires.stringNotEmpty(name, "name");
        requires.stringNotEmpty(description, "description");
        requires.notNullOrUndefined(longDescription, "longDescription");
        requires.notNullOrUndefined(category, "category");
        requires.notNullOrUndefined(installState, "installState");
        requires.notNullOrUndefined(version, "version");
        requires.notNullOrUndefined(allComponents, "allComponents");
        requires.notNullOrUndefined(componentDependencies, "componentDependencies");
        requires.notNullOrUndefined(isRequired, "isRequired");
        requires.notNullOrUndefined(installable, "installable");
        requires.notNullOrUndefined(icon, "icon");
        this._id = id;
        this._name = name;
        this._description = description;
        this._longDescription = longDescription;
        this._category = category;
        this._installState = installState;
        this._selectedState = selectedState;
        this._allComponents = allComponents;
        this._componentDependencies = componentDependencies;
        this._version = version;
        this._required = isRequired;
        this._installable = installable;
        this._icon = icon;
        if (this._required) {
            hideRequiredComponents(this.requiredComponents);
        }
    }
    Workload.prototype.getResources = function () {
        var _this = this;
        if (!this._resources) {
            this._resources = new lazy_1.Lazy(function () { return workload_resources_1.WorkloadResources.create(_this); });
        }
        return this._resources.value;
    };
    Object.defineProperty(Workload.prototype, "resourcesProvider", {
        get: function () {
            return this._resourcesProvider;
        },
        set: function (provider) {
            var _this = this;
            if (provider) {
                this._resourcesProvider = provider;
                this._resources = new lazy_1.Lazy(function () { return provider.getResources(_this); });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "components", {
        /**
         * Gets directly referenced components. Does not walk.
         */
        get: function () {
            return this.componentsByDependencyType(DependencyType.Required, DependencyType.Recommended, DependencyType.Optional);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "longDescription", {
        get: function () {
            return this._longDescription;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "category", {
        get: function () {
            return this._category;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "installState", {
        get: function () {
            return this._installState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "selectedState", {
        get: function () {
            return this._selectedState;
        },
        set: function (state) {
            this._selectedState = state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "componentDependencies", {
        get: function () {
            return this._componentDependencies;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "requiredComponents", {
        get: function () {
            return this.componentsByDependencyType(DependencyType.Required);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "optionalComponents", {
        get: function () {
            return this.componentsByDependencyType(DependencyType.Optional);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "recommendedComponents", {
        get: function () {
            return this.componentsByDependencyType(DependencyType.Recommended);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "required", {
        get: function () {
            return this._required;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "installable", {
        get: function () {
            return this._installable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workload.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the workload, using clonedComponents if one is provided.
     * @param {Component[]} clonedComponents - Components to use when creating the {Workload}.
     * @returns {Workload} - A clone.
     */
    Workload.prototype.clone = function (clonedComponents) {
        if (!clonedComponents) {
            clonedComponents = this._allComponents;
        }
        return new Workload(this.id, this.name, this.description, this.longDescription, this.category, this.installState, this.selectedState, this.version.clone(), clonedComponents, this.componentDependencies, this.required, this.installable, this.icon);
    };
    Workload.prototype.componentsByDependencyType = function () {
        var _this = this;
        var dependencyTypes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dependencyTypes[_i] = arguments[_i];
        }
        var componentIds = [];
        dependencyTypes.forEach(function (dependencyType) {
            componentIds.push.apply(componentIds, componentIdsByDependencyType(_this._componentDependencies, dependencyType));
        });
        return (_a = this._allComponents).filterById.apply(_a, componentIds);
        var _a;
    };
    return Workload;
}());
exports.Workload = Workload;
var Installable = /** @class */ (function () {
    function Installable(reasons) {
        if (reasons === void 0) { reasons = null; }
        this._reasons = reasons || [];
    }
    Object.defineProperty(Installable.prototype, "state", {
        get: function () {
            return this._reasons.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Installable.prototype, "reasons", {
        get: function () {
            return this._reasons;
        },
        enumerable: true,
        configurable: true
    });
    return Installable;
}());
exports.Installable = Installable;
var VersionBundle = /** @class */ (function () {
    function VersionBundle(build, display, semantic) {
        requires.stringNotEmpty(build, "build");
        this._build = build;
        this._display = display || build;
        this._semantic = semantic || build;
    }
    Object.defineProperty(VersionBundle.prototype, "build", {
        get: function () {
            return this._build;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VersionBundle.prototype, "display", {
        get: function () {
            return this._display;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VersionBundle.prototype, "semantic", {
        get: function () {
            return this._semantic;
        },
        enumerable: true,
        configurable: true
    });
    VersionBundle.prototype.clone = function () {
        return new VersionBundle(this._build, this._display, this._semantic);
    };
    return VersionBundle;
}());
exports.VersionBundle = VersionBundle;
var ProductSummaryBase = /** @class */ (function () {
    function ProductSummaryBase(id, installerId, channel, name, description, longDescription, version, icon, hidden, releaseNotes) {
        requires.stringNotEmpty(id, "id");
        requires.stringNotEmpty(installerId, "installerId");
        requires.notNullOrUndefined(channel, "channel");
        requires.stringNotEmpty(name, "name");
        requires.stringNotEmpty(description, "description");
        requires.notNullOrUndefined(longDescription, "longDescription");
        requires.notNullOrUndefined(version, "version");
        requires.notNullOrUndefined(icon, "icon");
        requires.notNullOrUndefined(hidden, "hidden");
        requires.notNullOrUndefined(releaseNotes, "releaseNotes");
        this._id = id;
        this._installerId = installerId;
        this._channel = channel;
        this._name = name;
        this._description = description;
        this._longDescription = longDescription;
        this._version = version;
        this._icon = icon;
        this._hidden = hidden;
        this._releaseNotes = releaseNotes;
    }
    Object.defineProperty(ProductSummaryBase.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "installerId", {
        get: function () {
            return this._installerId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "channelId", {
        get: function () {
            return this.channel.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "channel", {
        get: function () {
            return this._channel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "displayName", {
        get: function () {
            var suffix = this.channel.suffix;
            if (suffix) {
                return ResourceStrings_1.ResourceStrings.productWithSuffixTitle(this.name, suffix);
            }
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "longDescription", {
        get: function () {
            return this._longDescription;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "hidden", {
        get: function () {
            return this._hidden;
        },
        set: function (value) {
            this._hidden = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummaryBase.prototype, "releaseNotes", {
        get: function () {
            return this._releaseNotes;
        },
        enumerable: true,
        configurable: true
    });
    ProductSummaryBase.prototype.getPropertiesAsLoggableBag = function () {
        var propertyBag = {};
        propertyBag.id = this.id;
        propertyBag.installerId = this.installerId;
        propertyBag.channelId = this.channel.id;
        propertyBag.name = this.name;
        propertyBag.description = this.description;
        propertyBag.version = this.version.build;
        propertyBag.isHidden = this.hidden.toString();
        return propertyBag;
    };
    return ProductSummaryBase;
}());
exports.ProductSummaryBase = ProductSummaryBase;
var ProductSummary = /** @class */ (function (_super) {
    __extends(ProductSummary, _super);
    function ProductSummary(id, installerId, channel, name, description, longDescription, version, installable, icon, hidden, license, releaseNotes) {
        var _this = _super.call(this, id, installerId, channel, name, description, longDescription, version, icon, hidden, releaseNotes) || this;
        requires.notNullOrUndefined(installable, "installable");
        if (license === undefined) {
            license = null;
        }
        _this._installable = installable;
        _this._license = license;
        return _this;
    }
    Object.defineProperty(ProductSummary.prototype, "installable", {
        get: function () {
            return this._installable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductSummary.prototype, "license", {
        get: function () {
            return this._license;
        },
        enumerable: true,
        configurable: true
    });
    ProductSummary.prototype.getPropertiesAsLoggableBag = function () {
        var propertyBag = _super.prototype.getPropertiesAsLoggableBag.call(this);
        propertyBag.installState = exports.TELEMETRY_PRODUCT_STATE_AVAILABLE;
        propertyBag.isSummary = true.toString();
        if (this.installable && this.installable.state) {
            propertyBag.installable = this.installable.state.toString();
        }
        if (this.installable && this.installable.reasons) {
            propertyBag.installableReason = this.installable.reasons.join(",");
        }
        return propertyBag;
    };
    return ProductSummary;
}(ProductSummaryBase));
exports.ProductSummary = ProductSummary;
var InstalledProductSummary = /** @class */ (function (_super) {
    __extends(InstalledProductSummary, _super);
    function InstalledProductSummary(id, installerId, channel, name, description, longDescription, version, installationId, installationPath, nickname, installState, isUpdateAvailable, latestVersion, icon, hidden, hasPendingReboot, errorDetails, releaseNotes) {
        var _this = _super.call(this, id, installerId, channel, name, description, longDescription, version, icon, hidden, releaseNotes) || this;
        requires.stringNotEmpty(installationPath, "installationPath");
        requires.notNullOrUndefined(installState, "installState");
        requires.notNullOrUndefined(isUpdateAvailable, "isUpdateAvailable");
        requires.notNullOrUndefined(latestVersion, "latestVersion");
        requires.notNullOrUndefined(hasPendingReboot, "hasPendingReboot");
        requires.notNullOrUndefined(errorDetails, "errorDetails");
        _this._installationId = installationId || "";
        _this._installationPath = installationPath;
        _this._nickname = nickname;
        _this._installState = installState;
        _this._isUpdateAvailable = isUpdateAvailable;
        _this._latestVersion = latestVersion;
        _this._hasPendingReboot = hasPendingReboot;
        _this._errorDetails = errorDetails;
        return _this;
    }
    Object.defineProperty(InstalledProductSummary.prototype, "installationId", {
        get: function () {
            return this._installationId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "nickname", {
        get: function () {
            return this._nickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "displayNameWithNickname", {
        get: function () {
            if (this.nickname) {
                return ResourceStrings_1.ResourceStrings.productWithNicknameTitle(this.displayName, this.nickname);
            }
            return this.displayName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "installState", {
        get: function () {
            return this._installState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "isUpdateAvailable", {
        get: function () {
            return this._isUpdateAvailable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "latestVersion", {
        get: function () {
            return this._latestVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "hasPendingReboot", {
        get: function () {
            return this._hasPendingReboot;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "hasErrors", {
        get: function () {
            return this._errorDetails.hasErrors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "errorDetails", {
        get: function () {
            return this._errorDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummary.prototype, "hasCriticalError", {
        get: function () {
            return this.installState !== InstallState.Paused
                && !this.hasPendingReboot
                && (this.errorDetails.hasCorePackageFailures || this.installState === InstallState.Partial);
        },
        enumerable: true,
        configurable: true
    });
    InstalledProductSummary.prototype.getPropertiesAsLoggableBag = function () {
        var propertyBag = _super.prototype.getPropertiesAsLoggableBag.call(this);
        propertyBag.installState = InstallState[this.installState];
        propertyBag.isSummary = true.toString();
        propertyBag.installationId = this.installationId;
        propertyBag.nickname = this.nickname;
        propertyBag.isUpdateAvailable = this.isUpdateAvailable.toString();
        propertyBag.hasErrors = this.hasErrors.toString();
        propertyBag.latestVersion = this.latestVersion.build;
        return propertyBag;
    };
    return InstalledProductSummary;
}(ProductSummaryBase));
exports.InstalledProductSummary = InstalledProductSummary;
var ProductBase = /** @class */ (function (_super) {
    __extends(ProductBase, _super);
    function ProductBase(id, installerId, channel, name, description, longDescription, version, componentDependencies, components, workloads, icon, installSize, languageOptions, hidden, releaseNotes, license, thirdPartyNotices, recommendSelection) {
        var _this = _super.call(this, id, installerId, channel, name, description, longDescription, version, icon, hidden, releaseNotes) || this;
        _this._languageOptions = new Map();
        requires.notNullOrUndefined(componentDependencies, "componentDependencies");
        requires.notNullOrUndefined(components, "components");
        requires.notNullOrUndefined(workloads, "workloads");
        requires.notNullOrUndefined(installSize, "installSize");
        requires.notNullOrUndefined(languageOptions, "languageOptions");
        _this._workloads = workloads;
        _this._componentDependencies = componentDependencies;
        _this._components = components;
        _this._installSize = installSize;
        _this._license = license || null;
        _this._thirdPartyNotices = thirdPartyNotices || null;
        _this._recommendSelection = recommendSelection;
        languageOptions.forEach(function (option) { return _this._languageOptions.set(option.locale, option); });
        return _this;
    }
    Object.defineProperty(ProductBase.prototype, "workloads", {
        get: function () {
            return this._workloads;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "additionalComponents", {
        get: function () {
            var componentIds = this._componentDependencies.map(function (dependency) { return dependency.id; });
            return (_a = this._components).filterById.apply(_a, componentIds);
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "allComponents", {
        get: function () {
            return this._components.toArray();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "license", {
        get: function () {
            return this._license;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "thirdPartyNotices", {
        get: function () {
            return this._thirdPartyNotices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "recommendSelection", {
        get: function () {
            return this._recommendSelection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "requiredComponentsForAllWorkloads", {
        get: function () {
            var set = new Set();
            this._workloads.forEach(function (workload) {
                if (workload.required) {
                    workload.requiredComponents.forEach(function (component) {
                        set.add(component);
                    });
                }
            });
            var components = [];
            set.forEach(function (component) { return components.push(component); });
            return components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "selectedComponents", {
        get: function () {
            return this.allComponents
                .filter(function (component) { return component.selectedState !== SelectedState.NotSelected; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "selectedWorkloads", {
        get: function () {
            return this.workloads
                .filter(function (workload) { return workload.selectedState !== SelectedState.NotSelected; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "installSize", {
        get: function () {
            return this._installSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "componentDependencies", {
        get: function () {
            return this._componentDependencies;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "availableLanguages", {
        get: function () {
            return this.languageOptions.map(function (option) { return option.locale; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "selectedLanguages", {
        get: function () {
            var filteredOptionArray = this.languageOptions.filter(function (option) { return option.isSelected; });
            return filteredOptionArray.map(function (option) { return option.locale; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "languageOptions", {
        get: function () {
            return Array.from(this._languageOptions.values());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "workloadSorter", {
        get: function () {
            return this._workloadSorter;
        },
        set: function (sorter) {
            var _this = this;
            if (sorter) {
                this._workloadSorter = sorter;
                this._workloadCategories = new lazy_1.Lazy(function () {
                    // Only create categories for non-required workloads
                    return sorter.sort(_this._workloads.filter(function (w) { return !w.required; }));
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductBase.prototype, "workloadResourcesProvider", {
        get: function () {
            return this._workloadResourcesProvider;
        },
        set: function (provider) {
            if (provider) {
                this._workloadResourcesProvider = provider;
                this._workloads.forEach(function (w) { return w.resourcesProvider = provider; });
            }
        },
        enumerable: true,
        configurable: true
    });
    ProductBase.prototype.additionalComponentsOfDependencyType = function (dependencyType) {
        var componentIds = this._componentDependencies
            .filter(function (dependency) { return dependency.type === dependencyType; })
            .map(function (dependency) { return dependency.id; });
        return (_a = this._components).filterById.apply(_a, componentIds);
        var _a;
    };
    ProductBase.prototype.getLanguageOption = function (locale) {
        return this._languageOptions.get(locale);
    };
    /**
     * Fixup common selection issues due to bugs from a previous release.
     */
    ProductBase.prototype.fixupSelection = function () {
        // Find all selected components from selected workloads.
        var reachableComponents = new Set();
        this.selectedWorkloads.forEach(function (w) {
            var components = w.components
                .filter(function (c) { return c.selectedState !== SelectedState.NotSelected; });
            components.forEach(function (c) { return reachableComponents.add(c); });
        });
        var visitorOptions = {
            includeOptional: true,
            includeRecommended: true,
            includeRequired: true,
        };
        var visitor = new visitors_1.ParameterizedComponentVisitor(visitorOptions, function (c) {
            if (c.selectedState !== SelectedState.NotSelected) {
                reachableComponents.add(c);
            }
        });
        visitor.visit(reachableComponents);
        // Find selected component groups.
        var selectedComponentGroups = this.selectedComponents
            .filter(function (c) { return c.isUiGroup && c.selectedState !== SelectedState.NotSelected; });
        // Case 1 - any selected, but orphaned CGs should be deselected and its dependencies
        // should are left alone, since they're probably marked with the right selected state.
        for (var i = 0; i < selectedComponentGroups.length; i++) {
            var component = selectedComponentGroups[i];
            var isReachable = reachableComponents.has(component);
            if (!isReachable) {
                component.selectedState = SelectedState.NotSelected;
            }
        }
        // Case 2 - ensure reachable CGs are GroupSelected, leaving the
        // dependencies alone, because we can't know how they became selected.
        reachableComponents.forEach(function (c, index) {
            if (c.isUiGroup) {
                c.selectedState = SelectedState.GroupSelected;
            }
        });
    };
    /**
     * This base clone method should never be called.
     */
    ProductBase.prototype.clone = function () {
        throw "Not implemented";
    };
    ProductBase.prototype.getWorkloadCategories = function () {
        var _this = this;
        if (!this._workloadCategories) {
            this._workloadCategories = new lazy_1.Lazy(function () { return _this.buildWorkloadCategories(); });
        }
        return this._workloadCategories.value.slice();
    };
    /**
     * Default method for creating categories. Used if no sorter is set.
     */
    ProductBase.prototype.buildWorkloadCategories = function () {
        var workloads = this._workloads.filter(function (w) { return !w.required; });
        var categoryMap = new Map();
        workloads.forEach(function (workload) {
            var category = workload.category || ResourceStrings_1.ResourceStrings.uncategorized;
            if (!categoryMap.has(category)) {
                categoryMap.set(category, []);
            }
            categoryMap.get(category).push(workload);
        });
        return Array.from(categoryMap.entries()).map(function (entry) {
            return new workload_category_1.WorkloadCategory(entry[0], entry[1]);
        });
    };
    return ProductBase;
}(ProductSummaryBase));
exports.ProductBase = ProductBase;
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product(id, installerId, channel, name, description, longDescription, version, defaultInstallDirectory, additionalComponentDependencies, components, workloads, installable, icon, installSize, languageOptions, hidden, license, releaseNotes, thirdPartyNotices, recommendSelection) {
        var _this = _super.call(this, id, installerId, channel, name, description, longDescription, version, additionalComponentDependencies, components, workloads, icon, installSize, languageOptions, hidden, releaseNotes, license, thirdPartyNotices, recommendSelection) || this;
        requires.notNullOrUndefined(defaultInstallDirectory, "defaultInstallDirectory");
        requires.notNullOrUndefined(installable, "installable");
        _this._defaultInstallDirectory = defaultInstallDirectory;
        _this._installable = installable;
        return _this;
    }
    Object.defineProperty(Product.prototype, "defaultInstallDirectory", {
        get: function () {
            return this._defaultInstallDirectory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "installable", {
        get: function () {
            return this._installable;
        },
        enumerable: true,
        configurable: true
    });
    Product.prototype.clone = function () {
        // clone allComponents
        var components = new ComponentMap();
        this.allComponents.forEach(function (component) {
            var cloned = component.clone(components);
            components.add(cloned);
        });
        // clone workloads using cloned components
        var clonedWorkloads = this.workloads.map(function (workload) { return workload.clone(components); });
        return new Product(this.id, this.installerId, this.channel, this.name, this.description, this.longDescription, this.version, this.defaultInstallDirectory, this.componentDependencies, components, clonedWorkloads, this.installable, this.icon, this.installSize, this.languageOptions, this.hidden, this.license, this.releaseNotes, this.thirdPartyNotices, this.recommendSelection);
    };
    Product.prototype.getPropertiesAsLoggableBag = function () {
        var propertyBag = _super.prototype.getPropertiesAsLoggableBag.call(this);
        propertyBag.installState = exports.TELEMETRY_PRODUCT_STATE_AVAILABLE;
        propertyBag.isSummary = false.toString();
        if (this.installable && this.installable.state) {
            propertyBag.installable = this.installable.state.toString();
        }
        if (this.installable && this.installable.reasons) {
            propertyBag.installableReason = this.installable.reasons.join(",");
        }
        return propertyBag;
    };
    return Product;
}(ProductBase));
exports.Product = Product;
var InstalledProduct = /** @class */ (function (_super) {
    __extends(InstalledProduct, _super);
    function InstalledProduct(id, installerId, channel, name, description, longDescription, version, additionalComponentsDependencies, components, workloads, installationId, installationPath, nickname, installSize, installState, isUpdateAvailable, latestVersion, icon, languageOptions, hidden, hasPendingReboot, errorDetails, hasUpdatePackages, releaseNotes, license, thirdPartyNotices, recommendSelection) {
        var _this = _super.call(this, id, installerId, channel, name, description, longDescription, version, additionalComponentsDependencies, components, workloads, icon, installSize, languageOptions, hidden, releaseNotes, license, thirdPartyNotices, recommendSelection) || this;
        requires.stringNotEmpty(installationPath, "installationPath");
        requires.notNullOrUndefined(installState, "installState");
        requires.notNullOrUndefined(isUpdateAvailable, "isUpdateAvailable");
        requires.notNullOrUndefined(latestVersion, "latestVersion");
        requires.notNullOrUndefined(hasPendingReboot, "hasPendingReboot");
        requires.notNullOrUndefined(errorDetails, "errorDetails");
        requires.notNullOrUndefined(hasUpdatePackages, "hasUpdatePackages");
        _this._installationId = installationId || "";
        _this._installationPath = installationPath;
        _this._nickname = nickname;
        _this._installState = installState;
        _this._isUpdateAvailable = isUpdateAvailable;
        _this._latestVersion = latestVersion;
        _this._hasPendingReboot = hasPendingReboot;
        _this._errorDetails = errorDetails;
        _this._hasUpdatePackages = hasUpdatePackages;
        return _this;
    }
    Object.defineProperty(InstalledProduct.prototype, "installationId", {
        get: function () {
            return this._installationId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "nickname", {
        get: function () {
            return this._nickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "displayNameWithNickname", {
        get: function () {
            var displayName = this.displayName;
            if (this.nickname) {
                displayName = ResourceStrings_1.ResourceStrings.productWithNicknameTitle(displayName, this.nickname);
            }
            return displayName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "installState", {
        get: function () {
            return this._installState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "isUpdateAvailable", {
        get: function () {
            return this._isUpdateAvailable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "latestVersion", {
        get: function () {
            return this._latestVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "installedAdditionalComponents", {
        get: function () {
            return this.additionalComponents.filter(function (component) { return component.installState === InstallState.Installed; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "installedLanguages", {
        get: function () {
            var filteredOptionArray = this.languageOptions.filter(function (option) { return option.isInstalled; });
            return filteredOptionArray.map(function (option) { return option.locale; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "installedWorkloads", {
        get: function () {
            return this.workloads.filter(function (workload) { return workload.installState === InstallState.Installed; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "hasPendingReboot", {
        get: function () {
            return this._hasPendingReboot;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "hasErrors", {
        get: function () {
            return this._errorDetails.hasErrors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "failedPackageIds", {
        get: function () {
            return this._errorDetails.failedPackageIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "skippedPackageIds", {
        get: function () {
            return this._errorDetails.skippedPackageIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "errorDetails", {
        get: function () {
            return this._errorDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "hasCriticalError", {
        get: function () {
            return this.installState !== InstallState.Paused
                && !this.hasPendingReboot
                && (this.errorDetails.hasCorePackageFailures || this.installState === InstallState.Partial);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "hasUpdatePackages", {
        get: function () {
            return this._hasUpdatePackages;
        },
        enumerable: true,
        configurable: true
    });
    InstalledProduct.prototype.clone = function () {
        // clone allComponents
        var components = new ComponentMap();
        this.allComponents.forEach(function (component) {
            var cloned = component.clone(components);
            components.add(cloned);
        });
        // clone workloads using cloned components
        var clonedWorkloads = this.workloads.map(function (workload) { return workload.clone(components); });
        return new InstalledProduct(this.id, this.installerId, this.channel, this.name, this.description, this.longDescription, this.version, this.componentDependencies, components, clonedWorkloads, this.installationId, this.installationPath, this.nickname, this.installSize, this.installState, this.isUpdateAvailable, this.latestVersion, this.icon, this.languageOptions, this.hidden, this.hasPendingReboot, this.errorDetails, this.hasUpdatePackages, this.releaseNotes, this.license, this.thirdPartyNotices, this.recommendSelection);
    };
    InstalledProduct.prototype.getPropertiesAsLoggableBag = function () {
        var propertyBag = _super.prototype.getPropertiesAsLoggableBag.call(this);
        propertyBag.installState = InstallState[this.installState];
        propertyBag.isSummary = false.toString();
        propertyBag.installationId = this.installationId;
        propertyBag.nickname = this.nickname;
        propertyBag.latestVersion = this.latestVersion.build;
        propertyBag.isUpdateAvailable = this.isUpdateAvailable.toString();
        propertyBag.hasErrors = this.hasErrors.toString();
        propertyBag.installedLanguages = this.installedLanguages.join(",");
        var workloadList = this.installedWorkloads.map(function (workload) {
            return workload.id;
        });
        propertyBag.workloads = workloadList.join(",");
        return propertyBag;
    };
    return InstalledProduct;
}(ProductBase));
exports.InstalledProduct = InstalledProduct;
function componentIdsByDependencyType(componentDependenciesToFilter) {
    var dependencyTypes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        dependencyTypes[_i - 1] = arguments[_i];
    }
    return componentDependenciesToFilter
        .filter(function (dependency) { return dependencyTypes.indexOf(dependency.type) > -1; })
        .map(function (dependency) { return dependency.id; });
}
function containsId(collection, id, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    if (ignoreCase) {
        return collection.some(function (obj) { return string_utilities_1.caseInsensitiveAreEqual(obj.id, id); });
    }
    else {
        return collection.some(function (obj) { return obj.id === id; });
    }
}
exports.containsId = containsId;
function findById(collection, id, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    if (ignoreCase) {
        return collection.find(function (obj) { return string_utilities_1.caseInsensitiveAreEqual(obj.id, id); });
    }
    else {
        return collection.find(function (obj) { return obj.id === id; });
    }
}
exports.findById = findById;
function filterById(collection, ids, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    if (ignoreCase) {
        return collection.filter(function (obj) {
            return ids.some(function (id) { return string_utilities_1.caseInsensitiveAreEqual(obj.id, id); });
        });
    }
    else {
        return collection.filter(function (obj) {
            return ids.indexOf(obj.id) > -1;
        });
    }
}
exports.filterById = filterById;
function areEquivalent(product1, product2) {
    if (isTypeOfInstalledProduct(product1) && isTypeOfInstalledProduct(product2)) {
        var installedProduct1 = product1;
        var installedProduct2 = product2;
        return string_utilities_1.caseInsensitiveAreEqual(installedProduct1.channel.id, installedProduct2.channel.id)
            && string_utilities_1.caseInsensitiveAreEqual(installedProduct1.id, installedProduct2.id)
            && string_utilities_1.caseInsensitiveAreEqual(installedProduct1.installationPath, installedProduct2.installationPath);
    }
    return string_utilities_1.caseInsensitiveAreEqual(product1.channel.id, product2.channel.id)
        && string_utilities_1.caseInsensitiveAreEqual(product1.id, product2.id);
}
exports.areEquivalent = areEquivalent;
var ModifyParametersEvaluation = /** @class */ (function () {
    function ModifyParametersEvaluation(systemDriveEvaluation, targetDriveEvaluation, sharedDriveEvaluation) {
        this._systemDriveEvaluation = systemDriveEvaluation;
        this._targetDriveEvaluation = targetDriveEvaluation;
        this._sharedDriveEvaluation = sharedDriveEvaluation;
    }
    ModifyParametersEvaluation.prototype.getDrives = function () {
        return [this.systemDriveEvaluation, this.targetDriveEvaluation, this.sharedDriveEvaluation]
            .filter(function (drive) { return !!drive; });
    };
    Object.defineProperty(ModifyParametersEvaluation.prototype, "warningMessage", {
        get: function () {
            return this.getDrives()
                .filter(function (drive) { return !drive.hasSufficientDiskSpace; })
                .map(function (drive) { return ResourceStrings_1.ResourceStrings.notEnoughDiskSpaceWarningText(drive.driveName); })
                .join("\n");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParametersEvaluation.prototype, "areAllDrivesEquivalent", {
        get: function () {
            return this.getDrives().length <= 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParametersEvaluation.prototype, "systemDriveEvaluation", {
        /**
         * Gets the IDriveSpaceEvaluation for the system drive.
         * Will be null if we should not include it in the UI.
         */
        get: function () {
            return this._systemDriveEvaluation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParametersEvaluation.prototype, "targetDriveEvaluation", {
        /**
         * Gets the IDriveSpaceEvaluation for the target drive.
         * Will be null if we should not include it in the UI.
         */
        get: function () {
            return this._targetDriveEvaluation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParametersEvaluation.prototype, "sharedDriveEvaluation", {
        /**
         * Gets the IDriveSpaceEvaluation for the shared drive.
         * Will be null if we should not include it in the UI.
         */
        get: function () {
            return this._sharedDriveEvaluation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParametersEvaluation.prototype, "errorMessage", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParametersEvaluation.prototype, "totalDeltaSize", {
        /**
         * Gets the total requested delta size across all drives.
         */
        get: function () {
            var installSize = 0;
            installSize += this.systemDriveEvaluation !== null ?
                this.systemDriveEvaluation.requestedDeltaSize : 0;
            installSize += this.targetDriveEvaluation !== null ?
                this.targetDriveEvaluation.requestedDeltaSize : 0;
            installSize += this.sharedDriveEvaluation !== null ?
                this.sharedDriveEvaluation.requestedDeltaSize : 0;
            return installSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModifyParametersEvaluation.prototype, "totalInstallSize", {
        /**
         * Gets the total estimated install size after the operation completes.
         */
        get: function () {
            // The total impact will be the total delta plus whatever is already installed.
            var installSize = this.totalDeltaSize;
            installSize += this.systemDriveEvaluation !== null ?
                this.systemDriveEvaluation.currentInstallSize : 0;
            installSize += this.targetDriveEvaluation !== null ?
                this.targetDriveEvaluation.currentInstallSize : 0;
            installSize += this.sharedDriveEvaluation !== null ?
                this.sharedDriveEvaluation.currentInstallSize : 0;
            return installSize;
        },
        enumerable: true,
        configurable: true
    });
    return ModifyParametersEvaluation;
}());
exports.ModifyParametersEvaluation = ModifyParametersEvaluation;
var InstallParametersEvaluation = /** @class */ (function (_super) {
    __extends(InstallParametersEvaluation, _super);
    function InstallParametersEvaluation(systemDriveEvaluation, targetDriveEvaluation, sharedDriveEvaluation, invalidInstallationPathMessage) {
        var _this = _super.call(this, systemDriveEvaluation, targetDriveEvaluation, sharedDriveEvaluation) || this;
        _this._invalidInstallationPathMessage = invalidInstallationPathMessage || null;
        return _this;
    }
    Object.defineProperty(InstallParametersEvaluation.prototype, "invalidInstallationPathMessage", {
        get: function () {
            return this._invalidInstallationPathMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallParametersEvaluation.prototype, "errorMessage", {
        get: function () {
            if (this.invalidInstallationPathMessage) {
                return this.invalidInstallationPathMessage;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return InstallParametersEvaluation;
}(ModifyParametersEvaluation));
exports.InstallParametersEvaluation = InstallParametersEvaluation;
var Message = /** @class */ (function () {
    function Message(type, acceptsResultTypes, defaultResultType, localizedString, logString, activity) {
        requires.notNullOrUndefined(type, "type");
        requires.notNullOrUndefined(acceptsResultTypes, "acceptsResultTypes");
        requires.notNullOrUndefined(defaultResultType, "defaultResultType");
        requires.stringNotEmpty(localizedString, "localizedString");
        requires.stringNotEmpty(logString, "logString");
        requires.notNullOrUndefined(activity, "activity");
        this._type = type;
        this._acceptsResultTypes = acceptsResultTypes;
        this._defaultResultType = defaultResultType;
        this._localizedString = localizedString;
        this._logString = logString;
        this._activity = activity;
    }
    Message.CreateInstallStartingMessage = function () {
        return new Message(MessageType.StartAction, MessageResultTypes.None, MessageResultTypes.None, ResourceStrings_1.ResourceStrings.startingOperation, "install operation starting", ActivityType.Install);
    };
    Message.CreateInstallFinishedMessage = function () {
        return new Message(MessageType.EndAction, MessageResultTypes.None, MessageResultTypes.None, ResourceStrings_1.ResourceStrings.finishing, "install operation finished", ActivityType.Install);
    };
    Object.defineProperty(Message.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "acceptsResultTypes", {
        get: function () {
            return this._acceptsResultTypes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "defaultResultType", {
        get: function () {
            return this._defaultResultType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "localizedString", {
        get: function () {
            return this._localizedString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "logString", {
        get: function () {
            return this._logString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "activity", {
        get: function () {
            return this._activity;
        },
        enumerable: true,
        configurable: true
    });
    Message.prototype.GetCancelButtonInfo = function () {
        /* tslint:disable:no-bitwise */
        if (this._acceptsResultTypes & MessageResultTypes.Abort) {
            return MessageResultTypes.Abort;
        }
        else if (this._acceptsResultTypes & MessageResultTypes.Cancel) {
            return MessageResultTypes.Cancel;
        }
        else {
            if (this._acceptsResultTypes & MessageResultTypes.Ignore) {
                return MessageResultTypes.Ignore;
            }
            else {
                // Default to cancel so it is always shown
                return MessageResultTypes.Cancel;
            }
        }
        /* tslint:enable */
    };
    Message.prototype.GetOKButtonInfo = function () {
        if (this._defaultResultType !== this.GetCancelButtonInfo()) {
            return this._defaultResultType;
        }
        return MessageResultTypes.None;
    };
    Message.prototype.GetDialogTitle = function () {
        // Map the MessageType to the dialog title: Error/Warning
        /* tslint:disable:no-bitwise */
        if (this._activity === ActivityType.Initialize) {
            return ResourceStrings_1.ResourceStrings.messagebusPrefix;
        }
        else if (this._type & MessageType.Error) {
            return ResourceStrings_1.ResourceStrings.errorMessagePrefix;
        }
        else if (this._type & MessageType.Warning) {
            if (this._activity === ActivityType.Download) {
                return ResourceStrings_1.ResourceStrings.MidInstallDownloadWarningMessagePrefix;
            }
            else {
                return ResourceStrings_1.ResourceStrings.MidInstallInstallWarningMessagePrefix;
            }
        }
        /* tslint:enable:no-bitwise */
    };
    Message.prototype.IsMidInstallWithNoCancel = function () {
        /* tslint:disable:no-bitwise */
        return ((this._acceptsResultTypes & MessageResultTypes.Cancel) !== MessageResultTypes.Cancel) &&
            (((MessageResultTypes.Ignore | MessageResultTypes.Retry) & this._acceptsResultTypes) ===
                (MessageResultTypes.Ignore | MessageResultTypes.Retry));
        /* tslint:enable:no-bitwise */
    };
    Message.prototype.IsInstallStartingEvent = function () {
        return this._type === MessageType.StartAction && this._activity === ActivityType.Install;
    };
    Message.prototype.IsInstallFinishedEvent = function () {
        return this._type === MessageType.EndAction && this._activity === ActivityType.Install;
    };
    return Message;
}());
exports.Message = Message;
var MessageResult = /** @class */ (function () {
    function MessageResult(type, textValue) {
        if (textValue === void 0) { textValue = null; }
        requires.notNullOrUndefined(type, "type");
        this._type = type;
        this._textValue = textValue;
    }
    Object.defineProperty(MessageResult.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageResult.prototype, "textValue", {
        get: function () {
            return this._textValue;
        },
        enumerable: true,
        configurable: true
    });
    return MessageResult;
}());
exports.MessageResult = MessageResult;
var Settings = /** @class */ (function () {
    function Settings(keepDownloadedPayloads, noWeb, force) {
        this._keepDownloadedPayloads = keepDownloadedPayloads;
        this._noWeb = noWeb;
        this._force = force;
    }
    Object.defineProperty(Settings.prototype, "keepDownloadedPayloads", {
        get: function () {
            return this._keepDownloadedPayloads;
        },
        set: function (keepDownloadedPayloads) {
            this._keepDownloadedPayloads = keepDownloadedPayloads;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "noWeb", {
        get: function () {
            return this._noWeb;
        },
        set: function (noWeb) {
            this._noWeb = noWeb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "force", {
        get: function () {
            return this._force;
        },
        set: function (force) {
            this._force = force;
        },
        enumerable: true,
        configurable: true
    });
    return Settings;
}());
exports.Settings = Settings;
var ProgressInfo = /** @class */ (function () {
    function ProgressInfo(currentPackage, totalPackages, downloadedSize, totalSize, downloadSpeed) {
        this._currentPackage = currentPackage;
        this._totalPackages = totalPackages;
        this._downloadedSize = downloadedSize;
        this._totalSize = totalSize;
        this._downloadSpeed = downloadSpeed;
    }
    Object.defineProperty(ProgressInfo.prototype, "currentPackage", {
        get: function () {
            return this._currentPackage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressInfo.prototype, "totalPackages", {
        get: function () {
            return this._totalPackages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressInfo.prototype, "downloadedSize", {
        get: function () {
            return this._downloadedSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressInfo.prototype, "totalSize", {
        get: function () {
            return this._totalSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressInfo.prototype, "downloadSpeed", {
        get: function () {
            return this._downloadSpeed;
        },
        enumerable: true,
        configurable: true
    });
    return ProgressInfo;
}());
exports.ProgressInfo = ProgressInfo;
function isTypeOfInstalledProduct(product) {
    var installedProduct = product;
    // Objects of type IInstalledProductSummary should always have the
    // following fields defined.
    return installedProduct.installationId !== undefined &&
        installedProduct.installationPath !== undefined &&
        installedProduct.installState !== undefined &&
        installedProduct.isUpdateAvailable !== undefined &&
        installedProduct.latestVersion !== undefined;
}
exports.isTypeOfInstalledProduct = isTypeOfInstalledProduct;
function isTypeOfProductSummary(product) {
    var productSummary = product;
    // anything of type IProductSummary should always have the
    // following fields defined
    return productSummary.installable !== undefined;
}
exports.isTypeOfProductSummary = isTypeOfProductSummary;
function isTypeOfProduct(p) {
    // if it's not a product summary, it's not a product
    if (!isTypeOfProductSummary(p)) {
        return false;
    }
    var product = p;
    // anything of type IProduct should always have the following fields defined
    return product.defaultInstallDirectory !== undefined;
}
exports.isTypeOfProduct = isTypeOfProduct;
function isPreviewProduct(productSummary) {
    return isPreviewChannelId(productSummary.channel.id) ||
        isPreview3VS15ProductId(productSummary.id) ||
        isPreview4VS15Version(productSummary.version.build);
}
exports.isPreviewProduct = isPreviewProduct;
function isPreview4VS15Version(version) {
    var preview4Versions = ["15.0.25618.0", "15.0.25619.0"];
    return preview4Versions.some(function (previewVersion) { return previewVersion === version; });
}
function isPreview3VS15ProductId(productId) {
    var preview3ProductId = "Microsoft.VisualStudio.Product.LightweightInstaller";
    return productId.toLowerCase() === preview3ProductId.toLowerCase();
}
function isPreviewChannelId(channelId) {
    var previewChannelId = "Microsoft.VisualStudio.Channels.Preview";
    return channelId.toLowerCase() === previewChannelId.toLowerCase();
}
function hideRequiredComponents(requiredComponents) {
    if (!requiredComponents) {
        return;
    }
    requiredComponents.forEach(function (requiredComponent) {
        // If the component is visible, hide it and its required components
        if (requiredComponent.visible) {
            requiredComponent.visible = false;
            hideRequiredComponents(requiredComponent.requiredComponents);
        }
    });
}
//# sourceMappingURL=Product.js.map