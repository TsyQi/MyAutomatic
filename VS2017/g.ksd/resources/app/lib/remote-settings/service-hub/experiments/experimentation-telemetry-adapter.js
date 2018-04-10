/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adapts {ITelemetry} to a {ServiceHubExperimentationTelemetry} for the
 * {ServiceHubExperimentationClient}
 */
var ExperimentationTelemetryAdapter = /** @class */ (function () {
    function ExperimentationTelemetryAdapter(telemetry) {
        this._telemetry = telemetry;
    }
    ExperimentationTelemetryAdapter.prototype.postEvent = function (name, properties) {
        this._telemetry.postEventUnprefixed(name, properties);
    };
    ExperimentationTelemetryAdapter.prototype.setSharedProperty = function (name, value) {
        this._telemetry.setCommonProperty(name, value, true /* isRaw */);
    };
    return ExperimentationTelemetryAdapter;
}());
exports.ExperimentationTelemetryAdapter = ExperimentationTelemetryAdapter;
//# sourceMappingURL=experimentation-telemetry-adapter.js.map