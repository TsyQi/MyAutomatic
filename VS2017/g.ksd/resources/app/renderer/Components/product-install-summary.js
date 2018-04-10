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
var Product_1 = require("../../lib/Installer/Product");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var product_install_summary_item_1 = require("./product-install-summary-item");
var Utilities_1 = require("../Utilities");
require("./product-install-summary-item");
var apply_mixins_1 = require("../mixins/apply-mixins");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
/**
 * <product-install-summary> control
 */
var ProductInstallSummary = /** @class */ (function (_super) {
    __extends(ProductInstallSummary, _super);
    function ProductInstallSummary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setIsOpenBind = _this.setIsOpen.bind(_this);
        _this._previouslyExpandedItem = -1;
        _this._setOfExpandedItems = new Set();
        _this._setOfUserExpandedItems = new Set();
        _this._previousSummaryLength = -1;
        _this._previousIndividualComponentsLength = -1;
        _this._previousItemNames = [];
        return _this;
    }
    ProductInstallSummary.prototype.mounted = function () {
        this.hookEvents(true);
        this.initExpander();
    };
    ProductInstallSummary.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    ProductInstallSummary.prototype.updating = function () {
        if (this.summaryItemsLength > 0) {
            // Item was added to the summary pane that wasn't the virtual workload
            if (this._previousSummaryLength !== this.summaryItemsLength) {
                this._previousSummaryLength = this.summaryItemsLength;
                var newItem = this.summaryItemsLength - 1;
                this.expandNewItem(newItem);
            }
            else if (this.shouldExpandIndividualComponents) {
                this._previousIndividualComponentsLength = this.individualComponents.length;
                this.expandNewItem(this.individualComponentsId);
            }
            this.updateExpandedItemList();
        }
    };
    ProductInstallSummary.prototype.getWorkloadSelectedComponents = function (workload) {
        if (!workload) {
            return [];
        }
        return workload.components.filter(function (c) { return c.selectedState !== Product_1.SelectedState.NotSelected; });
    };
    Object.defineProperty(ProductInstallSummary.prototype, "summaryHeaderId", {
        get: function () {
            return "summary-pane-header";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "hasIndividualComponents", {
        get: function () {
            return this.individualComponents.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "headerText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.summary;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "isInstalledProduct", {
        get: function () {
            // product can be null due to the way riot
            // initializes tags. Return any value.
            if (!this.product) {
                return false;
            }
            return Product_1.isTypeOfInstalledProduct(this.product);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "individualComponentsChanged", {
        get: function () {
            return this.opts.installedIndividualComponents.length !== this.individualComponents.length
                || this.individualComponents.some(function (c) { return c.installState === Product_1.InstallState.NotInstalled; });
        },
        enumerable: true,
        configurable: true
    });
    ProductInstallSummary.prototype.isOpen = function (index) {
        return this._setOfExpandedItems.has(index) || this._setOfUserExpandedItems.has(index);
    };
    ProductInstallSummary.prototype.setIsOpen = function (ev) {
        if (ev.detail.isOpen) {
            this._setOfUserExpandedItems.add(ev.detail.id);
        }
        else {
            this._setOfExpandedItems.delete(ev.detail.id);
            this._setOfUserExpandedItems.delete(ev.detail.id);
        }
    };
    ProductInstallSummary.prototype.positionDivId = function (id) {
        return "position-div--" + id;
    };
    Object.defineProperty(ProductInstallSummary.prototype, "product", {
        get: function () {
            return this.opts.product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "selectedComponents", {
        get: function () {
            if (!this.product) {
                return [];
            }
            return this.product.selectedComponents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "summaryItemsLength", {
        get: function () {
            return this.workloads.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "workloads", {
        get: function () {
            return this.opts.selectedworkloads || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "individualComponentsId", {
        get: function () {
            return -2;
        },
        enumerable: true,
        configurable: true
    });
    ProductInstallSummary.prototype.showChangedBadgeForWorkload = function (workload) {
        if (!this.isInstalledProduct) {
            return false;
        }
        // Components are selected, not installed, and applicable; or
        // not selected, but installed.
        return workload.components.some(function (c) {
            switch (c.selectedState) {
                case Product_1.SelectedState.NotSelected:
                    return c.installState === Product_1.InstallState.Installed && c.installable.state;
                case Product_1.SelectedState.IndividuallySelected:
                case Product_1.SelectedState.GroupSelected:
                    return c.installState === Product_1.InstallState.NotInstalled && c.installable.state;
            }
        });
    };
    Object.defineProperty(ProductInstallSummary.prototype, "headerDivStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                marginBottom: "1px",
                webkitMarginBefore: "-6px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "installSummaryRootStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                height: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "listItemStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                width: "calc(100% - 5px)"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "listStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0",
                overflowX: "hidden",
                overflowY: "auto",
                padding: "0px",
                webkitMarginAfter: "0px",
                webkitMarginStart: "-3px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "positionDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                top: "-30px",
                position: "relative",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hooks or unhooks events for this component
     */
    ProductInstallSummary.prototype.hookEvents = function (hook) {
        // (un)hook events on the component's root element
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod(product_install_summary_item_1.SUMMARY_PANE_ITEM_EVENT_NAME, this.setIsOpenBind);
    };
    /**
     * Collapses the previously expanded item and adds the newItem.
     */
    ProductInstallSummary.prototype.expandNewItem = function (newItem) {
        var _this = this;
        // Only collapse the previous if the user didn't expand it
        if (!this._setOfUserExpandedItems.has(newItem)) {
            this._setOfExpandedItems.delete(this._previouslyExpandedItem);
        }
        this._setOfExpandedItems.add(newItem);
        this._previouslyExpandedItem = newItem;
        // Find the element to scroll to
        var itemToScrollTo = newItem;
        if (newItem === this.individualComponentsId) {
            itemToScrollTo = this.summaryItemsLength - 1;
        }
        else if (newItem > 0) {
            itemToScrollTo = newItem - 1;
        }
        // Scroll the newly expanded item into view
        requestAnimationFrame(function () {
            var element = document.getElementById(_this.positionDivId(itemToScrollTo));
            if (element) {
                element.scrollIntoView(true);
            }
        });
    };
    /**
     * Updates the list of expanded items to ensure the set is correct. If the user deselects
     * a workload, the ids of the workloads behind the deselected workload get decremented; therefore,
     * we must decrement those ids in the expanded items list so the item expansion works correctly.
     */
    ProductInstallSummary.prototype.updateExpandedItemList = function () {
        var _this = this;
        var currentItemNames = this.workloads.map(function (w) { return w.id; });
        if (this._previousItemNames.length > currentItemNames.length) {
            // Find the id that was removed from the list
            this._previousItemNames.forEach(function (prevId, prevIndex) {
                var currentIdIndex = currentItemNames.findIndex(function (curId) { return prevId === curId; });
                // This id is no longer selected so remove it and shift subsequent items down by 1.
                if (currentIdIndex === -1) {
                    // Delete the item that corresponds to the removed workload from the set.
                    _this._setOfUserExpandedItems.delete(prevIndex);
                    // Temp set to hold updated ids.
                    var newlist_1 = new Set();
                    // Decrement all subsequent items by 1
                    _this._setOfUserExpandedItems.forEach(function (currentItem) {
                        if (currentItem > prevIndex) {
                            newlist_1.add(currentItem - 1);
                        }
                        else {
                            newlist_1.add(currentItem);
                        }
                    });
                    _this._setOfUserExpandedItems = newlist_1;
                }
            });
        }
        if (this._previousItemNames.length !== currentItemNames.length) {
            this._previousItemNames = currentItemNames;
        }
    };
    Object.defineProperty(ProductInstallSummary.prototype, "shouldExpandIndividualComponents", {
        /**
         * Returns true if we should expand the virtual workload.
         */
        get: function () {
            /* The checks are as follows:
             *
             * 1. We have individual components selected. If none are selected,
             *    the individual components summary should not even be in the list.
             * 2. The number of individual components selected has changed.
             *    This is used since the only time we should expand a new item is if something is added/removed.
             */
            return this.hasIndividualComponents &&
                this._previousIndividualComponentsLength !== this.individualComponents.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductInstallSummary.prototype, "individualComponents", {
        get: function () {
            if (!this.product) {
                return [];
            }
            return this.product.allComponents
                .filter(function (c) { return c.selectedState === Product_1.SelectedState.IndividuallySelected; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initializes the expander logic by expanding the last item in the summary pane.
     */
    ProductInstallSummary.prototype.initExpander = function () {
        this._previousSummaryLength = this.summaryItemsLength;
        if (this.hasIndividualComponents) {
            this._previousIndividualComponentsLength = this.individualComponents.length;
            this.expandNewItem(this.individualComponentsId);
        }
        else {
            var newItem = this.summaryItemsLength - 1;
            this.expandNewItem(newItem);
        }
        this.updateExpandedItemList();
        this.scheduleUpdate();
    };
    ProductInstallSummary = __decorate([
        template("\n<product-install-summary>\n    <div style={installSummaryRootStyle}>\n        <div class=\"product-install-summary-header\"\n            style={headerDivStyle}\n            id={this.summaryHeaderId}\n            role=\"heading\">\n                {headerText}\n        </div>\n        <div class=\"product-install-summary-list\"\n             style={listStyle}\n             aria-labelledby={this.summaryHeaderId}\n             aria-live=\"polite\"\n             aria-relevant=\"additions removals\"\n             tabindex=\"0\"\n             role=\"list\">\n            <div style={listItemStyle}\n                 each={workload, i in this.workloads}\n                 no-reorder>\n                <product-install-summary-item workload={workload}\n                                              productid={product && product.id}\n                                              channelid={product && product.channelId}\n                                              isinstalledproduct={parent.isInstalledProduct}\n                                              changed={parent.showChangedBadgeForWorkload(workload)}\n                                              openitem={this.parent.isOpen(i)}\n                                              idnumber={i}\n                                              selectedcomponents={parent.selectedComponents} />\n\n                <!-- The below div serves as a positional marker to scroll to. Do not remove. -->\n                <div id={parent.positionDivId(i)}\n                     style={parent.positionDivStyle}></div>\n            </div>\n\n            <!-- Individual Components Virtual Workload -->\n            <div style={listItemStyle}\n                 if={this.hasIndividualComponents}>\n                <product-install-summary-item individualcomponents={this.individualComponents}\n                                              productid={product && product.id}\n                                              channelid={product && product.channelId}\n                                              isinstalledproduct={isInstalledProduct}\n                                              changed={this.individualComponentsChanged}\n                                              openitem={this.isOpen(individualComponentsId)}\n                                              idnumber={individualComponentsId}\n                                              selectedcomponents={selectedComponents} />\n            </div>\n        </div>\n    </div>\n</product-install-summary>")
    ], ProductInstallSummary);
    return ProductInstallSummary;
}(Riot.Element));
apply_mixins_1.applyMixins(ProductInstallSummary, [scheduled_updater_1.ScheduledUpdater]);
//# sourceMappingURL=product-install-summary.js.map