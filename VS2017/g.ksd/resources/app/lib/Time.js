/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_utilities_1 = require("./string-utilities");
var Time = /** @class */ (function () {
    function Time() {
    }
    Object.defineProperty(Time, "now", {
        get: function () {
            var now = new Date();
            var hours = string_utilities_1.zeroFill(now.getHours(), 2);
            var minutes = string_utilities_1.zeroFill(now.getMinutes(), 2);
            var seconds = string_utilities_1.zeroFill(now.getSeconds(), 2);
            var milliseconds = string_utilities_1.zeroFill(now.getMilliseconds(), 3);
            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
        },
        enumerable: true,
        configurable: true
    });
    return Time;
}());
exports.Time = Time;
//# sourceMappingURL=Time.js.map