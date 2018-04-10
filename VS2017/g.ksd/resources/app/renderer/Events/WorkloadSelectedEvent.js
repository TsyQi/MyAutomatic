/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../../lib/requires");
var WorkloadSelectedEvent = /** @class */ (function () {
    function WorkloadSelectedEvent(selectedWorkloadId, options) {
        requires.notNullOrUndefined(selectedWorkloadId, "selectedWorkloadId");
        requires.notNullOrUndefined(options, "options");
        this._selectedWorkloadId = selectedWorkloadId;
        this._options = options;
    }
    Object.defineProperty(WorkloadSelectedEvent.prototype, "selectedWorkloadId", {
        get: function () {
            return this._selectedWorkloadId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadSelectedEvent.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    return WorkloadSelectedEvent;
}());
exports.WorkloadSelectedEvent = WorkloadSelectedEvent;
//# sourceMappingURL=WorkloadSelectedEvent.js.map