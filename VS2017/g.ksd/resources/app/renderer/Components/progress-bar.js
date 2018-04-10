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
var progress_calculator_1 = require("../progress-calculator");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var features_1 = require("../../lib/feature-flags/features");
var factory_1 = require("../stores/factory");
var ProgressBar = /** @class */ (function (_super) {
    __extends(ProgressBar, _super);
    function ProgressBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ProgressBar.prototype, "progressText", {
        get: function () {
            if (!this.opts.details) {
                return "";
            }
            return ResourceStrings_1.ResourceStrings.asPercentage("" + Math.floor(this.progress));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBar.prototype, "progress", {
        get: function () {
            if (!this.opts.details) {
                return 0;
            }
            return this.opts.details.progress * 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBar.prototype, "ariaProgressText", {
        get: function () {
            if (!this.opts.details) {
                return this.progressText;
            }
            switch (this.opts.details.type) {
                case progress_calculator_1.ProgressDisplayType.Install:
                    return this.getInstallAriaProgressText;
                case progress_calculator_1.ProgressDisplayType.Uninstall:
                    return ResourceStrings_1.ResourceStrings.uninstalledProgressLabel(Math.floor(this.progress));
                case progress_calculator_1.ProgressDisplayType.PausingInstall:
                    return ResourceStrings_1.ResourceStrings.appliedProgressLabel(Math.floor(this.progress));
                case progress_calculator_1.ProgressDisplayType.Download:
                    return this.getDownloadAriaProgressText;
                case progress_calculator_1.ProgressDisplayType.PausingDownload:
                    return ResourceStrings_1.ResourceStrings.acquiredProgressLabel(Math.floor(this.progress));
                default:
                    console.log("Unrecognized ProgressDisplayType: " + this.opts.details.type);
                    return this.progressText;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBar.prototype, "innerProgressLayoutStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBar.prototype, "progressTextStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 40px",
                fontSize: ".75rem",
                webkitMarginEnd: "6px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBar.prototype, "progressBarStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 280px",
                height: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBar.prototype, "getDownloadAriaProgressText", {
        get: function () {
            if (factory_1.featureStore.isEnabled(features_1.Feature.ShowBitrate)) {
                return ResourceStrings_1.ResourceStrings.acquiredProgressLabel(Math.floor(this.progress));
            }
            return ResourceStrings_1.ResourceStrings.downloadProgressWithRate(Math.floor(this.progress));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBar.prototype, "getInstallAriaProgressText", {
        get: function () {
            if (factory_1.featureStore.isEnabled(features_1.Feature.ShowBitrate)) {
                return ResourceStrings_1.ResourceStrings.appliedProgressLabel(Math.floor(this.progress));
            }
            return ResourceStrings_1.ResourceStrings.installProgressWithRate(Math.floor(this.progress));
        },
        enumerable: true,
        configurable: true
    });
    ProgressBar = __decorate([
        template("\n<progress-bar>\n    <div style={this.innerProgressLayoutStyle}>\n        <div id=\"progress-div\"\n                style={this.progressTextStyle}\n                aria-label={this.ariaProgressText}\n                tabindex=\"0\">\n                {this.progressText}\n        </div>\n        <progress style={this.progressBarStyle}\n                    value={this.progress}\n                    max=\"100\" />\n    </div>\n</progress-bar>")
    ], ProgressBar);
    return ProgressBar;
}(Riot.Element));
//# sourceMappingURL=progress-bar.js.map