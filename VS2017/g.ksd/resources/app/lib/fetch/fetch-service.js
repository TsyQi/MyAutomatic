/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XMLHttpRequestReadyState;
(function (XMLHttpRequestReadyState) {
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["UNSENT"] = 0] = "UNSENT";
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["OPENED"] = 1] = "OPENED";
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["HEADERS_RECEIVED"] = 2] = "HEADERS_RECEIVED";
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["LOADING"] = 3] = "LOADING";
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["DONE"] = 4] = "DONE";
})(XMLHttpRequestReadyState = exports.XMLHttpRequestReadyState || (exports.XMLHttpRequestReadyState = {}));
var FetchOverXmlHttpRequest = /** @class */ (function () {
    function FetchOverXmlHttpRequest(requestFactory) {
        this._requestFactory = requestFactory;
    }
    FetchOverXmlHttpRequest.prototype.fetch = function (url, init) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var http = _this._requestFactory.getInstance();
            http.addEventListener("load", function () {
                var response = http.response;
                if (!response) {
                    reject(new Error("JSON parse failed when fetching: " + url));
                    return;
                }
                resolve(response);
            });
            http.addEventListener("timeout", function () {
                reject(new Error("Request timed out, url: " + url));
            });
            http.addEventListener("error", function () {
                reject(new Error("Error in XMLHttpRequest, url: " + url));
            });
            http.addEventListener("abort", function () {
                reject(new Error("Aborted XMLHttpRequest, url: " + url));
            });
            http.open(init.method || "GET", url, true);
            for (var _i = 0, _a = Array.from(init.headers.keys()); _i < _a.length; _i++) {
                var header = _a[_i];
                http.setRequestHeader(header, init.headers.get(header));
            }
            http.responseType = "json";
            http.send(init.body);
        });
    };
    return FetchOverXmlHttpRequest;
}());
exports.FetchOverXmlHttpRequest = FetchOverXmlHttpRequest;
//# sourceMappingURL=fetch-service.js.map