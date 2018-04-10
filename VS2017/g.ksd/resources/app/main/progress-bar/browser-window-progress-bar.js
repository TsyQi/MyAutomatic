/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var progress_bar_1 = require("../../lib/progress-bar");
var BrowserWindowProgressBar = /** @class */ (function () {
    function BrowserWindowProgressBar(window, nativeImageFactory) {
        this._value = -1;
        this._mode = progress_bar_1.ProgressBarMode.None;
        this._pendingMode = progress_bar_1.ProgressBarMode.None;
        this._window = window;
        this._nativeImageFactory = nativeImageFactory;
    }
    BrowserWindowProgressBar.prototype.getValue = function () {
        return Promise.resolve({
            value: this._value,
            options: {
                mode: this._mode,
            },
        });
    };
    BrowserWindowProgressBar.prototype.setValue = function (value, options) {
        if (!options) {
            options = {
                mode: progress_bar_1.ProgressBarMode.Normal,
            };
        }
        this._pendingMode = options.mode;
        // Maintain the "error" state until it's reset.
        if (this._mode === progress_bar_1.ProgressBarMode.Error) {
            this.setValueImpl(value, { mode: progress_bar_1.ProgressBarMode.Error });
            return;
        }
        this.setValueImpl(value, options);
    };
    BrowserWindowProgressBar.prototype.setError = function () {
        if (this._mode === progress_bar_1.ProgressBarMode.Error) {
            return;
        }
        this.setValueImpl(this._value, { mode: progress_bar_1.ProgressBarMode.Error });
        this.setFlashFrame(true);
    };
    BrowserWindowProgressBar.prototype.resetError = function () {
        if (this._mode !== progress_bar_1.ProgressBarMode.Error) {
            return;
        }
        this.setValueImpl(this._value, { mode: this._pendingMode });
    };
    BrowserWindowProgressBar.prototype.setFlashFrame = function (isFlashing) {
        this._window.flashFrame(isFlashing);
    };
    BrowserWindowProgressBar.prototype.setOverlayIcon = function (path, description) {
        var overlay = this._nativeImageFactory.createFromPath(path);
        this._window.setOverlayIcon(overlay, description);
    };
    BrowserWindowProgressBar.prototype.clearValue = function () {
        // -1 is one way to clear the progress bar.
        this.setValue(-1, { mode: progress_bar_1.ProgressBarMode.None });
    };
    BrowserWindowProgressBar.prototype.setValueImpl = function (value, options) {
        this._value = value;
        this._mode = options.mode;
        // Asserting <any> to workaround: https://github.com/electron/electron/issues/10775
        if (this._window && !this._window.isDestroyed()) {
            this._window.setProgressBar(value, this.getOptions(options));
        }
    };
    BrowserWindowProgressBar.prototype.getModeString = function (mode) {
        switch (mode) {
            case progress_bar_1.ProgressBarMode.Error:
                return "error";
            case progress_bar_1.ProgressBarMode.Indeterminate:
                return "indeterminate";
            case progress_bar_1.ProgressBarMode.None:
                return "none";
            case progress_bar_1.ProgressBarMode.Normal:
                return "normal";
            case progress_bar_1.ProgressBarMode.Paused:
                return "paused";
            default:
                // fallback to none
                return "none";
        }
    };
    BrowserWindowProgressBar.prototype.getOptions = function (options) {
        if (!options) {
            options = {
                mode: progress_bar_1.ProgressBarMode.Normal,
            };
        }
        return {
            mode: this.getModeString(options.mode),
        };
    };
    return BrowserWindowProgressBar;
}());
exports.BrowserWindowProgressBar = BrowserWindowProgressBar;
//# sourceMappingURL=browser-window-progress-bar.js.map