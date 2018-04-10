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
var css_styles_1 = require("../css-styles");
var factory_1 = require("../stores/factory");
var KeyCodes_1 = require("../KeyCodes");
var open_external_1 = require("../../lib/open-external");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var error_names_1 = require("../../lib/error-names");
var licenseTermsClass = "license-terms-link";
var thirdPartyNoticesClass = "third-party-notices-link";
var LicenseTermsText = /** @class */ (function (_super) {
    __extends(LicenseTermsText, _super);
    function LicenseTermsText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.innerHtmlSet = false;
        return _this;
    }
    Object.defineProperty(LicenseTermsText.prototype, "ariaText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.summaryPaneLicensePlainText;
        },
        enumerable: true,
        configurable: true
    });
    LicenseTermsText.prototype.divClicked = function (ev) {
        if (ev.target.classList.contains(licenseTermsClass)) {
            if (this.selectedProduct.license) {
                open_external_1.openExternal(this.selectedProduct.license);
            }
            else {
                this.onShowDownloadAndLicenseTerms();
            }
        }
        else if (ev.target.classList.contains(thirdPartyNoticesClass)) {
            if (this.selectedProduct.thirdPartyNotices) {
                open_external_1.openExternal(this.selectedProduct.thirdPartyNotices);
            }
            else {
                open_external_1.openExternal("https://aka.ms/tpn");
            }
        }
    };
    LicenseTermsText.prototype.customKeyPressHandler = function (ev) {
        if ([KeyCodes_1.keyCodes.SPACE, KeyCodes_1.keyCodes.ENTER].indexOf(ev.keyCode) !== -1) {
            this.divClicked({ target: ev.target });
        }
    };
    LicenseTermsText.prototype.mounted = function () {
        if (this.selectedProduct) {
            var element = this.root.querySelector(".license-footer-content");
            // It is important that we don't set the innerHTML if it is already set, since this method
            // is very noisy, and resetting the innerHTML will cause focus to jump out of the element
            if (element && !this.innerHtmlSet) {
                element.innerHTML = ResourceStrings_1.ResourceStrings.summaryPaneLicenseTextFormatted(licenseTermsClass, thirdPartyNoticesClass);
                this.innerHtmlSet = true;
            }
        }
    };
    LicenseTermsText.prototype.onShowDownloadAndLicenseTerms = function () {
        var options = {
            title: ResourceStrings_1.ResourceStrings.downloadAndLicenseTermsHeader,
            message: ResourceStrings_1.ResourceStrings.licenseAcceptanceDisclaimer,
            allowCancel: false,
            hideSupportLink: true,
            errorName: error_names_1.SHOW_DOWNLOAD_AND_LICENSE_TERMS_ERROR_NAME,
        };
        factory_1.errorStore.show(options);
    };
    Object.defineProperty(LicenseTermsText.prototype, "outerDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                fontSize: ".67rem",
                lineHeight: "1.35",
                webkitPaddingBefore: "4px",
                webkitMarginEnd: "10px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LicenseTermsText.prototype, "alertImageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "100%",
                webkitMarginEnd: "6px",
                webkitMarginStart: "6px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LicenseTermsText.prototype, "selectedProduct", {
        get: function () {
            return factory_1.productConfigurationStore.getSelectedProduct();
        },
        enumerable: true,
        configurable: true
    });
    LicenseTermsText = __decorate([
        template("\n<license-terms-text>\n    <div style={this.outerDivStyle}\n            class=\"license-footer\"\n            onclick={this.divClicked}\n            onkeypress={this.customKeyPressHandler}>\n        <div class=\"license-footer-content\"\n                tabindex=\"0\"\n                aria-label={this.ariaText} />\n    </div>\n</license-terms-text>")
    ], LicenseTermsText);
    return LicenseTermsText;
}(Riot.Element));
//# sourceMappingURL=license-terms-text.js.map