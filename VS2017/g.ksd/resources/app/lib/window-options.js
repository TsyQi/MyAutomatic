/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceStrings_1 = require("../lib/ResourceStrings");
var browser_window_1 = require("../main/browser-window");
/* istanbul ignore next */
function convertArgsToWindowOptions(windowType, isHidden) {
    var options;
    switch (windowType) {
        case browser_window_1.WindowType.FocusedUi:
            options = focusedWindowOptions();
            break;
        case browser_window_1.WindowType.Uninstall:
            options = uninstallWindowOptions();
            break;
        case browser_window_1.WindowType.Default:
            options = mainWindowOptions();
            break;
        default:
            options = mainWindowOptions();
            break;
    }
    if (isHidden) {
        options = invisibleWindowOptions(options);
    }
    return options;
}
exports.convertArgsToWindowOptions = convertArgsToWindowOptions;
/* istanbul ignore next */
function focusedWindowOptions() {
    return {
        center: true,
        frame: false,
        height: 420,
        minHeight: 420,
        minWidth: 650,
        resizable: true,
        title: ResourceStrings_1.ResourceStrings.appWindowTitle,
        width: 650
    };
}
exports.focusedWindowOptions = focusedWindowOptions;
/* istanbul ignore next */
function mainWindowOptions() {
    return {
        center: true,
        frame: false,
        height: 720,
        minHeight: 600,
        minWidth: 960,
        resizable: true,
        title: ResourceStrings_1.ResourceStrings.appWindowTitle,
        width: 1290
    };
}
exports.mainWindowOptions = mainWindowOptions;
/* istanbul ignore next */
function uninstallWindowOptions() {
    return {
        center: true,
        frame: false,
        height: 380,
        minHeight: 380,
        minWidth: 540,
        resizable: false,
        title: ResourceStrings_1.ResourceStrings.appWindowTitle,
        width: 540
    };
}
exports.uninstallWindowOptions = uninstallWindowOptions;
/* istanbul ignore next */
function surveyPromptWindowOptions() {
    // Hide the survey window until we know whether the user can take the survey or not.
    return invisibleWindowOptions({
        center: true,
        frame: false,
        height: 250,
        resizable: false,
        title: ResourceStrings_1.ResourceStrings.appWindowTitle,
        width: 600
    });
}
exports.surveyPromptWindowOptions = surveyPromptWindowOptions;
/* istanbul ignore next */
function invisibleWindowOptions(baseOptions) {
    baseOptions.show = false;
    return baseOptions;
}
exports.invisibleWindowOptions = invisibleWindowOptions;
//# sourceMappingURL=window-options.js.map