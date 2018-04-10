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
var Product_1 = require("../../lib/Installer/Product");
require("./product-button-layout");
/* istanbul ignore next */
var ProductView = /** @class */ (function (_super) {
    __extends(ProductView, _super);
    function ProductView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ProductView.prototype, "checkboxLabel", {
        get: function () {
            return this.opts.buttonoptions.checkboxLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "checkboxState", {
        get: function () {
            return this.opts.buttonoptions.checkboxState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "onCheckboxClicked", {
        get: function () {
            return this.opts.buttonoptions.onCheckboxClicked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "product", {
        get: function () {
            return this.opts.product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "disableMenu", {
        get: function () {
            return !!this.opts.disablemenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "showVersion", {
        get: function () {
            return !this.opts.hideversion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "longDescription", {
        get: function () {
            return this.opts.product
                && (this.opts.product.description || this.opts.product.longDescription);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "tooltipText", {
        get: function () {
            return this.title + "\n" + this.version + "\n" + this.longDescription;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "title", {
        get: function () {
            if (!this.opts.product) {
                return "";
            }
            var product = this.opts.product;
            if (Product_1.isTypeOfInstalledProduct(product)) {
                return product.displayNameWithNickname;
            }
            return product.displayName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "version", {
        get: function () {
            if (this.opts.productversion) {
                return this.opts.productversion || "";
            }
            return this.opts.product.version.display || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "channelName", {
        get: function () {
            return "" + this.opts.product.channel.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "isIconValid", {
        get: function () {
            return this.icon && this.icon.isValid();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "iconSrc", {
        get: function () {
            return Utilities_1.getImgSrcFromIcon(this.icon);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "actionButtonOptions", {
        get: function () {
            return this.opts.buttonoptions.actionbuttons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "dropdownOptions", {
        get: function () {
            return this.opts.buttonoptions.actionmenubuttons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "parentStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
                overflow: "hidden",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "customContentStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "1 0 0",
                flexDirection: "column",
                fontSize: ".75rem",
                justifyContent: "space-between",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "mainContentStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "1 0 0",
                flexDirection: "row",
                marginTop: "-1px",
                webkitMarginStart: "36px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "yieldContainerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                marginBottom: "5px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "titleStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                webkitMarginStart: "12px",
                whiteSpace: "nowrap",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "titleDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "productButtonLayoutStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "imgStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "22px",
                marginTop: "1px",
                width: "22px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "versionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: ".75rem",
                height: "1.125rem",
                margin: "5px 0px",
                overflow: "hidden",
                webkitMarginStart: "36px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductView.prototype, "icon", {
        get: function () {
            return this.opts.product.icon;
        },
        enumerable: true,
        configurable: true
    });
    ProductView = __decorate([
        template("\n<product-view>\n    <div style={this.parentStyle}>\n\n        <div style={this.titleDivStyle}\n             title={this.tooltipText}>\n            <img if={this.isIconValid}\n                src={this.iconSrc}\n                style={this.imgStyle} />\n\n            <div style={this.titleStyle}\n                 role=\"heading\">\n                {this.title}\n            </div>\n        </div>\n\n        <!-- Product display version -->\n        <div if={this.showVersion}\n             class=\"product-description\"\n             style={this.versionStyle}\n             aria-label={this.version}>\n            {this.version}\n        </div>\n\n        <!-- Stuff that goes under the title of the product -->\n        <div style={this.mainContentStyle}>\n            <div style={this.customContentStyle}\n                 role=\"group\"\n                 aria-label={this.title}>\n\n                <div style={this.yieldContainerStyle}>\n                    <yield />\n                </div>\n\n                <!-- Buttons and drop down -->\n                <div style={this.productButtonLayoutStyle}>\n                    <product-button-layout actionbuttons={this.actionButtonOptions}\n                                           actionmenubuttons={this.dropdownOptions}\n                                           disablemenu={this.disableMenu}\n                                           checkbox-state={this.checkboxState}\n                                           on-checkbox-clicked={this.onCheckboxClicked}\n                                           checkbox-label={this.checkboxLabel}\n                                           product={this.product} />\n                </div>\n            </div>\n        </div>\n\n        </div>\n</product-view>")
    ], ProductView);
    return ProductView;
}(Riot.Element));
exports.ProductView = ProductView;
//# sourceMappingURL=product-view.js.map