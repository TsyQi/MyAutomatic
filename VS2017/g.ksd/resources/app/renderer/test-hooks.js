/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="bower_components/riot-ts/riot-ts.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factory_1 = require("./stores/factory");
var Logger_1 = require("../lib/Logger");
var TestHooks = /** @class */ (function () {
    function TestHooks() {
        this._logger = Logger_1.getLogger("TestHooks");
    }
    TestHooks.prototype.init = function () {
        this.log("initializing TestHooks...");
        factory_1.appStore.on(factory_1.appStore.CHANGED_EVENT, this.onAppStoreChanged.bind(this));
    };
    TestHooks.prototype.log = function (message) {
        this._logger.writeVerbose(message);
    };
    Object.defineProperty(TestHooks.prototype, "appStore", {
        get: function () {
            this.log("in appStore getter");
            return factory_1.appStore;
        },
        enumerable: true,
        configurable: true
    });
    TestHooks.prototype.waitForCondition = function (condition, description) {
        var _this = this;
        var logPrefix = "in waitForCondition: condition \"" + description + "\"";
        if (condition(factory_1.appStore)) {
            this.log(logPrefix + " satisfied on entry, returning immediately");
            return Promise.resolve(factory_1.appStore);
        }
        this.log(logPrefix + " not satisfied on entry, waiting...");
        this._waitCondition = condition;
        this._waitDescription = description;
        return new Promise(function (resolve, reject) {
            _this._waitResolver = resolve;
        });
    };
    TestHooks.prototype.onAppStoreChanged = function () {
        if (this._waitCondition) {
            var logPrefix = "appStore changed, wait condition \"" + this._waitDescription + "\"";
            if (this._waitCondition(factory_1.appStore)) {
                this.log(logPrefix + " satisfied, resolving the wait promise");
                this._waitResolver(factory_1.appStore);
                this._waitCondition = null;
                this._waitDescription = null;
                this._waitResolver = null;
            }
            else {
                this.log(logPrefix + " not satisfied, continuing to wait...");
            }
        }
        else {
            this.log("appStore changed, no wait condition active");
        }
    };
    return TestHooks;
}());
exports.TestHooks = TestHooks;
//# sourceMappingURL=test-hooks.js.map