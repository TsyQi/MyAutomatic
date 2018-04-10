/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
var LanguageConfig = /** @class */ (function () {
    function LanguageConfig(add, remove, applanguage) {
        this._languagesToAdd = LanguageConfig.ensureArray(add);
        this._languagesToRemove = LanguageConfig.ensureArray(remove);
        this._appLanguage = applanguage;
    }
    LanguageConfig.ensureArray = function (value) {
        if (value === undefined || value === null) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        return [value.toString()];
    };
    Object.defineProperty(LanguageConfig.prototype, "languagesToAdd", {
        get: function () {
            return this._languagesToAdd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageConfig.prototype, "languagesToRemove", {
        get: function () {
            return this._languagesToRemove;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageConfig.prototype, "appLanguage", {
        get: function () {
            return this._appLanguage;
        },
        enumerable: true,
        configurable: true
    });
    return LanguageConfig;
}());
exports.LanguageConfig = LanguageConfig;
//# sourceMappingURL=language-config.js.map