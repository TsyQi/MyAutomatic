/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Promise.prototype.finally = function (cb) {
    this.then(cb, cb);
};
//# sourceMappingURL=PromiseFinallyMixin.js.map