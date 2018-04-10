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
var lazy_1 = require("../../lib/lazy");
var ListViewOpts = /** @class */ (function () {
    function ListViewOpts() {
    }
    return ListViewOpts;
}());
exports.ListViewOpts = ListViewOpts;
var ListView = /** @class */ (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._styles = new ListViewStyles();
        return _this;
    }
    Object.defineProperty(ListView.prototype, "listRole", {
        get: function () {
            return this.opts.listrole || "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "titleAndSubtitleText", {
        get: function () {
            return (this.title || "") + " " + (this.subtitle || "");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "items", {
        get: function () {
            return this.opts.items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "title", {
        get: function () {
            return this.opts.header;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "subtitle", {
        get: function () {
            return this.opts.subtitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "listStyle", {
        get: function () {
            return this._styles.listStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "parentStyle", {
        get: function () {
            return this._styles.parentStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, "titleStyle", {
        get: function () {
            return this.opts.headerstyle;
        },
        enumerable: true,
        configurable: true
    });
    ListView = __decorate([
        template("\n<list-view>\n    <div if={opts.items.length > 0}\n         class=\"list\"\n         style={parentStyle}>\n        <div if={title}\n             class=\"list-title\"\n             style={this.titleStyle}\n             role=\"heading\">\n            {this.title}\n            <span if={this.subtitle}>\n                {this.subtitle}\n            </span>\n        </div>\n        <div style={this.listStyle}\n             role={this.listRole}\n             aria-label={this.titleAndSubtitleText}>\n            <virtual each={item, i in items} no-reorder>\n                <yield />\n            </virtual>\n        </div>\n    </div>\n</list-view>")
    ], ListView);
    return ListView;
}(Riot.Element));
exports.ListView = ListView;
var ListViewStyles = /** @class */ (function () {
    function ListViewStyles() {
        this.listStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexWrap: "wrap",
            });
            return style.toString();
        });
        this.parentStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                marginBottom: "10px"
            });
            return style.toString();
        });
    }
    return ListViewStyles;
}());
//# sourceMappingURL=list-view.js.map