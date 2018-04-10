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
var dependent_selection_options_1 = require("../dependent-selection-options");
var ComponentVisitor = /** @class */ (function () {
    function ComponentVisitor(visitCallback) {
        this._visit = visitCallback;
    }
    /**
     * DFS walk - the visitCallback should return the next set of nodes to visit
     */
    ComponentVisitor.prototype.visit = function (componentsToVisit) {
        var remainingComponents = Array.from(componentsToVisit.values());
        var visitedComponents = new Set();
        while (remainingComponents.length > 0) {
            // use shift/unshift to treat the array as a stack
            var currentComponent = remainingComponents.shift();
            if (!visitedComponents.has(currentComponent)) {
                var children = this._visit(currentComponent);
                if (children instanceof Set) {
                    children.forEach(function (c) {
                        remainingComponents.unshift(c);
                    });
                }
                visitedComponents.add(currentComponent);
            }
        }
    };
    return ComponentVisitor;
}());
exports.ComponentVisitor = ComponentVisitor;
/**
 * Visit all required components for a set of components.
 */
var ParameterizedComponentVisitor = /** @class */ (function (_super) {
    __extends(ParameterizedComponentVisitor, _super);
    /**
     * @param {DependentSelectionOptions} options - options describing the components to visit
     * @param {Function} callback - called for every component in the walk.
     */
    function ParameterizedComponentVisitor(options, callback) {
        return _super.call(this, function (component) {
            callback(component);
            return new Set(dependent_selection_options_1.DependentsFromSelectionOptions(component, options));
        }) || this;
    }
    return ParameterizedComponentVisitor;
}(ComponentVisitor));
exports.ParameterizedComponentVisitor = ParameterizedComponentVisitor;
/**
 * Visit all required components for a set of components.
 */
var RequiredComponentVisitor = /** @class */ (function (_super) {
    __extends(RequiredComponentVisitor, _super);
    /**
     * @param {Function} callback - called for every component in the walk.
     */
    function RequiredComponentVisitor(callback) {
        var _this = this;
        var options = {
            includeRequired: true,
            includeRecommended: false,
            includeOptional: false,
        };
        _this = _super.call(this, options, callback) || this;
        return _this;
    }
    return RequiredComponentVisitor;
}(ParameterizedComponentVisitor));
exports.RequiredComponentVisitor = RequiredComponentVisitor;
/**
 * Visit all required and recommended components for a set of components.
 */
var RequiredRecommendedComponentVisitor = /** @class */ (function (_super) {
    __extends(RequiredRecommendedComponentVisitor, _super);
    /**
     * @param {Function} callback - called for every component in the walk.
     */
    function RequiredRecommendedComponentVisitor(callback) {
        var _this = this;
        var options = {
            includeRequired: true,
            includeRecommended: true,
            includeOptional: false,
        };
        _this = _super.call(this, options, callback) || this;
        return _this;
    }
    return RequiredRecommendedComponentVisitor;
}(ParameterizedComponentVisitor));
exports.RequiredRecommendedComponentVisitor = RequiredRecommendedComponentVisitor;
/**
 * Recursively visit all components that require a set of components.
 */
var DependentComponentVisitor = /** @class */ (function (_super) {
    __extends(DependentComponentVisitor, _super);
    /**
     * Create a visitor that walks up the required relationships.
     * @param {Function} callback - called for every component in the walk.
     * @param {Set<Component>} allComponents - domain of components to search during the walk.
     */
    function DependentComponentVisitor(callback, allComponents) {
        var _this = this;
        var dependentComponentMap = DependentComponentVisitor.getDependentComponentMap(allComponents);
        _this = _super.call(this, function (component) {
            callback(component);
            // find components that depend on this component
            return dependentComponentMap.get(component);
        }) || this;
        return _this;
    }
    /**
     * Builds a reverse map of all "required" edges in the allComponents set.
     * @param {Set<Component>} allComponents - Components used to generate the reverse map.
     * @returns {WeakMap<Componet, Set<Component>>} A reverse map for all "required" edges in the set.
     */
    DependentComponentVisitor.getDependentComponentMap = function (allComponents) {
        // Build a reverse map for all "required" edges in the allComponents set
        var dependentComponentMap = new WeakMap();
        var visitor = new RequiredComponentVisitor(function (current) {
            current.requiredComponents.forEach(function (component) {
                if (!dependentComponentMap.has(component)) {
                    dependentComponentMap.set(component, new Set());
                }
                dependentComponentMap.get(component).add(current);
            });
        });
        visitor.visit(allComponents);
        return dependentComponentMap;
    };
    return DependentComponentVisitor;
}(ComponentVisitor));
exports.DependentComponentVisitor = DependentComponentVisitor;
/**
 * Visitor that walks the components based on the selected state.
 */
var SelectedStateComponentVisitor = /** @class */ (function (_super) {
    __extends(SelectedStateComponentVisitor, _super);
    /**
     * Create a visitor that walks all components based on the selectedState
     * @param {Function} callback - called for every component in the walk.
     * @param {SelectedSTate} selectedState - the selectedState used for the walk.
     */
    function SelectedStateComponentVisitor(callback, selectedState) {
        return _super.call(this, function (current) {
            if (current.selectedState === selectedState) {
                callback(current);
            }
            // Walk dependencies which are "group" selected.
            var groupSelectedComponents = current.components.filter(function (c) {
                return c.selectedState === selectedState;
            });
            return new Set(groupSelectedComponents);
        }) || this;
    }
    return SelectedStateComponentVisitor;
}(ComponentVisitor));
exports.SelectedStateComponentVisitor = SelectedStateComponentVisitor;
//# sourceMappingURL=visitors.js.map