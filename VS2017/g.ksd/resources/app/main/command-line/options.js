/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/modules/yargs/index.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandLine_1 = require("../../lib/CommandLine");
var nickname_utilities_1 = require("../../lib/nickname-utilities");
function getSupportedOptions() {
    var stringType = "string";
    return [
        {
            name: CommandLine_1.OptionNames.installPath,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The installation directory for the instance to act upon. " +
                    "For the install command, this is where the instance will be installed. " +
                    "For other commands, this is where the previously-installed instance was installed."
            }
        },
        {
            name: CommandLine_1.OptionNames.productId,
            implies: CommandLine_1.OptionNames.channelId,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The ID of the product for the instance that will be installed. " +
                    "This is required for the install command, " +
                    "ignored for other commands if --installPath is specified."
            }
        },
        {
            name: CommandLine_1.OptionNames.channelId,
            implies: CommandLine_1.OptionNames.productId,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The ID of the channel for the instance that will be installed. " +
                    "This is required for the install command, " +
                    "ignored for other commands if --installPath is specified."
            }
        },
        {
            name: CommandLine_1.OptionNames.channelUri,
            options: {
                type: stringType,
                required: false,
                requiresArg: false,
                description: "The URI of the channel manifest.  This can be used for the install " +
                    "command; it is ignored for other commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.installChannelUri,
            supportRelativePath: true,
            // --installChannelUri requires --channelUri, but we can't use the "implies" functionality because
            // yargs will throw an "implications failed" error if --channelUri is specified without an argument.
            // We'll handle this implication explicitly in emitErrors.
            // implies: OptionNames.channelUri,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The URI of the channel manifest to use for the installation.  " +
                    "The URI specified by --channelUri (which must be specified when " +
                    "--installChannelUri is specified) will be used to detect updates.  " +
                    "If updates are not desired, --channelUri must be specified without an argument.  " +
                    "This can be used for the install command; it is ignored for other commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.installCatalogUri,
            supportRelativePath: true,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The URI of the catalog manifest to use for the installation.  If specified, " +
                    "the channel manager will attempt to download the catalog manifest from this URI " +
                    "before using the URI in the install channel manifest.  This parameter is used " +
                    "to support offline install, where the layout cache will be created with " +
                    "the product catalog already downloaded.  This can be used for the install command; " +
                    "it is ignored for other commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.layoutPath,
            supportRelativePath: true,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The layout directory to check for packages before attempting to download them using " +
                    "the location in the manifest. This can be used for the install command; it is ignored " +
                    "for other commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.add,
            multiInstance: true,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "This defines an artifact (group, workload, or component) that is to be " +
                    "added to the installation.  It can appear multiple times on the command line. " +
                    "\n\nThe required components of the artifact are installed, but not the recommended or optional " +
                    "components. You can control additional components globally using --includeRecommended and/or " +
                    '--includeOptional. For finer-grained control, you can append ";includeRecommended" and/or ' +
                    '";includeOptional" to the artifactId (e.g. "--add Workload1;includeRecommended" or ' +
                    '"--add Workload2;includeOptional;includeRecommended").\n\n' +
                    "It is optional for the install and modify commands, ignored for the update, " +
                    "repair and uninstall commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.remove,
            multiInstance: true,
            excludes: [CommandLine_1.OptionNames.focusedUi],
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "This defines an artifact (group, workload, or component) that is to be " +
                    "removed from the installation.  It can appear multiple times on the command line. " +
                    "It is optional for the install and modify commands, ignored for the update, " +
                    "repair and uninstall commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.all,
            options: {
                required: false,
                requiresArg: false,
                description: "Installs all workloads and all components.",
            },
        },
        {
            name: CommandLine_1.OptionNames.allWorkloads,
            options: {
                required: false,
                requiresArg: false,
                description: "Installs all workloads and their required components, " +
                    "no recommended or optional components.",
            },
        },
        {
            name: CommandLine_1.OptionNames.includeRecommended,
            options: {
                required: false,
                requiresArg: false,
                description: "Includes the recommended components for any workloads that are installed, " +
                    "but not the optional components.  The workloads are specified either with " +
                    "--allWorkloads or --add.",
            },
        },
        {
            name: CommandLine_1.OptionNames.includeOptional,
            options: {
                required: false,
                requiresArg: false,
                description: "Includes the optional components for any workloads that are installed, " +
                    "but not the recommended components.  The workloads are specified either with " +
                    "--allWorkloads or --add.",
            },
        },
        {
            name: CommandLine_1.OptionNames.campaign,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The identifier of the campaign, for campaign tracking. If supplied, " +
                    "this ID will be logged with the installer's \"AppLaunched\" telemetry event."
            }
        },
        {
            name: CommandLine_1.OptionNames.activityId,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "An ID that can be used to correlate the installer command with an event in " +
                    "Visual Studio.  If supplied, this ID will be logged with the installer's " +
                    "\"AppLaunched\" event."
            }
        },
        {
            name: CommandLine_1.OptionNames.responseFile,
            prohibitedInResponseFile: true,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The URI or path to a response file"
            }
        },
        {
            name: CommandLine_1.OptionNames.version,
            options: {
                alias: CommandLine_1.OptionAliases.version,
                required: false,
                requiresArg: false,
                description: "Writes the application's version number to the console and exits"
            }
        },
        {
            name: CommandLine_1.OptionNames.passive,
            excludes: [
                CommandLine_1.OptionNames.quiet,
                CommandLine_1.OptionNames.focusedUi
            ],
            options: {
                alias: CommandLine_1.OptionAliases.passive,
                required: false,
                requiresArg: false,
                description: "If present, the command proceeds with UI, immediately and without user interaction. " +
                    "This option cannot be used with --quiet."
            }
        },
        {
            name: CommandLine_1.OptionNames.quiet,
            excludes: [
                CommandLine_1.OptionNames.passive,
                CommandLine_1.OptionNames.focusedUi
            ],
            options: {
                alias: CommandLine_1.OptionAliases.quiet,
                required: false,
                requiresArg: false,
                description: "If present, the command proceeds without UI.  Progress messages are written to stdout " +
                    "and error messages are written to stderr.  This option cannot be used with --passive."
            }
        },
        {
            name: CommandLine_1.OptionNames.noRestart,
            options: {
                required: false,
                requiresArg: false,
                description: "If present, commands with --passive or --quiet will not automatically restart the " +
                    "machine (if required).  This is ignored if neither --passive nor --quiet are specified."
            }
        },
        {
            name: CommandLine_1.OptionNames.locale,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The locale to be displayed on the GUI."
            }
        },
        {
            name: CommandLine_1.OptionNames.focusedUi,
            implies: CommandLine_1.OptionNames.add,
            excludes: [
                CommandLine_1.OptionNames.quiet,
                CommandLine_1.OptionNames.passive,
                CommandLine_1.OptionNames.remove
            ],
            options: {
                required: false,
                requiresArg: false,
                description: "If present, a minimal GUI will be displayed for a client to review before commiting " +
                    "the operation. This option cannot be used with --passive, --quiet, or --remove."
            }
        },
        {
            name: CommandLine_1.OptionNames.installSessionId,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "The sessionId from a previous instance of the client, for telemetry."
            },
        },
        {
            name: CommandLine_1.OptionNames.runOnce,
            options: {
                required: false,
                requiresArg: false,
                description: "Starts a new instance(process) of installer with current set of arguments " +
                    "except the runOnce argument."
            },
        },
        {
            name: CommandLine_1.OptionNames.addProductLang,
            multiInstance: true,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "This defines the language of an artifact (group, workload, or component) that is to be " +
                    "installed.  It can appear multiple times on the command line. " +
                    "It is optional for the install and modify commands, ignored for the update, " +
                    "repair and uninstall commands. If not present, the installation will use the machine locale."
            }
        },
        {
            name: CommandLine_1.OptionNames.removeProductLang,
            multiInstance: true,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "This defines the language of an artifact (group, workload, or component) that is to be " +
                    "removed.  It can appear multiple times on the command line. " +
                    "It is optional for the install and modify commands, ignored for the update, " +
                    "repair and uninstall commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.nickname,
            multiInstance: false,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "This defines the nickname to assign to an installed product. " +
                    ("The nickname cannot be longer than " + nickname_utilities_1.MAX_NICKNAME_LENGTH + " characters. ") +
                    "It is optional for the install command, ignored for the modify, update, " +
                    "repair and uninstall commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.noUpdateInstaller,
            options: {
                required: false,
                requiresArg: false,
                description: "Prevents the installer from updating itself when quiet is specified. " +
                    "The installer will fail the command and return a non-zero exit code if noUpdateInstaller " +
                    "is specified with quiet when an installer update is required."
            },
        },
        {
            name: CommandLine_1.OptionNames.productKey,
            multiInstance: false,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "This defines the product key to use for an installed product. It is composed of " +
                    "25 alphanumeric characters either in the format 'xxxxx-xxxxx-xxxxx-xxxxx-xxxxx' or " +
                    "'xxxxxxxxxxxxxxxxxxxxxxxxx'. It is optional for the install and update commands, ignored for" +
                    " the repair, modify and uninstall commands."
            }
        },
        {
            name: CommandLine_1.OptionNames.cache,
            excludes: [
                CommandLine_1.OptionNames.nocache
            ],
            options: {
                required: false,
                requiresArg: false,
                description: "If present, packages will be kept after being installed for subsequent repairs. " +
                    "This will override the global policy setting to be used for subsequent installs, " +
                    "repairs, or modifications. The default policy is to cache packages. " +
                    "This is ignored for the uninstall command."
            }
        },
        {
            name: CommandLine_1.OptionNames.nocache,
            excludes: [
                CommandLine_1.OptionNames.cache
            ],
            options: {
                required: false,
                requiresArg: false,
                description: "If present, packages will be be deleted after being installed or repaired. " +
                    "They will be downloaded again only if needed and deleted again after use. " +
                    "This will override the global policy setting to be used for subsequent installs, " +
                    "repairs, or modifications. The default policy is to cache packages. " +
                    "This is ignored for the uninstall command."
            }
        },
        {
            name: CommandLine_1.OptionNames.noWeb,
            options: {
                required: false,
                requiresArg: false,
                description: "No to any web download.",
            },
        },
        {
            name: CommandLine_1.OptionNames.force,
            options: {
                alias: CommandLine_1.OptionNames.updateFromVS,
                required: false,
                requiresArg: false,
                description: "Force terminate any running Visual Studio processes.",
            },
        },
        {
            name: CommandLine_1.OptionNames.pipe,
            multiInstance: false,
            options: {
                type: stringType,
                required: false,
                requiresArg: true,
                description: "This defines the named pipe to connect",
            }
        },
        {
            name: CommandLine_1.OptionNames.vsix,
            multiInstance: true,
            supportRelativePath: true,
            options: {
                type: "string",
                required: false,
                requiresArg: true,
                description: "URI or path to an additional vsix to install. Ignored if no command is provided.",
            },
        },
        {
            name: CommandLine_1.OptionNames.flight,
            multiInstance: true,
            options: {
                type: "string",
                required: false,
                requiresArg: true,
                description: "A flight or flights to enable, along with the duration. eg \"flight1;7d\". This is only seeded during an install operation.",
            },
        },
        {
            name: CommandLine_1.OptionNames.installerFlight,
            multiInstance: true,
            options: {
                type: "string",
                required: false,
                requiresArg: true,
                description: "A flight or flights to enable, along with the duration. eg \"flight1;7d\"",
            },
        },
    ];
}
exports.getSupportedOptions = getSupportedOptions;
//# sourceMappingURL=options.js.map