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
var open_external_1 = require("../../lib/open-external");
var Utilities_1 = require("../Utilities");
var InformationPaneSectionOpts = /** @class */ (function () {
    function InformationPaneSectionOpts() {
    }
    return InformationPaneSectionOpts;
}());
exports.InformationPaneSectionOpts = InformationPaneSectionOpts;
var InformationPane = /** @class */ (function (_super) {
    __extends(InformationPane, _super);
    function InformationPane() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onClickBind = _this.onClick.bind(_this);
        return _this;
    }
    InformationPane.prototype.mounted = function () {
        this.root.querySelector(".information-pane-section-content").innerHTML = this.content;
        this.hookEvents(true);
    };
    InformationPane.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    Object.defineProperty(InformationPane.prototype, "content", {
        get: function () {
            if (this.opts.content && this.opts.content.length > 0) {
                return this.opts.content[0];
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InformationPane.prototype, "header", {
        get: function () {
            return this.opts.header;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InformationPane.prototype, "sectionDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                flex: "0 0 auto",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InformationPane.prototype, "headerDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                marginBottom: "5px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InformationPane.prototype, "contentDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hooks or unhooks events for this component
     */
    InformationPane.prototype.hookEvents = function (hook) {
        // (un)hook events on the component's root element
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod("click", this._onClickBind);
    };
    InformationPane.prototype.onClick = function (evemt) {
        evemt.preventDefault();
        if (evemt.srcElement.tagName === "a" || evemt.srcElement.tagName === "A") {
            var anchor = evemt.srcElement;
            open_external_1.openExternal(anchor.href);
        }
    };
    InformationPane = __decorate([
        template("\n<information-pane-section>\n    <div style={this.sectionDivStyle}\n         tabindex=\"0\"\n         aria-labelledby=\"header-div content-section\">\n            <div class=\"information-pane-header\"\n                 style={headerDivStyle}\n                 id=\"header-div\">\n                 {this.header}\n            </div>\n            <div class=\"information-pane-section-content\"\n                 style={contentDivStyle}\n                 id=\"content-section\"></div>\n    </div>\n</information-pane-section>\n")
    ], InformationPane);
    return InformationPane;
}(Riot.Element));
exports.InformationPane = InformationPane;
//# sourceMappingURL=information-pane-section.js.map