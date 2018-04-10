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
var argument_preprocessor_1 = require("./argument-preprocessor");
var DevBuildPreprocessor = /** @class */ (function (_super) {
    __extends(DevBuildPreprocessor, _super);
    function DevBuildPreprocessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DevBuildPreprocessor.isDevBuild = function (args) {
        return args &&
            args.length > 1 &&
            args[0].toLowerCase().lastIndexOf("electron.exe") !== -1 &&
            args[1].toLowerCase() === "out";
    };
    DevBuildPreprocessor.prototype.process = function (args) {
        if (DevBuildPreprocessor.isDevBuild(args)) {
            return args.slice(2);
        }
        if (this._nextProcessor) {
            return this._nextProcessor.process(args);
        }
        return args;
    };
    return DevBuildPreprocessor;
}(argument_preprocessor_1.ArgumentPreprocessor));
exports.DevBuildPreprocessor = DevBuildPreprocessor;
//# sourceMappingURL=dev-build-preprocessor.js.map