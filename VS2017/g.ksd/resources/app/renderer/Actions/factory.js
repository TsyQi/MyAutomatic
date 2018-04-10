/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var OpenFeedbackClientModule = require("./open-feedback-client-action");
var options_dropdown_actions_1 = require("./options-dropdown-actions");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var view_problems_actions_1 = require("./view-problems-actions");
var autolaunch_actions_1 = require("./autolaunch-actions");
var factory_1 = require("../stores/factory");
var details_page_actions_1 = require("./details-page-actions");
var progress_timer_actions_1 = require("./progress-timer-actions");
exports.optionsDropdownActions = new options_dropdown_actions_1.OptionsDropdownActions(TelemetryProxy_1.telemetryProxy);
exports.viewProblemsActions = new view_problems_actions_1.ViewProblemsActions(dispatcher_1.dispatcher, OpenFeedbackClientModule, TelemetryProxy_1.telemetryProxy);
exports.autolaunchActions = new autolaunch_actions_1.AutolaunchActions(dispatcher_1.dispatcher, TelemetryProxy_1.telemetryProxy);
exports.detailsPageActions = new details_page_actions_1.DetailsPageActions(TelemetryProxy_1.telemetryProxy, factory_1.appStore);
exports.progressTimerActions = new progress_timer_actions_1.ProgressTimerActions();
//# sourceMappingURL=factory.js.map