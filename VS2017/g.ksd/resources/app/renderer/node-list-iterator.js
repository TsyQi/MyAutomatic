/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
var NodeListIterator = /** @class */ (function () {
    function NodeListIterator(nodeList, reverse) {
        this._index = 0;
        this._reverse = reverse;
        this._nodeList = nodeList;
        if (this._reverse) {
            this._index = this._nodeList.length - 1;
        }
    }
    /**
     * @returns {T} - the next element in the list, or undefined if
     *                there are no more elements left.
     */
    NodeListIterator.prototype.next = function () {
        if (this._reverse) {
            return this._nodeList[this._index--];
        }
        return this._nodeList[this._index++];
    };
    NodeListIterator.prototype.begin = function () {
        if (this._reverse) {
            return this._nodeList[this._nodeList.length - 1];
        }
        return this._nodeList[0];
    };
    return NodeListIterator;
}());
exports.NodeListIterator = NodeListIterator;
//# sourceMappingURL=node-list-iterator.js.map