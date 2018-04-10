/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_service_1 = require("../../lib/fetch/fetch-service");
var xml_http_request_factory_1 = require("../xml-http-request-factory");
function getFetchService() {
    return new fetch_service_1.FetchOverXmlHttpRequest(new xml_http_request_factory_1.RendererXMLHttpRequestFactory());
}
exports.getFetchService = getFetchService;
//# sourceMappingURL=fetch-service-factory.js.map