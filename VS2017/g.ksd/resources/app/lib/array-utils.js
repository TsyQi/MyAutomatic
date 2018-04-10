/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @returns true if all elements in lhs are in rhs.
 */
function containsSameElements(lhs, rhs) {
    if (!lhs || !rhs) {
        return false;
    }
    return lhs.length === rhs.length && lhs.every(function (c) { return rhs.indexOf(c) > -1; });
}
exports.containsSameElements = containsSameElements;
/**
 * Returns if the input is an empty array.
 *
 * @param arr any[] The array to check.
 * @returns true if the array is empty, false if it is not an array or is not empty.
 */
function isEmptyArray(arr) {
    return Array.isArray(arr) && arr.length <= 0;
}
exports.isEmptyArray = isEmptyArray;
//# sourceMappingURL=array-utils.js.map