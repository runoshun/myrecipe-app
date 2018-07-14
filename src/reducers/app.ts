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
export interface AccountState {
    accountType: AccountType,
}

export interface SettingsState {
    keepAwakeWhileBrowse: boolean,
}

export interface AppState {
    recipes: RecipesState,
    meelPreps: MeelPrepsState,
    shoppingList: ShoppingListState,
    account: AccountState,
    settings: SettingsState,
}

// ===================================================================================== //
//                                       Actions                                         //
// ===================================================================================== //
export const actions = {
    SET_SHOPPING_LIST_TYPE: reduxUtils.action<{ type: ShoppingListType }>("app/shoppingList/setType"),
    SET_ACCOUNT_TYPE: reduxUtils.action<{type: AccountType}>("app/account/setAccountType"),
    SET_KEEP_AWAKE_WHILE_BROWSE: reduxUtils.action<boolean>("app/settings/setKeepAwakeWhileIdle"),
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

export const accountReducer = new reduxUtils.ReducerBuilder<AccountState>({
    accountType: "free"
})
    .case(actions.SET_ACCOUNT_TYPE, (state, payload) => ({
        ...state,
        accountType: payload.type
    }))
    .build();

export const settingsReducer = new reduxUtils.ReducerBuilder<SettingsState>({
    keepAwakeWhileBrowse: true
})
    .case(actions.SET_KEEP_AWAKE_WHILE_BROWSE, (state, payload) => ({
        ...state,
        keepAwakeWhileBrowse: payload
    }))
    .build()

export const reducer = reduxUtils.combineReducers<AppState>({
    recipes: recipesReducer,
    meelPreps: meelPrepsReducer,
    shoppingList: shoppingListReducer,
    account: accountReducer,
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