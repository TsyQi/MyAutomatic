/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns dependents of the package that match the given options.  The collection of
 * dependents includes only direct dependents of the package, not dependents of dependents.
 *
 * @param {Package} pkg - The package whose dependents are requested
 * @param {DependentSelectionOptions} options - Options specifying which dependents are requested
 * @returns {Component[]} The package's dependent components
 */
function DependentsFromSelectionOptions(pkg, options) {
    var dependents = [];
    if (options.includeRequired) {
        dependents = dependents.concat(pkg.requiredComponents);
    }
    if (options.includeRecommended) {
        dependents = dependents.concat(pkg.recommendedComponents);
    }
    if (options.includeOptional) {
        dependents = dependents.concat(pkg.optionalComponents);
    }
    return dependents;
}
exports.DependentsFromSelectionOptions = DependentsFromSelectionOptions;
//# sourceMappingURL=dependent-selection-options.js.map