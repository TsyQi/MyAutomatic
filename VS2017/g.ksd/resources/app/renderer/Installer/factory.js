/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var window_1 = require("../window");
var InstallerProxy_1 = require("./InstallerProxy");
exports.installerProxy = (new InstallerProxy_1.InstallerProxy(window_1.client.controllerReadyPromise));
//# sourceMappingURL=factory.js.map