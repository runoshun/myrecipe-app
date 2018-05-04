import { EntitiesState } from "@root/reducers";

export const recipes: EntitiesState["recipes"] = {
    "1": {
        id: "1",
        ingredients: [
            { name: "生しゃけ", amount: 2, unit: "切れ", },
            { name: "卵", amount: 1, unit: "個", },
        ],
        name: "西京焼き",
        photo: "https://c-chefgohan.gnst.jp/imgdata/recipe/71/40/4071/rc732x546_1612211250_ed012fb4950cad6099c95ef9124cfc82.jpg",
        url: undefined,
        _version: "1",
        _lastModified: Date.now()
    }, 
    "2": {
        id: "2",
        ingredients: [
            { name: "牛肉", amount: 400, unit: "g", },
            { name: "パプリカ", amount: 2, unit: "個", },
        ],
        name: "スタミナプルコギ 四種類の野菜入り",
        photo: "https://imgc.eximg.jp/i=https%253A%252F%252Fimage.excite.co.jp%252Fjp%252Ferecipe%252Frecipe%252Ff%252Fc%252Ffc49b2799de9c90aea0762181db8d0dc%252Fe34bd90ea6207471105c90c7510dcc07.jpeg&small=350&quality=100&type=jpeg",
        url: "https://erecipe.woman.excite.co.jp/detail/fc49b2799de9c90aea0762181db8d0dc.html",
        _version: "1",
        _lastModified: Date.now()
    }, 
    "3": {
        id: "3",
        ingredients: [
            { name: "牛肉", amount: 400, unit: "g", },
            { name: "パプリカ", amount: 2, unit: "個", },
        ],
        name: "スタミナプルコギ 四種類の野菜入り----------------です00000000",
        photo: "https://imgc.eximg.jp/i=https%253A%252F%252Fimage.excite.co.jp%252Fjp%252Ferecipe%252Frecipe%252Ff%252Fc%252Ffc49b2799de9c90aea0762181db8d0dc%252Fe34bd90ea6207471105c90c7510dcc07.jpeg&small=350&quality=100&type=jpeg",
        url: "https://erecipe.woman.excite.co.jp/detail/fc49b2799de9c90aea0762181db8d0dc.html",
        _version: "1",
        _lastModified: Date.now()
    }, 
}

export const shoppingList: EntitiesState["shoppingList"] = {
    'dc4e0f5c-dcf1-48ff-874a-3be682e04a20': {
        name: '生しゃけ',
        amount: 2,
        unit: '切れ',
        checked: false,
        recipeId: '1',
        id: 'dc4e0f5c-dcf1-48ff-874a-3be682e04a20',
        _version: "1",
        _lastModified: Date.now()
    },
    '2512ebf7-a31e-4a7b-b29c-e68f92ad8790': {
        name: '卵',
        amount: 1,
        unit: '個',
        checked: false,
        recipeId: '1',
        id: '2512ebf7-a31e-4a7b-b29c-e68f92ad8790',
        _version: "1",
        _lastModified: Date.now()

    },
    '23591fe8-c3ba-442e-915b-93c721d9327c': {
        name: '牛肉',
        amount: 400,
        unit: 'g',
        checked: false,
        recipeId: '3',
        id: '23591fe8-c3ba-442e-915b-93c721d9327c',
        _version: "1",
        _lastModified: Date.now()

    },
    'ecbf4eb3-2c2e-4343-9a96-5c48cab53086': {
        name: 'パプリカ',
        amount: 2,
        unit: '個',
        checked: false,
        recipeId: '3',
        id: 'ecbf4eb3-2c2e-4343-9a96-5c48cab53086',
        _version: "1",
        _lastModified: Date.now()

    }
}

export const meelPreps: EntitiesState["meelPreps"] = {
    "1": {
        id: "1",
        name: "西京焼き",
        photo: "https://c-chefgohan.gnst.jp/imgdata/recipe/71/40/4071/rc732x546_1612211250_ed012fb4950cad6099c95ef9124cfc82.jpg",
        createdAt: Date.parse("2018-03-20"),
        expiredAt: Date.parse("2018-03-25"),
        amount: 2,
        _version: "1",
        _lastModified: Date.now()

    }
}