export interface Tag {
    id: string,
    name: string,
    color?: string,
}

export interface Tags {
    [id: string]: Tag | undefined;
}

export interface Ingredient {
    name: string,
    amount: number,
    unit: string,
}

export interface RecipeEntity {
    id: string,
    name: string,
    photo: string,
    ingredients: Ingredient[],
    tagIds: string[],
    url?: string,
}

export interface MeelPrepEntity {
    id: string,
    name: string,
    amount: number,
    photo?: string,
    createdAt?: number,
    expiredAt?: number,
}

export interface MeelEntity {
    id: string,
    name: string,
    amount: number,
    photo: string,
    meelPrepId?: string,
}

export interface ShoppingListItemEntity {
    id: string,
    name: string,
    amount: number,
    unit: string,
    checked: boolean,
    recipeId?: string,
}

// Projection Types
export interface MergedShoppingListItem {
    id: string[],
    name: ShoppingListItemEntity["name"],
    amount: ShoppingListItemEntity["amount"],
    unit: ShoppingListItemEntity["unit"],
    checked: ShoppingListItemEntity["checked"],
}