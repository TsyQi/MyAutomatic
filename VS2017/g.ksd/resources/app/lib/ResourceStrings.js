/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nls = require("vscode-nls");
var locale_handler_1 = require("./locale-handler");
var uiLocale;
var localize = nls.config({ locale: "en", cacheLanguageResolution: false })(__filename);
/* istanbul ignore next */
var ResourceStrings = /** @class */ (function () {
    function ResourceStrings() {
    }
    ResourceStrings.uiLocale = function () {
        return uiLocale || "en";
    };
    ResourceStrings.config = function (locale, cache) {
        if (cache === void 0) { cache = false; }
        uiLocale = locale;
        localize = nls.config({ locale: locale, cacheLanguageResolution: cache })(__filename);
        locale_handler_1.LocaleHandler.init();
    };
    Object.defineProperty(ResourceStrings, "uninstallWarningTitle", {
        get: function () {
            return localize(0, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "uninstallWarningMessage", {
        get: function () {
            return localize(1, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "repairWarningTitle", {
        get: function () {
            return localize(2, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "repairWarningMessage", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(3, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "clickOKToContinueMessage", {
        /* tslint:enable */
        get: function () {
            return localize(4, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "appWindowTitle", {
        get: function () {
            return localize(5, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "appUninstallWindowTitle", {
        get: function () {
            return localize(6, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "exit", {
        get: function () {
            return localize(7, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "notNow", {
        get: function () {
            return localize(8, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "update", {
        get: function () {
            return localize(9, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "modify", {
        get: function () {
            return localize(10, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "retry", {
        get: function () {
            return localize(11, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "remove", {
        get: function () {
            return localize(12, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.removingChannel = function (channel) {
        return localize(13, null, channel);
    };
    Object.defineProperty(ResourceStrings, "rebootRequiredMessage", {
        get: function () {
            return localize(14, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.cannotRemoveChannelMessage = function (channel) {
        return localize(15, null, channel);
    };
    Object.defineProperty(ResourceStrings, "restart", {
        get: function () {
            return localize(16, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "launch", {
        get: function () {
            return localize(17, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "install", {
        get: function () {
            return localize(18, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "installed", {
        get: function () {
            return localize(19, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "loadingProblems", {
        get: function () {
            return localize(20, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "popularSolutions", {
        get: function () {
            return localize(21, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "reportOrUpVoteProblem", {
        get: function () {
            return localize(22, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "verifiedSolution", {
        get: function () {
            return localize(23, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "viewLog", {
        get: function () {
            return localize(24, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "viewProblems", {
        get: function () {
            return localize(25, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "openLog", {
        get: function () {
            return localize(26, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "selectProblem", {
        get: function () {
            return localize(27, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.failedToOpenLog = function (path) {
        return localize(28, null, path);
    };
    ResourceStrings.failedPackageActionWithId = function (action, packageId) {
        return localize(29, null, action, packageId);
    };
    Object.defineProperty(ResourceStrings, "checkingForSolutions", {
        get: function () {
            return localize(30, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "somethingWentWrong", {
        get: function () {
            return localize(31, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "doNotEdit", {
        get: function () {
            return localize(32, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "describeIssue", {
        get: function () {
            return localize(33, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "updateAvailable", {
        get: function () {
            return localize(34, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "updateNotAvailable", {
        get: function () {
            return localize(35, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "cannotPerformOperationWhileInstalling", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(36, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "pleaseWaitUntilOperationFinished", {
        /* tslint:enable */
        get: function () {
            return localize(37, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "location", {
        get: function () {
            return localize(38, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "moreInformation", {
        get: function () {
            return localize(39, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "moreTroubleshootingTips", {
        get: function () {
            return localize(40, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "getSupport", {
        get: function () {
            return localize(41, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "getTroubleshootingTips", {
        get: function () {
            return localize(42, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "informationRelease", {
        get: function () {
            return localize(43, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "releaseNotes", {
        get: function () {
            return localize(44, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "repair", {
        get: function () {
            return localize(45, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "netRequired", {
        get: function () {
            return localize(46, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "additionalDependenciesInformation", {
        get: function () {
            return localize(47, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "additionalDependenciesInstalled", {
        get: function () {
            return localize(48, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "finishing", {
        get: function () {
            return localize(49, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "statusSetupFailError", {
        get: function () {
            return localize(50, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "statusSetupComplete", {
        get: function () {
            return localize(51, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "statusSetupFailDetails", {
        get: function () {
            return localize(52, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "statusSetupFailDetails2", {
        get: function () {
            return localize(53, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "statusCriticalError", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(54, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "statusNetworkError", {
        /* tslint:enable */
        get: function () {
            return localize(55, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "checkBackForUpdates", {
        get: function () {
            return localize(56, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "waitForLoadProducts", {
        get: function () {
            return localize(57, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "failedToLoadProducts", {
        get: function () {
            return localize(58, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "removeVS", {
        get: function () {
            return localize(59, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.componentUpdateAvailable = function (itemName) {
        return localize(60, null, itemName);
    };
    ResourceStrings.installSize = function (installSize) {
        return localize(61, null, installSize);
    };
    ResourceStrings.totalInstallSize = function (installSize) {
        return localize(62, null, installSize);
    };
    ResourceStrings.installSizeEstimated = function (installSize) {
        return localize(63, null, installSize);
    };
    Object.defineProperty(ResourceStrings, "availableHeader", {
        get: function () {
            return localize(64, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "downloadingInstallerUpdate", {
        get: function () {
            return localize(65, null, ResourceStrings.appWindowTitle);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "installerUpdateRequired", {
        get: function () {
            return localize(66, null, ResourceStrings.appWindowTitle);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "installerUpdateDownloadFailed", {
        get: function () {
            return localize(67, null, ResourceStrings.appWindowTitle);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.installItem = function (appName) {
        return localize(68, null, appName);
    };
    ResourceStrings.modifyItem = function (appName) {
        return localize(69, null, appName);
    };
    ResourceStrings.maximizeOrRestoreButtonTitle = function (isMaximized) {
        if (isMaximized) {
            return localize(70, null);
        }
        return localize(71, null);
    };
    Object.defineProperty(ResourceStrings, "selectAll", {
        get: function () {
            return localize(72, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "notConnected", {
        get: function () {
            return localize(73, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.installerRunning = function (appName) {
        return localize(74, null, appName);
    };
    ResourceStrings.errorUninstalling = function (appName) {
        return localize(75, null, appName);
    };
    Object.defineProperty(ResourceStrings, "reportProblem", {
        get: function () {
            return localize(76, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "provideSuggestion", {
        get: function () {
            return localize(77, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "browse", {
        get: function () {
            return localize(78, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "directoryPlaceholder", {
        get: function () {
            return localize(79, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "dialogName", {
        get: function () {
            return localize(80, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "textAreaName", {
        get: function () {
            return localize(81, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "textAreaPlaceHolder", {
        get: function () {
            return localize(82, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "emailPlaceHolder", {
        get: function () {
            return localize(83, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "privacyLinkText", {
        get: function () {
            return localize(84, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "send", {
        get: function () {
            return localize(85, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "vsIsRunning", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(86, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "installInvalidSignature", {
        /* tslint:enable */
        get: function () {
            return localize(87, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "uninstallDirectoryIsNotEmpty", {
        get: function () {
            return localize(88, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "setupOperationFailed", {
        get: function () {
            return localize(89, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "launchFailed", {
        get: function () {
            return localize(90, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.pathExceedsMaxLength = function (pathLen) {
        return localize(91, null, pathLen);
    };
    Object.defineProperty(ResourceStrings, "uninstall", {
        get: function () {
            return localize(92, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "continue", {
        get: function () {
            return localize(93, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "abort", {
        get: function () {
            return localize(94, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "ok", {
        get: function () {
            return localize(95, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "ignore", {
        get: function () {
            return localize(96, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "cancel", {
        get: function () {
            return localize(97, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "yes", {
        get: function () {
            return localize(98, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "no", {
        get: function () {
            return localize(99, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "dontShowAgain", {
        get: function () {
            return localize(100, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.pausing = function (appName) {
        return localize(101, null, appName);
    };
    ResourceStrings.uninstalling = function (appName) {
        return localize(102, null, appName);
    };
    ResourceStrings.installing = function (appName) {
        return localize(103, null, appName);
    };
    ResourceStrings.updating = function (appName) {
        return localize(104, null, appName);
    };
    ResourceStrings.repairing = function (appName) {
        return localize(105, null, appName);
    };
    ResourceStrings.modifying = function (appName) {
        return localize(106, null, appName);
    };
    ResourceStrings.uninstallFinished = function (appName) {
        return localize(107, null, appName);
    };
    ResourceStrings.installFinished = function (appName) {
        return localize(108, null, appName);
    };
    ResourceStrings.updateFinished = function (appName) {
        return localize(109, null, appName);
    };
    ResourceStrings.repairFinished = function (appName) {
        return localize(110, null, appName);
    };
    ResourceStrings.modifyFinished = function (appName) {
        return localize(111, null, appName);
    };
    ResourceStrings.detailsPageTitleInstalling = function (appName, buildVersion) {
        return localize(112, null, appName, buildVersion);
    };
    ResourceStrings.detailsPageTitleModifying = function (appName, buildVersion) {
        return localize(113, null, appName, buildVersion);
    };
    Object.defineProperty(ResourceStrings, "workloadsHeader", {
        get: function () {
            return localize(114, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "individualComponentsHeader", {
        get: function () {
            return localize(115, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "languagePacksHeader", {
        get: function () {
            return localize(116, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "summary", {
        get: function () {
            return localize(117, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "errorMessagePrefix", {
        get: function () {
            return localize(118, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "messagebusPrefix", {
        get: function () {
            return localize(119, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "warningMessagePrefix", {
        get: function () {
            return localize(120, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "MidInstallDownloadWarningMessagePrefix", {
        get: function () {
            return localize(121, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "MidInstallInstallWarningMessagePrefix", {
        get: function () {
            return localize(122, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "atMostOneCommandParameter", {
        get: function () {
            return localize(123, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "installChannelUriRequiresChannelUri", {
        get: function () {
            return localize(124, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "channelUriRequiresArgument", {
        get: function () {
            return localize(125, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.optionsAreMutuallyExclusive = function (command, otherCommand) {
        return localize(126, null, command, otherCommand);
    };
    ResourceStrings.parameterRequiresAnotherParameter = function (requiring, required) {
        return localize(127, null, requiring, required);
    };
    ResourceStrings.parameterCannotHaveAValue = function (name, value) {
        return localize(128, null, name, value);
    };
    ResourceStrings.multipleInstancesOfASingleInstanceParameter = function (command) {
        return localize(129, null, command);
    };
    ResourceStrings.unrecognizedOption = function (command) {
        return localize(130, null, command);
    };
    ResourceStrings.unrecognizedOptionInResponseFile = function (command) {
        return localize(131, null, command);
    };
    ResourceStrings.missingOptionValue = function (command) {
        return localize(132, null, command);
    };
    ResourceStrings.unsupportedOptionInResponseFile = function (command) {
        return localize(133, null, command);
    };
    ResourceStrings.ignoredOptionForCommand = function (command, option) {
        return localize(134, null, option, command);
    };
    ResourceStrings.ignoredOptionForCommandWithInstallPath = function (command, option) {
        return localize(135, null, option, command);
    };
    Object.defineProperty(ResourceStrings, "noRestartOptionIgnored", {
        get: function () {
            return localize(136, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "removingRequiredComponentsTitle", {
        get: function () {
            return localize(137, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "removingRequiredComponents", {
        get: function () {
            return localize(138, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "removingRequiredWorkloadTitle", {
        get: function () {
            return localize(139, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "removingRequiredWorkload", {
        get: function () {
            return localize(140, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "continueToRemoveComponent", {
        get: function () {
            return localize(141, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "noMatchingProduct", {
        get: function () {
            return localize(142, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "noMatchingInstalledProduct", {
        get: function () {
            return localize(143, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.formatParameter = function (name, value) {
        return localize(144, null, name, value);
    };
    Object.defineProperty(ResourceStrings, "licenseLinkText", {
        get: function () {
            return localize(145, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "uncategorized", {
        get: function () {
            return localize(146, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "accept", {
        get: function () {
            return localize(147, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "viewLicenseTermsLinkText", {
        get: function () {
            return localize(148, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "licenseAcceptanceDisclaimer", {
        get: function () {
            /* tslint:disable */
            return localize(149, null);
            /* tslint:enable */
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "nicknameLabelText", {
        get: function () {
            return localize(150, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.invalidProductKeyError = function (productKey) {
        return localize(151, null, productKey);
    };
    /* tslint:disable:max-line-length */
    ResourceStrings.summaryPaneLicenseTextFormatted = function (licenseTermsClass, thirdPartyNoticesClass) {
        return localize(152, null, licenseTermsClass, thirdPartyNoticesClass);
    };
    Object.defineProperty(ResourceStrings, "summaryPaneLicensePlainText", {
        get: function () {
            return localize(153, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "downloadAndLicenseTermsHeader", {
        /* tslint:enable */
        get: function () {
            return localize(154, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "closeBanner", {
        get: function () {
            return localize(155, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "closeButtonTitle", {
        get: function () {
            return localize(156, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "minimizeButtonTitle", {
        get: function () {
            return localize(157, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "optionsMenuTitle", {
        get: function () {
            return localize(158, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "provideFeedbackMenuTitle", {
        get: function () {
            return localize(159, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "componentsIncludedAriaText", {
        get: function () {
            return localize(160, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "optionalComponentsAriaText", {
        get: function () {
            return localize(161, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "optionalHeader", {
        get: function () {
            return localize(162, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "includedHeader", {
        get: function () {
            return localize(163, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "rebootRequiredTitle", {
        get: function () {
            return localize(164, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.postInstallRebootMessage = function (productName) {
        return localize(165, null, productName);
    };
    Object.defineProperty(ResourceStrings, "workloadUnavailable", {
        get: function () {
            return localize(166, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "workloadUnavailbleReasons", {
        get: function () {
            return localize(167, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.invalidChannelId = function (id) {
        return localize(168, null, id);
    };
    ResourceStrings.invalidProductId = function (id) {
        return localize(169, null, id);
    };
    Object.defineProperty(ResourceStrings, "installRequiresChannelIdAndProductId", {
        get: function () {
            return localize(170, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.commandRequiresInstallPathOrChannelIdAndProductId = function (command) {
        return localize(171, null, command);
    };
    ResourceStrings.commandRequiresInstallPath = function (command) {
        return localize(172, null, command);
    };
    ResourceStrings.asPercentage = function (percentage) {
        return localize(173, null, percentage);
    };
    Object.defineProperty(ResourceStrings, "pleaseWait", {
        get: function () {
            return localize(174, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.unsupportedOptionOnCommandLine = function (option) {
        return localize(175, null, option);
    };
    ResourceStrings.unsupportedCommandOnCommandLine = function (command) {
        return localize(176, null, command);
    };
    Object.defineProperty(ResourceStrings, "chineseSimplified", {
        get: function () {
            return localize(177, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "chineseTraditional", {
        get: function () {
            return localize(178, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "czech", {
        get: function () {
            return localize(179, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "german", {
        get: function () {
            return localize(180, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "english", {
        get: function () {
            return localize(181, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "spanish", {
        get: function () {
            return localize(182, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "french", {
        get: function () {
            return localize(183, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "italian", {
        get: function () {
            return localize(184, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "japanese", {
        get: function () {
            return localize(185, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "korean", {
        get: function () {
            return localize(186, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "polish", {
        get: function () {
            return localize(187, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "portugueseBrazil", {
        get: function () {
            return localize(188, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "russian", {
        get: function () {
            return localize(189, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "turkish", {
        get: function () {
            return localize(190, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "chooseYourLanguagePack", {
        get: function () {
            return localize(191, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "learnTabName", {
        get: function () {
            return localize(192, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "productsTabName", {
        get: function () {
            return localize(193, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "customizeInstall", {
        get: function () {
            return localize(194, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "featureNotAvailableOffline", {
        get: function () {
            return localize(195, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "specifyHelpToViewOptions", {
        get: function () {
            return localize(196, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "focusUiReason", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(197, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "focusUiReason_install", {
        get: function () {
            return localize(198, null);
        },
        enumerable: true,
        configurable: true
    });
    /* tslint:enable */
    ResourceStrings.removeChannel = function (channel) {
        return localize(199, null, channel);
    };
    Object.defineProperty(ResourceStrings, "welcomeTitle", {
        get: function () {
            return localize(200, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "welcomeBody", {
        /* tslint:disable:max-line-length */
        get: function () {
            var unescapedText = localize(201, null);
            // Workaround for https://github.com/Microsoft/vscode-nls-dev/issues/5
            // The '\' is getting escaped, causing it to show up in the UI.
            var stripRegex = /\\\r\n/g;
            if (!stripRegex.test(unescapedText)) {
                stripRegex = /\\\n/g;
            }
            return unescapedText.replace(stripRegex, "\n");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "focusedWindowCompleted", {
        /* tslint:enable */
        get: function () {
            return localize(202, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.kilobyte = function (size) {
        return localize(203, null, size);
    };
    ResourceStrings.megabyte = function (size) {
        return localize(204, null, size);
    };
    ResourceStrings.gigabyte = function (size) {
        return localize(205, null, size);
    };
    ResourceStrings.terabyte = function (size) {
        return localize(206, null, size);
    };
    ResourceStrings.processIsRunningError = function (process) {
        return localize(207, null, process);
    };
    Object.defineProperty(ResourceStrings, "partialProductErrorText", {
        get: function () {
            return localize(208, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "setupCompletedWithWarnings", {
        get: function () {
            return localize(209, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "setupFailedText", {
        get: function () {
            return localize(210, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.clickToUpdateProduct = function (updateButtonText, latestVersion) {
        return localize(211, null, updateButtonText, latestVersion);
    };
    ResourceStrings.productIsAlreadyInstalled = function (productName) {
        return localize(212, null, productName);
    };
    Object.defineProperty(ResourceStrings, "uninstallPreviewTitle", {
        get: function () {
            return localize(213, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "uninstallPreviewMessage", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(214, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "uninstallPreview", {
        /* tslint:enable */
        get: function () {
            return localize(215, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "elevationRequiredTitle", {
        get: function () {
            return localize(216, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "elevationRequiredMessage", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(217, null);
        },
        enumerable: true,
        configurable: true
    });
    /* tslint:enable */
    ResourceStrings.unableToUpdateTitle = function (productName) {
        return localize(218, null, productName);
    };
    Object.defineProperty(ResourceStrings, "installationOperationIsRunning", {
        get: function () {
            return localize(219, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "installationSucceeded", {
        get: function () {
            return localize(220, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "installerServiceIsDisposed", {
        get: function () {
            return localize(221, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.defaultDialogButtonDescription = function (buttonText) {
        return localize(222, null, buttonText);
    };
    ResourceStrings.updateTo = function (version) {
        return localize(223, null, version);
    };
    Object.defineProperty(ResourceStrings, "acquiringPackageMessage", {
        get: function () {
            return localize(224, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.applyingPackageMessage = function (packageName) {
        return localize(225, null, packageName);
    };
    ResourceStrings.uninstallingPackageMessage = function (packageName) {
        return localize(226, null, packageName);
    };
    ResourceStrings.waitingForPackageMessage = function (packageName) {
        return localize(227, null, packageName);
    };
    Object.defineProperty(ResourceStrings, "pausingOperation", {
        get: function () {
            return localize(228, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "startingOperation", {
        get: function () {
            return localize(229, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "finishedAcquiringPackages", {
        get: function () {
            return localize(230, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "downloadsStopped", {
        get: function () {
            return localize(231, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.appliedProgressLabel = function (percent) {
        return localize(232, null, percent);
    };
    ResourceStrings.acquiredProgressLabel = function (percent) {
        return localize(233, null, percent);
    };
    ResourceStrings.downloadProgressWithRate = function (percent) {
        return localize(234, null, percent);
    };
    ResourceStrings.installProgressWithRate = function (percent) {
        return localize(235, null, percent);
    };
    ResourceStrings.uninstalledProgressLabel = function (percent) {
        return localize(236, null, percent);
    };
    Object.defineProperty(ResourceStrings, "invalidNickname", {
        get: function () {
            return localize(237, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.invalidNicknameVerbose = function (nickname) {
        return localize(238, null, nickname);
    };
    Object.defineProperty(ResourceStrings, "nicknameRequired", {
        get: function () {
            return localize(239, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "updateRequiresReselectingPackages", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(240, null);
        },
        enumerable: true,
        configurable: true
    });
    /* tslint:enable */
    ResourceStrings.nicknameNotUnique = function (nickname) {
        return localize(241, null, nickname);
    };
    ResourceStrings.productWithNicknameTitle = function (productName, nickname) {
        return localize(242, null, productName, nickname);
    };
    ResourceStrings.productWithSuffixTitle = function (productName, suffix) {
        return localize(243, null, productName, suffix);
    };
    ResourceStrings.productNameWithVersionTitle = function (productName, version) {
        return localize(244, null, productName, version);
    };
    /* tslint:disable:max-line-length */
    ResourceStrings.removeChannelPrompt = function (channel) {
        return localize(245, null, channel);
    };
    /* tslint:enable */
    ResourceStrings.nicknameTooLong = function (maxLength) {
        return localize(246, null, maxLength);
    };
    ResourceStrings.listItemNameAndPosition = function (name, position, size) {
        return localize(247, null, name, position, size);
    };
    Object.defineProperty(ResourceStrings, "selectALanguagePack", {
        get: function () {
            return localize(248, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "startNow", {
        get: function () {
            return localize(249, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "gettingThingsReady", {
        get: function () {
            return localize(250, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "almostThere", {
        get: function () {
            return localize(251, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "takingLongerThanExpected", {
        get: function () {
            return localize(252, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.systemDriveInstallSize = function (driveName, installSizeText) {
        return localize(253, null, driveName, installSizeText);
    };
    ResourceStrings.targetDriveInstallSize = function (driveName, installSizeText) {
        return localize(254, null, driveName, installSizeText);
    };
    ResourceStrings.sharedDriveInstallSize = function (driveName, installSizeText) {
        return localize(255, null, driveName, installSizeText);
    };
    ResourceStrings.notEnoughDiskSpaceWarningText = function (driveName) {
        return localize(256, null, driveName);
    };
    Object.defineProperty(ResourceStrings, "surveyPromptTitle", {
        get: function () {
            return localize(257, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "surveyPrompt", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(258, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "artifactSelectionWarningTitle", {
        /* tslint:enable:max-line-length */
        get: function () {
            return localize(259, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "invalidArtifactId", {
        get: function () {
            return localize(260, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "more", {
        get: function () {
            return localize(261, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.netInstallSizeToDrive = function (driveNameAndSize) {
        return localize(262, null, driveNameAndSize);
    };
    Object.defineProperty(ResourceStrings, "startAfterInstallation", {
        get: function () {
            return localize(263, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "recommendWorkloadSelectionTitle", {
        get: function () {
            return localize(264, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "recommendWorkloadSelectionMessage", {
        get: function () {
            return localize(265, 
            // tslint:disable-next-line:max-line-length
            null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "addWorkloads", {
        get: function () {
            return localize(266, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "recommendWorkloadSelectionLinkText", {
        get: function () {
            return localize(267, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "pleaseTellUsMore", {
        get: function () {
            return localize(268, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "duringInstallSurveyMessage", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(269, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "takeSurvey", {
        /* tslint:enable:max-line-length */
        get: function () {
            return localize(270, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "notInstallingVisualStudioSurveyMessage", {
        /* tslint:disable:max-line-length */
        get: function () {
            return localize(271, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "resume", {
        /* tslint:enable:max-line-length */
        get: function () {
            return localize(272, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "setupPausedWithIssues", {
        get: function () {
            return localize(273, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "setupPaused", {
        get: function () {
            return localize(274, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "pause", {
        get: function () {
            return localize(275, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "downloadCompleted", {
        get: function () {
            return localize(276, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "downloadHeader", {
        get: function () {
            return localize(277, null);
        },
        enumerable: true,
        configurable: true
    });
    ResourceStrings.rateMessage = function (current, total) {
        return localize(278, null, current, total);
    };
    ResourceStrings.speedRate = function (speedInKB) {
        return localize(279, null, speedInKB, ResourceStrings.perSecond);
    };
    Object.defineProperty(ResourceStrings, "perSecond", {
        get: function () {
            return localize(280, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "packageInstallHeader", {
        get: function () {
            return localize(281, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "packageInstallMessage", {
        get: function () {
            return localize(282, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "installBlockedByChannelOperation", {
        get: function () {
            return localize(283, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "genericErrorMessage", {
        get: function () {
            return localize(284, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "failedPackageActionInstall", {
        get: function () {
            return localize(285, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "failedPackageActionDownload", {
        get: function () {
            return localize(286, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "failedPackageActionRepair", {
        get: function () {
            return localize(287, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "failedPackageActionUninstall", {
        get: function () {
            return localize(288, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "failedPackageActionCache", {
        get: function () {
            return localize(289, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "failedPackageActionDefault", {
        get: function () {
            return localize(290, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "focusedUiLaunchPrompt", {
        // tslint:disable: max-line-length
        get: function () {
            return localize(291, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "underlyingStreamClosedPrompt", {
        // tslint:enable: max-line-length
        get: function () {
            return localize(292, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "GenericErrorPrompt", {
        // tslint:disable: max-line-length
        get: function () {
            return localize(293, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceStrings, "recommendedWorkloadCategory", {
        // tslint:enable: max-line-length
        get: function () {
            return localize(294, null);
        },
        enumerable: true,
        configurable: true
    });
    return ResourceStrings;
}());
exports.ResourceStrings = ResourceStrings;
//# sourceMappingURL=ResourceStrings.js.map