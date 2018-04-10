/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Max 32-bit (signed) integer value in .NET
 */
var CLR_MAX_INT = 2147483647;
var CommandLineParserUtilities = /** @class */ (function () {
    function CommandLineParserUtilities() {
    }
    /**
     * Converts a time string like: 30m, 2h, 1d, 2w into minutes.
     * @requires duration Must be a positive integer with a unit character.
     */
    CommandLineParserUtilities.prototype.durationStringToMinutes = function (duration) {
        var durationStrLen = duration.length;
        var unit = duration[durationStrLen - 1];
        var value = 0;
        for (var i = 0, len = durationStrLen - 1; i < len; i++) {
            var ch = duration[i];
            var temp = parseInt(ch, 10);
            // Handles non-integer or negative values.
            if (isNaN(temp)) {
                throw new Error("Invalid integer value, must be > 0: " + duration);
            }
            value = value * 10 + temp;
        }
        value = this.unitToMultiplierInMinutes(unit) * value;
        if (value <= 0 || CLR_MAX_INT < value) {
            throw new Error("Value is out of range: " + duration);
        }
        return value;
    };
    /**
     * Converts a unit to the multiplier to convert the value to minutes.
     */
    CommandLineParserUtilities.prototype.unitToMultiplierInMinutes = function (unit) {
        switch (unit.toLowerCase()) {
            case "w":
                return 10080; // "minutes per week"
            case "d":
                return 1440; // "minutes per day"
            case "h":
                return 60; // "minutes per hour"
            case "m":
                return 1; // "minutes per minute"
            default:
                throw new Error("Unrecognized unit value: " + unit);
        }
    };
    return CommandLineParserUtilities;
}());
exports.CommandLineParserUtilities = CommandLineParserUtilities;
//# sourceMappingURL=parser-util.js.map