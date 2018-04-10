/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var bucket_parameters_1 = require("../../lib/Telemetry/bucket-parameters");
var TelemetryEventNames = require("../Telemetry/TelemetryEventNames");
var requires = require("../requires");
var SEARCH_POST_URL = "https://sendvsfeedback.cloudapp.net/api/SearchQuery/searchV2";
var SOLUTIONS_POST_URL = "https://sendvsfeedback.cloudapp.net/api/detailsV2/solutions";
var defaultFeedbackInfo = {
    branchName: "",
    culture: "",
    exeName: "",
    exeVersion: "",
    uiCulture: "",
    userId: "",
};
var FeedbackClient = /** @class */ (function () {
    function FeedbackClient(fetchService, infoProvider, telemetry) {
        requires.notNullOrUndefined(fetchService, "fetchService");
        requires.notNullOrUndefined(infoProvider, "infoProvider");
        requires.notNullOrUndefined(telemetry, "telemetry");
        this._fetchService = fetchService;
        this._info = infoProvider.getInfo().catch(function () { return defaultFeedbackInfo; });
        this._telemetry = telemetry;
    }
    /**
     * Searches the public feedback api for matching issues and solutions
     * @param failedPackage {IInstalledProductPackageError} the package that failed
     * @param info {IFeedbackInfo} required to make the request
     */
    FeedbackClient.prototype.search = function (failedPackage) {
        var _this = this;
        this._telemetry.postOperation(TelemetryEventNames.FEEDBACK_SEARCH_STARTED, vs_telemetry_api_1.TelemetryResult.None, "search started", {
            failedPackageId: failedPackage && failedPackage.id,
            failedPackageAction: failedPackage && failedPackage.action,
            failedPackageReturnCode: failedPackage && failedPackage.returnCode,
        });
        if (!failedPackage) {
            this.sendSearchFinishedTelemetry("null failedPackage", false, false, null);
            return Promise.resolve({
                bestResult: null,
                failedPackage: null,
                hasSolutions: false,
                hasAcceptedSolutions: false,
            });
        }
        return this._info
            .then(function (info) {
            var headers = _this.createRequestHeaders();
            var body = _this.createRequestBody({
                searchFor: {
                    "trackingId": null,
                    "source": "Send a smile",
                    "version": 2,
                    "text": "",
                    "sentiment": 0,
                    "culture": info.culture,
                    "uiculture": info.uiCulture,
                    "tags": [
                        {
                            "type": "user-id",
                            "value": info.userId,
                        },
                        {
                            "type": "product-version",
                            "value": info.exeVersion,
                        },
                        {
                            "type": "product",
                            "value": info.exeName,
                        },
                        {
                            "type": "setup-branch-version",
                            "value": _this.getSetupBranchVersion(info),
                        },
                        {
                            "type": "product-build-branch",
                            "value": info.branchName,
                        },
                        {
                            "type": "product-build",
                            "value": _this.getProductBuild(info),
                        },
                        {
                            "type": "os-version",
                            "value": os_1.release(),
                        },
                    ],
                    "title": failedPackage.signature,
                },
                skip: 0,
                take: 5,
                sort: "votes",
                filter: "all",
                columnsToFilterBy: [
                    {
                        "columnName": "setupOperation",
                        "value": failedPackage.action
                    },
                    {
                        "columnName": "setupPackageId",
                        "value": failedPackage.id
                    },
                    {
                        "columnName": "setupCode",
                        "value": failedPackage.returnCode
                    },
                ]
            });
            var requestInit = {
                body: body,
                method: "POST",
                mode: "cors",
                headers: headers,
            };
            var hasSolutions = false;
            var hasAcceptedSolutions = false;
            return _this._fetchService.fetch(SEARCH_POST_URL, requestInit)
                .then(function (response) {
                return response;
            })
                .then(function (response) {
                if (!Array.isArray(response.results) || response.results.length === 0) {
                    _this.sendSearchFinishedTelemetry("no results", hasSolutions, hasAcceptedSolutions, failedPackage);
                    return {
                        bestResult: null,
                        failedPackage: failedPackage,
                        hasSolutions: hasSolutions,
                        hasAcceptedSolutions: hasAcceptedSolutions,
                    };
                }
                return _this.processSolutions(failedPackage, response);
            })
                .catch(function (error) {
                hasSolutions = false;
                hasAcceptedSolutions = false;
                _this.sendSearchFinishedTelemetry("failed to fetch results", hasSolutions, hasAcceptedSolutions, failedPackage, error);
                return {
                    bestResult: null,
                    failedPackage: failedPackage,
                    hasSolutions: hasSolutions,
                    hasAcceptedSolutions: hasAcceptedSolutions,
                };
            });
        });
    };
    FeedbackClient.prototype.processSolutions = function (failedPackage, response) {
        var _this = this;
        var hasAcceptedSolutions = false;
        var hasSolutions = false;
        var items = response.results;
        var solutionPromises = items
            .filter(function (item) { return item.solutionCount > 0; })
            .map(function (item) {
            return _this.getSolutions(item.trackingId, item.requestId.toString(), item.answerHubId.toString())
                .then(function (solutions) {
                return {
                    item: item,
                    solutions: solutions,
                };
            });
        });
        this._telemetry.postOperation(TelemetryEventNames.FEEDBACK_CHECKING_SOLUTIONS, vs_telemetry_api_1.TelemetryResult.Success, "checking for solutions", {
            hasAcceptedSolutions: hasAcceptedSolutions.toString(),
            hasSolutions: hasSolutions.toString(),
            failedPackageAction: failedPackage.action,
            failedPackageId: failedPackage.id,
            failedPackageReturnCode: failedPackage.returnCode,
        });
        return Promise.all(solutionPromises)
            .then(function (feedbackSolutionPairs) {
            hasSolutions = false;
            hasAcceptedSolutions = false;
            // iterate through the set of solutions from each post
            var bestResult;
            for (var _i = 0, feedbackSolutionPairs_1 = feedbackSolutionPairs; _i < feedbackSolutionPairs_1.length; _i++) {
                var postResults = feedbackSolutionPairs_1[_i];
                if (postResults.solutions.length > 0) {
                    hasSolutions = true;
                    // initialize bestResult to the first result
                    // with solutions
                    if (!bestResult) {
                        bestResult = postResults.item;
                    }
                    var acceptedResult = postResults.solutions
                        .find(function (solution) { return solution.isAccepted; });
                    // if there we find an accepted result,
                    // take that as best result and stop searching
                    if (acceptedResult) {
                        bestResult = postResults.item;
                        hasAcceptedSolutions = true;
                        break;
                    }
                }
            }
            _this.sendSearchFinishedTelemetry("solutions found", hasSolutions, hasAcceptedSolutions, failedPackage);
            return {
                bestResult: bestResult,
                failedPackage: failedPackage,
                hasSolutions: hasSolutions,
                hasAcceptedSolutions: hasAcceptedSolutions,
            };
        });
    };
    FeedbackClient.prototype.getSolutions = function (trackingId, requestId, answerHubId) {
        var _this = this;
        return this._info
            .then(function (info) {
            var headers = _this.createRequestHeaders();
            var body = _this.createRequestBody({
                requestVersion: 1,
                skip: 0,
                take: 5,
                orderby: "votes",
                answerHubId: answerHubId,
                userIdMakingRequest: info.userId,
                trackingId: trackingId,
                detailsRequestId: answerHubId,
                answersSkip: 0,
                answersTake: 5,
                ordering: "votes",
            });
            var requestInit = {
                body: body,
                headers: headers,
                method: "POST",
                mode: "cors",
            };
            return _this._fetchService.fetch(SOLUTIONS_POST_URL, requestInit)
                .then(function (response) {
                return response;
            })
                .then(function (response) {
                return response.answers;
            })
                .catch(function (error) {
                return [];
            });
        });
    };
    FeedbackClient.prototype.createRequestBody = function (body) {
        return new Blob([
            JSON.stringify(body),
        ]);
    };
    FeedbackClient.prototype.createRequestHeaders = function () {
        var headers = new Map();
        headers.set("Content-Type", "application/json");
        return headers;
    };
    FeedbackClient.prototype.getSetupBranchVersion = function (info) {
        return info.exeName + "/" + info.branchName + "/" + info.exeVersion;
    };
    FeedbackClient.prototype.getProductBuild = function (info) {
        return info.exeName + "." + info.exeVersion;
    };
    FeedbackClient.prototype.sendSearchFinishedTelemetry = function (summary, hasSolutions, hasAcceptedSolutions, failedPackage, error) {
        var properties = {
            hasSolutions: hasSolutions.toString(),
            hasAcceptedSolutions: hasAcceptedSolutions.toString(),
            failedPackageAction: failedPackage && failedPackage.action,
            failedPackageId: failedPackage && failedPackage.id,
            failedPackageReturnCode: failedPackage && failedPackage.returnCode,
            error: error && error.message,
        };
        this._telemetry.postOperation(TelemetryEventNames.FEEDBACK_SEARCH_FINISHED, !error ? vs_telemetry_api_1.TelemetryResult.Success : vs_telemetry_api_1.TelemetryResult.Failure, summary, properties);
        if (!!error) {
            this._telemetry.postError(TelemetryEventNames.FEEDBACK_SEARCH_FAILED, summary, new bucket_parameters_1.BucketParameters("search", this.constructor.name), error, properties);
        }
    };
    return FeedbackClient;
}());
exports.FeedbackClient = FeedbackClient;
//# sourceMappingURL=feedback-client.js.map