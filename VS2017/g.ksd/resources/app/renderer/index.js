/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="bower_components/riot-ts/riot-ts.d.ts" />
"use strict";
var electron_1 = require("electron");
var leak_detector_1 = require("../lib/leak-detector");
var test_hooks_1 = require("./test-hooks");
require("./common");
require("./Components/main-window");
require("./Actions/HostUpdaterActions");
// watch for leaks in the renderer process
// Electron will crash the renderer process when taking heap dumps, so avoid that for the time being
// https://github.com/electron/electron/issues/8791
var captureHeapDumps = false;
var leakDetector = new leak_detector_1.LeakDetector("Renderer", captureHeapDumps);
leakDetector.on(leak_detector_1.LeakDetector.leakDetectedEvent, function (info) {
    // forward the leak notification to the main process
    electron_1.ipcRenderer.send(leak_detector_1.LeakDetector.leakDetectedEvent, info);
});
window.testHooks = new test_hooks_1.TestHooks();
module.exports = {};
//# sourceMappingURL=index.js.map