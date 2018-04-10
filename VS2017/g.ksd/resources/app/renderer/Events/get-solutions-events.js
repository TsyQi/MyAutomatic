/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetSolutionsStartedEvent = /** @class */ (function () {
    function GetSolutionsStartedEvent() {
    }
    return GetSolutionsStartedEvent;
}());
exports.GetSolutionsStartedEvent = GetSolutionsStartedEvent;
var GetSolutionsFinishedEvent = /** @class */ (function () {
    function GetSolutionsFinishedEvent(result) {
        this._result = result;
    }
    Object.defineProperty(GetSolutionsFinishedEvent.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    return GetSolutionsFinishedEvent;
}());
exports.GetSolutionsFinishedEvent = GetSolutionsFinishedEvent;
//# sourceMappingURL=get-solutions-events.js.map