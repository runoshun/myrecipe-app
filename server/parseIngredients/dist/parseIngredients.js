"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
exports.default = (parsedUrl, html) => __awaiter(this, void 0, void 0, function* () {
    const hostnamePath = parsedUrl.hostname + parsedUrl.path;
    const specName = Object.keys(parseSpecs).find(key => hostnamePath.startsWith(key));
    if (!specName) {
        return Promise.resolve([]);
    }
    const spec = parseSpecs[specName];
    switch (spec.type) {
        case "simpleQuery":
            return performSimpleQuery(html, spec.names, spec.amounts, spec.options || {});
        case "queryAndSplit":
            return performQueryAndSplit(html, spec.selector, spec.separator);
        default:
            return Promise.reject("unknown parse spec type");
    }
});
const performSimpleQuery = (html, namesSelector, amountSelector, opts) => {
    const $html = cheerio.load(html);
    const names = $html(namesSelector);
    const amounts = $html(amountSelector);
    return Promise.resolve(names.toArray().map((elem, i) => {
        let $name = cheerio(elem);
        let $amount = cheerio(amounts[i]);
        if (opts.removeChildren) {
            $name = $name.clone().children().remove().end();
            $amount = $amount.clone().children().remove().end();
        }
        return {
            name: trimUnneeded($name.text()),
            amount: trimUnneeded($amount.text()),
        };
    }));
};
const performQueryAndSplit = (html, selector, separator) => {
    const $html = cheerio.load(html);
    const elems = $html(selector);
    return Promise.resolve(elems.toArray().map(elem => {
        let texts = cheerio(elem).text().split(separator);
        return {
            name: trimUnneeded(texts[0]),
            amount: trimUnneeded(texts[1])
        };
    }));
};
const trimUnneeded = (text) => {
    return text.replace(/・/g, "").replace(/　/g, "").trim();
};
const parseSpecs = {
    "erecipe.woman.excite.co.jp/sp": {
        type: "simpleQuery",
        names: "#change_material .simplelist .material_name",
        amounts: "#change_material .simplelist .amount",
    },
    "www.kyounoryouri.jp": {
        type: "simpleQuery",
        names: "#ingredients_list dt .ingredient",
        amounts: "#ingredients_list dt .floatright"
    },
    "cookpad.com": {
        type: "simpleQuery",
        names: "#ingredients-list .ingredient_row",
        amounts: "#ingredients-list .quantity",
    },
    "chefgohan.gnavi.co.jp": {
        type: "simpleQuery",
        names: ".box-recipetable tbody tr th",
        amounts: ".box-recipetable tbody tr td",
        options: {
            removeChildren: true
        }
    },
    "www.sirogohan.com/sp": {
        type: "queryAndSplit",
        selector: ".material-halfbox ul li",
        separator: "…",
    }
};
//# sourceMappingURL=parseIngredients.js.map