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
var css_styles_1 = require("../css-styles");
var Utilities_1 = require("../Utilities");
var node_list_iterator_1 = require("../node-list-iterator");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var LightboxMode;
(function (LightboxMode) {
    LightboxMode[LightboxMode["Loading"] = 0] = "Loading";
    LightboxMode[LightboxMode["Normal"] = 1] = "Normal";
    LightboxMode[LightboxMode["Small"] = 2] = "Small";
})(LightboxMode = exports.LightboxMode || (exports.LightboxMode = {}));
/**
 * An array that lists the types of elements that the dialog
 * should not handle the enter key for. If an element of a
 * type in the list has focus, the dialog should not click the submit button.
 */
var LIGHTBOX_NO_SUBMIT_LIST = [
    HTMLButtonElement,
    HTMLAnchorElement,
];
/**
 * lightbox:
 * Control used to blur out the background and render
 * content in a box on top of other content. It will
 * take up the entire space of the nearest position: relative
 * parent.
 */
var Lightbox = /** @class */ (function (_super) {
    __extends(Lightbox, _super);
    function Lightbox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._resettingFocus = false;
        _this._onKeyDownBind = _this.onKeyDown.bind(_this);
        _this._onKeyUpBind = _this.onKeyUp.bind(_this);
        _this._onFocusInBind = _this.onFocusIn.bind(_this);
        return _this;
    }
    Lightbox.prototype.mounted = function () {
        this.hookEvents(true);
    };
    Lightbox.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    Lightbox.prototype.close = function (ev) {
        ev.preventUpdate = true;
        this.root.dispatchEvent(new CustomEvent("close"));
    };
    Lightbox.prototype.updated = function () {
        if (!this.root.contains(document.activeElement)) {
            this.resetFocus(false);
        }
    };
    Object.defineProperty(Lightbox.prototype, "pageSubTitle", {
        get: function () {
            return this.opts.pagesubtitle || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "pageTitle", {
        get: function () {
            return this.opts.pagetitle || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "lightboxMode", {
        get: function () {
            return this.opts.mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "clientContentRootStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "lightboxStyle", {
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
    Object.defineProperty(Lightbox.prototype, "lightboxContentStyle", {
        get: function () {
            switch (this.lightboxMode) {
                case LightboxMode.Normal:
                    return this.normalLightboxContentStyle;
                case LightboxMode.Loading:
                    return this.loadingLightboxContentStyle;
                case LightboxMode.Small:
                    return this.smallLightboxContentStyle;
            }
            // default style is normal
            return this.normalLightboxContentStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "loadingLightboxContentStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                display: "flex",
                position: "relative",
                /* can't be a percentage or the ellipsis in workloads will move vertically */
                height: "350px",
                width: "500px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "normalLightboxContentStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                display: "flex",
                position: "relative",
                /* can't be a percentage or the ellipsis in workloads will move vertically */
                height: "calc(100% - 60px)",
                width: "calc(100% - 40px)",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "smallLightboxContentStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                display: "flex",
                position: "relative",
                /* can't be a percentage or the ellipsis in workloads will move vertically */
                height: "565px",
                width: "820px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "fullSizeStyle", {
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
    Object.defineProperty(Lightbox.prototype, "lightboxManagerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignSelf: "flex-start",
                webkitMarginStart: "-24px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "nonClientButtonStyle", {
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
    Object.defineProperty(Lightbox.prototype, "nonClientSvgStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "14px",
                paddingTop: "3px",
                width: "14px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "pathStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fill: "inherit"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "titleStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "0.75rem",
                height: "17px",
                padding: "5px 15px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "closeButtonTitle", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.closeButtonTitle;
        },
        enumerable: true,
        configurable: true
    });
    Lightbox.prototype.hookEvents = function (hook) {
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod("keydown", this._onKeyDownBind);
        hookMethod("keyup", this._onKeyUpBind);
        var hookMethod2 = Utilities_1.getEventHookMethodForTarget(document.documentElement, hook);
        hookMethod2("focusin", this._onFocusInBind);
    };
    Lightbox.prototype.onKeyDown = function (ev) {
        var button;
        switch (ev.key) {
            case "Shift":
                this._shiftPressed = true;
                break;
            case "Enter":
                var activeElement = document.activeElement;
                // if the lightbox should submit, find the "type=submit" button and click that.
                if (this.shouldSubmit(activeElement)) {
                    button = this.getButtonOfType("submit");
                    if (button) {
                        button.click();
                    }
                }
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
    /**
     * Returns whether the lightbox should submit.
     * Special cased elements that handle the Enter
     * key themselves should be in the LIGHTBOX_NO_SUBMIT_LIST.
     */
    Lightbox.prototype.shouldSubmit = function (element) {
        if (LIGHTBOX_NO_SUBMIT_LIST.some(function (type) { return element instanceof type; })) {
            return false;
        }
        return true;
    };
    Lightbox.prototype.onKeyUp = function (ev) {
        if (ev.key === "Shift") {
            this._shiftPressed = false;
        }
    };
    Lightbox.prototype.onFocusIn = function (ev) {
        var focusedTarget = ev.target;
        var headerElement = document.querySelector("app-header");
        // If focus is moving to something not in the header or
        // not in the lightbox, then reset focus
        if (!this.root.contains(focusedTarget)
            && !headerElement.contains(focusedTarget)) {
            this.resetFocus(this._shiftPressed);
        }
    };
    Lightbox.prototype.getButtonOfType = function (type) {
        return this.root.querySelector("button[type=" + type + "]");
    };
    Lightbox.prototype.resetFocus = function (fromEnd) {
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
    Lightbox = __decorate([
        template("\n<lightbox>\n    <div class=\"lightbox\"\n         style={this.lightboxStyle}>\n        <div class=\"lightbox-content\"\n             style={this.lightboxContentStyle}>\n\n            <div style={this.fullSizeStyle}>\n                <div id=\"lightbox-title\"\n                    class=\"dialog-title\"\n                    style={this.titleStyle}>\n                        <span>\n                            {this.pageTitle}\n                        </span>\n                        <span class=\"dialog-subtitle\">\n                            {this.pageSubTitle}\n                        </span>\n                </div>\n\n                <!-- Client content goes here -->\n                <div style={this.clientContentRootStyle}\n                     role=\"dialog\"\n                     aria-labelledby=\"lightbox-title\">\n                    <yield />\n                </div>\n            </div>\n\n            <div style={this.lightboxManagerStyle}>\n                <button class=\"lightbox-manager-quit\"\n                        style={this.nonClientButtonStyle}\n                        onclick={close}\n                        type=\"reset\"\n                        title={this.closeButtonTitle}>\n                    <svg style={this.nonClientSvgStyle}\n                         viewBox=\"0 0 14 14\">\n                        <path class=\"icon-canvas-transparent\"\n                              d=\"M0,0v14h14v-14h-14z\" />\n                        <path style={this.pathStyle}\n                              d=\"M1,2l5,5l-5,5h2l4,-4l4,4h2l-5,-5l5,-5h-2l-4,4l-4,-4h-2z\" />\n                    </svg>\n                </button>\n            </div>\n        </div>\n    </div>\n</lightbox>")
    ], Lightbox);
    return Lightbox;
}(Riot.Element));
//# sourceMappingURL=lightbox.js.map