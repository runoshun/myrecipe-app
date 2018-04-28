import app from "./app";
import entities from "./entities";
export { AppState } from "./app";
export { EntitiesState } from "./entities";

export { default as app } from "./app";
export { default as entities } from "./entities";

export const reducers = {
    app: app.reducer,
    entities: entities.reducer,
};

export const selectors = {
    app: app.selectors,
    entities: entities.selectors,
}

export const actions = {
    app: app.actions,
    entities: entities.actions
}

export default {
    reducers,
    selectors,
    actions,
}