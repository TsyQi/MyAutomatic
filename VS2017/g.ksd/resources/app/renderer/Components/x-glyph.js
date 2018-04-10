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
var XGlyph = /** @class */ (function (_super) {
    __extends(XGlyph, _super);
    function XGlyph() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(XGlyph.prototype, "pathStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fill: "inherit"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XGlyph.prototype, "svgStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "8px",
                width: "8px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    XGlyph = __decorate([
        template("\n<x-glyph>\n    <svg viewBox=\"0 0 8 8\"\n        style={this.svgStyle}>\n        <path class=\"icon-canvas-transparent\"\n            d=\"M0,0v8h8v-8h-8z\" />\n        <path style=\"{this.pathStyle}\"\n                d=\"M8 .689L7.311 0 4 3.311.689 0 0 .689 3.311 4 0 7.311.689 8 4 4.689 7.311 8 8 7.311 4.689 4z\" />\n    </svg>\n</x-glyph>")
    ], XGlyph);
    return XGlyph;
}(Riot.Element));
//# sourceMappingURL=x-glyph.js.map