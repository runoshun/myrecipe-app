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
const phantom = require("phantom");
const url = require("url");
exports.shouldReturnResult = (urlString, expected, func) => __awaiter(this, void 0, void 0, function* () {
    let parsedUrl = url.parse(urlString);
    let html = yield exports.getRenderedHtml(parsedUrl);
    let result = yield func(urlString, html);
    let actual = expect(result);
    actual.not.toBeUndefined();
    actual.toHaveLength(expected.length);
    actual.toEqual(expected);
});
exports.getRenderedHtml = (url) => {
    let phInstance;
    let create = phantom.create;
    return create(['--ignore-ssl-errors=yes', '--load-images=no'], { logLevel: "error" })
        .then(instance => { phInstance = instance; return instance.createPage(); })
        .then(page => {
        return page.property("viewportSize", { width: 640, height: 960 })
            .then(() => page.property("zoomFactor", 1))
            .then(() => page.setting("userAgent", "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"))
            .then(() => page.open(url.href))
            .then(() => page.evaluate(function () { return document.body.innerHTML; }));
    })
        .then(html => {
        phInstance.exit();
        return html;
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9jb21tb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Rlc3RfY29tbW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLDJCQUEyQjtBQUdkLFFBQUEsa0JBQWtCLEdBQUcsQ0FBTyxTQUFpQixFQUFFLFFBQXFCLEVBQUUsSUFBeUQsRUFBRSxFQUFFO0lBQzVJLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckMsSUFBSSxJQUFJLEdBQUcsTUFBTSx1QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV6QyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMzQixNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQSxDQUFBO0FBRVksUUFBQSxlQUFlLEdBQUcsQ0FBQyxHQUFZLEVBQW1CLEVBQUU7SUFDN0QsSUFBSSxVQUE2QixDQUFDO0lBQ2xDLElBQUksTUFBTSxHQUFtRCxPQUFPLENBQUMsTUFBTSxDQUFBO0lBQzNFLE9BQU8sTUFBTSxDQUFDLENBQUMseUJBQXlCLEVBQUUsa0JBQWtCLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQztTQUNoRixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUM7U0FDekUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO2FBQzVELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMxQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUseUlBQXlJLENBQUMsQ0FBQzthQUNoTCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBYyxDQUFDLENBQUM7YUFDekMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNqRixDQUFDLENBQUM7U0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDVCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUE7QUFDVixDQUFDLENBQUEifQ==