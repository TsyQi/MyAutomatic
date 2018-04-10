/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flight_info_1 = require("../../lib/command-line/flight-info");
var vsix_reference_1 = require("../../lib/Installer/vsix-reference");
var flightInfoFactory = flight_info_1.FlightInfoFromArgVFactory.getInstance();
/* istanbul ignore next */
var CommandLineArgs = /** @class */ (function () {
    function CommandLineArgs(queryStringParts) {
        this._command = queryStringParts.command;
        this._installPath = queryStringParts.installPath;
        this._productId = queryStringParts.productId;
        this._channelId = queryStringParts.channelId;
        this._channelUri = queryStringParts.channelUri;
        this._installChannelUri = queryStringParts.installChannelUri;
        this._installCatalogUri = queryStringParts.installCatalogUri;
        this._layoutPath = queryStringParts.layoutPath;
        this._campaign = queryStringParts.campaign;
        this._activityId = queryStringParts.activityId;
        this._responseFile = queryStringParts.responseFile;
        this._locale = queryStringParts.locale;
        this._nickname = queryStringParts.nickname;
        this._productKey = queryStringParts.productKey;
        this._passive = CommandLineArgs.boolify(queryStringParts.passive);
        this._quiet = CommandLineArgs.boolify(queryStringParts.quiet);
        this._noRestart = CommandLineArgs.boolify(queryStringParts.norestart);
        this._focusedUi = CommandLineArgs.boolify(queryStringParts.focusedUi);
        this._debug = CommandLineArgs.boolify(queryStringParts.debug);
        this._all = CommandLineArgs.boolify(queryStringParts.all);
        this._allWorkloads = CommandLineArgs.boolify(queryStringParts.allWorkloads);
        this._includeRecommended = CommandLineArgs.boolify(queryStringParts.includeRecommended);
        this._includeOptional = CommandLineArgs.boolify(queryStringParts.includeOptional);
        this._noUpdateInstaller = CommandLineArgs.boolify(queryStringParts.noUpdateInstaller);
        this._cache = CommandLineArgs.boolify(queryStringParts.cache);
        this._nocache = CommandLineArgs.boolify(queryStringParts.nocache);
        this._noweb = CommandLineArgs.boolify(queryStringParts.noweb);
        this._testMode = CommandLineArgs.boolify(queryStringParts.testMode);
        this._force = CommandLineArgs.boolify(queryStringParts.force);
        this._idsToAdd = CommandLineArgs.ensureArray(queryStringParts.add);
        this._idsToRemove = CommandLineArgs.ensureArray(queryStringParts.remove);
        this._languagesToAdd = CommandLineArgs.ensureArray(queryStringParts.addProductLang);
        this._languagesToRemove = CommandLineArgs.ensureArray(queryStringParts.removeProductLang);
        this._vsixs = vsix_reference_1.VsixReference.create(CommandLineArgs.ensureArray(queryStringParts.vsix));
        this._flightInfo = flightInfoFactory.create(CommandLineArgs.ensureArray(queryStringParts.flight));
    }
    CommandLineArgs.ensureArray = function (value) {
        if (value === undefined) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        return [value.toString()];
    };
    // Converts the input value to a boolean
    CommandLineArgs.boolify = function (value) {
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        }
        return !!value;
    };
    Object.defineProperty(CommandLineArgs.prototype, "command", {
        get: function () {
            return this._command;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "installPath", {
        get: function () {
            return this._installPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "productId", {
        get: function () {
            return this._productId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "channelId", {
        get: function () {
            return this._channelId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "channelUri", {
        get: function () {
            return this._channelUri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "installChannelUri", {
        get: function () {
            return this._installChannelUri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "installCatalogUri", {
        get: function () {
            return this._installCatalogUri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "layoutPath", {
        get: function () {
            return this._layoutPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "idsToAdd", {
        get: function () {
            return this._idsToAdd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "idsToRemove", {
        get: function () {
            return this._idsToRemove;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "languagesToAdd", {
        get: function () {
            return this._languagesToAdd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "languagesToRemove", {
        get: function () {
            return this._languagesToRemove;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "vsixs", {
        get: function () {
            return this._vsixs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "campaign", {
        get: function () {
            return this._campaign;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "activityId", {
        get: function () {
            return this._activityId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "responseFile", {
        get: function () {
            return this._responseFile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "nickname", {
        get: function () {
            return this._nickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "productKey", {
        get: function () {
            return this._productKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "passive", {
        get: function () {
            return this._passive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "quiet", {
        get: function () {
            return this._quiet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "noRestart", {
        get: function () {
            return this._noRestart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "focusedUi", {
        get: function () {
            return this._focusedUi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "debug", {
        get: function () {
            return this._debug;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "all", {
        get: function () {
            return this._all;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "allWorkloads", {
        get: function () {
            return this._allWorkloads;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "includeRecommended", {
        get: function () {
            return this._includeRecommended;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "includeOptional", {
        get: function () {
            return this._includeOptional;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "noUpdateInstaller", {
        get: function () {
            return this._noUpdateInstaller;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "cache", {
        get: function () {
            return this._cache;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "nocache", {
        get: function () {
            return this._nocache;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "noweb", {
        get: function () {
            return this._noweb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "testMode", {
        get: function () {
            return this._testMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "force", {
        get: function () {
            return this._force;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandLineArgs.prototype, "flights", {
        get: function () {
            return this._flightInfo;
        },
        enumerable: true,
        configurable: true
    });
    return CommandLineArgs;
}());
exports.CommandLineArgs = CommandLineArgs;
//# sourceMappingURL=command-line-args.js.map