/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../renderer/bower_components/riot-ts/riot-ts.d.ts" />
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var css_styles_1 = require("../css-styles");
var nickname_utilities_1 = require("../../lib/nickname-utilities");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var NicknamePicker = /** @class */ (function (_super) {
    __extends(NicknamePicker, _super);
    function NicknamePicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nicknameChangedBind = _this.nicknameChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(NicknamePicker.prototype, "maxNicknameLength", {
        get: function () {
            return nickname_utilities_1.MAX_NICKNAME_LENGTH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NicknamePicker.prototype, "nicknameLabelText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.nicknameLabelText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NicknamePicker.prototype, "isReadOnly", {
        get: function () {
            return !!this.opts.isreadonly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NicknamePicker.prototype, "initialNickname", {
        get: function () {
            return this.opts.initialnickname;
        },
        enumerable: true,
        configurable: true
    });
    NicknamePicker.prototype.onChangeEvent = function (event) {
        // we want full control over the change event, so stop
        // propagation when the dom sends it from the input element.
        event.stopPropagation();
    };
    NicknamePicker.prototype.nicknameChanged = function (event) {
        // prevent this event from propagating up
        event.stopPropagation();
        // get the nickname from the appropriate field
        var nickname = event.target.value.trim();
        this.dispatchChangeEvent(nickname);
    };
    NicknamePicker.prototype.dispatchChangeEvent = function (value) {
        // only fire change event when the nickname has changed
        if (value !== this._nickname) {
            this._nickname = value;
            var event_1 = new CustomEvent("change", {
                bubbles: true,
                cancelable: true,
                detail: {
                    nickname: this._nickname
                },
            });
            // Don't let Riot auto update from the change event,
            // to keep typing responsive
            event_1.preventUpdate = true;
            this.root.dispatchEvent(event_1);
        }
    };
    Object.defineProperty(NicknamePicker.prototype, "nicknamePickerStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                webkitMarginStart: "14px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NicknamePicker.prototype, "nicknameInputStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "25px",
                width: "100%",
                marginTop: "2px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NicknamePicker.prototype, "nicknameLabelStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    NicknamePicker = __decorate([
        template("<nickname-picker>\n    <div style={this.nicknamePickerStyle}>\n        <label style={this.nicknameLabelStyle}>\n            {this.nicknameLabelText}\n            <input style={this.nicknameInputStyle}\n                type=\"text\"\n                readonly={this.isReadOnly}\n                value={this.initialNickname}\n                maxlength={this.maxNicknameLength}\n                oninput={this.nicknameChangedBind}\n                onchange={this.onChangeEvent}\n                aria-readonly={this.isReadOnly}>\n            </input>\n        </label>\n    </div>\n</nickname-picker>")
    ], NicknamePicker);
    return NicknamePicker;
}(Riot.Element));
//# sourceMappingURL=nickname-picker.js.map