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
var os_1 = require("os");
var events_1 = require("events");
var batch_selection_events_1 = require("../Events/batch-selection-events");
var delayed_get_product_event_1 = require("../Events/delayed-get-product-event");
var error_message_response_1 = require("../interfaces/error-message-response");
var ComponentSelectedEvent_1 = require("../Events/ComponentSelectedEvent");
var DeselectRequiredComponentsEngine_1 = require("../../lib/Installer/DeselectRequiredComponentsEngine");
var dispatcher_1 = require("../dispatcher");
var installed_product_received_event_1 = require("../Events/installed-product-received-event");
var Product_1 = require("../../lib/Installer/Product");
var evaluate_install_parameters_events_1 = require("../Events/evaluate-install-parameters-events");
var LocaleSelectedEvent_1 = require("../Events/LocaleSelectedEvent");
var product_received_event_1 = require("../Events/product-received-event");
var ResetSelectionsEvent_1 = require("../Events/ResetSelectionsEvent");
var dependent_selection_options_1 = require("../../lib/dependent-selection-options");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var SelectRequiredAndRecommendedComponentsEngine_1 = require("../../lib/Installer/SelectRequiredAndRecommendedComponentsEngine");
var view_problems_events_1 = require("../Events/view-problems-events");
var WorkloadSelectedEvent_1 = require("../Events/WorkloadSelectedEvent");
var errorNames = require("../../lib/error-names");
var ProductConfigurationStore = /** @class */ (function (_super) {
    __extends(ProductConfigurationStore, _super);
    function ProductConfigurationStore(errorStore, logger) {
        var _this = _super.call(this) || this;
        _this._evaluation = null;
        _this._installedIndividualComponents = [];
        _this._isBatchSelectionInProgress = false;
        _this._isEvaluatingInstallParameters = false;
        _this._selectedProduct = null;
        _this._selectedWorkloads = [];
        _this._viewProblemsActiveProduct = null;
        _this._viewProblemsActiveLog = null;
        _this._viewProblemsActive = false;
        _this._viewProblemsTopFailedPackages = [];
        _this._isLoadingDelayed = false;
        _this._eventHandlers = [
            { event: batch_selection_events_1.BatchSelectionStartedEvent, callback: _this.onBatchSelectionStarted.bind(_this) },
            { event: batch_selection_events_1.BatchSelectionFinishedEvent, callback: _this.onBatchSelectionFinished.bind(_this) },
            { event: ComponentSelectedEvent_1.ComponentSelectedEvent, callback: _this.onComponentSelected.bind(_this) },
            { event: evaluate_install_parameters_events_1.EvaluateInstallParametersFinishedEvent, callback: _this.onEvaluateParametersFinished.bind(_this) },
            { event: evaluate_install_parameters_events_1.EvaluateInstallParametersStartedEvent, callback: _this.onEvaluateParametersStarted.bind(_this) },
            { event: view_problems_events_1.HideViewProblemsEvent, callback: _this.onHideViewProblems.bind(_this) },
            { event: installed_product_received_event_1.InstalledProductReceivedEvent, callback: _this.onInstalledProductReceived.bind(_this) },
            { event: LocaleSelectedEvent_1.LocaleSelectedEvent, callback: _this.onLocaleSelected.bind(_this) },
            { event: product_received_event_1.ProductReceivedEvent, callback: _this.onProductReceived.bind(_this) },
            { event: ResetSelectionsEvent_1.ResetSelectionsEvent, callback: _this.onResetSelectionsEvent.bind(_this) },
            { event: view_problems_events_1.ShowViewProblemsEvent, callback: _this.onShowViewProblems.bind(_this) },
            { event: WorkloadSelectedEvent_1.WorkloadSelectedEvent, callback: _this.onWorkloadSelected.bind(_this) },
            { event: delayed_get_product_event_1.DelayedGetProductEvent, callback: _this.onDelayedGetProductEvent.bind(_this) },
        ];
        _this._errorStore = errorStore;
        _this._logger = logger;
        _this.hookEvents(true);
        return _this;
    }
    Object.defineProperty(ProductConfigurationStore.prototype, "CHANGED_EVENT", {
        get: function () {
            return "CHANGED";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "FATAL_ERROR_EVENT", {
        get: function () {
            return "ProductionConfigurationStore.FatalError";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "isLoadingDelayed", {
        get: function () {
            return this._isLoadingDelayed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "evaluation", {
        /**
         * Gets the last {ModifyParametersEvaluation} or {InstallParametersEvaluation}.
         */
        get: function () {
            return this._evaluation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "isBatchSelectionInProgress", {
        /**
         * Gets a {boolean} indicating whether a batch selection is in progress,
         * typically from a command line operation.
         */
        get: function () {
            return this._isBatchSelectionInProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "isEvaluatingInstallParameters", {
        /**
         * Gets a {boolean} indicating whether an evaluation is in progress.
         */
        get: function () {
            return this._isEvaluatingInstallParameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "isProductLoaded", {
        /**
         * Gets a {boolean} indicating if the product is loaded.
         */
        get: function () {
            return !!this._selectedProduct && !this.isBatchSelectionInProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "topFailedPackages", {
        /**
         * Gets the first failed packages {IInstalledProductPackageError}
         */
        get: function () {
            return this._viewProblemsTopFailedPackages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "viewProblemsActive", {
        /**
         * Gets the state of the view problems dialog
         */
        get: function () {
            return this._viewProblemsActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductConfigurationStore.prototype, "viewProblemsActiveLog", {
        /**
         * Gets the log string for the current product for view problems dialog
         */
        get: function () {
            return this._viewProblemsActiveLog;
        },
        enumerable: true,
        configurable: true
    });
    ProductConfigurationStore.prototype.dispose = function () {
        this.hookEvents(false);
    };
    /**
     * Returns the currently selected components for the selected product.
     *
     * @returns {Set<Component>} containing selected components
     */
    ProductConfigurationStore.prototype.getSelectedComponents = function () {
        var product = this._selectedProduct;
        if (product) {
            var selectedComponents = product.allComponents.filter(function (c) { return c.selectedState !== Product_1.SelectedState.NotSelected; });
            return new Set(selectedComponents);
        }
        return new Set();
    };
    ProductConfigurationStore.prototype.getInstalledIndividualComponents = function () {
        return this._installedIndividualComponents;
    };
    /**
     * Returns the currently selected locale for the selected product.
     *
     * @returns {string} The user selected language code for a product install.
     */
    ProductConfigurationStore.prototype.getSelectedLocales = function () {
        if (!this._selectedProduct) {
            return [];
        }
        return this._selectedProduct.selectedLanguages;
    };
    /**
     * Returns the currently selected workloads for the input channel and product IDs.
     * If no selection exists, it will return the installed and required workloads.
     *
     * @returns {Set<IWorkload>} That are currently selected.
     */
    ProductConfigurationStore.prototype.getSelectedWorkloads = function () {
        var product = this._selectedProduct;
        if (product) {
            var selectedWorkloads = product.workloads
                .filter(function (w) { return w.selectedState !== Product_1.SelectedState.NotSelected; });
            return new Set(selectedWorkloads);
        }
        return new Set();
    };
    /**
     * Returns the currently selected workloads for the input channel and product IDs in the order they were selected.
     * If no selection exists, it will return the installed and required workloads.
     *
     * @returns {IWorkload[]} That are currently selected.
     */
    ProductConfigurationStore.prototype.getSelectedWorkloadsOrdered = function () {
        return this._selectedWorkloads;
    };
    /**
     * Gets the workloads and categories of non-required workloads.
     */
    ProductConfigurationStore.prototype.getWorkloadCategories = function () {
        if (!this._selectedProduct) {
            return [];
        }
        return this._selectedProduct.getWorkloadCategories();
    };
    ProductConfigurationStore.prototype.getSelectedProduct = function () {
        return this._selectedProduct;
    };
    /**
     * The virtual workload contains components that the user selected,
     * but does not appear under any other selected workload.
     */
    ProductConfigurationStore.prototype.getVirtualWorkloadComponents = function () {
        var product = this._selectedProduct;
        if (product) {
            var individuallySelectedComponents = product.allComponents
                .filter(function (c) { return c.selectedState === Product_1.SelectedState.IndividuallySelected; });
            return individuallySelectedComponents;
        }
        return [];
    };
    ProductConfigurationStore.prototype.onShowViewProblems = function (event) {
        this._viewProblemsActive = true;
        this._viewProblemsActiveProduct = event.product;
        this._viewProblemsActiveLog = event.log;
        this._viewProblemsTopFailedPackages = event.topFailedPackages;
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onHideViewProblems = function (event) {
        this._viewProblemsActive = false;
        this._viewProblemsActiveProduct = null;
        this._viewProblemsActiveLog = null;
        this._viewProblemsTopFailedPackages = [];
        this.emitChangedEvent();
    };
    /**
     *  Returns the error message
     */
    ProductConfigurationStore.prototype.buildRequiredComponentErrorMessage = function (workloadSet, componentSet) {
        var _this = this;
        var workloads = Array.from(workloadSet.values());
        var workloadNames = workloads.map(function (workload) { return workload.name; });
        var componentNames = Array.from(componentSet.values()).map(function (c) { return c.name; });
        var errorMessage = [];
        var errorStart = ResourceStrings_1.ResourceStrings.removingRequiredComponents;
        var errorEnd = ResourceStrings_1.ResourceStrings.continueToRemoveComponent;
        errorMessage.push(errorStart);
        errorMessage.push("");
        workloadNames.concat(componentNames)
            .forEach(function (name) { return errorMessage.push(_this.formatArtifactNameForList(name)); });
        errorMessage.push("");
        errorMessage.push(errorEnd);
        return errorMessage;
    };
    ProductConfigurationStore.prototype.formatArtifactNameForList = function (name) {
        return "-  " + name;
    };
    /**
     * The "visible" part of this function name refers to the fact that only first level workload
     * components are shown in the summary pane.
     * @param {IProductBase} product - The product to search for selected workloads and components.
     * @returns {Set<Component>} Directly referenced selected components of the selected workloads.
     */
    ProductConfigurationStore.prototype.getVisibleSelectedComponentsFromWorkloads = function (workloads) {
        var selectedComponents = new Set();
        workloads.forEach(function (w) {
            if (w.selectedState === Product_1.SelectedState.NotSelected) {
                return;
            }
            w.components.filter(function (c) { return c.selectedState !== Product_1.SelectedState.NotSelected; })
                .forEach(function (c) { return selectedComponents.add(c); });
        });
        return selectedComponents;
    };
    /**
     * Deselect components and warn the user if any workloads will have to be deselected
     * to satisfy the request.
     * @param {Set<IWorkload>} selectedWorkloads - Set of currently selected workloads.
     * @param {Set<Component>} selectedComponents - Set of currently selected components.
     * @param {Set<Component>} orphansToIgnore - Set of components that should not be quietly deselected.
     * @param {DependentSelectionOptions} dependentSelectionOptions - The edges walked for quiet selection.
     * @param {Set<Component>} components - Set of components requested to be deselected.
     */
    ProductConfigurationStore.prototype.deselectComponents = function (selectedWorkloads, selectedComponents, orphansToIgnore, dependentSelectionOptions, components) {
        var _this = this;
        // Plan the deselection
        var deselectionEngine = new DeselectRequiredComponentsEngine_1.DeselectRequiredComponentsEngine(selectedWorkloads, selectedComponents, orphansToIgnore);
        var componentsToDeselect = deselectionEngine.plan(components);
        // Detect workloads that need to be deselected
        var workloadsToDeselect = new Set();
        componentsToDeselect.forEach(function (componentToDeselect) {
            selectedWorkloads.forEach(function (workload) {
                if (workload.requiredComponents.indexOf(componentToDeselect) > -1) {
                    workloadsToDeselect.add(workload);
                }
            });
        });
        // Find all group selected components in the workload summary
        var groupSelectedWorkloadComponents = new Set();
        selectedWorkloads.forEach(function (workload) {
            workload.components.forEach(function (c) {
                if (c.selectedState === Product_1.SelectedState.GroupSelected) {
                    groupSelectedWorkloadComponents.add(c);
                }
            });
        });
        // Decide if we need to warn user about components
        var componentsForWarningMessage = new Set();
        componentsToDeselect.forEach(function (component) {
            // Components that were not originally requested to be deselected,
            // and are either in the Individually selected state or appear under a workload
            // should trigger a warning.
            if (!components.has(component)
                && (component.selectedState === Product_1.SelectedState.IndividuallySelected
                    || groupSelectedWorkloadComponents.has(component))) {
                componentsForWarningMessage.add(component);
            }
        });
        // Removing a component that will impact other workloads and components
        if (workloadsToDeselect.size > 0 || componentsForWarningMessage.size > 0) {
            var requiredComponentErrorMessage = this.buildRequiredComponentErrorMessage(workloadsToDeselect, componentsForWarningMessage);
            var options = {
                title: ResourceStrings_1.ResourceStrings.removingRequiredComponentsTitle,
                message: requiredComponentErrorMessage,
                allowCancel: true,
                okButtonText: ResourceStrings_1.ResourceStrings.remove,
                hideSupportLink: true,
                errorName: errorNames.DESELECT_WORKLOADS_PROMPT_ERROR_NAME,
            };
            return this._errorStore.show(options)
                .then(function (response) {
                if (response.buttonType !== error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                    return Promise.reject(new Error("User canceled"));
                }
                // Remove the affected workloads
                if (workloadsToDeselect.size > 0) {
                    // Create another set without the workload being deselected.
                    var remainingSelectedWorkloads_1 = new Set(selectedWorkloads.values());
                    workloadsToDeselect.forEach(function (w) {
                        remainingSelectedWorkloads_1.delete(w);
                    });
                    var remainingOrphansToIgnore = _this.getVisibleSelectedComponentsFromWorkloads(remainingSelectedWorkloads_1);
                    return _this.deselectWorkloads(selectedWorkloads, selectedComponents, remainingOrphansToIgnore, dependentSelectionOptions, workloadsToDeselect);
                }
                return Promise.resolve();
            })
                .then(function () {
                // Commit component deselection if workloads were successfully deselected
                deselectionEngine.commit();
            });
        }
        else {
            // Since no workloads or components are affected, just commit the deselection.
            deselectionEngine.commit();
            return Promise.resolve();
        }
    };
    /**
     * Attempts to deselect workloads and warns about deselection of dependencies.
     *
     * @param {Set<IWorkload>} selectedWorkloads - Currently selected workloads.
     * @param {Set<Component>} selectedComponents - Currently selected components.
     * @param {Set<Component>} orphansToIgnore - Components that should not be quietly deselected.
     * @param {DependentSelectionOptions} dependentSelectionOptions - The edges walked for quiet selection.
     * @param {Set<IWorkload>} workloads - Workloads to deselect.
     */
    ProductConfigurationStore.prototype.deselectWorkloads = function (selectedWorkloads, selectedComponents, orphansToIgnore, dependentSelectionOptions, workloads) {
        var _this = this;
        var selectionEngine = new SelectRequiredAndRecommendedComponentsEngine_1.SelectComponentsEngine(dependentSelectionOptions, Product_1.SelectedState.GroupSelected);
        // if we're attempting to deselect a required workload, show an error message
        // (this can happen via the command line)
        var requiredWorkloads = Array.from(workloads.values()).filter(function (w) { return w.required; });
        if (requiredWorkloads.length > 0) {
            var message_1 = [
                ResourceStrings_1.ResourceStrings.removingRequiredWorkload,
                "",
            ];
            requiredWorkloads.forEach(function (w) {
                message_1.push(_this.formatArtifactNameForList(w.name));
            });
            var options = {
                title: ResourceStrings_1.ResourceStrings.removingRequiredWorkloadTitle,
                message: message_1,
                allowCancel: false,
                hideSupportLink: true,
                errorName: errorNames.DESELECT_WORKLOADS_PROMPT_ERROR_NAME,
            };
            return this._errorStore.show(options)
                .then(function (response) {
                if (response.buttonType !== error_message_response_1.ButtonType.DEFAULT_SUBMIT) {
                    return Promise.reject(new Error("User canceled"));
                }
            });
        }
        var componentsToDeselect = new Set();
        workloads.forEach(function (selectedWorkload) {
            // Set the workload to be deselected for the evaluation.
            // Make sure to reset the state if the workload should remain selected,
            // for example in the rejection of deselectComponents.
            selectedWorkload.selectedState = Product_1.SelectedState.NotSelected;
            selectedWorkloads.delete(selectedWorkload);
            var selectedWorkloadComponents = selectedWorkload.components
                .filter(function (c) { return c.selectedState === Product_1.SelectedState.GroupSelected; });
            selectedWorkloadComponents.forEach(function (c) {
                componentsToDeselect.add(c);
            });
        });
        // Don't automatically deselect any components that are ignored for this transaction.
        var plan = selectionEngine.plan(orphansToIgnore);
        plan.forEach(function (c) { return componentsToDeselect.delete(c); });
        return this.deselectComponents(selectedWorkloads, selectedComponents, orphansToIgnore, dependentSelectionOptions, componentsToDeselect)
            .then(function () {
            _this.removeDeselectedWorkloadsFromOrderedList();
        })
            .catch(function () {
            // Reselect the workloads that were deselected
            workloads.forEach(function (selectedWorkload) {
                selectedWorkload.selectedState = Product_1.SelectedState.IndividuallySelected;
                selectedWorkloads.add(selectedWorkload);
            });
        });
    };
    ProductConfigurationStore.prototype.onBatchSelectionStarted = function (event) {
        this._isBatchSelectionInProgress = true;
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onBatchSelectionFinished = function (event) {
        var artifactSelectionWarnings = event.artifactSelectionWarnings || [];
        this._isBatchSelectionInProgress = false;
        // selectedProduct could be null if we get an error trying to load it
        if (this._selectedProduct) {
            this._selectedProduct.fixupSelection();
            if (artifactSelectionWarnings && artifactSelectionWarnings.length > 0) {
                var message = artifactSelectionWarnings
                    .map(function (warning) { return "- **" + warning.artifactId + "**: " + warning.reason; });
                var options = {
                    errorName: errorNames.ARTIFACT_SELECTION_WARNING,
                    title: ResourceStrings_1.ResourceStrings.artifactSelectionWarningTitle,
                    message: message,
                };
                this._errorStore.show(options);
                var artifactSelectionWarningMessages = artifactSelectionWarnings.map(function (warning) { return warning.artifactId + ": " + warning.reason; });
                var logMessage = "" + ResourceStrings_1.ResourceStrings.artifactSelectionWarningTitle + os_1.EOL +
                    ("" + artifactSelectionWarningMessages.join(os_1.EOL));
                this._logger.writeWarning(logMessage);
            }
        }
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onComponentSelected = function (event) {
        var _this = this;
        var product = this._selectedProduct;
        if (!product) {
            return;
        }
        var componentsToChange = new Set(event.components);
        if (event.options.checked) {
            var selectedState = event.options.isIndividuallySelected
                ? Product_1.SelectedState.IndividuallySelected
                : Product_1.SelectedState.GroupSelected;
            var selectionEngine = new SelectRequiredAndRecommendedComponentsEngine_1.SelectComponentsEngine(event.options, selectedState);
            selectionEngine.plan(componentsToChange);
            selectionEngine.commit();
            this.emitChangedEvent();
        }
        else {
            var selectedComponents = this.getSelectedComponents();
            var selectedWorkloads = this.getSelectedWorkloads();
            var orphansToIgnore_1 = this.getVisibleSelectedComponentsFromWorkloads(selectedWorkloads);
            componentsToChange.forEach(function (selectedComponent) {
                orphansToIgnore_1.delete(selectedComponent);
            });
            this.deselectComponents(selectedWorkloads, selectedComponents, orphansToIgnore_1, event.options, componentsToChange)
                .finally(function () {
                _this.emitChangedEvent();
            });
        }
    };
    ProductConfigurationStore.prototype.onDelayedGetProductEvent = function (event) {
        this._isLoadingDelayed = true;
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onEvaluateParametersStarted = function (_event) {
        // We only want to emit a change event if we weren't previously evaluating for better performance.
        if (this._isEvaluatingInstallParameters) {
            return;
        }
        this._isEvaluatingInstallParameters = true;
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onEvaluateParametersFinished = function (event) {
        this._isEvaluatingInstallParameters = false;
        this._evaluation = event.evaluation;
        if (event.error) {
            var message = event.error.localizedMessage
                || event.error.message
                || ResourceStrings_1.ResourceStrings.statusCriticalError;
            var errorOptions = {
                allowCancel: false,
                message: message,
                okButtonText: ResourceStrings_1.ResourceStrings.ok,
                title: ResourceStrings_1.ResourceStrings.errorMessagePrefix,
                errorName: errorNames.EVALUATE_PARAMETERS_ERROR_NAME,
            };
            this._errorStore.show(errorOptions);
            return;
        }
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onInstalledProductReceived = function (event) {
        // use event.errorMessage instead of event.error.message to avoid displaying the callstack
        var errorMessage = event.errorMessage;
        this.onProductReceivedCore(event.installedProduct, event.error, errorMessage);
    };
    ProductConfigurationStore.prototype.onLocaleSelected = function (event) {
        if (!this._selectedProduct) {
            return;
        }
        var languageOption = this._selectedProduct.getLanguageOption(event.locale);
        languageOption.isSelected = event.isChecked;
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onProductReceived = function (event) {
        // use event.errorMessage instead of event.error.message to avoid displaying the callstack
        var errorMessage = event.errorMessage;
        this.onProductReceivedCore(event.product, event.error, errorMessage);
    };
    ProductConfigurationStore.prototype.onProductReceivedCore = function (product, error, errorMessage) {
        var _this = this;
        this._evaluation = null;
        this._isLoadingDelayed = false;
        if (error) {
            var options = {
                message: errorMessage,
                errorName: errorNames.FAILED_TO_GET_PRODUCT_ERROR_NAME,
            };
            // show the error message, then raise the error event so subscribers can react
            this._errorStore.show(options)
                .then(function (result) {
                _this.emit(_this.FATAL_ERROR_EVENT);
            });
        }
        else if (product) {
            this.selectProduct(product);
        }
    };
    ProductConfigurationStore.prototype.selectProduct = function (product) {
        this._selectedWorkloads = [];
        this._installedIndividualComponents = [];
        if (product instanceof Product_1.InstalledProduct) {
            this.resetSelectionsForInstalledProduct(product);
            this._installedIndividualComponents = product.allComponents
                .filter(function (c) { return c.selectedState === Product_1.SelectedState.IndividuallySelected; });
        }
        else if (product instanceof Product_1.Product) {
            this.resetSelectionsForProduct(product);
        }
        else {
            /* istanbul ignore next */
            throw new Error("Invalid Product or InstalledProduct instance");
        }
        this._selectedProduct = product;
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onResetSelectionsEvent = function (event) {
        this._installedIndividualComponents = [];
        this._selectedProduct = null;
        this._selectedWorkloads = [];
        this.emitChangedEvent();
    };
    ProductConfigurationStore.prototype.onWorkloadSelected = function (event) {
        var _this = this;
        var product = this._selectedProduct;
        if (product) {
            var selectedWorkload = product.workloads.find(function (w) { return event.selectedWorkloadId === w.id; });
            if (event.options.checked) {
                var selectionEngine = new SelectRequiredAndRecommendedComponentsEngine_1.SelectComponentsEngine(event.options, Product_1.SelectedState.GroupSelected);
                selectedWorkload.selectedState = Product_1.SelectedState.IndividuallySelected;
                if (this._selectedWorkloads.indexOf(selectedWorkload) === -1) {
                    this._selectedWorkloads.push(selectedWorkload);
                }
                var componentsToSelect = dependent_selection_options_1.DependentsFromSelectionOptions(selectedWorkload, event.options);
                selectionEngine.plan(new Set(componentsToSelect));
                selectionEngine.commit();
                this.emitChangedEvent();
            }
            else {
                var selectedWorkloads = this.getSelectedWorkloads();
                var selectedComponents = this.getSelectedComponents();
                // Create another set without the workload being deselected.
                var remainingSelectedWorkloads = new Set(selectedWorkloads.values());
                remainingSelectedWorkloads.delete(selectedWorkload);
                var orphansToIgnore = this.getVisibleSelectedComponentsFromWorkloads(remainingSelectedWorkloads);
                this.deselectWorkloads(selectedWorkloads, selectedComponents, orphansToIgnore, event.options, new Set([selectedWorkload]))
                    .finally(function () {
                    _this.emitChangedEvent();
                });
            }
        }
    };
    /**
     * The default selection for an installed product, should be based completely
     * on the selected state received from the engine. This method just synchronizes
     * the ordered selected workloads list. Make sure installed workloads are selected.
     */
    ProductConfigurationStore.prototype.resetSelectionsForInstalledProduct = function (product) {
        var _this = this;
        product.workloads.forEach(function (workload) {
            if (workload.selectedState !== Product_1.SelectedState.NotSelected) {
                _this._selectedWorkloads.push(workload);
            }
            // Synchronize install state with selected state.
            if (workload.selectedState === Product_1.SelectedState.NotSelected
                && workload.installState === Product_1.InstallState.Installed) {
                workload.selectedState = Product_1.SelectedState.IndividuallySelected;
                _this._selectedWorkloads.push(workload);
            }
        });
        product.fixupSelection();
    };
    /**
     * The default selection for a "not" installed product, should be based
     * on required and recommended components.
     */
    ProductConfigurationStore.prototype.resetSelectionsForProduct = function (product) {
        var _this = this;
        var workloadComponents = new Set();
        var requiredWorkloads = product.workloads.filter(function (workload) {
            return workload.required;
        });
        requiredWorkloads.forEach(function (workload) {
            workload.selectedState = Product_1.SelectedState.IndividuallySelected;
            workload.requiredComponents.forEach(function (component) { return workloadComponents.add(component); });
            workload.recommendedComponents.forEach(function (component) { return workloadComponents.add(component); });
            _this._selectedWorkloads.push(workload);
        });
        // Walk the required and recommended components of the Workload's required and recommended
        // components, and select them as GroupSelected.
        var workloadComponentSelectionEngine = new SelectRequiredAndRecommendedComponentsEngine_1.SelectRequiredAndRecommendedComponentsEngine(Product_1.SelectedState.GroupSelected);
        workloadComponentSelectionEngine.plan(workloadComponents);
        workloadComponentSelectionEngine.commit();
        // Select the product's recommended and required components.
        var productComponents = new Set();
        product.additionalComponentsOfDependencyType(Product_1.DependencyType.Required)
            .forEach(function (component) { return productComponents.add(component); });
        product.additionalComponentsOfDependencyType(Product_1.DependencyType.Recommended)
            .forEach(function (component) { return productComponents.add(component); });
        // Walk the recommended and required components of the product's recommended and required components.
        var productComponentSelectionEngine = new SelectRequiredAndRecommendedComponentsEngine_1.SelectRequiredAndRecommendedComponentsEngine(Product_1.SelectedState.IndividuallySelected);
        productComponentSelectionEngine.plan(productComponents);
        productComponentSelectionEngine.commit();
        product.fixupSelection();
    };
    ProductConfigurationStore.prototype.removeDeselectedWorkloadsFromOrderedList = function () {
        // Remove any deselected workloads from the ordered list
        this._selectedWorkloads = this._selectedWorkloads
            .filter(function (workload) { return workload.selectedState !== Product_1.SelectedState.NotSelected; });
    };
    ProductConfigurationStore.prototype.emitChangedEvent = function () {
        this.emit(this.CHANGED_EVENT);
    };
    ProductConfigurationStore.prototype.hookEvents = function (hook) {
        var fn = hook
            ? dispatcher_1.dispatcher.register.bind(dispatcher_1.dispatcher)
            : dispatcher_1.dispatcher.unregister.bind(dispatcher_1.dispatcher);
        this._eventHandlers.forEach(function (descriptor) {
            fn(descriptor.event, descriptor.callback);
        });
    };
    return ProductConfigurationStore;
}(events_1.EventEmitter));
exports.ProductConfigurationStore = ProductConfigurationStore;
//# sourceMappingURL=product-configuration-store.js.map