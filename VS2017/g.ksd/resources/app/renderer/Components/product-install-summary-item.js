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
require("./checkbox-with-label");
var apply_mixins_1 = require("../mixins/apply-mixins");
var change_emitter_1 = require("../mixins/change-emitter");
var array_utils_1 = require("../../lib/array-utils");
var css_styles_1 = require("../css-styles");
var Product_1 = require("../../lib/Installer/Product");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var ComponentSelectedAction_1 = require("../Actions/ComponentSelectedAction");
var open_external_1 = require("../../lib/open-external");
var lazy_1 = require("../../lib/lazy");
var CLOSED_GLYPH = String.fromCharCode(0xE013);
var OPENED_GLYPH = String.fromCharCode(0xE015);
exports.SUMMARY_PANE_ITEM_EVENT_NAME = "SummaryPaneItemExpansion";
/* tslint:disable:max-line-length */
/**
 * Helper tag for <product-install-summary>
 */
var ProductInstallSummaryItem = /** @class */ (function (_super) {
    __extends(ProductInstallSummaryItem, _super);
    function ProductInstallSummaryItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onComponentSelectionChangedBind = _this.onComponentSelectionChanged.bind(_this);
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this.onclickbind = _this.dispatchSummaryPaneEvent.bind(_this);
        _this.onkeypressbind = _this.handleKeyPress.bind(_this);
        _this._styles = new ProductInstallSummaryItemStyles();
        _this._selectedComponents = [];
        return _this;
    }
    /**
     * Static method to get the ID of the summary item element
     */
    ProductInstallSummaryItem.summaryItemId = function (id) {
        return "summary-item-" + id;
    };
    ProductInstallSummaryItem.prototype.optionalComponentNameAndPosition = function (name, position, length) {
        return ResourceStrings_1.ResourceStrings.listItemNameAndPosition(name, position, length);
    };
    ProductInstallSummaryItem.prototype.onLicenseClicked = function (ev) {
        open_external_1.openExternal(ev.target.href);
    };
    ProductInstallSummaryItem.prototype.nameAndLicenseTermsText = function (name) {
        return name + " " + this.licenseTermsText;
    };
    Object.defineProperty(ProductInstallSummaryItem.prototype, "licenseTermsText", {
        get: function () {
            return this.resourceStrings.viewLicenseTermsLinkText;
        },
        enumerable: true,
        configurable: true
    });
    ProductInstallSummaryItem.prototype.updated = function () {
        var selectedComponents = this.isVirtualWorkload
            ? this.opts.individualcomponents || []
            : this.opts.selectedcomponents || [];
        if (!array_utils_1.containsSameElements(this._selectedComponents, selectedComponents)) {
            this.emitChange(this.root);
            // store a shallow copy of the array
            this._selectedComponents = selectedComponents.slice();
        }
    };
    ProductInstallSummaryItem.prototype.mounted = function () {
        if (!this.opts.workload && !this.opts.individualcomponents) {
            setImmediate(function () {
                throw Error("The workload is undefined in an instance of product-install-summary-item.");
            });
        }
    };
    ProductInstallSummaryItem.prototype.dispatchSummaryPaneEvent = function () {
        var event = new CustomEvent(exports.SUMMARY_PANE_ITEM_EVENT_NAME, {
            bubbles: true,
            cancelable: true,
            detail: {
                id: this.opts.idnumber,
                isOpen: !this.isOpen // toggle open state
            }
        });
        this.root.dispatchEvent(event);
    };
    /**
     * Returning true bubbles the key to the browser.
     * We don't want the browser to handle the arrow keys or it will scroll.
     */
    ProductInstallSummaryItem.prototype.handleKeyPress = function (ev) {
        switch (ev.key.toLowerCase()) {
            case "arrowleft":
                if (this.isOpen) {
                    this.dispatchSummaryPaneEvent();
                }
                return false;
            case "arrowright":
                if (!this.isOpen) {
                    this.dispatchSummaryPaneEvent();
                }
                return false;
            default:
                return true;
        }
    };
    Object.defineProperty(ProductInstallSummaryItem.prototype, "optionalComponentsAriaText", {
        get: function () {
            if (this.isVirtualWorkload) {
                return this.resourceStrings.individualComponentsHeader;
            }
            return this.resourceStrings.optionalComponentsAriaText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "componentsIncludedAriaText", {
        get: function () {
            return this.resourceStrings.componentsIncludedAriaText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "changed", {
        get: function () {
            return this.opts.changed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "channelId", {
        get: function () {
            return this.opts.channelid;
        },
        enumerable: true,
        configurable: true
    });
    ProductInstallSummaryItem.prototype.getComponentNameandDescription = function (component) {
        var result = component.displayedName;
        if (component.description) {
            result += "\n\n" + component.description;
        }
        return result;
    };
    Object.defineProperty(ProductInstallSummaryItem.prototype, "itemGlyph", {
        get: function () {
            return (this.isOpen) ? OPENED_GLYPH : CLOSED_GLYPH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "isOpen", {
        get: function () {
            return this.opts.openitem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "isRequiredWorkload", {
        get: function () {
            if (!this.workload) {
                return false;
            }
            return this.workload.required;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "isVirtualWorkload", {
        get: function () {
            return !this.workload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "name", {
        get: function () {
            if (this.isVirtualWorkload) {
                return ResourceStrings_1.ResourceStrings.individualComponentsHeader;
            }
            return this.workloadResources.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "nameAndDescription", {
        get: function () {
            if (this.isVirtualWorkload) {
                return this.name;
            }
            if (this.workloadResources.longDescription) {
                return this.name + "\n\n" + this.workloadResources.longDescription;
            }
            return this.name + "\n\n" + this.workloadResources.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "optionalAndRecommendedComponents", {
        get: function () {
            if (this.isVirtualWorkload) {
                return this.opts.individualcomponents || [];
            }
            return this.recommendedComponents.concat(this.optionalComponents);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "optionalComponents", {
        get: function () {
            return this.workload.optionalComponents.filter(function (component) { return component.installable.state; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "optionalComponentsHeader", {
        get: function () {
            return this.isVirtualWorkload ? null : this.resourceStrings.optionalHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "productId", {
        get: function () {
            return this.opts.productid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "requiredComponentsHeader", {
        get: function () {
            return this.resourceStrings.includedHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "recommendedComponents", {
        get: function () {
            return this.workload.recommendedComponents.filter(function (component) { return component.installable.state; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "visibleRequiredComponents", {
        // visibleRequiredComponents may be called by Riot before the mounted method is
        get: function () {
            if (this.workload) {
                return this.workload.requiredComponents.filter(function (component) { return component.visible && component.installable.state; });
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "workloadResources", {
        get: function () {
            return this.workload && this.workload.getResources();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "workload", {
        get: function () {
            return this.opts.workload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "workloadSummaryDescription", {
        get: function () {
            if (this.workload) {
                if (this.workloadResources.longDescription) {
                    return this.workloadResources.longDescription;
                }
                return this.workloadResources.description;
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "modifyIndicatorStyle", {
        /* Styles */
        get: function () {
            return this._styles.modifyIndicatorStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "checkboxLabelStyle", {
        get: function () {
            return this._styles.checkboxLabelStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "disabledCheckboxLabelStyle", {
        get: function () {
            return this._styles.disabledCheckboxLabelStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "dataDivStyle", {
        get: function () {
            return this._styles.dataDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "glyphStyle", {
        get: function () {
            return this._styles.glyphStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "glyphAndNameDivStyle", {
        get: function () {
            return this._styles.glyphAndNameDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "itemStyle", {
        get: function () {
            return this._styles.itemStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "listStyle", {
        get: function () {
            return this._styles.listStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "listviewHeaderStyle", {
        get: function () {
            return this._styles.listviewHeaderStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "nameFormatDivStyle", {
        get: function () {
            return this._styles.nameFormatDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "nameDivStyle", {
        get: function () {
            return this._styles.nameDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "selectedComponents", {
        get: function () {
            return this._selectedComponents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "workloadDivStyle", {
        get: function () {
            return this._styles.workloadDivStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummaryItem.prototype, "licenseLinkStyle", {
        get: function () {
            return this._styles.licenseLinkStyle.value;
        },
        enumerable: true,
        configurable: true
    });
    ProductInstallSummaryItem.prototype.isComponentSelected = function (component) {
        return component.selectedState !== Product_1.SelectedState.NotSelected;
    };
    ProductInstallSummaryItem.prototype.onComponentSelectionChanged = function (ev) {
        ev.preventDefault();
        // get the clicked component
        var clickedComponent = ev.item.item;
        var options = {
            checked: !this.isComponentSelected(clickedComponent),
            includeRequired: true,
            includeRecommended: true,
            includeOptional: false,
            isIndividuallySelected: false,
        };
        // Don't let Riot auto update from the click event,
        // instead updateSelectedComponents will do it.
        ev.preventUpdate = true;
        // Use a setImmediate so the update call happens on the next render pass
        // or else the checkboxes don't update
        setImmediate(function () {
            ComponentSelectedAction_1.updateSelectedComponents(clickedComponent, options, "summary-pane");
        });
    };
    ProductInstallSummaryItem = __decorate([
        template("\n<product-install-summary-item>\n    <div class=\"product-install-summary-item\"\n         style={this.itemStyle}\n         tabindex=\"0\"\n         role=\"listitem\"\n         aria-expanded={this.isOpen.toString()}\n         aria-label={this.name}\n         onkeydown={this.onkeypressbind}>\n\n        <div style={this.workloadDivStyle}>\n            <div style={this.glyphAndNameDivStyle}>\n                <div class=\"product-install-summary-item-glyph\"\n                     style={this.glyphStyle}\n                     onclick={this.onclickbind}>\n                    {this.itemGlyph}\n                </div>\n\n                <div title={this.workloadNameAndDescription}\n                     style={this.nameDivStyle}\n                     class=\"product-install-summary-item-title\"\n                     onclick={this.onclickbind}>\n                    {this.name}\n                </div>\n\n                <img if={this.changed}\n                     src=\"images/ModifiedWorkload.svg\"\n                     style={this.modifyIndicatorStyle} />\n            </div>\n\n            <div if={isOpen}\n                 style={this.dataDivStyle}\n                 role=\"group\"\n                 aria-label={this.name}>\n\n                <!-- Workload Description -->\n                <div if={!this.isVirtualWorkload && this.isRequiredWorkload}\n                     class=\"product-install-summary-option-description\"\n                     aria-label={this.workloadSummaryDescription}\n                     tabindex=\"0\">\n                    {this.workloadSummaryDescription}\n                    <br />\n                    <br />\n                </div>\n\n                <!-- Workload Required Components -->\n                <list-view if={!this.isVirtualWorkload && !this.isRequiredWorkload}\n                           items={this.visibleRequiredComponents}\n                           header={this.requiredComponentsHeader}\n                           headerstyle={this.listviewHeaderStyle}\n                           liststyle={this.listStyle}\n                           listrole=\"list\">\n\n                    <!-- set size and position so licenses aren't counted in the list size -->\n                    <!-- this means only the list options are read off as \"item X of N\" for accessibility -->\n                    <div style={this.parent.parent.disabledCheckboxLabelStyle}\n                         role=\"listitem\"\n                         aria-selected=\"true\"\n                         aria-disabled=\"true\"\n                         aria-label={item.displayedName}\n                         tabindex=\"0\"\n                         aria-setsize={this.parent.parent.visibleRequiredComponents.length}\n                         aria-posinset={i+1}>\n                        <checkbox-with-label label={item.displayedName}\n                                             value={item.id}\n                                             isdisabled={true}\n                                             isselected={true}\n                                             tooltip={this.parent.parent.getComponentNameandDescription(item)} />\n                    </div>\n                    <!-- Comment license out as this might be needed in the future. -->\n                    <!-- <div if={item.license}\n                         style={this.parent.parent.licenseLinkStyle}>\n                        <a href={item.license}\n                           onclick={this.parent.parent.onLicenseClicked}\n                           onkeypress={keyPressToClickHelper}\n                           tabindex=\"0\"\n                           aria-label={this.parent.parent.nameAndLicenseTermsText(item.displayedName)}>\n                            {this.parent.parent.licenseTermsText}\n                        </a>\n                    </div> -->\n                </list-view>\n\n                <!-- Workload Optional Components -->\n                <list-view if={!this.isRequiredWorkload}\n                           items={this.optionalAndRecommendedComponents}\n                           header={this.optionalComponentsHeader}\n                           headerstyle={this.listviewHeaderStyle}\n                           listrole=\"group\">\n\n                    <!-- set size and position so licenses aren't counted in the list size -->\n                    <!-- this means only the list options are read off as \"item X of N\" for accessibility -->\n                    <div style={this.parent.parent.checkboxLabelStyle}\n                         role=\"checkbox\"\n                         aria-checked={this.parent.parent.isComponentSelected(item)}\n                         aria-label={this.parent.parent.optionalComponentNameAndPosition(item.displayedName, i + 1, this.parent.items.length)}>\n                        <checkbox-with-label label={item.displayedName}\n                                             value={item.id}\n                                             isselected={this.parent.parent.isComponentSelected(item)}\n                                             labelcallback={this.parent.parent.onComponentSelectionChangedBind}\n                                             tooltip={this.parent.parent.getComponentNameandDescription(item)} />\n                    </div>\n                    <!-- Comment license out as this might be needed in the future. -->\n                    <!-- <div if={item.license}\n                         style={this.parent.parent.licenseLinkStyle}>\n                        <a href={item.license}\n                           onclick={this.parent.parent.onLicenseClicked}\n                           onkeypress={keyPressToClickHelper}\n                           tabindex=\"0\"\n                           aria-label={this.parent.parent.nameAndLicenseTermsText(item.displayedName)}>\n                            {this.parent.parent.licenseTermsText}\n                        </a>\n                    </div> -->\n                </list-view>\n            </div>\n        </div>\n    </div>\n</product-install-summary-item>")
        /* tslint:enable:max-line-length */
    ], ProductInstallSummaryItem);
    return ProductInstallSummaryItem;
}(Riot.Element));
exports.ProductInstallSummaryItem = ProductInstallSummaryItem;
var ProductInstallSummaryItemStyles = /** @class */ (function () {
    function ProductInstallSummaryItemStyles() {
        var _this = this;
        this._glyphWidth = "18px";
        this.workloadDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 auto",
                width: "0px",
            });
            return style.toString();
        });
        this.nameDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                cursor: "pointer",
                flex: "0 1 auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            });
            return style.toString();
        });
        this.nameFormatDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 1 auto",
                overflow: "hidden",
                textOverflow: "ellipsis"
            });
            return style.toString();
        });
        this.listviewHeaderStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                fontSize: ".75rem",
                float: "top",
                webkitMarginAfter: "2px",
            });
            return style.toString();
        });
        this.listStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                marginBottom: "12px"
            });
            return style.toString();
        });
        this.itemStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                display: "flex"
            });
            return style.toString();
        });
        this.modifyIndicatorStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                height: "16px",
                width: "16px"
            });
            return style.toString();
        });
        this.glyphAndNameDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                webkitMarginEnd: "5px"
            });
            return style.toString();
        });
        this.dataDivStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                webkitMarginStart: _this._glyphWidth,
            });
            return style.toString();
        });
        this.disabledCheckboxLabelStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                fontSize: ".75rem",
                marginBottom: "1px",
                padding: "0px 2px 1px",
                width: "calc(100% - 4px)",
            });
            return style.toString();
        });
        this.checkboxLabelStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                fontSize: ".75rem",
                width: "100%",
            });
            return style.toString();
        });
        this.glyphStyle = new lazy_1.Lazy(function () {
            return css_styles_1.createStyleMap({
                cursor: "pointer",
                flex: "0 0 auto",
                marginTop: ".1425rem",
                textAlign: "center",
                height: _this._glyphWidth,
                width: _this._glyphWidth
            }).toString();
        });
        this.licenseLinkStyle = new lazy_1.Lazy(function () {
            var style = css_styles_1.createStyleMap({
                fontSize: ".67rem",
                lineHeight: "1",
                webkitMarginAfter: "8px",
                webkitMarginBefore: "1px",
                webkitMarginStart: "21px"
            });
            return style.toString();
        });
    }
    return ProductInstallSummaryItemStyles;
}());
apply_mixins_1.applyMixins(ProductInstallSummaryItem, [change_emitter_1.ChangeEmitter]);
//# sourceMappingURL=product-install-summary-item.js.map