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
var checkbox_state_1 = require("../interfaces/checkbox-state");
var product_button_click_event_1 = require("../Events/custom-events/product-button-click-event");
require("./options-dropdown");
/* istanbul ignore next */
var ProductButtonLayout = /** @class */ (function (_super) {
    __extends(ProductButtonLayout, _super);
    function ProductButtonLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onCheckboxClickedBind = _this.onCheckboxClicked.bind(_this);
        _this.onButtonClickBind = _this.onButtonClick.bind(_this);
        return _this;
        /* tslint:enable:no-unused-variable */
    }
    ProductButtonLayout.prototype.onButtonClick = function (event) {
        var item = event.item.item;
        var buttonClickEvent = new product_button_click_event_1.ProductButtonClickEvent(item.id, this.product);
        buttonClickEvent.dispatch(this.root);
    };
    Object.defineProperty(ProductButtonLayout.prototype, "product", {
        get: function () {
            return this.opts.product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "checkboxStateIsNullOrUndefined", {
        get: function () {
            return this.opts.checkboxState === null || this.opts.checkboxState === undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "showCheckbox", {
        get: function () {
            return !this.checkboxStateIsNullOrUndefined && this.opts.checkboxState !== checkbox_state_1.CheckboxState.None;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "isCheckboxChecked", {
        get: function () {
            return !this.checkboxStateIsNullOrUndefined && this.opts.checkboxState === checkbox_state_1.CheckboxState.Checked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "checkboxLabel", {
        get: function () {
            return this.opts.checkboxLabel;
        },
        enumerable: true,
        configurable: true
    });
    ProductButtonLayout.prototype.onCheckboxClicked = function (event) {
        var _this = this;
        // prevent the checkbox from being updated. Allows the callback to handle changing state.
        event.preventDefault();
        event.preventUpdate = true;
        // Gives the UI time to update
        setImmediate(function () {
            if (_this.opts.onCheckboxClicked) {
                _this.opts.onCheckboxClicked(event);
            }
        });
    };
    Object.defineProperty(ProductButtonLayout.prototype, "disableMenu", {
        get: function () {
            return !!this.opts.disablemenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "actionButtons", {
        get: function () {
            return this.opts.actionbuttons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "actionMenuButtons", {
        get: function () {
            return this.opts.actionmenubuttons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "showOptionsDropdown", {
        get: function () {
            return this.actionMenuButtons && this.actionMenuButtons.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "buttonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                marginRight: "6px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "buttonDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "flex-start",
                display: "flex",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "checkboxWithLabelStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                height: "25px",
                paddingLeft: "15px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "checkboxLabelStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
                webkitUserSelect: "none",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "checkboxStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                webkitMarginEnd: "9px",
                webkitMarginStart: "1px",
                width: "13px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductButtonLayout.prototype, "labelDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                webkitMarginEnd: "1px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /* tslint:disable:no-unused-variable */
    ProductButtonLayout.prototype.onCheckboxFocusChange = function (event) {
        if (!event || !event.target) {
            return;
        }
        var className = "focused-checkbox-outline";
        var checkbox = event.target;
        var label = checkbox && checkbox.parentElement;
        if (label && event.type === "blur") {
            label.classList.remove(className);
        }
        if (label && event.type === "focus") {
            label.classList.add(className);
        }
    };
    ProductButtonLayout = __decorate([
        template("\n<product-button-layout>\n    <div style={buttonDivStyle}>\n\n        <button each={item in this.actionButtons}\n                style={buttonStyle}\n                id={item.id}\n                onclick={this.parent.onButtonClickBind}\n                disabled={item.disabled}\n                title={item.tooltip}\n                no-reorder>\n            {item.text}\n        </button>\n\n        <options-dropdown if={this.showOptionsDropdown}\n                          menuOptions={this.actionMenuButtons}\n                          disablemenu={this.disableMenu}\n                          product={this.product} />\n\n        <div if={this.showCheckbox}\n             style={this.checkboxWithLabelStyle}>\n            <label style={this.checkboxLabelStyle}>\n                <input style={this.checkboxStyle}\n                       type=\"checkbox\"\n                       class=\"product-button-layout-checkbox\"\n                       onclick={this.onCheckboxClickedBind}\n                       checked={this.isCheckboxChecked}\n                       onfocus={this.onCheckboxFocusChange}\n                       onblur={this.onCheckboxFocusChange}\n                       aria-label={this.checkboxLabel} />\n                <div style={this.labelDivStyle}>\n                    {this.checkboxLabel}\n                </div>\n            </label>\n        </div>\n    </div>\n</product-button-layout>")
    ], ProductButtonLayout);
    return ProductButtonLayout;
}(Riot.Element));
exports.ProductButtonLayout = ProductButtonLayout;
//# sourceMappingURL=product-button-layout.js.map