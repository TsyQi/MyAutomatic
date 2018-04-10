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
         * Gets all product summaries.
         */
        get: function () {
            return this._installedProductSummaryResults.map(function (result) { return result.productSummary; });
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
    return Icon;
}());
exports.Icon = Icon;
var LanguageOption = /** @class */ (function () {
    function LanguageOption(localeCode, isInstalled, isSelected) {
        this._localeCode = localeCode;
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
    return LanguageOption;
}());
exports.LanguageOption = LanguageOption;
var ComponentDependency = /** @class */ (function () {
    function ComponentDependency(id, type) {
        requires.stringNotEmpty(id, "id");
        requires.notNullOrUndefined(type, "type");
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
    function Component(id, name, description, longDescription, category, version, license, installState, selectedState, componentDependencies, installable, isUiGroup) {
        requires.stringNotEmpty(id, "id");
        requires.notNullOrUndefined(name, "name");
        requires.notNullOrUndefined(description, "description");
        requires.notNullOrUndefined(longDescription, "longDescription");
        requires.notNullOrUndefined(category, "category");
        requires.notNullOrUndefined(version, "version");
        requires.notNullOrUndefined(license, "license");
        requires.notNullOrUndefined(installState, "installState");
        requires.notNullOrUndefined(componentDependencies, "componentDependencies");
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
        this._installable = installable;
        this._isUiGroup = isUiGroup;
    }
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
    Object.defineProperty(Component.prototype, "componentDependencies", {
        get: function () {
            return this._componentDependencies;
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
    return Component;
}());
exports.Component = Component;
var Workload = /** @class */ (function () {
    function Workload(id, name, description, longDescription, category, version, required, installState, selectedState, componentDependencies, installable, icon) {
        requires.stringNotEmpty(id, "id");
        requires.stringNotEmpty(name, "name");
        requires.stringNotEmpty(description, "description");
        requires.notNullOrUndefined(longDescription, "longDescription");
        requires.notNullOrUndefined(category, "category");
        requires.notNullOrUndefined(version, "version");
        requires.notNullOrUndefined(installState, "installState");
        requires.notNullOrUndefined(componentDependencies, "componentDependencies");
        requires.notNullOrUndefined(installable, "installable");
        requires.notNullOrUndefined(icon, "icon");
        this._id = id;
        this._name = name;
        this._description = description;
        this._longDescription = longDescription;
        this._category = category;
        this._version = version;
        this._required = required;
        this._installState = installState;
        this._selectedState = selectedState;
        this._componentDependencies = componentDependencies;
        this._installable = installable;
        this._icon = icon;
    }
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
        if (display === void 0) { display = null; }
        if (semantic === void 0) { semantic = null; }
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
    return VersionBundle;
}());
exports.VersionBundle = VersionBundle;
var ProductSummaryBase = /** @class */ (function () {
    function ProductSummaryBase(id, channel, name, description, longDescription, version, icon, hidden, releaseNotes) {
        requires.stringNotEmpty(id, "id");
        requires.notNullOrUndefined(channel, "channel");
        requires.stringNotEmpty(name, "name");
        requires.stringNotEmpty(description, "description");
        requires.notNullOrUndefined(longDescription, "longDescription");
        requires.notNullOrUndefined(version, "version");
        requires.notNullOrUndefined(icon, "icon");
        requires.notNullOrUndefined(hidden, "hidden");
        requires.notNullOrUndefined(releaseNotes, "releaseNotes");
        this._id = id;
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
    return ProductSummaryBase;
}());
exports.ProductSummaryBase = ProductSummaryBase;
var ProductSummary = /** @class */ (function (_super) {
    __extends(ProductSummary, _super);
    function ProductSummary(id, channel, name, description, longDescription, version, installable, icon, hidden, license, releaseNotes) {
        var _this = _super.call(this, id, channel, name, description, longDescription, version, icon, hidden, releaseNotes) || this;
        requires.notNullOrUndefined(installable, "installable");
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
    return ProductSummary;
}(ProductSummaryBase));
exports.ProductSummary = ProductSummary;
var InstalledProductSummary = /** @class */ (function (_super) {
    __extends(InstalledProductSummary, _super);
    function InstalledProductSummary(id, channel, name, description, longDescription, version, installationId, installationPath, nickname, installState, isUpdateAvailable, latestVersion, icon, hidden, hasPendingReboot, errorDetails, releaseNotes) {
        var _this = _super.call(this, id, channel, name, description, longDescription, version, icon, hidden, releaseNotes) || this;
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
    Object.defineProperty(InstalledProductSummary.prototype, "errorDetails", {
        get: function () {
            return this._errorDetails;
        },
        enumerable: true,
        configurable: true
    });
    return InstalledProductSummary;
}(ProductSummaryBase));
exports.InstalledProductSummary = InstalledProductSummary;
var ProductBase = /** @class */ (function (_super) {
    __extends(ProductBase, _super);
    function ProductBase(id, channel, name, description, longDescription, version, componentDependencies, components, workloads, icon, installSize, languageOptions, hidden, releaseNotes, license, thirdPartyNotices, recommendSelection) {
        var _this = _super.call(this, id, channel, name, description, longDescription, version, icon, hidden, releaseNotes) || this;
        requires.notNullOrUndefined(components, "components");
        requires.notNullOrUndefined(workloads, "workloads");
        requires.notNullOrUndefined(componentDependencies, "componentDependencies");
        requires.notNullOrUndefined(installSize, "installSize");
        requires.notNullOrUndefined(languageOptions, "languageOptions");
        _this._workloads = workloads;
        _this._componentDependencies = componentDependencies;
        _this._components = components;
        _this._installSize = installSize;
        _this._languageOptions = languageOptions;
        _this._license = license || null;
        _this._thirdPartyNotices = thirdPartyNotices || null;
        _this._recommendSelection = recommendSelection;
        return _this;
    }
    Object.defineProperty(ProductBase.prototype, "workloads", {
        get: function () {
            return this._workloads;
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
    Object.defineProperty(ProductBase.prototype, "components", {
        get: function () {
            return this._components;
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
    Object.defineProperty(ProductBase.prototype, "languageOptions", {
        get: function () {
            return this._languageOptions;
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
    return ProductBase;
}(ProductSummaryBase));
exports.ProductBase = ProductBase;
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product(id, channel, name, description, longDescription, version, componentDependencies, components, workloads, defaultInstallationPath, installable, icon, installSize, languageOptions, hidden, license, releaseNotes, thirdPartyNotices, recommendSelection) {
        var _this = _super.call(this, id, channel, name, description, longDescription, version, componentDependencies, components, workloads, icon, installSize, languageOptions, hidden, releaseNotes, license, thirdPartyNotices, recommendSelection) || this;
        requires.notNullOrUndefined(defaultInstallationPath, "defaultInstallationPath");
        requires.notNullOrUndefined(installable, "installable");
        _this._defaultInstallationPath = defaultInstallationPath;
        _this._installable = installable;
        return _this;
    }
    Object.defineProperty(Product.prototype, "defaultInstallationPath", {
        get: function () {
            return this._defaultInstallationPath;
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
    return Product;
}(ProductBase));
exports.Product = Product;
var InstalledProduct = /** @class */ (function (_super) {
    __extends(InstalledProduct, _super);
    function InstalledProduct(id, channel, name, description, longDescription, version, componentDependencies, components, workloads, installationId, installationPath, nickname, installState, isUpdateAvailable, latestVersion, icon, installSize, languageOptions, hidden, hasPendingReboot, errorDetails, hasUpdatePackages, releaseNotes, license, thirdPartyNotices, recommendSelection) {
        var _this = _super.call(this, id, channel, name, description, longDescription, version, componentDependencies, components, workloads, icon, installSize, languageOptions, hidden, releaseNotes, license, thirdPartyNotices, recommendSelection) || this;
        requires.stringNotEmpty(installationPath, "installationPath");
        requires.notNullOrUndefined(installState, "installState");
        requires.notNullOrUndefined(isUpdateAvailable, "isUpdateAvailable");
        requires.notNullOrUndefined(latestVersion, "latestVersion");
        requires.notNullOrUndefined(hasPendingReboot, "hasPendingReboot");
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
    Object.defineProperty(InstalledProduct.prototype, "hasPendingReboot", {
        get: function () {
            return this._hasPendingReboot;
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
    Object.defineProperty(InstalledProduct.prototype, "hasUpdatePackages", {
        get: function () {
            return this._hasUpdatePackages;
        },
        enumerable: true,
        configurable: true
    });
    return InstalledProduct;
}(ProductBase));
exports.InstalledProduct = InstalledProduct;
var ModifyParametersEvaluation = /** @class */ (function () {
    function ModifyParametersEvaluation(systemDriveEvaluation, targetDriveEvaluation, sharedDriveEvaluation) {
        this._systemDriveEvaluation = systemDriveEvaluation;
        this._targetDriveEvaluation = targetDriveEvaluation;
        this._sharedDriveEvaluation = sharedDriveEvaluation;
    }
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
    return InstallParametersEvaluation;
}(ModifyParametersEvaluation));
exports.InstallParametersEvaluation = InstallParametersEvaluation;
var SelectedPackageReference = /** @class */ (function () {
    function SelectedPackageReference(packageId, selectedState) {
        requires.stringNotEmpty(packageId, "packageId");
        requires.notNullOrUndefined(selectedState, "selectedState");
        this._packageId = packageId;
        this._selectedState = selectedState;
    }
    Object.defineProperty(SelectedPackageReference.prototype, "packageId", {
        get: function () {
            return this._packageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectedPackageReference.prototype, "selectedState", {
        get: function () {
            return this._selectedState;
        },
        enumerable: true,
        configurable: true
    });
    return SelectedPackageReference;
}());
exports.SelectedPackageReference = SelectedPackageReference;
var Message = /** @class */ (function () {
    function Message(type, acceptsResultTypes, defaultResultType, localizedString, logString, activity) {
        requires.notNullOrUndefined(type, "type");
        requires.notNullOrUndefined(acceptsResultTypes, "acceptsResultTypes");
        requires.notNullOrUndefined(acceptsResultTypes, "defaultResultType");
        requires.stringNotEmpty(localizedString, "localizedString");
        requires.stringNotEmpty(logString, "logString");
        requires.stringNotEmpty(logString, "activity");
        this._type = type;
        this._acceptsResultTypes = acceptsResultTypes;
        this._defaultResultType = defaultResultType;
        this._localizedString = localizedString;
        this._logString = logString;
        this._activity = activity;
    }
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
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "noWeb", {
        get: function () {
            return this._noWeb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "force", {
        get: function () {
            return this._force;
        },
        enumerable: true,
        configurable: true
    });
    return Settings;
}());
exports.Settings = Settings;
var ProgressInfo = /** @class */ (function () {
    function ProgressInfo(currentPackage, totalPackages, downloadedSize, totalSize, downloadSpeed) {
        requires.notNullOrUndefined(currentPackage, "currentPackage");
        requires.notNullOrUndefined(totalPackages, "totalPackages");
        requires.notNullOrUndefined(downloadedSize, "downloadedSize");
        requires.notNullOrUndefined(totalSize, "totalSize");
        requires.notNullOrUndefined(downloadSpeed, "downloadSpeed");
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
//# sourceMappingURL=Product.js.map