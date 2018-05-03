export interface EntityCommon<Version> {
    _version: Version,
    _lastModified: number,
}

export interface Ingredient {
    name: string,
    amount: number,
    unit: string,
}

export interface RecipeEntity extends EntityCommon<"1"> {
    id: string,
    name: string,
    photo: string,
    ingredients: Ingredient[],
    url?: string,
}

export interface MeelPrepEntity extends EntityCommon<"1"> {
    id: string,
    name: string,
    amount: number,
    photo?: string,
    createdAt?: number,
    expiredAt?: number,
}

export interface MeelEntity extends EntityCommon<"1"> {
    id: string,
    name: string,
    amount: number,
    photo: string,
    meelPrepId?: string,
}

export interface ShoppingListItemEntity extends EntityCommon<"1"> {
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