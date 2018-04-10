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
var AppLogo = /** @class */ (function (_super) {
    __extends(AppLogo, _super);
    function AppLogo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AppLogo.prototype, "vsText", {
        get: function () {
            // Do not localize "Visual Studio Installer". This text is apart of the Visual Studio Logo.
            return this.opts.vstextoverride || "Visual Studio Installer";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppLogo.prototype, "appLogoContainerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                height: "100%",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppLogo.prototype, "vsLogoStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0",
                minWidth: "20px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppLogo.prototype, "vsTextStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                letterSpacing: "-.03em",
                margin: "2px 8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    AppLogo = __decorate([
        template("\n<app-logo>\n    <div style={this.appLogoContainerStyle}>\n        <div class=\"app-logo-text\"\n             style={this.vsTextStyle}>\n            {this.vsText}\n        </div>\n    </div>\n</app-logo>")
    ], AppLogo);
    return AppLogo;
}(Riot.Element));
//# sourceMappingURL=app-logo.js.map