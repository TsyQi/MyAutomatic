/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var browser_window_progress_bar_1 = require("./browser-window-progress-bar");
var native_image_factory_1 = require("../native-image-factory");
var BrowserWindowProgressBarFactory = /** @class */ (function () {
    function BrowserWindowProgressBarFactory() {
    }
    BrowserWindowProgressBarFactory.prototype.getInstance = function (window) {
        return new browser_window_progress_bar_1.BrowserWindowProgressBar(window, new native_image_factory_1.NativeImageFactory(electron_1.nativeImage));
    };
    return BrowserWindowProgressBarFactory;
}());
exports.BrowserWindowProgressBarFactory = BrowserWindowProgressBarFactory;
//# sourceMappingURL=factory.js.map