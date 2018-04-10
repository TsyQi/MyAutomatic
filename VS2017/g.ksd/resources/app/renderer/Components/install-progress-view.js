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
var Utilities_1 = require("../Utilities");
require("./progress-bar");
var InstallProgressView = /** @class */ (function (_super) {
    __extends(InstallProgressView, _super);
    function InstallProgressView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.emptyString = "";
        return _this;
    }
    Object.defineProperty(InstallProgressView.prototype, "progressBar1", {
        get: function () {
            return this.opts.progressbar1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressView.prototype, "progressBar2", {
        get: function () {
            return this.opts.progressbar2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressView.prototype, "progressCalculator", {
        get: function () {
            return this.opts.calculator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressView.prototype, "isFinishing", {
        get: function () {
            if (this.progressBar2) {
                return this.progressBar2.progress >= 1;
            }
            return this.progressBar1.progress >= 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressView.prototype, "packageId", {
        get: function () {
            if (this.isFinishing) {
                return this.emptyString;
            }
            if (this.opts && this.opts.progressbar2) {
                return this.progressCalculator.getPackageId(this.opts.installationpath, this.opts.progressbar2.type);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressView.prototype, "downloadDetails", {
        get: function () {
            if (!this.opts || !this.opts.progressbar1) {
                return { header: ResourceStrings_1.ResourceStrings.startingOperation, message: this.emptyString };
            }
            var progressInfo = this.progressCalculator.getProgressInfo(this.opts.installationpath, this.opts.progressbar1.type);
            if (!progressInfo || progressInfo.downloadedSize === 0) {
                return { header: ResourceStrings_1.ResourceStrings.startingOperation, message: this.emptyString };
            }
            if (this.opts.progressbar1.progress >= 1) {
                return { header: ResourceStrings_1.ResourceStrings.downloadCompleted, message: this.emptyString };
            }
            var downloadedSizeInKB = (progressInfo.downloadedSize || 0) / 1024;
            var totalSizeInKB = (progressInfo.totalSize || 0) / 1024;
            return {
                header: ResourceStrings_1.ResourceStrings.downloadHeader,
                message: ResourceStrings_1.ResourceStrings.rateMessage(Utilities_1.formatSizeText(downloadedSizeInKB), Utilities_1.formatSizeText(totalSizeInKB))
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressView.prototype, "showBitRate", {
        get: function () {
            if (!this.opts || !this.opts.progressbar1) {
                return false;
            }
            if (this.opts.progressbar1.progress >= 1) {
                return false;
            }
            var progressInfo = this.progressCalculator.getProgressInfo(this.opts.installationpath, this.opts.progressbar1.type);
            if (!progressInfo) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressView.prototype, "downloadSpeed", {
        get: function () {
            if (!this.opts || !this.opts.progressbar1) {
                return this.emptyString;
            }
            var progressInfo = this.progressCalculator.getProgressInfo(this.opts.installationpath, this.opts.progressbar1.type);
            if (!progressInfo) {
                return this.emptyString;
            }
            var speedInKB = (progressInfo.downloadSpeed || 0) / 1024;
            return ResourceStrings_1.ResourceStrings.speedRate(Utilities_1.formatSizeText(speedInKB));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressView.prototype, "installingPackages", {
        get: function () {
            if (!this.opts || !this.opts.progressbar2) {
                return { header: ResourceStrings_1.ResourceStrings.startingOperation, message: this.emptyString };
            }
            var progressInfo = this.progressCalculator.getProgressInfo(this.opts.installationpath, this.opts.progressbar2.type);
            if (!progressInfo || progressInfo.currentPackage === 0) {
                return { header: ResourceStrings_1.ResourceStrings.startingOperation, message: this.emptyString };
            }
            if (this.isFinishing) {
                return { header: ResourceStrings_1.ResourceStrings.finishing, message: this.emptyString };
            }
            return {
                header: ResourceStrings_1.ResourceStrings.packageInstallHeader,
                message: ResourceStrings_1.ResourceStrings.packageInstallMessage + ResourceStrings_1.ResourceStrings.rateMessage(progressInfo.currentPackage.toString(), progressInfo.totalPackages.toString())
            };
        },
        enumerable: true,
        configurable: true
    });
    /* istanbul ignore next */
    InstallProgressView.prototype.messageStyleProgressBar1 = function () {
        var style = css_styles_1.createStyleMap({
            flex: "0 0 auto",
            fontSize: ".75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "95%",
            display: "flex",
        });
        if (!this.progressBar1 || !this.progressBar1.message) {
            style.visibility = "hidden";
        }
        return style.toString();
    };
    /* istanbul ignore next */
    InstallProgressView.prototype.messageStyleProgressBar2 = function () {
        var style = css_styles_1.createStyleMap({
            flex: "0 0 auto",
            fontSize: ".75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "95%",
        });
        if (!this.progressBar2 || !this.progressBar2.message) {
            style.visibility = "hidden";
        }
        return style.toString();
    };
    /* istanbul ignore next */
    InstallProgressView.prototype.progressLayoutStyle = function () {
        var style = css_styles_1.createStyleMap({
            marginTop: "6px",
            display: "flex",
            flexDirection: "column"
        });
        return style.toString();
    };
    /* istanbul ignore next */
    InstallProgressView.prototype.progressViewStyle = function () {
        var style = css_styles_1.createStyleMap({
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around"
        });
        return style.toString();
    };
    /* istanbul ignore next */
    InstallProgressView.prototype.downloadMessageStyle = function () {
        var style = css_styles_1.createStyleMap({
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "95%",
        });
        return style.toString();
    };
    InstallProgressView = __decorate([
        template("\n<install-progress-view>\n    <div style={this.progressLayoutStyle()}>\n        <div style={this.progressViewStyle()}>\n            <div style={this.messageStyleProgressBar1()}>\n                <div style={this.downloadMessageStyle()}>\n                    {this.downloadDetails.header}\n                    <span class=\"progress-view-text\">\n                        {this.downloadDetails.message}\n                    </span>\n                </div>\n                <span class=\"progress-view-text progress-view-speed-text\">\n                    {this.downloadSpeed}\n                </span>\n            </div>\n            <progress-bar details={this.progressBar1}/>\n        </div>\n    </div>\n    <div style={this.progressLayoutStyle()}>\n        <div style={this.progressViewStyle()}>\n            <div style={this.messageStyleProgressBar2()}>\n                {this.installingPackages.header}\n                <span class=\"progress-view-text progress-view-package-text\">\n                     {this.installingPackages.message}\n                </span>\n            </div>\n            <progress-bar details={this.progressBar2}/>\n            <div style={this.messageStyleProgressBar2()}>\n                {this.packageId}\n            </div>\n        </div>\n    </div>\n</install-progress-view>")
    ], InstallProgressView);
    return InstallProgressView;
}(Riot.Element));
exports.InstallProgressView = InstallProgressView;
//# sourceMappingURL=install-progress-view.js.map