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
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var lazy_1 = require("../../lib/lazy");
/**
 * Helper component that displays a checkbox with a text label
 */
var CheckboxWithLabel = /** @class */ (function (_super) {
    __extends(CheckboxWithLabel, _super);
    function CheckboxWithLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this._styles = new CheckboxWithLabelStyles();
        return _this;
    }
    Object.defineProperty(CheckboxWithLabel.prototype, "label", {
        get: function () {
            return this.opts.label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "isSelected", {
        get: function () {
            return this.opts.isselected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "isDisabled", {
        get: function () {
            return this.opts.isdisabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "tooltip", {
        get: function () {
            return this.opts.tooltip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "value", {
        get: function () {
            return this.opts.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "labelClickedCallback", {
        get: function () {
            return this.opts.labelcallback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "checkboxStyle", {
        get: function () {
            return this._styles.checkboxStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "divStyle", {
        /* Styles */
        get: function () {
            return this._styles.divStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "labelStyle", {
        get: function () {
            return this._styles.labelStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "labelSpanStyle", {
        get: function () {
            if (this.isDisabled) {
                return "";
            }
            return this._styles.pointerStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxWithLabel.prototype, "labelDivStyle", {
        get: function () {
            return this._styles.labelDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    CheckboxWithLabel.prototype.onCheckboxFocusChange = function (event) {
        if (!event || !event.target) {
            return;
        }
        var className = "focused-checkbox-outline";
        var container = this.root.firstElementChild;
        if (container && event.type === "blur") {
            container.classList.remove(className);
        }
        if (container && event.type === "focus") {
            container.classList.add(className);
        }
    };
    CheckboxWithLabel = __decorate([
        template("\n<checkbox-with-label>\n    <div style={labelDivStyle}>\n        <label style={labelStyle}\n               onclick={this.labelClickedCallback}>\n            <input type=\"checkbox\"\n                   class=\"options-checkbox\"\n                   style={checkboxStyle}\n                   checked={isSelected}\n                   value={value}\n                   disabled={isDisabled}\n                   onfocus={this.onCheckboxFocusChange}\n                   onblur={this.onCheckboxFocusChange} />\n\n            <div class=\"checkbox-label\"\n                 style={divStyle}\n                 title={tooltip}>\n                <span style={this.labelSpanStyle}>{label}</span>\n            </div>\n        </label>\n    </div>\n</checkbox-with-label>")
    ], CheckboxWithLabel);
    return CheckboxWithLabel;
}(Riot.Element));
var CheckboxWithLabelStyles = /** @class */ (function () {
    function CheckboxWithLabelStyles() {
        this.checkboxStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                margin: "0px",
                webkitMarginEnd: "7px"
            });
            return style.toString();
        });
        this.divStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0px",
                fontSize: ".75rem",
                lineHeight: "1.3",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            });
            return style.toString();
        });
        this.labelDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                marginBottom: "1px",
                padding: "0px 2px 1px",
                width: "calc(100% - 4px)",
            });
            return style.toString();
        });
        this.labelStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                overflow: "hidden",
            });
            return style.toString();
        });
        this.pointerStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                cursor: "pointer"
            });
            return style.toString();
        });
    }
    return CheckboxWithLabelStyles;
}());
//# sourceMappingURL=checkbox-with-label.js.map