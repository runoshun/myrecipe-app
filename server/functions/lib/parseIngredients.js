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
const url = require("url");
exports.parse = (parsedUrl, html) => __awaiter(this, void 0, void 0, function* () {
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
exports.handler = (body, send) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (!body.url || !body.html) {
            console.info("invalid body: ", body);
            return send(400, { message: "invalid body" });
        }
        let parsedUrl;
        try {
            parsedUrl = url.parse(body.url);
            if (!parsedUrl.hostname) {
                throw "";
            }
        }
        catch (e) {
            console.info("invalid url: ", body.url);
            return send(400, { message: "invalied url parameter" });
        }
        let ingredients = yield exports.parse(parsedUrl, body.html);
        send(200, ingredients);
    }
    catch (e) {
        send(500, e.message || e.toString());
    }
});
exports.default = {
    parse: exports.parse,
    handler: exports.handler
};
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
    return text.replace(/・/g, "").replace(/　/g, "").replace(/\s+/g, "").trim();
};
const parseSpecs = {
    "erecipe.woman.excite.co.jp/sp": {
        type: "simpleQuery",
        names: "#change_material .simplelist .material_name",
        amounts: "#change_material .simplelist .amount",
    },
    "www.kyounoryouri.jp": {
        type: "simpleQuery",
        names: "#ingredients_list dt .ingredient, #ingredients_list dt a",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VJbmdyZWRpZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJzZUluZ3JlZGllbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQ0FBbUM7QUFDbkMsMkJBQTJCO0FBa0JkLFFBQUEsS0FBSyxHQUFHLENBQU8sU0FBa0IsRUFBRSxJQUFZLEVBQXdCLEVBQUU7SUFDbEYsTUFBTSxZQUFZLEdBQUksU0FBUyxDQUFDLFFBQW1CLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztJQUNyRSxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuRixJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ1gsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNmLEtBQUssYUFBYTtZQUNkLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ2pGLEtBQUssZUFBZTtZQUNoQixPQUFPLG9CQUFvQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRTtZQUNJLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQ3hEO0FBQ0wsQ0FBQyxDQUFBLENBQUE7QUFPWSxRQUFBLE9BQU8sR0FBRyxDQUFPLElBQWEsRUFBRSxJQUF5QyxFQUFFLEVBQUU7SUFD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