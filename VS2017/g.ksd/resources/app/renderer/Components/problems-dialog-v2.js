/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../renderer/bower_components/riot-ts/riot-ts.d.ts" />
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
var search_feedback_client_actions_1 = require("../Actions/search-feedback-client-actions");
var Utilities_1 = require("../Utilities");
var error_store_1 = require("../stores/error-store");
var node_list_iterator_1 = require("../node-list-iterator");
var InstallerActions_1 = require("../Actions/InstallerActions");
var open_external_1 = require("../../lib/open-external");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var factory_2 = require("../Actions/factory");
require("./x-glyph");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
var apply_mixins_1 = require("../mixins/apply-mixins");
var ProblemsDialog2 = /** @class */ (function (_super) {
    __extends(ProblemsDialog2, _super);
    function ProblemsDialog2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.troubleshootingTipsClickedBind = _this.troubleshootingTipsClicked.bind(_this);
        _this.openErrorLogBind = _this.openErrorLog.bind(_this);
        _this.openFeedbackToolBind = _this.openFeedbackTool.bind(_this);
        _this._resettingFocus = false;
        _this._onKeyDownBind = _this.onKeyDown.bind(_this);
        _this._onKeyUpBind = _this.onKeyUp.bind(_this);
        _this._onSolutionsStoreChangedBind = _this.onSolutionsStoreChanged.bind(_this);
        _this._hasSearchedFeedback = false;
        return _this;
    }
    ProblemsDialog2.prototype.mounted = function () {
        this.hookEvents(true);
    };
    ProblemsDialog2.prototype.unmounted = function () {
        this._hasSearchedFeedback = false;
        this.hookEvents(false);
    };
    ProblemsDialog2.prototype.updated = function () {
        var _this = this;
        if (this.hasFailedPackages && !this._hasSearchedFeedback) {
            this._hasSearchedFeedback = true;
            this.topfailedPackages.forEach(function (failedPackage) {
                _this.getFeedbackResult(failedPackage);
            });
        }
        if (!this.root.contains(document.activeElement)) {
            this.resetFocus(false);
        }
    };
    ProblemsDialog2.prototype.close = function () {
        this._hasSearchedFeedback = false;
        this.root.dispatchEvent(new CustomEvent("close"));
    };
    Object.defineProperty(ProblemsDialog2.prototype, "canShowLog", {
        get: function () {
            return !!factory_1.productConfigurationStore.viewProblemsActiveLog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "closeButtonText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.closeButtonTitle;
        },
        enumerable: true,
        configurable: true
    });
    ProblemsDialog2.prototype.listItemTooltipText = function (failedPackage) {
        var failedPackageText = ResourceStrings_1.ResourceStrings.failedPackageActionWithId(failedPackage.action.toLocaleLowerCase(), failedPackage.id);
        if (this.hasSearchResult(failedPackage)) {
            return failedPackageText;
        }
        return failedPackageText + "\n" + ResourceStrings_1.ResourceStrings.checkingForSolutions;
    };
    Object.defineProperty(ProblemsDialog2.prototype, "loadingProblemsText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.loadingProblems;
        },
        enumerable: true,
        configurable: true
    });
    ProblemsDialog2.prototype.getFeedbackResult = function (failedPackage) {
        search_feedback_client_actions_1.searchFeedbackClientActions.findSolutions(failedPackage);
    };
    ProblemsDialog2.prototype.feedbackInfoText = function (failedPackage) {
        if (this.hasVerifiedSolution(failedPackage)) {
            return ResourceStrings_1.ResourceStrings.verifiedSolution;
        }
        else if (this.hasSolutions(failedPackage)) {
            return ResourceStrings_1.ResourceStrings.popularSolutions;
        }
        return ResourceStrings_1.ResourceStrings.reportOrUpVoteProblem;
    };
    Object.defineProperty(ProblemsDialog2.prototype, "topfailedPackages", {
        get: function () {
            return factory_1.productConfigurationStore.topFailedPackages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "hasFailedPackages", {
        get: function () {
            return this.topfailedPackages.length !== 0;
        },
        enumerable: true,
        configurable: true
    });
    ProblemsDialog2.prototype.hasSearchResult = function (failedPackage) {
        return factory_1.solutionsStore.searchResults.has(failedPackage.id);
    };
    ProblemsDialog2.prototype.hasSolutions = function (failedPackage) {
        if (this.hasSearchResult(failedPackage)) {
            var info = factory_1.solutionsStore.searchResults.get(failedPackage.id);
            if (info) {
                return info.hasSolutions;
            }
        }
        return false;
    };
    ProblemsDialog2.prototype.hasVerifiedSolution = function (failedPackage) {
        if (this.hasSolutions(failedPackage)) {
            var info = factory_1.solutionsStore.searchResults.get(failedPackage.id);
            if (info) {
                return info.hasAcceptedSolutions;
            }
        }
        return false;
    };
    ProblemsDialog2.prototype.getItemTitle = function (failedPackage) {
        if (this.hasVerifiedSolution(failedPackage)) {
            var info = factory_1.solutionsStore.searchResults.get(failedPackage.id);
            if (info) {
                return info.bestResult.title;
            }
        }
        return null;
    };
    Object.defineProperty(ProblemsDialog2.prototype, "checkingForSolutions", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.checkingForSolutions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "headerText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.somethingWentWrong;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "subHeaderText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.selectProblem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "troubleshootingTipsText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.moreTroubleshootingTips;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "openLogText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.openLog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "viewLogText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.viewLog;
        },
        enumerable: true,
        configurable: true
    });
    ProblemsDialog2.prototype.hookEvents = function (hook) {
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod("keydown", this._onKeyDownBind);
        hookMethod("keyup", this._onKeyUpBind);
        if (hook) {
            factory_1.solutionsStore.on(factory_1.solutionsStore.CHANGED_EVENT, this._onSolutionsStoreChangedBind);
        }
        else {
            factory_1.solutionsStore.removeListener(factory_1.solutionsStore.CHANGED_EVENT, this._onSolutionsStoreChangedBind);
        }
    };
    ProblemsDialog2.prototype.onKeyDown = function (ev) {
        var button;
        switch (ev.key) {
            case "Shift":
                this._shiftPressed = true;
                break;
            case "Tab":
                this.scheduleUpdate();
                break;
            case "Escape":
                // find the "type=reset" button; if found, click it
                button = this.getButtonOfType("reset");
                if (button) {
                    button.click();
                }
                break;
        }
    };
    ProblemsDialog2.prototype.onKeyUp = function (ev) {
        if (ev.key === "Shift") {
            this._shiftPressed = false;
        }
    };
    ProblemsDialog2.prototype.getButtonOfType = function (type) {
        return this.root.querySelector("button[type=" + type + "]");
    };
    ProblemsDialog2.prototype.resetFocus = function (fromEnd) {
        // Prevent re-entry
        if (this._resettingFocus) {
            return;
        }
        try {
            this._resettingFocus = true;
            // walk the children testing focus. Go in reverse if fromEnd is true
            var children = this.root.querySelectorAll("*");
            var list = new node_list_iterator_1.NodeListIterator(children, fromEnd);
            var current = list.begin();
            while (current) {
                current.focus();
                // Don't allow focus on elements with a negative tabindex since they are not in the taborder
                if (current === document.activeElement && current.tabIndex >= 0) {
                    break;
                }
                current = list.next();
            }
        }
        finally {
            this._resettingFocus = false;
        }
    };
    ProblemsDialog2.prototype.troubleshootingTipsClicked = function (ev) {
        open_external_1.openExternal(error_store_1.TROUBLESHOOTING_KB_FWLINK);
    };
    ProblemsDialog2.prototype.openFeedbackTool = function (event) {
        var errors = event.item.failedPackage;
        var channels = factory_1.appStore.allChannels;
        factory_2.viewProblemsActions.openFeedbackClient(errors, channels, this.getItemTitle(errors) || errors.signature);
    };
    ProblemsDialog2.prototype.openErrorLog = function (event) {
        InstallerActions_1.openLog(factory_1.productConfigurationStore.viewProblemsActiveLog);
    };
    ProblemsDialog2.prototype.onSolutionsStoreChanged = function () {
        this.scheduleUpdate();
    };
    Object.defineProperty(ProblemsDialog2.prototype, "buttonStyle", {
        /* Styles */
        get: function () {
            var buttonSize = "16px";
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                height: buttonSize,
                lineHeight: "8px",
                padding: "0px",
                width: buttonSize,
                position: "absolute",
                top: "8px",
                right: "8px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "closeButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 0",
                minWidth: "80px",
                webkitMarginStart: "8px",
                position: "absolute",
                right: "20px",
                bottom: "20px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "checkingSolutionsStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "18px",
                textAlign: "center",
                marginTop: "20px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "feedbackItemStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "14px",
                display: "flex",
                flexDirection: "row",
                margin: "7px 0px 0px 10px",
                lineHeight: "16px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "fullSizeStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "problemsHeaderStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                margin: this.hasFailedPackages ? "40px 40px 20px 40px" : "40px 40px 30px 40px",
                fontSize: "28px",
                lineHeight: this.hasFailedPackages ? "28px" : "33px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "loadingRingStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                margin: "0px 10px 0px 0px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "problemsDialogContentStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                display: "flex",
                position: "relative",
                height: this.hasFailedPackages ? "358px" : "239px",
                minWidth: this.hasFailedPackages ? "629px" : "329px",
                maxWidth: "100%",
                flexWrap: "wrap",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "problemsDialogStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                left: "0px",
                outline: "none",
                position: "absolute",
                top: "0",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "troubleshootingTipsStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                margin: "0px 40px 20px 40px",
                fontSize: "14px",
                lineHeight: "14px",
                width: "50%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "listItemStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                padding: "10px 20px",
                fontSize: "14px",
                lineHeight: "14px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "listStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "163px",
                listStyle: "none",
                padding: "10px 0px 10px 0px",
                margin: "0px 40px 20px 40px",
                overflow: "hidden",
                borderStyle: "solid",
                borderWidth: "1px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "loadingStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                width: "629px",
                height: "183px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "viewLogStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "14px",
                width: "50%",
                position: "absolute",
                bottom: "20px",
                left: "40px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemsDialog2.prototype, "openLogStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                margin: "0px 40px 30px 40px",
                fontSize: "22px",
                lineHeight: "28px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    ProblemsDialog2 = __decorate([
        template("\n<problems-dialog-v2>\n    <div class=\"problems-dialog\"\n         style={this.problemsDialogStyle}>\n        <div class=\"problems-dialog-content\"\n             style={this.problemsDialogContentStyle}>\n\n            <div style={this.fullSizeStyle}>\n                <div style={this.problemsHeaderStyle}\n                     aria-label={this.headerText}\n                     tabindex=\"0\">\n                    {this.headerText}\n                </div>\n\n                <div if={this.hasFailedPackages}>\n                    <ul class=\"failed-packages-list\"\n                         style={this.listStyle}>\n                         <virtual each={failedPackage in this.topfailedPackages}>\n                            <li style={this.listItemStyle}\n                                title={this.listItemTooltipText(failedPackage)}\n                                aria-label={this.listItemTooltipText(failedPackage)}\n                                tabindex=\"0\">\n                                {failedPackage.actionWithIdText}\n                                <div if={!parent.hasSearchResult(failedPackage)}\n                                        style={this.feedbackItemStyle}>\n                                    <div class=\"loading-ring progress-bar-blue\"\n                                         style={this.loadingRingStyle}>\n                                        <div class=\"loading-circle\"></div>\n                                        <div class=\"loading-circle\"></div>\n                                        <div class=\"loading-circle\"></div>\n                                        <div class=\"loading-circle\"></div>\n                                        <div class=\"loading-circle\"></div>\n                                    </div>\n                                    {this.checkingForSolutions}\n                                </div>\n                                <a if={parent.hasSearchResult(failedPackage)}\n                                    style={this.feedbackItemStyle}\n                                    onClick={this.openFeedbackToolBind}\n                                    onkeypress={keyPressToClickHelper}\n                                    title={this.feedbackInfoText(failedPackage)}\n                                    aria-label={this.feedbackInfoText(failedPackage)}\n                                    tabindex=\"0\">\n                                    {this.feedbackInfoText(failedPackage)}\n                                </a>\n                            </li>\n                        </virtual>\n                     </ul>\n                </div>\n\n                <a if={this.canShowLog && !this.hasFailedPackages}\n                    onClick={this.openErrorLogBind}\n                    onkeypress={keyPressToClickHelper}\n                    title={this.openLogText}\n                    style={this.openLogStyle}\n                    aria-label={this.openLogText}\n                    tabindex=\"0\">\n                    {this.openLogText}\n                </a>\n\n                <a href=\"#\"\n                    title={this.troubleshootingTipsText}\n                    style={this.troubleshootingTipsStyle}\n                    onClick={this.troubleshootingTipsClickedBind}\n                    onkeypress={keyPressToClickHelper}>\n                    {this.troubleshootingTipsText}\n                </a>\n\n                <a if={this.canShowLog && this.hasFailedPackages}\n                    onClick={this.openErrorLogBind}\n                    onkeypress={keyPressToClickHelper}\n                    title={this.viewLogText}\n                    style={this.viewLogStyle}\n                    aria-label={this.viewLogText}\n                    tabindex=\"0\">\n                    {this.viewLogText}\n                </a>\n\n                <button class=\"close-button\"\n                        aria-label={this.closeButtonText}\n                        type=\"reset\"\n                        style={this.closeButtonStyle}\n                        onclick={close}\n                        title={this.closeButtonText}>\n                        {this.closeButtonText}\n                </button>\n            </div>\n            <button class=\"close-dialog-glyph-button\"\n                aria-label={this.closeButtonText}\n                style={this.buttonStyle}\n                onClick={close}\n                type=\"reset\"\n                title={this.closeButtonText}>\n                <x-glyph></x-glyph>\n            </button>\n        </div>\n    </div>\n</problems-dialog-v2>")
    ], ProblemsDialog2);
    return ProblemsDialog2;
}(Riot.Element));
apply_mixins_1.applyMixins(ProblemsDialog2, [scheduled_updater_1.ScheduledUpdater]);
//# sourceMappingURL=problems-dialog-v2.js.map