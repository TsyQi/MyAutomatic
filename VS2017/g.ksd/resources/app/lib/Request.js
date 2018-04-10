/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
var https = require("https");
var originalHttpsRequest = https.request;
var isReady = electron.app.isReady();
if (!isReady) {
    electron.app.once("ready", function () {
        isReady = true;
    });
}
function httpsRequest(options, cb) {
    if (!isReady) {
        console.log("Warning: https.request called before app 'ready'. Proxy support may not be ready");
        return originalHttpsRequest(options, cb);
    }
    // override protocol for https requests
    options.protocol = "https:";
    var request = electron.net.request(options);
    request.once("response", function (res) { return cb(res); });
    return request;
}
exports.httpsRequest = httpsRequest;
//# sourceMappingURL=Request.js.map