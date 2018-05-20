import { Ingredient } from "@root/EntityTypes";

export default async (url: string, html: string): Promise<Ingredient[]> => {
    return fetch("https://ltmhi8ft77.execute-api.ap-northeast-1.amazonaws.com/dev/parseIngredientsFromHtml", {
        method: "POST",
        headers: { "x-api-key": "6B5brscZeF6XiKffl2FcT8GI0G3jbDTg7q8e3EXc", "Content-Type": "application/json" },
        body: JSON.stringify({ url, html }),
    }).then(res => res.json());
}