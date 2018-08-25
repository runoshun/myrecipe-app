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
const test_commons_1 = require("./test_commons");
const url = require("url");
jest.setTimeout(8 * 1000);
const shouldReturnResult = (urlStr, ingredients) => {
    return test_commons_1.shouldReturnResult(urlStr, ingredients, (url, html) => new Promise((res, rej) => {
        parseIngredients_1.handler({ url, html }, (status, body) => {
            if (status === 200) {
                res(body);
            }
            else {
                rej(body);
            }
        });
    }));
};
describe("parseIngredients works correctly", () => {
    it("should return empty array for unknown url", (done) => __awaiter(this, void 0, void 0, function* () {
        let parsedUrl = url.parse("https://www.google.com");
        let html = yield test_commons_1.getRenderedHtml(parsedUrl);
        yield expect(parseIngredients_1.parse(parsedUrl, html)).resolves.toEqual([]);
        done();
    }));
    it("should return empty array for invalid url", (done) => __awaiter(this, void 0, void 0, function* () {
        let parsedUrl = url.parse("dummy");
        let html = "<html></html>";
        yield expect(parseIngredients_1.parse(parsedUrl, html)).resolves.toEqual([]);
        done();
    }));
    it("should return results (e-recipe) - 1", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://erecipe.woman.excite.co.jp/sp/detail/dbbd0da93c32ee75498536571a569bf1.html", [
            { name: "グリーンアスパラ", amount: "6本" },
            { name: "だし汁", amount: "50ml" },
            { name: "みりん", amount: "小さじ2" },
            { name: "薄口しょうゆ", amount: "大さじ1" },
            { name: "かつお節", amount: "適量" },
        ]);
        done();
    }));
    it("should return results (e-recipe) - 2", (done) => __awaiter(this, void 0, void 0, function* () {
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
    it("should return result (みんなの今日の料理) - 1", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://www.kyounoryouri.jp/recipe/15273_たたききゅうりの酢の物.html", [
            { name: "きゅうり", amount: "2本（200g）" },
            { name: "しょうが", amount: "1/2かけ" },
            { name: "赤とうがらし", amount: "1/2本" },
            { name: "塩", amount: "小さじ1/2" },
            { name: "酢", amount: "大さじ1+1/2" },
            { name: "砂糖", amount: "大さじ1+1/2" },
            { name: "ごま油", amount: "小さじ1" },
        ]);
        done();
    }));
    it("should return result (みんなの今日の料理) - 2", (done) => __awaiter(this, void 0, void 0, function* () {
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
    it("should return result (みんなの今日の料理) - 3", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://www.kyounoryouri.jp/recipe/42584_ツナオムライス.html", [
            { name: "米", amount: "180ml（1合）" },
            { name: "ツナ", amount: "1缶（70g）" },
            { name: "えんどう豆", amount: "40g" },
            { name: "トマトケチャップ", amount: "大さじ5" },
            { name: "卵", amount: "2コ" },
            { name: "塩", amount: "" },
            { name: "バター", amount: "10g" }
        ]);
        done();
    }));
    it("should return result (cookpad) - 1", (done) => __awaiter(this, void 0, void 0, function* () {
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
        done();
    }));
    it("should return result (cookpad) - 2", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://cookpad.com/recipe/4332718", [
            { name: "薄切り豚ロース", amount: "１００g～１５０ｇ" },
            { name: "塩コショウ", amount: "少々" },
            { name: "とんかつの材料（小麦粉、卵、パン粉）", amount: "ご家庭のレシピで" },
        ]);
        done();
    }));
    it("should return result (chef gohan) - 1", (done) => __awaiter(this, void 0, void 0, function* () {
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
    it("should return result (白ごはん.com) - 1", (done) => __awaiter(this, void 0, void 0, function* () {
        yield shouldReturnResult("https://www.sirogohan.com/sp/recipe/nitamago/", [
            { name: "卵", amount: "6個" },
            { name: "醬油", amount: "大さじ4" },
            { name: "水", amount: "大さじ3" },
            { name: "みりん", amount: "大さじ2" },
            { name: "砂糖", amount: "大さじ1" }
        ]);
        done();
    }));
    it("should return result (白ごはん.com) - 2", (done) => __awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VJbmdyZWRpZW50cy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BhcnNlSW5ncmVkaWVudHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQWlFO0FBQ2pFLGlEQUE4RjtBQUM5RiwyQkFBMkI7QUFFM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFFMUIsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxXQUF3QixFQUFFLEVBQUU7SUFDcEUsT0FBTyxpQ0FBcUIsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDdEYsMEJBQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNwQyxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUU7Z0JBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNiO2lCQUFNO2dCQUNILEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ1IsQ0FBQyxDQUFBO0FBRUQsUUFBUSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtJQUU5QyxFQUFFLENBQUMsMkNBQTJDLEVBQUUsQ0FBTyxJQUFJLEVBQUUsRUFBRTtRQUMzRCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDcEQsSUFBSSxJQUFJLEdBQUcsTUFBTSw4QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sTUFBTSxDQUFDLHdCQUFLLENBQUMsU0FBUyxFQUFFLElBQUksQ0FB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