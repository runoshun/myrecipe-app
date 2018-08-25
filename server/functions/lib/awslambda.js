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
exports.parseIngredientsHandler = (event, _context, callback) => __awaiter(this, void 0, void 0, function* () {
    const send = (code, body) => {
        callback(null, {
            statusCode: code,
            body: JSON.stringify(body),
        });
    };
    parseIngredients_1.default.handler(JSON.parse(event.body || "{}"), send);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzbGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2F3c2xhbWJkYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EseURBQWtEO0FBRXJDLFFBQUEsdUJBQXVCLEdBQUcsQ0FBTyxLQUFzQixFQUFFLFFBQWlCLEVBQUUsUUFBaUMsRUFBRSxFQUFFO0lBRTFILE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBWSxFQUFFLElBQVksRUFBUSxFQUFFO1FBQzlDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDWCxVQUFVLEVBQUUsSUFBSTtZQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7U0FDN0IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBRUQsMEJBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNsRSxDQUFDLENBQUEsQ0FBQSJ9