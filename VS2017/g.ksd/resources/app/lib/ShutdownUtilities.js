/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var Logger_1 = require("./Logger");
function restartWindows(useFullPath) {
    if (useFullPath === void 0) { useFullPath = false; }
    // Calling 'shutdown /g /t [value] /d p:04:02' with value > 0, will imply '/f'
    // so applications do not have time to close. By passing '/g /t 0', Windows will
    // use the RestartManager, so apps have time to close and will be relaunched
    // on startup.
    var plannedRebootArgs = ["/g", "/t", "0", "/d", "p:04:02"];
    var options = { detached: true };
    var spawnPath = "shutdown";
    if (useFullPath) {
        if (process.env && process.env.SystemDrive) {
            spawnPath = process.env.SystemDrive + "\\Windows\\System32\\shutdown.exe";
        }
        else {
            handleRestartWindowsFailure(new Error("%SystemDrive% not set"));
        }
    }
    try {
        var child = child_process_1.spawn(spawnPath, plannedRebootArgs, options);
        // Catch any errors to avoid crashing the installer
        child.on("error", function (err) {
            if (!useFullPath) {
                // If the first call fails, the user's environment could be missing the System32 folder from the path.
                // Try again with the SystemDrive environment variable as a fallback.
                restartWindows(true);
            }
            else {
                handleRestartWindowsFailure(err);
            }
        });
        child.unref();
    }
    catch (e) {
        if (!useFullPath) {
            restartWindows(true);
        }
        else {
            handleRestartWindowsFailure(e);
        }
    }
}
exports.restartWindows = restartWindows;
var logger = Logger_1.getLogger();
function handleRestartWindowsFailure(error) {
    var msg = (error && typeof error.toString === "function")
        ? error.toString()
        : "Unknown error";
    logger.writeError("Could not locate shutdown.exe to restart: " + msg);
}
//# sourceMappingURL=ShutdownUtilities.js.map