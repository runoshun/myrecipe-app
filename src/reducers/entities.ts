import { createSelector } from "reselect";

import res from "@root/resources";
import * as reduxUtils from "@root/utils/redux";
import * as Types from "@root/EntityTypes";
import { obj } from "@root/utils";
import { extract as extractUnit, mayBeAddAmount } from "@root/common/extractUnit";

const uuidv4 = require("uuid/v4");

export interface EntitiesState {
    recipes: reduxUtils.EntityState<Types.RecipeEntity>,
    meels: reduxUtils.EntityState<Types.MeelEntity>,
    meelPreps: reduxUtils.EntityState<Types.MeelPrepEntity>,
    shoppingList: reduxUtils.EntityState<Types.ShoppingListItemEntity>,
};

export type UndoableEntitiesState = reduxUtils.UndoableState<EntitiesState>;

// ===================================================================================== //
//                                       Actions                                         //
// ===================================================================================== //
export const actions = {
    RECIPES: reduxUtils.entityAction<Types.RecipeEntity>("recipes"),
    MEELS: reduxUtils.entityAction<Types.MeelEntity>("meels"),
    MEEL_PREPS: reduxUtils.entityAction<Types.MeelPrepEntity>("meelPreps"),
    SHOPPING_LIST: reduxUtils.entityAction<Types.ShoppingListItemEntity>("shoppingList"),

    UNDO_ENTITIES: reduxUtils.undoableAction("entities"),
    REPLACE_ENTITIES: reduxUtils.action<UndoableEntitiesState>("entities/replace"),
}

// ===================================================================================== //
//                                       Reducers                                        //
// ===================================================================================== //

let initialEntities;
if (__DEV__) {
    const testdata = require("./testdata");
    initialEntities = {
        recipes: testdata.recipes,
        shoppingList: testdata.shoppingList,
        meelPreps: testdata.meelPreps,
    }
} else {
    initialEntities = {
        recipes: {},
        shoppingList: {},
        meelPreps: {}
    }
}

const recipeEntitiesReducer = new reduxUtils.EntityReducerBuilder<Types.RecipeEntity>(actions.RECIPES, uuidv4, initialEntities.recipes).build();
const meelEntitiesReducer = new reduxUtils.EntityReducerBuilder<Types.MeelEntity>(actions.MEELS, uuidv4).build();
const meelPrepsEntitiesReducer = new reduxUtils.EntityReducerBuilder<Types.MeelPrepEntity>(actions.MEEL_PREPS, uuidv4, initialEntities.meelPreps).build();
const shoppingListEntitiesReducer = new reduxUtils.EntityReducerBuilder<Types.ShoppingListItemEntity>(actions.SHOPPING_LIST, uuidv4, initialEntities.shoppingList).build();

const undoableReducer = reduxUtils.undoable(
    reduxUtils.combineReducers<EntitiesState>({
        meels: meelEntitiesReducer,
        meelPreps: meelPrepsEntitiesReducer,
        recipes: recipeEntitiesReducer,
        shoppingList: shoppingListEntitiesReducer,
    }),
    actions.UNDO_ENTITIES,
    {
        limit: 1,
    });

export const reducer = reduxUtils.replacable(undoableReducer, actions.REPLACE_ENTITIES);

// ===================================================================================== //
//                                       Selectors                                       //
// ===================================================================================== //
const entitiesSelector = (entities: UndoableEntitiesState) => entities.present;
const recipesSelector = createSelector(entitiesSelector, entities => entities.recipes);
const meelPrepsSelector = createSelector(entitiesSelector, entities => entities.meelPreps);
const shoppingListSelector = createSelector(entitiesSelector, entities => entities.shoppingList);

const recipesArraySelector = createSelector(
    recipesSelector,
    recipes => obj.asArray(recipes)
)

const meelPrepsArraySelector = createSelector(
    meelPrepsSelector,
    meelPreps => obj.asArray(meelPreps)
);

const shoppingListArraySelector = createSelector(
    shoppingListSelector,
    shoppingList => obj.asArray(shoppingList)
)

const mergedShoppingListSelector = createSelector(
    shoppingListArraySelector,
    shoppingList => obj.asArray(shoppingList.reduce((merged, item) => {
        let amount = item.amount;
        let canExtract = false;
        let extracted = extractUnit(item.amount)
        if (extracted) {
            amount = extracted[1];
            canExtract = true;
        }

        let key = item.name + "/" + amount + "/" + item.checked + "/" + canExtract;
        if (merged[key] === undefined) {
            merged[key] = {
                id: [item.id],
                name: item.name,
                amount: item.amount,
                checked: item.checked,
            }
        } else {
            merged[key].id.push(item.id);
            merged[key].amount = mayBeAddAmount(merged[key].amount, item.amount) || item.amount;
        }
        return merged;
    }, ({} as { [key: string]: Types.MergedShoppingListItem }))
));

const withRecipeShoppingListSelector = createSelector(
    shoppingListArraySelector,
    recipesSelector,
    (shoppingList, recipes) => shoppingList.reduce((sectioned, item) => {
        let recipe = item.recipeId && recipes[item.recipeId];
        let recipeName = recipe && recipe.name;
        if (recipeName === undefined) {
            recipeName = res.strings.shoppingListSectionOther();
        }
        if (sectioned[recipeName] === undefined) {
            sectioned[recipeName] = []
        }
        sectioned[recipeName].push(item);
        return sectioned;
    }, {} as { [key: string]: Types.ShoppingListItemEntity[] })
);

export const selectors = {
    recipesArray: recipesArraySelector,
    meelPrepsArray: meelPrepsArraySelector,
    shoppingListArray: shoppingListArraySelector,
    mergedShoppingList: mergedShoppingListSelector,
    withRecipeShoppingList: withRecipeShoppingListSelector,
}

// ===================================================================================== //
//                                        Exports                                        //
// ===================================================================================== //
export default {
    reducer,
    actions,
    selectors,
} 