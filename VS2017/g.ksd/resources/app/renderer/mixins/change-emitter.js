/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChangeEmitter = /** @class */ (function () {
    function ChangeEmitter() {
    }
    /**
     * Emits a standard DOM "change" event.
     */
    ChangeEmitter.prototype.emitChange = function (element, detail) {
        if (detail === void 0) { detail = {}; }
        var changedEvent = new CustomEvent("change", {
            bubbles: true,
            cancelable: true,
            detail: detail,
        });
        return element.dispatchEvent(changedEvent);
    };
    return ChangeEmitter;
}());
exports.ChangeEmitter = ChangeEmitter;
//# sourceMappingURL=change-emitter.js.map