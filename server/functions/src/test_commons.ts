import * as phantom from "phantom";
import * as url from "url";
import { Ingredients } from "./parseIngredients";

export const shouldReturnResult = async (urlString: string, expected: Ingredients, func: (url: string, html: string) => Promise<Ingredients>) => {
    let parsedUrl = url.parse(urlString);
    let html = await getRenderedHtml(parsedUrl);
    let result = await func(urlString, html);

    let actual = expect(result);
    actual.not.toBeUndefined();
    actual.toHaveLength(expected.length);
    actual.toEqual(expected);
}

export const getRenderedHtml = (url: url.Url): Promise<string> => {
    let phInstance: phantom.PhantomJS;
    let create: (...args: any[]) => Promise<phantom.PhantomJS> = phantom.create
    return create(['--ignore-ssl-errors=yes', '--load-images=no'], { logLevel: "error" })
        .then(instance => { phInstance = instance; return instance.createPage() })
        .then(page => {
            return page.property("viewportSize", { width: 640, height: 960 })
                .then(() => page.property("zoomFactor", 1))
                .then(() => page.setting("userAgent", "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"))
                .then(() => page.open(url.href as string))
                .then(() => page.evaluate(function() { return document.body.innerHTML }))
        })
        .then(html => {
            phInstance.exit();
            return html;
        })
}