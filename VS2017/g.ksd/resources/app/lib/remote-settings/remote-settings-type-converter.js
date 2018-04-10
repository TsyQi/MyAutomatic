/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flight_info_1 = require("./service-hub/flight-info");
function flightInfoToServiceHub(info) {
    return new flight_info_1.FlightInfo(info.name, info.durationInMinutes);
}
exports.flightInfoToServiceHub = flightInfoToServiceHub;
function flightsToServiceHub(flights) {
    if (!flights) {
        return [];
    }
    return flights.map(function (info) { return flightInfoToServiceHub(info); });
}
exports.flightsToServiceHub = flightsToServiceHub;
//# sourceMappingURL=remote-settings-type-converter.js.map