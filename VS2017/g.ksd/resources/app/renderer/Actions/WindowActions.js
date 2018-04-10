/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("../../lib/window-action-constants");
var dispatcher_1 = require("../dispatcher");
var electron_1 = require("electron");
var WindowStateChangedEvent_1 = require("../Events/WindowStateChangedEvent");
var window_close_request_event_1 = require("../Events/window-close-request-event");
var WindowActions = /** @class */ (function () {
    function WindowActions() {
        this._onBeforeUnloadBind = this.onBeforeUnload.bind(this);
        electron_1.ipcRenderer.on(constants.WINDOW_STATE_RESPONSE, function (event, state) {
            dispatcher_1.dispatcher.dispatch(new WindowStateChangedEvent_1.WindowStateChangedEvent(new WindowStateChangedEvent_1.WindowState(state.maximized)));
        });
    }
    /* istanbul ignore next */
    WindowActions.prototype.minimizeWindow = function () {
        electron_1.ipcRenderer.send(constants.MINIMIZE_WINDOW);
    };
    /* istanbul ignore next */
    WindowActions.prototype.maximizeOrRestoreWindow = function () {
        electron_1.ipcRenderer.send(constants.MAXIMIZE_RESTORE_WINDOW);
    };
    /* istanbul ignore next */
    WindowActions.prototype.requestWindowState = function () {
        electron_1.ipcRenderer.send(constants.WINDOW_STATE_REQUEST);
    };
    /* istanbul ignore next */
    WindowActions.prototype.quitApp = function (exitDetails) {
        electron_1.ipcRenderer.send(constants.CLOSE_WINDOW, exitDetails);
    };
    /* istanbul ignore next */
    WindowActions.prototype.closeWindow = function (exitDetails) {
        if (!this.isWindowCloseBlocked()) {
            this.quitApp(exitDetails);
        }
    };
    /* istanbul ignore next */
    WindowActions.prototype.startListeningForWindowClose = function (window) {
        window.addEventListener("beforeunload", this._onBeforeUnloadBind);
    };
    /* istanbul ignore next */
    WindowActions.prototype.stopListeningForWindowClose = function (window) {
        window.removeEventListener("beforeunload", this._onBeforeUnloadBind);
    };
    /* istanbul ignore next */
    WindowActions.prototype.onBeforeUnload = function (ev) {
        if (this.isWindowCloseBlocked()) {
            ev.returnValue = false;
        }
    };
    /* istanbul ignore next */
    WindowActions.prototype.isWindowCloseBlocked = function () {
        var event = new window_close_request_event_1.WindowCloseRequestEvent();
        dispatcher_1.dispatcher.dispatch(event);
        return event.defaultPrevented;
    };
    return WindowActions;
}());
exports.windowActions = new WindowActions();
//# sourceMappingURL=WindowActions.js.map