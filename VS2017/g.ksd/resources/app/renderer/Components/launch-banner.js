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
var launch_banner_actions_1 = require("../Actions/launch-banner-actions");
var css_styles_1 = require("../css-styles");
var Utilities_1 = require("../Utilities");
var InstallerActions_1 = require("../Actions/InstallerActions");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
require("./x-glyph");
/* istanbul ignore next */
var LaunchBanner = /** @class */ (function (_super) {
    __extends(LaunchBanner, _super);
    function LaunchBanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dismissBind = _this.dismiss.bind(_this);
        _this.openLogBind = _this.openLog.bind(_this);
        _this.launchProductBind = _this.launchProduct.bind(_this);
        _this._styles = new LaunchBannerStyles();
        return _this;
    }
    Object.defineProperty(LaunchBanner.prototype, "dismissTitle", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.closeBanner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "launchButtonText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.launch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "launchButtonTitle", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.launch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "productIconUrl", {
        get: function () {
            if (!this.opts.product) {
                return "";
            }
            return Utilities_1.getImgSrcFromIcon(this.opts.product.product.icon);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "productName", {
        get: function () {
            if (!this.opts.product) {
                return "";
            }
            return this.opts.product.product.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "productWarningMessage", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.setupCompletedWithWarnings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "showLogLink", {
        get: function () {
            if (!this.opts.product) {
                return false;
            }
            return !!this.opts.product.log;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "showWarning", {
        get: function () {
            if (!this.opts.product) {
                return false;
            }
            return this.opts.product.product.hasErrors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "startNowText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.startNow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "styles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "successMessage", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.installationSucceeded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "viewLogText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.viewLog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBanner.prototype, "telemetryContext", {
        get: function () {
            return {
                userRequestedOperation: "launch",
                // Since the launch banner is shown, it has to be the first install experience.
                isFirstInstallExperience: true,
                // With the launch banner there can only be 1 install
                numberOfInstalls: 1,
                // Launch can never be initiated from the command line.
                initiatedFromCommandLine: false,
            };
        },
        enumerable: true,
        configurable: true
    });
    LaunchBanner.prototype.launchProduct = function (ev) {
        InstallerActions_1.launch(this.opts.product.product, this.telemetryContext);
    };
    LaunchBanner.prototype.dismiss = function (ev) {
        launch_banner_actions_1.closeLaunchBanner();
    };
    LaunchBanner.prototype.openLog = function (ev) {
        InstallerActions_1.openLog(this.opts.product.log);
    };
    LaunchBanner = __decorate([
        template("\n<launch-banner>\n    <div style={this.styles.rootDiv}>\n\n        <div class=\"launch-banner\" style={this.styles.launchBanner}>\n\n            <!-- This img is used for sizing, and should always be hidden from the UI -->\n            <!-- The real image that is CSS, so it can be hidden with high-contrast mode -->\n            <img src=\"images/first-install-success-banner.svg\" style=\"visibility: hidden\" />\n        </div>\n\n        <div style={this.styles.mainFlexContainer}>\n\n            <!-- Product name pane -->\n            <div style={this.styles.productNamePane}>\n                <div style={this.styles.productAndIconDiv} title={this.productName}>\n                    <img style={this.styles.productIcon} src={this.productIconUrl} />\n                    <div style={this.styles.productName}>\n                        {this.productName}\n                    </div>\n                </div>\n\n                <div style={this.styles.successMessage}>\n                    {this.successMessage}\n                </div>\n\n                <!-- View log link -->\n                <div style={this.styles.viewLogDiv}>\n                    <a if={this.showLogLink}\n                        onclick={this.openLogBind}\n                        tabindex=\"0\">\n                            {this.viewLogText}\n                        </a>\n                </div>\n\n                <product-status\n                    if={this.showWarning}\n                    message={this.productWarningMessage}\n                    iscritical={false}></product-status>\n            </div>\n\n            <!-- Launch button pane -->\n            <div style={this.styles.launchButtonPane}>\n                <div class=\"start-now-header\" style={this.styles.startNow}>{this.startNowText}</div>\n                <button\n                    class=\"colored-launch-button\"\n                    onclick={this.launchProductBind}\n                    title={this.launchButtonTitle}>{this.launchButtonText}</button>\n            </div>\n        </div>\n\n        <!-- Close button is located in the top right-hand corner, but appears last in the DOM for tab order -->\n        <div style={this.styles.closeButtonDiv}>\n            <button\n                class=\"dismiss-launch-banner-button\"\n                style={this.styles.closeButton}\n                title={this.dismissTitle}\n                onclick={this.dismissBind}>\n                <x-glyph></x-glyph>\n            </button>\n        </div>\n    </div>\n</launch-banner>")
    ], LaunchBanner);
    return LaunchBanner;
}(Riot.Element));
exports.LaunchBanner = LaunchBanner;
/* istanbul ignore next */
var LaunchBannerStyles = /** @class */ (function () {
    function LaunchBannerStyles() {
    }
    Object.defineProperty(LaunchBannerStyles.prototype, "closeButton", {
        get: function () {
            var buttonSize = "16px";
            var style = css_styles_1.createStyleMap({
                // In order to leverage the banner image sizing for layout,
                // we use position absolute to layer content on top of it.
                // Buttons that appear after the image in the DOM must be position
                // absolute to get clicks.
                position: "absolute",
                height: buttonSize,
                lineHeight: "0",
                margin: "8px 0",
                padding: "0",
                width: buttonSize,
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "closeButtonDiv", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                height: "0",
                margin: "0 4px",
                justifyContent: "flex-end",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "launchBanner", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                maxHeight: "450px",
                minWidth: "922px",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "launchButtonPane", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                boxSizing: "border-box",
                flex: "1 0 0",
                webkitPaddingStart: "40px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "mainFlexContainer", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                boxSizing: "border-box",
                display: "flex",
                height: "100%",
                width: "100%",
                paddingTop: "36px",
                position: "absolute",
                maxHeight: "450px",
                maxWidth: "1590px",
                minWidth: "922px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "productAndIconDiv", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "productIcon", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                width: "24px",
                height: "24px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "productName", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "1.1rem",
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
    Object.defineProperty(LaunchBannerStyles.prototype, "productNamePane", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                boxSizing: "border-box",
                flex: "0 0 auto",
                // Magic width to synchronize with background image
                // if the background changes, change this value.
                width: "38.5%",
                webkitPaddingStart: "40px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "rootDiv", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column-reverse",
                overflow: "hidden",
                position: "relative",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "startNow", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "1.4rem",
                webkitPaddingAfter: "10px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "successMessage", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "1.4rem",
                webkitMarginAfter: "10px",
                webkitMarginBefore: "14px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LaunchBannerStyles.prototype, "viewLogDiv", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                webkitMarginStart: "24px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    return LaunchBannerStyles;
}());
exports.LaunchBannerStyles = LaunchBannerStyles;
//# sourceMappingURL=launch-banner.js.map