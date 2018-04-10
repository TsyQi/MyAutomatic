/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/* istanbul ignore next */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../../../lib/requires");
var string_utilities_1 = require("../../../lib/string-utilities");
var argument_preprocessor_1 = require("./argument-preprocessor");
var FeedbackInstancePreprocessor = /** @class */ (function (_super) {
    __extends(FeedbackInstancePreprocessor, _super);
    function FeedbackInstancePreprocessor(appPath, nextProcessor) {
        var _this = _super.call(this, nextProcessor) || this;
        requires.stringNotEmpty(appPath, "appPath");
        _this._appPath = appPath;
        return _this;
    }
    FeedbackInstancePreprocessor.isFeedbackInstance = function (args, appPath) {
        // To instantiate the feedback client, we call: <path-to-electron.exe> <path-to-app> reportaproblem
        return args &&
            args.length > 1 &&
            string_utilities_1.caseInsensitiveAreEqual(args[1], appPath);
    };
    FeedbackInstancePreprocessor.prototype.process = function (args) {
        if (FeedbackInstancePreprocessor.isFeedbackInstance(args, this._appPath)) {
            return args.slice(2);
        }
        if (this._nextProcessor) {
            return this._nextProcessor.process(args);
        }
        return args;
    };
    return FeedbackInstancePreprocessor;
}(argument_preprocessor_1.ArgumentPreprocessor));
exports.FeedbackInstancePreprocessor = FeedbackInstancePreprocessor;
//# sourceMappingURL=feedback-instance-preprocessor.js.map