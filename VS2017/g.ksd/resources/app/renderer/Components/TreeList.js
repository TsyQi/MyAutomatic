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
var TreeList = /** @class */ (function (_super) {
    __extends(TreeList, _super);
    function TreeList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreeList.prototype.onClick = function (ev) {
        var item = ev.item.item;
        item.expanded = !item.expanded;
    };
    TreeList = __decorate([
        template("\n<tree-list>\n    <div each={item, i in this.opts.items}\n        style=\"-webkit-app-region: no-drag; overflow:hidden;\">\n        <div style=\"display: flex\">\n            <button onClick={this.parent.onClick}\n                style={\n                    \" flex: 0 0 auto;\"\n                    + (item.children.length > 0 ? \"\" : \"visibility: hidden\")\n                }>\n                <!-- Use a glyph for the expand/collapse arrow -->\n                {item.expanded ? \"&#x25e2\" : \"&#x25b6\"}\n            </button>\n            <div style=\"flex: 1 1 auto\">\n                <yield />\n            </div>\n        </div>\n        <div style=\"display: flex\">\n            <div style=\"width: 10px; flex: 0 0 auto;\"></div>\n            <div if={item.expanded}\n                style=\"overflow: hidden; flex: 1 0 0;\">\n                <tree-list if={item.children.length > 0}\n                    items={item.children}>\n                    <yield />\n                </tree-list>\n            </div>\n        </div>\n    </div>\n</tree-list>")
    ], TreeList);
    return TreeList;
}(Riot.Element));
//# sourceMappingURL=TreeList.js.map