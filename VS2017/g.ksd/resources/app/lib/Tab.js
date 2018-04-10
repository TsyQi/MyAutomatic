/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../typings/riot-ts-missing-declares.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tab = /** @class */ (function () {
    /**
     * tabName is the localized name, tabID is in English.
     */
    function Tab(tabName, tabID) {
        this._tabID = tabID;
        this._tabName = tabName;
    }
    Object.defineProperty(Tab.prototype, "tabName", {
        get: function () {
            return this._tabName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tab.prototype, "tabID", {
        get: function () {
            return this._tabID;
        },
        enumerable: true,
        configurable: true
    });
    return Tab;
}());
exports.Tab = Tab;
/**
 * Class to store a collection of tabs with unique IDs for Telemetry.
 */
var TabCollection = /** @class */ (function () {
    function TabCollection() {
        var tabs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tabs[_i] = arguments[_i];
        }
        this._tabs = [];
        this.add.apply(this, tabs);
    }
    Object.defineProperty(TabCollection.prototype, "length", {
        get: function () {
            return this._tabs.length;
        },
        enumerable: true,
        configurable: true
    });
    TabCollection.prototype.add = function () {
        var _this = this;
        var tabs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tabs[_i] = arguments[_i];
        }
        tabs.forEach(function (tab) {
            if (_this._tabs.some(function (t) { return t.tabID === tab.tabID; })) {
                throw new Error("Unique IDs must be used for tabs");
            }
            _this._tabs.push(tab);
        });
    };
    TabCollection.prototype.get = function (id) {
        return this._tabs.find(function (tab) { return tab.tabID === id; });
    };
    TabCollection.prototype.toArray = function () {
        return this._tabs.slice();
    };
    return TabCollection;
}());
exports.TabCollection = TabCollection;
//# sourceMappingURL=Tab.js.map