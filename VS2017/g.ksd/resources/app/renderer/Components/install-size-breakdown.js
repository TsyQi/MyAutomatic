/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
/// <reference path="../../renderer/bower_components/riot-ts/riot-ts.d.ts" />
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
var path = require("path");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var css_styles_1 = require("../css-styles");
var Utilities_1 = require("../Utilities");
require("./install-size");
require("./progress-ring");
/* istanbul ignore next */
var InstallSizeBreakdown = /** @class */ (function (_super) {
    __extends(InstallSizeBreakdown, _super);
    function InstallSizeBreakdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(InstallSizeBreakdown.prototype, "isEvaluatingParameters", {
        get: function () {
            return !!this.opts.isEvaluatingParameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSizeBreakdown.prototype, "allDrives", {
        get: function () {
            // TODO: once we allow customizing the shared drive, uncomment the third null to reserve space in the UI.
            var drives = [null, null /*, null */];
            var evaluation = this.opts.evaluation;
            if (!evaluation || evaluation.areAllDrivesEquivalent) {
                return drives;
            }
            if (evaluation.systemDriveEvaluation) {
                drives[0] = this.getDriveSizeText(evaluation.systemDriveEvaluation, ResourceStrings_1.ResourceStrings.systemDriveInstallSize);
            }
            if (evaluation.targetDriveEvaluation) {
                drives[1] = this.getDriveSizeText(evaluation.targetDriveEvaluation, ResourceStrings_1.ResourceStrings.targetDriveInstallSize);
            }
            if (evaluation.sharedDriveEvaluation) {
                drives[2] = this.getDriveSizeText(evaluation.sharedDriveEvaluation, ResourceStrings_1.ResourceStrings.sharedDriveInstallSize);
            }
            return drives;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSizeBreakdown.prototype, "totalInstallSizeLabel", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.totalInstallSize("");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSizeBreakdown.prototype, "canInstall", {
        get: function () {
            return !!this.opts.canInstall;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSizeBreakdown.prototype, "totalInstallSizeAccessibilityText", {
        get: function () {
            if (!this.opts.evaluation) {
                return "";
            }
            return ResourceStrings_1.ResourceStrings.totalInstallSize(Utilities_1.formatSizeText(this.opts.evaluation.totalDeltaSize));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSizeBreakdown.prototype, "totalInstallSizeText", {
        get: function () {
            if (!this.opts.evaluation) {
                return "";
            }
            return this.getInstallSizeText(this.opts.evaluation.totalDeltaSize);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSizeBreakdown.prototype, "installSizesDiv", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                flex: "1 0 auto",
                marginBottom: "10px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSizeBreakdown.prototype, "totalInstallSizeStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "1.2rem",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    InstallSizeBreakdown.prototype.driveSizeStyle = function (driveStrings) {
        var style = css_styles_1.createStyleMap({
            height: "1.2rem",
            visibility: !!driveStrings ? "visible" : "hidden",
        });
        return style.toString();
    };
    Object.defineProperty(InstallSizeBreakdown.prototype, "hiddenLiveRegionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "1px",
                overflow: "hidden",
                position: "absolute",
                top: "-15px",
                width: "1px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    InstallSizeBreakdown.prototype.getInstallSizeText = function (installSize) {
        if (!this.canInstall) {
            return "-----";
        }
        return Utilities_1.formatSizeText(installSize);
    };
    InstallSizeBreakdown.prototype.getDriveSizeText = function (driveEvaluation, resourceString) {
        if (!driveEvaluation) {
            return null;
        }
        var driveName = this.formatDriveLetter(driveEvaluation.driveName);
        var installSizeLabel = resourceString(driveName, "");
        var installSizeText = this.getInstallSizeText(driveEvaluation.requestedDeltaSize);
        var insufficientSpaceMessage = !driveEvaluation.hasSufficientDiskSpace ?
            ResourceStrings_1.ResourceStrings.notEnoughDiskSpaceWarningText(driveName) :
            null;
        return {
            installSizeLabel: installSizeLabel,
            installSizeText: installSizeText,
            insufficientSpaceMessage: insufficientSpaceMessage,
            installSizeAccessibilityText: resourceString(driveName, installSizeText),
        };
    };
    /**
     * Helper utility to provide a consistent format for all drive letters.
     * @param driveLetter The drive letter to format.
     */
    InstallSizeBreakdown.prototype.formatDriveLetter = function (driveLetter) {
        if (!driveLetter) {
            return "";
        }
        driveLetter = driveLetter.trim();
        if (driveLetter.endsWith(path.sep)) {
            driveLetter = driveLetter.slice(0, driveLetter.length - 1);
        }
        return driveLetter.toLocaleUpperCase();
    };
    InstallSizeBreakdown = __decorate([
        template("\n<install-size-breakdown>\n    <div style={this.installSizesDiv}>\n        <div each={drive in this.allDrives}\n             style={this.driveSizeStyle(drive)}\n             tabindex=\"0\"\n             aria-label={drive && drive.installSizeAccessibilityText}>\n\n            <install-size drive={drive}\n                          install-size-label={drive && drive.installSizeLabel}\n                          insufficient-space-message={drive && drive.insufficientSpaceMessage}>\n                <span if={!this.parent.isEvaluatingParameters}>\n                    {drive && drive.installSizeText}\n                </span>\n            </install-size>\n\n        </div>\n\n        <install-size style={this.totalInstallSizeStyle}\n                      install-size-label={this.totalInstallSizeLabel}\n                      tabindex={this.isEvaluatingParameters ? \"-1\" : \"0\"}\n                      aria-label={this.totalInstallSizeAccessibilityText}>\n            <span if={this.parent.isEvaluatingParameters}>\n                <progress-ring />\n            </span>\n            <span if={!this.parent.isEvaluatingParameters}>\n                {this.parent.totalInstallSizeText}\n            </span>\n        </install-size>\n    </div>\n</install-size-breakdown>")
    ], InstallSizeBreakdown);
    return InstallSizeBreakdown;
}(Riot.Element));
exports.InstallSizeBreakdown = InstallSizeBreakdown;
//# sourceMappingURL=install-size-breakdown.js.map