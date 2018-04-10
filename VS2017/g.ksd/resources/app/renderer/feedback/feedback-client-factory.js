/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var feedback_client_1 = require("../../lib/feedback/feedback-client");
var feedback_info_provider_factory_1 = require("./feedback-info-provider-factory");
var fetch_service_factory_1 = require("../fetch/fetch-service-factory");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
function getFeedbackClient() {
    return new feedback_client_1.FeedbackClient(fetch_service_factory_1.getFetchService(), feedback_info_provider_factory_1.getFeedbackInfoProvider(), TelemetryProxy_1.telemetryProxy);
}
exports.getFeedbackClient = getFeedbackClient;
//# sourceMappingURL=feedback-client-factory.js.map