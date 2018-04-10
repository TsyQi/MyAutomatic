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
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var directory_picker_actions_1 = require("../Actions/directory-picker-actions");
var Utilities_1 = require("../Utilities");
var DirectoryPicker = /** @class */ (function (_super) {
    __extends(DirectoryPicker, _super);
    function DirectoryPicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this._onPickerFocusOutBind = _this.onPickerFocusOut.bind(_this);
        _this._onKeyUpBind = _this.onKeyUp.bind(_this);
        _this._lastKnownPath = "";
        return _this;
    }
    DirectoryPicker.prototype.mounted = function () {
        this._lastKnownPath = this.opts.defaultValue;
        this.hookEvents(true);
    };
    DirectoryPicker.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    DirectoryPicker.prototype.onChangeEvent = function (event) {
        // we want full control over the change event, so stop
        // propagation when the dom sends it from the input element.
        event.stopPropagation();
        event.preventUpdate = true;
    };
    DirectoryPicker.prototype.handleBrowseButtonClick = function (event) {
        var filenames = directory_picker_actions_1.openBrowseDialog();
        if (filenames && filenames.length > 0) {
            var path = filenames[0];
            this.dispatchChangeEvent(path);
        }
    };
    DirectoryPicker.prototype.onKeyUp = function (event) {
        // prevent this event from propgating up
        event.stopPropagation();
        // get the path value from the appropriate field
        var path = event.target.value;
        this.dispatchChangeEvent(path);
    };
    DirectoryPicker.prototype.dispatchChangeEvent = function (value) {
        // only fire change event when the path has changed
        if (value !== this._lastKnownPath) {
            this._lastKnownPath = value;
            var event_1 = new CustomEvent("change", {
                bubbles: true,
                cancelable: true,
                detail: {
                    path: this._lastKnownPath
                },
            });
            // Don't let Riot auto update from the change event,
            // to keep typing responsive
            event_1.preventUpdate = true;
            this.root.dispatchEvent(event_1);
        }
    };
    Object.defineProperty(DirectoryPicker.prototype, "pickerInputId", {
        get: function () {
            return "dir-picker-text-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "pickerLabelId", {
        get: function () {
            return "dir-picker-label";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "defaultValue", {
        get: function () {
            return this.opts.defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "value", {
        get: function () {
            return this._lastKnownPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "showInformationTooltip", {
        get: function () {
            return !!this.infoTip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "infoTip", {
        get: function () {
            return this.opts.infoTip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "liveRegionText", {
        get: function () {
            return this.opts.liveRegionText || this.infoTip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "labelStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "inputDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexGrow: "1",
                height: "25px",
                marginBottom: "8px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "inputWithErrorMessageDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexGrow: "1",
                flexDirection: "column",
                marginTop: "2px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "textInputStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flexGrow: "1"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "browseButtonStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                margin: "0px 6px",
                padding: "0px 12px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "installSizeInformationImgStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "12px",
                width: "12px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectoryPicker.prototype, "hiddenLiveRegionStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "1px",
                overflow: "hidden",
                position: "absolute",
                top: "-15px",
                width: "1px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    DirectoryPicker.prototype.onPickerFocusOut = function (ev) {
        var element = ev.target;
        // When focus leaves the input element,
        // and the value is empty, reset it to default.
        if (element.id === this.pickerInputId
            && element.value === "") {
            this.reset();
        }
    };
    DirectoryPicker.prototype.reset = function () {
        this.dispatchChangeEvent(this.defaultValue);
    };
    DirectoryPicker.prototype.hookEvents = function (hook) {
        var hookMethod = Utilities_1.getEventHookMethodForTarget(this.root, hook);
        hookMethod("focusout", this._onPickerFocusOutBind);
    };
    DirectoryPicker = __decorate([
        template("\n<directory-picker>\n    <div style={this.labelStyle}>\n        <div>\n            <label for={this.pickerInputId}\n                id={this.pickerLabelId}>\n                {this.opts.label}\n            </label>\n            <img if={this.showInformationTooltip}\n                 src=\"images/StatusInfoTip.svg\"\n                 style={this.installSizeInformationImgStyle}\n                 title={this.infoTip} />\n            <div style={this.hiddenLiveRegionStyle}\n                 aria-live=\"polite\"\n                 aria-atomic=\"true\">\n                {this.liveRegionText}\n            </div>\n        </div>\n\n        <div style={this.inputWithErrorMessageDivStyle}>\n            <div style={this.inputDivStyle}>\n                <input id={this.pickerInputId}\n                    type=\"text\"\n                    style={this.textInputStyle}\n                    readonly={this.opts.isreadonly}\n                    placeholder={this.resourceStrings.directoryPlaceholder}\n                    onkeyup={this._onKeyUpBind}\n                    onchange={this.onChangeEvent}\n                    value={this.value}\n                    role=\"textbox\"\n                    aria-labelledby={this.pickerLabelId}\n                    aria-readonly={this.opts.isreadonly} />\n                <button if={!this.opts.isreadonly}\n                        type=\"button\"\n                        style={this.browseButtonStyle}\n                        title={this.resourceStrings.browse}\n                        onclick={handleBrowseButtonClick}\n                        aria-label={this.resourceStrings.browse}>\n                    ...\n                </button>\n            </div>\n        </div>\n    </label>\n</directory-picker>")
    ], DirectoryPicker);
    return DirectoryPicker;
}(Riot.Element));
exports.DirectoryPicker = DirectoryPicker;
//# sourceMappingURL=directory-picker.js.map