/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flight_info_1 = require("../Installer/flight-info");
var parser_util_1 = require("./parser-util");
var FlightInfoFromArgVFactory = /** @class */ (function () {
    function FlightInfoFromArgVFactory(parserUtils) {
        this._parserUtils = parserUtils;
    }
    FlightInfoFromArgVFactory.getInstance = function () {
        return new FlightInfoFromArgVFactory(new parser_util_1.CommandLineParserUtilities());
    };
    /**
     * Parses the command line input into a IFlightInfo[]
     * The command line syntax is: --flight "flight_name;duration"
     * Where duration could be in seconds, minutes, hours, days, or weeks
     * @requires flightInfo The duration must be less than 3550 weeks, and greater than 0 seconds.
     */
    FlightInfoFromArgVFactory.prototype.create = function (flightInfo) {
        var _this = this;
        if (!flightInfo) {
            return [];
        }
        return flightInfo
            .map(function (info) {
            var infoAndDuration = info.split(";");
            if (infoAndDuration.length !== 2) {
                throw new Error("Invalid FlightInfo parameter: " + info);
            }
            var flightName = infoAndDuration[0];
            var durationString = infoAndDuration[1];
            var durationInSeconds = _this._parserUtils.durationStringToMinutes(durationString);
            return new flight_info_1.FlightInfo(flightName, durationInSeconds);
        });
    };
    return FlightInfoFromArgVFactory;
}());
exports.FlightInfoFromArgVFactory = FlightInfoFromArgVFactory;
//# sourceMappingURL=flight-info.js.map