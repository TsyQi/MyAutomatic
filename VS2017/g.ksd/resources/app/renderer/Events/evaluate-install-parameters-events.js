/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EvaluateInstallParametersStartedEvent = /** @class */ (function () {
    function EvaluateInstallParametersStartedEvent() {
    }
    return EvaluateInstallParametersStartedEvent;
}());
exports.EvaluateInstallParametersStartedEvent = EvaluateInstallParametersStartedEvent;
var EvaluateInstallParametersFinishedEvent = /** @class */ (function () {
    function EvaluateInstallParametersFinishedEvent(evaluation, error) {
        if (error === void 0) { error = null; }
        this._evaluation = evaluation;
        this._error = error;
    }
    Object.defineProperty(EvaluateInstallParametersFinishedEvent.prototype, "evaluation", {
        get: function () {
            return this._evaluation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EvaluateInstallParametersFinishedEvent.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    return EvaluateInstallParametersFinishedEvent;
}());
exports.EvaluateInstallParametersFinishedEvent = EvaluateInstallParametersFinishedEvent;
//# sourceMappingURL=evaluate-install-parameters-events.js.map