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
var css_styles_1 = require("../css-styles");
var Utilities_1 = require("../Utilities");
var KeyCodes_1 = require("../KeyCodes");
var open_external_1 = require("../../lib/open-external");
var open_feedback_client_action_1 = require("../Actions/open-feedback-client-action");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var WindowActions_1 = require("../Actions/WindowActions");
var exit_details_1 = require("../../lib/exit-details");
require("./app-logo");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
var apply_mixins_1 = require("../mixins/apply-mixins");
var MenuDropdownState;
(function (MenuDropdownState) {
    MenuDropdownState[MenuDropdownState["Hidden"] = 0] = "Hidden";
    MenuDropdownState[MenuDropdownState["Showing"] = 1] = "Showing";
    MenuDropdownState[MenuDropdownState["Shown"] = 2] = "Shown";
    MenuDropdownState[MenuDropdownState["Hiding"] = 3] = "Hiding";
})(MenuDropdownState = exports.MenuDropdownState || (exports.MenuDropdownState = {}));
/* istanbul ignore next */
var AppHeader = /** @class */ (function (_super) {
    __extends(AppHeader, _super);
    function AppHeader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this._scheduleUpdateBind = _this.scheduleUpdate.bind(_this);
        _this._losingFocus = false;
        _this._dropdownState = MenuDropdownState.Hidden;
        _this._onFocusOutBind = _this.onFocusOut.bind(_this);
        _this._onKeyDownBind = _this.onKeyDown.bind(_this);
        return _this;
    }
    AppHeader.prototype.mounted = function () {
        this._feedbackButton = document.getElementById(this.feedbackDropdownButtonId);
        this.hookEventListeners(true);
    };
    AppHeader.prototype.unmounted = function () {
        this.hookEventListeners(false);
        this.hookMenuEventListeners(false);
    };
    AppHeader.prototype.updated = function () {
        if (this._dropdownState === MenuDropdownState.Showing) {
            this._dropdownState = MenuDropdownState.Shown;
            this._feedbackButton.tabIndex = -1;
            // The feedback menu doesn't exist in the DOM until it is opened
            // On first opening, set the private member to be the menu then hook up the listeners
            if (!this._feedbackMenu) {
                this._feedbackMenu = document.getElementById(this.feedbackDropdownMenuId);
                this.hookMenuEventListeners(true);
            }
            var firstOption = this._feedbackMenu.firstElementChild;
            firstOption.focus();
        }
        if (this._dropdownState === MenuDropdownState.Hiding) {
            this._dropdownState = MenuDropdownState.Hidden;
            this._feedbackButton.tabIndex = 0;
        }
    };
    Object.defineProperty(AppHeader.prototype, "isDropdownOpen", {
        get: function () {
            return this._dropdownState === MenuDropdownState.Showing ||
                this._dropdownState === MenuDropdownState.Shown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "closeButtonTitle", {
        get: function () {
            return this.resourceStrings.closeButtonTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "closeButtonId", {
        get: function () {
            return "app-header-close-button";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "maximizeOrRestoreButtonTitle", {
        get: function () {
            return this.resourceStrings.maximizeOrRestoreButtonTitle(factory_1.appStore.maximized);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "minimizeButtonTitle", {
        get: function () {
            return this.resourceStrings.minimizeButtonTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "provideFeedbackMenuTitle", {
        get: function () {
            return this.resourceStrings.provideFeedbackMenuTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "feedbackDropdownMenuId", {
        get: function () {
            return "feedback-dropdown-menu";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "feedbackDropdownButtonId", {
        get: function () {
            return "feedback-dropdown-button";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "feedbackDropdownMenuItemId", {
        get: function () {
            return "feedback-dropdown-menu-item";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "showAppVersion", {
        get: function () {
            return this.opts.showlogo && !!this.opts.appversion;
        },
        enumerable: true,
        configurable: true
    });
    AppHeader.prototype.handleReportProblemClicked = function () {
        var channelIds = factory_1.appStore.allChannels.map(function (channel) { return channel.id; });
        open_feedback_client_action_1.openFeedbackClient(channelIds);
        this.toggleFeedbackMenu();
    };
    AppHeader.prototype.handleProvideSuggestionClicked = function () {
        open_external_1.openExternal("https://go.microsoft.com/fwlink/?LinkId=624145");
        this.toggleFeedbackMenu();
    };
    AppHeader.prototype.toggleFeedbackMenu = function () {
        if (this._dropdownState === MenuDropdownState.Hidden) {
            this._dropdownState = MenuDropdownState.Showing;
        }
        else if (this._dropdownState === MenuDropdownState.Shown) {
            this._dropdownState = MenuDropdownState.Hiding;
        }
        this.scheduleUpdate();
    };
    AppHeader.prototype.handleExitClicked = function () {
        WindowActions_1.windowActions.closeWindow(exit_details_1.CreateSuccessExitDetails());
    };
    AppHeader.prototype.handleMinimizeClicked = function () {
        WindowActions_1.windowActions.minimizeWindow();
    };
    AppHeader.prototype.handleMaximizeOrRestoreClicked = function () {
        WindowActions_1.windowActions.maximizeOrRestoreWindow();
    };
    AppHeader.prototype.preventClickFocus = function (event) {
        event.preventDefault();
    };
    Object.defineProperty(AppHeader.prototype, "appHeaderDivStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                fontSize: "0.75rem",
                height: "100%",
                justifyContent: "space-between",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "appLogoStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "block",
                height: "22px",
                maxWidth: "50%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "resizableRegionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "2px",
                position: "absolute",
                webkitAppRegion: "no-drag",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "vsLogoDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "1 0 0px",
                margin: "2px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "nonClientDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignSelf: "baseline",
                display: "flex",
                justifyContent: "space-between",
                margin: "0px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "nonClientFeedbackDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "nonClientButtonDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "baseline",
                display: "flex",
                justifyContent: "flex-end"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "nonClientImageButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignSelf: "flex-end",
                height: "24px",
                padding: "2px 0px 0px 0px",
                width: "24px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "nonClientButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "24px",
                padding: "0px",
                width: "24px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "nonClientSvgStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "14px",
                paddingTop: "2px",
                width: "14px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "pathStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fill: "inherit"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "dropdownContentDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                /* this "color" is left here because it is really an opacity */
                boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
                outline: "none",
                overflow: "hidden",
                webkitAppRegion: "no-drag",
                zIndex: "1"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "dropdownContentButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                border: "none",
                display: "block",
                height: "30px",
                lineHeight: "18px",
                minWidth: "180px",
                padding: "0px 6px",
                textAlign: "left",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "dropdownContentImageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                float: "left",
                margin: "7px 10px 0px 0px",
                width: "15px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "dropdownContentTextDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "inline-block",
                height: "30px",
                marginTop: "5px",
                textDecoration: "none",
                whiteSpace: "nowrap"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppHeader.prototype, "appVersionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                margin: "2px 0px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    AppHeader.prototype.hookEventListeners = function (hook) {
        var storeHook = Utilities_1.getEventHookMethodForEventEmitter(factory_1.appStore, hook);
        storeHook(factory_1.appStore.CHANGED_EVENT, this._scheduleUpdateBind);
    };
    AppHeader.prototype.hookMenuEventListeners = function (hook) {
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this._feedbackMenu, hook);
        hookMethod("keydown", this._onKeyDownBind);
        hookMethod("focusout", this._onFocusOutBind);
    };
    AppHeader.prototype.onFocusOut = function (ev) {
        var _this = this;
        requestAnimationFrame(function () {
            var activeEl = document.activeElement;
            if (_this.shouldCloseMenu(_this._feedbackMenu, activeEl)) {
                _this._losingFocus = false;
                _this.toggleFeedbackMenu();
            }
        });
    };
    AppHeader.prototype.onKeyDown = function (ev) {
        var elActive = document.activeElement;
        // shitf+tab handling requires special hanlding since it returns
        // the same active element as clicking the parent button does
        if (ev.shiftKey && (ev.keyCode === KeyCodes_1.keyCodes.TAB)) {
            this._losingFocus = true;
        }
        if ((ev.keyCode !== KeyCodes_1.keyCodes.DOWN) &&
            (ev.keyCode !== KeyCodes_1.keyCodes.UP) &&
            (ev.keyCode !== KeyCodes_1.keyCodes.ESC)) {
            return;
        }
        if (this._feedbackMenu.contains(elActive)) {
            var firstOption = this._feedbackMenu.firstElementChild;
            if (ev.keyCode === KeyCodes_1.keyCodes.ESC) {
                this.toggleFeedbackMenu();
                this._feedbackButton.focus();
            }
            else if (this._feedbackMenu === elActive) {
                firstOption.focus();
            }
            else {
                if (ev.keyCode === KeyCodes_1.keyCodes.DOWN) {
                    var elNextSibling = elActive.nextElementSibling;
                    if (elNextSibling) {
                        elNextSibling.focus();
                    }
                    else {
                        firstOption.focus();
                    }
                }
                else if (ev.keyCode === KeyCodes_1.keyCodes.UP) {
                    var elPreviousSibling = elActive.previousElementSibling;
                    if (elPreviousSibling) {
                        elPreviousSibling.focus();
                    }
                    else {
                        var lastOption = this._feedbackMenu.lastElementChild;
                        lastOption.focus();
                    }
                }
            }
        }
    };
    AppHeader.prototype.shouldCloseMenu = function (menu, activeEl) {
        // if the menu is visible,
        // and the active element is not the button to open/close the dropdown,
        // and the menu div does not contain the active element
        // then toggle the menu
        // this covers most of the keyboard interactions (click away, tab, esc w/ child focused)
        return (this.isDropdownOpen && (activeEl !== this._feedbackButton) && !menu.contains(activeEl)) ||
            // if the menu IS the active element
            // then toggle the menu
            // this covers hitting escape while focus is still on the menu (opened menu and no child was focused)
            (menu === activeEl) ||
            // if the menu lost focus due to shift+tab
            // then toggle the menu
            this._losingFocus;
    };
    AppHeader = __decorate([
        template("\n<app-header>\n    <div style={this.appHeaderDivStyle}>\n\n        <!-- Reserve some space for resize thumb -->\n        <div style={this.resizableRegionStyle}></div>\n\n        <!-- VS Logo and window title -->\n        <div style={this.vsLogoDivStyle}>\n            <app-logo if={this.opts.showlogo}\n                      style={this.appLogoStyle}\n                      vstextoverride={this.opts.vstextoverride}/>\n            <div if={this.showAppVersion}\n                 class=\"selectable-text\"\n                 style={this.appVersionStyle}\n                 title={this.opts.branch + \"@\" + this.opts.appversion}>\n                - {this.opts.appversion}\n            </div>\n        </div>\n\n        <!-- Buttons -->\n        <div style={this.nonClientDivStyle}>\n            <div if={!this.opts.hidefeedback}\n                 style={this.nonClientFeedbackDivStyle}>\n                <button id={this.feedbackDropdownButtonId}\n                        class=\"non-client-button\"\n                        style={this.nonClientImageButtonStyle}\n                        onclick={this.toggleFeedbackMenu}\n                        title={this.provideFeedbackMenuTitle}\n                        role=\"button\"\n                        aria-haspopup=\"true\">\n                    <img src=\"images/UserVoice.svg\" />\n                </button>\n                <div if={this.isDropdownOpen}\n                     id={this.feedbackDropdownMenuId}\n                     class=\"dropdown-content\"\n                     style={this.dropdownContentDivStyle}\n                     tabindex=\"-1\"\n                     role=\"menu\">\n                    <button style={this.dropdownContentButtonStyle}\n                            onclick={this.handleReportProblemClicked}\n                            tabindex=\"-1\"\n                            id={this.feedbackDropdownMenuItemId}\n                            role=\"menuitem\">\n                        <img src=\"images/Problem.svg\"\n                             style={this.dropdownContentImageStyle} />\n                        <div style={this.dropdownContentTextDivStyle}>\n                            {this.resourceStrings.reportProblem}\n                        </div>\n                    </button>\n                    <button style={this.dropdownContentButtonStyle}\n                            onclick={this.handleProvideSuggestionClicked}\n                            tabindex=\"-1\"\n                            role=\"menuitem\">\n                        <img src=\"images/Suggestion.svg\"\n                             style={this.dropdownContentImageStyle} />\n                        <div style={this.dropdownContentTextDivStyle}>\n                            {this.resourceStrings.provideSuggestion}\n                        </div>\n                    </button>\n                </div>\n            </div>\n\n            <!-- Spacer after the feedback button -->\n            <div style=\"width: 25px\"></div>\n\n            <div style={this.nonClientButtonDivStyle}>\n                <button class=\"non-client-button\"\n                        style={this.nonClientButtonStyle}\n                        onClick={this.handleMinimizeClicked}\n                        onmousedown={this.preventClickFocus}\n                        title={this.minimizeButtonTitle}\n                        aria-label={this.minimizeButtonTitle}\n                        tabindex=\"-1\">\n                    <svg style={this.nonClientSvgStyle}\n                         viewBox=\"0 0 14 14\">\n                        <path class=\"icon-canvas-transparent\"\n                              d=\"M0,0v14h14v-14h-14z\" />\n                        <path style={this.pathStyle}\n                              d=\"M2,9v3h10v-3h-10z\" />\n                    </svg>\n                </button>\n                <button if={!opts.hidemaximize}\n                        class=\"non-client-button\"\n                        style={this.nonClientButtonStyle}\n                        onClick={this.handleMaximizeOrRestoreClicked}\n                        onmousedown={this.preventClickFocus}\n                        title={this.maximizeOrRestoreButtonTitle}\n                        aria-label={this.maximizeOrRestoreButtonTitle}\n                        tabindex=\"-1\">\n                    <svg style={this.nonClientSvgStyle}\n                         viewBox=\"0 0 14 14\">\n                        <path class=\"icon-canvas-transparent\"\n                              d=\"M0,0v14h14v-14h-14z\" />\n                        <path style={this.pathStyle}\n                              d=\"M2,2v10h10v-10h-9v3h8v6h-8v-9z\" />\n                    </svg>\n                </button>\n                <button class=\"non-client-button\"\n                        style={this.nonClientButtonStyle}\n                        onClick={this.handleExitClicked}\n                        onmousedown={this.preventClickFocus}\n                        id={this.closeButtonId}\n                        title={this.closeButtonTitle}\n                        aria-label={this.closeButtonTitle}\n                        tabindex=\"-1\">\n                    <svg style={this.nonClientSvgStyle}\n                         viewBox=\"0 0 14 14\">\n                        <path class=\"icon-canvas-transparent\"\n                              d=\"M0,0v14h14v-14h-14z\" />\n                        <path style={this.pathStyle}\n                              d=\"M1,2l5,5l-5,5h2l4,-4l4,4h2l-5,-5l5,-5h-2l-4,4l-4,-4h-2z\" />\n                    </svg>\n                </button>\n            </div>\n            <div style=\"height: 5px\" />\n        </div>\n    </div>\n</app-header>")
    ], AppHeader);
    return AppHeader;
}(Riot.Element));
exports.AppHeader = AppHeader;
apply_mixins_1.applyMixins(AppHeader, [scheduled_updater_1.ScheduledUpdater]);
//# sourceMappingURL=app-header.js.map