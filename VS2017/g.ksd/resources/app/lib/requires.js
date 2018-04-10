/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
function isString(value) {
    return (typeof value) === "string";
}
function notNullOrUndefined(value, name) {
    if (value === null || value === undefined) {
        throw new errors_1.InvalidParameterError(name + " is null or undefined");
    }
}
exports.notNullOrUndefined = notNullOrUndefined;
function stringNotEmpty(value, name) {
    if (!isString(value) || value.length === 0) {
        throw new errors_1.InvalidParameterError(name + " is empty or not a string");
    }
}
exports.stringNotEmpty = stringNotEmpty;
function numberOfRange(value, minValue, maxValue, name) {
    notNullOrUndefined(value, name);
    if (isNaN(value) || value < minValue || value > maxValue) {
        throw new errors_1.InvalidParameterError(name + " is not a number within the range " + minValue + " to " + maxValue + ".");
    }
}
exports.numberOfRange = numberOfRange;
function isInteger(value, name) {
    if (!Number.isInteger(value)) {
        throw new errors_1.InvalidParameterError(name + " is not an integer.");
    }
}
exports.isInteger = isInteger;
function arrayNotNullorUndefinedorEmpty(value, name) {
    if (value === null || value === undefined || value.length === 0) {
        throw new errors_1.InvalidParameterError(name + " is null or undefined or empty");
    }
}
exports.arrayNotNullorUndefinedorEmpty = arrayNotNullorUndefinedorEmpty;
//# sourceMappingURL=requires.js.map