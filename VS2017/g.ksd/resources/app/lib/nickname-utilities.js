/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("./requires");
// A regular expression for the characters that are invalid for filenames on Windows.
// When we go cross-platform, we'll need to retrieve these from the setup engine.
// The invalid characters are:
//      Characters 0x00 - 0x1F
//      " - quote
//      < - less than
//      > - greater than
//      | - pipe
//      : - colon
//      * - asterisk
//      ? - question mark
//      / - slash
//      \ - backslash
var invalidFilenameCharacters = /[\x00-\x1f"<>\|:\*\?\/\\]/;
exports.MAX_NICKNAME_LENGTH = 10;
/**
 * @returns true if nickname is valid for an installed product
 */
function isValidNickname(nickname) {
    // make sure it doesn't contain invalid characters
    if (invalidFilenameCharacters.test(nickname)) {
        return false;
    }
    // if we get this far, it's a valid nickname
    return true;
}
exports.isValidNickname = isValidNickname;
/**
 * @returns a nickname suggestion that doesn't conflict with any of the
 * existing nicknames
 *
 * The suggestions will be simple ordinals, beginning with "2".
 */
function suggestNickname(existingNicknames) {
    requires.notNullOrUndefined(existingNicknames, "existingNicknames");
    var initialOrdinal = 2;
    for (var i = initialOrdinal;; i++) {
        var suggestedNickname = i.toString();
        if (existingNicknames.indexOf(suggestedNickname) === -1) {
            return suggestedNickname;
        }
    }
}
exports.suggestNickname = suggestNickname;
//# sourceMappingURL=nickname-utilities.js.map