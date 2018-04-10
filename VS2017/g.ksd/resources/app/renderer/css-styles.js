/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var div;
/**
 * Creates a {CSSStyleMap} to simplify setting styles of an {HTMLElement}
 * @return {CSSStyleMap} representation of CSS. Call toString() to use in a style attribute
 */
function createStyleMap(styles) {
    if (!div) {
        div = document.createElement("div");
        // override style.toString
        CSSStyleDeclaration.prototype.toString = function toString() {
            return this.cssText;
        };
    }
    if (styles) {
        div.style.cssText = "";
        Object.assign(div.style, styles);
    }
    return div.style;
}
exports.createStyleMap = createStyleMap;
//# sourceMappingURL=css-styles.js.map