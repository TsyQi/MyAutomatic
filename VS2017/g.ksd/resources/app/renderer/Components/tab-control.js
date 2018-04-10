/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/riot-ts-missing-declares.d.ts" />
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
var KeyCodes_1 = require("../KeyCodes");
var lazy_1 = require("../../lib/lazy");
var TabControl = /** @class */ (function (_super) {
    __extends(TabControl, _super);
    function TabControl() {
        var _this = _super.call(this) || this;
        _this._windowKeyPressHandlerBind = _this.windowKeyPressHandler.bind(_this);
        _this._rootKeyPressHandlerBind = _this.rootKeyPressHandler.bind(_this);
        _this._linkUnderlineStyle = new lazy_1.Lazy(function () {
            return css_styles_1.createStyleMap({
                background: "none",
                borderStyle: "solid",
                borderWidth: "0px 0px 3px 0px",
                // cursor: "default",
                fontSize: ".9167rem",
                fontFamily: "Segoe UI SemiBold",
                margin: "0px 40px 0px 0px",
                padding: "0px 0px 3px 0px",
                textDecoration: "none",
                webkitUserSelect: "none"
            }).toString();
        });
        _this._linkNoUnderlineStyle = new lazy_1.Lazy(function () {
            return css_styles_1.createStyleMap({
                border: "none",
                background: "none",
                // cursor: "default",
                fontSize: ".9167rem",
                fontFamily: "Segoe UI SemiBold",
                margin: "0px 40px 0px 0px",
                padding: "0px 0px 6px 0px",
                textDecoration: "none",
                webkitUserSelect: "none"
            }).toString();
        });
        _this.tabClickEvent = _this.onTabClicked.bind(_this);
        return _this;
    }
    TabControl.prototype.mounted = function () {
        var tab = this.root.getElementsByTagName("a").item(this.defaultTabIndex);
        if (tab && document.activeElement !== tab) {
            // Don't block rendering to move focus.
            setImmediate(function () { return tab.focus(); });
        }
        this.hookEventListeners(true);
    };
    TabControl.prototype.unmounted = function () {
        this.hookEventListeners(false);
    };
    TabControl.prototype.tabIndex = function (tab) {
        return tab === this.selectedTab ? "0" : "-1";
    };
    TabControl.prototype.linkClass = function (tab) {
        return this.getTabProperty(tab, "tab-control-link tab-control-link-selected", "tab-control-link");
    };
    TabControl.prototype.onTabClicked = function (ev) {
        this._currentTab = ev.item.tab;
        var event = new CustomEvent("tabclick", {
            bubbles: true,
            cancelable: true,
            detail: {
                tab: this._currentTab
            }
        });
        this.root.dispatchEvent(event);
    };
    TabControl.prototype.windowKeyPressHandler = function (event) {
        var prior;
        if (event.ctrlKey) {
            if (event.keyCode === KeyCodes_1.keyCodes.TAB) {
                if (event.shiftKey) {
                    prior = true;
                }
                else {
                    prior = false;
                }
                this.focusAdjacentTab(prior);
            }
        }
    };
    TabControl.prototype.rootKeyPressHandler = function (event) {
        var prior = null;
        if (event.keyCode === KeyCodes_1.keyCodes.LEFT) {
            prior = true;
        }
        else if (event.keyCode === KeyCodes_1.keyCodes.RIGHT) {
            prior = false;
        }
        // If prior is null then we did not receive left/right key press
        if (prior !== null) {
            this.focusAdjacentTab(prior);
        }
    };
    Object.defineProperty(TabControl.prototype, "tabs", {
        get: function () {
            if (this.opts.tabs) {
                return this.opts.tabs.toArray();
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabControl.prototype, "tabPanelId", {
        get: function () {
            return this.opts.tabpanelid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabControl.prototype, "tabStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    TabControl.prototype.linkStyle = function (tab) {
        return this.getTabProperty(tab, this._linkUnderlineStyle.value, this._linkNoUnderlineStyle.value);
    };
    /* Privates */
    TabControl.prototype.getTabProperty = function (tab, property, fallbackProperty) {
        // current tab if selected
        if (tab === this.selectedTab) {
            return property;
        }
        // Tab is not default or selected tab
        return fallbackProperty;
    };
    Object.defineProperty(TabControl.prototype, "selectedTab", {
        get: function () {
            return this._currentTab || this.defaultTab;
        },
        enumerable: true,
        configurable: true
    });
    TabControl.prototype.hookEventListeners = function (hook) {
        var hookMethod = Utilities_1.getEventHookMethodForTarget(window, hook);
        hookMethod("keydown", this._windowKeyPressHandlerBind);
        hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod("keydown", this._rootKeyPressHandlerBind);
    };
    TabControl.prototype.getNextTabIndex = function (shiftPressed) {
        var currentTabIndex = this.tabs.indexOf(this.selectedTab);
        var nextTabIndex = shiftPressed ? (currentTabIndex - 1) : (currentTabIndex + 1);
        // We are at the first tab
        if (nextTabIndex < 0) {
            nextTabIndex = this.tabs.length - 1;
        }
        // We are at the last tab
        if (nextTabIndex >= this.tabs.length) {
            nextTabIndex = 0;
        }
        return nextTabIndex;
    };
    Object.defineProperty(TabControl.prototype, "defaultTab", {
        get: function () {
            return this.opts.defaulttab;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabControl.prototype, "defaultTabIndex", {
        get: function () {
            return this.tabs.indexOf(this.defaultTab);
        },
        enumerable: true,
        configurable: true
    });
    TabControl.prototype.focusAdjacentTab = function (prior) {
        var nextTabIndex = this.getNextTabIndex(prior);
        if (nextTabIndex >= 0) {
            var nextTab = this.root.getElementsByTagName("a").item(nextTabIndex);
            if (nextTab) {
                nextTab.focus();
                nextTab.click();
            }
        }
    };
    TabControl = __decorate([
        template("\n<tab-control class=\"tab-control\">\n    <div style={this.tabStyle}\n        role=\"tablist\"\n        aria-atomic=\"true\">\n        <a each={tab in this.tabs}\n           class={this.linkClass(tab)}\n           style={this.linkStyle(tab)}\n           aria-selected={tab === this.selectedTab}\n           onclick={this.tabClickEvent}\n           onkeypress={keyPressToClickHelper}\n           tabindex={this.tabIndex(tab)}\n           role=\"tab\"\n           aria-controls={this.tabPanelId}>\n            {tab.tabName}\n        </a>\n    </div>\n</tab-control>")
    ], TabControl);
    return TabControl;
}(Riot.Element));
//# sourceMappingURL=tab-control.js.map