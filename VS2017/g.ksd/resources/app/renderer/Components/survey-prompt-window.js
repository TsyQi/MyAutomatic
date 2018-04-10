/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../bower_components/riot-ts/riot-ts.d.ts" />
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var factory_1 = require("../stores/factory");
var error_message_response_1 = require("../interfaces/error-message-response");
var css_styles_1 = require("../css-styles");
var KeyCodes_1 = require("../KeyCodes");
var open_external_1 = require("../../lib/open-external");
var querystring_1 = require("querystring");
var electron_1 = require("electron");
var Utilities_1 = require("../Utilities");
var local_storage_1 = require("../local-storage");
exports.USER_SURVEY_SETTINGS_KEY = "AppStore.promptForSurvey";
require("./error-dialog");
/* istanbul ignore next */
var SurveyPromptWindow = /** @class */ (function (_super) {
    __extends(SurveyPromptWindow, _super);
    function SurveyPromptWindow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onErrorStoreUpdateBind = _this.onErrorStoreUpdate.bind(_this);
        _this._localStorage = new local_storage_1.LocalStorage(exports.USER_SURVEY_SETTINGS_KEY);
        return _this;
    }
    SurveyPromptWindow.prototype.mounted = function () {
        this.hookEvents(true);
        window.addEventListener("keyup", function (ev) {
            if (ev.keyCode === KeyCodes_1.keyCodes.F12) {
                // if we're in debug mode, open dev tools when F12 is pressed,
                // if we're not in debug mode, open dev tools when Ctrl+Alt+Shift+F12 is pressed
                if ((ev.ctrlKey && ev.altKey && ev.shiftKey)) {
                    Utilities_1.openDevTools();
                }
            }
        });
        var queryStringParts = querystring_1.parse(window.location.search.substr(1));
        this.promptForSurvey(queryStringParts)
            .finally(function () {
            var window = electron_1.remote.getCurrentWindow();
            window.close();
        });
    };
    SurveyPromptWindow.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    Object.defineProperty(SurveyPromptWindow.prototype, "acceptErrorCallback", {
        get: function () {
            return factory_1.errorStore.dismiss;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyPromptWindow.prototype, "errorMessage", {
        get: function () {
            return factory_1.errorStore.currentMessageData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyPromptWindow.prototype, "isErrorVisible", {
        get: function () {
            return factory_1.errorStore.isErrorVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyPromptWindow.prototype, "frameStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                boxShadow: "2px 2px 1px rgba(0, 0, 0, .2)",
                height: "calc(100% - 2px)",
                width: "calc(100% - 2px)"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    SurveyPromptWindow.prototype.onErrorStoreUpdate = function () {
        this.update();
    };
    /**
     * Prompts the user to take a survey
     *
     * @param {ISurveyPromptOptions} options - parsed query parameters
     * @returns {Promise<boolean>} - true if the user chose to take the survey, false if he chose not to take the survey
     */
    SurveyPromptWindow.prototype.promptForSurvey = function (options) {
        var _this = this;
        if (!options || !options.surveyUrl || !options.sessionId) {
            return Promise.resolve(false);
        }
        // If we cannot prompt for this survey, bail out.
        if (!this.canPromptForSurvey(options.surveyUrl)) {
            return Promise.resolve(false);
        }
        // Since we can prompt for a survey, show the window
        this.show();
        var surveyUrlWithSessionId = options.surveyUrl + "&sessionid=" + options.sessionId;
        var errorOptions = {
            title: options.title,
            message: options.message,
            okButtonText: options.okText,
            cancelButtonText: options.cancelText,
            allowCancel: true,
            allowOptOut: true,
            hideSupportLink: true,
            errorName: "Survey prompt",
        };
        return factory_1.errorStore.show(errorOptions)
            .then(function (response) {
            if (response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                _this.setSurveyAsTaken(options.surveyUrl);
                open_external_1.openExternal(surveyUrlWithSessionId);
            }
            if (response.isOptedOut) {
                _this.setOptedOut();
            }
            return response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT;
        });
    };
    /**
     * Hooks or unhooks events for this component
     */
    SurveyPromptWindow.prototype.hookEvents = function (hook) {
        // (un)hook events on the error store
        var hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.errorStore, hook);
        hookMethod(factory_1.errorStore.CHANGED_EVENT, this._onErrorStoreUpdateBind);
    };
    SurveyPromptWindow.prototype.canPromptForSurvey = function (surveyUrl) {
        var settings = this.getSettings();
        var surveysTaken = new Set(settings.surveyUrlsTaken);
        return !settings.optedOut && !surveysTaken.has(surveyUrl);
    };
    SurveyPromptWindow.prototype.setOptedOut = function () {
        var currentSettings = this.getSettings();
        currentSettings.optedOut = true;
        this.storeSettings(currentSettings);
    };
    SurveyPromptWindow.prototype.setSurveyAsTaken = function (url) {
        var settings = this.getSettings();
        var surveysTaken = new Set(settings.surveyUrlsTaken);
        surveysTaken.add(url);
        settings.surveyUrlsTaken = Array.from(surveysTaken.values());
        this.storeSettings(settings);
    };
    SurveyPromptWindow.prototype.storeSettings = function (settings) {
        // Ensure surveys are an array and opted out is a boolean
        settings.optedOut = !!settings.optedOut;
        settings.surveyUrlsTaken = settings.surveyUrlsTaken || [];
        return this._localStorage.tryStoreItem(settings);
    };
    SurveyPromptWindow.prototype.getSettings = function () {
        var info = this._localStorage.tryGetItem();
        if (!info) {
            return {
                optedOut: false,
                surveyUrlsTaken: [],
            };
        }
        // Ensure that the opt out setting is a boolean and the urls is an array.
        info.optedOut = !!info.optedOut;
        info.surveyUrlsTaken = info.surveyUrlsTaken || [];
        return info;
    };
    SurveyPromptWindow.prototype.show = function () {
        var window = electron_1.remote.getCurrentWindow();
        window.show();
    };
    SurveyPromptWindow = __decorate([
        template("\n<survey-prompt-window>\n    <div class=\"survey-prompt-window-frame\"\n         style={this.frameStyle}>\n        <error-dialog if={this.isErrorVisible}\n                      error-message={this.errorMessage}\n                      onsubmit={this.acceptErrorCallback}\n                      fillparent={true} />\n    </div>\n</survey-prompt-window>")
    ], SurveyPromptWindow);
    return SurveyPromptWindow;
}(Riot.Element));
exports.SurveyPromptWindow = SurveyPromptWindow;
riot.mount("*");
//# sourceMappingURL=survey-prompt-window.js.map