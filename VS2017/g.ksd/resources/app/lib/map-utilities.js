"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
function getOrCreateArrayInMap(map, key) {
    var value = map.get(key);
    if (!value) {
        value = [];
        map.set(key, value);
    }
    return value;
}
exports.getOrCreateArrayInMap = getOrCreateArrayInMap;
//# sourceMappingURL=map-utilities.js.map