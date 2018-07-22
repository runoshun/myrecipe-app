import { Dispatch, AnyAction } from "redux";

import api from "@root/api";
import app, { ShoppingListType, AccountType } from "@root/reducers/app";
import entities from "@root/reducers/entities";
import { StoreState } from "@root/store";

import { DispatcherBase } from "@root/utils/redux";
import { Router } from "@root/navigators";
import { Ingredient } from "@root/EntityTypes";
import firebase from "react-native-firebase";
import { ThunkAction } from "redux-thunk";
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

    public signInAnonymously = async () => {
        let user = await firebase.auth().signInAnonymously();
        return user.uid;
    }

    public uploadRecipesIfModified = async (userId: string) => {
        return new Promise((res, rej) => {
            let thunkAction: ThunkAction<void, StoreState, void, AnyAction> = (dispatch, getState) => {
                let state = getState();
                let lastModified = entities.selectors.recipesLastModified(state.entities);
                let lastUploaded = state.app.settings.recipesLastUploaded;

                if (lastModified > lastUploaded) {
                    let recipes = JSON.stringify(state.entities.present.recipes);
                    firebase.storage().ref(`recipes/${userId}/data.json`).putString(recipes).then(_result => {
                        dispatch(app.actions.SET_RECIPES_LAST_UPLOADED(Date.now()));
                        res();
                    },
                        error => rej(error));
                }

                res();
            }

            this.dispatch(thunkAction);
        });
    }

    public setShoppingListType = (type: ShoppingListType) => {
        this.dispatch(app.actions.SET_SHOPPING_LIST_TYPE({ type }))
    }

    public addRecipeFromWebPage = async (title: string, url: string, photo: string, html: string) => {

        let ingredients: Ingredient[] = [];
        try {
            firebase.analytics().logEvent("PARSE_INGREDIENT", { url });
            ingredients = await api.web.parseIngredientsFromHtml(url, html);
        } catch(e) {
            // do nothing
            console.log(e);
        }

        return () => {
            if (ingredients.length > 0) {
                this.dispatch(app.actions.INCREMENT_PARSE_INGREDIENTS_SUCCESS(undefined));
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
    }

    public debugSetToAccountType = (type: AccountType) => {
        this.dispatch(app.actions.SET_ACCOUNT_TYPE({ type }));
    }

    public setKeepAwakeWhileBrowse = (value: boolean) => {
        this.dispatch(app.actions.SET_KEEP_AWAKE_WHILE_BROWSE(value));
    }

    public setSaveImageOnDevice = (value: boolean) => {
        this.dispatch(app.actions.SET_SAVE_IMAGE_ON_DEVICE(value));
    }
}

export default AppDispatcher;
