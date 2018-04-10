/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
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
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var error_message_response_1 = require("../interfaces/error-message-response");
var requires = require("../../lib/requires");
var Session_1 = require("../../lib/Session");
var error_dialog_button_1 = require("../interfaces/error-dialog-button");
var error_dialog_mode_1 = require("../interfaces/error-dialog-mode");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var open_log_failed_event_1 = require("../Events/open-log-failed-event");
var show_install_retry_event_1 = require("../Events/show-install-retry-event");
var telemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var error_names_1 = require("../../lib/error-names");
var dispatcher_1 = require("../dispatcher");
var installer_message_received_event_1 = require("../Events/installer-message-received-event");
var Product_1 = require("../../lib/Installer/Product");
var promise_completion_source_1 = require("../../lib/promise-completion-source");
var show_report_feedback_event_1 = require("../Events/show-report-feedback-event");
exports.TROUBLESHOOTING_KB_FWLINK = "https://go.microsoft.com/fwlink/?linkid=836350";
exports.PRECHECK_LINK = "https://go.microsoft.com/fwlink/?linkid=849619";
var ErrorStore = /** @class */ (function (_super) {
    __extends(ErrorStore, _super);
    function ErrorStore(telemetry, shell, logger) {
        var _this = _super.call(this) || this;
        _this._dismissBind = _this.dismissImpl.bind(_this);
        // a queue of pending error messages; element 0 is the one that is currently displayed
        _this._messages = [];
        _this._quiet = false;
        _this._eventHandlers = [
            { event: open_log_failed_event_1.OpenLogFailedEvent, callback: _this.onOpenLogFailed.bind(_this) },
            { event: show_install_retry_event_1.ShowInstallRetryEvent, callback: _this.onShowInstallRetry.bind(_this) },
            { event: show_report_feedback_event_1.ShowReportFeedbackEvent, callback: _this.onShowReportFeedbackEvent.bind(_this) },
        ];
        _this._telemetry = telemetry;
        _this._onInstallerMessageReceived = _this.onInstallerMessageReceived.bind(_this);
        _this._shell = shell;
        _this._logger = logger;
        dispatcher_1.dispatcher.register(installer_message_received_event_1.InstallerMessageReceivedEvent, _this._onInstallerMessageReceived);
        _this.registerHandlers();
        return _this;
    }
    ErrorStore.prototype.dispose = function () {
        this.unregisterHandlers();
        dispatcher_1.dispatcher.unregister(installer_message_received_event_1.InstallerMessageReceivedEvent, this._onInstallerMessageReceived);
    };
    Object.defineProperty(ErrorStore.prototype, "CHANGED_EVENT", {
        get: function () {
            return "CHANGED";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorStore.prototype, "isErrorVisible", {
        get: function () {
            return this._messages.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorStore.prototype, "isQuiet", {
        get: function () {
            return this._quiet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorStore.prototype, "dismiss", {
        /**
         * This is implemented as a getter to the bound
         * callback, otherwise *this* is bound to the wrong
         * thing. In the future, consider readonly property.
         */
        get: function () {
            return this._dismissBind;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorStore.prototype, "currentMessageData", {
        get: function () {
            return this._messages[0] || ErrorStore.nullMessage;
        },
        enumerable: true,
        configurable: true
    });
    ErrorStore.prototype.setErrorsToQuiet = function () {
        this._quiet = true;
    };
    /**
     * @returns {Promise<IErrorMessageResponse>} - details of how the error dialog was dismissed.
     */
    ErrorStore.prototype.show = function (options) {
        var _this = this;
        requires.notNullOrUndefined(options, "options");
        requires.notNullOrUndefined(options.message, "message");
        var messages = this.ensureStringArray(options.message);
        if (this._quiet) {
            return this._logger.writeError(messages.join("\n"))
                .catch()
                .then(function () {
                if (options.okButtonText === ResourceStrings_1.ResourceStrings.retry) {
                    return Promise.resolve({
                        buttonType: error_message_response_1.ButtonType.DEFAULT_CANCEL,
                        isOptedOut: false,
                        isQuiet: _this._quiet,
                    });
                }
                return Promise.resolve({
                    buttonType: error_message_response_1.ButtonType.DEFAULT_SUBMIT,
                    isOptedOut: false,
                    isQuiet: _this._quiet,
                });
            });
        }
        // Deep copy the buttons to a new array so they cannot
        // be mutated from outside.
        var buttons = [];
        if (Array.isArray(options.customButtons)) {
            options.customButtons.forEach(function (button) {
                buttons.push(Object.assign({}, button));
            });
        }
        var message = {
            errorTitle: options.title || "",
            errorMessages: messages,
            cancelable: !!options.allowCancel,
            allowOptOut: !!options.allowOptOut,
            onAcceptError: undefined,
            onResetError: undefined,
            errorLink: options.errorLink || ErrorStore.nullMessage.errorLink,
            okButtonText: options.okButtonText,
            cancelButtonText: options.cancelButtonText,
            optOutText: options.optOutText,
            isCancelDefault: options.isCancelDefault,
            hideSupportLink: options.hideSupportLink || false,
            hideOK: options.hideOK ? options.hideOK : false,
            errorId: Session_1.createSessionId(),
            buttons: buttons,
            dialogMode: this.dialogMode(options.hideOK, options.allowCancel, options.allowOptOut),
            promiseSource: new promise_completion_source_1.PromiseCompletionSource(),
        };
        message.onAcceptError = function (isOptedOut) {
            message.promiseSource.resolve({
                buttonType: error_message_response_1.ButtonType.DEFAULT_SUBMIT,
                isOptedOut: isOptedOut,
            });
        };
        message.onResetError = function (isOptedOut) {
            message.promiseSource.resolve({
                buttonType: error_message_response_1.ButtonType.DEFAULT_CANCEL,
                isOptedOut: isOptedOut,
            });
        };
        // add this message to the end of the queue
        this._messages.push(message);
        this.emit(this.CHANGED_EVENT);
        this._telemetry.sendIpcStartUserTask(telemetryEventNames.SHOW_ERROR_DIALOG, message.errorId, {
            errorName: options.errorName,
        });
        return message.promiseSource.promise;
    };
    ErrorStore.prototype.showOperationIsRunningError = function () {
        var error = {
            allowCancel: false,
            okButtonText: ResourceStrings_1.ResourceStrings.closeButtonTitle,
            message: ResourceStrings_1.ResourceStrings.installationOperationIsRunning,
            title: ResourceStrings_1.ResourceStrings.errorMessagePrefix,
            errorName: error_names_1.OPERATION_IS_RUNNING_ERROR_NAME,
        };
        this.show(error);
    };
    ErrorStore.prototype.removeCurrentMessage = function (ev, terminationFunctionSelector) {
        // remove the current message from the queue
        var message = this._messages.shift();
        if (message) {
            var optedOut = (ev && ev.detail) ? ev.detail.optedOut : undefined;
            // call the termination function, of one is supplied
            var terminationFunction = terminationFunctionSelector(message);
            if (terminationFunction) {
                // optedOut becomes the boolean returned by the show method's Promise<boolean>
                terminationFunction(optedOut);
            }
            this.emit(this.CHANGED_EVENT);
        }
    };
    ErrorStore.prototype.dismissImpl = function (ev) {
        var _this = this;
        this.removeCurrentMessage(ev, function (message) {
            return function (isOptedOut) {
                var buttonId = ev.detail.buttonId;
                if (buttonId === error_dialog_button_1.ButtonIds.DEFAULT_SUBMIT) {
                    _this.sendUserActionTelemetry(message, "accept", message.okButtonText);
                    return message.onAcceptError(isOptedOut);
                }
                else if (buttonId === error_dialog_button_1.ButtonIds.DEFAULT_CANCEL) {
                    _this.sendUserActionTelemetry(message, "reset", message.cancelable ? message.cancelButtonText : "No Cancel Button");
                    return message.onResetError(isOptedOut);
                }
                else {
                    var button = message.buttons.find(function (b) { return b.buttonId === buttonId; });
                    _this.sendUserActionTelemetry(message, buttonId, button.text);
                    return message.promiseSource.resolve({
                        buttonId: buttonId,
                        buttonType: error_message_response_1.ButtonType.CUSTOM,
                        isOptedOut: isOptedOut,
                    });
                }
            };
        });
    };
    ErrorStore.prototype.onInstallerMessageReceived = function (event) {
        var _this = this;
        var customButtons = event.customButtons.map(function (button) {
            return {
                text: button.text,
                buttonId: button.id,
            };
        });
        var options = {
            allowCancel: event.allowCancel,
            isCancelDefault: event.message.defaultResultType === Product_1.MessageResultTypes.Cancel,
            cancelButtonText: event.cancelButtonText,
            errorLink: {
                callback: function () { _this._shell.openExternal(exports.PRECHECK_LINK); },
                text: ResourceStrings_1.ResourceStrings.getTroubleshootingTips,
            },
            errorName: event.message.logString,
            message: event.message.localizedString,
            okButtonText: event.okButtonText,
            title: event.dialogTitle,
            hideOK: !event.okButtonText,
            hideSupportLink: true,
            customButtons: customButtons,
        };
        var promiseCompletionSource = event.promiseCompletionSource;
        this.show(options)
            .then(function (response) {
            switch (response.buttonType) {
                case error_message_response_1.ButtonType.DEFAULT_SUBMIT:
                    promiseCompletionSource.resolve(new Product_1.MessageResult(event.okButtonResponse));
                    break;
                case error_message_response_1.ButtonType.DEFAULT_CANCEL:
                    promiseCompletionSource.resolve(new Product_1.MessageResult(event.cancelButtonResponse));
                    break;
                default:
                    var customButton = event.customButtons.find(function (b) { return b.id === response.buttonId; });
                    if (!customButton) {
                        throw new Error("Unhandled buttonId: " + response.buttonId);
                    }
                    promiseCompletionSource.resolve(new Product_1.MessageResult(customButton.response));
            }
        })
            .catch(function (error) {
            // Send cancel on error
            promiseCompletionSource.resolve(new Product_1.MessageResult(event.cancelButtonResponse));
        });
    };
    ErrorStore.prototype.onOpenLogFailed = function (event) {
        var options = {
            errorName: error_names_1.OPEN_LOG_FAILED,
            message: ResourceStrings_1.ResourceStrings.failedToOpenLog(event.path),
        };
        this.show(options);
    };
    ErrorStore.prototype.onShowInstallRetry = function (event) {
        var options = {
            errorName: event.neutralMessage,
            message: event.message,
            okButtonText: ResourceStrings_1.ResourceStrings.retry,
            cancelButtonText: ResourceStrings_1.ResourceStrings.cancel,
            allowCancel: true,
            customButtons: [],
        };
        this.show(options)
            .then(function (result) {
            if (result.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                event.retryAction();
            }
        });
    };
    ErrorStore.prototype.onShowReportFeedbackEvent = function (event) {
        var options = {
            title: ResourceStrings_1.ResourceStrings.setupFailedText,
            errorName: event.neutralMessage,
            message: event.message,
            okButtonText: ResourceStrings_1.ResourceStrings.provideFeedbackMenuTitle,
            cancelButtonText: ResourceStrings_1.ResourceStrings.cancel,
            allowCancel: true,
        };
        this.show(options)
            .then(function (result) {
            if (result.buttonType === error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                event.launchFeedbackClientAction();
            }
        });
    };
    ErrorStore.prototype.ensureStringArray = function (value) {
        if (value === undefined || value === null) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        return [value.toString()];
    };
    /**
     * Ends the user task that is started in the show() method.
     */
    ErrorStore.prototype.sendUserActionTelemetry = function (message, userAction, buttonText, result) {
        if (result === void 0) { result = vs_telemetry_api_1.TelemetryResult.Success; }
        this._telemetry.sendIpcEndUserTask(telemetryEventNames.SHOW_ERROR_DIALOG, message.errorId, {
            userAction: userAction,
            buttonName: buttonText,
        }, result);
    };
    ErrorStore.prototype.registerHandlers = function () {
        this._eventHandlers.forEach(function (descriptor) {
            dispatcher_1.dispatcher.register(descriptor.event, descriptor.callback);
        });
    };
    ErrorStore.prototype.unregisterHandlers = function () {
        this._eventHandlers.forEach(function (descriptor) {
            dispatcher_1.dispatcher.unregister(descriptor.event, descriptor.callback);
        });
    };
    ErrorStore.prototype.dialogMode = function (hideOk, cancelable, allowOptOut) {
        var mode = !hideOk ? error_dialog_mode_1.ErrorDialogMode.OK : error_dialog_mode_1.ErrorDialogMode.None;
        // tslint:disable:no-bitwise
        if (cancelable) {
            mode |= error_dialog_mode_1.ErrorDialogMode.Cancel;
        }
        if (allowOptOut) {
            mode |= error_dialog_mode_1.ErrorDialogMode.OptOut;
        }
        // tslint:endable:no-bitwise
        return mode;
    };
    ErrorStore.nullMessage = {
        errorTitle: undefined,
        errorMessages: [],
        cancelable: false,
        allowOptOut: false,
        onAcceptError: undefined,
        onResetError: undefined,
        errorLink: {
            text: undefined,
            callback: undefined
        },
        okButtonText: undefined,
        cancelButtonText: undefined,
        optOutText: undefined,
        isCancelDefault: false,
        hideSupportLink: false,
        hideOK: false,
        errorId: undefined,
        buttons: [],
        promiseSource: new promise_completion_source_1.PromiseCompletionSource(),
        dialogMode: error_dialog_mode_1.ErrorDialogMode.None,
    };
    return ErrorStore;
}(events_1.EventEmitter));
exports.ErrorStore = ErrorStore;
//# sourceMappingURL=error-store.js.map