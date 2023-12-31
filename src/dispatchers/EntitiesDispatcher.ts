import { Dispatch } from "redux";

import res from "@root/resources";
import { entities } from "@root/reducers";
import { StoreState } from "@root/store";
import * as Types from "@root/EntityTypes";

import { DispatcherBase } from "@root/utils/redux";
//import { ActionCreator, ErrorPayload } from "@root/utils/redux";
import { ShoppingListFormData, MeelPrepFormData, RecipeFormData } from "@root/reducers/form";
import { Omit } from "@root/utils/types";
import api from "@root/api";

import entitiesStateSchama from "@root/resources/schema/entitesState";

export class EntitiesDispatcher extends DispatcherBase<StoreState> {

    constructor(dispatch: Dispatch<any>) {
        super(dispatch)
    }

    // private defaultErrorHandler = (dispatch: Dispatch<any>, actionCreator: ActionCreator<ErrorPayload, never>, e: any) => {
    //     let code, message;
    //     code = e.code || -1;
    //     message = e.message || e.toString();
    //     dispatch(actionCreator({ code, message }));
    // }

    public undoEntities = () => {
        this.dispatch(entities.actions.UNDO_ENTITIES.UNDO({}))
    }

    private ingredientToShoppingList = (ingredient: Types.Ingredient, recipeId: string, multiply: number): Omit<Types.ShoppingListItemEntity, "id"> => {
        let amount = api.units.mayBeMultiplyAmount(ingredient.amount, multiply)
        return {
            name: ingredient.name,
            amount: amount,
            checked: false,
            recipeId: recipeId,
        }
    }

    public addIngredientsToShoppingList = (ingredients: Types.Ingredient[], recipeId: string, multiply= 1) => {
        let shoppingListItems = ingredients.map(i => this.ingredientToShoppingList(i, recipeId, multiply));
        this.dispatch(entities.actions.SHOPPING_LIST.ADD_MANY(shoppingListItems));
    }

    public deleteRecipe = (recipe: Types.RecipeEntity) => {
        this.dispatch(entities.actions.RECIPES.DELETE({ id: recipe.id }));
    }

    public toggleShoppingListItemChecked = (id: string, checked: boolean) => {
        this.dispatch(entities.actions.SHOPPING_LIST.UPDATE({ id, checked: !checked }));
    }

    public clearShoppingList = () => {
        this.dispatch(entities.actions.SHOPPING_LIST.DELETE_ALL({}));
    }

    public deleteShoppingListItem = (id: string) => {
        this.dispatch(entities.actions.SHOPPING_LIST.DELETE({ id }));
    }

    private shoppingListFormDataToEntity = (data: ShoppingListFormData): Omit<Types.ShoppingListItemEntity, "id" | "checked"> => {
        return {
            name: data.name || "",
            amount: data.amount || "",
            recipeId: undefined,
        }
    }

    public submitShoppingListForm = (id: string | string[] | undefined, data: ShoppingListFormData) => {
        if (id === undefined) {
            this.dispatch(entities.actions.SHOPPING_LIST.ADD({
                checked: false,
                ...this.shoppingListFormDataToEntity(data)
            }));
        }
        else {
            if (typeof id === "string") {
                this.dispatch(entities.actions.SHOPPING_LIST.UPDATE({
                    id,
                    ...this.shoppingListFormDataToEntity(data)
                }));
            } else {
                let amount = api.units.mayBeMultiplyAmount(data.amount || "", 1 / id.length);
                id.forEach(id => {
                    this.dispatch(entities.actions.SHOPPING_LIST.UPDATE({
                        ...this.shoppingListFormDataToEntity(data),
                        id,
                        amount,
                    }))
                })
            }
        }
    }

    public deleteMeelPrep = (id: string) => {
        this.dispatch(entities.actions.MEEL_PREPS.DELETE({ id }));
    }

    private meelPrepFormDataToEntity = (data: MeelPrepFormData): Omit<Types.MeelPrepEntity, "id"> => {
        return {
            name: data.name || "",
            amount: parseInt(data.amount || ""),
            photo: data.photo || res.images.noImage,
            createdAt: data.createdAt !== undefined ? Date.parse(data.createdAt) : undefined,
            expiredAt: data.expiredAt !== undefined ? Date.parse(data.expiredAt) : undefined,
        }
    }

    public submitMeelPrepForm = (id: string | undefined, data: MeelPrepFormData) => {
        if (id === undefined) {
            this.dispatch(entities.actions.MEEL_PREPS.ADD(this.meelPrepFormDataToEntity(data)))
        } else {
            this.dispatch(entities.actions.MEEL_PREPS.UPDATE({
                id,
                ...this.meelPrepFormDataToEntity(data)
            }))
        }
    }

    private recipeFormDataToEntity = (data: RecipeFormData): Omit<Types.RecipeEntity, "id"> => {
        return {
            name: data.name || "",
            photo: data.photo,
            photoSecondary: data.photoSecondary,
            ingredients: this.filterIngredients(data.ingredients),
            url: data.url,
        }
    }

    private filterIngredients = (data: RecipeFormData["ingredients"]): Types.Ingredient[] => {
        if (data !== undefined) {
            return data.map(item => item.name ? { name: item.name, amount: item.amount } : undefined)
                       .filter(item => item !== undefined) as Types.Ingredient[];
        } else {
            return [];
        }
    }

    public submitRecipeForm = (id: string | undefined, data: RecipeFormData) => {
        if (id === undefined) {
            this.dispatch(entities.actions.RECIPES.ADD(this.recipeFormDataToEntity(data)))
        } else {
            this.dispatch(entities.actions.RECIPES.UPDATE({
                id,
                ...this.recipeFormDataToEntity(data)
            }));
        }
    }

    public importData = (data: any) => {
        const Ajv = require("ajv");
        let ajv = new Ajv();
        let valid = ajv.validate(entitiesStateSchama, data);
        if (!valid) {
           throw (ajv.errors);
        } else {
            this.dispatch(entities.actions.REPLACE_ENTITIES(data))
        }
    }
}

export default EntitiesDispatcher;
