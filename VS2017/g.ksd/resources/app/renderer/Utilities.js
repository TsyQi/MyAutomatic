/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ResourceStrings_1 = require("../lib/ResourceStrings");
var mainWindow = electron_1.remote.getCurrentWindow();
function openDevTools() {
    // open the DevTools.
    mainWindow.webContents.toggleDevTools();
}
exports.openDevTools = openDevTools;
var KB_IN_MB = 1024;
var KB_IN_GB = Math.pow(KB_IN_MB, 2);
var KB_IN_TB = Math.pow(KB_IN_MB, 3);
/**
 * Format the input size to a string with the proper units
 * while attempting to keep the length to a maximum of 4 digits.
 * The function will always round up to next whole number for 'MB'
 * and 'KB' values. This function works with both positive and
 * negative sizes.
 *
 * 1,073,741,824 KB = 1.0 TB
 * 1,048,576 KB = 1.0 GB
 * 1,024 KB = 1 MB
 * 100 KB = 100 KB
 */
function formatSizeText(sizeInKB) {
    if (sizeInKB === null || sizeInKB === undefined) {
        return "";
    }
    var absoluteSizeInKB = Math.abs(sizeInKB);
    var showDecimalPlaces = false;
    var sizeValue = sizeInKB;
    var unitString = ResourceStrings_1.ResourceStrings.kilobyte;
    if (absoluteSizeInKB >= KB_IN_TB) {
        var sizeInTB = sizeInKB / KB_IN_TB;
        sizeValue = sizeInTB;
        unitString = ResourceStrings_1.ResourceStrings.terabyte;
        showDecimalPlaces = true;
    }
    else if (absoluteSizeInKB >= KB_IN_GB) {
        var sizeInGB = sizeInKB / KB_IN_GB;
        sizeValue = sizeInGB;
        unitString = ResourceStrings_1.ResourceStrings.gigabyte;
        showDecimalPlaces = true;
    }
    else if (absoluteSizeInKB >= KB_IN_MB) {
        var sizeInMB = sizeInKB / KB_IN_MB;
        sizeValue = sizeInMB;
        unitString = ResourceStrings_1.ResourceStrings.megabyte;
    }
    var sign = (sizeValue >= 0) ? 1 : -1;
    var requiredSize = showDecimalPlaces ? sizeValue.toFixed(2) : (sign * Math.ceil(Math.abs(sizeValue))).toString();
    var localizedRequiredSize = parseFloat(requiredSize).toLocaleString(ResourceStrings_1.ResourceStrings.uiLocale());
    return unitString(localizedRequiredSize).toLocaleUpperCase();
}
exports.formatSizeText = formatSizeText;
// intercept log messages
var consoleLog = console.log;
console.log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var logEl = document.getElementById("log");
    if (logEl) {
        var text = Array.prototype.join.call(arguments, " ");
        logEl.innerText = text.concat("\n", logEl.innerText);
    }
    consoleLog.apply(this, args);
};
function getImgSrcFromIcon(icon) {
    if (icon && icon.isValid()) {
        return "data:" + icon.mimeType + ";base64," + icon.base64;
    }
    return "";
}
exports.getImgSrcFromIcon = getImgSrcFromIcon;
function getEventHookMethodForTarget(element, hook) {
    return function (eventName, callback, useCapture) {
        if (hook) {
            element.addEventListener(eventName, callback, useCapture);
        }
        else {
            element.removeEventListener(eventName, callback, useCapture);
        }
    };
}
exports.getEventHookMethodForTarget = getEventHookMethodForTarget;
function getEventHookMethodForEventEmitter(emitter, hook) {
    return function (eventName, callback) {
        if (hook) {
            emitter.on(eventName, callback);
        }
        else {
            emitter.removeListener(eventName, callback);
        }
    };
}
exports.getEventHookMethodForEventEmitter = getEventHookMethodForEventEmitter;
function getDisplayedComponents(components) {
    return components.filter(function (component) {
        return component.visible && !component.isUiGroup && component.installable.state;
    });
}
exports.getDisplayedComponents = getDisplayedComponents;
function ensureBoolean(value) {
    if (typeof value === "string") {
        return value.toString() === "true";
    }
    return !!value;
}
exports.ensureBoolean = ensureBoolean;
//# sourceMappingURL=Utilities.js.map