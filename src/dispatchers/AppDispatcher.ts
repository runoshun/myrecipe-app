import { Dispatch } from "redux";

import api from "@root/api";
import app, { ShoppingListType, AccountType } from "@root/reducers/app";
import { StoreState } from "@root/store";

import { DispatcherBase } from "@root/utils/redux";
import { Router } from "@root/navigators";
import { Ingredient } from "@root/EntityTypes";
//import { ActionCreator, ErrorPayload } from "@root/utils/redux";

export class AppDispatcher extends DispatcherBase<StoreState> {

    private router: Router;

    constructor(dispatch: Dispatch<any>) {
        super(dispatch)
        this.router = new Router(dispatch)
    }

    // private defaultErrorHandler = (dispatch: Dispatch<any>, actionCreator: ActionCreator<ErrorPayload, never>, e: any) => {
    //     let code, message;
    //     code = e.code || -1;
    //     message = e.message || e.toString();
    //     dispatch(actionCreator({ code, message }));
    // }

    public setShoppingListType = (type: ShoppingListType) => {
        this.dispatch(app.actions.SET_SHOPPING_LIST_TYPE({ type }))
    }

    public addRecipeFromWebPage = async (title: string, url: string, photo: string, html: string) => {

        let ingredients: Ingredient[] = [];
        try {
            ingredients = await api.web.parseIngredientsFromHtml(url, html);
        } catch(e) {
            // do nothing
            console.log(e);
        }

        // avoid cyclic deps
        const { RecipeFormScreen } = require("@root/views/screens/RecipeFormScreen");
        this.router.navigate(RecipeFormScreen.anchor, { 
            id: undefined, 
            data: { 
                name: title,
                url: url,
                photo: photo,
                ingredients: ingredients.filter(i => !(i.name === "" || i.name == undefined)),
            }
        });
    }

    public debugSetToAccountType = (type: AccountType) => {
        this.dispatch(app.actions.SET_ACCOUNT_TYPE({ type }));
    }

    public setKeepAwakeWhileBrowse = (value: boolean) => {
        this.dispatch(app.actions.SET_KEEP_AWAKE_WHILE_BROWSE(value));
    }
}

export default AppDispatcher;
