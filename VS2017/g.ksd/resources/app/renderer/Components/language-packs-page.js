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
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var locale_selected_action_1 = require("../Actions/locale-selected-action");
var LanguagePacksPage = /** @class */ (function (_super) {
    __extends(LanguagePacksPage, _super);
    function LanguagePacksPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this.onComponentChangedBind = _this.onComponentChanged.bind(_this);
        _this._previousSelectedLocales = [];
        return _this;
        /* tslint:enable:no-unused-variable */
    }
    LanguagePacksPage.prototype.updated = function () {
        // Decide whether or not to emit a changed event.
        var selectedLocales = this.selectedLocales;
        if (!array_utils_1.containsSameElements(this._previousSelectedLocales, selectedLocales)) {
            this.emitChange(this.root);
            // store a shallow copy of the array
            this._previousSelectedLocales = selectedLocales.slice();
        }
    };
    LanguagePacksPage.prototype.langPackNameAndPosition = function (name, position, length) {
        return ResourceStrings_1.ResourceStrings.listItemNameAndPosition(name, position, length);
    };
    Object.defineProperty(LanguagePacksPage.prototype, "header", {
        get: function () {
            return this.resourceStrings.chooseYourLanguagePack;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguagePacksPage.prototype, "product", {
        get: function () {
            return this.opts.product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguagePacksPage.prototype, "selectedLocales", {
        get: function () {
            return this.SortedLanguageOptions.filter(function (l) {
                return l.isSelected;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguagePacksPage.prototype, "SortedLanguageOptions", {
        get: function () {
            if (this.product) {
                var languageOptions = this.product.languageOptions.sort(function (a, b) {
                    return string_utilities_1.caseInsensitiveCompare(a.uiName, b.uiName);
                });
                return languageOptions;
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    LanguagePacksPage.prototype.onComponentChanged = function (ev) {
        // Don"t change the check state
        ev.preventDefault();
        // Don't let Riot auto update from the click event,
        // instead selectLocale will do it.
        ev.preventUpdate = true;
        var target = ev.target;
        // Leave this here or the DOM won't update.
        setImmediate(function () {
            locale_selected_action_1.selectLocale(target.value, !target.checked);
        });
    };
    LanguagePacksPage.prototype.isSelected = function (locale) {
        var languageOption = this.product.getLanguageOption(locale);
        return languageOption.isSelected;
    };
    Object.defineProperty(LanguagePacksPage.prototype, "checkboxStyle", {
        /* Styles */
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
    Object.defineProperty(LanguagePacksPage.prototype, "formatDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguagePacksPage.prototype, "listHeaderStyle", {
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
    Object.defineProperty(LanguagePacksPage.prototype, "itemStyle", {
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
    Object.defineProperty(LanguagePacksPage.prototype, "languageDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flex: "1 0 1",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguagePacksPage.prototype, "labelStyle", {
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
    Object.defineProperty(LanguagePacksPage.prototype, "labelDivStyle", {
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
    Object.defineProperty(LanguagePacksPage.prototype, "labelSpanStyle", {
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
    Object.defineProperty(LanguagePacksPage.prototype, "pageStyle", {
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
    LanguagePacksPage.prototype.onCheckboxFocusChange = function (event) {
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
    LanguagePacksPage = __decorate([
        template("\n<language-packs-page>\n    <div class=\"language-packs-page\"\n         style={this.pageStyle}>\n        <list-view items={this.SortedLanguageOptions}\n                   header={this.header}\n                   headerstyle={this.listHeaderStyle}\n                   listrole=\"group\">\n            <div style={this.parent.parent.formatDivStyle}\n                 role=\"checkbox\"\n                 aria-checked={this.parent.parent.isSelected(item.locale)}\n                 aria-label={this.parent.parent.langPackNameAndPosition(item.uiName, i + 1, this.parent.items.length)}>\n                <div style={this.parent.parent.itemStyle}>\n                    <label style={this.parent.parent.labelStyle}>\n                        <input type=\"checkbox\"\n                               class=\"locale-checkbox\"\n                               onclick={this.parent.parent.onComponentChangedBind}\n                               checked={this.parent.parent.isSelected(item.locale)}\n                               value={item.locale}\n                               style={this.parent.parent.checkboxStyle}\n                               onfocus={this.parent.parent.onCheckboxFocusChange}\n                               onblur={this.parent.parent.onCheckboxFocusChange} />\n                        <span class=\"language-pack-label\"\n                              style={this.parent.parent.labelDivStyle}>\n                            {item.uiName}\n                        </span>\n                    </label>\n                </div>\n            </div>\n        </list-view>\n    </div>\n</language-packs-page>")
    ], LanguagePacksPage);
    return LanguagePacksPage;
}(Riot.Element));
apply_mixins_1.applyMixins(LanguagePacksPage, [change_emitter_1.ChangeEmitter]);
//# sourceMappingURL=language-packs-page.js.map