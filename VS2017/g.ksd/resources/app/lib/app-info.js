"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("./requires");
var AppInfo = /** @class */ (function () {
    function AppInfo(appName, appVersion, branchName) {
        requires.stringNotEmpty(appName, "appName");
        requires.stringNotEmpty(appVersion, "appVersion");
        this.appName = appName;
        this.appVersion = appVersion;
        this.branchName = branchName;
    }
    return AppInfo;
}());
exports.AppInfo = AppInfo;
//# sourceMappingURL=app-info.js.map