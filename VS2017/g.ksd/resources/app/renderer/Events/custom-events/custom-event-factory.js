/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
var CustomEventFactory = /** @class */ (function () {
    function CustomEventFactory() {
    }
    CustomEventFactory.prototype.createEvent = function (name, initDict) {
        return new CustomEvent(name, initDict);
    };
    CustomEventFactory.default = new CustomEventFactory();
    return CustomEventFactory;
}());
exports.CustomEventFactory = CustomEventFactory;
//# sourceMappingURL=custom-event-factory.js.map