/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dev_build_preprocessor_1 = require("./dev-build-preprocessor");
var feedback_instance_preprocessor_1 = require("./feedback-instance-preprocessor");
var exe_name_preprocessor_1 = require("./exe-name-preprocessor");
var ArgumentPreprocessorFactory = /** @class */ (function () {
    function ArgumentPreprocessorFactory(appPath) {
        this._appPath = appPath;
    }
    ArgumentPreprocessorFactory.prototype.createArgumentPreprocessor = function () {
        if (this._preprocessor) {
            return this._preprocessor;
        }
        var exeNamePreprocessor = new exe_name_preprocessor_1.ExeNamePreprocessor();
        var feedbackInstancePreprocessor = new feedback_instance_preprocessor_1.FeedbackInstancePreprocessor(this._appPath, exeNamePreprocessor);
        this._preprocessor = new dev_build_preprocessor_1.DevBuildPreprocessor(feedbackInstancePreprocessor);
        return this._preprocessor;
    };
    return ArgumentPreprocessorFactory;
}());
exports.ArgumentPreprocessorFactory = ArgumentPreprocessorFactory;
//# sourceMappingURL=argument-preprocessor-factory.js.map