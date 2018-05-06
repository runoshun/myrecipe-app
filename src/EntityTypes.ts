export interface EntityCommon<Version> {
    _version: Version,
    _lastModified: number,
}

export interface Ingredient {
    name: string,
    amount: string,
}

export interface RecipeEntity extends EntityCommon<"1"> {
    id: string,
    name: string,
    photo: string,
    ingredients: Ingredient[],
    url: string | undefined,
}

export interface MeelPrepEntity extends EntityCommon<"1"> {
    id: string,
    name: string,
    amount: number,
    photo: string | undefined,
    createdAt: number | undefined,
    expiredAt: number | undefined,
}

export interface MeelEntity extends EntityCommon<"1"> {
    id: string,
    name: string,
    amount: number,
    photo: string,
    meelPrepId: string | undefined,
}

export interface ShoppingListItemEntity extends EntityCommon<"1"> {
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