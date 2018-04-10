/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NativeImageFactory = /** @class */ (function () {
    function NativeImageFactory(nativeImageImpl) {
        this._nativeImage = nativeImageImpl;
    }
    NativeImageFactory.prototype.createFromPath = function (path) {
        return this._nativeImage.createFromPath(path);
    };
    return NativeImageFactory;
}());
exports.NativeImageFactory = NativeImageFactory;
//# sourceMappingURL=native-image-factory.js.map