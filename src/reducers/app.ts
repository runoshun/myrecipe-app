import * as reduxUtils from "@root/utils/redux";

export interface RecipesState {
    filter: string,
}

export interface MeelPrepsState {
    filter: string,
}

export type ShoppingListType = "merged" | "withRecipe";
export interface ShoppingListState {
    filter: string,
    listType: ShoppingListType,
}

export type AccountType = "free" | "adRemove" | "premium";
export interface SettingsState {
    keepAwakeWhileBrowse: boolean,
    saveImageOnDevice: boolean,
    accountType: AccountType,
    parseIngredientsSuccessCount: number,
    recipesLastUploaded: number,
}

export interface AppState {
    recipes: RecipesState,
    meelPreps: MeelPrepsState,
    shoppingList: ShoppingListState,
    settings: SettingsState,
}

// ===================================================================================== //
//                                       Actions                                         //
// ===================================================================================== //
export const actions = {
    SET_SHOPPING_LIST_TYPE: reduxUtils.action<{ type: ShoppingListType }>("app/shoppingList/setType"),

    SET_ACCOUNT_TYPE: reduxUtils.action<{type: AccountType}>("app/settings/setAccountType"),
    SET_KEEP_AWAKE_WHILE_BROWSE: reduxUtils.action<boolean>("app/settings/setKeepAwakeWhileIdle"),
    SET_SAVE_IMAGE_ON_DEVICE: reduxUtils.action<boolean>("app/settings/setSaveImageOnDevice"),
    INCREMENT_PARSE_INGREDIENTS_SUCCESS: reduxUtils.action<undefined>("app/settings/increment_parse_ingredients_success"),
    SET_RECIPES_LAST_UPLOADED: reduxUtils.action<number>("app/settings/set_recipes_last_uploaded"),
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


export const settingsReducer = new reduxUtils.ReducerBuilder<SettingsState>({
    accountType: "free",
    keepAwakeWhileBrowse: true,
    saveImageOnDevice: false,
    parseIngredientsSuccessCount: 0,
    recipesLastUploaded: 0,
})
    .case(actions.SET_KEEP_AWAKE_WHILE_BROWSE, (state, payload) => ({
        ...state,
        keepAwakeWhileBrowse: payload
    }))
    .case(actions.SET_SAVE_IMAGE_ON_DEVICE, (state, payload) => ({
        ...state,
        saveImageOnDevice: payload
    }))
    .case(actions.SET_ACCOUNT_TYPE, (state, payload) => ({
        ...state,
        accountType: payload.type
    }))
    .case(actions.INCREMENT_PARSE_INGREDIENTS_SUCCESS, (state, _payload) => ({
        ...state,
        parseIngredientsSuccessCount: (state.parseIngredientsSuccessCount || 0) + 1
    }))
    .case(actions.SET_RECIPES_LAST_UPLOADED, (state, payload) => ({
        ...state,
        recipesLastUploaded: payload,
    }))
    .build()

export const reducer = reduxUtils.combineReducers<AppState>({
    recipes: recipesReducer,
    meelPreps: meelPrepsReducer,
    shoppingList: shoppingListReducer,
    settings: settingsReducer,
});

// ===================================================================================== //
//                                       Selectors                                       //
// ===================================================================================== //

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