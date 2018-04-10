/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vs_telemetry_api_1 = require("vs-telemetry-api");
var telemetry_scope_aggregator_1 = require("../scopes/telemetry-scope-aggregator");
var telemetry_scope_1 = require("../scopes/telemetry-scope");
var BRANCH_PROPERTY_NAME = "applicationBranchName";
var UNIQUE_EVENT_ID = "VSTelemetryListenerEvent";
var APP_START_OPT_OUT_EVENT_NAME = "app-start-opted-out";
// The version of VS to use when checking the registry opted in value.
// This version of VS controls whether we are sending opted in telemetry or not.
var VS_VERSION = "15.0";
var VSTelemetryListener = /** @class */ (function () {
    function VSTelemetryListener(telemetry, telemetryProcessor, appInfo) {
        this._telemetryProcessor = telemetryProcessor;
        this.appInfo = appInfo;
        this._openOperations = [];
        this._openUserTasks = [];
        this._telemetry = telemetry;
        this._telemetry.useVsIsOptedIn(VS_VERSION);
        // Set common properties for all events
        // These are not sent with opt-out data
        this.setCommonProperty(BRANCH_PROPERTY_NAME, appInfo.branchName);
        this._telemetry.start();
        this.sendOptOutEvent();
    }
    Object.defineProperty(VSTelemetryListener.prototype, "id", {
        get: function () {
            return UNIQUE_EVENT_ID;
        },
        enumerable: true,
        configurable: true
    });
    VSTelemetryListener.prototype.serializedSession = function () {
        return this._telemetry.serializeSettings();
    };
    VSTelemetryListener.prototype.finalizeOperationsAndSendPendingData = function (properties) {
        if (properties === void 0) { properties = {}; }
        this._openOperations.forEach(function (operation) {
            if (operation.isEnded === false) {
                operation.end(vs_telemetry_api_1.TelemetryResult.None, properties);
            }
        });
        this._openUserTasks.forEach(function (usertask) {
            if (usertask.isEnded === false) {
                usertask.end(vs_telemetry_api_1.TelemetryResult.None, properties);
            }
        });
        this._openOperations = [];
        this._openUserTasks = [];
        return this.sendPendingData();
    };
    VSTelemetryListener.prototype.sendPendingData = function () {
        return this._telemetry.dispose();
    };
    VSTelemetryListener.prototype.postAsset = function (name, assetId, assetVersion, properties, severity) {
        properties = this.addPropertiesPrefixToKeys(properties);
        var assetEvent = {
            id: this.id,
            event: new vs_telemetry_api_1.AssetEvent(this._telemetryProcessor.getEventName(name), assetId, assetVersion, properties, severity),
        };
        this.postEventImpl(assetEvent.event);
        return [assetEvent];
    };
    VSTelemetryListener.prototype.postError = function (name, description, bucketParameters, error, properties, severity) {
        properties = this.addPropertiesPrefixToKeys(properties);
        var eventName = this._telemetryProcessor.getEventName(name);
        // Add the error bucket properties to the event.
        // See bug 503216
        // Bucketing parameter 1 is the app name
        properties[VSTelemetryListener.bucketParamPrefix + "1"] = this.appInfo.appName;
        // Bucketing parameter 2 is the app version
        properties[VSTelemetryListener.bucketParamPrefix + "2"] = this.appInfo.appVersion;
        // Bucketing parameter 3 is the event name with '/' replaced by '.'
        var forwardSlashRegex = /\//g;
        properties[VSTelemetryListener.bucketParamPrefix + "3"] = eventName.replace(forwardSlashRegex, ".");
        // Bucketing parameter 4 is the exception type
        properties[VSTelemetryListener.bucketParamPrefix + "4"] =
            bucketParameters.errorType ||
                (error && error.name) ||
                "";
        // Bucketing parameter 5 is the module name
        properties[VSTelemetryListener.bucketParamPrefix + "5"] = bucketParameters.moduleName;
        // Bucketing parameter 6 is the method name
        properties[VSTelemetryListener.bucketParamPrefix + "6"] = bucketParameters.methodName;
        // Bucketing parameters 7 and 8 are intentionally left blank
        properties[VSTelemetryListener.bucketParamPrefix + "7"] = "";
        properties[VSTelemetryListener.bucketParamPrefix + "8"] = "";
        var faultEvent = {
            id: this.id,
            event: new vs_telemetry_api_1.FaultEvent(eventName, description, error, properties, severity),
        };
        this.postEventImpl(faultEvent.event);
        return [faultEvent];
    };
    /**
     * Starts a telemetry operation
     *
     * @input name: string - name of the operation
     * @input properties = <IEventProperties>{} - optional properties of the operation
     *
     * @return TelemetryScope<OperationEvent> - TelemetryScope of the startOperation
     */
    VSTelemetryListener.prototype.startOperation = function (opName, properties) {
        if (properties === void 0) { properties = {}; }
        this.cleanFinishedOperations();
        properties = this.addPropertiesPrefixToKeys(properties);
        var telemetryScope = this.startOperationImpl(this._telemetryProcessor.getEventName(opName), properties);
        var scope = new telemetry_scope_1.Scope(this.id, telemetryScope, this._telemetryProcessor);
        var scopeWrapper = new telemetry_scope_aggregator_1.TelemetryScopeAggregator([scope]);
        this._openOperations.push(scopeWrapper);
        return scopeWrapper;
    };
    VSTelemetryListener.prototype.startUserTask = function (opName, properties) {
        if (properties === void 0) { properties = {}; }
        this.cleanFinishedOperations();
        properties = this.addPropertiesPrefixToKeys(properties);
        var telemetryScope = this.startUserTaskImpl(this._telemetryProcessor.getEventName(opName), properties);
        var scope = new telemetry_scope_1.Scope(this.id, telemetryScope, this._telemetryProcessor);
        var scopeWrapper = new telemetry_scope_aggregator_1.TelemetryScopeAggregator([scope]);
        this._openUserTasks.push(scopeWrapper);
        return scopeWrapper;
    };
    /**
     * Sends a telemetry operation
     *
     * @input name: string - name of the operation
     * @input result: TelemetryResult - result of the operation
     * @input resultSummary: string - short description of the result
     * @input properties = <IEventProperties>{} - optional properties of the operation
     * @input severity = TelemetrySeverity - event severity
     */
    VSTelemetryListener.prototype.postOperation = function (opName, result, resultSummary, properties, severity, assetsToCorrelate) {
        if (properties === void 0) { properties = {}; }
        properties = this.addPropertiesPrefixToKeys(properties);
        var operationEvent = {
            id: this.id,
            event: new vs_telemetry_api_1.OperationEvent(this._telemetryProcessor.getEventName(opName), result, resultSummary, properties, severity),
        };
        if (assetsToCorrelate) {
            assetsToCorrelate.forEach(function (event) {
                operationEvent.event.correlate(event.event.correlation);
            });
        }
        this.postEventImpl(operationEvent.event);
        return [operationEvent];
    };
    /**
     * Sends a telemetry user task
     *
     * @input name: string - name of the user task
     * @input result: TelemetryResult - result of the user task
     * @input resultSummary: string - short description of the result
     * @input properties = <IEventProperties>{} - optional properties of the user task
     * @input severity = TelemetrySeverity - event severity
     */
    VSTelemetryListener.prototype.postUserTask = function (opName, result, resultSummary, properties, severity) {
        if (properties === void 0) { properties = {}; }
        properties = this.addPropertiesPrefixToKeys(properties);
        var usertaskEvent = {
            id: this.id,
            event: new vs_telemetry_api_1.UserTaskEvent(this._telemetryProcessor.getEventName(opName), result, resultSummary, properties, severity)
        };
        this.postEventImpl(usertaskEvent.event);
        return [usertaskEvent];
    };
    /**
     * Used to send events without any modification to properties or event name.
     * @param name {string} The event name to send. No prefixes will be added.
     * @param properties {IEventProperties} The properties to send.
     */
    VSTelemetryListener.prototype.postEventUnprefixed = function (name, properties) {
        var event = new vs_telemetry_api_1.Event(name, properties, vs_telemetry_api_1.TelemetrySeverity.Normal);
        this.postEventImpl(event);
        return [{
                id: this.id,
                event: event,
            }];
    };
    VSTelemetryListener.prototype.sessionId = function () {
        return this._telemetry.sessionId();
    };
    VSTelemetryListener.prototype.userId = function () {
        return this._telemetry.userId();
    };
    VSTelemetryListener.prototype.machineId = function () {
        return this._telemetry.machineId();
    };
    VSTelemetryListener.prototype.isMicrosoftInternal = function () {
        return this._telemetry.isMicrosoftInternal();
    };
    VSTelemetryListener.prototype.userAlias = function () {
        return this._telemetry.userAlias();
    };
    VSTelemetryListener.prototype.setCommonProperty = function (propertyName, propertyValue, doNotPrefix) {
        if (doNotPrefix === void 0) { doNotPrefix = false; }
        if (!doNotPrefix) {
            propertyName = this._telemetryProcessor.getPropertyName(propertyName);
        }
        this._telemetry.setSharedProperty(propertyName, propertyValue);
    };
    VSTelemetryListener.prototype.removeCommonProperty = function (propertyName, doNotPrefix) {
        if (doNotPrefix === void 0) { doNotPrefix = false; }
        if (!doNotPrefix) {
            propertyName = this._telemetryProcessor.getPropertyName(propertyName);
        }
        this._telemetry.removeSharedProperty(propertyName);
    };
    VSTelemetryListener.prototype.cleanFinishedOperations = function () {
        var pendingOperations = [];
        this._openOperations.forEach(function (operation) {
            if (operation.isEnded === false) {
                pendingOperations.push(operation);
            }
        });
        this._openOperations = pendingOperations;
        var pendingUserTasks = [];
        this._openUserTasks.forEach(function (usertask) {
            if (usertask.isEnded === false) {
                pendingUserTasks.push(usertask);
            }
        });
        this._openUserTasks = pendingUserTasks;
    };
    VSTelemetryListener.prototype.addPropertiesPrefixToKeys = function (properties) {
        return this._telemetryProcessor.addPrefixToProperties(properties);
    };
    VSTelemetryListener.prototype.sendOptOutEvent = function () {
        var properties = {};
        // Add all properties for the opt-out heartbeat event here
        // Add branch name since shared properties are not sent in opt-out telemetry
        properties[BRANCH_PROPERTY_NAME] = this.appInfo.branchName;
        properties = this.addPropertiesPrefixToKeys(properties);
        var event = new vs_telemetry_api_1.OperationEvent(this._telemetryProcessor.getEventName(APP_START_OPT_OUT_EVENT_NAME), vs_telemetry_api_1.TelemetryResult.Success, "", /* Result Summary */ properties);
        event.isOptOutFriendly = true;
        this.postEventImpl(event);
    };
    VSTelemetryListener.prototype.postEventImpl = function (event) {
        this._telemetry.postEvent(event);
    };
    VSTelemetryListener.prototype.startUserTaskImpl = function (opName, properties) {
        if (properties === void 0) { properties = {}; }
        return this._telemetry.startUserTask(opName, properties);
    };
    VSTelemetryListener.prototype.startOperationImpl = function (opName, properties) {
        if (properties === void 0) { properties = {}; }
        return this._telemetry.startOperation(opName, properties);
    };
    VSTelemetryListener.bucketParamPrefix = "DataModel.Fault.BucketParam";
    return VSTelemetryListener;
}());
exports.VSTelemetryListener = VSTelemetryListener;
//# sourceMappingURL=VSTelemetryListener.js.map