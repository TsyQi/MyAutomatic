/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RendererXMLHttpRequestFactory = /** @class */ (function () {
    function RendererXMLHttpRequestFactory() {
    }
    RendererXMLHttpRequestFactory.prototype.getInstance = function () {
        return new XMLHttpRequest();
    };
    return RendererXMLHttpRequestFactory;
}());
exports.RendererXMLHttpRequestFactory = RendererXMLHttpRequestFactory;
//# sourceMappingURL=xml-http-request-factory.js.map