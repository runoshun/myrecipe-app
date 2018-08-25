import { Ingredient } from "@root/EntityTypes";

// AWS lambda
/*
export default async (url: string, html: string): Promise<Ingredient[]> => {
    return fetch("https://ltmhi8ft77.execute-api.ap-northeast-1.amazonaws.com/dev/parseIngredientsFromHtml", {
        method: "POST",
        headers: { "x-api-key": "6B5brscZeF6XiKffl2FcT8GI0G3jbDTg7q8e3EXc", "Content-Type": "application/json" },
        body: JSON.stringify({ url, html }),
    }).then(res => {
        if (res.status !== 200) {
            throw res.json();
        } else {
            return res.json();
        }
    });
}
*/

// firebase cloud functions
const ENDPOINT = "https://asia-northeast1-myrecipes-a6c12.cloudfunctions.net/parseIngredientsHandler";
export default async (url: string, html: string): Promise<Ingredient[]> => {
    return fetch(ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ url, html }),
    }).then(res => {
        if (res.status !== 200) {
            throw res.json();
        } else {
            return res.json();
        }
    });
}