/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
var LoadingView = /** @class */ (function (_super) {
    __extends(LoadingView, _super);
    function LoadingView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LoadingView.prototype, "loadingText", {
        get: function () {
            return this.opts.loadingtext || ResourceStrings_1.ResourceStrings.pleaseWait;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingView.prototype, "loadingContentStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                alignSelf: "center",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingView.prototype, "loadingTextStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                textAlign: "center",
                webkitMarginAfter: "30px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingView.prototype, "progressBarStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "20px",
                width: "180px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    LoadingView = __decorate([
        template("\n<loading-view>\n    <div style={this.loadingContentStyle}>\n        <div style={this.loadingTextStyle}\n             role=\"alert\">\n            {this.loadingText}\n        </div>\n        <div style={this.progressBarStyle}\n             role=\"presentation\"\n             class=\"progress-bar progress-bar-blue\">\n               <div class=\"progress-circle\"></div>\n               <div class=\"progress-circle\"></div>\n               <div class=\"progress-circle\"></div>\n               <div class=\"progress-circle\"></div>\n               <div class=\"progress-circle\"></div>\n        </div>\n    </div>\n</loading-view>")
    ], LoadingView);
    return LoadingView;
}(Riot.Element));
//# sourceMappingURL=loading-view.js.map