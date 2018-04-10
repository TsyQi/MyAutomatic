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
var apply_mixins_1 = require("../mixins/apply-mixins");
var change_emitter_1 = require("../mixins/change-emitter");
var array_utils_1 = require("../../lib/array-utils");
var css_styles_1 = require("../css-styles");
var Product_1 = require("../../lib/Installer/Product");
require("./workload-card");
var lazy_1 = require("../../lib/lazy");
var WorkloadsPage = /** @class */ (function (_super) {
    __extends(WorkloadsPage, _super);
    function WorkloadsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._styles = new WorkloadsPageStyles();
        _this._previousSelectedWorkloads = [];
        return _this;
    }
    WorkloadsPage.prototype.updated = function () {
        // Decide whether or not to emit a changed event.
        var selectedWorkloads = this.selectedWorkloads;
        if (!array_utils_1.containsSameElements(this._previousSelectedWorkloads, selectedWorkloads)) {
            this.emitChange(this.root);
            // store a shallow copy of the array
            this._previousSelectedWorkloads = selectedWorkloads.slice();
        }
    };
    Object.defineProperty(WorkloadsPage.prototype, "categories", {
        get: function () {
            return this.opts.categories || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadsPage.prototype, "selectedWorkloads", {
        get: function () {
            return this.workloads
                .filter(function (workload) { return workload.selectedState !== Product_1.SelectedState.NotSelected; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadsPage.prototype, "workloads", {
        get: function () {
            return this.categories
                .map(function (category) { return category.workloads; })
                .reduce(function (previous, next) { return previous.concat(next); }, []);
        },
        enumerable: true,
        configurable: true
    });
    WorkloadsPage.prototype.categoryTitleId = function (index) {
        return "category-" + index + "-title";
    };
    WorkloadsPage.prototype.categoryString = function (workloadCategory) {
        var workloads = workloadCategory.workloads;
        return workloadCategory.name + (" (" + workloads.length + ")");
    };
    WorkloadsPage.prototype.isWorkloadChecked = function (workload) {
        return workload.selectedState !== Product_1.SelectedState.NotSelected;
    };
    Object.defineProperty(WorkloadsPage.prototype, "categoryHeaderStyle", {
        /* Styles */
        get: function () {
            return this._styles.categoryHeaderStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadsPage.prototype, "formatDivStyle", {
        get: function () {
            return this._styles.formatDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadsPage.prototype, "workloadsDivStyle", {
        get: function () {
            return this._styles.workloadsDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    WorkloadsPage.prototype.workloadCardStyle = function (workload) {
        var style = this._styles.workloadCardStyle.value;
        if (workload && workload.required) {
            style += " " + this._styles.disabledWorkloadCardStyle.value;
        }
        return style;
    };
    WorkloadsPage = __decorate([
        template("\n<workloads-page>\n    <div style={this.workloadsDivStyle}\n         each={category, i in this.categories}\n         role=\"group\"\n         aria-labelledby={this.categoryTitleId(i)}>\n        <div style={this.parent.formatDivStyle}>\n            <div class=\"workload-header\"\n                 style={this.parent.categoryHeaderStyle}\n                 role=\"heading\"\n                 id={this.parent.categoryTitleId(i)}>\n                {this.parent.categoryString(category)}\n            </div>\n        </div>\n        <workload-card each={item in category.workloads}\n                       style={this.parent.parent.workloadCardStyle(item)}\n                       workload={item} />\n    </div>\n</workloads-page>")
    ], WorkloadsPage);
    return WorkloadsPage;
}(Riot.Element));
var WorkloadsPageStyles = /** @class */ (function () {
    function WorkloadsPageStyles() {
        this.categoryHeaderStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 auto",
                fontFamily: "Segoe UI SemiBold",
                fontSize: ".75rem",
                margin: "0px 6px"
            });
            return style.toString();
        });
        this.formatDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                width: "calc(100% - 6px)"
            });
            return style.toString();
        });
        this.workloadsDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                alignContent: "flex-start",
                display: "flex",
                flexGrow: "1",
                flexWrap: "wrap",
                marginBottom: "15px",
                outline: "none",
                paddingRight: "6px"
            });
            return style.toString();
        });
        this.workloadCardStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                display: "block",
                height: "84px",
                margin: "6px",
                position: "relative",
                width: "405px"
            });
            return style.toString();
        });
        this.disabledWorkloadCardStyle = new lazy_1.Lazy(function () {
            return "display: none;";
        });
    }
    return WorkloadsPageStyles;
}());
apply_mixins_1.applyMixins(WorkloadsPage, [change_emitter_1.ChangeEmitter]);
//# sourceMappingURL=workloads-page.js.map