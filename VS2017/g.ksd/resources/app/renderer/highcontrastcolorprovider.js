/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var systemColors = require("system-colors");
var requires = require("../lib/requires");
var HighContrastColorProvider = /** @class */ (function () {
    function HighContrastColorProvider() {
        // ID for the style sheet that will contain all variable names for the appropriate high contrast theme
        this._styleElementID = "high-contrast-theme-colors-style";
        // ID for the link element that points to the css to use for the current theme.
        this._linkElementID = "css-for-current-theme-link";
        // Prefix that system colors have.
        this._systemColorPrefix = "COLOR_";
        // Prefix that css variables used in the app should have.
        this._variableColorPrefix = "--color-";
        // Module that watches changes in system colors and provides the current color map.
        this._colorsWatcher = new systemColors.SystemColors();
    }
    /**
     * Enables high contrast theming for the app by listening to changes to system colors.
     * Can be only called once. Need to call it at app startup
     */
    HighContrastColorProvider.prototype.enableHighContrastTheming = function () {
        var _this = this;
        // Apply the appropriate tags at startup
        this.insertTagsForTheme();
        // Make sure you do not hook on change event multiple times.
        if (!HighContrastColorProvider._isThemingEnabled) {
            // Change the tags every time the system colors are changed.
            this._colorsWatcher.on("change", function () {
                _this.insertTagsForTheme();
            });
            HighContrastColorProvider._isThemingEnabled = true;
        }
    };
    /**
     * Append the css and link tags to the head of the document..
     */
    HighContrastColorProvider.prototype.insertTagsForTheme = function () {
        // Insert the CSS stylesheet link
        this.appendDOMElementToHeadTag(this.getStyleElementForCurrentCSSVariables());
        this.appendDOMElementToHeadTag(this.getCSSLinkElementForCurrentTheme());
    };
    /**
     * Get the values of all CSS variables used in the app for the current high contrast theme.
     */
    HighContrastColorProvider.prototype.getStyleElementForCurrentCSSVariables = function () {
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.id = this._styleElementID;
        styleSheet.innerHTML = this.formRootElementforCurrentCSSVariables(this.getCurrentSytemColors());
        return styleSheet;
    };
    /**
     * Get the CSS link for the current element.
     */
    HighContrastColorProvider.prototype.getCSSLinkElementForCurrentTheme = function () {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "styleSheet";
        link.id = this._linkElementID;
        if (this._colorsWatcher.isHighContrastEnabled()) {
            link.href = "colors.highcontrast.css";
        }
        else {
            link.href = "colors.css";
        }
        return link;
    };
    /**
     * Encapsulates the color definitions provided to the function
     * in an appropriate style tag that can be embedded in a DOM.
     */
    HighContrastColorProvider.prototype.formRootElementforCurrentCSSVariables = function (colorDefinitions) {
        // This is formatted to look correctly in the html of the app
        return ":root {" + colorDefinitions + "\n        }";
    };
    /**
     * Gets the current system color settings in a map.
     * Expected Output:
     * `--color-activeCaption: #RGB1;
     * --color-activeCaptionText: #RGB2;
     * `
     */
    HighContrastColorProvider.prototype.getCurrentSytemColors = function () {
        var _this = this;
        var colorDefinitions = "";
        var sysColors = this._colorsWatcher.getSystemColors();
        Object.keys(sysColors).forEach(function (element) {
            // This is formatted to look correctly in the html of the app.
            colorDefinitions +=
                "\n            " + _this.transformSysColorToVariableName(element) + ": #" + sysColors[element] + ";";
        });
        return colorDefinitions;
    };
    /**
     * Maps system color name to a CSS style variable name used by the App.
     */
    HighContrastColorProvider.prototype.transformSysColorToVariableName = function (sysColor) {
        var result = sysColor.slice(0, sysColor.length);
        result = result.replace(this._systemColorPrefix, "");
        result = result.toLowerCase();
        result = this._variableColorPrefix + result;
        return result;
    };
    /**
     * Appends the supplied DOM Node to the head of the document.
     * Removes the node if already there so that at once only one element of that Id is present all times.
     */
    HighContrastColorProvider.prototype.appendDOMElementToHeadTag = function (targetElementToInject) {
        requires.notNullOrUndefined(targetElementToInject, "targetElementToInject");
        var targetElementId = targetElementToInject.id;
        var element = document.querySelector("#" + targetElementId);
        // Check to see if the target elementId already exists. Remove the element if already present.
        if (element != null) {
            var parent_1 = element.parentNode;
            parent_1.removeChild(element);
        }
        document.head.appendChild(targetElementToInject);
    };
    // Boolean flag to ensure theming is enabled only once.
    HighContrastColorProvider._isThemingEnabled = false;
    return HighContrastColorProvider;
}());
exports.HighContrastColorProvider = HighContrastColorProvider;
//# sourceMappingURL=highcontrastcolorprovider.js.map