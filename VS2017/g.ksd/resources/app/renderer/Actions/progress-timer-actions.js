/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RepeatingTimeout_1 = require("../../lib/RepeatingTimeout");
var dispatcher_1 = require("../dispatcher");
var read_progress_bar_event_1 = require("../Events/read-progress-bar-event");
var ProgressTimerActions = /** @class */ (function () {
    function ProgressTimerActions() {
        var _this = this;
        this._dueTime = -1; // -1 so it doesn't start automatically
        this._interval = 10000; // 10 sec
        this._repeatingTimeouts = new RepeatingTimeout_1.RepeatingTimeout(this._dueTime, this._interval, function () { return _this.readProgressBarEventTriggered(); });
    }
    ProgressTimerActions.prototype.stopTimer = function () {
        this._repeatingTimeouts.stop();
    };
    ProgressTimerActions.prototype.startTimer = function (installationPath) {
        this._installationPath = installationPath;
        this._repeatingTimeouts.start();
    };
    ProgressTimerActions.prototype.readProgressBarEventTriggered = function () {
        dispatcher_1.dispatcher.dispatch(new read_progress_bar_event_1.ReadProgressBarEvent(this._installationPath));
        return true;
    };
    return ProgressTimerActions;
}());
exports.ProgressTimerActions = ProgressTimerActions;
//# sourceMappingURL=progress-timer-actions.js.map