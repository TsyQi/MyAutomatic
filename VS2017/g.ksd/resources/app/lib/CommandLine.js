/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
var CommandNames = /** @class */ (function () {
    function CommandNames() {
    }
    Object.defineProperty(CommandNames, "install", {
        get: function () { return "install"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandNames, "modify", {
        get: function () { return "modify"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandNames, "update", {
        get: function () { return "update"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandNames, "repair", {
        get: function () { return "repair"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandNames, "resume", {
        get: function () { return "resume"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandNames, "uninstall", {
        get: function () { return "uninstall"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandNames, "reportaproblem", {
        get: function () { return "reportaproblem"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandNames, "collectdiagnostics", {
        get: function () { return "collectdiagnostics"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandNames, "propertyName", {
        /**
         * Returns the property name in which the command is saved in the yargs.Argv object
         */
        get: function () { return "command"; },
        enumerable: true,
        configurable: true
    });
    return CommandNames;
}());
exports.CommandNames = CommandNames;
var OptionNames = /** @class */ (function () {
    function OptionNames() {
    }
    Object.defineProperty(OptionNames, "installPath", {
        get: function () { return "installPath"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "productId", {
        get: function () { return "productId"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "noWeb", {
        get: function () { return "noWeb"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "force", {
        get: function () { return "force"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "updateFromVS", {
        get: function () { return "updateFromVS"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "channelId", {
        get: function () { return "channelId"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "channelUri", {
        get: function () { return "channelUri"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "installChannelUri", {
        get: function () { return "installChannelUri"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "installCatalogUri", {
        get: function () { return "installCatalogUri"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "layoutPath", {
        get: function () { return "layoutPath"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "add", {
        get: function () { return "add"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "remove", {
        get: function () { return "remove"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "campaign", {
        get: function () { return "campaign"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "activityId", {
        get: function () { return "activityId"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "responseFile", {
        get: function () { return "in"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "version", {
        get: function () { return "version"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "passive", {
        get: function () { return "passive"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "quiet", {
        get: function () { return "quiet"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "noRestart", {
        get: function () { return "norestart"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "locale", {
        get: function () { return "locale"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "focusedUi", {
        get: function () { return "focusedUi"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "installSessionId", {
        get: function () { return "installSessionId"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "runOnce", {
        get: function () { return "runOnce"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "all", {
        get: function () { return "all"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "allWorkloads", {
        get: function () { return "allWorkloads"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "includeRecommended", {
        get: function () { return "includeRecommended"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "includeOptional", {
        get: function () { return "includeOptional"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "addProductLang", {
        get: function () { return "addProductLang"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "removeProductLang", {
        get: function () { return "removeProductLang"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "nickname", {
        get: function () { return "nickname"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "noUpdateInstaller", {
        get: function () { return "noUpdateInstaller"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "productKey", {
        get: function () { return "productKey"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "pipe", {
        get: function () { return "pipe"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "cache", {
        get: function () { return "cache"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "nocache", {
        get: function () { return "nocache"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "vsix", {
        /**
         * Accept uris for vsixs to install. They should be removable with --remove.
         */
        get: function () { return "vsix"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "flight", {
        /**
         * --flight "flight1;7d" should enable "flight1" for 7 days after successful install.
         */
        get: function () { return "flight"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "installerFlight", {
        /**
         * --installerFlight "flight1;7d" similar to --flight, but it is seeded before install.
         */
        get: function () { return "installerFlight"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "comment", {
        // a "virtual" option name that is allowed only as a property in a response file
        get: function () { return "comment"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionNames, "testMode", {
        // used for testing
        get: function () { return "test"; },
        enumerable: true,
        configurable: true
    });
    return OptionNames;
}());
exports.OptionNames = OptionNames;
var OptionAliases = /** @class */ (function () {
    function OptionAliases() {
    }
    Object.defineProperty(OptionAliases, "version", {
        get: function () { return "v"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionAliases, "passive", {
        get: function () { return "p"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionAliases, "quiet", {
        get: function () { return "q"; },
        enumerable: true,
        configurable: true
    });
    return OptionAliases;
}());
exports.OptionAliases = OptionAliases;
//# sourceMappingURL=CommandLine.js.map