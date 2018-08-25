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
const test_commons_1 = require("./test_commons");
const node_fetch_1 = require("node-fetch");
jest.setTimeout(15 * 1000);
const localFunction = (url, html) => {
    return node_fetch_1.default("http://localhost:5000/myrecipes-a6c12/us-central1/parseIngredientsHandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, html }),
    }).then(res => {
        if (res.status !== 200) {
            throw res.json();
        }
        else {
            return res.json();
        }
    });
};
describe("parseIngredients on firebase functions works correctly", () => {
    it("should return results (e-recipe) - 1", (done) => __awaiter(this, void 0, void 0, function* () {
        yield test_commons_1.shouldReturnResult("https://erecipe.woman.excite.co.jp/sp/detail/dbbd0da93c32ee75498536571a569bf1.html", [
            { name: "グリーンアスパラ", amount: "6本" },
            { name: "だし汁", amount: "50ml" },
            { name: "みりん", amount: "小さじ2" },
            { name: "薄口しょうゆ", amount: "大さじ1" },
            { name: "かつお節", amount: "適量" },
        ], localFunction);
        done();
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmJmdW5jdGlvbnMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mYmZ1bmN0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFDcEQsMkNBQStCO0FBRy9CLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBRTNCLE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBVyxFQUFFLElBQVksRUFBd0IsRUFBRTtJQUN0RSxPQUFPLG9CQUFLLENBQUMsMkVBQTJFLEVBQUU7UUFDdEYsTUFBTSxFQUFFLE1BQU07UUFDZCxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7UUFDL0MsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDdEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNWLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7WUFDcEIsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDcEI7YUFBTTtZQUNILE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3JCO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFFRCxRQUFRLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO0lBRXBFLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxDQUFPLElBQUksRUFBRSxFQUFFO1FBQ3RELE1BQU0saUNBQWtCLENBQUMsb0ZBQW9GLEVBQUU7WUFDM0csRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7WUFDbEMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7WUFDL0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7WUFDL0IsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7WUFDbEMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7U0FDakMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNsQixJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQSJ9