"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../lib/requires");
var Utilities_1 = require("./Utilities");
var string_utilities_1 = require("../lib/string-utilities");
var node_list_iterator_1 = require("./node-list-iterator");
/**
 * Class to handle focus for elements, not allowing focus outside of the root's children
 */
var FocusHandler = /** @class */ (function () {
    /**
     * Creates a new @see{FocusHandler} to prevent focus from leaving the root's children
     * @param doc The document to hook the focusout event to
     * @param root The root to prevent focus from leaving
     * @param canFocusRoot true if we can focus on the root element, false if not
     */
    function FocusHandler(doc, root, canFocusRoot) {
        if (canFocusRoot === void 0) { canFocusRoot = false; }
        this._onFocusOutBind = this.onFocusOut.bind(this);
        this._onKeyUpBind = this.onKeyUp.bind(this);
        this._onKeyDownBind = this.onKeyDown.bind(this);
        this._shiftPressed = false;
        requires.notNullOrUndefined(doc, "document");
        requires.notNullOrUndefined(root, "root");
        this._document = doc;
        this._root = root;
        this._canFocusRoot = canFocusRoot;
    }
    FocusHandler.prototype.monitorFocus = function (start) {
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this._document.documentElement, start);
        hookMethod("focusout", this._onFocusOutBind);
        hookMethod("keyup", this._onKeyUpBind);
        hookMethod("keydown", this._onKeyDownBind);
    };
    FocusHandler.prototype.onFocusOut = function (event) {
        var element = event.relatedTarget;
        // If the target is not valid, the root does not contain it,
        // or it is the root and we cannot focus the root, reset focus
        if (!element
            || !this._root.contains(element)
            || (this._root.isEqualNode(element) && !this._canFocusRoot)) {
            event.stopPropagation();
            event.preventDefault();
            this.resetFocus(this._shiftPressed);
        }
    };
    FocusHandler.prototype.onKeyUp = function (event) {
        this.handleKeyPress(event.key, false);
    };
    FocusHandler.prototype.onKeyDown = function (event) {
        this.handleKeyPress(event.key, true);
    };
    FocusHandler.prototype.handleKeyPress = function (key, down) {
        if (string_utilities_1.caseInsensitiveAreEqual(key, "shift")) {
            this._shiftPressed = down;
        }
    };
    FocusHandler.prototype.resetFocus = function (fromEnd) {
        var _this = this;
        // the root element is visible, so handle focus
        if (this._document.contains(this._root)) {
            // We need to request a frame to show the focus change
            requestAnimationFrame(function () {
                // walk the children testing focus. Go in reverse if fromEnd is true
                var children = _this._root.querySelectorAll("*");
                var list = new node_list_iterator_1.NodeListIterator(children, fromEnd);
                var current = list.begin();
                while (current) {
                    current.focus();
                    if (current === _this._document.activeElement) {
                        return;
                    }
                    current = list.next();
                }
            });
        }
    };
    return FocusHandler;
}());
exports.FocusHandler = FocusHandler;
//# sourceMappingURL=focus-handler.js.map