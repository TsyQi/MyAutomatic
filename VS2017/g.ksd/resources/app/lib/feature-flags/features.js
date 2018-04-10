/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Known features.
 * @requires length of feature name is not restricted, but experiment names
 * must be less than 16 characters (including VSW). If the feature name is to match the experiment,
 * ensure the feature is less than 13 characters.
 */
var Feature;
(function (Feature) {
    Feature[Feature["Surveys"] = 0] = "Surveys";
    Feature[Feature["RecommendSel"] = 1] = "RecommendSel";
    Feature[Feature["ShowBitrate"] = 2] = "ShowBitrate";
    Feature[Feature["SortWklds"] = 3] = "SortWklds";
    Feature[Feature["RecWklds"] = 4] = "RecWklds";
    Feature[Feature["CloudFirstDesc"] = 5] = "CloudFirstDesc";
    Feature[Feature["CloudNativeDesc"] = 6] = "CloudNativeDesc";
})(Feature = exports.Feature || (exports.Feature = {}));
//# sourceMappingURL=features.js.map