/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = require("path");
var Logger_1 = require("../lib/Logger");
var FileSystem_1 = require("../lib/FileSystem");
var TEMP_DIRECTORY = electron_1.app.getPath("temp");
var WindowCaptureManager = /** @class */ (function () {
    function WindowCaptureManager(window, screenCaptureDirectory) {
        if (screenCaptureDirectory === void 0) { screenCaptureDirectory = TEMP_DIRECTORY; }
        this._screenCaptureDirectory = screenCaptureDirectory;
        this._window = window;
    }
    /**
     * Takes a screenshot of the BrowserWindow saves that screenshot and
     * a thumbnail of that screenshot to the temp directory and returns a
     * string of the screenshot path.
     */
    WindowCaptureManager.prototype.captureWindow = function () {
        var imagePath = this.screenCaptureFilePath;
        this._window.capturePage(function (image) {
            FileSystem_1.writeFile(imagePath, image.toPNG(), "binary");
        });
        return imagePath;
    };
    Object.defineProperty(WindowCaptureManager.prototype, "screenCaptureFileName", {
        get: function () {
            return "dd_screen_capture_" + Logger_1.getLogFileDateTime() + ".png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WindowCaptureManager.prototype, "screenCaptureFilePath", {
        get: function () {
            return path_1.join(this._screenCaptureDirectory, this.screenCaptureFileName);
        },
        enumerable: true,
        configurable: true
    });
    return WindowCaptureManager;
}());
exports.WindowCaptureManager = WindowCaptureManager;
//# sourceMappingURL=WindowCaptureManager.js.map