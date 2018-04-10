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
var Product_1 = require("./Product");
var visitors_1 = require("./visitors");
/**
 * An engine that will select all components matching options
 * reachable from a set of components with the given {SelectedState}.
 */
var SelectComponentsEngine = /** @class */ (function () {
    /**
     * @param {DependentSelectionOptions} options - Options used to choose components
     * @param {SelectedState} selectedState - Used to set the components selectedStates.
     */
    function SelectComponentsEngine(options, selectedState) {
        this._options = options;
        this._selectedState = selectedState;
        // Bogus statement required to meet code coverage minimums.  There is some boilerplate
        // code generated in modules that contain derived types that connot be covered by tests
        // (nor can it be ignored with "istanbul ignore next").  If this module grows at all, this
        // statement can be removed.
        // tslint:disable
        var bogus_for_code_coverage = 0;
        // tslint:enable
    }
    SelectComponentsEngine.prototype.commit = function () {
        var _this = this;
        if (this._affectedComponents) {
            this._affectedComponents.forEach(function (component) {
                switch (component.selectedState) {
                    case Product_1.SelectedState.NotSelected:
                        component.selectedState = _this._selectedState;
                        break;
                    // IndividuallySelected has priority over group selected
                    case Product_1.SelectedState.IndividuallySelected:
                        break;
                    case Product_1.SelectedState.GroupSelected:
                        component.selectedState = _this._selectedState;
                        break;
                }
            });
        }
    };
    SelectComponentsEngine.prototype.plan = function (components) {
        var _this = this;
        this._affectedComponents = new Set();
        // Walk all components matching this._options and add to the plan.
        var componentVisitor = new visitors_1.ParameterizedComponentVisitor(this._options, function (currentComponent) {
            _this._affectedComponents.add(currentComponent);
        });
        componentVisitor.visit(components);
        return this._affectedComponents;
    };
    return SelectComponentsEngine;
}());
exports.SelectComponentsEngine = SelectComponentsEngine;
/**
 * An engine that will select all required and recommended components
 * reachable from a set of components with the given {SelectedState}.
 */
var SelectRequiredAndRecommendedComponentsEngine = /** @class */ (function (_super) {
    __extends(SelectRequiredAndRecommendedComponentsEngine, _super);
    /**
     * @param {SelectedState} selectedState - Used to set the components selectedStates.
     */
    function SelectRequiredAndRecommendedComponentsEngine(selectedState) {
        var _this = this;
        var options = {
            includeRequired: true,
            includeRecommended: true,
            includeOptional: false,
        };
        _this = _super.call(this, options, selectedState) || this;
        return _this;
    }
    return SelectRequiredAndRecommendedComponentsEngine;
}(SelectComponentsEngine));
exports.SelectRequiredAndRecommendedComponentsEngine = SelectRequiredAndRecommendedComponentsEngine;
//# sourceMappingURL=SelectRequiredAndRecommendedComponentsEngine.js.map