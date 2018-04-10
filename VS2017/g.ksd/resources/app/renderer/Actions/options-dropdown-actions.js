/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var OptionsDropdownActions = /** @class */ (function () {
    function OptionsDropdownActions(telemetryProxy) {
        this._telemetryProxy = telemetryProxy;
    }
    OptionsDropdownActions.prototype.logOpenMenu = function () {
        var isUserTask = true;
        this._telemetryProxy.sendIpcAtomicEvent(TelemetryEventNames.OPEN_MENU, isUserTask);
    };
    OptionsDropdownActions.prototype.logCloseMenu = function () {
        var isUserTask = true;
        this._telemetryProxy.sendIpcAtomicEvent(TelemetryEventNames.CLOSE_MENU, isUserTask);
    };
    OptionsDropdownActions.prototype.logActivateMenuItem = function (button) {
        var properties = {
            menuItem: button.name,
        };
        var isUserTask = true;
        this._telemetryProxy.sendIpcAtomicEvent(TelemetryEventNames.ACTIVATE_MENU_ITEM, isUserTask, properties);
    };
    return OptionsDropdownActions;
}());
exports.OptionsDropdownActions = OptionsDropdownActions;
//# sourceMappingURL=options-dropdown-actions.js.map