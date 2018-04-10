/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flightInfoToRpc(info) {
    return {
        Name: info.name,
        DurationInMinutes: info.durationInMinutes,
    };
}
exports.flightInfoToRpc = flightInfoToRpc;
function flightsToRpc(flights) {
    if (!flights) {
        return [];
    }
    return flights.map(function (info) { return flightInfoToRpc(info); });
}
exports.flightsToRpc = flightsToRpc;
//# sourceMappingURL=remote-settings-rpc.js.map