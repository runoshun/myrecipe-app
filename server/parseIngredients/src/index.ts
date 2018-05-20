import * as url from "url";
import { APIGatewayEvent, Context, APIGatewayProxyCallback, APIGatewayProxyResult } from "aws-lambda";
import parseIngredients from "./parseIngredients";

const response = (code: number, body: object): APIGatewayProxyResult => {
    return {
        statusCode: code,
        body: JSON.stringify(body),
    }
}

const error = (code: number, message: string): APIGatewayProxyResult => {
    return response(code, { message });
}

export default async (event: APIGatewayEvent, _context: Context, callback: APIGatewayProxyCallback) => {
    try {
        let body = JSON.parse(event.body || "{}");
        if (!body.url || !body.html) {
            return callback(null, error(400, "invalid body"));
        }

        try {
            let parsedUrl = url.parse(body.url)
            if (!parsedUrl.hostname) { throw "" }

            let ingredients = await parseIngredients(parsedUrl, body.html);
            callback(null, response(200, ingredients));
        } catch (e) {
            return callback(null, error(400, "invalied url parameter"));
        }

    } catch (e) {
        callback(null, error(500, e.message || e.toString()));
    }
}