/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("./Logger");
var requires = require("./requires");
var TelemetryEventNames_1 = require("../lib/Telemetry/TelemetryEventNames");
var bucket_parameters_1 = require("../lib/Telemetry/bucket-parameters");
var logger = Logger_1.getLogger();
function createDefaultUserData() {
    return {
        locale: "",
        // Default optin experiments if none are defined in the user.json
        optInExperiments: [],
        // Default optout experiments if none are defined in the user.json
        optOutExperiments: [],
        campaign: "",
    };
}
exports.createDefaultUserData = createDefaultUserData;
var UserDataStore = /** @class */ (function () {
    function UserDataStore(jsonFileStore, locale, telemetry) {
        requires.notNullOrUndefined(jsonFileStore, "jsonFileStore");
        this._jsonFileStore = jsonFileStore;
        this._telemetry = telemetry || null;
        if (this._jsonFileStore.exists()) {
            try {
                this._data = this._jsonFileStore.read();
            }
            catch (error) {
                logger.writeError("Failed to read '" + this._jsonFileStore.path + ".\n error: " + error.message + " at " + error.stack + "]");
            }
        }
        // Merge data with defaults. If this._data is undefined it
        // will just copy the values from defaultUserData.
        this._data = this.mergeWithDefaults(this._data, createDefaultUserData());
        this._data.locale = this._data.locale || locale;
        this.tryWriteUserData();
    }
    UserDataStore.prototype.storeLocale = function (locale) {
        this._data.locale = locale;
        this.tryWriteUserData();
    };
    UserDataStore.prototype.storeCampaign = function (campaignId) {
        this._data.campaign = campaignId;
        this.tryWriteUserData();
    };
    UserDataStore.prototype.storeTelemetrySessionId = function (sessionId) {
        this._data.previousSessionId = sessionId;
        this.tryWriteUserData();
    };
    UserDataStore.prototype.clearTelemetrySessionId = function () {
        delete this._data.previousSessionId;
        this.tryWriteUserData();
    };
    Object.defineProperty(UserDataStore.prototype, "locale", {
        get: function () {
            return this._data.locale.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserDataStore.prototype, "campaign", {
        get: function () {
            return this._data.campaign;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserDataStore.prototype, "debug", {
        get: function () {
            return !!this._data.debug;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserDataStore.prototype, "showDownlevelSkus", {
        get: function () {
            return !!this._data.showDownlevelSkus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserDataStore.prototype, "optInExperiments", {
        get: function () {
            return this._data.optInExperiments.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserDataStore.prototype, "optOutExperiments", {
        get: function () {
            return this._data.optOutExperiments.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserDataStore.prototype, "previousSessionId", {
        get: function () {
            return this._data.previousSessionId;
        },
        enumerable: true,
        configurable: true
    });
    UserDataStore.prototype.mergeWithDefaults = function (values, defaultValues) {
        if (!values) {
            values = {};
        }
        for (var key in defaultValues) {
            if (values[key] === null
                || values[key] === undefined
                || typeof values[key] !== typeof defaultValues[key]) {
                values[key] = defaultValues[key];
            }
        }
        return values;
    };
    UserDataStore.prototype.tryWriteUserData = function () {
        try {
            this._jsonFileStore.write(this._data);
            return true;
        }
        catch (error) {
            logger.writeError("Failed to write the user data to " + this._jsonFileStore.path + ". " +
                ("Error: " + error.message + " at " + error.stack));
            if (this._telemetry) {
                this._telemetry.postError(TelemetryEventNames_1.USER_DATA_WRITE_ERROR, "Failed to write the user data", new bucket_parameters_1.BucketParameters("tryWriteUserData", this.constructor.name), error);
            }
            return false;
        }
    };
    return UserDataStore;
}());
exports.UserDataStore = UserDataStore;
//# sourceMappingURL=LocalAppDataStore.js.map