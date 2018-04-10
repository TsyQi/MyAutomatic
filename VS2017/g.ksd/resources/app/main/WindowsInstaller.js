/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var electron_1 = require("electron");
var events_1 = require("events");
var os = require("os");
var path = require("path");
var FileSystem_1 = require("../lib/FileSystem");
var Logger_1 = require("../lib/Logger");
var package_1 = require("./package");
require("../lib/PromiseFinallyMixin");
var logger = Logger_1.getLogger();
var INSTALLER_WINDOWS_EXE_NAME = "vs_installer.windows.exe";
var INSTALLER_WINDOWS_EXE_CONFIG_NAME = INSTALLER_WINDOWS_EXE_NAME + ".config";
var INSTALLER_SUCCESS_EXIT_CODE = 0;
var INSTALLER_FINALIZE_INSTALL_PARAMETER = "/finalizeinstall";
var INSTALLER_FINALIZE_UPDATE_PARAMETER = "/finalizeupdate";
var INSTALLER_UPDATE_PARAMETER = "/update";
var INSTALLER_UNINSTALL_PARAMETER = "/uninstall";
var APPLICATION_ARP_IDENTIFIER = "6F320B93-EE3C-4826-85E0-ADF79F8D4C61";
// TODO: Change ARP size back to 104 * 1024 after RC
// Bug 294385 - Remove install size from ARP (0 removes size from the listing)
// const APPLICATION_ARP_ESTIMATED_SIZE_IN_KILOBYTES = 104 * 1024;
var APPLICATION_ARP_ESTIMATED_SIZE_IN_KILOBYTES = 0;
var DELETE_DIRECTORY_RETRY_COUNT = 6;
var DELETE_DIRECTORY_RETRY_INTERVAL_IN_MILLISECONDS = 5000;
exports.eventEmitter = new events_1.EventEmitter();
exports.UNINSTALL_SELF_FAILED_EVENT = "uninstall-self-failed";
exports.FINALIZE_INSTALL_FAILED = "finalize-install-failed";
var InstallerOperation;
(function (InstallerOperation) {
    InstallerOperation[InstallerOperation["None"] = 0] = "None";
    InstallerOperation[InstallerOperation["FinalizedInstall"] = 1] = "FinalizedInstall";
    InstallerOperation[InstallerOperation["Uninstalling"] = 2] = "Uninstalling";
})(InstallerOperation = exports.InstallerOperation || (exports.InstallerOperation = {}));
function getUninstallTempDirectoryPath() {
    var uninstallDirectoryName = package_1.APPLICATION_NAME.replace(/\s/g, "").toLowerCase();
    return path.join(os.tmpdir(), uninstallDirectoryName);
}
function finalizeInstall() {
    var installerPath = path.join(__dirname, INSTALLER_WINDOWS_EXE_NAME);
    var applicationId = APPLICATION_ARP_IDENTIFIER;
    var applicationVersion = electron_1.app.getVersion();
    var applicationSize = APPLICATION_ARP_ESTIMATED_SIZE_IN_KILOBYTES.toString();
    // In order to launch Installer in elevated mode, we will need to launch the vs_installer.exe stub instead of the
    // Electron shell. The sub path is current EXE directory + vs_installer.exe
    var directoryPath = path.dirname(electron_1.app.getPath("exe"));
    var targetPath = path.join(directoryPath, "vs_installer.exe");
    var onError = function (error) {
        logger.writeError("Installation finalization failed. [" + error.name + ": " + error.message + "]");
        exports.eventEmitter.emit(exports.FINALIZE_INSTALL_FAILED, error);
    };
    // spawn can synchronously throw an exception for unknown reasons.
    try {
        var spawnedProcess = child_process_1.spawn(installerPath, [
            INSTALLER_FINALIZE_INSTALL_PARAMETER,
            applicationId,
            package_1.APPLICATION_NAME,
            package_1.ARP_DESCRIPTION,
            applicationVersion,
            applicationSize,
            targetPath
        ]);
        spawnedProcess
            .on("exit", function (exitCode) {
            if (exitCode === INSTALLER_SUCCESS_EXIT_CODE) {
                logger.writeVerbose("Installation finalized successfully.");
            }
            else {
                logger.writeError("Installation finalization failed. [" + exitCode + "]");
            }
        })
            .on("error", function (error) {
            onError(error);
        });
    }
    catch (error) {
        onError(error);
    }
}
exports.finalizeInstall = finalizeInstall;
function uninstall(quiet) {
    logger.writeVerbose("Starting uninstall self");
    var directoryPath = path.dirname(electron_1.app.getPath("exe"));
    var versionFilePath = path.join(directoryPath, "version");
    var installerPath = path.join(__dirname, INSTALLER_WINDOWS_EXE_NAME);
    var installerConfigPath = path.join(__dirname, INSTALLER_WINDOWS_EXE_CONFIG_NAME);
    var tempDirectoryPath = getUninstallTempDirectoryPath();
    var tempInstallerPath = path.join(tempDirectoryPath, INSTALLER_WINDOWS_EXE_NAME);
    var tempInstallerConfigPath = path.join(tempDirectoryPath, INSTALLER_WINDOWS_EXE_CONFIG_NAME);
    var onError = function (error) {
        logger.writeError("Uninstall failed. [" + error.name + ": " + error.message + "]");
        exports.eventEmitter.emit(exports.UNINSTALL_SELF_FAILED_EVENT, error);
    };
    logger.writeVerbose("Deleting version file");
    var deleteVersionFilePromise = FileSystem_1.deleteFile(versionFilePath)
        .then(function () {
        logger.writeVerbose("Deleted version file successfully");
    }, function (e) {
        var errorMsg = e && typeof e.toString === "function" && e.toString();
        logger.writeWarning("Failed to delete version file... ignoring error: " + errorMsg);
    });
    FileSystem_1.makeDirectoryRecursive(tempDirectoryPath)
        .then(function () { return FileSystem_1.copyFile(installerPath, tempInstallerPath); })
        .then(function () { return FileSystem_1.copyFile(installerConfigPath, tempInstallerConfigPath); })
        .then(function () { return deleteVersionFilePromise; })
        .then(function () {
        var applicationId = APPLICATION_ARP_IDENTIFIER;
        var retryCount = DELETE_DIRECTORY_RETRY_COUNT.toString();
        var retryIntervalInMilliseconds = DELETE_DIRECTORY_RETRY_INTERVAL_IN_MILLISECONDS.toString();
        var uninstallParameters = [
            INSTALLER_UNINSTALL_PARAMETER,
            applicationId,
            package_1.APPLICATION_NAME,
            directoryPath,
            retryCount,
            retryIntervalInMilliseconds
        ];
        if (quiet) {
            uninstallParameters.push("/quiet");
        }
        // spawn can synchronously throw an exception for unknown reasons.
        try {
            logger.writeVerbose("Spawning uninstall stub");
            var spawnedProcess = child_process_1.spawn(tempInstallerPath, uninstallParameters, {
                detached: true
            });
            spawnedProcess.on("error", function (error) {
                onError(error);
            });
            spawnedProcess.unref();
            electron_1.app.quit();
        }
        catch (error) {
            onError(error);
        }
    })
        .catch(function (error) { return onError(error); });
}
exports.uninstall = uninstall;
function processArguments(args) {
    if (this.hasFinalizeInstallParameter(args)) {
        finalizeInstall();
        return InstallerOperation.FinalizedInstall;
    }
    else if (this.hasUninstallParameter(args)) {
        return InstallerOperation.Uninstalling;
    }
    return InstallerOperation.None;
}
exports.processArguments = processArguments;
function hasFinalizeInstallParameter(args) {
    return !!args.find(function (value) { return value.toLowerCase() === INSTALLER_FINALIZE_INSTALL_PARAMETER; });
}
exports.hasFinalizeInstallParameter = hasFinalizeInstallParameter;
function hasUninstallParameter(args) {
    return !!args.find(function (value) { return value.toLowerCase() === INSTALLER_UNINSTALL_PARAMETER; });
}
exports.hasUninstallParameter = hasUninstallParameter;
function getInstallerFinalizeInstallParameter() {
    return INSTALLER_FINALIZE_INSTALL_PARAMETER;
}
exports.getInstallerFinalizeInstallParameter = getInstallerFinalizeInstallParameter;
function getInstallerFinalizeUpdateParameter() {
    return INSTALLER_FINALIZE_UPDATE_PARAMETER;
}
exports.getInstallerFinalizeUpdateParameter = getInstallerFinalizeUpdateParameter;
function getInstallerUninstallParameter() {
    return INSTALLER_UNINSTALL_PARAMETER;
}
exports.getInstallerUninstallParameter = getInstallerUninstallParameter;
function getInstallerUpdateParameter() {
    return INSTALLER_UPDATE_PARAMETER;
}
exports.getInstallerUpdateParameter = getInstallerUpdateParameter;
//# sourceMappingURL=WindowsInstaller.js.map