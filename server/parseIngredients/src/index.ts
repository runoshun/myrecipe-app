import parseIngredients from "./parseIngredients";
import { APIGatewayEvent, Context, Callback } from "aws-lambda";

export default async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
    try {
        let body = JSON.parse(event.body || "{}");
        if (!body.url || !body.html) {
            callback(new Error("Bad request body"));
        } else {
            callback(null, await parseIngredients(body.url, body.html));
        }
    } catch (e) {
        callback(new Error(e.message));
    }
}