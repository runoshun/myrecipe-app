import * as reduxUtils from "@root/utils/redux";
import * as Types from "@root/EntityTypes";
import { Omit } from "@root/utils/types";

type EntityExluceCommon = "id" | "_version" | "_lastModified";
export type RecipeFormData = Omit<Types.RecipeEntity, EntityExluceCommon>;
export interface RecipesState {
    filter: string,
}

export type MeelPrepFormData = Omit<Types.MeelPrepEntity, EntityExluceCommon>;
export interface MeelPrepsState {
    filter: string,
}

export type ShoppingListType = "merged" | "withRecipe";
export type ShoppingListFormData = Omit<Types.ShoppingListItemEntity, EntityExluceCommon | "checked" | "recipeId">;
export interface ShoppingListState {
    filter: string,
    listType: ShoppingListType,
}

export interface AppState {
    recipes: RecipesState,
    meelPreps: MeelPrepsState,
    shoppingList: ShoppingListState,
}

// ===================================================================================== //
//                                       Actions                                         //
// ===================================================================================== //
export const actions = {
    SET_SHOPPING_LIST_TYPE: reduxUtils.action<{ type: ShoppingListType }>("app/shoppingList/setType"),
}

// ===================================================================================== //
//                                       Reducers                                        //
// ===================================================================================== //

export const recipesReducer = new reduxUtils.ReducerBuilder<RecipesState>({
    filter: "",
})
    .build();

export const meelPrepsReducer = new reduxUtils.ReducerBuilder<MeelPrepsState>({
    filter: "",
})
    .build();

export const shoppingListReducer = new reduxUtils.ReducerBuilder<ShoppingListState>({
    filter: "",
    listType: "withRecipe",
})
    .case(actions.SET_SHOPPING_LIST_TYPE, (state, payload) => ({
        ...state,
        listType: payload.type,
    }))
    .build();

export const reducer = reduxUtils.combineReducers<AppState>({
    recipes: recipesReducer,
    meelPreps: meelPrepsReducer,
    shoppingList: shoppingListReducer,
});

// ===================================================================================== //
//                                       Selectors                                       //
// ===================================================================================== //
/*
const notEmpty = (error: string) => (data: string) => {
    if (!data || data === "") {
        return error;
    } else {
        return;
    }
}

const numberOrEmpty = (error: string) => (data: number) => {
    if (isNaN(data as any)) {
        return error;
    }
    return;
}

const dateOrEmpty = (error: string) => (data: number | undefined) => {
    if (data !== undefined && isNaN(data)) {
        return error;
    }
    return;
}
*/

export const selectors = {
}

// ===================================================================================== //
//                                        Exports                                        //
// ===================================================================================== //
export default {
    reducer,
    actions,
    selectors,
} 