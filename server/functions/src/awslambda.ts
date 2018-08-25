import { APIGatewayEvent, Context, APIGatewayProxyCallback, } from "aws-lambda";
import parseIngredients from "./parseIngredients";

export const parseIngredientsHandler = async (event: APIGatewayEvent, _context: Context, callback: APIGatewayProxyCallback) => {

    const send = (code: number, body: object): void => {
        callback(null, {
            statusCode: code,
            body: JSON.stringify(body),
        });
    }

    parseIngredients.handler(JSON.parse(event.body || "{}"), send)
}