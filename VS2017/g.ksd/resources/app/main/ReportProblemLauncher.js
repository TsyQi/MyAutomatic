/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var CommandLine_1 = require("../lib/CommandLine");
var path = require("path");
var fs = require("fs");
// Module and V8 are lower level hosting modules that
// are not typically used by user scripts but are present
// in both Node and Electron. They have no available typings
// on DefinitelyTyped or elsewhere. So requiring them
// instead of importing, and suppressing the associated
// tslint warning.
/* tslint:disable:no-var-requires no-require-imports */
var mod = require("module");
var v8 = require("v8");
/* tslint:enable */
// Transfer control to the given .asar file and exit
function launchAsar(asarPath) {
    var packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync(path.join(asarPath, "package.json"), "utf8"));
    }
    catch (error) {
        // Ignore errors here. Strictly speaking, having a valid package.json is optional.
    }
    if (packageJson) {
        // Set application's version.
        if (packageJson.version) {
            // setVersion does exist on app, although it is not defined
            // in any available typing file presently
            electron_1.app.setVersion(packageJson.version);
        }
        // Set application's name.
        if (packageJson.productName) {
            electron_1.app.setName(packageJson.productName);
        }
        else if (packageJson.name) {
            electron_1.app.setName(packageJson.name);
        }
        // Set application's desktop name.
        if (packageJson.desktopName) {
            // setDestkopName does exist on app, although it is not defined
            // in any available typing file presently
            electron_1.app.setDesktopName(packageJson.desktopName);
        }
        else {
            // setDestkopName does exist on app, although it is not defined
            // in any available typing file presently
            electron_1.app.setDesktopName((electron_1.app.getName()) + ".desktop");
        }
        // Set v8 flags
        if (packageJson.v8Flags) {
            v8.setFlagsFromString(packageJson.v8Flags);
        }
    }
    // Chrome 42 disables NPAPI plugins by default, reenable them here
    electron_1.app.commandLine.appendSwitch("enable-npapi");
    // Set the user path according to application's name.
    electron_1.app.setPath("userData", path.join(electron_1.app.getPath("appData"), electron_1.app.getName()));
    // getPath does accept "cache" as a parameter, although it is not defined
    // in any available typing file presently
    electron_1.app.setPath("userCache", path.join(electron_1.app.getPath("cache"), electron_1.app.getName()));
    // setAppPath does exist on app, although it is not defined
    // in any available typing file presently
    electron_1.app.setAppPath(asarPath);
    // Set main startup script of the app.
    var mainStartupScript = packageJson ? (packageJson.main || "index.js") : "main.js";
    // Finally load app's main.js and transfer control to C++.
    mod._load(path.join(asarPath, mainStartupScript), mod, true);
}
// Launch ReportProblem.asar
function launchReportProblem() {
    var asarPath = path.resolve(__dirname, "../node_modules/vs-report-problem-bundle/ReportProblem.asar");
    try {
        fs.statSync(asarPath);
    }
    catch (e) {
        throw new Error("ReportProblem.asar not found");
    }
    launchAsar(asarPath);
}
exports.launchReportProblem = launchReportProblem;
function launchDiagnostics() {
    var asarPath = path.resolve(__dirname, "../node_modules/vs-report-problem-bundle/Diagnostics.asar");
    try {
        fs.statSync(asarPath);
    }
    catch (e) {
        throw new Error("Diagnostics.asar not found");
    }
    launchAsar(asarPath);
}
exports.launchDiagnostics = launchDiagnostics;
function handleFeedbackSession() {
    // <path_to_exe> <command> <option>
    if (process.argv.length >= 3) {
        if ((process.argv[1] === CommandLine_1.CommandNames.reportaproblem) ||
            (process.argv[2] === CommandLine_1.CommandNames.reportaproblem)) {
            launchReportProblem();
            return true;
        }
        if ((process.argv[1] === CommandLine_1.CommandNames.collectdiagnostics) ||
            (process.argv[2] === CommandLine_1.CommandNames.collectdiagnostics)) {
            launchDiagnostics();
            return true;
        }
    }
    return false;
}
exports.handleFeedbackSession = handleFeedbackSession;
//# sourceMappingURL=ReportProblemLauncher.js.map