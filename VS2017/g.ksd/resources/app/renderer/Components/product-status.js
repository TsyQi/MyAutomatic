"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
/// <reference path="../../typings/riot-ts-missing-declares.d.ts" />
/// <reference path="../bower_components/riot-ts/riot-ts.d.ts" />
var css_styles_1 = require("../css-styles");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var features_1 = require("../../lib/feature-flags/features");
var factory_1 = require("../stores/factory");
var ProductStatus = /** @class */ (function (_super) {
    __extends(ProductStatus, _super);
    function ProductStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ProductStatus.prototype, "iconImgSrc", {
        get: function () {
            if (this.opts.customImage) {
                return this.opts.customImage;
            }
            if (this.isCritical) {
                return "images/StatusCriticalError.svg";
            }
            return "images/Warning.svg";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductStatus.prototype, "message", {
        get: function () {
            return this.opts.message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductStatus.prototype, "isCritical", {
        get: function () {
            return this.opts.iscritical;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductStatus.prototype, "setupFailedText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.setupFailedText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductStatus.prototype, "tooltipText", {
        get: function () {
            return this.isCritical ? this.setupFailedText + "\n" + this.message : this.message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductStatus.prototype, "alignmentDivStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexWrap: "wrap",
                overflow: "hidden",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductStatus.prototype, "partialInstallImgStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "16px",
                width: "16px"
            });
            // We need to bump the critical image down 1px to align properly
            if (this.isCritical) {
                style.marginTop = "1px";
            }
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductStatus.prototype, "errorTextStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0",
                height: "3.15rem",
                margin: "0px 8px",
                overflow: "hidden",
                // Multiline ellipsis
                display: "-webkit-box",
                webkitLineClamp: "2",
                webkitBoxOrient: "vertical",
            });
            if (factory_1.featureStore.isEnabled(features_1.Feature.ShowBitrate)) {
                style.height = "2.15rem";
            }
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    ProductStatus = __decorate([
        template("\n<product-status>\n    <div style={this.alignmentDivStyle}>\n\n        <img src={this.iconImgSrc}\n             style={this.partialInstallImgStyle} />\n\n        <div style={this.errorTextStyle}\n             aria-label={this.tooltipText}\n             title={this.tooltipText}\n             tabindex=\"0\">\n             <div if={this.isCritical}\n                 class=\"error-dialog-title\">\n                 {this.setupFailedText}\n             </div>\n             <div class=\"product-description\">\n                  {this.message}\n             </div>\n        </div>\n    </div>\n</product-status>")
    ], ProductStatus);
    return ProductStatus;
}(Riot.Element));
//# sourceMappingURL=product-status.js.map