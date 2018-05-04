import * as reduxUtils from "@root/utils/redux";
import { createSelector } from "reselect";
import res from "@root/resources";
import * as Types from "@root/EntityTypes";
import { Omit } from "@root/utils/types";

type EntityExluceCommon = "id" | "_version" | "_lastModified";
export type RecipeFormData = Omit<Types.RecipeEntity, EntityExluceCommon>;
export type RecipeFormErrors = {
    name?: string,
    photo?: string,
    url?: string,
    ingredients: { [key: string]: string | undefined }[]
}
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

    recipeForm: reduxUtils.FormState<RecipeFormData>,
    meelPrepForm: reduxUtils.FormState<MeelPrepFormData>,
    shoppingListForm: reduxUtils.FormState<ShoppingListFormData>,
}

// ===================================================================================== //
//                                       Actions                                         //
// ===================================================================================== //
export const actions = {
    SET_SHOPPING_LIST_TYPE: reduxUtils.action<{ type: ShoppingListType }>("app/shoppingList/setType"),

    RECIPE_FORM: reduxUtils.formAction<RecipeFormData>("app/recipe/form"),
    MEEL_PREP_FORM: reduxUtils.formAction<MeelPrepFormData>("app/meelPrep/form"),
    SHOPPING_LIST_FORM: reduxUtils.formAction<ShoppingListFormData>("app/shoppingList/form"),
}

// ===================================================================================== //
//                                       Reducers                                        //
// ===================================================================================== //

export const recipesReducer = new reduxUtils.ReducerBuilder<RecipesState>({
    filter: "",
})
    .build();

export const recipeFormReducer = new reduxUtils.FormReducerBuilder<RecipeFormData>(
    {
        ingredients: [],
        name: "",
        photo: "",
        url: ""
    },
    actions.RECIPE_FORM,
    {
        name: x => x,
        photo: x => x,
        url: x => x,
        ingredients: x => JSON.parse(x) 
    }
).build()

export const meelPrepsReducer = new reduxUtils.ReducerBuilder<MeelPrepsState>({
    filter: "",
})
    .build();

export const meelPrepFormReducer = new reduxUtils.FormReducerBuilder<MeelPrepFormData>(
    {
        name: "",
        amount: NaN,
        createdAt: undefined,
        expiredAt: undefined,
        photo: ""
    },
    actions.MEEL_PREP_FORM,
    {
        name: x => x,
        amount: parseInt,
        createdAt: Date.parse,
        expiredAt: Date.parse,
        photo: x => x,
    }
).build();

export const shoppingListReducer = new reduxUtils.ReducerBuilder<ShoppingListState>({
    filter: "",
    listType: "withRecipe",
})
    .case(actions.SET_SHOPPING_LIST_TYPE, (state, payload) => ({
        ...state,
        listType: payload.type,
    }))
    .build();

export const shoppingListFormReducer = new reduxUtils.FormReducerBuilder<ShoppingListFormData>(
    {
        name: "",
        amount: NaN,
        unit: ""
    },
    actions.SHOPPING_LIST_FORM,
    {
        name: x => x,
        amount: parseInt,
        unit: x => x,
    }
).build();

export const reducer = reduxUtils.combineReducers<AppState>({
    recipeForm: recipeFormReducer,
    recipes: recipesReducer,
    meelPreps: meelPrepsReducer,
    meelPrepForm: meelPrepFormReducer,
    shoppingList: shoppingListReducer,
    shoppingListForm: shoppingListFormReducer,
});

// ===================================================================================== //
//                                       Selectors                                       //
// ===================================================================================== //
const shoppingListFormSelector = (state: AppState["shoppingListForm"]) => state;
const meelPrepFormSelector = (state: AppState["meelPrepForm"]) => state;
const recipeFormSelector = (state: AppState["recipeForm"]) => state;

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

const shoppingListItemFormErrorsSelector = createSelector(
    shoppingListFormSelector,
    reduxUtils.createFormValidationSelector<ShoppingListFormData>({
        name: notEmpty(res.strings.shoppingListFormErrorNameRequired()),
        amount: numberOrEmpty(res.strings.shoppingListFormErrorAmountIsNonNumber()),
    })
);

const meelPrepFormErrorsSelector = createSelector(
    meelPrepFormSelector,
    reduxUtils.createFormValidationSelector<MeelPrepFormData>({
        name: notEmpty(res.strings.meelPrepFormErrorNameRequired()),
        amount: numberOrEmpty(res.strings.meelPrepFormErrorAmountIsNonNumber()),
        createdAt: dateOrEmpty(res.strings.meelPrepFormErrorInValidDate()),
        expiredAt: dateOrEmpty(res.strings.meelPrepFormErrorInValidDate())
    })
)

const recipeFormErrorsSelector = createSelector(
    recipeFormSelector,
    reduxUtils.createFormValidationSelector<RecipeFormData, RecipeFormErrors>({
        name: notEmpty(res.strings.recipeFormErrorNameRequired()),
        ingredients: (data) => {
            let hasError = false;
            let errors = data.map(ing => {
                let errors = {} as { [P in keyof Types.Ingredient]: string };
                if((ing.amount || ing.unit) && !ing.name) {
                    errors["name"] = res.strings.recipeFormErrorIngredientNameRequired();
                    hasError = true
                }
                return errors;
            });
            if(hasError) {
                return errors;
            } else {
                return;
            }
        }
    })
)

export const selectors = {
    shoppingListItemFormErrorsSelector,
    meelPrepFormErrorsSelector,
    recipeFormErrorsSelector,
}

// ===================================================================================== //
//                                        Exports                                        //
// ===================================================================================== //
export default {
    reducer,
    actions,
    selectors,
} 