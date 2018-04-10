/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_utilities_1 = require("./string-utilities");
function idsAreEqual(lhs, rhs) {
    return string_utilities_1.caseInsensitiveAreEqual(lhs.id, rhs.id);
}
function versionsAreEqual(lhs, rhs) {
    return string_utilities_1.caseInsensitiveAreEqual(lhs.version.build, rhs.version.build) &&
        string_utilities_1.caseInsensitiveAreEqual(lhs.version.display, rhs.version.display) &&
        string_utilities_1.caseInsensitiveAreEqual(lhs.version.semantic, rhs.version.semantic);
}
var IdVersionCollectionDiff = /** @class */ (function () {
    /**
     * Creates a diff between two collections of {IdVersionDescriptor}.
     * @param {IdVersionDescriptor[]} before - The before collection.
     * @param {IdVersionDescriptor[]} after - The after collection.
     */
    function IdVersionCollectionDiff(before, after) {
        var _this = this;
        this._added = [];
        this._removed = [];
        this._changed = [];
        before = before ? before.slice() : [];
        after = after ? after.slice() : [];
        after.forEach(function (afterItem) {
            var beforeIndex = before.findIndex(function (beforeItem) { return idsAreEqual(beforeItem, afterItem); });
            // Item is not in before, so it is added
            if (beforeIndex === -1) {
                _this._added.push(afterItem);
            }
            else {
                // Item is in both before and after, so remove it from before array.
                var beforeItem = before.splice(beforeIndex, 1)[0];
                // If the version changed between items, it is changed.
                if (!versionsAreEqual(beforeItem, afterItem)) {
                    _this._changed.push(afterItem);
                }
            }
        });
        // All elements found in before and after are deleted from the before array above,
        // so removed elements are all that remain in before.
        this._removed = before;
    }
    Object.defineProperty(IdVersionCollectionDiff.prototype, "added", {
        get: function () {
            return this._added;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdVersionCollectionDiff.prototype, "removed", {
        get: function () {
            return this._removed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdVersionCollectionDiff.prototype, "changed", {
        get: function () {
            return this._changed;
        },
        enumerable: true,
        configurable: true
    });
    return IdVersionCollectionDiff;
}());
exports.IdVersionCollectionDiff = IdVersionCollectionDiff;
//# sourceMappingURL=id-version-collection-diff.js.map