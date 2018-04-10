/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-use-before-declare */
var electron_1 = require("electron");
/* tslint:enable */
var path = require("path");
var window_options_1 = require("../lib/window-options");
var electron_2 = require("../lib/ipc/electron");
var WindowCaptureManager_1 = require("./WindowCaptureManager");
var browser_window_factory_1 = require("./browser-window-factory");
var browser_window_1 = require("./browser-window");
var ResourceStrings_1 = require("../lib/ResourceStrings");
// configure the window
var appVersion = electron_1.app.getVersion();
exports.rendererDir = path.join(path.dirname(__dirname), "renderer");
// This is the ID that Windows uses to determine whether or not different processes should be grouped
// together on the taskbar. Setting this on all windows ensures all windows created will be grouped
// under the same taskbar icon.
exports.appUserModelID = "Microsoft.VisualStudio.Installer";
var browserWindowFactory = new browser_window_factory_1.BrowserWindowFactory(exports.rendererDir);
function hideAllWindows() {
    var windows = electron_1.BrowserWindow.getAllWindows() || [];
    windows.forEach(function (window) { return window.hide(); });
}
exports.hideAllWindows = hideAllWindows;
// quit when all windows are closed.
/* istanbul ignore next */
function allWindowsClosed() {
    // on OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
}
electron_1.app.on("window-all-closed", allWindowsClosed);
/* istanbul ignore next */
function handleIncomingArgs(branch, locale, additionalQueryParameters) {
    if (additionalQueryParameters) {
        var windowPageUrl = getWindowUrl(branch, locale, additionalQueryParameters);
        exports.mainWindow.loadURL(windowPageUrl);
    }
}
exports.handleIncomingArgs = handleIncomingArgs;
/* istanbul ignore next */
function getWindowUrl(branch, locale, additionalQueryParameters) {
    var queryOptions = { appVersion: appVersion, branch: branch, locale: locale };
    return browserWindowFactory.formatUrlWithQueryOptions(browser_window_1.WindowType.Default, queryOptions, additionalQueryParameters);
}
/* istanbul ignore next */
function init(windowType, queryOptions, isHidden, servicesReadyPromise, telemetry, overrideQueryParameters, relaunchCommand) {
    var windowPageUrl = browserWindowFactory.formatUrlWithQueryOptions(windowType, queryOptions, overrideQueryParameters);
    var windowOptions = window_options_1.convertArgsToWindowOptions(windowType, isHidden);
    var browserWindow = browserWindowFactory.createWindow(windowOptions, windowPageUrl, telemetry);
    var appDetails = getAppDetails(windowType);
    // Set the pin taskbar icon details.
    browserWindow.electronWindow.setAppDetails({
        appId: appDetails.appId,
        relaunchCommand: relaunchCommand,
        relaunchDisplayName: appDetails.relaunchDisplayName
    });
    emitWhenReady(browserWindow.electronWindow, servicesReadyPromise);
    return exports.mainWindow = browserWindow;
}
exports.init = init;
/* istanbul ignore next */
function emitWhenReady(browserWindow, servicesReadyPromise) {
    browserWindow.webContents.on(browser_window_1.WC_DID_FINISH_LOAD, function () {
        servicesReadyPromise.then(function () {
            browserWindow.webContents.send(electron_2.IPC_READY);
        });
    });
}
/* istanbul ignore next */
function minimize() {
    if (!exports.mainWindow) {
        return;
    }
    exports.mainWindow.minimize();
}
exports.minimize = minimize;
/* istanbul ignore next */
function maximizeOrRestore() {
    if (!exports.mainWindow) {
        return;
    }
    if (exports.mainWindow.isMaximized()) {
        exports.mainWindow.unmaximize();
    }
    else {
        exports.mainWindow.maximize();
    }
}
exports.maximizeOrRestore = maximizeOrRestore;
/* istanbul ignore next */
function getWindowScreenshot() {
    var windowCaptureManager = new WindowCaptureManager_1.WindowCaptureManager(exports.mainWindow.electronWindow);
    return windowCaptureManager.captureWindow();
}
exports.getWindowScreenshot = getWindowScreenshot;
/* istanbul ignore next */
function createQueryOptions(branch, locale, showDownlevelSkus, isAnotherInstanceRunning) {
    if (branch === void 0) { branch = ""; }
    if (locale === void 0) { locale = ""; }
    if (showDownlevelSkus === void 0) { showDownlevelSkus = false; }
    if (isAnotherInstanceRunning === void 0) { isAnotherInstanceRunning = false; }
    return {
        appVersion: appVersion,
        branch: branch,
        locale: locale,
        showDownlevelSkus: showDownlevelSkus,
        isAnotherInstanceRunning: isAnotherInstanceRunning,
    };
}
exports.createQueryOptions = createQueryOptions;
/* istanbul ignore next */
function getAppDetails(windowType) {
    var appDetails = {
        appId: exports.appUserModelID,
        relaunchDisplayName: ResourceStrings_1.ResourceStrings.appWindowTitle
    };
    switch (windowType) {
        case browser_window_1.WindowType.Uninstall:
            appDetails.relaunchDisplayName = ResourceStrings_1.ResourceStrings.appUninstallWindowTitle;
            break;
        case browser_window_1.WindowType.Default:
            break;
        case browser_window_1.WindowType.FocusedUi:
            break;
        case browser_window_1.WindowType.Survey:
            break;
        default:
            break;
    }
    return appDetails;
}
//# sourceMappingURL=WindowManager.js.map