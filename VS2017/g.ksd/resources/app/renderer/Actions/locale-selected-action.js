/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var LocaleSelectedEvent_1 = require("../Events/LocaleSelectedEvent");
function selectLocale(locale, isChecked) {
    dispatcher_1.dispatcher.dispatch(new LocaleSelectedEvent_1.LocaleSelectedEvent(locale, isChecked));
}
exports.selectLocale = selectLocale;
//# sourceMappingURL=locale-selected-action.js.map