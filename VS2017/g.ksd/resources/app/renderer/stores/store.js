"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
var requires = require("../../lib/requires");
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(dispatcher) {
        var _this = _super.call(this) || this;
        _this._eventHandlers = [];
        _this._dispatcher = dispatcher;
        return _this;
    }
    /**
     * Disposes the store object. Will unregister all event callbacks.
     */
    Store.prototype.dispose = function () {
        this.registerEventsImpl(false);
    };
    Object.defineProperty(Store.prototype, "CHANGED_EVENT", {
        get: function () {
            return "CHANGED";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Registers the input events to the IDispatcher.
     *
     * @requires events not null or undefined
     * @param events The events to register. These are automatically unregistered when dispose is called.
     */
    Store.prototype.registerEvents = function (events) {
        requires.notNullOrUndefined(events, "events");
        this._eventHandlers = events.slice();
        this.registerEventsImpl(true);
    };
    Store.prototype.emitChangedEvent = function () {
        this.emit(this.CHANGED_EVENT);
    };
    /**
     * Registers or unregisters events to the IDispatcher.
     *
     * @param register True to register events, false to unregister.
     */
    Store.prototype.registerEventsImpl = function (register) {
        var _this = this;
        var registerFunction = register ? this._dispatcher.register : this._dispatcher.unregister;
        this._eventHandlers.forEach(function (handler) {
            registerFunction.call(_this._dispatcher, handler.event, handler.callback);
        });
    };
    return Store;
}(events_1.EventEmitter));
exports.Store = Store;
//# sourceMappingURL=store.js.map