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
var ExeNamePreprocessor = /** @class */ (function (_super) {
    __extends(ExeNamePreprocessor, _super);
    function ExeNamePreprocessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExeNamePreprocessor.prototype.process = function (args) {
        // Remove the exe name (the first param)
        return args.slice(1);
    };
    return ExeNamePreprocessor;
}(argument_preprocessor_1.ArgumentPreprocessor));
exports.ExeNamePreprocessor = ExeNamePreprocessor;
//# sourceMappingURL=exe-name-preprocessor.js.map