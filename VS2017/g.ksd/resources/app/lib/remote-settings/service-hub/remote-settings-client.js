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
var requires = require("../../requires");
var service_hub_client_1 = require("../../service-hub/service-hub-client");
var servicehub_logger_adapter_1 = require("../../servicehub-logger-adapter");
var microsoft_servicehub_1 = require("microsoft-servicehub");
var remoteSettingsRpc = require("./remote-settings-rpc");
/**
 * This should match the servicehub.config.json prefix
 */
var remoteSettingsServiceName = "RemoteSettingsProviderService";
/**
 * This is the channel name for the HubClient
 */
var remoteSettingsServiceClientName = "RemoteSettingsClient";
/**
 * Methods available on the ServiceHub service.
 */
var ServiceHubRemoteSettingsServiceMethod;
(function (ServiceHubRemoteSettingsServiceMethod) {
    ServiceHubRemoteSettingsServiceMethod[ServiceHubRemoteSettingsServiceMethod["GetBooleanValue"] = 0] = "GetBooleanValue";
    ServiceHubRemoteSettingsServiceMethod[ServiceHubRemoteSettingsServiceMethod["GetNumberValue"] = 1] = "GetNumberValue";
    ServiceHubRemoteSettingsServiceMethod[ServiceHubRemoteSettingsServiceMethod["GetStringValue"] = 2] = "GetStringValue";
    ServiceHubRemoteSettingsServiceMethod[ServiceHubRemoteSettingsServiceMethod["Initialize"] = 3] = "Initialize";
    ServiceHubRemoteSettingsServiceMethod[ServiceHubRemoteSettingsServiceMethod["GetSurveyActionsAsync"] = 4] = "GetSurveyActionsAsync";
})(ServiceHubRemoteSettingsServiceMethod || (ServiceHubRemoteSettingsServiceMethod = {}));
var ServiceHubRemoteSettingsClient = /** @class */ (function (_super) {
    __extends(ServiceHubRemoteSettingsClient, _super);
    function ServiceHubRemoteSettingsClient(stream, telemetry, logger, clientName, clientVersion, remoteSettingsFileName, serializedTelemetrySession, productChannelName, appIdGuid, flights) {
        var _this = this;
        requires.stringNotEmpty(clientName, "clientName");
        requires.stringNotEmpty(clientVersion, "clientVersion");
        requires.stringNotEmpty(remoteSettingsFileName, "remoteSettingsFileName");
        requires.stringNotEmpty(serializedTelemetrySession, "serializedTelemetrySession");
        _this = _super.apply(this, [stream].concat(ServiceHubRemoteSettingsClient.methodNames)) || this;
        _this._logger = logger;
        _this._telemetry = telemetry;
        _this._clientName = clientName;
        _this._clientVersion = clientVersion;
        _this._remoteSettingsFileName = remoteSettingsFileName;
        _this._serializedTelemetrySession = serializedTelemetrySession;
        _this._productChannelName = productChannelName;
        _this._appIdGuid = appIdGuid;
        _this.initialize(flights);
        return _this;
    }
    Object.defineProperty(ServiceHubRemoteSettingsClient, "methodNames", {
        get: function () {
            return [
                "postEvent",
                "setSharedProperty",
            ];
        },
        enumerable: true,
        configurable: true
    });
    ServiceHubRemoteSettingsClient.prototype.getBooleanValue = function (collectionPath, key, defaultValue) {
        var _this = this;
        var methodName = this.getRemoteMethodName(ServiceHubRemoteSettingsServiceMethod.GetBooleanValue);
        this.log("Calling " + remoteSettingsServiceName + "." + methodName + "(collectionPath, key, defaultValue)"
            + (" collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue));
        return this.initialize()
            .then(function () {
            return _this.invoke(methodName, [
                collectionPath,
                key,
                defaultValue
            ])
                .then(function (result) {
                _this.log("Resolved " + remoteSettingsServiceName + "." + methodName
                    + "(collectionPath, key, defaultValue) "
                    + ("collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue + ", ")
                    + ("result: " + result));
                return result;
            }, function (error) {
                _this.log("Rejected $" + remoteSettingsServiceName + "." + methodName
                    + "(collectionPath, key, defaultValue) "
                    + ("collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue + ", ")
                    + ("error: " + JSON.stringify(error)));
                throw error;
            });
        });
    };
    ServiceHubRemoteSettingsClient.prototype.getNumberValue = function (collectionPath, key, defaultValue) {
        var _this = this;
        var methodName = this.getRemoteMethodName(ServiceHubRemoteSettingsServiceMethod.GetNumberValue);
        this.log("Calling " + remoteSettingsServiceName + "." + methodName + "(collectionPath, key, defaultValue)"
            + (" collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue));
        return this.initialize()
            .then(function () {
            return _this.invoke(methodName, [
                collectionPath,
                key,
                defaultValue
            ])
                .then(function (result) {
                _this.log("Resolved " + remoteSettingsServiceName + "." + methodName
                    + "(collectionPath, key, defaultValue) "
                    + ("collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue + ", ")
                    + ("result: " + result));
                return result;
            }, function (error) {
                _this.log("Rejected $" + remoteSettingsServiceName + "." + methodName
                    + "(collectionPath, key, defaultValue) "
                    + ("collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue + ", ")
                    + ("error: " + JSON.stringify(error)));
                throw error;
            });
        });
    };
    ServiceHubRemoteSettingsClient.prototype.getStringValue = function (collectionPath, key, defaultValue) {
        var _this = this;
        var methodName = this.getRemoteMethodName(ServiceHubRemoteSettingsServiceMethod.GetStringValue);
        this.log("Calling " + remoteSettingsServiceName + "." + methodName + "(collectionPath, key, defaultValue)"
            + (" collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue));
        return this.initialize()
            .then(function () {
            return _this.invoke(methodName, [
                collectionPath,
                key,
                defaultValue
            ])
                .then(function (result) {
                _this.log("Resolved " + remoteSettingsServiceName + "." + methodName
                    + "(collectionPath, key, defaultValue) "
                    + ("collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue + ", ")
                    + ("result: " + result));
                return result;
            }, function (error) {
                _this.log("Rejected $" + remoteSettingsServiceName + "." + methodName
                    + "(collectionPath, key, defaultValue) "
                    + ("collectionPath: " + collectionPath + ", key: " + key + ", defaultValue: " + defaultValue + ", ")
                    + ("error: " + JSON.stringify(error)));
                throw error;
            });
        });
    };
    ServiceHubRemoteSettingsClient.prototype.getSurveyActionsAsync = function (actionPath) {
        var _this = this;
        var methodName = this.getRemoteMethodName(ServiceHubRemoteSettingsServiceMethod.GetSurveyActionsAsync);
        this.log("Calling " + remoteSettingsServiceName + "." + methodName + "(actionPath), actionPath: " + actionPath);
        return this.initialize()
            .then(function () {
            return _this.invoke(methodName, [
                actionPath,
            ])
                .then(function (result) {
                _this.log("Resolved " + remoteSettingsServiceName + "." + methodName
                    + "(actionPath) "
                    + ("actionPath: " + actionPath + ", ")
                    + ("result: " + result));
                return result;
            }, function (error) {
                _this.log("Rejected " + remoteSettingsServiceName + "." + methodName
                    + "(actionPath) "
                    + ("actionPath: " + actionPath + ", ")
                    + ("error: " + JSON.stringify(error)));
                throw error;
            });
        });
    };
    /**
     * Provide postEvent to the remote service.
     * @param name {string} event name.
     * @param properties A map of properties.
     */
    ServiceHubRemoteSettingsClient.prototype.postEvent = function (name, properties) {
        this.log("ServiceHubExperimentationClient.postEvent(name, properties) called.\n [name: " + name + "] [properties: " + JSON.stringify(properties) + "]");
        this._telemetry.postEvent(name, properties);
    };
    /**
     * Provide setSharedProperty to the remote service.
     * @param name {string} property name.
     * @param value {string} property value.
     */
    ServiceHubRemoteSettingsClient.prototype.setSharedProperty = function (name, value) {
        this.log("ServiceHubExperimentationClient.setSharedProperty(name, value) called,\n [name: " + name + "] [value: " + value + "]");
        this._telemetry.setSharedProperty(name, value);
    };
    ServiceHubRemoteSettingsClient.prototype.initialize = function (flights) {
        if (flights === void 0) { flights = []; }
        if (this._initializePromise) {
            return this._initializePromise;
        }
        var methodName = this.getRemoteMethodName(ServiceHubRemoteSettingsServiceMethod.Initialize);
        var flightInfoRpc = remoteSettingsRpc.flightsToRpc(flights);
        var params = [
            this._clientName,
            this._clientVersion,
            this._remoteSettingsFileName,
            this._serializedTelemetrySession,
            this._productChannelName,
            this._appIdGuid,
            flightInfoRpc,
        ];
        this.log("Calling " + remoteSettingsServiceName + "." + methodName + "(remoteSettingsFileName)clientName: " + this._clientName + ", clientVersion: " + this._clientVersion + ", remoteSettingsFileName: " + this._remoteSettingsFileName + ", serializedTelemetrySession: " + this._serializedTelemetrySession + ", productChannelName: " + this._productChannelName + ", appIdGuid: " + this._appIdGuid);
        this._initializePromise = this.invoke(methodName, params);
        return this._initializePromise;
    };
    ServiceHubRemoteSettingsClient.prototype.getRemoteMethodName = function (method) {
        return ServiceHubRemoteSettingsServiceMethod[method];
    };
    ServiceHubRemoteSettingsClient.prototype.log = function (message) {
        this._logger.writeVerbose(message);
    };
    return ServiceHubRemoteSettingsClient;
}(service_hub_client_1.ServiceHubClient));
exports.ServiceHubRemoteSettingsClient = ServiceHubRemoteSettingsClient;
/**
 * Starts the connection with the RemoteSettingsProviderService.
 * @param telemetry The telemetry implementation to provide telemetry for the service.
 * @param logger The logger used for logging info.
 * @param clientName The name of the client exe.
 * @param clientVersion The version of the client.
 * @param remoteSettingsFileName The name of the remote settings file.
 * @param serializedTelemetrySession The serialized telemetry session to be re-inflated by the service.
 * @param productChannelName The name of the product or channel used for targeting in TN.
 */
function startRemoteSettingsClient(telemetry, logger, clientName, clientVersion, remoteSettingsFileName, serializedTelemetrySession, productChannelName, appIdGuid, flights) {
    logger.writeVerbose("Starting ServiceHub Remote Settings client.");
    var serviceHubLogger = new servicehub_logger_adapter_1.ServiceHubLoggerAdapter(logger);
    var hubClient = new microsoft_servicehub_1.HubClient(remoteSettingsServiceClientName, serviceHubLogger);
    return hubClient.requestService(remoteSettingsServiceName)
        .then(function (stream) {
        var service = new ServiceHubRemoteSettingsClient(stream, telemetry, logger, clientName, clientVersion, remoteSettingsFileName, serializedTelemetrySession, productChannelName, appIdGuid, flights);
        logger.writeVerbose("ServiceHub Remote Settings client started.");
        return service;
    });
}
exports.startRemoteSettingsClient = startRemoteSettingsClient;
//# sourceMappingURL=remote-settings-client.js.map