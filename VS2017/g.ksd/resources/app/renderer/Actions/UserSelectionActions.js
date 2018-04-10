/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var delayed_get_product_event_1 = require("../Events/delayed-get-product-event");
var installed_product_received_event_1 = require("../Events/installed-product-received-event");
var product_received_event_1 = require("../Events/product-received-event");
var ResetSelectionsEvent_1 = require("../Events/ResetSelectionsEvent");
var factory_1 = require("../Installer/factory");
var Product_1 = require("../../lib/Installer/Product");
var locale_handler_1 = require("../../lib/locale-handler");
var string_utilities_1 = require("../../lib/string-utilities");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var telemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var workload_configuration_factory_1 = require("../workload-configuration-factory");
var workloadConfigurationFactory = workload_configuration_factory_1.WorkloadConfigurationFactory.getInstance();
function updateSelectedProduct(productSummary, languages, vsixs, withUpdatePackages) {
    dispatcher_1.dispatcher.dispatch(new ResetSelectionsEvent_1.ResetSelectionsEvent());
    var delayedTimer = createDelayedTimer();
    var productPromise;
    if (Product_1.isTypeOfInstalledProduct(productSummary)) {
        productPromise = factory_1.installerProxy.getInstalledProduct(productSummary.installationPath, withUpdatePackages, false, vsixs)
            .then(function (product) {
            // Select all installed languages and any languages specified to add
            var languagesToSelect = product.installedLanguages.concat(languages.languagesToAdd || []);
            var languagesToDeselect = languages.languagesToRemove || [];
            updateSelectedLanguages(product, languagesToSelect, languagesToDeselect);
            setProductWorkloadOverrides(product);
            dispatcher_1.dispatcher.dispatch(new installed_product_received_event_1.InstalledProductReceivedEvent(product));
            return product;
        })
            .catch(function (e) { return updateSelectedProductFailed(true, e); });
    }
    else if (Product_1.isTypeOfProductSummary(productSummary)) {
        // we may be invoked with a "summary" that is already a complete product; in that case
        // we can save a round trip to the setup engine to fetch something we already have
        productPromise = Product_1.isTypeOfProduct(productSummary)
            ? Promise.resolve(productSummary)
            : factory_1.installerProxy.getProduct(productSummary.channelId, productSummary.id, vsixs);
        productPromise = productPromise
            .then(function (product) {
            var languagesToSelect = [];
            var languagesToDeselect = [];
            // If languagesToAdd has some languages, select them.
            // Otherwise, fall back to the app locale.
            if (languages.languagesToAdd && languages.languagesToAdd.length > 0) {
                languagesToSelect.push.apply(languagesToSelect, languages.languagesToAdd);
            }
            else {
                languagesToSelect.push(languages.appLanguage);
            }
            updateSelectedLanguages(product, languagesToSelect, languagesToDeselect);
            setProductWorkloadOverrides(product);
            dispatcher_1.dispatcher.dispatch(new product_received_event_1.ProductReceivedEvent(product));
            return product;
        })
            .catch(function (e) { return updateSelectedProductFailed(false, e); });
    }
    else {
        clearTimeout(delayedTimer);
        throw new Error("Type error: IProductSummaryBase was neither of type IProductSummary" +
            " nor of type IInstalledProductSummary.");
    }
    productPromise.finally(function () {
        clearTimeout(delayedTimer);
    });
    return productPromise;
}
exports.updateSelectedProduct = updateSelectedProduct;
function updateSelectedProductFailed(isInstalled, e) {
    if (isInstalled) {
        dispatcher_1.dispatcher.dispatch(new installed_product_received_event_1.InstalledProductReceivedEvent(undefined, e));
    }
    else {
        dispatcher_1.dispatcher.dispatch(new product_received_event_1.ProductReceivedEvent(undefined, e));
    }
    return Promise.resolve(null);
}
function updateSelectedProductById(channelId, productId, languages, vsixs, withUpdatePackages) {
    dispatcher_1.dispatcher.dispatch(new ResetSelectionsEvent_1.ResetSelectionsEvent());
    // get installed product summaries so we can tell if the product
    // identified by channelId/productId is already installed
    return factory_1.installerProxy.getInstalledProductSummaries()
        .then(function (result) {
        var summary = result.installedProductSummaries.find(function (s) {
            return (string_utilities_1.caseInsensitiveAreEqual(s.channelId, channelId) &&
                string_utilities_1.caseInsensitiveAreEqual(s.id, productId));
        });
        // if we found a summary for an installed product, select it
        if (summary) {
            return updateSelectedProduct(summary, languages, vsixs, withUpdatePackages);
        }
        // get the uninstalled product and then select it
        return factory_1.installerProxy.getProduct(channelId, productId, vsixs)
            .then(function (product) {
            return updateSelectedProduct(product, languages, vsixs, withUpdatePackages);
        });
    });
}
exports.updateSelectedProductById = updateSelectedProductById;
function updateSelectedInstalledProductForPath(installationPath, vsixs, withUpdatePackages) {
    dispatcher_1.dispatcher.dispatch(new ResetSelectionsEvent_1.ResetSelectionsEvent());
    var delayedTimer = createDelayedTimer();
    var productPromise;
    productPromise = factory_1.installerProxy.getInstalledProduct(installationPath, withUpdatePackages, false, vsixs)
        .then(function (installedProduct) {
        setProductWorkloadOverrides(installedProduct);
        dispatcher_1.dispatcher.dispatch(new installed_product_received_event_1.InstalledProductReceivedEvent(installedProduct));
        return installedProduct;
    })
        .catch(function (e) {
        dispatcher_1.dispatcher.dispatch(new installed_product_received_event_1.InstalledProductReceivedEvent(undefined, e));
        throw e;
    });
    productPromise.finally(function () {
        clearTimeout(delayedTimer);
    });
    return productPromise;
}
exports.updateSelectedInstalledProductForPath = updateSelectedInstalledProductForPath;
function updateSelectedLanguages(product, languagesToSelect, languagesToDeselect) {
    if (!product) {
        return;
    }
    var select = true;
    // Select languages first
    languagesToSelect.forEach(function (language) {
        selectLanguage(product, language, select);
    });
    // Deselect languages now
    languagesToDeselect.forEach(function (language) {
        selectLanguage(product, language, !select);
    });
    // If the product has no languages selected, select the default language
    if (product.selectedLanguages.length === 0) {
        selectLanguage(product, locale_handler_1.LocaleHandler.DEFAULT_LOCALE, select);
    }
}
/**
 * Selects or deselects the language on the product, if it is a supported language.
 * @param product The product to select/deselect the language on
 * @param language The language to select/deselect
 * @param select True to select, false to deselect
 * @returns True if the language was successfully updated, false otherwise
 */
function selectLanguage(product, language, select) {
    var option = product.getLanguageOption(locale_handler_1.LocaleHandler.getSupportedLocale(language));
    if (option) {
        option.isSelected = select;
        return true;
    }
    return false;
}
function createDelayedTimer() {
    var timeout = 15000; // 15sec
    var timer = setTimeout(function () {
        dispatcher_1.dispatcher.dispatch(new delayed_get_product_event_1.DelayedGetProductEvent());
        // send telemetry for event dispatched.
        TelemetryProxy_1.telemetryProxy.sendIpcAtomicEvent(telemetryEventNames.SHOW_DELAYED_PRODUCT_MESSAGE, false, /* isUserTask */ {}, vs_telemetry_api_1.TelemetryResult.Success, "load product delayed and event to show message dispatched.");
    }, timeout);
    return timer;
}
function setProductWorkloadOverrides(product) {
    product.workloadSorter = workloadConfigurationFactory.getSorter();
    product.workloadResourcesProvider = workloadConfigurationFactory.getResourcesProvider();
}
//# sourceMappingURL=UserSelectionActions.js.map