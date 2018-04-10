/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
var ArgumentPreprocessor = /** @class */ (function () {
    function ArgumentPreprocessor(nextProcessor) {
        this._nextProcessor = nextProcessor;
    }
    ArgumentPreprocessor.prototype.tryProcess = function (args) {
        try {
            var processedArgs = this.process(args);
            return {
                args: processedArgs,
            };
        }
        catch (error) {
            return {
                args: args,
                error: error,
            };
        }
    };
    return ArgumentPreprocessor;
}());
exports.ArgumentPreprocessor = ArgumentPreprocessor;
//# sourceMappingURL=argument-preprocessor.js.map