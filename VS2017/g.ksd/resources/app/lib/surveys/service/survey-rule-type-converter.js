"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var survey_rule_1 = require("../survey-rule");
var survey_rule_telemetry_properties_1 = require("../survey-rule-telemetry-properties");
var enum_1 = require("../../enum");
var survey_message_provider_1 = require("../survey-message-provider");
var Logger_1 = require("../../Logger");
var survey_configuration_1 = require("../survey-configuration");
var logger = Logger_1.getLogger();
function surveyConfigurationFromService(configuration) {
    if (!configuration) {
        return null;
    }
    return new survey_configuration_1.SurveyConfiguration(surveyRulesFromService(configuration.Rules));
}
exports.surveyConfigurationFromService = surveyConfigurationFromService;
function surveyRulesFromService(rules) {
    if (!rules) {
        return [];
    }
    return rules
        .map(function (rule) { return surveyRuleFromService(rule); }) // convert the rules
        .filter(function (rule) { return !!rule; }); // filter out invalid rules
}
exports.surveyRulesFromService = surveyRulesFromService;
/**
 * Converts the rule from the service. Will catch any exceptions thrown when converting and return null if one occurs.
 * @param rule The rule to convert
 * @returns {ISurveyRule | null} The converted survey rule, or null if an exception is thrown.
 */
function surveyRuleFromService(rule) {
    if (!rule) {
        return null;
    }
    try {
        return new survey_rule_1.SurveyRule(rule.EventName, rule.SurveyUrl, telemetryPropertiesFromService(rule.Properties), enum_1.EnumExtensions.getValueOfName(survey_message_provider_1.SurveyResourceId, rule.ResourceId), rule.Delay);
    }
    catch (error) {
        logger.writeError("Invalid survey rule from the service: " + error.message + " at " + error.stack);
    }
    return null;
}
exports.surveyRuleFromService = surveyRuleFromService;
function telemetryPropertiesFromService(properties) {
    return new survey_rule_telemetry_properties_1.SurveyRuleTelemetryProperties(properties && properties.Accept, properties && properties.Reject);
}
exports.telemetryPropertiesFromService = telemetryPropertiesFromService;
//# sourceMappingURL=survey-rule-type-converter.js.map