/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../bower_components/riot-ts/riot-ts.d.ts" />
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
var errorNames = require("../../lib/error-names");
var factory_1 = require("../stores/factory");
var error_message_response_1 = require("../interfaces/error-message-response");
var css_styles_1 = require("../css-styles");
var InstallerActions_1 = require("../Actions/InstallerActions");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
require("./x-glyph");
/* tslint:disable:max-line-length */
var ChannelHeader = /** @class */ (function (_super) {
    __extends(ChannelHeader, _super);
    /* tslint:enable */
    function ChannelHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ChannelHeader.prototype, "headerText", {
        get: function () {
            return this.opts.channel.name;
        },
        enumerable: true,
        configurable: true
    });
    ChannelHeader.prototype.removeChannelClicked = function () {
        var _this = this;
        var errorMessageOptions;
        var channelId = this.opts.channel.id;
        var installedProductsForChannel = factory_1.appStore.installedProductsForChannel(channelId);
        if (installedProductsForChannel && installedProductsForChannel.length > 0) {
            var message_1 = [ResourceStrings_1.ResourceStrings.cannotRemoveChannelMessage(this.opts.channel.name), ""];
            installedProductsForChannel.forEach(function (product) { return message_1.push(_this.formatProductName(product)); });
            errorMessageOptions = {
                allowCancel: false,
                message: message_1,
                errorName: errorNames.CANNOT_REMOVE_CHANNEL_WITH_INSTALLED_PRODUCTS,
                title: ResourceStrings_1.ResourceStrings.removingChannel(this.opts.channel.name),
            };
            factory_1.errorStore.show(errorMessageOptions);
        }
        else {
            errorMessageOptions = {
                allowCancel: true,
                message: ResourceStrings_1.ResourceStrings.removeChannelPrompt(this.opts.channel.name),
                errorName: errorNames.REMOVE_CHANNEL_CLICKED,
                okButtonText: ResourceStrings_1.ResourceStrings.remove,
                title: ResourceStrings_1.ResourceStrings.removingChannel(this.opts.channel.name),
            };
            factory_1.errorStore.show(errorMessageOptions)
                .then(function (response) {
                if (response.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                    InstallerActions_1.removeChannel(channelId);
                }
            });
        }
    };
    Object.defineProperty(ChannelHeader.prototype, "removeButtonTooltip", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.removeChannel(this.opts.channel.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelHeader.prototype, "textStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 auto",
                fontSize: ".75rem",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelHeader.prototype, "parentLayoutStyle", {
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
    Object.defineProperty(ChannelHeader.prototype, "hrAndButtonLayoutStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                // Giving a negative margin on this div allows the channel name to be close to
                // the rule without also making the button smaller.
                marginTop: "-5px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelHeader.prototype, "hrStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                borderStyle: "solid",
                borderWidth: "1px",
                flex: "0 1 100%",
                margin: "0px 4px 0px 0px",
                borderBottomWidth: "0px",
                borderTopWidth: "1px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelHeader.prototype, "buttonStyle", {
        get: function () {
            var buttonSize = "16px";
            var style = css_styles_1.createStyleMap({
                flex: "0 0 auto",
                height: buttonSize,
                lineHeight: "0",
                padding: "0px",
                width: buttonSize,
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    ChannelHeader.prototype.formatProductName = function (product) {
        var asInstalled = product;
        var displayName;
        if (asInstalled.nickname) {
            displayName = ResourceStrings_1.ResourceStrings.productWithNicknameTitle(asInstalled.name, asInstalled.nickname);
        }
        else {
            displayName = asInstalled.name;
        }
        // \u2022 is the solid, round bullet point
        return "\u2022 " + displayName;
    };
    ChannelHeader = __decorate([
        template("\n<channel-header>\n     <div style={this.parentLayoutStyle}>\n        <div style={this.textStyle}\n             role=\"heading\"\n             class=\"app-logo-text\">\n            {this.headerText}\n        </div>\n        <div style={this.hrAndButtonLayoutStyle}>\n            <hr class=\"channels-rule\"\n                style={this.hrStyle} />\n            <button class=\"delete-channel-glyph-button\"\n                    style={this.buttonStyle}\n                    onClick={this.removeChannelClicked}\n                    title={this.removeButtonTooltip}>\n                <x-glyph></x-glyph>\n            </button>\n        </div>\n    </div>\n</channel-header>")
        /* tslint:enable */
    ], ChannelHeader);
    return ChannelHeader;
}(Riot.Element));
//# sourceMappingURL=channel-header.js.map