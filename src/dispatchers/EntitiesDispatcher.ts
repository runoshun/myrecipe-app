import { Dispatch } from "redux";

import res from "@root/resources";
import { entities } from "@root/reducers";
import { StoreState } from "@root/store";
import * as Types from "@root/EntityTypes";

import { DispatcherBase, ActionCreator, ErrorPayload } from "@root/utils/redux";
import { ShoppingListFormData, MeelPrepFormData, RecipeFormData } from "@root/reducers/app";

export class EntitiesDispatcher extends DispatcherBase<StoreState> {

    constructor(dispatch: Dispatch<any>) {
        super(dispatch)
    }

    private defaultErrorHandler = (dispatch: Dispatch<any>, actionCreator: ActionCreator<ErrorPayload, never>, e: any) => {
        let code, message;
        code = e.code || -1;
        message = e.message || e.toString();
        dispatch(actionCreator({ code, message }));
    }

    private ingredientToShoppingList = (ingredient: Types.Ingredient, recipeId: string, multiply: number) => ({
        name: ingredient.name,
        amount: (ingredient.amount * multiply),
        unit: ingredient.unit,
        checked: false,
        recipeId: recipeId,
    })

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
        this.dispatch(entities.actions.UNDO_ENTITIES({}))
    }

    public clearShoppingList = () => {
        this.dispatch(entities.actions.SHOPPING_LIST.DELETE_ALL({}));
    }

    public deleteShoppingListItem = (id: string) => {
        this.dispatch(entities.actions.SHOPPING_LIST.DELETE({ id }));
    }

    public addShoppingListItem = (data: ShoppingListFormData) => {
        this.dispatch(entities.actions.SHOPPING_LIST.ADD({
            name: data.name,
            amount: parseInt(data.amount),
            unit: data.unit,
            checked: false,
            recipeId: undefined,
        }))
    }

    public updateShoppingListItem = (id: string | string[], data: ShoppingListFormData) => {
        if (typeof id === "string") {
            this.dispatch(entities.actions.SHOPPING_LIST.UPDATE({
                id,
                name: data.name,
                amount: parseInt(data.amount),
                unit: data.unit,
                checked: false,
            }))
        } else {
            let amount = parseInt(data.amount) / id.length;
            id.forEach(id => {
                this.dispatch(entities.actions.SHOPPING_LIST.UPDATE({
                    id,
                    name: data.name,
                    amount: amount,
                    unit: data.unit,
                    checked: false
                }))
            })
        }
    }

    public deleteMeelPrep = (id: string) => {
        this.dispatch(entities.actions.MEEL_PREPS.DELETE({ id }));
    }

    public addMeelPrep = (data: MeelPrepFormData) => {
        this.dispatch(entities.actions.MEEL_PREPS.ADD({
            name: data.name,
            amount: parseInt(data.amount),
            photo: data.photo || res.images.noImage,
            createdAt: Date.parse(data.createdAt),
            expiredAt: Date.parse(data.expiredAt),
        }))
    }

    public updateMeelPrep = (id: string, data: MeelPrepFormData) => {
        this.dispatch(entities.actions.MEEL_PREPS.UPDATE({
            id,
            name: data.name,
            amount: parseInt(data.amount),
            photo: data.photo || res.images.noImage,
            createdAt: Date.parse(data.createdAt),
            expiredAt: Date.parse(data.expiredAt),
        }))
    }

    private filterIngredients = (data: RecipeFormData["ingredients"]): Types.Ingredient[] => {
        return data.map(item => (item.name && item.unit && item.amount) ? { ...item } as Types.Ingredient : undefined)
                   .filter(item => item !== undefined) as Types.Ingredient[];
    }

    public addRecipe = (data: RecipeFormData) => {
        this.dispatch(entities.actions.RECIPES.ADD({
            name: data.name,
            photo: data.photo || res.images.noImage,
            ingredients: this.filterIngredients(data.ingredients),
            url: data.url,
            tagIds: [],
        }))
    }

    public updateRecipe = (id: string, data: RecipeFormData) => {
        this.dispatch(entities.actions.RECIPES.UPDATE({
            id,
            name: data.name,
            photo: data.photo || res.images.noImage,
            ingredients: data.ingredients as Types.Ingredient[],
            url: data.url,
        }))
    }
}

export default EntitiesDispatcher;
