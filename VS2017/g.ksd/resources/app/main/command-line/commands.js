/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandLine_1 = require("../../lib/CommandLine");
function getSupportedCommands() {
    return [
        {
            command: CommandLine_1.CommandNames.install,
            description: "Installs a product",
            ignoredOptions: [],
        },
        {
            command: CommandLine_1.CommandNames.modify,
            description: "Modifies an installed product",
            ignoredOptions: [
                CommandLine_1.OptionNames.channelUri,
                CommandLine_1.OptionNames.installChannelUri,
                CommandLine_1.OptionNames.installCatalogUri,
                CommandLine_1.OptionNames.layoutPath,
                CommandLine_1.OptionNames.nickname,
                CommandLine_1.OptionNames.productKey,
            ]
        },
        {
            command: CommandLine_1.CommandNames.update,
            description: "Updates an installed product",
            ignoredOptions: [
                CommandLine_1.OptionNames.channelUri,
                CommandLine_1.OptionNames.installChannelUri,
                CommandLine_1.OptionNames.installCatalogUri,
                CommandLine_1.OptionNames.layoutPath,
                CommandLine_1.OptionNames.add,
                CommandLine_1.OptionNames.remove,
                CommandLine_1.OptionNames.focusedUi,
                CommandLine_1.OptionNames.all,
                CommandLine_1.OptionNames.allWorkloads,
                CommandLine_1.OptionNames.includeRecommended,
                CommandLine_1.OptionNames.includeOptional,
                CommandLine_1.OptionNames.addProductLang,
                CommandLine_1.OptionNames.removeProductLang,
                CommandLine_1.OptionNames.nickname,
            ]
        },
        {
            command: CommandLine_1.CommandNames.repair,
            description: "Repairs an installed product",
            ignoredOptions: [
                CommandLine_1.OptionNames.channelUri,
                CommandLine_1.OptionNames.installChannelUri,
                CommandLine_1.OptionNames.installCatalogUri,
                CommandLine_1.OptionNames.layoutPath,
                CommandLine_1.OptionNames.add,
                CommandLine_1.OptionNames.remove,
                CommandLine_1.OptionNames.focusedUi,
                CommandLine_1.OptionNames.all,
                CommandLine_1.OptionNames.allWorkloads,
                CommandLine_1.OptionNames.includeRecommended,
                CommandLine_1.OptionNames.includeOptional,
                CommandLine_1.OptionNames.addProductLang,
                CommandLine_1.OptionNames.removeProductLang,
                CommandLine_1.OptionNames.nickname,
                CommandLine_1.OptionNames.productKey,
            ]
        },
        {
            command: CommandLine_1.CommandNames.resume,
            description: "Resumes a partial installation, usually after a system reboot",
            ignoredOptions: [
                CommandLine_1.OptionNames.channelUri,
                CommandLine_1.OptionNames.installChannelUri,
                CommandLine_1.OptionNames.installCatalogUri,
                CommandLine_1.OptionNames.layoutPath,
                CommandLine_1.OptionNames.add,
                CommandLine_1.OptionNames.remove,
                CommandLine_1.OptionNames.focusedUi,
                CommandLine_1.OptionNames.all,
                CommandLine_1.OptionNames.allWorkloads,
                CommandLine_1.OptionNames.includeRecommended,
                CommandLine_1.OptionNames.includeOptional,
                CommandLine_1.OptionNames.addProductLang,
                CommandLine_1.OptionNames.removeProductLang,
                CommandLine_1.OptionNames.nickname,
            ],
        },
        {
            command: CommandLine_1.CommandNames.uninstall,
            description: "Uninstalls an installed product",
            ignoredOptions: [
                CommandLine_1.OptionNames.channelUri,
                CommandLine_1.OptionNames.installChannelUri,
                CommandLine_1.OptionNames.installCatalogUri,
                CommandLine_1.OptionNames.layoutPath,
                CommandLine_1.OptionNames.add,
                CommandLine_1.OptionNames.remove,
                CommandLine_1.OptionNames.focusedUi,
                CommandLine_1.OptionNames.all,
                CommandLine_1.OptionNames.allWorkloads,
                CommandLine_1.OptionNames.includeRecommended,
                CommandLine_1.OptionNames.includeOptional,
                CommandLine_1.OptionNames.addProductLang,
                CommandLine_1.OptionNames.removeProductLang,
                CommandLine_1.OptionNames.nickname,
                CommandLine_1.OptionNames.productKey,
                CommandLine_1.OptionNames.cache,
                CommandLine_1.OptionNames.nocache,
            ]
        },
        {
            command: CommandLine_1.CommandNames.reportaproblem,
            description: "Launches VS Feedback Report A Problem console and exits",
            hidden: true,
            ignoredOptions: []
        },
        {
            command: CommandLine_1.CommandNames.collectdiagnostics,
            description: "Launches VS Diagnostics Data Collection and exits",
            hidden: true,
            ignoredOptions: []
        }
    ];
}
exports.getSupportedCommands = getSupportedCommands;
//# sourceMappingURL=commands.js.map