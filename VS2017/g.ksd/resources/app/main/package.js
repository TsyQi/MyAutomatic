/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_info_1 = require("../lib/app-info");
/* tslint:disable:no-var-requires no-require-imports */
var packageJson = require("../package.json");
/* tslint:enable */
exports.BRANCH_NAME = packageJson.branch;
exports.APPLICATION_NAME = packageJson.description;
exports.EXE_NAME = packageJson.name;
exports.EXE_VERSION = packageJson.version;
exports.ARP_DESCRIPTION = packageJson.arp_description;
exports.APP_INFO = new app_info_1.AppInfo(exports.EXE_NAME, exports.EXE_VERSION, exports.BRANCH_NAME);
//# sourceMappingURL=package.js.map