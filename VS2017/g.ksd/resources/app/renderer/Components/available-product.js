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
var button_options_1 = require("../interfaces/button-options");
var css_styles_1 = require("../css-styles");
var open_external_1 = require("../../lib/open-external");
var open_external_actions_1 = require("../Actions/open-external-actions");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
require("./product-view");
var AvailableProductOpts = /** @class */ (function () {
    function AvailableProductOpts() {
    }
    return AvailableProductOpts;
}());
exports.AvailableProductOpts = AvailableProductOpts;
var AvailableProduct = /** @class */ (function (_super) {
    __extends(AvailableProduct, _super);
    function AvailableProduct() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.licenseLinkClickedBind = _this.licenseLinkClicked.bind(_this);
        _this.releaseNotesClickedBind = _this.releaseNotesClicked.bind(_this);
        return _this;
    }
    Object.defineProperty(AvailableProduct.prototype, "title", {
        get: function () {
            return this.opts.product.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "product", {
        get: function () {
            return this.opts.product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "description", {
        get: function () {
            return this.opts.product.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "licenseLinkText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.licenseLinkText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "pipeStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: ".7rem",
                margin: "0 4px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "singleLineStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                marginRight: "5px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "buttonOptions", {
        get: function () {
            var installButtonOptions = {
                text: ResourceStrings_1.ResourceStrings.install,
                id: button_options_1.ButtonIds.install,
                disabled: this.opts.installblocked,
            };
            return {
                actionbuttons: [installButtonOptions],
                actionmenubuttons: undefined,
                product: this.product,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "releaseNotesText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.releaseNotes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "showLicense", {
        get: function () {
            var asProductSummary = this.opts.product;
            return !!asProductSummary.license;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "linksDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                margin: "1px 0px 4px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "longDescriptionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "2.15rem",
                marginRight: "1px",
                overflow: "hidden",
                // Multiline ellipsis
                display: "-webkit-box",
                webkitLineClamp: "2",
                webkitBoxOrient: "vertical",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AvailableProduct.prototype, "longDescriptionText", {
        get: function () {
            return this.product.longDescription || this.product.description;
        },
        enumerable: true,
        configurable: true
    });
    AvailableProduct.prototype.licenseLinkClicked = function (ev) {
        var url = this.opts.product.license;
        if (url) {
            open_external_1.openExternal(url);
        }
    };
    AvailableProduct.prototype.releaseNotesClicked = function (ev) {
        open_external_actions_1.openReleaseNotesUrl(this.product.releaseNotes);
    };
    AvailableProduct = __decorate([
        template("\n<available-product>\n    <product-view buttonoptions={this.buttonOptions}\n                  product={this.product}>\n\n        <!-- Long description -->\n        <span class=\"product-description\"\n              tabindex=\"0\"\n              aria-label={this.parent.longDescriptionText}\n              style={this.parent.longDescriptionStyle}>\n            {this.parent.longDescriptionText}\n        </span>\n\n        <div style={this.parent.linksDivStyle}>\n\n            <!-- \"License\" and \"Release notes\" links -->\n            <span style={this.parent.singleLineStyle}>\n\n                <!-- \"License\" link -->\n                <a if={this.parent.showLicense}\n                    href=\"#\"\n                    class=\"clickable\"\n                    onClick={this.parent.licenseLinkClickedBind}\n                    onkeypress={keyPressToClickHelper}\n                    title={this.parent.licenseLinkText}>\n                        {this.parent.licenseLinkText}</a><!-- The closing tag is here so there's no extra space -->\n\n                <!-- Separator -->\n                <span style={this.parent.pipeStyle} class=\"disabled-text sub-title\"> | </span>\n\n                <!-- \"Release notes\" link -->\n                <a href=\"#\"\n                    class=\"clickable\"\n                    onClick={this.parent.releaseNotesClickedBind}\n                    onkeypress={keyPressToClickHelper}\n                    title={this.parent.releaseNotesText}>\n                        {this.parent.releaseNotesText}</a><!-- The closing tag is here so there's no extra space -->\n            </span>\n        </div>\n\n    </product-view>\n</available-product>")
    ], AvailableProduct);
    return AvailableProduct;
}(Riot.Element));
exports.AvailableProduct = AvailableProduct;
//# sourceMappingURL=available-product.js.map