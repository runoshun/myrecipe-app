import * as cheerio from "cheerio";
import * as url from "url";

interface Ingredient {
    name: string,
    amount: string,
}

export type Ingredients = Ingredient[];

interface SimpleQueryOptions {
    removeChildren?: boolean
}

type ParseSpec =
    | { type: "simpleQuery", names: string, amounts: string, options?: SimpleQueryOptions }
    | { type: "queryAndSplit", selector: string, separator: string }
    ;

export const parse = async (parsedUrl: url.Url, html: string): Promise<Ingredients> => {
    const hostnamePath = (parsedUrl.hostname as string) + parsedUrl.path;
    const specName = Object.keys(parseSpecs).find(key => hostnamePath.startsWith(key));
    if (!specName) {
        return Promise.resolve([]);
    }

    const spec = parseSpecs[specName];
    switch (spec.type) {
        case "simpleQuery":
            return performSimpleQuery(html, spec.names, spec.amounts, spec.options || {})
        case "queryAndSplit":
            return performQueryAndSplit(html, spec.selector, spec.separator);
        default:
            return Promise.reject("unknown parse spec type");
    }
}

export interface ReqBody {
    url?: string,
    html?: string,
}

export const handler = async (body: ReqBody, send: (status: number, body: any) => void) => {
    try {
        if (!body.url || !body.html) {
            console.info("invalid body: url = " + !!body.url + ", html = " + !!body.html + ", typeof body = " + typeof body)
            return send(400, { message: "invalid body" });
        }

        let parsedUrl;
        try {
            parsedUrl = url.parse(body.url)
            if (!parsedUrl.hostname) { throw "" }
        } catch (e) {
            console.info("invalid url: ", body.url)
            return send(400, { message: "invalied url parameter" });
        }

        let ingredients = await parse(parsedUrl, body.html);
        send(200, ingredients);
    } catch (e) {
        console.error("Unknown error", e);
        send(500, e.message || e.toString());
    }
}

export default {
    parse,
    handler
}

const performSimpleQuery = (html: string, namesSelector: string, amountSelector: string, opts: SimpleQueryOptions): Promise<Ingredients> => {
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
        }
    }));
};

const performQueryAndSplit = (html: string, selector: string, separator: string): Promise<Ingredients> => {
    const $html = cheerio.load(html);
    const elems = $html(selector);

    return Promise.resolve(elems.toArray().map(elem => {
        let texts = cheerio(elem).text().split(separator);
        return {
            name: trimUnneeded(texts[0]),
            amount: trimUnneeded(texts[1])
        }
    }));
}

const trimUnneeded = (text: string) => {
    return text.replace(/・/g, "").replace(/　/g, "").replace(/\s+/g, "").trim()
}

const parseSpecs: { [host: string]: ParseSpec } = {
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
}