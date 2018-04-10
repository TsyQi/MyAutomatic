/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../node_modules/@types/dompurify/index.d.ts" />
/// <reference path="../../node_modules/@types/marked/index.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dompurify = require("dompurify");
var marked = require("marked");
var Markdown = /** @class */ (function () {
    function Markdown(windowImpl, markdown) {
        this._markedOptions = {
            breaks: true,
            gfm: true,
            pedantic: false,
            renderer: new CustomMarkedRenderer(new marked.Renderer()),
            sanitize: false,
            smartLists: true,
            smartypants: false,
            tables: true,
        };
        this._dompurify = new dompurify(windowImpl);
        this._markdown = markdown;
    }
    Markdown.Parse = function (markdown) {
        return new Markdown(window, markdown);
    };
    Markdown.prototype.toSafeHtml = function () {
        return this._dompurify.sanitize(marked(this._markdown, this._markedOptions));
    };
    return Markdown;
}());
exports.Markdown = Markdown;
/**
 * Due to a bug in TypeScript, we cannot subclass MarkedRenderer,
 * instead we will implement our own and call into this._defaultRenderer.
 * See https://github.com/Microsoft/TypeScript/issues/15870
 */
var CustomMarkedRenderer = /** @class */ (function () {
    function CustomMarkedRenderer(defaultRenderer) {
        this._defaultRenderer = defaultRenderer;
    }
    CustomMarkedRenderer.prototype.code = function (code, language) {
        return this._defaultRenderer.code(code, language);
    };
    CustomMarkedRenderer.prototype.blockquote = function (quote) {
        return this._defaultRenderer.blockquote(quote);
    };
    CustomMarkedRenderer.prototype.html = function (html) {
        return this._defaultRenderer.html(html);
    };
    CustomMarkedRenderer.prototype.heading = function (text, level, raw) {
        return this._defaultRenderer.heading(text, level, raw);
    };
    CustomMarkedRenderer.prototype.hr = function () {
        return this._defaultRenderer.hr();
    };
    CustomMarkedRenderer.prototype.list = function (body, ordered) {
        return this._defaultRenderer.list(body, ordered);
    };
    CustomMarkedRenderer.prototype.listitem = function (text) {
        return this._defaultRenderer.listitem(text);
    };
    CustomMarkedRenderer.prototype.table = function (header, body) {
        return this._defaultRenderer.table(header, body);
    };
    CustomMarkedRenderer.prototype.tablerow = function (content) {
        return this._defaultRenderer.tablerow(content);
    };
    CustomMarkedRenderer.prototype.tablecell = function (content, flags) {
        return this._defaultRenderer.tablecell(content, flags);
    };
    CustomMarkedRenderer.prototype.strong = function (text) {
        return this._defaultRenderer.strong(text);
    };
    CustomMarkedRenderer.prototype.em = function (text) {
        return this._defaultRenderer.em(text);
    };
    CustomMarkedRenderer.prototype.codespan = function (code) {
        return this._defaultRenderer.codespan(code);
    };
    CustomMarkedRenderer.prototype.br = function () {
        return this._defaultRenderer.br();
    };
    CustomMarkedRenderer.prototype.del = function (text) {
        return this._defaultRenderer.del(text);
    };
    CustomMarkedRenderer.prototype.link = function (href, title, text) {
        if (!href.startsWith("https:")) {
            href = "#";
        }
        return this._defaultRenderer.link(href, title, text);
    };
    CustomMarkedRenderer.prototype.image = function (href, title, text) {
        return this._defaultRenderer.image(href, title, text);
    };
    CustomMarkedRenderer.prototype.text = function (text) {
        return this._defaultRenderer.text(text);
    };
    CustomMarkedRenderer.prototype.paragraph = function (text) {
        return this._defaultRenderer.paragraph(text);
    };
    return CustomMarkedRenderer;
}());
exports.CustomMarkedRenderer = CustomMarkedRenderer;
//# sourceMappingURL=markdown.js.map