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
const parseIngredients_1 = require("./parseIngredients");
const phantom = require("phantom");
jest.setTimeout(30 * 1000);
describe("parseIngredients works correctly", () => {
    it("should return error for unknown url", (done) => __awaiter(this, void 0, void 0, function* () {
        let url = "https://www.google.com";
        let html = yield getRenderedHtml(url);
        yield expect(parseIngredients_1.default(url, html)).rejects.toBeInstanceOf(parseIngredients_1.ParseError);
        done();
    }));
    it("should return error for invalid url", (done) => __awaiter(this, void 0, void 0, function* () {
        let url = "dummy";
        let html = "<html></html>";
        yield expect(parseIngredients_1.default(url, html)).rejects.toBeInstanceOf(parseIngredients_1.ParseError);
        done();
    }));
    it("should return results (e-recipe)", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://erecipe.woman.excite.co.jp/sp/detail/dbbd0da93c32ee75498536571a569bf1.html", [
            { name: "グリーンアスパラ", amount: "6本" },
            { name: "だし汁", amount: "50ml" },
            { name: "みりん", amount: "小さじ2" },
            { name: "薄口しょうゆ", amount: "大さじ1" },
            { name: "かつお節", amount: "適量" },
        ]);
        yield shouldReturnResult("https://erecipe.woman.excite.co.jp/sp/detail/a3f5b3692ef8e4096c97f4a6e403f4d5.html", [
            { name: "シイタケ", amount: "6個" },
            { name: "パン粉", amount: "大さじ2" },
            { name: "粉チーズ", amount: "大さじ1" },
            { name: "ニンニク", amount: "小さじ1/2" },
            { name: "ドライパセリ", amount: "少々" },
            { name: "オリーブ油", amount: "大さじ1" },
            { name: "塩コショウ", amount: "少々", }
        ]);
        done();
    }));
    it("should return result (みんなの今日の料理)", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://www.kyounoryouri.jp/recipe/15273_たたききゅうりの酢の物.html", [
            { name: "きゅうり", amount: "2本（200g）" },
            { name: "しょうが", amount: "1/2かけ" },
            { name: "赤とうがらし", amount: "1/2本" },
            { name: "塩", amount: "小さじ1/2" },
            { name: "酢", amount: "大さじ1+1/2" },
            { name: "砂糖", amount: "大さじ1+1/2" },
            { name: "ごま油", amount: "小さじ1" },
        ]);
        yield shouldReturnResult("https://www.kyounoryouri.jp/recipe/10841_新たまねぎと豚肉の南蛮漬け.html", [
            { name: "新たまねぎ", amount: "1コ（250g）" },
            { name: "豚もも肉", amount: "150g" },
            { name: "酢", amount: "大さじ2" },
            { name: "だし", amount: "大さじ2" },
            { name: "しょうゆ", amount: "大さじ1+1/2" },
            { name: "砂糖", amount: "大さじ1" },
            { name: "赤とうがらし", amount: "1/2本" },
            { name: "塩", amount: "少々" },
            { name: "こしょう", amount: "少々" },
            { name: "かたくり粉", amount: "適量" },
            { name: "揚げ油", amount: "適量" },
        ]);
        done();
    }));
    it("should return result (cookpad)", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://cookpad.com/recipe/3241988", [
            { name: "米", amount: "２合分" },
            { name: "（今回そのうち大さじ２を", amount: "もち米にしています）" },
            { name: "えんどう豆", amount: "2つかみ分程度（さやごと）" },
            { name: "＊豆の分量として", amount: "１２５cc前後" },
            { name: "塩（さやの下処理用）", amount: "少々" },
            { name: "水", amount: "お米２合分ﾏｲﾅｽ大さじ1.5" },
            { name: "日本酒", amount: "大さじ1" },
            { name: "みりん", amount: "小さじ1" },
            { name: "塩", amount: "少々～" },
            { name: "昆布茶", amount: "小さじ1" }
        ]);
        yield shouldReturnResult("https://cookpad.com/recipe/4332718", [
            { name: "薄切り豚ロース", amount: "１００g～１５０ｇ" },
            { name: "塩コショウ", amount: "少々" },
            { name: "とんかつの材料（小麦粉、卵、パン粉）", amount: "ご家庭のレシピで" },
        ]);
        done();
    }));
    it("should return result (chef gohan)", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://chefgohan.gnavi.co.jp/detail/1710/", [
            { name: "カボチャ", amount: "1/4" },
            { name: "鷹の爪", amount: "お好み" },
            { name: "白ゴマ", amount: "適量" },
            { name: "醤油", amount: "大さじ3" },
            { name: "みりん", amount: "大さじ1" },
            { name: "砂糖", amount: "大さじ2" },
            { name: "だし汁", amount: "大さじ3" },
            { name: "ゴマ油", amount: "適量" },
            { name: "大葉", amount: "一枚" }
        ]);
        done();
    }));
    it("should return result (白ごはん.com)", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://www.sirogohan.com/sp/recipe/nitamago/", [
            { name: "卵", amount: "6個" },
            { name: "醬油", amount: "大さじ4" },
            { name: "水", amount: "大さじ3" },
            { name: "みりん", amount: "大さじ2" },
            { name: "砂糖", amount: "大さじ1" }
        ]);
        yield shouldReturnResult("https://www.sirogohan.com/sp/recipe/nikudouhu/", [
            { name: "牛こま切れ肉", amount: "200ｇ" },
            { name: "木綿豆腐", amount: "1と1/2丁（計450ｇほど）" },
            { name: "玉ねぎ", amount: "1個" },
            { name: "椎茸", amount: "4枚" },
            { name: "えのき茸", amount: "100ｇ" },
            { name: "醬油", amount: "大さじ5" },
            { name: "酒", amount: "大さじ4" },
            { name: "みりん", amount: "大さじ4" },
            { name: "砂糖", amount: "大さじ2" },
            { name: "水", amount: "100ml" }
        ]);
        done();
    }));
});
const shouldReturnResult = (url, expected) => __awaiter(this, void 0, void 0, function* () {
    let html = yield getRenderedHtml(url);
    let result = yield parseIngredients_1.default(url, html);
    debugger;
    let actual = expect(result);
    actual.not.toBeUndefined();
    actual.toHaveLength(expected.length);
    actual.toEqual(expected);
});
const getRenderedHtml = (url) => {
    let phInstance;
    let create = phantom.create;
    return create(['--ignore-ssl-errors=yes', '--load-images=no'], { logLevel: "error" })
        .then(instance => { phInstance = instance; return instance.createPage(); })
        .then(page => {
        return page.property("viewportSize", { width: 640, height: 960 })
            .then(() => page.property("zoomFactor", 1))
            .then(() => page.setting("userAgent", "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"))
            .then(() => page.open(url))
            .then(() => page.evaluate(function () { return document.body.innerHTML; }));
    })
        .then(html => {
        phInstance.exit();
        return html;
    });
};
//# sourceMappingURL=parseIngredients.test.js.map