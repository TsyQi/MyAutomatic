/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Report uncaught exceptions to the main process
var renderer_1 = require("report-errors-electron/renderer");
/* tslint:disable: no-unused-variable */
var errorHandler = new renderer_1.ErrorHandlerRenderer();
/* tslint:enable: no-unused-variable */
// Allow WER to handle native crashes.
var enable_wer_windows_1 = require("enable-wer-windows");
enable_wer_windows_1.default();
require("../lib/PromiseFinallyMixin");
var ResourceStrings_1 = require("../lib/ResourceStrings");
var highcontrastcolorprovider_1 = require("./highcontrastcolorprovider");
var KeyCodes_1 = require("./KeyCodes");
var querystring_1 = require("querystring");
var features_actions_1 = require("./actions/features-actions");
var focus_handler_1 = require("./focus-handler");
require("./stores/factory");
// load features
features_actions_1.loadFeatures();
// initialize locale
var queryStringParts = querystring_1.parse(window.location.search.substr(1));
ResourceStrings_1.ResourceStrings.config(queryStringParts.locale, true);
// Enable high contrast theming for the app
var highContrastColorProviderService = new highcontrastcolorprovider_1.HighContrastColorProvider();
highContrastColorProviderService.enableHighContrastTheming();
// Enable high contrast theming when links that load a page in the window without navigating to it.
window.addEventListener("customDocumentLoad", function () {
    highContrastColorProviderService.enableHighContrastTheming();
}, false);
// Use a CSS class name to indicate if a keyboard focus or
// mouse focus visual should be shown.
var keyboardingFocusClassName = "keyboarding";
window.addEventListener("mousedown", function () {
    document.body.classList.remove(keyboardingFocusClassName);
});
window.addEventListener("keydown", function (ev) {
    if (ev.key === "Tab") {
        document.body.classList.add(keyboardingFocusClassName);
    }
});
// prevent middle click or mousewheel click from opening a new window,
// instead forward it to the click event.
window.addEventListener("auxclick", function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    ev.target.dispatchEvent(clickEvent);
});
// global helper to forward enter and space keypress to the click handler
window.keyPressToClickHelper = function (ev) {
    if ([KeyCodes_1.keyCodes.SPACE, KeyCodes_1.keyCodes.ENTER].indexOf(ev.keyCode) !== -1) {
        ev.target.onclick({});
    }
};
// Do not allow for focus to leave the body.
var focusHandler = new focus_handler_1.FocusHandler(document, document.body);
focusHandler.monitorFocus(true /* start */);
//# sourceMappingURL=common.js.map