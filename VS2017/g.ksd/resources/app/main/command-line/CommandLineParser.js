/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/modules/yargs/index.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var url = require("url");
var yargs = require("yargs");
var CommandLine_1 = require("../../lib/CommandLine");
var errors_1 = require("../../lib/errors");
var nickname_utilities_1 = require("../../lib/nickname-utilities");
var string_utilities_1 = require("../../lib/string-utilities");
var requires = require("../../lib/requires");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var WindowsInstaller = require("../WindowsInstaller");
var options_1 = require("./options");
var commands_1 = require("./commands");
var array_utils_1 = require("../../lib/array-utils");
var CommandLineParser = /** @class */ (function () {
    function CommandLineParser(logger, showDialogOnError, errorHandlerFactory) {
        var _this = this;
        this.supportedAliases = [];
        this._supportedCommands = commands_1.getSupportedCommands();
        this._supportedOptions = options_1.getSupportedOptions();
        requires.notNullOrUndefined(logger, "logger");
        requires.notNullOrUndefined(errorHandlerFactory, "errorHandlerFactory");
        this._logger = logger;
        this._showDialogOnError = showDialogOnError;
        this._parser = this.createParser(errorHandlerFactory);
        this._errorHandler = errorHandlerFactory.createErrorHandler(this._parser, this._logger, this._showDialogOnError);
        this._supportedOptions.forEach(function (option) {
            if (option.options.alias) {
                if (Array.isArray(option.options.alias)) {
                    option.options.alias.forEach(function (alias) {
                        _this.supportedAliases.push(alias);
                    });
                }
                else {
                    _this.supportedAliases.push(option.options.alias);
                }
            }
        });
    }
    CommandLineParser.getParametersForResume = function (installPath, installSessionId, isQuiet, isPassive, productKey) {
        var launchParams = CommandLine_1.CommandNames.resume + " --" + CommandLine_1.OptionNames.installPath + " " +
            ("\"" + installPath + "\" --" + CommandLine_1.OptionNames.runOnce);
        if (installSessionId) {
            launchParams = launchParams.concat(" --" + CommandLine_1.OptionNames.installSessionId + " " + installSessionId);
        }
        if (isQuiet) {
            launchParams = launchParams.concat(" --" + CommandLine_1.OptionNames.quiet);
        }
        if (isPassive) {
            launchParams = launchParams.concat(" --" + CommandLine_1.OptionNames.passive);
        }
        if (productKey) {
            launchParams = launchParams.concat(" --" + CommandLine_1.OptionNames.productKey + " " + productKey);
        }
        return launchParams;
    };
    // This is used to determine whether we should show a dialog if there
    // is an error, which we need to determine BEFORE parsing.
    CommandLineParser.argsContainQuietOrPassive = function (args) {
        return args.some(function (s) {
            return string_utilities_1.caseInsensitiveAreEqual(s, "--" + CommandLine_1.OptionNames.quiet)
                || string_utilities_1.caseInsensitiveAreEqual(s, "--" + CommandLine_1.OptionNames.passive)
                || string_utilities_1.caseInsensitiveAreEqual(s, "--" + CommandLine_1.OptionAliases.quiet)
                || string_utilities_1.caseInsensitiveAreEqual(s, "--" + CommandLine_1.OptionAliases.passive)
                || string_utilities_1.caseInsensitiveAreEqual(s, "-" + CommandLine_1.OptionAliases.quiet)
                || string_utilities_1.caseInsensitiveAreEqual(s, "-" + CommandLine_1.OptionAliases.passive);
        });
    };
    CommandLineParser.prototype.tryParse = function (args, isDevBuild) {
        try {
            var argv = this.parse(args, isDevBuild);
            return {
                argv: argv,
            };
        }
        catch (error) {
            return {
                error: error,
            };
        }
    };
    /**
     * Returns an object containing the parsed values of command line arguments
     */
    CommandLineParser.prototype.parse = function (args, isDevBuild) {
        var _this = this;
        var argsCopy = args.slice();
        var isTestMode = argsCopy.some(function (arg) { return arg === "--" + CommandLine_1.OptionNames.testMode; });
        if (isTestMode) {
            this._logger.writeVerbose("CommandLineParser detected --test mode");
        }
        argsCopy = this.removeIgnoredArguments(argsCopy);
        var argv = this._parser.parse(argsCopy);
        // normalize the command and put it in the object as a named property
        argv = this.extractAndNormalizeCommand(argv, !isTestMode);
        // normalize option names
        argv = this.normalizeAndValidateOptionNames(argv, !isTestMode);
        // make sure the multi instance properties are arrays
        this.multiInstanceOptions.forEach(function (option) {
            argv[option.name] = _this.ensureArray(argv[option.name]);
        });
        // merge command line arguments with those from a response file (if we got one)
        argv = this.mergeResponseFile(argv);
        // if an artifact is in both the add and remove lists, it is neither added nor removed
        argv = this.clearOffsettingOptions(argv, CommandLine_1.OptionNames.add, CommandLine_1.OptionNames.remove);
        // if a language is in both the addProductLang and removeProductLang lists, it is neither added nor removed
        argv = this.clearOffsettingOptions(argv, CommandLine_1.OptionNames.addProductLang, CommandLine_1.OptionNames.removeProductLang);
        // always enable debugging for a dev build
        if (isDevBuild) {
            argv.debug = true;
        }
        if (isTestMode) {
            argv.testMode = true;
        }
        this.emitErrors(argv);
        this.emitWarnings(argv);
        return argv;
    };
    /**
     * Computes the query string for an object based on its contents
     */
    CommandLineParser.prototype.computeQueryParameters = function (argv) {
        var query = this.generateQueryString(argv);
        return query && query.substring(query.indexOf("?") + 1);
    };
    /**
     * Removes a supported option from argument list. Note it wont remove a supported command.
     */
    CommandLineParser.prototype.removeOptionFromArgumentList = function (args, argToRemove) {
        requires.stringNotEmpty(argToRemove, "argToRemove");
        requires.notNullOrUndefined(args, "args");
        if (args.length === 0) {
            return args.slice();
        }
        if (this.findCommand(argToRemove) !== undefined) {
            throw new errors_1.InvalidParameterError("argToRemove cannot be a supported command");
        }
        var currentOption = this.findOption(argToRemove);
        if (currentOption === undefined) {
            throw new errors_1.InvalidParameterError("argToRemove is not a supported option");
        }
        var index = args.indexOf("--" + argToRemove);
        if (index === -1) {
            throw new errors_1.InvalidParameterError("argToRemove supplied is not present in the supplied argument list");
        }
        var resultArgs = args.slice();
        var isLastArg = (resultArgs.length - 1) === index;
        // Remove the argument of the option if it has one
        if (!isLastArg && args[index + 1].charAt(0) !== "-") {
            resultArgs.splice(index + 1, 1);
        }
        // Remove the option
        resultArgs.splice(index, 1);
        return resultArgs;
    };
    CommandLineParser.prototype.isSupportedAlias = function (name) {
        return this.supportedAliases.some(function (alias) {
            return string_utilities_1.caseInsensitiveAreEqual(alias, name);
        });
    };
    /* tslint:disable:max-line-length */
    CommandLineParser.prototype.normalizeAndValidateProductKey = function (productKey) {
        // We need to handle the case where the user passes in multiple product keys
        if (Array.isArray(productKey)) {
            this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.multipleInstancesOfASingleInstanceParameter(CommandLine_1.OptionNames.productKey));
        }
        // verify that the product key is a 25 character alphanumeric string
        var alphaNumeric = "[0-9a-zA-Z]";
        var withHyphens = new RegExp("^" + alphaNumeric + "{5}-" + alphaNumeric + "{5}-" + alphaNumeric + "{5}-" + alphaNumeric + "{5}-" + alphaNumeric + "{5}$");
        var withoutHyphens = new RegExp("^" + alphaNumeric + "{25}$");
        if (productKey.match(withHyphens)) {
            return productKey.replace(/-/g, "");
        }
        if (productKey.match(withoutHyphens)) {
            return productKey;
        }
        this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.invalidProductKeyError(productKey));
    };
    /* tslint: enable */
    CommandLineParser.prototype.generateQueryString = function (argv) {
        // trim down argv, removing undefined properties and those that aren't
        // pertinent to the query string
        var queryObject = {};
        Object.keys(argv).forEach(function (key) {
            if (argv[key] === undefined) {
                return;
            }
            switch (key) {
                case "_":
                case "$0":
                case "help":
                // Exclude --locale because we handle --locale with argv.locale in Main.ts
                case CommandLine_1.OptionNames.locale:
                case CommandLine_1.OptionNames.responseFile:
                    break;
                case CommandLine_1.OptionNames.add:
                case CommandLine_1.OptionNames.remove:
                case CommandLine_1.OptionNames.addProductLang:
                case CommandLine_1.OptionNames.removeProductLang:
                    // the add or remove arrays might be empty; only include them if they're not
                    if (argv[key].length) {
                        queryObject[key] = argv[key];
                    }
                    break;
                default:
                    queryObject[key] = argv[key];
                    break;
            }
        });
        var formatObject = {
            query: queryObject
        };
        // if we got a command add it to the query string
        var command = argv[CommandLine_1.CommandNames.propertyName];
        if (command) {
            formatObject.pathname = "/" + command;
        }
        return url.format(formatObject);
    };
    /**
     * Removes the command line arguments that apply to the installer itself
     * (those are handled separately)
     */
    CommandLineParser.prototype.removeIgnoredArguments = function (args) {
        var ignoredArguments = [
            "--debug",
            "--inspect",
            WindowsInstaller.getInstallerFinalizeInstallParameter().toLowerCase(),
            WindowsInstaller.getInstallerUninstallParameter().toLowerCase(),
            WindowsInstaller.getInstallerUpdateParameter().toLowerCase(),
            WindowsInstaller.getInstallerFinalizeUpdateParameter().toLowerCase()
        ];
        return args.filter(function (arg) {
            arg = arg.toLowerCase();
            // ignore the argument if it begins with one of the ignored args
            var index = ignoredArguments.findIndex(function (ignoredArg) { return arg.startsWith(ignoredArg); });
            return (index === -1);
        });
    };
    /**
     * Removes artifacts that appear in both array parameters
     */
    CommandLineParser.prototype.clearOffsettingOptions = function (argv, optionName1, optionName2) {
        var option1Array = argv[optionName1];
        var option2Array = argv[optionName2];
        for (var i = 0; i < option1Array.length; i++) {
            var indexInRemove = option2Array.indexOf(option1Array[i]);
            if (indexInRemove !== -1) {
                option1Array.splice(i--, 1);
                option2Array.splice(indexInRemove, 1);
            }
        }
        argv[optionName1] = option1Array;
        argv[optionName2] = option2Array;
        return argv;
    };
    /**
     * yargs' parsing isn't case sensitive.  What this means is that if you define
     * a boolean option named "Foo" and pass "--foo" on the command line, yargs will
     * accept the option and add argv.foo with a value of true.  Other code will
     * be looking for argv.Foo, so we need to make sure all of the properties on
     * argv match the expected casing.
     */
    CommandLineParser.prototype.normalizeAndValidateOptionNames = function (argv, throwOnError) {
        var _this = this;
        var normalizedArgv = {
            $0: argv.$0,
            _: argv._,
        };
        // The command is normalized in extractAndNormalizeCommand
        normalizedArgv[CommandLine_1.CommandNames.propertyName] = argv[CommandLine_1.CommandNames.propertyName];
        // Map of arrays to handle multiple, differing cases for each multiInstance option.
        var multiInstanceArrayMap = {};
        this.multiInstanceOptions.forEach(function (option) {
            multiInstanceArrayMap[option.name] = [];
        });
        Object.keys(argv).forEach(function (key) {
            // yargs adds all possible command line options to argv as properties, but
            // they'll be undefined if they weren't on the command line; we therefore
            // need to explicity compare to undefined instead of doing a falsey check
            if (argv[key] !== undefined) {
                switch (key) {
                    case "$0":
                    case "_":
                    case CommandLine_1.CommandNames.propertyName:
                        // already handled
                        break;
                    default:
                        // copy the value using the normalized key name
                        var option = _this.findOption(key);
                        if (option) {
                            if (!option.multiInstance) {
                                if (option.name === CommandLine_1.OptionNames.productKey) {
                                    normalizedArgv[option.name] = _this.normalizeAndValidateProductKey(argv[key]);
                                }
                                else {
                                    normalizedArgv[option.name] = argv[key];
                                }
                                break;
                            }
                            // merge the array parameters to handle multiple, differing cases
                            // (e.g. --add, --Add and --ADD)
                            if (Array.isArray(argv[key])) {
                                Array.prototype.push.apply(multiInstanceArrayMap[option.name], argv[key]);
                            }
                            else {
                                multiInstanceArrayMap[option.name].push(argv[key]);
                            }
                        }
                        else if (["help", "h", "?"].some(function (helpKey) { return string_utilities_1.caseInsensitiveAreEqual(key, helpKey); })) {
                            _this._errorHandler.emitHelp();
                        }
                        else if (!_this.isSupportedAlias(key)) {
                            if (throwOnError) {
                                _this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.unsupportedOptionOnCommandLine(key));
                            }
                            else {
                                _this._logger.writeWarning("Ignoring unsupported command line option: --" + key);
                            }
                        }
                        break;
                }
            }
        });
        this.multiInstanceOptions.forEach(function (multiInstanceOption) {
            normalizedArgv[multiInstanceOption.name] = multiInstanceArrayMap[multiInstanceOption.name];
        });
        return normalizedArgv;
    };
    /**
     * The Yargs parser is case-insensitive since we don't call "strict()" on the parser,
     * so we need to normalize the command name. We also add the command back to the argv
     * object under the more readable key "command" to access later.
     */
    CommandLineParser.prototype.extractAndNormalizeCommand = function (argv, throwOnError) {
        if (argv._.length > 1) {
            if (throwOnError) {
                this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.atMostOneCommandParameter);
            }
            else {
                this._logger.writeWarning("Ignoring multiple commands");
            }
        }
        if (argv._.length && argv._[0]) {
            var commandDescriptor = this.findCommand(argv._[0]);
            if (commandDescriptor) {
                argv[CommandLine_1.CommandNames.propertyName] = commandDescriptor.command;
            }
            else {
                if (throwOnError) {
                    this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.unsupportedCommandOnCommandLine(argv._[0]));
                }
                else {
                    this._logger.writeWarning("Ignoring unsupported command: " + argv._[0]);
                }
            }
        }
        // set argv._ to null to prevent other code from using the non-normalized version of the command
        argv._ = null;
        return argv;
    };
    /**
     * Merges the contents of a response file with command line arguments
     */
    CommandLineParser.prototype.mergeResponseFile = function (argv) {
        var responseFilePath = argv[CommandLine_1.OptionNames.responseFile];
        // if there's no response file, short out
        if (!responseFilePath) {
            return argv;
        }
        this.validateSingleInstanceOption(argv, CommandLine_1.OptionNames.responseFile);
        var responseFileContents = this.readResponseFile(responseFilePath);
        this.validateResponseFileContents(responseFileContents);
        argv = this.mergeResponseFileContents(argv, responseFileContents);
        return this.resolveRelativePaths(argv, responseFilePath);
    };
    CommandLineParser.prototype.readResponseFile = function (responseFilePath) {
        try {
            var contentsJson = fs.readFileSync(responseFilePath, "utf8");
            if (!contentsJson) {
                return undefined;
            }
            return JSON.parse(contentsJson);
        }
        catch (err) {
            this._errorHandler.emitError(err);
        }
    };
    CommandLineParser.prototype.validateResponseFileContents = function (responseFileContents) {
        var _this = this;
        if (!responseFileContents) {
            return;
        }
        Object.keys(responseFileContents).forEach(function (key) {
            // allow a comment key
            if (key === CommandLine_1.OptionNames.comment) {
                return;
            }
            // if the key isn't in the options list, fail
            var index = _this._supportedOptions.findIndex(function (option) { return key === option.name; });
            if (index === -1) {
                _this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.unrecognizedOptionInResponseFile(key));
            }
            // if the key is in the options list but isn't supported in response files, fail
            if (_this._supportedOptions[index].prohibitedInResponseFile) {
                _this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.unsupportedOptionInResponseFile(key));
            }
        });
    };
    CommandLineParser.prototype.mergeResponseFileContents = function (argv, responseFileContents) {
        var _this = this;
        if (!responseFileContents) {
            return argv;
        }
        // make sure the multiInstance properties in the response file are present and are arrays
        this.multiInstanceOptions.forEach(function (option) {
            responseFileContents[option.name] = _this.ensureArray(responseFileContents[option.name]);
        });
        // properties on the command line override properties in the response file
        Object.keys(argv).forEach(function (key) {
            // yargs adds all possible command line options to argv as properties, but
            // they'll be undefined or empty array if they weren't on the command line; we therefore
            // need to explicity compare to undefined instead of doing a falsey check
            var isSetInArgv = argv[key] !== undefined && !array_utils_1.isEmptyArray(argv[key]);
            if (isSetInArgv) {
                switch (key) {
                    case CommandLine_1.OptionNames.add:
                        // add array is merged
                        argv[key].forEach(function (element) {
                            if (responseFileContents[key].indexOf(element) === -1) {
                                responseFileContents[key].push(element);
                            }
                            // a command line add overrides a response file remove
                            var index = responseFileContents[CommandLine_1.OptionNames.remove].indexOf(element);
                            if (index !== -1) {
                                responseFileContents[CommandLine_1.OptionNames.remove].splice(index, 1);
                            }
                        });
                        break;
                    case CommandLine_1.OptionNames.remove:
                        // remove array is merged
                        argv[key].forEach(function (element) {
                            if (responseFileContents[key].indexOf(element) === -1) {
                                responseFileContents[key].push(element);
                            }
                            // a command line remove overrides a response file add
                            var index = responseFileContents[CommandLine_1.OptionNames.add].indexOf(element);
                            if (index !== -1) {
                                responseFileContents[CommandLine_1.OptionNames.add].splice(index, 1);
                            }
                        });
                        break;
                    case CommandLine_1.OptionNames.addProductLang:
                        // addProductLang array is merged
                        argv[key].forEach(function (element) {
                            if (responseFileContents[key].indexOf(element) === -1) {
                                responseFileContents[key].push(element);
                            }
                            // a command line addProductLang overrides a response file removeProductLang
                            var index = responseFileContents[CommandLine_1.OptionNames.removeProductLang].indexOf(element);
                            if (index !== -1) {
                                responseFileContents[CommandLine_1.OptionNames.removeProductLang].splice(index, 1);
                            }
                        });
                        break;
                    case CommandLine_1.OptionNames.removeProductLang:
                        // removeProductLang array is merged
                        argv[key].forEach(function (element) {
                            if (responseFileContents[key].indexOf(element) === -1) {
                                responseFileContents[key].push(element);
                            }
                            // a command line removeProductLang overrides a response file addProductLang
                            var index = responseFileContents[CommandLine_1.OptionNames.addProductLang].indexOf(element);
                            if (index !== -1) {
                                responseFileContents[CommandLine_1.OptionNames.addProductLang].splice(index, 1);
                            }
                        });
                        break;
                    default:
                        responseFileContents[key] = argv[key];
                        break;
                }
            }
        });
        return responseFileContents;
    };
    /**
     * For options accepting relative paths: if the values are relative paths, resolves them to full paths using the
     * response file path. This is needed to support offline installation.
     */
    CommandLineParser.prototype.resolveRelativePaths = function (argv, responseFilePath) {
        var _this = this;
        requires.notNullOrUndefined(argv, "argv");
        requires.stringNotEmpty(responseFilePath, "responseFilePath");
        // Quick check to see if the arguments set contains any arguments that can support relative paths with values.
        var supportRelativePathOptions = this._supportedOptions.filter(function (option) {
            return option.supportRelativePath && argv[option.name];
        });
        if (supportRelativePathOptions.length <= 0) {
            return argv;
        }
        var directoryPath = path.dirname(responseFilePath);
        supportRelativePathOptions.forEach(function (option) { return _this.resolveRelativePath(argv, option.name, directoryPath); });
        return argv;
    };
    /**
     * If the given option value is a relative path, resolves it to full path using the given directory path.
     */
    CommandLineParser.prototype.resolveRelativePath = function (argv, optionName, directoryPath) {
        var _this = this;
        requires.notNullOrUndefined(argv, "argv");
        requires.stringNotEmpty(directoryPath, "directoryPath");
        // Some values may be multiInstance
        var optionValue = argv[optionName];
        if (Array.isArray(optionValue)) {
            argv[optionName] = optionValue.map(function (value) { return _this.getAbsolutePath(value, directoryPath); });
        }
        else {
            argv[optionName] = this.getAbsolutePath(optionValue, directoryPath);
        }
    };
    /**
     * If value is an absolute path, just return it.
     * Otherwise, resolve it relative to directoryPath.
     * @param value An absolute or relative path or URI
     * @param directoryPath The root path to resolve from, if needed.
     */
    CommandLineParser.prototype.getAbsolutePath = function (value, directoryPath) {
        requires.notNullOrUndefined(value, "value");
        requires.stringNotEmpty(directoryPath, "directoryPath");
        // If the argument value is already an URL with protocol (https:// or file://), no-op.
        var valueUrl = url.parse(value);
        if (valueUrl.protocol) {
            return value;
        }
        if (path.isAbsolute(value)) {
            return value;
        }
        return path.resolve(path.normalize(path.join(directoryPath, value)));
    };
    CommandLineParser.prototype.ensureArray = function (value) {
        if (value === undefined) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        return [value];
    };
    /**
     * Evaluates the parsed arguments for error conditions.  If an error is detected,
     * a message is written to process.stderr and the process terminates.
     */
    CommandLineParser.prototype.emitErrors = function (argv) {
        var _this = this;
        // for options that require values, make sure the value is present
        var optionsRequiringArgs = this._supportedOptions.filter(function (option) { return option.options.requiresArg; });
        optionsRequiringArgs.forEach(function (option) {
            if (argv[option.name] === "") {
                _this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.missingOptionValue(option.name));
            }
        });
        // if we got a command, make sure we have the required parameters
        var command = argv[CommandLine_1.CommandNames.propertyName];
        if (command) {
            var hasChannelIdAndProductId = argv[CommandLine_1.OptionNames.channelId] && argv[CommandLine_1.OptionNames.productId];
            switch (command) {
                case CommandLine_1.CommandNames.install:
                    // for the install command, make sure we also get --channelId and --productId
                    if (!hasChannelIdAndProductId) {
                        this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.installRequiresChannelIdAndProductId);
                    }
                    // if we got --nickname, make sure the nickname isn't too long
                    var nickname = argv[CommandLine_1.OptionNames.nickname];
                    if (nickname) {
                        if (!nickname_utilities_1.isValidNickname(nickname)) {
                            this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.invalidNicknameVerbose(nickname));
                        }
                        if (nickname.length > nickname_utilities_1.MAX_NICKNAME_LENGTH) {
                            this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.nicknameTooLong(nickname_utilities_1.MAX_NICKNAME_LENGTH));
                        }
                    }
                    break;
                case CommandLine_1.CommandNames.resume:
                    // for the resume command, it only needs --installPath
                    if (!argv[CommandLine_1.OptionNames.installPath]) {
                        this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.commandRequiresInstallPath(command));
                    }
                    break;
                // for other commands, we need either --installPath or --channelId/--productId
                case CommandLine_1.CommandNames.modify:
                case CommandLine_1.CommandNames.update:
                case CommandLine_1.CommandNames.repair:
                case CommandLine_1.CommandNames.uninstall:
                    if (!argv[CommandLine_1.OptionNames.installPath] && !hasChannelIdAndProductId) {
                        this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.commandRequiresInstallPathOrChannelIdAndProductId(command));
                    }
                    break;
            }
        }
        // if we got --installChannelUri, make sure we also got --channelUri
        if (argv[CommandLine_1.OptionNames.installChannelUri] && (argv[CommandLine_1.OptionNames.channelUri] === undefined)) {
            this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.installChannelUriRequiresChannelUri);
        }
        // If --channelUri was specified without an argument, its value will be "".  We can only accept
        // this if --installChannelUri was also specified.  In that case we'll convert it to null.
        if (argv[CommandLine_1.OptionNames.channelUri] === "") {
            if (argv[CommandLine_1.OptionNames.installChannelUri]) {
                argv[CommandLine_1.OptionNames.channelUri] = null;
            }
            else {
                this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.channelUriRequiresArgument);
            }
        }
        // make sure we don't have any conflicting args
        var optionsWithExclusions = this._supportedOptions.filter(function (option) { return !!option.excludes; });
        optionsWithExclusions.forEach(function (option) {
            // if the option wasn't specified, there's nothing to do
            if (!isSpecified(option)) {
                return;
            }
            option.excludes.forEach(function (excludedOptionName) {
                var excludedOption = _this.findOption(excludedOptionName);
                if (isSpecified(excludedOption)) {
                    _this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.optionsAreMutuallyExclusive(option.name, excludedOptionName));
                }
            });
            function isSpecified(opt) {
                if (!opt) {
                    return false;
                }
                var value = argv[opt.name];
                if (!value) {
                    return false;
                }
                // for --add and --remove, if they aren't specified value will be an empty array
                if (Array.isArray(value) && (value.length === 0)) {
                    return false;
                }
                return true;
            }
        });
        // for options that imply others, make sure the implied option is also present
        var optionsWithImplications = this._supportedOptions.filter(function (option) { return !!option.implies; });
        optionsWithImplications.forEach(function (option) {
            if (argv[option.name] && (argv[option.implies] === undefined)) {
                _this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.parameterRequiresAnotherParameter(option.name, option.implies));
            }
        });
        // make sure we didn't get multiple instances of single-instance options
        this._supportedOptions.forEach(function (option) {
            if (!option.multiInstance) {
                _this.validateSingleInstanceOption(argv, option.name);
            }
        });
        // make sure boolean properties have boolean values
        var booleanOptions = this._supportedOptions.filter(function (option) { return !option.options.requiresArg && (option.options.type !== "string"); });
        booleanOptions.forEach(function (option) {
            var value = argv[option.name];
            var type = typeof value;
            if ((type !== "boolean") && (type !== "undefined")) {
                _this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.parameterCannotHaveAValue(option.name, value));
            }
        });
    };
    /**
     * Evaluates the parsed arguments for conditions that should result in warnings.
     * If such a condition is detected, a message is written to process.stdout.
     */
    CommandLineParser.prototype.emitWarnings = function (argv) {
        var _this = this;
        // see if we got arguments that are ignored for the given command
        var command = argv[CommandLine_1.CommandNames.propertyName];
        if (command) {
            var descriptor = this.findCommand(command);
            for (var i = 0; i < descriptor.ignoredOptions.length; i++) {
                var ignoredOption = descriptor.ignoredOptions[i];
                if (argv[ignoredOption]) {
                    // if this an array but the array is empty, don't warn
                    if (Array.isArray(argv[ignoredOption]) && (argv[ignoredOption].length === 0)) {
                        continue;
                    }
                    this.emitWarning(ResourceStrings_1.ResourceStrings.ignoredOptionForCommand(command, ignoredOption));
                }
            }
            // special case:  for commands other than install, if we got --installPath then we ignore
            // --channelId and --productId
            if ((command !== CommandLine_1.CommandNames.install) && argv[CommandLine_1.OptionNames.installPath]) {
                var optionsToIgnore = [
                    CommandLine_1.OptionNames.channelId,
                    CommandLine_1.OptionNames.productId
                ];
                optionsToIgnore.forEach(function (optionToIgnore) {
                    if (argv[optionToIgnore]) {
                        var message = ResourceStrings_1.ResourceStrings.ignoredOptionForCommandWithInstallPath(command, optionToIgnore);
                        _this.emitWarning(message);
                    }
                });
            }
        }
        // see if we got "--norestart" without "--passive" or "--quiet"
        var argvAsAny = argv;
        if (argvAsAny.norestart && !(argvAsAny.passive || argvAsAny.quiet)) {
            argvAsAny.norestart = false;
            this.emitWarning(ResourceStrings_1.ResourceStrings.noRestartOptionIgnored);
        }
    };
    /**
     * Creates a yargs parser for the installer command line
     */
    CommandLineParser.prototype.createParser = function (errorHandlerFactory) {
        var _this = this;
        var parser = yargs
            .usage("Usage: $0 [command [options]]")
            .fail(function (message) {
            var errorHandler = errorHandlerFactory.createErrorHandler(parser, _this._logger, _this._showDialogOnError);
            errorHandler.emitError(message);
            // this.onParseFailed(parser, message);
        });
        // define the commands
        for (var i = 0; i < this._supportedCommands.length; i++) {
            var descriptor = this._supportedCommands[i];
            // yargs documentation specifies that setting the description of a command to
            // false hides that command from the help output. And they strict check for the
            // value false, not falsey.  However the available typings insist that description
            // must be a string. Thus the "false as any"
            // https://github.com/yargs/yargs#commandmodule
            // https://github.com/yargs/yargs/blob/master/lib/command.js#L24
            parser.command(descriptor.command, (descriptor.hidden ? false : descriptor.description));
        }
        // define the options
        for (var i = 0; i < this._supportedOptions.length; i++) {
            var descriptor = this._supportedOptions[i];
            parser.option(descriptor.name, descriptor.options);
        }
        return parser;
    };
    CommandLineParser.prototype.validateSingleInstanceOption = function (argv, option) {
        if (argv[option]) {
            var optType = typeof (argv[option]);
            optType = optType.toLowerCase();
            if ((optType === "array") || (optType === "object")) {
                this._errorHandler.emitError(ResourceStrings_1.ResourceStrings.multipleInstancesOfASingleInstanceParameter(option));
            }
        }
    };
    CommandLineParser.prototype.findCommand = function (command) {
        return this._supportedCommands.find(function (desc) { return string_utilities_1.caseInsensitiveAreEqual(desc.command, command); });
    };
    CommandLineParser.prototype.findOption = function (option) {
        return this._supportedOptions.find(function (desc) { return string_utilities_1.caseInsensitiveAreEqual(desc.name, option); });
    };
    Object.defineProperty(CommandLineParser.prototype, "multiInstanceOptions", {
        get: function () {
            return this._supportedOptions.filter(function (desc) { return desc.multiInstance; });
        },
        enumerable: true,
        configurable: true
    });
    CommandLineParser.prototype.emitWarning = function (message) {
        this._logger.writeWarning("" + ResourceStrings_1.ResourceStrings.warningMessagePrefix + message);
    };
    return CommandLineParser;
}());
exports.CommandLineParser = CommandLineParser;
//# sourceMappingURL=CommandLineParser.js.map