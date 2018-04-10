/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var Product_1 = require("../../lib/Installer/Product");
var InstallingState_1 = require("../InstallingState");
var ButtonIds;
(function (ButtonIds) {
    "use strict";
    ButtonIds.pause = "product-pause-button";
    ButtonIds.install = "product-install-button";
    ButtonIds.launch = "product-launch-button";
    ButtonIds.modify = "product-modify-button";
    ButtonIds.remove = "product-remove-button";
    ButtonIds.repair = "product-repair-button";
    ButtonIds.retry = "product-retry-button";
    ButtonIds.restart = "product-restart-button";
    ButtonIds.resume = "product-resume-button";
    ButtonIds.uninstall = "product-uninstall-button";
    ButtonIds.update = "product-update-button";
})(ButtonIds = exports.ButtonIds || (exports.ButtonIds = {}));
var ActionButtonOptions;
(function (ActionButtonOptions) {
    "use strict";
    function getButtonOptions(product, disabled) {
        if (Product_1.isPreviewProduct(product.product)) {
            return [createButtonOptions(ButtonIds.uninstall, disabled)];
        }
        if (product.installingState !== InstallingState_1.InstallingState.NotInstalling) {
            if (product.installingState === InstallingState_1.InstallingState.Uninstalling) {
                return [];
            }
            return [createButtonOptions(ButtonIds.pause, product.installingState === InstallingState_1.InstallingState.Pausing)];
        }
        var modifyButtonOptions = createButtonOptions(ButtonIds.modify, disabled);
        if (product.product.installState === Product_1.InstallState.Paused) {
            return [createButtonOptions(ButtonIds.resume, disabled), modifyButtonOptions];
        }
        if (product.product.hasPendingReboot) {
            return [createButtonOptions(ButtonIds.restart, disabled)];
        }
        if (product.product.hasCriticalError) {
            return [createButtonOptions(ButtonIds.retry, disabled), createButtonOptions(ButtonIds.remove, disabled)];
        }
        var launchButtonOptions = createButtonOptions(ButtonIds.launch, disabled);
        if (product.product.isUpdateAvailable) {
            var updateTooltip = ResourceStrings_1.ResourceStrings.updateTo(product.product.latestVersion.display);
            return [createButtonOptions(ButtonIds.update, disabled, updateTooltip), launchButtonOptions];
        }
        return [modifyButtonOptions, launchButtonOptions];
    }
    ActionButtonOptions.getButtonOptions = getButtonOptions;
})(ActionButtonOptions = exports.ActionButtonOptions || (exports.ActionButtonOptions = {}));
var DropdownButtonOptions;
(function (DropdownButtonOptions) {
    "use strict";
    function getButtonOptions(product, disabled) {
        if (Product_1.isPreviewProduct(product.product)) {
            return [];
        }
        if (product.installingState !== InstallingState_1.InstallingState.NotInstalling) {
            return [];
        }
        if (product.product.installState === Product_1.InstallState.Paused) {
            return [createButtonOptions(ButtonIds.remove, disabled)];
        }
        if (product.product.hasPendingReboot) {
            return [];
        }
        if (product.product.hasCriticalError) {
            return [];
        }
        var options = [
            createButtonOptions(ButtonIds.repair, disabled),
            createButtonOptions(ButtonIds.uninstall, disabled),
        ];
        if (product.product.isUpdateAvailable) {
            options.push(createButtonOptions(ButtonIds.modify, disabled));
        }
        return options;
    }
    DropdownButtonOptions.getButtonOptions = getButtonOptions;
})(DropdownButtonOptions = exports.DropdownButtonOptions || (exports.DropdownButtonOptions = {}));
function createButtonOptions(id, disabled, tooltip) {
    var text;
    var name;
    switch (id) {
        case ButtonIds.install:
            text = ResourceStrings_1.ResourceStrings.install;
            name = "install";
            break;
        case ButtonIds.launch:
            text = ResourceStrings_1.ResourceStrings.launch;
            name = "launch";
            break;
        case ButtonIds.modify:
            text = ResourceStrings_1.ResourceStrings.modify;
            name = "modify";
            break;
        case ButtonIds.pause:
            text = ResourceStrings_1.ResourceStrings.pause;
            name = "pause";
            break;
        case ButtonIds.remove:
            text = ResourceStrings_1.ResourceStrings.remove;
            name = "remove";
            break;
        case ButtonIds.repair:
            text = ResourceStrings_1.ResourceStrings.repair;
            name = "repair";
            break;
        case ButtonIds.retry:
            text = ResourceStrings_1.ResourceStrings.retry;
            name = "retry";
            break;
        case ButtonIds.restart:
            text = ResourceStrings_1.ResourceStrings.restart;
            name = "restart";
            break;
        case ButtonIds.resume:
            text = ResourceStrings_1.ResourceStrings.resume;
            name = "resume";
            break;
        case ButtonIds.uninstall:
            text = ResourceStrings_1.ResourceStrings.uninstall;
            name = "uninstall";
            break;
        case ButtonIds.update:
            text = ResourceStrings_1.ResourceStrings.update;
            name = "update";
            break;
        default:
            throw new Error("The button type is not valid");
    }
    return {
        disabled: disabled,
        id: id,
        name: name,
        text: text,
        tooltip: tooltip,
    };
}
exports.createButtonOptions = createButtonOptions;
//# sourceMappingURL=button-options.js.map