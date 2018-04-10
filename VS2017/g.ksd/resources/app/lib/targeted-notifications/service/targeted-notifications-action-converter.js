"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
function actionFromService(action, actionConverter) {
    /* tslint:enable:max-line-length */
    return {
        action: actionConverter(action.Action),
        precedence: action.Precedence,
        ruleId: action.RuleId,
    };
}
exports.actionFromService = actionFromService;
//# sourceMappingURL=targeted-notifications-action-converter.js.map