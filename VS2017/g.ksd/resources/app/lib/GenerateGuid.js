/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
function GenerateGuid() {
    var hash = crypto_1.createHash("sha256");
    hash.update(Date.now().toString());
    var randomString = hash.digest("hex");
    return randomString.substring(0, 8) + "-" + randomString.substring(8, 12)
        + ("-4" + randomString.substring(13, 16) + "-9" + randomString.substring(17, 20))
        + ("-" + randomString.substring(20, 32));
}
exports.GenerateGuid = GenerateGuid;
//# sourceMappingURL=GenerateGuid.js.map