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
require("./progress-bar");
var ProgressView = /** @class */ (function (_super) {
    __extends(ProgressView, _super);
    function ProgressView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ProgressView.prototype, "showSecondProgress", {
        get: function () {
            return !!this.opts.progressbar2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressView.prototype, "progressBar1", {
        get: function () {
            return this.opts.progressbar1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressView.prototype, "progressBar2", {
        get: function () {
            return this.opts.progressbar2;
        },
        enumerable: true,
        configurable: true
    });
    ProgressView.prototype.message = function (progressBar) {
        if (progressBar && progressBar.message) {
            return progressBar.message;
        }
        // We still want this div to take up space, so we'll put a period
        // and make it hidden
        return ".";
    };
    Object.defineProperty(ProgressView.prototype, "progressViewStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressView.prototype, "progressLayoutStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                marginTop: "6px",
                display: "flex",
                flexDirection: "column"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    ProgressView.prototype.messageStyle = function (progressBar) {
        var style = css_styles_1.createStyleMap({
            flex: "0 0 auto",
            fontSize: ".75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        });
        if (!progressBar || !progressBar.message) {
            style.visibility = "hidden";
        }
        return style.toString();
    };
    ProgressView = __decorate([
        template("\n<progress-view>\n    <div style={this.progressLayoutStyle}>\n        <div style={this.progressViewStyle}>\n            <div style={this.messageStyle(this.progressBar1)}>\n                {this.message(this.progressBar1)}\n            </div>\n            <progress-bar details={this.progressBar1} />\n        </div>\n    </div>\n    <div style={this.progressLayoutStyle}>\n        <div style={this.progressViewStyle}>\n            <div style={this.messageStyle(this.progressBar2)}>\n                {this.message(this.progressBar2)}\n            </div>\n            <progress-bar if={this.showSecondProgress} details={this.progressBar2} />\n        </div>\n    </div>\n</progress-view>")
    ], ProgressView);
    return ProgressView;
}(Riot.Element));
//# sourceMappingURL=progress-view.js.map