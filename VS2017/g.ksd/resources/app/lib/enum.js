/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumExtensions = /** @class */ (function () {
    function EnumExtensions() {
    }
    EnumExtensions.getNames = function (enumType) {
        return EnumExtensions.getValues(enumType).filter(function (v) { return typeof v === "string"; });
    };
    EnumExtensions.getEnumValues = function (enumType) {
        return EnumExtensions.getValues(enumType).filter(function (v) { return typeof v === "number"; });
    };
    EnumExtensions.getValues = function (enumType) {
        return Object.keys(enumType).map(function (k) { return enumType[k]; });
    };
    EnumExtensions.getValueOfName = function (enumType, name) {
        if (!enumType || !name) {
            return null;
        }
        var value = enumType[name];
        return value !== undefined ? value : null;
    };
    return EnumExtensions;
}());
exports.EnumExtensions = EnumExtensions;
//# sourceMappingURL=enum.js.map