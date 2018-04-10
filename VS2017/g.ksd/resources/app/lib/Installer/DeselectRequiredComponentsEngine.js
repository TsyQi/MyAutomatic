/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product_1 = require("./Product");
var visitors_1 = require("./visitors");
var DeselectRequiredComponentsEngine = /** @class */ (function () {
    /**
     * Create an engine that can deselect all required components and any orphaned
     * SelectedState.GroupSelected components.
     * @param {Set<IWorkload>} selectedWorkloads - used to determine orphaned components
     *      that should be promoted to Individually Selected
     * @param {Set<Component>} selectedComponents - Set of currently selected components.
     * @param {Set<Component} orphanedComponentsToIgnore - Set of components that should
     *      not be automatically deselected.
     */
    function DeselectRequiredComponentsEngine(selectedWorkloads, selectedComponents, orphanedComponentsToIgnore) {
        this._orphanedComponentsToIgnore = orphanedComponentsToIgnore;
        this._selectedComponents = selectedComponents;
        this._selectedWorkloads = selectedWorkloads;
    }
    DeselectRequiredComponentsEngine.prototype.commit = function () {
        var _this = this;
        if (this._affectedComponents) {
            this._affectedComponents.forEach(function (component) {
                component.selectedState = Product_1.SelectedState.NotSelected;
                _this._selectedComponents.delete(component);
            });
            // Fixup selection for any remaining orphans.
            var selectedWorkloadComponents_1 = new Set();
            this._selectedWorkloads.forEach(function (w) {
                if (w.selectedState !== Product_1.SelectedState.NotSelected) {
                    w.components.forEach(function (c) {
                        if (c.selectedState !== Product_1.SelectedState.NotSelected) {
                            selectedWorkloadComponents_1.add(c);
                        }
                    });
                }
            });
            var reachableWorkloadComponentDependencies_1 = new Set();
            var visitor = new visitors_1.RequiredComponentVisitor(function (c) {
                reachableWorkloadComponentDependencies_1.add(c);
            });
            visitor.visit(selectedWorkloadComponents_1);
            this._selectedComponents.forEach(function (c) {
                if (!reachableWorkloadComponentDependencies_1.has(c)) {
                    c.selectedState = Product_1.SelectedState.IndividuallySelected;
                }
            });
        }
    };
    DeselectRequiredComponentsEngine.prototype.plan = function (components) {
        var _this = this;
        this._affectedComponents = new Set();
        // Find all components that would no longer have their dependencies
        // satisfied if the set of components are deselected.
        var parentVisitor = new visitors_1.DependentComponentVisitor(function (component) {
            _this._affectedComponents.add(component);
        }, this._selectedComponents);
        parentVisitor.visit(new Set(components.values()));
        // Find all components that should be left alone if they are detected to be orphaned.
        var ignoredOrphans = new Set();
        var requiredComponentsVisitor = new visitors_1.RequiredComponentVisitor(function (component) {
            ignoredOrphans.add(component);
        });
        requiredComponentsVisitor.visit(this._orphanedComponentsToIgnore);
        // Find all "group" selected components reachable from the
        // set of components being deselected and the affected parents,
        // except those reachable from the required components.
        var groupSelectedVisitor = new visitors_1.SelectedStateComponentVisitor(function (current) {
            if (!ignoredOrphans.has(current)) {
                _this._affectedComponents.add(current);
            }
        }, Product_1.SelectedState.GroupSelected);
        groupSelectedVisitor.visit(this._affectedComponents);
        // Filter the selected components down to the set that is
        // not being deselected.
        var remainingSelectedComponents = new Set();
        this._selectedComponents.forEach(function (c) {
            if (_this._affectedComponents.has(c)) {
                return;
            }
            remainingSelectedComponents.add(c);
        });
        // Filter out the "other" group selected components that are reachable
        // from the remaining selected components.
        var otherGroupSelectedVisitor = new visitors_1.SelectedStateComponentVisitor(function (current) {
            _this._affectedComponents.delete(current);
        }, Product_1.SelectedState.GroupSelected);
        otherGroupSelectedVisitor.visit(remainingSelectedComponents);
        return this._affectedComponents;
    };
    return DeselectRequiredComponentsEngine;
}());
exports.DeselectRequiredComponentsEngine = DeselectRequiredComponentsEngine;
//# sourceMappingURL=DeselectRequiredComponentsEngine.js.map