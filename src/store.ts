import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { reducer as formReducer, FormStateMap } from "redux-form";

import { combineReducers } from "@root/utils/redux";
import { reducers, AppState, UndoableEntitiesState } from "@root/reducers";
import navigators, { NavigatorsState } from "@root/navigators";

export interface StoreState extends NavigatorsState {
    app: AppState,
    entities: UndoableEntitiesState,
    form: FormStateMap,
}

const rootReducer = combineReducers<StoreState>({
    ...navigators.reducers,
    app: reducers.app,
    entities: reducers.entities,
    form: formReducer,
});
const persistedRootReducer = persistReducer({
    key: "root",
    storage,
    blacklist: ["form", "app", ...Object.keys(navigators.reducers)],
}, rootReducer as any);

export const configureStore = () => {
    let middlewares = [ thunk, ...navigators.middlewares ];

    let store;
    if (__DEV__) {
        const composeWithDevTools = require("redux-devtools-extension").composeWithDevTools;
        //const logger = require("redux-logger").default;
        //middlewares.push(logger);
        store = createStore(persistedRootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
    } else {
        store = createStore(persistedRootReducer, applyMiddleware(...middlewares));
    }
    let persistor = persistStore(store);

    return { store, persistor };
};

export default {
    configure: configureStore
};
