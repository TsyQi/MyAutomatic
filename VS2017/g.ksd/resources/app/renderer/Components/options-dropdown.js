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
var KeyCodes_1 = require("../KeyCodes");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var factory_1 = require("../Actions/factory");
var product_button_click_event_1 = require("../Events/custom-events/product-button-click-event");
var MenuDropdownState;
(function (MenuDropdownState) {
    MenuDropdownState[MenuDropdownState["Hidden"] = 0] = "Hidden";
    MenuDropdownState[MenuDropdownState["Showing"] = 1] = "Showing";
    MenuDropdownState[MenuDropdownState["Visible"] = 2] = "Visible";
    MenuDropdownState[MenuDropdownState["Hiding"] = 3] = "Hiding";
})(MenuDropdownState || (MenuDropdownState = {}));
var OptionsDropdown = /** @class */ (function (_super) {
    __extends(OptionsDropdown, _super);
    function OptionsDropdown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this.onMenuButtonClickBind = _this.onMenuButtonClick.bind(_this);
        _this.onToggleOptionsMenuBind = _this.onToggleOptionsMenu.bind(_this);
        _this._losingFocus = false;
        _this._dropdownState = MenuDropdownState.Hidden;
        _this._onKeyDownBind = _this.onKeyDown.bind(_this);
        _this._onFocusOutBind = _this.onFocusOut.bind(_this);
        _this._dropDownMenuWidth = "82px";
        _this._dropDownMenuMaxWidth = "122px";
        return _this;
    }
    OptionsDropdown.prototype.mounted = function () {
        this._menuButton = this.root.getElementsByClassName("install-options-button")[0];
    };
    OptionsDropdown.prototype.unmounted = function () {
        if (this._menuElement) {
            this.hookEvents(false);
        }
    };
    OptionsDropdown.prototype.updated = function () {
        if (this._dropdownState === MenuDropdownState.Showing) {
            this._dropdownState = MenuDropdownState.Visible;
            this._menuButton.tabIndex = -1;
            // The menu doesn't exist in the DOM until it is opened
            // On first opening, set the private member to be the menu then hook up the listeners
            if (!this._menuElement) {
                this._menuElement = this.root.querySelector(".dropdown-content");
                this.hookEvents(true);
            }
            var firstOption = this._menuElement.firstElementChild;
            firstOption.focus();
        }
        if (this._dropdownState === MenuDropdownState.Hiding) {
            this._dropdownState = MenuDropdownState.Hidden;
            this._menuButton.tabIndex = 0;
        }
    };
    Object.defineProperty(OptionsDropdown.prototype, "menuOptions", {
        get: function () {
            return this.opts.menuoptions || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "optionsMenuTitle", {
        get: function () {
            return this.resourceStrings.optionsMenuTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "isButtonVisible", {
        get: function () {
            return this.opts && this.menuOptions && this.menuOptions.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "isButtonDisabled", {
        get: function () {
            return !!this.opts.disablemenu;
        },
        enumerable: true,
        configurable: true
    });
    OptionsDropdown.prototype.onToggleOptionsMenu = function (event) {
        event.stopPropagation();
        this.toggleOptionsMenu();
    };
    OptionsDropdown.prototype.toggleOptionsMenu = function () {
        if (this.isMenuVisible) {
            factory_1.optionsDropdownActions.logCloseMenu();
            this._dropdownState = MenuDropdownState.Hiding;
        }
        else {
            factory_1.optionsDropdownActions.logOpenMenu();
            this._dropdownState = MenuDropdownState.Showing;
        }
        this.update();
    };
    OptionsDropdown.prototype.onMenuButtonClick = function (event) {
        var options = event.item.option;
        factory_1.optionsDropdownActions.logActivateMenuItem(options);
        // Dispatch the button click event
        var ev = new product_button_click_event_1.ProductButtonClickEvent(options.id, this.opts.product);
        ev.dispatch(this.root);
        this.toggleOptionsMenu();
    };
    Object.defineProperty(OptionsDropdown.prototype, "dropDownButtonText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.more;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "dropDownButtonStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                marginBottom: "1px",
                padding: "0px 6px",
                minWidth: this._dropDownMenuWidth,
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "optionsSvgStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "18px",
                marginLeft: "4px",
                opacity: this.isButtonDisabled ? ".5" : "1",
                width: "18px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "pathStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fill: "inherit"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "dropdownMenuStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                /* this "color" is left here because it is really an opacity */
                boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
                flexDirection: "column",
                display: "flex",
                outline: "none",
                position: "absolute",
                minWidth: this._dropDownMenuWidth,
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "menuButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                padding: "1px 0px",
                textAlign: "center",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: this._dropDownMenuMaxWidth,
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptionsDropdown.prototype, "buttonTextStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                // We want the padding to be "0px 20px", however margins and the svg image force us to compensate.
                padding: "0px 5px 0px 12px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hooks or unhooks events for this component
     */
    OptionsDropdown.prototype.hookEvents = function (hook) {
        if (this._menuElement) {
            var hookMethod = Utilities_1.getEventHookMethodForTarget(this._menuElement, hook);
            hookMethod("focusout", this._onFocusOutBind);
            hookMethod("keydown", this._onKeyDownBind);
        }
    };
    OptionsDropdown.prototype.onKeyDown = function (ev) {
        var elActive = document.activeElement;
        ev.stopPropagation();
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
        if (this._menuElement.contains(elActive)) {
            ev.preventDefault();
            if (ev.keyCode === KeyCodes_1.keyCodes.ESC) {
                this.toggleOptionsMenu();
                this._menuButton.focus();
            }
            else if (this._menuElement === elActive) {
                this._menuElement.firstElementChild.focus();
            }
            else {
                if (ev.keyCode === KeyCodes_1.keyCodes.DOWN) {
                    var elNextSibling = elActive.nextElementSibling;
                    if (elNextSibling) {
                        elNextSibling.focus();
                    }
                    else {
                        this._menuElement.firstElementChild.focus();
                    }
                }
                else if (ev.keyCode === KeyCodes_1.keyCodes.UP) {
                    var elPreviousSibling = elActive.previousElementSibling;
                    if (elPreviousSibling) {
                        elPreviousSibling.focus();
                    }
                    else {
                        this._menuElement.lastElementChild.focus();
                    }
                }
            }
        }
    };
    OptionsDropdown.prototype.onFocusOut = function (ev) {
        var _this = this;
        // requestAnimation frame is needed because we call document.activeElement
        requestAnimationFrame(function () {
            var activeEl = document.activeElement;
            if (_this.shouldCloseMenu(_this._menuElement, activeEl)) {
                _this._losingFocus = false;
                _this.toggleOptionsMenu();
            }
        });
    };
    Object.defineProperty(OptionsDropdown.prototype, "isMenuVisible", {
        get: function () {
            return this._dropdownState === MenuDropdownState.Showing ||
                this._dropdownState === MenuDropdownState.Visible;
        },
        enumerable: true,
        configurable: true
    });
    OptionsDropdown.prototype.shouldCloseMenu = function (menu, activeEl) {
        // if the menu is visible,
        // and the active element is not the button to open/close the dropdown,
        // and the menu div does not contain the active element
        // then toggle the menu
        // this covers most of the keyboard interactions (click away, tab, esc w/ child focused)
        return (this.isMenuVisible && (activeEl !== this._menuButton) && !menu.contains(activeEl)) ||
            // if the menu IS the active element
            // then toggle the menu
            // this covers hitting escape while focus is still on the menu (opened menu and no child was focused)
            (menu === activeEl) ||
            // if the menu lost focus due to shift+tab
            // then toggle the menu
            this._losingFocus;
    };
    OptionsDropdown = __decorate([
        template("\n<options-dropdown>\n    <button if={this.isButtonVisible}\n            disabled={this.isButtonDisabled}\n            class=\"install-options-button\"\n            style={this.dropDownButtonStyle}\n            onclick={this.onToggleOptionsMenuBind}\n            title={this.optionsMenuTitle}\n            aria-label={this.optionsMenuTitle}\n            aria-haspopup=\"true\">\n        <div style={this.buttonTextStyle}>\n            {this.dropDownButtonText}\n            <img style={this.optionsSvgStyle}\n                src=\"./images/ArrowDropdown.svg\" />\n        </div>\n    </button>\n\n    <div if={this.isMenuVisible}\n         class=\"dropdown-content\"\n         style={this.dropdownMenuStyle}>\n\n        <virtual each={option, i in this.menuOptions} no-reorder>\n            <button style={this.menuButtonStyle}\n                    onclick={this.onMenuButtonClickBind}\n                    title={option.text}\n                    tabindex=\"-1\">\n                {option.text}\n            </button>\n        </virtual>\n    </div>\n</options-dropdown>")
    ], OptionsDropdown);
    return OptionsDropdown;
}(Riot.Element));
//# sourceMappingURL=options-dropdown.js.map