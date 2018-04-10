/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../lib/requires");
var string_utilities_1 = require("../lib/string-utilities");
var ResourceStrings_1 = require("../lib/ResourceStrings");
var nickname_utilities_1 = require("../lib/nickname-utilities");
var errorNames = require("../lib/error-names");
var NicknameDisposition;
(function (NicknameDisposition) {
    NicknameDisposition[NicknameDisposition["Valid"] = 0] = "Valid";
    NicknameDisposition[NicknameDisposition["InvalidCharacters"] = 1] = "InvalidCharacters";
    NicknameDisposition[NicknameDisposition["TooLong"] = 2] = "TooLong";
    NicknameDisposition[NicknameDisposition["RequiredButNotProvided"] = 3] = "RequiredButNotProvided";
    NicknameDisposition[NicknameDisposition["NotUnique"] = 4] = "NotUnique";
})(NicknameDisposition = exports.NicknameDisposition || (exports.NicknameDisposition = {}));
var NicknameValidationResult = /** @class */ (function () {
    function NicknameValidationResult(disposition, nickname) {
        this._disposition = disposition;
        switch (this._disposition) {
            default:
            case NicknameDisposition.Valid:
                this._errorMessage = null;
                this._errorCode = null;
                break;
            case NicknameDisposition.InvalidCharacters:
                this._errorMessage = ResourceStrings_1.ResourceStrings.invalidNickname;
                this._errorCode = errorNames.INVALID_NICKNAME;
                break;
            case NicknameDisposition.TooLong:
                this._errorMessage = ResourceStrings_1.ResourceStrings.nicknameTooLong(nickname_utilities_1.MAX_NICKNAME_LENGTH);
                this._errorCode = errorNames.TOO_LONG_NICKNAME;
                break;
            case NicknameDisposition.RequiredButNotProvided:
                this._errorMessage = ResourceStrings_1.ResourceStrings.nicknameRequired;
                this._errorCode = errorNames.REQUIRED_NICKNAME;
                break;
            case NicknameDisposition.NotUnique:
                this._errorMessage = ResourceStrings_1.ResourceStrings.nicknameNotUnique(nickname);
                this._errorCode = errorNames.NOT_UNIQUE_NICKNAME;
                break;
        }
    }
    Object.defineProperty(NicknameValidationResult.prototype, "isValid", {
        get: function () {
            return this._disposition === NicknameDisposition.Valid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NicknameValidationResult.prototype, "disposition", {
        get: function () {
            return this._disposition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NicknameValidationResult.prototype, "errorMessage", {
        get: function () {
            return this._errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NicknameValidationResult.prototype, "errorCode", {
        get: function () {
            return this._errorCode;
        },
        enumerable: true,
        configurable: true
    });
    return NicknameValidationResult;
}());
exports.NicknameValidationResult = NicknameValidationResult;
function createNicknameHelper(appStore) {
    return new NicknameHelper(appStore);
}
exports.createNicknameHelper = createNicknameHelper;
var NicknameHelper = /** @class */ (function () {
    function NicknameHelper(appStore) {
        requires.notNullOrUndefined(appStore, "appStore");
        this._appStore = appStore;
    }
    NicknameHelper.prototype.isNicknameRequired = function (selectedProduct) {
        if (!selectedProduct) {
            return false;
        }
        // check if there is any product with same channelID already installed.
        return this._appStore.getInstalledItems().some(function (product) {
            return string_utilities_1.caseInsensitiveAreEqual(product.channelId, selectedProduct.channelId);
        });
    };
    NicknameHelper.prototype.suggestNickname = function (selectedProduct) {
        var existingNicknames = this.getExistingNicknamesByChannelId(selectedProduct);
        return nickname_utilities_1.suggestNickname(existingNicknames);
    };
    // tslint:disable: one-line
    NicknameHelper.prototype.validateNickname = function (nickname, selectedProduct) {
        var disposition = NicknameDisposition.Valid;
        var existingNickname = this.getExistingNicknamesByChannelId(selectedProduct);
        // make sure it is valid
        if (!nickname_utilities_1.isValidNickname(nickname)) {
            disposition = NicknameDisposition.InvalidCharacters;
        }
        else if (nickname && (nickname.length > nickname_utilities_1.MAX_NICKNAME_LENGTH)) {
            disposition = NicknameDisposition.TooLong;
        }
        else if (this.isNicknameRequired(selectedProduct) && !nickname) {
            disposition = NicknameDisposition.RequiredButNotProvided;
        }
        else if (existingNickname && existingNickname.indexOf(nickname) !== -1) {
            disposition = NicknameDisposition.NotUnique;
        }
        return new NicknameValidationResult(disposition, nickname);
    };
    // tslint:enable: one-line
    NicknameHelper.prototype.getExistingNicknamesByChannelId = function (selectedProduct) {
        var existingNicknames = [];
        if (!selectedProduct) {
            return existingNicknames;
        }
        // build up our collection of existing nicknames so we can ensure uniqueness later
        this._appStore.getInstalledItems().forEach(function (product) {
            var nickname = product.nickname;
            if (nickname && string_utilities_1.caseInsensitiveAreEqual(product.channelId, selectedProduct.channelId)) {
                existingNicknames.push(nickname);
            }
        });
        return existingNicknames;
    };
    return NicknameHelper;
}());
//# sourceMappingURL=nickname-helper.js.map