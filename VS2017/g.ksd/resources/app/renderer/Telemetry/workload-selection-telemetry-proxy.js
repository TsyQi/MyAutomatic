/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
/* istanbul ignore next */
var WorkloadSelectionTelemetryProxy = /** @class */ (function () {
    function WorkloadSelectionTelemetryProxy() {
    }
    WorkloadSelectionTelemetryProxy.prototype.recordWorkloadSelection = function (workloadId, workloadName, selected) {
        var properties = {
            workloadId: workloadId,
            workloadName: workloadName,
            selected: String(selected)
        };
        TelemetryProxy_1.telemetryProxy.sendIpcAtomicEvent(TelemetryEventNames.WORKLOAD_SELECTION, true, /* isUserTask */ properties);
    };
    return WorkloadSelectionTelemetryProxy;
}());
exports.WorkloadSelectionTelemetryProxy = WorkloadSelectionTelemetryProxy;
exports.workloadSelectionTelemetryProxy = new WorkloadSelectionTelemetryProxy();
//# sourceMappingURL=workload-selection-telemetry-proxy.js.map