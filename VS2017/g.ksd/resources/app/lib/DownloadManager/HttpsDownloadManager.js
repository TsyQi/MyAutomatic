/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Request_1 = require("../Request");
var url_1 = require("url");
var HTTP_STATUS_CODE_REDIRECTION_MOVED_PERMANENTLY = 301;
var HTTP_STATUS_CODE_REDIRECTION_FOUND = 302;
var REDIRECT_ERROR_MESSAGE = "REDIRECT";
var REDIRECT_ERROR_NAME = REDIRECT_ERROR_MESSAGE;
var DEFAULT_HTTPS_PORT = 443;
var RedirectError = /** @class */ (function (_super) {
    __extends(RedirectError, _super);
    function RedirectError(statusCode, redirectUri) {
        var _this = _super.call(this, REDIRECT_ERROR_MESSAGE) || this;
        _this.name = REDIRECT_ERROR_NAME;
        _this.redirectUri = redirectUri;
        Object.setPrototypeOf(_this, RedirectError.prototype);
        return _this;
    }
    return RedirectError;
}(Error));
/**
 * Downloads the content retrieved from the specified URI to the writable stream.
 *
 * @param uri The URI to download the content from.
 * @param writeStream The writable stream to write the URI's content to.
 * @return A promise.
 */
function getResource(uri, writeStream) {
    return getRedirectUri(uri).then(function (finalUri) {
        var options = getHttpsGetOptions(finalUri);
        return new Promise(function (resolve, reject) {
            var request;
            var errorOccured = false;
            writeStream.once("error", function (error) {
                errorOccured = true;
                if (request) {
                    request.abort();
                }
                reject(error);
            });
            request = Request_1.httpsRequest(options, function (responseStream) {
                responseStream.on("data", function (chunk) {
                    if (!errorOccured) {
                        writeStream.write(chunk);
                    }
                });
                responseStream.once("end", function () { return resolve(); });
            });
            request.once("error", reject);
            request.end();
        });
    });
}
exports.getResource = getResource;
/**
 * Downloads the content retrieved from the specified URI and returns it as a string.
 *
 * @param uri The URI to download the content from.
 * @return A promise with a value containing the content as a stream.
 */
function getResourceAsString(uri) {
    return getRedirectUri(uri).then(function (finalUri) {
        var options = getHttpsGetOptions(finalUri);
        return new Promise(function (resolve, reject) {
            var responseAsString = "";
            var request = Request_1.httpsRequest(options, function (responseStream) {
                responseStream.on("data", function (chunk) {
                    responseAsString = responseAsString + chunk;
                });
                responseStream.once("end", function () {
                    resolve(responseAsString);
                });
            });
            request.once("error", reject);
            request.end();
        });
    });
}
exports.getResourceAsString = getResourceAsString;
function getHttpsGetOptions(uri) {
    var url = url_1.parse(uri, true /* parseQueryString */);
    if (url.protocol !== "https:") {
        throw new Error("HttpsDownloadManager only supports URI's with the HTTPS protocol.");
    }
    return {
        method: "GET",
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: (url.port && parseInt(url.port, 10 /* radix */)) || DEFAULT_HTTPS_PORT,
        path: url.path
    };
}
exports.getHttpsGetOptions = getHttpsGetOptions;
/**
 * Resolves a URI request that returns 301 or 302 to the redirected URI
 *
 * @param uri The URI to resolve.
 * @return A promise with the redirected URI.
 */
function getRedirectUri(uri) {
    // getRedirectUri is called recursively until a redirect status code is not returned
    // from a redirection URI
    // innerGetRedirectUri rejects the promise with RedirectError if the getting the URI results
    // in a status code of 301 or 302; otherwise, the promise is resolved to the first URI
    // that doesn't have a status code of 301 or 302
    function innerGetRedirectUri(options) {
        return new Promise(function (resolve, reject) {
            var request = Request_1.httpsRequest(options, function (responseStream) {
                if (responseStream.statusCode === HTTP_STATUS_CODE_REDIRECTION_MOVED_PERMANENTLY ||
                    responseStream.statusCode === HTTP_STATUS_CODE_REDIRECTION_FOUND) {
                    reject(new RedirectError(responseStream.statusCode, responseStream.headers.location));
                    return;
                }
                request.abort();
                resolve(uri);
            });
            request.once("error", reject);
            request.end();
        });
    }
    return innerGetRedirectUri(getHttpsGetOptions(uri))
        .catch(function (error) {
        // the URI request was redirected, try the new URI if any
        if (error instanceof RedirectError && error.redirectUri) {
            return getRedirectUri(error.redirectUri);
        }
        else {
            return Promise.reject(error);
        }
    });
}
exports.getRedirectUri = getRedirectUri;
/**
 * This is a wrapper of the request node modoule that send https request,
 * returns a promise and handles HTTP errors.
 * @param requestData, which contains method, url, body and headers
 * @return A promise with a value of status code.
 */
function sendHttpsRequest(requestData) {
    var _this = this;
    return getRedirectUri(requestData.url).then(function (finalUri) {
        requestData.url = finalUri;
        var postRequestOptions = _this.getRequestOptions(requestData);
        return new Promise(function (resolve, reject) {
            var req = Request_1.httpsRequest(postRequestOptions, function (res) {
                res.on("data", function (d) {
                    resolve(res.statusCode.toString());
                });
            });
            req.write(requestData.body);
            req.end();
            /* istanbul ignore next */
            req.on("error", function (e) {
                reject(e);
            });
        });
    });
}
exports.sendHttpsRequest = sendHttpsRequest;
function getRequestOptions(options) {
    var url = url_1.parse(options.url, true /* parseQueryString */);
    /* istanbul ignore next */
    if (url.protocol !== "https:") {
        throw new Error("Only supports URI's with the HTTPS protocol.");
    }
    return {
        hostname: url.hostname,
        port: (url.port && parseInt(url.port, 10 /* radix */)) || DEFAULT_HTTPS_PORT,
        path: url.path,
        method: options.method,
        headers: options.headers
    };
}
exports.getRequestOptions = getRequestOptions;
//# sourceMappingURL=HttpsDownloadManager.js.map