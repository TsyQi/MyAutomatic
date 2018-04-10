/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../bower_components/riot-ts/riot-ts.d.ts" />
/// <reference path="../../../node_modules/@types/dompurify/index.d.ts" />
/// <reference path="../../../node_modules/@types/marked/index.d.ts" />
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
var electron_1 = require("electron");
var os_1 = require("os");
var css_styles_1 = require("../css-styles");
var error_store_1 = require("../stores/error-store");
var markdown_1 = require("../../lib/markdown");
var node_list_iterator_1 = require("../node-list-iterator");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var KeyCodes_1 = require("../KeyCodes");
var Utilities_1 = require("../Utilities");
var error_dialog_button_1 = require("../interfaces/error-dialog-button");
var error_dialog_mode_1 = require("../interfaces/error-dialog-mode");
var progress_bar_proxy_1 = require("../progress-bar-proxy");
/**
 * The types of elements that the dialog should not handle the enter key for.
 * If an element of a type in the list has focus,
 * the dialog should not click the submit button.
 */
var ERROR_DIALOG_NO_SUBMIT_LIST = [
    HTMLButtonElement,
    HTMLAnchorElement,
    HTMLLabelElement,
    HTMLInputElement
];
/**
 * error-dialog:
 * Control used to render an error on top of everything. It will
 * take up the entire space of the nearest position: relative
 * parent.
 *
 * Events:
 *  onsubmit - emitted when a user clicks the "Ok" button
 *  onreset - emitted when a user clicks the "Cancel" button
 */
var ErrorDialog = /** @class */ (function (_super) {
    __extends(ErrorDialog, _super);
    function ErrorDialog() {
        var _this = _super.call(this) || this;
        _this._eventsHooked = false;
        _this.onKeyDownBind = _this.onKeyDown.bind(_this);
        _this.onKeyUpBind = _this.onKeyUp.bind(_this);
        _this.onFocusOutBind = _this.onFocusOut.bind(_this);
        _this.onWindowKeyPressBind = _this.onWindowKeyPress.bind(_this);
        _this.onCopyBind = _this.onCopy.bind(_this);
        _this.onOptOutChangedBind = _this.onOptOutChanged.bind(_this);
        _this.onSubmitBind = _this.onSubmit.bind(_this);
        _this.onResetBind = _this.onReset.bind(_this);
        _this.onSubmitOtherBind = _this.onSubmitOther.bind(_this);
        return _this;
    }
    // The error-dialog is mounted before it is shown. We only want the listeners to be hooked
    // up when we are visible, so we need to place them in updated.
    ErrorDialog.prototype.updated = function () {
        // manage focus on first show
        if (document.body.contains(this.root)) {
            this.updateMessage();
            // Becoming visible, so hook up event listeners
            this.hookEvents(true);
            progress_bar_proxy_1.progressBarProxy.setError();
            // Do nothing when focus is in the dialog
            if (this.root.contains(document.activeElement)) {
                return;
            }
            // store the previously focused item if it wasn't something in the
            // error-dialog, and call blur so we can steal focus.
            if (!this._previouslyFocusedElement) {
                this._previouslyFocusedElement = document.activeElement;
                this.forceBlur();
            }
            this.root.getElementsByClassName("error-dialog-frame")[0].focus();
            // default to not opted-out
            if (this._optedOut) {
                this._optedOut = false;
                this.update();
            }
        }
        else {
            // error-dialog is hiding, re-focus the element that had it before
            if (document.body.contains(this._previouslyFocusedElement)) {
                this._previouslyFocusedElement.focus();
                this._previouslyFocusedElement = null;
            }
            // Going away, so unhook our event listeners
            this.hookEvents(false);
            progress_bar_proxy_1.progressBarProxy.resetError();
        }
    };
    ErrorDialog.prototype.linkClicked = function (event) {
        if (this.isGenericLinkEnabled) {
            this.opts.errorMessage.errorLink.callback();
        }
        else {
            electron_1.shell.openExternal(error_store_1.TROUBLESHOOTING_KB_FWLINK);
        }
    };
    Object.defineProperty(ErrorDialog.prototype, "linkText", {
        get: function () {
            if (this.isGenericLinkEnabled) {
                return this.opts.errorMessage.errorLink.text;
            }
            return ResourceStrings_1.ResourceStrings.getTroubleshootingTips;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "cancelButtonText", {
        get: function () {
            if (!this.opts.errorMessage
                || !this.opts.errorMessage.cancelButtonText) {
                return ResourceStrings_1.ResourceStrings.cancel;
            }
            return this.opts.errorMessage.cancelButtonText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "okButtonText", {
        get: function () {
            if (!this.opts.errorMessage
                || !this.opts.errorMessage.okButtonText) {
                return ResourceStrings_1.ResourceStrings.ok;
            }
            return this.opts.errorMessage.okButtonText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "optOutText", {
        get: function () {
            if (!this.opts.errorMessage
                || !this.opts.errorMessage.optOutText) {
                return ResourceStrings_1.ResourceStrings.dontShowAgain;
            }
            return this.opts.errorMessage.optOutText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "errorTitle", {
        get: function () {
            if (!this.opts.errorMessage) {
                return "";
            }
            return this.opts.errorMessage.errorTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "messages", {
        get: function () {
            if (!this.opts.errorMessage) {
                return "";
            }
            return this.opts.errorMessage.errorMessages.join("" + os_1.EOL);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "showLink", {
        get: function () {
            if (this.isGenericLinkEnabled) {
                return true;
            }
            if (!this.opts.errorMessage) {
                return false;
            }
            return this.opts.errorMessage.hideSupportLink !== true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "isGenericLinkEnabled", {
        get: function () {
            if (!this.opts.errorMessage) {
                return false;
            }
            var errorLink = this.opts.errorMessage.errorLink;
            return !!errorLink && !!errorLink.text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "fillParent", {
        get: function () {
            return this.opts.fillparent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "mode", {
        /**
         * The default mode should be OK
         */
        get: function () {
            if (!this.opts.errorMessage) {
                return error_dialog_mode_1.ErrorDialogMode.OK;
            }
            return this.opts.errorMessage.dialogMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "showCancelButton", {
        get: function () {
            // tslint:disable-next-line: no-bitwise
            return (this.mode & error_dialog_mode_1.ErrorDialogMode.Cancel) !== 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "showOKButton", {
        get: function () {
            // tslint:disable-next-line: no-bitwise
            return (this.mode & error_dialog_mode_1.ErrorDialogMode.OK) !== 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "showOptOutButton", {
        get: function () {
            // tslint:disable-next-line: no-bitwise
            return (this.mode & error_dialog_mode_1.ErrorDialogMode.OptOut) !== 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "errorTitleId", {
        get: function () {
            return "error-dialog-title";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "errorMessageId", {
        get: function () {
            return "error-dialog-message";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "submitButtonId", {
        get: function () {
            return "error-dialog-submit-button";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "resetButtonId", {
        get: function () {
            return "error-dialog-reset-button";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "optedOut", {
        get: function () {
            return this._optedOut;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "hiddenDescriptionText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.defaultDialogButtonDescription(this.okButtonText);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "isResetDefault", {
        get: function () {
            if (!this.opts.errorMessage) {
                return false;
            }
            return this.opts.errorMessage.isCancelDefault;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "submitButtonClass", {
        get: function () {
            if (!this.isElementOnNoSubmitList(document.activeElement) && !this.isResetDefault) {
                return "default-selected-button";
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "resetButtonClass", {
        get: function () {
            if (!this.isElementOnNoSubmitList(document.activeElement) && this.isResetDefault) {
                return "default-selected-button";
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "additionalButtons", {
        get: function () {
            if (!this.opts.errorMessage
                || !Array.isArray(this.opts.errorMessage.buttons)) {
                return [];
            }
            return this.opts.errorMessage.buttons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "errorDialogStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                position: "absolute",
                top: "0",
                width: "calc(100% - 2px)",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "errorDialogFrameStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: this.fillParent ? "none" : "solid",
                borderWidth: this.fillParent ? "0px" : "1px",
                boxShadow: this.fillParent ? "none" : "2px 2px 1px rgba(0, 0, 0, .2)",
                maxHeight: this.fillParent ? "100%" : "80%",
                maxWidth: "550px",
                minWidth: "380px",
                outline: "none",
                overflow: "auto",
                padding: "20px 15px 15px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "checkboxLabelStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "checkboxStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                boxSizing: "border-box",
                cursor: "pointer",
                fontSize: "1.3em",
                flex: "0 0 auto",
                height: "18px",
                margin: "0px",
                position: "relative",
                webkitAppearance: "none",
                webkitAppRegion: "no-drag",
                webkitMarginEnd: "8px",
                width: "18px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "titleBarStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                lineHeight: "1.2",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "messageFormStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: ".75rem",
                lineHeight: "1.8",
                wordWrap: "break-word",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "footerDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                paddingTop: "24px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "buttonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                minWidth: "80px",
                webkitMarginStart: "8px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "linkStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorDialog.prototype, "hiddenDescriptionDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "1px",
                overflow: "hidden",
                position: "absolute",
                top: "-20px",
                width: "1px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hooks or unhooks events for this component
     */
    ErrorDialog.prototype.hookEvents = function (hook) {
        if (hook === this._eventsHooked) {
            return;
        }
        this._eventsHooked = hook;
        // (un)hook events on the component's root element
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod("keydown", this.onKeyDownBind);
        hookMethod("keyup", this.onKeyUpBind);
        // (un)hook events on the window
        hookMethod = Utilities_1.getEventHookMethodForTarget(window, hook);
        hookMethod("keypress", this.onWindowKeyPressBind);
        hookMethod("copy", this.onCopyBind);
        // use capture to prevent any other components from resetting focus.
        hookMethod = Utilities_1.getEventHookMethodForTarget(document.documentElement, hook);
        hookMethod("focusout", this.onFocusOutBind, true);
        hookMethod("focusin", this.onFocusIn, true);
    };
    ErrorDialog.prototype.onKeyDown = function (ev) {
        if (ev.key === "Shift") {
            this._shiftPressed = true;
        }
    };
    ErrorDialog.prototype.onKeyUp = function (ev) {
        if (ev.key === "Shift") {
            this._shiftPressed = false;
        }
        if (ev.key === "Tab") {
            this.update();
        }
        if (this._shiftPressed) {
            return;
        }
        if (ev.ctrlKey) {
            return;
        }
        if (ev.keyCode === KeyCodes_1.keyCodes.ESC) {
            // escape should simulate cancel being clicked
            // so emit the reset event, but only if cancel
            // is being shown to the user.
            if (this.showCancelButton) {
                ev.stopPropagation();
                this.raiseSubmitEvent({ buttonId: error_dialog_button_1.ButtonIds.DEFAULT_CANCEL });
            }
        }
    };
    ErrorDialog.prototype.onFocusOut = function (ev) {
        ev.stopImmediatePropagation();
        if (!this.root.contains(ev.relatedTarget)) {
            this.resetFocus(this._shiftPressed);
        }
    };
    // We just want to stop anyone from stealing focus on focusIn
    ErrorDialog.prototype.onFocusIn = function (ev) {
        ev.stopImmediatePropagation();
    };
    /**
     * Returns whether the dialog should submit.
     * Special cased elements that handle the Enter
     * key themselves should be in the ERROR_DIALOG_NO_SUBMIT_LIST.
     */
    ErrorDialog.prototype.shouldSubmit = function (element) {
        return !this.isElementOnNoSubmitList(element);
    };
    ErrorDialog.prototype.isElementOnNoSubmitList = function (element) {
        return ERROR_DIALOG_NO_SUBMIT_LIST.some(function (type) { return element instanceof type; });
    };
    /**
     * Handle certain key presses to simulate
     * a native modal dialog.
     */
    ErrorDialog.prototype.onWindowKeyPress = function (ev) {
        var activeElement = document.activeElement;
        if (this._shiftPressed) {
            return;
        }
        if (ev.ctrlKey) {
            return;
        }
        // enter should simulate ok being clicked
        // so emit the submit event, but only if
        // focus is not on an element of type in ERROR_DIALOG_NO_SUBMIT_LIST
        if (ev.keyCode === KeyCodes_1.keyCodes.ENTER) {
            if (this.shouldSubmit(activeElement)) {
                ev.stopPropagation();
                this.raiseSubmitEvent({
                    buttonId: this.isResetDefault || !this.showOKButton
                        ? error_dialog_button_1.ButtonIds.DEFAULT_CANCEL
                        : error_dialog_button_1.ButtonIds.DEFAULT_SUBMIT,
                });
            }
        }
    };
    /**
     * Ctrl+C support - copy the error message to clipboard.
     */
    ErrorDialog.prototype.onCopy = function (ev) {
        ev.clipboardData.setData("text/plain", this.messages);
        ev.preventDefault();
    };
    ErrorDialog.prototype.onOptOutChanged = function (ev) {
        this._optedOut = ev.currentTarget.checked;
    };
    ErrorDialog.prototype.updateMessage = function () {
        var errorMsgDiv = this.root.querySelector("#" + this.errorMessageId);
        errorMsgDiv.innerHTML = markdown_1.Markdown.Parse(this.messages).toSafeHtml();
    };
    ErrorDialog.prototype.onSubmitOther = function (ev) {
        ev.stopPropagation();
        ev.preventUpdate = true;
        var button = ev.item.button;
        this.raiseSubmitEvent({ buttonId: button.buttonId });
    };
    ErrorDialog.prototype.onSubmit = function (ev) {
        ev.stopPropagation();
        ev.preventUpdate = true;
        this.raiseSubmitEvent({ buttonId: error_dialog_button_1.ButtonIds.DEFAULT_SUBMIT });
    };
    ErrorDialog.prototype.onReset = function (ev) {
        ev.stopPropagation();
        ev.preventUpdate = true;
        this.raiseSubmitEvent({ buttonId: error_dialog_button_1.ButtonIds.DEFAULT_CANCEL });
    };
    ErrorDialog.prototype.raiseSubmitEvent = function (detail) {
        detail = detail || {};
        detail.optedOut = this.optedOut;
        var event = new CustomEvent("submit", {
            bubbles: true,
            cancelable: true,
            detail: detail,
        });
        this.root.dispatchEvent(event);
    };
    ErrorDialog.prototype.forceBlur = function () {
        var _this = this;
        var captureFocusOutHandler = function (ev) {
            if (document.body.contains(_this.root)) {
                ev.stopImmediatePropagation();
            }
        };
        // capture focusout events so we can call blur
        document.body.addEventListener("focusout", captureFocusOutHandler, true);
        document.activeElement.blur();
        document.body.removeEventListener("focusout", captureFocusOutHandler, true);
    };
    ErrorDialog.prototype.resetFocus = function (fromEnd) {
        if (document.body.contains(this.root)) {
            // the error-dialog is visible
            // walk the children testing focus. Go in reverse if fromEnd is true
            var children = this.root.querySelectorAll("*");
            var list = new node_list_iterator_1.NodeListIterator(children, fromEnd);
            var current = list.begin();
            while (current) {
                current.focus();
                if (current === document.activeElement) {
                    break;
                }
                current = list.next();
            }
        }
    };
    ErrorDialog = __decorate([
        template("\n<error-dialog>\n    <div id=\"errorDialog\"\n         style={this.errorDialogStyle}>\n        <div class=\"error-dialog-frame\"\n             style={this.errorDialogFrameStyle}\n             tabindex=\"0\"\n             role=\"alertdialog\"\n             aria-labelledby={this.errorTitleId}>\n            <div id={this.errorTitleId}\n                 class=\"error-dialog-title\"\n                 style={this.titleBarStyle}>\n                {this.errorTitle}\n                <div style={this.hiddenDescriptionDivStyle}>\n                    {this.hiddenDescriptionText}\n                </div>\n            </div>\n            <form style={this.messageFormStyle}>\n                <br />\n                <!-- Need to surround the entire message div with another div to read for accessibility -->\n                <div tabindex=\"0\"\n                     aria-labelledby={this.errorMessageId}>\n\n                    <!-- the innerHTML will be set on the updated() callback -->\n                    <div id={this.errorMessageId}></div>\n                </div>\n\n                <div if={this.showOptOutButton}>\n                    <br />\n                    <label title={this.optOutText}\n                           style={this.checkboxLabelStyle}>\n                        <input type=\"checkbox\"\n                               class=\"opt-out-checkbox\"\n                               style={this.checkboxStyle}\n                               checked={this.optedOut}\n                               onclick={this.onOptOutChangedBind} />\n                        {this.optOutText}\n                    </label>\n                </div>\n\n                <div id=\"footerDiv\"\n                     style={this.footerDivStyle}>\n\n                     <div if={this.showLink}\n                         style={this.linkStyle}>\n                        <a onClick={this.linkClicked}\n                           onkeypress={keyPressToClickHelper}\n                           tabindex=\"0\">\n                            {this.linkText}\n                        </a>\n                    </div>\n\n                    <button if={this.showOKButton}\n                            id={this.submitButtonId}\n                            class={this.submitButtonClass}\n                            onclick={this.onSubmitBind}\n                            style={this.buttonStyle}>\n                        {this.okButtonText}\n                    </button>\n\n                    <button each={button in this.additionalButtons}\n                            onclick={parent.onSubmitOtherBind}\n                            style={parent.buttonStyle}>\n                        {button.text}\n                    </button>\n\n                    <button if={this.showCancelButton}\n                            id={this.resetButtonId}\n                            class={this.resetButtonClass}\n                            onclick={this.onResetBind}\n                            style={this.buttonStyle}>\n                        {this.cancelButtonText}\n                    </button>\n                </div>\n            </form>\n        </div>\n    </div>\n</error-dialog>")
    ], ErrorDialog);
    return ErrorDialog;
}(Riot.Element));
//# sourceMappingURL=error-dialog.js.map