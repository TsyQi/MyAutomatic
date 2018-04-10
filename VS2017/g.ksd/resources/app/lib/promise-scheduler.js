/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promise_completion_source_1 = require("./promise-completion-source");
/**
 * Executes async work sequentially in FIFO order.
 */
var PromiseScheduler = /** @class */ (function () {
    function PromiseScheduler() {
        this._current = null;
        this._queue = [];
    }
    /**
     * Schedule a task to run when all other tasks have completed.
     * This method will start the scheduler if it is stopped.
     */
    PromiseScheduler.prototype.schedule = function (task) {
        var source = new promise_completion_source_1.PromiseCompletionSource();
        var wrappedCallback = function () {
            var value = task();
            source.resolve(value);
            return value;
        };
        this._queue.push(wrappedCallback);
        this.run();
        return source.promise;
    };
    Object.defineProperty(PromiseScheduler.prototype, "running", {
        /**
         * Gets a {boolean} indicating if the scheduler is currently running.
         */
        get: function () {
            return this._current !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromiseScheduler.prototype, "pendingTaskCount", {
        /**
         * Gets a {number} indicating the total number of pending jobs,
         * excluding any that are currently running.
         */
        get: function () {
            return this._queue.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Deletes jobs from the end of the schedule queue.
     */
    PromiseScheduler.prototype.drop = function (count) {
        return this._queue.splice(-count, count);
    };
    /**
     * Deletes all jobs from the schedule queue.
     */
    PromiseScheduler.prototype.dropAll = function () {
        return this._queue.splice(0, this._queue.length);
    };
    PromiseScheduler.prototype.run = function () {
        var _this = this;
        if (!this._current) {
            this._current = this._queue.shift();
            // schedule the job to run on the timer loop
            setImmediate(function () {
                _this._current()
                    .finally(function () {
                    _this._current = null;
                    if (_this._queue.length > 0) {
                        _this.run();
                    }
                });
            });
        }
    };
    return PromiseScheduler;
}());
exports.PromiseScheduler = PromiseScheduler;
//# sourceMappingURL=promise-scheduler.js.map