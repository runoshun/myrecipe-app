import * as functions from "firebase-functions";
import parseIngredients from "./parseIngredients";

export const parseIngredientsHandler = functions
  .runWith({memory: "128MB"})
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    const send = (status: number, body: object) => {
      res.status(status).header("Content-Type", "application/json").send(JSON.stringify(body));
    };

    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    parseIngredients.handler(body, send);
  });
