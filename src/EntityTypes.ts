export interface Ingredient {
    name: string,
    amount: string,
}

export interface RecipeEntity {
    id: string,
    name: string,
    photo?: string,
    photoSecondary?: string,
    ingredients: Ingredient[],
    url: string | undefined,
}

export interface MeelPrepEntity {
    id: string,
    name: string,
    amount: number,
    photo: string | undefined,
    createdAt: number | undefined,
    expiredAt: number | undefined,
}

export interface ShoppingListItemEntity {
    id: string,
    name: string,
    amount: string,
    checked: boolean,
    recipeId?: string,
}

// Projection Types
export interface MergedShoppingListItem {
    id: string[],
    name: ShoppingListItemEntity["name"],
    amount: ShoppingListItemEntity["amount"],
    checked: ShoppingListItemEntity["checked"],
}