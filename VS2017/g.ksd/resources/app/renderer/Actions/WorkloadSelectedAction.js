/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var WorkloadSelectedEvent_1 = require("../Events/WorkloadSelectedEvent");
var workload_selection_telemetry_proxy_1 = require("../Telemetry/workload-selection-telemetry-proxy");
/* istanbul ignore next */
function updateSelectedWorkloads(id, name, options) {
    dispatcher_1.dispatcher.dispatch(new WorkloadSelectedEvent_1.WorkloadSelectedEvent(id, options));
    workload_selection_telemetry_proxy_1.workloadSelectionTelemetryProxy.recordWorkloadSelection(id, name, options.checked);
}
exports.updateSelectedWorkloads = updateSelectedWorkloads;
//# sourceMappingURL=WorkloadSelectedAction.js.map