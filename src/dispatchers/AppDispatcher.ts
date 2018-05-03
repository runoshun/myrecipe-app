import { Dispatch } from "redux";

import app, { ShoppingListType } from "@root/reducers/app";
import { StoreState } from "@root/store";

import { DispatcherBase } from "@root/utils/redux";
//import { ActionCreator, ErrorPayload } from "@root/utils/redux";

export class AppDispatcher extends DispatcherBase<StoreState> {

    constructor(dispatch: Dispatch<any>) {
        super(dispatch)
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
}

export default AppDispatcher;
