"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("./requires");
function zeroFill(value, length) {
    requires.numberOfRange(length, 1, 16, "length");
    var stringValue = value.toString();
    if (stringValue.length >= length) {
        return stringValue;
    }
    return ("0000000000000000" + stringValue).slice(-length);
}
exports.zeroFill = zeroFill;
function caseInsensitiveAreEqual(s1, s2) {
    return caseInsensitiveCompare(s1, s2) === 0;
}
exports.caseInsensitiveAreEqual = caseInsensitiveAreEqual;
/**
 * Returns a value less than 0 if s1 comes before s2 alphabetically.
 * Returns a value greater than 0 if s1 comes after s2 alphabetically.
 * Returns the value 0 if s1 and s2 are equal.
 *
 * This function is case insensitive. Sort order:
 * Undefined -> null -> case insensitive alphabetical
 */
function caseInsensitiveCompare(s1, s2) {
    if (s1 === undefined) {
        return (s2 === undefined) ? 0 : -1;
    }
    if (s1 === null) {
        if (s2 === undefined) {
            return 1;
        }
        return (s2 === null) ? 0 : -1;
    }
    if ((s2 === undefined) || (s2 === null)) {
        return 1;
    }
    return s1.toLocaleLowerCase().localeCompare(s2.toLocaleLowerCase());
}
exports.caseInsensitiveCompare = caseInsensitiveCompare;
function argsAsString(args) {
    if (!args || args.length === 0) {
        return "";
    }
    return args
        .map(function (arg) {
        if (arg[0] !== "\"" && (arg.includes(" ") || arg.includes("\t"))) {
            return "\"" + arg + "\"";
        }
        return arg;
    })
        .join(" ");
}
exports.argsAsString = argsAsString;
//# sourceMappingURL=string-utilities.js.map