/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../typings/heapdump-missing-declares.d.ts" />
/// <reference path="../typings/memwatch-next-missing-declares.d.ts" />
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
var path = require("path");
var fs = require("fs");
var heapdump = require("heapdump");
var memwatch = require("memwatch-next");
var requires = require("./requires");
var Logger_1 = require("./Logger");
var SimulatedLeakedObject = /** @class */ (function () {
    function SimulatedLeakedObject(data) {
        this.dataArray = [];
        this.data = data;
        for (var i = 0; i < 10000; i++) {
            this.dataArray.push(i);
        }
    }
    return SimulatedLeakedObject;
}());
var ACCEPTABLE_HEAP_GROWTH = 0; // amount of post-GC heap growth that can be ignored
var CONSECUTIVE_GROWTH_THRESHOLD = 5; // number of consecutive growth-after GCs suggesting a leak
var CONSECUTIVE_GROWTH_PRETHRESHOLD = CONSECUTIVE_GROWTH_THRESHOLD - 2;
var LeakDetector = /** @class */ (function (_super) {
    __extends(LeakDetector, _super);
    function LeakDetector(processName, captureHeapDumps, enableLogging) {
        if (captureHeapDumps === void 0) { captureHeapDumps = false; }
        if (enableLogging === void 0) { enableLogging = false; }
        var _this = _super.call(this) || this;
        _this._heapSize = 0; // the size of the heap after the most recent GC
        _this._heapSizeBeforeLeaks = 0; // the size of the heap before we started leaking
        _this._consecutiveGrowth = 0; // the number of consecutive GCs after which heapSize grew
        requires.stringNotEmpty(processName, "processName");
        _this._processName = processName;
        _this._captureHeapDumps = captureHeapDumps;
        _this._enableLogging = enableLogging;
        memwatch.on("stats", _this.onMemoryStats.bind(_this));
        return _this;
    }
    LeakDetector.gc = function () {
        memwatch.gc();
    };
    Object.defineProperty(LeakDetector, "leakDetectedEvent", {
        get: function () {
            return "leakDetected";
        },
        enumerable: true,
        configurable: true
    });
    LeakDetector.hasHeapGrown = function (currentHeapSize, priorHeapSize) {
        if ((priorHeapSize > 0) && ((currentHeapSize - priorHeapSize) > ACCEPTABLE_HEAP_GROWTH)) {
            return true;
        }
        return false;
    };
    /**
     * Simulates a memory leak.  To be used for testing the leak detector.
     */
    LeakDetector.prototype.simulateLeak = function () {
        var now = new Date();
        var leak = now.getTime() + " " + now.toString() + " ";
        for (var i = 0; i < 8; i++) {
            leak += leak;
        }
        var simulatedLeak = new SimulatedLeakedObject(leak);
        if (this._simulatedLeaks) {
            this._simulatedLeaks.push(simulatedLeak);
        }
        else {
            this._simulatedLeaks = [simulatedLeak];
        }
    };
    LeakDetector.prototype.onMemoryStats = function (stats) {
        var priorHeapSize = this._heapSize;
        this._heapSize = stats.current_base;
        var heapDelta = this._heapSize - priorHeapSize;
        if (this._enableLogging) {
            var stringifiedStats = JSON.stringify(stats, null, 4);
            // indent lines starting with space or } by four spaces
            var indentedStats = stringifiedStats.replace(/\n/g, "\n    ");
            this.log("onMemoryStats (" + this._processName + "):");
            this.log("    stats = " + indentedStats);
            this.log("    heap delta = " + heapDelta.toLocaleString());
        }
        // did the heap grow, even after a GC?  this might indicate a leak
        if (LeakDetector.hasHeapGrown(this._heapSize, priorHeapSize)) {
            this._consecutiveGrowth++;
            this.log("    consecutiveGrowth = " + this._consecutiveGrowth);
            // does it look like we're about to meet our leak detection threshhold?
            if (this._consecutiveGrowth === CONSECUTIVE_GROWTH_PRETHRESHOLD) {
                // take a "before" snapshot for comparison later on
                if (this._captureHeapDumps) {
                    this.cleanSnapshots();
                    this._beforeSnapshotName = this.getSnapshotFilename();
                    heapdump.writeSnapshot(this._beforeSnapshotName);
                    this.log("    \"Before\" heap snapshot written to " + this._beforeSnapshotName);
                }
            }
            // did we meet our leak detection threshhold?
            if (this._consecutiveGrowth >= CONSECUTIVE_GROWTH_THRESHOLD) {
                // take an "after" snapshot to compare with the "before" snapshot taken above
                if (this._captureHeapDumps) {
                    this._afterSnapshotName = this.getSnapshotFilename();
                    heapdump.writeSnapshot(this._afterSnapshotName);
                    this.log("    \"After\" heap snapshot written to " + this._afterSnapshotName);
                }
                // raise a "leak" event
                var info = {
                    processName: this._processName,
                    heapSize: this._heapSize,
                    averageLeakSize: (this._heapSize - this._heapSizeBeforeLeaks) / CONSECUTIVE_GROWTH_THRESHOLD,
                    beforeSnapshotName: this._beforeSnapshotName,
                    afterSnapshotName: this._afterSnapshotName,
                };
                this.emit(LeakDetector.leakDetectedEvent, info);
                // reset the consecutive growth counter
                this._consecutiveGrowth = 0;
            }
        }
        else {
            // the heap shrank after the GC, reset our counters
            this.cleanSnapshots();
            this._heapSizeBeforeLeaks = this._heapSize;
            this._consecutiveGrowth = 0;
            this._beforeSnapshotName = null;
            this._afterSnapshotName = null;
            this.log("    consecutiveGrowth = " + this._consecutiveGrowth);
        }
    };
    /**
     * Helper method to keep the number of heap snapshots from spinning out of control
     */
    LeakDetector.prototype.cleanSnapshots = function () {
        try {
            if (this._beforeSnapshotName) {
                this.log("    Deleting \"Before\" heap snapshot: " + this._beforeSnapshotName);
                fs.unlinkSync(this._beforeSnapshotName);
                this._beforeSnapshotName = null;
            }
            if (this._afterSnapshotName) {
                this.log("    Deleting \"After\" heap snapshot:  " + this._afterSnapshotName);
                fs.unlinkSync(this._afterSnapshotName);
                this._afterSnapshotName = null;
            }
        }
        catch (e) {
            this.log("Error: Failed to delete snapshot.\n" + e.toString());
        }
    };
    LeakDetector.prototype.log = function (message) {
        if (this._enableLogging) {
            console.log(message);
        }
    };
    LeakDetector.prototype.getSnapshotFilename = function () {
        // tslint:disable-next-line: no-string-literal
        var tempDir = process.env["temp"];
        var includeMilliseconds = true;
        var timeFilenameComponent = Logger_1.getLogFileDateTime(new Date(), includeMilliseconds);
        return path.join(tempDir, "dd_client_" + this._processName + "_" + timeFilenameComponent + ".heapsnapshot");
    };
    return LeakDetector;
}(events_1.EventEmitter));
exports.LeakDetector = LeakDetector;
//# sourceMappingURL=leak-detector.js.map