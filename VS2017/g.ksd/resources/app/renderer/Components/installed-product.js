/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/riot-ts-missing-declares.d.ts" />
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
var button_options_1 = require("../interfaces/button-options");
var css_styles_1 = require("../css-styles");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var open_external_actions_1 = require("../Actions/open-external-actions");
var factory_1 = require("../Actions/factory");
var Product_1 = require("../../lib/Installer/Product");
var InstallingState_1 = require("../InstallingState");
var features_1 = require("../../lib/feature-flags/features");
var factory_2 = require("../stores/factory");
require("./install-progress-view");
require("./product-status");
require("./product-view");
require("./progress-view");
/* istanbul ignore next */
var InstalledProduct = /** @class */ (function (_super) {
    __extends(InstalledProduct, _super);
    function InstalledProduct() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.openProblemsBind = _this.openProblemsDialog.bind(_this);
        _this.releaseNotesClickedBind = _this.releaseNotesClicked.bind(_this);
        _this._styles = new InstalledProductStyles();
        return _this;
    }
    Object.defineProperty(InstalledProduct.prototype, "showLinkSeparator", {
        get: function () {
            return this.showReleaseNotesLink && this.showViewProblemsLink;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "showProductStatus", {
        get: function () {
            return !this.isInstalling &&
                (this.hasError || this.isProductPaused || this.product.hasPendingReboot || this.hasCriticalError);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "hideVersion", {
        get: function () {
            return this.isInstalling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "progressCalculator", {
        get: function () {
            return this.opts.progressCalculator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "showDescription", {
        get: function () {
            return !this.isInstalling && !this.showProductStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "ariaOperationLabel", {
        get: function () {
            var resourceMethod;
            switch (this.installingState) {
                case InstallingState_1.InstallingState.Pausing:
                    resourceMethod = ResourceStrings_1.ResourceStrings.pausing;
                    break;
                case InstallingState_1.InstallingState.Installing:
                    resourceMethod = ResourceStrings_1.ResourceStrings.installing;
                    break;
                case InstallingState_1.InstallingState.Modifying:
                    resourceMethod = ResourceStrings_1.ResourceStrings.modifying;
                    break;
                case InstallingState_1.InstallingState.NotInstalling:
                    // Not used
                    break;
                case InstallingState_1.InstallingState.Repairing:
                    resourceMethod = ResourceStrings_1.ResourceStrings.repairing;
                    break;
                case InstallingState_1.InstallingState.Uninstalling:
                    resourceMethod = ResourceStrings_1.ResourceStrings.uninstalling;
                    break;
                case InstallingState_1.InstallingState.Updating:
                    resourceMethod = ResourceStrings_1.ResourceStrings.updating;
                    break;
                default:
                    console.log("Unrecognized InstallingState: " + this.installingState);
            }
            if (resourceMethod) {
                return resourceMethod(this.product.name);
            }
            return this.product.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "progressBarOne", {
        get: function () {
            return this.opts.progressBarOne;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "progressBarTwo", {
        get: function () {
            return this.opts.progressBarTwo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "isInstalling", {
        get: function () {
            if (this.installingState !== InstallingState_1.InstallingState.NotInstalling) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "showViewProblemsLink", {
        get: function () {
            // Never show view problems link while installing or when there is a pending reboot
            if (this.isInstalling || this.product.hasPendingReboot) {
                return false;
            }
            // Only show view problems link for paused products with failed packages
            if (this.isProductPaused) {
                return this.product.errorDetails.failedPackages.length > 0;
            }
            return this.hasError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "showReleaseNotesLink", {
        get: function () {
            return !this.isInstalling &&
                !this.isProductPaused &&
                !this.hasCriticalError &&
                !this.product.hasPendingReboot;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "customStatusImageSrc", {
        get: function () {
            if (this.isProductPaused) {
                return "images/StatusPause.svg";
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "isProductPaused", {
        get: function () {
            return this.product.installState === Product_1.InstallState.Paused && !this.isInstalling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "hasCriticalError", {
        get: function () {
            // If there is a reboot required there is no critical error.
            return !this.product.hasPendingReboot && this.product.hasCriticalError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "releaseNotesText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.releaseNotes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "product", {
        get: function () {
            return this.opts.installedProduct.product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "disableButtons", {
        get: function () {
            return this.opts.disableButtons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "actionButtonOptions", {
        get: function () {
            return button_options_1.ActionButtonOptions.getButtonOptions(this.opts.installedProduct, this.disableButtons);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "dropdownOptions", {
        get: function () {
            return button_options_1.DropdownButtonOptions.getButtonOptions(this.opts.installedProduct, this.disableButtons);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "buttonOptions", {
        get: function () {
            return {
                actionbuttons: this.actionButtonOptions,
                actionmenubuttons: this.dropdownOptions,
                product: this.product,
                checkboxLabel: this.opts.checkboxLabel,
                checkboxState: this.opts.checkboxState,
                onCheckboxClicked: this.opts.onCheckboxClicked,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "longDescriptionText", {
        get: function () {
            return this.product.longDescription || this.product.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "styles", {
        get: function () {
            return this._styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "hasError", {
        get: function () {
            return this.product && this.product.hasErrors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "statusMessage", {
        get: function () {
            if (this.isProductPaused) {
                var errorDetails = this.product.errorDetails;
                return errorDetails.failedPackages.length > 0 ?
                    ResourceStrings_1.ResourceStrings.setupPausedWithIssues :
                    ResourceStrings_1.ResourceStrings.setupPaused;
            }
            if (this.product.hasPendingReboot) {
                return ResourceStrings_1.ResourceStrings.rebootRequiredMessage;
            }
            if (this.hasCriticalError) {
                return ResourceStrings_1.ResourceStrings.partialProductErrorText;
            }
            if (this.hasError) {
                return ResourceStrings_1.ResourceStrings.setupCompletedWithWarnings;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "viewProblemsText", {
        get: function () {
            return ResourceStrings_1.ResourceStrings.viewProblems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProduct.prototype, "showInstallView", {
        get: function () {
            if (factory_2.featureStore.isEnabled(features_1.Feature.ShowBitrate)) {
                return false;
            }
            if (this.installingState === InstallingState_1.InstallingState.Installing) {
                return true;
            }
            if (this.installingState === InstallingState_1.InstallingState.Modifying) {
                return true;
            }
            if (this.installingState === InstallingState_1.InstallingState.Repairing) {
                return true;
            }
            if (this.installingState === InstallingState_1.InstallingState.Updating) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    InstalledProduct.prototype.openProblemsDialog = function (event) {
        factory_1.viewProblemsActions.viewProblems(this.product, this.opts.installedProduct.log);
    };
    Object.defineProperty(InstalledProduct.prototype, "installingState", {
        get: function () {
            return this.opts.installedProduct.installingState;
        },
        enumerable: true,
        configurable: true
    });
    InstalledProduct.prototype.releaseNotesClicked = function (ev) {
        open_external_actions_1.openReleaseNotesUrl(this.product.releaseNotes);
    };
    InstalledProduct = __decorate([
        template("\n<installed-product>\n    <product-view buttonoptions={this.buttonOptions}\n                  product={this.product}\n                  disablemenu={this.disableButtons}\n                  hideversion={this.hideVersion}>\n\n        <!-- Original progress view -->\n        <progress-view if={this.parent.isInstalling && !this.parent.showInstallView}\n                       progressbar1={this.parent.progressBarOne}\n                       progressbar2={this.parent.progressBarTwo}\n                       tabindex=\"-1\"\n                       aria-label={this.parent.ariaOperationLabel} />\n\n        <!-- Detailed progress view when in feature -->\n        <install-progress-view if={this.parent.isInstalling && this.parent.showInstallView}\n                               progressbar1={this.parent.progressBarOne}\n                               progressbar2={this.parent.progressBarTwo}\n                               installationpath={this.parent.product.installationPath}\n                               operation={this.parent.installingState}\n                               calculator={this.parent.progressCalculator}\n                               tabindex=\"-1\"\n                               aria-label={this.parent.ariaOperationLabel} />\n\n        <!-- Warnings -->\n        <product-status if={this.parent.showProductStatus}\n            custom-image={this.parent.customStatusImageSrc}\n            message={this.parent.statusMessage}\n            iscritical={this.parent.hasCriticalError} />\n\n        <!-- Long description -->\n        <virtual if={this.parent.showDescription}>\n            <div class=\"product-description\"\n                 style={this.parent.styles.longDescriptionStyle}\n                 tabindex=\"0\"\n                 aria-label={this.parent.longDescriptionText}>\n                {this.parent.longDescriptionText}\n            </div>\n        </virtual>\n\n        <div style={this.parent.styles.linksDivStyle}>\n            <span style={this.parent.styles.singleLineStyle}>\n                <!-- \"Release notes\" link -->\n                <a if={this.parent.showReleaseNotesLink}\n                   href=\"#\"\n                   class=\"clickable\"\n                   onClick={this.parent.releaseNotesClickedBind}\n                   onkeypress={keyPressToClickHelper}>\n                    {this.parent.releaseNotesText}\n                </a>\n\n                <span if={this.parent.showLinkSeparator}\n                      class=\"disabled-text\"\n                      style={this.parent.styles.pipeStyle}> | </span>\n\n                <a if={this.parent.showViewProblemsLink}\n                   onclick={this.parent.openProblemsBind}\n                   title={this.parent.viewProblemsText}\n                   onkeypress={keyPressToClickHelper}\n                   tabindex=\"0\">\n                    {this.parent.viewProblemsText}\n                </a>\n            </span>\n        </div>\n    </product-view>\n</installed-product>")
    ], InstalledProduct);
    return InstalledProduct;
}(Riot.Element));
exports.InstalledProduct = InstalledProduct;
/* istanbul ignore next */
var InstalledProductStyles = /** @class */ (function () {
    function InstalledProductStyles() {
    }
    Object.defineProperty(InstalledProductStyles.prototype, "linksDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "flex-end",
                display: "flex",
                margin: "1px 0px 4px",
                marginTop: "2px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductStyles.prototype, "longDescriptionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "3.15rem",
                overflow: "hidden",
                // Multiline ellipsis
                display: "-webkit-box",
                webkitLineClamp: "2",
                webkitBoxOrient: "vertical",
            });
            if (factory_2.featureStore.isEnabled(features_1.Feature.ShowBitrate)) {
                style.height = "2.15rem";
            }
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductStyles.prototype, "singleLineStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                marginRight: "5px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductStyles.prototype, "pipeStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: ".7rem",
                margin: "0 4px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    return InstalledProductStyles;
}());
exports.InstalledProductStyles = InstalledProductStyles;
//# sourceMappingURL=installed-product.js.map