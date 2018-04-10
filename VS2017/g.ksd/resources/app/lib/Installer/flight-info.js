/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var FlightInfo = /** @class */ (function () {
    function FlightInfo(name, durationInMinutes) {
        requires.notNullOrUndefined(name, "name");
        requires.notNullOrUndefined(durationInMinutes, "durationInMinutes");
        this._name = name;
        this._durationInMinutes = durationInMinutes;
    }
    Object.defineProperty(FlightInfo.prototype, "durationInMinutes", {
        get: function () {
            return this._durationInMinutes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlightInfo.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return FlightInfo;
}());
exports.FlightInfo = FlightInfo;
//# sourceMappingURL=flight-info.js.map