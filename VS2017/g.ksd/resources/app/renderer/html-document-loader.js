/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Loads the specified path and attempts to re-evaluate
 * any scripts in the body tag of the loaded document.
 *
 * @param {string} path - path to html document to load.
 * @returns Promise<void> When loading is complete.
 */
function loadDocument(path) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.addEventListener("load", function (ev) {
            var fragmentBody = req.responseXML.body;
            var fragmentHead = req.responseXML.head;
            document.head.innerHTML = fragmentHead.innerHTML;
            document.body.innerHTML = fragmentBody.innerHTML;
            // re-evaluate scripts in body.
            var scripts = document.body.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                var parentElement = script.parentElement;
                var newScript = document.createElement("script");
                newScript.src = script.src;
                newScript.text = script.text;
                parentElement.removeChild(script);
                parentElement.appendChild(newScript);
            }
            resolve();
        });
        req.addEventListener("error", function (ev) {
            reject(new Error("Error in XMLHttpRequest"));
        });
        req.addEventListener("abort", function (ev) {
            reject(new Error("Aborted XMLHttpRequest"));
        });
        req.open("GET", path);
        req.responseType = "document";
        req.send();
    });
}
exports.loadDocument = loadDocument;
//# sourceMappingURL=html-document-loader.js.map