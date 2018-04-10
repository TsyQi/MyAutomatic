/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceStrings_1 = require("../lib/ResourceStrings");
var string_utilities_1 = require("../lib/string-utilities");
var LocaleHandler;
(function (LocaleHandler) {
    "use strict";
    LocaleHandler.DEFAULT_LOCALE = "en-US";
    LocaleHandler.SUPPORTED_LANGUAGE_CODES = [
        "zh-CN",
        "zh-TW",
        "cs-CZ",
        "en-US",
        "fr-FR",
        "de-DE",
        "it-IT",
        "ja-JP",
        "ko-KR",
        "pl-PL",
        "pt-BR",
        "ru-RU",
        "es-ES",
        "tr-TR"
    ];
    // This map contains hardcoded fallback languages for some exceptional languages.
    // Key - The fallback language.
    // Value - A list of language codes that fallback to the key.
    LocaleHandler.FALLBACK_LOCALES = {
        "zh-TW": ["zh-hk", "zh-mo", "zh-hant", "zh-TW_pronun", "zh-tw", "zh-hant-hk", "zh-hant-mo", "zh-hant-tw"],
        "zh-CN": ["zh", "zh-cn", "zh-hans-hk", "zh-hans-mo", "zh-hans", "zh-sg", "zh-hans-cn", "zh-hans-sg"],
    };
    var _LANGUAGE_MAP = {};
    function init() {
        _LANGUAGE_MAP = {
            "zh-CN": ResourceStrings_1.ResourceStrings.chineseSimplified,
            "zh-TW": ResourceStrings_1.ResourceStrings.chineseTraditional,
            "cs-CZ": ResourceStrings_1.ResourceStrings.czech,
            "en-US": ResourceStrings_1.ResourceStrings.english,
            "fr-FR": ResourceStrings_1.ResourceStrings.french,
            "de-DE": ResourceStrings_1.ResourceStrings.german,
            "it-IT": ResourceStrings_1.ResourceStrings.italian,
            "ja-JP": ResourceStrings_1.ResourceStrings.japanese,
            "ko-KR": ResourceStrings_1.ResourceStrings.korean,
            "pl-PL": ResourceStrings_1.ResourceStrings.polish,
            "pt-BR": ResourceStrings_1.ResourceStrings.portugueseBrazil,
            "ru-RU": ResourceStrings_1.ResourceStrings.russian,
            "es-ES": ResourceStrings_1.ResourceStrings.spanish,
            "tr-TR": ResourceStrings_1.ResourceStrings.turkish
        };
    }
    LocaleHandler.init = init;
    function getUIName(languageCode) {
        return _LANGUAGE_MAP[languageCode];
    }
    LocaleHandler.getUIName = getUIName;
    function getSupportedLocale(locale) {
        var lang = LocaleHandler.DEFAULT_LOCALE;
        if (!locale || locale.length < 2) {
            return lang;
        }
        if (locale.substring(0, 2) === "zh") {
            locale = getChineseLocale(locale);
        }
        lang = LocaleHandler.SUPPORTED_LANGUAGE_CODES.find(function (language) {
            // Compare the language codes and ignore the culture code unless Chinese
            if (language.substring(0, 2) !== "zh") {
                return string_utilities_1.caseInsensitiveAreEqual(language.substring(0, 2), locale.substring(0, 2));
            }
            return string_utilities_1.caseInsensitiveAreEqual(language, locale);
        });
        if (lang) {
            return lang;
        }
        return LocaleHandler.DEFAULT_LOCALE;
    }
    LocaleHandler.getSupportedLocale = getSupportedLocale;
    function getChineseLocale(locale) {
        var defaultLang = "zh-TW";
        var lang;
        for (var _i = 0, _a = Object.keys(LocaleHandler.FALLBACK_LOCALES); _i < _a.length; _i++) {
            var fallbackLanguage = _a[_i];
            lang = LocaleHandler.FALLBACK_LOCALES[fallbackLanguage].find(function (language) {
                return string_utilities_1.caseInsensitiveAreEqual(language, locale);
            });
            if (lang) {
                return fallbackLanguage;
            }
        }
        return defaultLang;
    }
})(LocaleHandler = exports.LocaleHandler || (exports.LocaleHandler = {}));
//# sourceMappingURL=locale-handler.js.map