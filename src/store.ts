import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { combineReducers } from "@root/utils/redux";
import { reducers, AppState, EntitiesState } from "@root/reducers";
import navigators, { NavigatorsState } from "@root/navigators";
import { StateWithHistory } from "redux-undo";

export interface StoreState extends NavigatorsState {
    app: AppState,
    entities: StateWithHistory<EntitiesState>,
}

const rootReducer = combineReducers<StoreState>({
    ...navigators.reducers,
    app: reducers.app,
    entities: reducers.entities,
});

export const configureStore = () => {
    let middlewares = [ thunk, ...navigators.middlewares ];

    if (__DEV__) {
        const composeWithDevTools = require("redux-devtools-extension").composeWithDevTools;
        //const logger = require("redux-logger").default;
        //middlewares.push(logger);
        return createStore<StoreState>(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
    } else {
        return createStore<StoreState>(rootReducer, applyMiddleware(...middlewares));
    }
};

export default {
    configure: configureStore
};
