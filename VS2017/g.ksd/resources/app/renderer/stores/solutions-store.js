/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
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
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var get_solutions_events_1 = require("../Events/get-solutions-events");
var SolutionsStore = /** @class */ (function (_super) {
    __extends(SolutionsStore, _super);
    function SolutionsStore(dispatcher) {
        var _this = _super.call(this) || this;
        _this.CHANGED_EVENT = "CHANGED";
        _this._feedbackSearchResults = new Map();
        _this._events = [
            { event: get_solutions_events_1.GetSolutionsFinishedEvent, callback: _this.onGetSolutionsFinished.bind(_this) },
            { event: get_solutions_events_1.GetSolutionsStartedEvent, callback: _this.onGetSolutionsStarted.bind(_this) },
        ];
        _this._dispatcher = dispatcher;
        _this.hookEvents();
        return _this;
    }
    Object.defineProperty(SolutionsStore.prototype, "searchResults", {
        get: function () {
            return this._feedbackSearchResults;
        },
        enumerable: true,
        configurable: true
    });
    SolutionsStore.prototype.onGetSolutionsFinished = function (event) {
        this._feedbackSearchResults.set(event.result.failedPackage.id, event.result);
        this.emit(this.CHANGED_EVENT);
    };
    SolutionsStore.prototype.onGetSolutionsStarted = function (event) {
        this._feedbackSearchResults.clear();
    };
    SolutionsStore.prototype.hookEvents = function (unhook) {
        var hookMethod;
        if (unhook) {
            hookMethod = this._dispatcher.unregister.bind(this._dispatcher);
        }
        else {
            hookMethod = this._dispatcher.register.bind(this._dispatcher);
        }
        this._events.forEach(function (descriptor) {
            hookMethod(descriptor.event, descriptor.callback);
        });
    };
    return SolutionsStore;
}(events_1.EventEmitter));
exports.SolutionsStore = SolutionsStore;
//# sourceMappingURL=solutions-store.js.map