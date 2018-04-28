import * as reduxUtils from "@root/utils/redux";
import { createSelector } from "reselect";
import res from "@root/resources";
import * as Types from "@root/EntityTypes";

export type RecipeFormData = {
    name: string,
    photo: string,
    url: string,
    ingredients: Partial<Types.Ingredient>[],
}
export type RecipeFormErrors = {
    name?: string,
    photo?: string,
    url?: string,
    ingredients: { [key: string]: string | undefined }[]
}
export interface RecipesState {
    filter: string,
}

export type MeelPrepFormData = {
    name: string,
    amount: string,
    createdAt: string,
    expiredAt: string,
    photo: string,
}
export interface MeelPrepsState {
    filter: string,
}

export type ShoppingListType = "merged" | "withRecipe";
export type ShoppingListFormData = { 
    name: string,
    amount: string,
    unit: string,
}
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

export const recipeFormReducer = new reduxUtils.FormReducerBuilder<RecipeFormData>({
    ingredients: [],
    name: "",
    photo: "",
    url: ""
}, actions.RECIPE_FORM).build()

export const meelPrepsReducer = new reduxUtils.ReducerBuilder<MeelPrepsState>({
    filter: "",
})
    .build();

export const meelPrepFormReducer = new reduxUtils.FormReducerBuilder<MeelPrepFormData>({
    name: "",
    amount: "",
    createdAt: "",
    expiredAt: "",
    photo: ""
}, actions.MEEL_PREP_FORM).build();

export const shoppingListReducer = new reduxUtils.ReducerBuilder<ShoppingListState>({
    filter: "",
    listType: "withRecipe",
})
    .case(actions.SET_SHOPPING_LIST_TYPE, (state, payload) => ({
        ...state,
        listType: payload.type,
    }))
    .build();

export const shoppingListFormReducer = new reduxUtils.FormReducerBuilder<ShoppingListFormData>({
    name: "",
    amount: "",
    unit: "" 
}, actions.SHOPPING_LIST_FORM)
    .build();

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

const numberOrEmpty = (error: string) => (data: string) => {
    if (!data || data === "") { return; }
    if (isNaN(data as any)) {
        return error;
    }
    return;
}

const dateOrEmpty = (error: string) => (data: string) => {
    if (!data || data === "") { return; }
    if (isNaN(Date.parse(data))) {
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