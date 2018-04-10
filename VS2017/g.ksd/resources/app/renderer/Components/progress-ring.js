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
var ProgressRing = /** @class */ (function (_super) {
    __extends(ProgressRing, _super);
    function ProgressRing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressRing = __decorate([
        template("<progress-ring>\n    <div class=\"progress-ring progress-bar-blue\">\n        <div class=\"progress-circle\"></div>\n        <div class=\"progress-circle\"></div>\n        <div class=\"progress-circle\"></div>\n        <div class=\"progress-circle\"></div>\n        <div class=\"progress-circle\"></div>\n    </div>\n</progress-ring>")
    ], ProgressRing);
    return ProgressRing;
}(Riot.Element));
//# sourceMappingURL=progress-ring.js.map