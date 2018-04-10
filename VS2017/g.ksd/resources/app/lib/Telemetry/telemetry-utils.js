/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vs_telemetry_api_1 = require("vs-telemetry-api");
/* istanbul ignore next */
var TelemetryUtils = /** @class */ (function () {
    function TelemetryUtils() {
    }
    TelemetryUtils.createHashedPiiProperty = function (property) {
        if (!property) {
            return null;
        }
        return new vs_telemetry_api_1.PiiProperty(property, vs_telemetry_api_1.PiiAction.Hashed);
    };
    return TelemetryUtils;
}());
exports.TelemetryUtils = TelemetryUtils;
//# sourceMappingURL=telemetry-utils.js.map