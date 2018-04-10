/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var ComponentSelectedEvent_1 = require("../Events/ComponentSelectedEvent");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var TelemetryEventNames_1 = require("../../lib/Telemetry/TelemetryEventNames");
/* istanbul ignore next */
/**
 * @param  {Component|Component[]} selectedComponents The component(s) to update
 * @param  {SelectionUpdateOptions} options The selection options
 * @param  {string} source The UI source where the selection changed (e.g. summary-pane)
 * @returns void
 */
function updateSelectedComponents(selectedComponents, options, source) {
    var telemetryProperties = {
        source: source,
        selected: options.checked.toString(),
    };
    var componentIdskey = "componentIds";
    if (Array.isArray(selectedComponents)) {
        telemetryProperties[componentIdskey] = selectedComponents.map(function (c) { return c.id; }).join(",");
        dispatcher_1.dispatcher.dispatch(new ComponentSelectedEvent_1.ComponentSelectedEvent(selectedComponents, options));
    }
    else {
        telemetryProperties[componentIdskey] = selectedComponents.id;
        dispatcher_1.dispatcher.dispatch(new ComponentSelectedEvent_1.ComponentSelectedEvent([selectedComponents], options));
    }
    TelemetryProxy_1.telemetryProxy.sendIpcAtomicEvent(TelemetryEventNames_1.COMPONENT_SELECTION, true, /* isUserTask */ telemetryProperties);
}
exports.updateSelectedComponents = updateSelectedComponents;
//# sourceMappingURL=ComponentSelectedAction.js.map