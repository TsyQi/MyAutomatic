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
var apply_mixins_1 = require("../mixins/apply-mixins");
var change_emitter_1 = require("../mixins/change-emitter");
var array_utils_1 = require("../../lib/array-utils");
var string_utilities_1 = require("../../lib/string-utilities");
var css_styles_1 = require("../css-styles");
var Utilities_1 = require("../Utilities");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var ComponentSelectedAction_1 = require("../Actions/ComponentSelectedAction");
require("./list-view");
function createSortedComponentCategoryList(components) {
    var uncategorized = [];
    var categoryMap = new Map();
    components.forEach(function (component) {
        var category = component.category;
        if (category) {
            if (categoryMap.has(category)) {
                categoryMap.get(category).push(component);
            }
            else {
                categoryMap.set(category, [component]);
            }
        }
        else {
            // This is an uncategorized component
            uncategorized.push(component);
        }
    });
    var sortedKeys = Array.from(categoryMap.keys()).sort(string_utilities_1.caseInsensitiveCompare);
    var categories = [];
    sortedKeys.forEach(function (categoryName) {
        categories.push({
            name: categoryName,
            components: categoryMap.get(categoryName).sort(function (a, b) {
                return string_utilities_1.caseInsensitiveCompare(a.name, b.name);
            }),
        });
    });
    // push the uncategorized group on the end
    categories.push({
        name: ResourceStrings_1.ResourceStrings.uncategorized,
        components: uncategorized.sort(function (a, b) {
            return string_utilities_1.caseInsensitiveCompare(a.name, b.name);
        }),
    });
    return categories;
}
/* tslint:disable:max-line-length */
var IndividualComponentsPage = /** @class */ (function (_super) {
    __extends(IndividualComponentsPage, _super);
    function IndividualComponentsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this.onComponentChangedBind = _this.onComponentChanged.bind(_this);
        _this._previousSelectedComponents = [];
        return _this;
        /* tslint:enable:no-unused-variable */
    }
    IndividualComponentsPage.prototype.updated = function () {
        // Decide whether or not to emit a changed event.
        var selectedComponents = this.selectedComponents;
        if (!array_utils_1.containsSameElements(this._previousSelectedComponents, selectedComponents)) {
            this.emitChange(this.root);
            // store a shallow copy of the array
            this._previousSelectedComponents = selectedComponents.slice();
        }
    };
    IndividualComponentsPage.prototype.updating = function () {
        // Only compute categories if the product has changed.
        if (this._product !== this.opts.product) {
            this._product = this.opts.product;
            if (this._product) {
                this._categories = createSortedComponentCategoryList(this._product.allComponents);
            }
        }
    };
    IndividualComponentsPage.prototype.componentNameAndPosition = function (name, position, length) {
        return ResourceStrings_1.ResourceStrings.listItemNameAndPosition(name, position, length);
    };
    Object.defineProperty(IndividualComponentsPage.prototype, "categories", {
        get: function () {
            return this._categories;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndividualComponentsPage.prototype, "isInstalledProduct", {
        get: function () {
            var asInstalledProduct = this.product;
            return asInstalledProduct && (asInstalledProduct.installState !== undefined);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndividualComponentsPage.prototype, "product", {
        get: function () {
            return this.opts.product;
        },
        enumerable: true,
        configurable: true
    });
    IndividualComponentsPage.prototype.getComponentNameAndDescription = function (component) {
        var result = component.displayedName;
        if (component.description) {
            result += "\n\n" + component.description;
        }
        return result;
    };
    Object.defineProperty(IndividualComponentsPage.prototype, "selectedComponents", {
        get: function () {
            return this.opts.selectedcomponents || [];
        },
        enumerable: true,
        configurable: true
    });
    IndividualComponentsPage.prototype.getVisibleComponents = function (components) {
        return Utilities_1.getDisplayedComponents(components);
    };
    IndividualComponentsPage.prototype.onComponentChanged = function (ev) {
        var _this = this;
        // Don't change the check state
        ev.preventDefault();
        // Don't let Riot auto update from the click event,
        // instead updateSelectedComponents will do it.
        ev.preventUpdate = true;
        // get the clicked component
        var component = ev.item.item;
        // Leave this here or the DOM won't update.
        setImmediate(function () {
            var options = {
                checked: !_this.isSelected(component.id),
                includeRequired: true,
                includeRecommended: true,
                includeOptional: false,
                isIndividuallySelected: true,
            };
            ComponentSelectedAction_1.updateSelectedComponents(component, options, "individual-components-page");
        });
    };
    IndividualComponentsPage.prototype.isSelected = function (componentId) {
        var selectedComponents = this.selectedComponents;
        return selectedComponents.some(function (component) { return component.id === componentId; });
    };
    IndividualComponentsPage.prototype.isRequiredComponent = function (component) {
        if (this.product) {
            var requiredComponents = this.product.requiredComponentsForAllWorkloads;
            var currentComponent = requiredComponents.find(function (requiredComponent) {
                return requiredComponent.id === component.id;
            });
            return currentComponent !== undefined;
        }
        return false;
    };
    Object.defineProperty(IndividualComponentsPage.prototype, "formatDivStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndividualComponentsPage.prototype, "checkboxStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                boxSizing: "border-box",
                cursor: "pointer",
                flex: "0 0 auto",
                height: "18px",
                margin: "0px",
                position: "relative",
                webkitAppearance: "none",
                webkitMarginEnd: "8px",
                width: "18px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndividualComponentsPage.prototype, "itemStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "0 1 0",
                webkitMarginAfter: "1px",
                webkitMarginStart: "16px",
                width: "calc(100% - 16px)"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndividualComponentsPage.prototype, "labelStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                padding: "2px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndividualComponentsPage.prototype, "labelDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndividualComponentsPage.prototype, "listHeaderStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                margin: "0px 0px 12px",
                fontFamily: "Segoe UI SemiBold",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndividualComponentsPage.prototype, "pageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                outline: "none",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /* tslint:disable:no-unused-variable */
    IndividualComponentsPage.prototype.onCheckboxFocusChange = function (event) {
        if (!event || !event.target) {
            return;
        }
        var className = "focused-checkbox-outline";
        var checkbox = event.target;
        var label = checkbox && checkbox.parentElement;
        if (label && event.type === "blur") {
            label.classList.remove(className);
        }
        if (label && event.type === "focus") {
            label.classList.add(className);
        }
    };
    IndividualComponentsPage = __decorate([
        template("\n<individual-components-page>\n    <div class=\"individual-components-page\"\n         style={this.pageStyle}>\n        <list-view each={category in this.categories}\n                   items={this.parent.getVisibleComponents(category.components)}\n                   header={category.name}\n                   headerstyle={this.listHeaderStyle}\n                   listrole=\"group\">\n            <div style={this.parent.parent.formatDivStyle}\n                 role=\"checkbox\"\n                 aria-disabled={this.parent.parent.isRequiredComponent(item)}\n                 aria-checked={this.parent.parent.isSelected(item.id)}\n                 aria-label={this.parent.parent.componentNameAndPosition(item.displayedName, i + 1, this.parent.items.length)}>\n                <div style={this.parent.parent.itemStyle}>\n                    <label style={this.parent.parent.labelStyle}\n                           title={this.parent.parent.getComponentNameAndDescription(item)}>\n                        <!-- Checkbox is disabled for required components -->\n                        <input type=\"checkbox\"\n                               class=\"component-checkbox\"\n                               onclick={this.parent.parent.onComponentChangedBind}\n                               checked={this.parent.parent.isSelected(item.id)}\n                               value={item.id}\n                               style={this.parent.parent.checkboxStyle}\n                               disabled={this.parent.parent.isRequiredComponent(item)}\n                               onfocus={this.parent.parent.onCheckboxFocusChange}\n                               onblur={this.parent.parent.onCheckboxFocusChange} />\n                        <div style={this.parent.labelDivStyle}>{item.displayedName}</div>\n                    </label>\n                </div>\n            </div>\n        </list-view>\n    </div>\n</individual-components-page>")
        /* tslint:enable:max-line-length */
    ], IndividualComponentsPage);
    return IndividualComponentsPage;
}(Riot.Element));
apply_mixins_1.applyMixins(IndividualComponentsPage, [change_emitter_1.ChangeEmitter]);
//# sourceMappingURL=individual-components-page.js.map