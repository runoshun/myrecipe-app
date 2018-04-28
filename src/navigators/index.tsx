import * as React from "react";
import { StoreState } from "../store";
import { NavigationState } from "react-navigation";
import { createTabNavigator, Router as _Router, createStackNavigator, bindCreateAnchor } from "@root/utils/navigation";

import res from "@root/resources";
import { Icon } from "@root/views/components/common";

export interface NavigatorsState {
    mainTabState: NavigationState,
    rootStackState: NavigationState,
}

type Routes = 
    typeof MainTab.routes &
    typeof RootStack.routes;

export class Router extends _Router<Routes> { };
export const createAnchor = bindCreateAnchor<Routes>();


const RecipesScreen = require("@root/views/screens/RecipesScreen").default;
const MeelPrepsScreen = require("@root/views/screens/MeelPrepsScreen").default;
const ShoppingListScreen = require("@root/views/screens/ShoppingListScreen").default;

export const MainTab = createTabNavigator({
    navState: (state: StoreState) => state.mainTabState,
    routes: {
        Recipes: {
            navigationOptions: {
                tabBarIcon: (param: { tintColor: string }) => <Icon size={24} color={param.tintColor} name="book" />,
                tabBarLabel: res.strings.tabbarLabelRecipes(),
            },
            screen: RecipesScreen
        },
        MeelPreps: { 
            navigationOptions: {
                tabBarIcon: (param: { tintColor: string }) => <Icon size={24} color={param.tintColor} name="restaurant" />,
                tabBarLabel: res.strings.tabbarLabelStocks(),
            },
            screen: MeelPrepsScreen,
        },
        ShoppingList: {
            navigationOptions: {
                tabBarIcon: (param: { tintColor: string }) => <Icon size={24} color={param.tintColor} name="cart" />,
                tabBarLabel: res.strings.tabbarLabelShoppingList(),
            },
            screen: ShoppingListScreen
        }
    },
    config: {
        backBehavior: "none",
        tabBarPosition: "bottom",
        animationEnabled: true,
        tabBarOptions: {
            activeTintColor: res.colors.accent,
            labelStyle: {
                fontSize: 14,
            }
        }
    },
});


const RecipeDetailScreen = require("@root/views/screens/RecipeDetailScreen").default;
const WebBrowserScreen = require("@root/views/screens/WebBrowserScreen").default;
const ShoppingListItemFormScreen = require("@root/views/screens/ShoppingListFormScreen").default;
const MeelPrepFormScreen = require("@root/views/screens/MeelPrepFormScreen").default;
const RecipeFormScreen = require("@root/views/screens/RecipeFormScreen").default;

export const RootStack = createStackNavigator({
    navState: (state: StoreState) => state.rootStackState,
    routes: {
        MainTab: { screen: MainTab.Component },
        RecipeDetail: { screen: RecipeDetailScreen, },
        ShoppingListItemForm: { screen: ShoppingListItemFormScreen },
        MeelPrepForm: { screen: MeelPrepFormScreen },
        RecipeForm: { screen: RecipeFormScreen },
        WebBrowser: { screen: WebBrowserScreen },
    },
    config: {
        headerMode: "none"
    }
});

export const reducers = {
    mainTabState: MainTab.reducer,
    rootStackState: RootStack.reducer,
}

export default { 
    Main: RootStack.Component,
    Router,
    reducers,
    middlewares: [MainTab.middleware],
    createAnchor
};
