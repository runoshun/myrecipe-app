import { Dispatch } from "redux";

import res from "@root/resources";
import { entities } from "@root/reducers";
import { StoreState } from "@root/store";
import * as Types from "@root/EntityTypes";

import { DispatcherBase } from "@root/utils/redux";
//import { ActionCreator, ErrorPayload } from "@root/utils/redux";
import { ShoppingListFormData, MeelPrepFormData, RecipeFormData } from "@root/reducers/app";
import { Omit } from "@root/utils/types";
import mayBeMultiplyAmount from "@root/common/extractUnit";

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

    private ingredientToShoppingList = (ingredient: Types.Ingredient, recipeId: string, multiply: number): Omit<Types.ShoppingListItemEntity, "id"> => {
        let amount = mayBeMultiplyAmount(ingredient.amount, multiply)
        return {
            name: ingredient.name,
            amount: amount,
            checked: false,
            recipeId: recipeId,
            _version: "1",
            _lastModified: Date.now()
        }
    }

    public addIngredientsToShoppingList = (ingredients: Types.Ingredient[], recipeId: string, multiply= 1) => {
        let shoppingListItems = ingredients.map(i => this.ingredientToShoppingList(i, recipeId, multiply));
        this.dispatch(entities.actions.SHOPPING_LIST.ADD_MANY(shoppingListItems));
    }

    public toggleShoppingListItemChecked = (id: string, checked: boolean) => {
        this.dispatch(entities.actions.SHOPPING_LIST.UPDATE({ id, checked: !checked }));
    }

    public deleteRecipe = (recipe: Types.RecipeEntity) => {
        this.dispatch(entities.actions.RECIPES.DELETE({ id: recipe.id }))
    }

    public undoEntities = () => {
        this.dispatch(entities.actions.UNDO_ENTITIES.UNDO({}))
    }

    public clearShoppingList = () => {
        this.dispatch(entities.actions.SHOPPING_LIST.DELETE_ALL({}));
    }

    public deleteShoppingListItem = (id: string) => {
        this.dispatch(entities.actions.SHOPPING_LIST.DELETE({ id }));
    }

    private shoppingListFormDataToEntity = (data: ShoppingListFormData): Omit<Types.ShoppingListItemEntity, "id" | "checked"> => {
        return {
            name: data.name,
            amount: data.amount,
            recipeId: undefined,
            _version: "1",
            _lastModified: Date.now()
        }
    }

    public addShoppingListItem = (data: ShoppingListFormData) => {
        this.dispatch(entities.actions.SHOPPING_LIST.ADD({
            checked: false,
            ...this.shoppingListFormDataToEntity(data)
        }));
    }

    public updateShoppingListItem = (id: string | string[], data: ShoppingListFormData) => {
        if (typeof id === "string") {
            this.dispatch(entities.actions.SHOPPING_LIST.UPDATE({
                 id,
                 ...this.shoppingListFormDataToEntity(data)
                }));
        } else {
            let amount = mayBeMultiplyAmount(data.amount, 1 / id.length);
            id.forEach(id => {
                this.dispatch(entities.actions.SHOPPING_LIST.UPDATE({
                    ...this.shoppingListFormDataToEntity(data),
                    id,
                    amount,
                }))
            })
        }
    }

    public deleteMeelPrep = (id: string) => {
        this.dispatch(entities.actions.MEEL_PREPS.DELETE({ id }));
    }

    private meelPrepFormDataToEntity = (data: MeelPrepFormData): Omit<Types.MeelPrepEntity, "id"> => {
        return {
            name: data.name,
            amount: data.amount,
            photo: data.photo || res.images.noImage,
            createdAt: data.createdAt,
            expiredAt: data.expiredAt,
            _version: "1",
            _lastModified: Date.now()
        }
    }

    public addMeelPrep = (data: MeelPrepFormData) => {
        this.dispatch(entities.actions.MEEL_PREPS.ADD(this.meelPrepFormDataToEntity(data)))
    }

    public updateMeelPrep = (id: string, data: MeelPrepFormData) => {
        this.dispatch(entities.actions.MEEL_PREPS.UPDATE({
            id,
            ...this.meelPrepFormDataToEntity(data)
        }))
    }

    private recipeFormDataToEntity = (data: RecipeFormData): Omit<Types.RecipeEntity, "id"> => {
        return {
            name: data.name,
            photo: data.photo || res.images.noImage,
            ingredients: this.filterIngredients(data.ingredients),
            url: data.url,
            _version: "1",
            _lastModified: Date.now()
        }
    }

    private filterIngredients = (data: RecipeFormData["ingredients"]): Types.Ingredient[] => {
        return data.map(item => (item.name) ? { name: item.name, amount: item.amount } : undefined)
                   .filter(item => item !== undefined) as Types.Ingredient[];
    }

    public addRecipe = (data: RecipeFormData) => {
        this.dispatch(entities.actions.RECIPES.ADD(this.recipeFormDataToEntity(data)))
    }

    public updateRecipe = (id: string, data: RecipeFormData) => {
        this.dispatch(entities.actions.RECIPES.UPDATE({
            id,
            ...this.recipeFormDataToEntity(data)
        }))
    }
}

export default EntitiesDispatcher;
