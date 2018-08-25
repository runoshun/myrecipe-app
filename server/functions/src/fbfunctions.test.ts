import { shouldReturnResult } from "./test_commons";
import fetch from "node-fetch";
import { Ingredients } from "./parseIngredients";

jest.setTimeout(15 * 1000);

const localFunction = (url: string, html: string): Promise<Ingredients> => {
    return fetch("http://localhost:5000/myrecipes-a6c12/us-central1/parseIngredientsHandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, html }),
    }).then(res => {
        if (res.status !== 200) {
            throw res.json();
        } else {
            return res.json();
        }
    });
}

describe("parseIngredients on firebase functions works correctly", () => {

    it("should return results (e-recipe) - 1", async (done) => {
        await shouldReturnResult("https://erecipe.woman.excite.co.jp/sp/detail/dbbd0da93c32ee75498536571a569bf1.html", [
            { name: "グリーンアスパラ", amount: "6本" },
            { name: "だし汁", amount: "50ml" },
            { name: "みりん", amount: "小さじ2" },
            { name: "薄口しょうゆ", amount: "大さじ1" },
            { name: "かつお節", amount: "適量" },
        ], localFunction);
        done();
    });
})