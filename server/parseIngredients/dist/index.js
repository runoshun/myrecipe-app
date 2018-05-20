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
const url = require("url");
const parseIngredients_1 = require("./parseIngredients");
const response = (code, body) => {
    return {
        statusCode: code,
        body: JSON.stringify(body),
    };
};
const error = (code, message) => {
    return response(code, { message });
};
exports.default = (event, _context, callback) => __awaiter(this, void 0, void 0, function* () {
    try {
        let body = JSON.parse(event.body || "{}");
        if (!body.url || !body.html) {
            return callback(null, error(400, "invalid body"));
        }
        try {
            let parsedUrl = url.parse(body.url);
            if (!parsedUrl.hostname) {
                throw "";
            }
            let ingredients = yield parseIngredients_1.default(parsedUrl, body.html);
            callback(null, response(200, ingredients));
        }
        catch (e) {
            return callback(null, error(400, "invalied url parameter"));
        }
    }
    catch (e) {
        callback(null, error(500, e.message || e.toString()));
    }
});
//# sourceMappingURL=index.js.map