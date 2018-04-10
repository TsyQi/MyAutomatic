"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var InstallerServiceEvents;
(function (InstallerServiceEvents) {
    "use strict";
    // used for installing a channel item
    InstallerServiceEvents.INSTALL = "INSTALL";
    InstallerServiceEvents.INSTALL_CANCELED = "INSTALL_CANCELED";
    InstallerServiceEvents.INSTALL_FAILED = "INSTALL_FAILED";
    InstallerServiceEvents.INSTALL_STARTED = "INSTALL_STARTED";
    InstallerServiceEvents.INSTALL_SUCCESS = "INSTALL_SUCCESS";
    // used for launching an installation
    InstallerServiceEvents.LAUNCH = "LAUNCH";
    InstallerServiceEvents.LAUNCH_FAILED = "LAUNCH_FAILED";
    // used for normal uninstall of an installation
    InstallerServiceEvents.UNINSTALL = "UNINSTALL";
    InstallerServiceEvents.UNINSTALL_CANCELED = "UNINSTALL_CANCELED";
    InstallerServiceEvents.UNINSTALL_FAILED = "UNINSTALL_FAILED";
    InstallerServiceEvents.UNINSTALL_STARTED = "UNINSTALL_STARTED";
    InstallerServiceEvents.UNINSTALL_SUCCESS = "UNINSTALL_SUCCESS";
    // used for updating an installation
    InstallerServiceEvents.UPDATE = "UPDATE";
    InstallerServiceEvents.UPDATE_CANCELED = "UPDATE_CANCELED";
    InstallerServiceEvents.UPDATE_FAILED = "UPDATE_FAILED";
    InstallerServiceEvents.UPDATE_STARTED = "UPDATE_STARTED";
    InstallerServiceEvents.UPDATE_SUCCESS = "UPDATE_SUCCESS";
    // used for cancelling an installation in progress
    InstallerServiceEvents.CANCEL_REQUESTED = "CANCEL_REQUESTED";
    // used for handling events from installer engine
    InstallerServiceEvents.OPERATION_PROGRESS = "OPERATION_PROGRESS";
    InstallerServiceEvents.OPERATION_ERROR = "OPERATION_ERROR";
    // used for uninstalling xStation
    InstallerServiceEvents.UNINSTALL_SELF_REQUEST = "UNINSTALL_SELF_REQUEST";
    InstallerServiceEvents.UNINSTALL_SELF_STARTED = "UNINSTALL_SELF_STARTED";
    InstallerServiceEvents.UNINSTALL_SELF_FAILED = "UNINSTALL_SELF_FAILED";
    InstallerServiceEvents.UNINSTALL_SELF_IS_SINGLETON = "UNINSTALL_SELF_IS_SINGLETON";
    // used for "force removal" of a corrupt installation
    InstallerServiceEvents.FORCE_REMOVE_ENTRY = "FORCE_REMOVE_ENTRY";
    InstallerServiceEvents.FORCE_REMOVE_ENTRY_STARTED = "FORCE_REMOVE_ENTRY_STARTED";
    InstallerServiceEvents.FORCE_REMOVE_ENTRY_SUCCESS = "FORCE_REMOVE_ENTRY_SUCCESS";
    InstallerServiceEvents.CHECK_DOTNET_FRAMEWORK_VERSION = "CHECK_DOTNET_FRAMEWORK_VERSION";
})(InstallerServiceEvents = exports.InstallerServiceEvents || (exports.InstallerServiceEvents = {}));
//# sourceMappingURL=InstallerServiceEvents.js.map