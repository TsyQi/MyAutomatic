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
var css_styles_1 = require("../css-styles");
var Utilities_1 = require("../Utilities");
/* istanbul ignore next */
var InstallSize = /** @class */ (function (_super) {
    __extends(InstallSize, _super);
    function InstallSize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InstallSize.prototype.mounted = function () {
        this._maxInstallSizeLength = this.calculateMaxInstallSizeLength();
    };
    Object.defineProperty(InstallSize.prototype, "installSizeLabel", {
        get: function () {
            return this.opts.installSizeLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSize.prototype, "insufficientSpaceMessage", {
        get: function () {
            return this.opts.insufficientSpaceMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSize.prototype, "hasInsufficientSpaceMessage", {
        get: function () {
            return !!this.insufficientSpaceMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSize.prototype, "drive", {
        get: function () {
            return this.opts.drive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSize.prototype, "maxInstallDivWidth", {
        /**
         * Returns the size to reserve for the size text.
         */
        get: function () {
            if (!this._maxInstallSizeLength) {
                this._maxInstallSizeLength = this.calculateMaxInstallSizeLength();
            }
            // reserve width for the max length size string
            return this._maxInstallSizeLength + "ch";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSize.prototype, "sizeDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "inline-flex",
                justifyContent: "flex-end",
                width: this.maxInstallDivWidth,
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSize.prototype, "installSizeWarningStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "16px",
                webkitMarginEnd: "7px",
                width: "16px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSize.prototype, "installSizeTextDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "flex-end",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallSize.prototype, "hiddenLiveRegionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "1px",
                overflow: "hidden",
                position: "absolute",
                top: "-10px",
                width: "1px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    InstallSize.prototype.calculateMaxInstallSizeLength = function () {
        var MB_TO_KB = 1024;
        var GB_TO_KB = MB_TO_KB * 1024;
        var TB_TO_KB = GB_TO_KB * 1024;
        // We display 5 digits max (3 digits before the decimal and 2 after)
        // Calculate the width that 111.11 will take up for each size (KB, MB, GB, and TB)
        // and return the width the longest localized string will need.
        return Math.max(Utilities_1.formatSizeText(111.11).length, // 111.11 KB
        Utilities_1.formatSizeText(111.11 * MB_TO_KB).length, // 111.11 MB
        Utilities_1.formatSizeText(111.11 * GB_TO_KB).length, // 111.11 GB
        Utilities_1.formatSizeText(111.11 * TB_TO_KB).length // 111.11 TB
        );
    };
    InstallSize = __decorate([
        template("\n<install-size>\n    <!-- The warning live region for accessibility -->\n    <div if={this.hasInsufficientSpaceMessage}\n         style={this.hiddenLiveRegionStyle}\n         role=\"alert\"\n         aria-atomic=\"false\"\n         aria-live=\"assertive\">\n        {this.insufficientSpaceMessage}\n    </div>\n\n    <div style={this.installSizeTextDivStyle}>\n\n        <img if={this.hasInsufficientSpaceMessage}\n             style={this.installSizeWarningStyle}\n             title={this.insufficientSpaceMessage}\n             src=\"images/Warning.svg\"\n             tabindex=\"0\"\n             aria-label={this.insufficientSpaceMessage} />\n\n        <span>\n            {this.installSizeLabel}\n        </span>\n\n        <div style={this.sizeDivStyle}>\n            <yield />\n        </div>\n\n    </div>\n</install-size>")
    ], InstallSize);
    return InstallSize;
}(Riot.Element));
//# sourceMappingURL=install-size.js.map