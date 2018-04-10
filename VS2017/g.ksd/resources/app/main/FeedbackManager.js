/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var child_process_1 = require("child_process");
var path_1 = require("path");
var os_1 = require("os");
var util_1 = require("util");
var FileSystem_1 = require("../lib/FileSystem");
var CommandLine_1 = require("../lib/CommandLine");
var GenerateGuid_1 = require("../lib/GenerateGuid");
var Logger_1 = require("../lib/Logger");
var WindowManager_1 = require("./WindowManager");
var string_utilities_1 = require("../lib/string-utilities");
var TelemetryEventNames = require("../lib/Telemetry/TelemetryEventNames");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var requires = require("../lib/requires");
var bucket_parameters_1 = require("../lib/Telemetry/bucket-parameters");
var METADATA_DIRECTORY = electron_1.app.getPath("temp");
var USER_TYPE_EXTERNAL = "External";
var USER_TYPE_INTERNAL = "MSFT";
exports.FEEDBACK_CLIENT_COMMAND = CommandLine_1.CommandNames.reportaproblem;
exports.FEEDBACK_CLIENT_CONFIG = "--config=%s";
var FeedbackManager = /** @class */ (function () {
    /**
     * Initializes a new instance of the FeedbackManager class.
     */
    function FeedbackManager(identityProvider, telemetry, installedProductLogProvider, logger, exeName, exeVersion, branch, culture, uiCulture) {
        requires.notNullOrUndefined(identityProvider, "identityProvider");
        requires.notNullOrUndefined(telemetry, "telemetry");
        requires.notNullOrUndefined(logger, "logger");
        this._exeName = exeName;
        this._exeVersion = exeVersion;
        this._os = os_1.release();
        this._culture = culture;
        this._uiCulture = uiCulture;
        this._branch = branch;
        this._sessionId = identityProvider.sessionId;
        this._userId = identityProvider.userId;
        this._machineId = identityProvider.machineId;
        this._isMicrosoftInternal = identityProvider.isMicrosoftInternal;
        this._userAlias = identityProvider.userAlias;
        this._channels = new Set();
        if (this._branch == null) {
            this._branch = "";
        }
        this._telemetry = telemetry;
        this._installedProductLogProvider = installedProductLogProvider;
        this._logger = logger;
    }
    FeedbackManager.prototype.openFeedbackClient = function (timeout, filesToUpload, tags, initialSearchText, initialReproText) {
        var _this = this;
        if (tags === void 0) { tags = []; }
        return new Promise(function (resolve, reject) {
            var properties = _this.getTelemetryProperties();
            var operation = _this._telemetry.startUserTask(TelemetryEventNames.OPEN_VS_FEEDBACK, properties);
            filesToUpload = filesToUpload || [];
            tags = tags || [];
            _this.getProductLogs(filesToUpload, tags).finally(function () {
                var process = _this.spawnFeedbackProcess(filesToUpload, tags, initialSearchText, initialReproText);
                var endProperties = {
                    filesToUpload: filesToUpload.join(","),
                };
                // Reset the channelIds after every opening of the feedback client.
                _this.resetChannelIds();
                process.on("error", function (error) {
                    var message = "Failed to open Feedback client. " + error.message;
                    _this._logger.writeError(message);
                    var errorEvent = _this._telemetry.postError(TelemetryEventNames.OPEN_VS_FEEDBACK_ERROR, "The VS Feedback process exited with an error", new bucket_parameters_1.BucketParameters("openFeedbackClient", _this.constructor.name), error);
                    if (!operation.isEnded) {
                        operation.correlate(errorEvent);
                        operation.end(vs_telemetry_api_1.TelemetryResult.Failure, endProperties);
                    }
                    reject(error);
                });
                // Wait to see if spawn failed or not before continuing.
                setTimeout(function () {
                    // Only end the operation if we did not end with failure.
                    if (!operation.isEnded) {
                        operation.end(vs_telemetry_api_1.TelemetryResult.Success, endProperties);
                    }
                    resolve();
                }, timeout);
            });
        });
    };
    Object.defineProperty(FeedbackManager.prototype, "currentConfigPath", {
        get: function () {
            return this._currentConfigPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "exeName", {
        get: function () {
            return this._exeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "exeVersion", {
        get: function () {
            return this._exeVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "branchName", {
        get: function () {
            return this._branch || "unknown";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "os", {
        get: function () {
            return this._os;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "culture", {
        get: function () {
            return this._culture;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "uiCulture", {
        get: function () {
            return this._uiCulture;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "sessionId", {
        get: function () {
            return this._sessionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "machineId", {
        get: function () {
            return this._machineId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "metaDataFileName", {
        get: function () {
            return "dd_feedback_metadata_" + Logger_1.getLogFileDateTime() + ".log";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "metaDataFilePath", {
        get: function () {
            return path_1.join(METADATA_DIRECTORY, this.metaDataFileName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "isMicrosoftInternal", {
        get: function () {
            return this._isMicrosoftInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "userAlias", {
        get: function () {
            return this._userAlias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeedbackManager.prototype, "channelIds", {
        get: function () {
            return Array.from(this._channels.values());
        },
        enumerable: true,
        configurable: true
    });
    FeedbackManager.prototype.addChannelIds = function (channelIds) {
        var _this = this;
        if (channelIds) {
            channelIds.forEach(function (channelId) { return _this._channels.add(channelId); });
        }
    };
    FeedbackManager.prototype.createFeedbackMetaData = function (feedbackSessionId, filesToUpload, tags, initialSearchText, initialReproText) {
        var filepath = this.metaDataFilePath;
        var userType = this.isMicrosoftInternal ? USER_TYPE_INTERNAL : USER_TYPE_EXTERNAL;
        var windowScreenshotPath = WindowManager_1.getWindowScreenshot();
        var channelIds = this.channelIds.join(",");
        var template = {
            "culture": this.culture,
            "sentiment": 0,
            "source": "Send a smile",
            "text": "",
            "title": "",
            "uiculture": this.uiCulture,
            "user": this.userAlias,
            "userType": userType,
            "version": 1,
            "tags": [
                {
                    "type": "user-id",
                    "value": this.userId
                },
                {
                    "type": "product-build-branch",
                    "value": this.branchName
                },
                {
                    "type": "os-version",
                    "value": this.os
                },
                {
                    "type": "machine-id",
                    "value": this.machineId
                },
                {
                    "type": "product",
                    "value": this.exeName
                },
                {
                    "type": "product-version",
                    "value": this.exeVersion
                },
                {
                    "type": "feedback-session-id",
                    "value": feedbackSessionId
                },
                {
                    "type": "session-id",
                    "value": this.sessionId
                },
                {
                    "type": "product-build",
                    "value": this.exeName + "." + this.exeVersion
                },
                {
                    "type": "setup-branch-version",
                    "value": this.exeName + "/" + this.branchName + "/" + this.exeVersion
                },
                {
                    "type": "product-channels",
                    "value": channelIds
                },
            ]
        };
        if (tags) {
            // Add the passed in tags to our tag array, only if the tag does not already exist.
            tags.forEach(function (tag) {
                var tagExists = template.tags.some(function (existingTag) {
                    return string_utilities_1.caseInsensitiveAreEqual(existingTag.type, tag.type);
                });
                if (!tagExists) {
                    template.tags.push(tag);
                }
            });
        }
        var metaData = JSON.stringify({
            "dataOptIn": true,
            "isInternal": this._isMicrosoftInternal,
            "isRecordingDisabled": true,
            "feedbackSessionId": feedbackSessionId,
            "launcherPath": electron_1.app.getPath("exe"),
            "screenshotPath": windowScreenshotPath,
            "screenshotThumbPath": "",
            "filesToUpload": filesToUpload || [],
            "template": template,
            "initialSearchText": initialSearchText,
            "initialReproText": initialReproText
        });
        FileSystem_1.appendTextSync(filepath, metaData);
        return filepath;
    };
    FeedbackManager.prototype.getTelemetryProperties = function () {
        return {
            exeName: this.exeName,
            exeVersion: this.exeVersion,
            os: this.os,
            culture: this.culture,
            uiCulture: this.uiCulture,
            sessionId: this.sessionId,
            isMicrosoftInternal: this.isMicrosoftInternal.toString(),
            channelIds: this.channelIds.join(","),
        };
    };
    FeedbackManager.prototype.getProductLogs = function (filesToUpload, tags) {
        var _this = this;
        requires.notNullOrUndefined(filesToUpload, "filesToUpload");
        requires.notNullOrUndefined(tags, "tags");
        if (this._installedProductLogProvider) {
            return this._installedProductLogProvider.getInstalledProductLogs().then(function (logs) {
                if (logs && logs.length > 0) {
                    tags.push({
                        type: "severity",
                        value: "setup-blocking",
                    });
                    filesToUpload.push.apply(filesToUpload, logs);
                }
            })
                .catch(function (error) {
                _this._logger.writeError("Failed to get installed product logs. " +
                    ("[error: " + error.message + " at " + error.stack + "]"));
            });
        }
        return Promise.resolve();
    };
    FeedbackManager.prototype.spawnFeedbackProcess = function (filesToUpload, tags, initialSearchText, initialReproText) {
        var feedbackId = GenerateGuid_1.GenerateGuid();
        var filepath = this.createFeedbackMetaData(feedbackId, filesToUpload, tags, initialSearchText, initialReproText);
        this._currentConfigPath = util_1.format(exports.FEEDBACK_CLIENT_CONFIG, filepath);
        var electronPath = process.execPath;
        var args = [
            electron_1.app.getAppPath(),
            exports.FEEDBACK_CLIENT_COMMAND,
            this._currentConfigPath,
        ];
        var childProcess = child_process_1.spawn(electronPath, args, {
            detached: true,
            stdio: "ignore"
        });
        childProcess.unref();
        return childProcess;
    };
    FeedbackManager.prototype.resetChannelIds = function () {
        this._channels.clear();
    };
    return FeedbackManager;
}());
/**
 * Create a new FeedbackManager.
 */
function createFeedbackManagerWithIdentityProvider(identityProvider, telemetry, installedProductLogProvider, logger, exeName, exeVersion, branch, culture, uiCulture) {
    return new FeedbackManager(identityProvider, telemetry, installedProductLogProvider, logger, exeName, exeVersion, branch, culture, uiCulture);
}
exports.createFeedbackManagerWithIdentityProvider = createFeedbackManagerWithIdentityProvider;
//# sourceMappingURL=FeedbackManager.js.map