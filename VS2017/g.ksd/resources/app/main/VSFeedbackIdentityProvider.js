/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VSFeedbackIdentityProvider = /** @class */ (function () {
    function VSFeedbackIdentityProvider(sessionId, userId, machineId, isMicrosoftInternal, userAlias) {
        this._sessionId = sessionId;
        this._userId = userId;
        this._machineId = machineId;
        this._isMicrosoftInternal = isMicrosoftInternal;
        this._userAlias = userAlias;
    }
    Object.defineProperty(VSFeedbackIdentityProvider.prototype, "sessionId", {
        get: function () {
            return this._sessionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VSFeedbackIdentityProvider.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VSFeedbackIdentityProvider.prototype, "machineId", {
        get: function () {
            return this._machineId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VSFeedbackIdentityProvider.prototype, "isMicrosoftInternal", {
        get: function () {
            return this._isMicrosoftInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VSFeedbackIdentityProvider.prototype, "userAlias", {
        get: function () {
            return this._userAlias;
        },
        enumerable: true,
        configurable: true
    });
    return VSFeedbackIdentityProvider;
}());
exports.VSFeedbackIdentityProvider = VSFeedbackIdentityProvider;
/**
 * Create a new VSTelemetryIdentityInfoProvider.
 */
function createVSFeedbackIdentityProvider(vsTelemetryListener) {
    var sessionIdPromise = vsTelemetryListener.sessionId();
    var userIdPromise = vsTelemetryListener.userId();
    var machineIdPromise = vsTelemetryListener.machineId();
    var isMicrosoftInternalPromise = vsTelemetryListener.isMicrosoftInternal();
    var userAliasPromise = vsTelemetryListener.userAlias();
    var identityPromise = Promise.all([
        sessionIdPromise,
        userIdPromise,
        machineIdPromise,
        userAliasPromise
    ]);
    var sessionId;
    var userId;
    var machineId;
    var userAlias;
    var isInternal;
    return identityPromise.then(function (values) {
        sessionId = values[0];
        userId = values[1];
        machineId = values[2];
        userAlias = values[3];
        return isMicrosoftInternalPromise.then(function (value) {
            isInternal = value;
        });
    }).then(function () {
        return new VSFeedbackIdentityProvider(sessionId, userId, machineId, isInternal, userAlias);
    });
}
exports.createVSFeedbackIdentityProvider = createVSFeedbackIdentityProvider;
//# sourceMappingURL=VSFeedbackIdentityProvider.js.map