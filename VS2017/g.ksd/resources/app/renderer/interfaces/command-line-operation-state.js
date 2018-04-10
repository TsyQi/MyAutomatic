/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandLineOperationState;
(function (CommandLineOperationState) {
    // an operation wasn't specified on the command line
    CommandLineOperationState[CommandLineOperationState["Unspecified"] = 0] = "Unspecified";
    // the command line operation hasn't started yet
    CommandLineOperationState[CommandLineOperationState["Pending"] = 1] = "Pending";
    // the command line operation is in progress
    CommandLineOperationState[CommandLineOperationState["InProgress"] = 2] = "InProgress";
    // the command line operation completed
    CommandLineOperationState[CommandLineOperationState["Complete"] = 3] = "Complete";
})(CommandLineOperationState = exports.CommandLineOperationState || (exports.CommandLineOperationState = {}));
//# sourceMappingURL=command-line-operation-state.js.map