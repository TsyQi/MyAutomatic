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
var Utilities_1 = require("../Utilities");
var Product_1 = require("../../lib/Installer/Product");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var WorkloadSelectedAction_1 = require("../Actions/WorkloadSelectedAction");
var lazy_1 = require("../../lib/lazy");
var WorkloadCard = /** @class */ (function (_super) {
    __extends(WorkloadCard, _super);
    function WorkloadCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this._styles = new WorkloadCardStyles();
        return _this;
        /* tslint:enable */
    }
    Object.defineProperty(WorkloadCard.prototype, "workloadResources", {
        get: function () {
            return this.workload && this.workload.getResources();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "iconSrc", {
        get: function () {
            if (!this._iconSrc) {
                this._iconSrc = Utilities_1.getImgSrcFromIcon(this.icon);
                if (!this._iconSrc) {
                    this._iconSrc = this.placeholderIconSrc;
                }
            }
            return this._iconSrc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "isWorkloadChecked", {
        get: function () {
            return this.workload && this.workload.selectedState !== Product_1.SelectedState.NotSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workload", {
        get: function () {
            return this.opts.workload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workloadDescription", {
        get: function () {
            if (this.workload) {
                return this.workloadResources.description;
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workloadId", {
        get: function () {
            if (this.workload) {
                return this.workloadResources.id;
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workloadName", {
        get: function () {
            if (this.workload) {
                return this.workloadResources.name;
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workloadUnavailble", {
        get: function () {
            if (this.workload) {
                return !this.workload.installable.state;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workloadDisabled", {
        get: function () {
            return this.workloadUnavailble;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workloadTooltip", {
        get: function () {
            var workloadDescription = this.workloadResources.description;
            if (this.workloadResources.longDescription) {
                workloadDescription = this.workloadResources.longDescription;
            }
            return this.workloadName + "\n\n" + workloadDescription;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workloadDescriptionId", {
        get: function () {
            return this.workloadId + "-description";
        },
        enumerable: true,
        configurable: true
    });
    WorkloadCard.prototype.workloadSelectionChanged = function (ev) {
        var _this = this;
        // Don't change the check state
        ev.preventDefault();
        // Don't let Riot auto update from the click event,
        // instead updateSelectedWorkloads will do it.
        ev.preventUpdate = true;
        var checkbox = ev.target;
        setImmediate(function () {
            var options = {
                checked: !checkbox.checked,
                includeRequired: true,
                includeRecommended: true,
                includeOptional: false,
            };
            WorkloadSelectedAction_1.updateSelectedWorkloads(_this.workload.id, _this.workloadResources.name, options);
        });
    };
    Object.defineProperty(WorkloadCard.prototype, "unavailableTooltip", {
        get: function () {
            var toolTip = this.resourceStrings.workloadUnavailbleReasons;
            this.workload.installable.reasons.forEach(function (reason) {
                toolTip = toolTip + "\n\u2022 " + reason;
            });
            return toolTip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "checkboxStyle", {
        /* Styles */
        get: function () {
            return this._styles.checkboxStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "workloadInfoDivStyle", {
        get: function () {
            return this._styles.workloadInfoDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "textParentDivStyle", {
        get: function () {
            return this._styles.textParentDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "titleDescriptionDivStyle", {
        get: function () {
            return this._styles.titleDescriptionDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "unavailableDivStyle", {
        get: function () {
            return this._styles.unavailableDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "unavailableTextDivStyle", {
        get: function () {
            return this._styles.unavailableTextDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "imgStyle", {
        get: function () {
            return this._styles.imgStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "icon", {
        /* Private Methods */
        get: function () {
            return this.workloadResources && this.workloadResources.icon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "isIconValid", {
        get: function () {
            return this.icon && this.icon.isValid();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkloadCard.prototype, "placeholderIconSrc", {
        /* tslint:disable:max-line-length */
        get: function () {
            return "data:image/svg+xml," +
                encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" enable-background=\"new 0 0 32 32\">\n                    <style type=\"text/css\">.icon_x002D_white{fill:#FFFFFF;}.icon_x002D_office-outlook{fill:#0072C6;}</style>\n                    <rect class=\"icon_x002D_office-outlook\" width=\"32\" height=\"32\"/>\n                    <path class=\"icon_x002D_white\" d=\"M7 6v18h18v-18h-18zm16.991 1zm-8.698 8l-7.293 7.293v-14.586l7.293 7.293zm-6.595-8h14.586l-7.293 7.293-7.293-7.293zm7.293 8.707l7.293 7.293h-14.586l7.293-7.293zm8.009-8v14.586l-7.293-7.293 7.293-7.293zm-.009 15.293z\"/>\n                </svg>");
        },
        enumerable: true,
        configurable: true
    });
    WorkloadCard = __decorate([
        template("\n<workload-card>\n    <label title={this.workloadTooltip}>\n        <input type=\"checkbox\"\n               style={this.checkboxStyle}\n               value={this.workloadId}\n               onclick={this.workloadSelectionChanged}\n               checked={this.isWorkloadChecked}\n               disabled={this.workloadDisabled}\n               aria-label={this.workloadName}\n               aria-describedby={this.workloadDescriptionId}/>\n        <div class=\"workload-label\"\n             style={this.workloadInfoDivStyle}>\n            <img src={this.iconSrc}\n                 style={this.imgStyle} />\n            <div style={this.textParentDivStyle}>\n                <div style={this.titleDescriptionDivStyle}>\n                    <span class=\"workload-title\">\n                        {this.workloadName}\n                    </span>\n                    <br>\n                    <span class=\"workload-description\"\n                          id={this.workloadDescriptionId}>\n                        {this.workloadDescription}\n                    </span>\n                </div>\n                <div if={this.workloadUnavailble}\n                     style={this.unavailableDivStyle}\n                     class=\"workload-unavailable\">\n                    <div style={this.unavailableTextDivStyle}>\n                        {this.resourceStrings.workloadUnavailable}\n                    </div>\n                    <img src=\"images/Problem.svg\" title={this.unavailableTooltip} />\n                </div>\n            </div>\n        </div>\n    </label>\n</workload-card>")
    ], WorkloadCard);
    return WorkloadCard;
}(Riot.Element));
var WorkloadCardStyles = /** @class */ (function () {
    function WorkloadCardStyles() {
        this.checkboxStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                boxSizing: "border-box",
                fontSize: ".9rem",
                cursor: "pointer",
                height: "16px",
                margin: "0",
                position: "absolute",
                right: "6px",
                top: "5px",
                webkitAppearance: "none",
                width: "16px"
            });
            return style.toString();
        });
        this.textParentDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden"
            });
            return style.toString();
        });
        this.titleDescriptionDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                display: "-webkit-box",
                height: "3.15rem",
                lineHeight: "1.05rem",
                marginTop: "-2px",
                maxWidth: "inherit",
                overflow: "hidden",
                textOverflow: "ellipsis",
                webkitBoxOrient: "vertical",
                webkitLineClamp: "3",
                webkitMarginEnd: "30px",
            });
            return style.toString();
        });
        this.workloadInfoDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px 1px 1px 5px",
                /* this "color" is left here because it is really an opacity */
                boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.1)",
                boxSizing: "border-box",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                fontSize: ".75rem",
                height: "100%",
                margin: "0px 1px",
                padding: "9px 0px 2px 8px"
            });
            return style.toString();
        });
        this.unavailableDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",
                paddingBottom: "2px",
                webkitMarginEnd: "4px",
            });
            return style.toString();
        });
        this.unavailableTextDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                webkitMarginEnd: "6px"
            });
            return style.toString();
        });
        this.imgStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                height: "32px",
                webkitMarginEnd: "11px",
                width: "32px"
            });
            return style.toString();
        });
    }
    return WorkloadCardStyles;
}());
//# sourceMappingURL=workload-card.js.map