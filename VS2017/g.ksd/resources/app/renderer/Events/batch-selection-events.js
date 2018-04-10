/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Signal to the store that a batch selection has been requested.
 */
var BatchSelectionStartedEvent = /** @class */ (function () {
    function BatchSelectionStartedEvent() {
    }
    return BatchSelectionStartedEvent;
}());
exports.BatchSelectionStartedEvent = BatchSelectionStartedEvent;
/**
 * Signal to the store that the batch selection has finished.
 */
var BatchSelectionFinishedEvent = /** @class */ (function () {
    function BatchSelectionFinishedEvent(artifactSelectionWarnings) {
        this._artifactSelectionWarnings = artifactSelectionWarnings;
    }
    Object.defineProperty(BatchSelectionFinishedEvent.prototype, "artifactSelectionWarnings", {
        get: function () {
            return this._artifactSelectionWarnings;
        },
        enumerable: true,
        configurable: true
    });
    return BatchSelectionFinishedEvent;
}());
exports.BatchSelectionFinishedEvent = BatchSelectionFinishedEvent;
//# sourceMappingURL=batch-selection-events.js.map