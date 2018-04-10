/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstallingState;
(function (InstallingState) {
    InstallingState[InstallingState["Installing"] = 0] = "Installing";
    InstallingState[InstallingState["NotInstalling"] = 1] = "NotInstalling";
    InstallingState[InstallingState["Repairing"] = 2] = "Repairing";
    InstallingState[InstallingState["Uninstalling"] = 3] = "Uninstalling";
    InstallingState[InstallingState["Updating"] = 4] = "Updating";
    InstallingState[InstallingState["Modifying"] = 5] = "Modifying";
    InstallingState[InstallingState["Pausing"] = 6] = "Pausing";
})(InstallingState = exports.InstallingState || (exports.InstallingState = {}));
//# sourceMappingURL=InstallingState.js.map