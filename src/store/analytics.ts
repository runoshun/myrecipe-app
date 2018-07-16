import { Middleware } from "redux";
import { StoreState } from "@root/store";
import logger from "@root/utils/logger";

import firebase from "react-native-firebase";

const log = logger.create("analytics");

export interface Options {
    blacklist: RegExp[],
}

export const createAnalyticsMiddleware: (options: Options) => Middleware<{}, StoreState> = options => {

    const analytics = firebase.analytics();
    const cache = new Map<string, boolean>();

    return _store => next => action => {

        if (action && action.type) {
            let ignored = cache.get(action.type);
            if (ignored === undefined) {
                ignored = options.blacklist.some(rule => rule.test(action.type));
                cache.set(action.type, ignored);
            }

            if (!ignored) {
                let extra = {
                    REDUX_ACTION_TYPE: action.type,
                    REDUX_ACTION_JSON: JSON.stringify(action)
                };
                if (!__DEV__) {
                    analytics.logEvent("REDUX_ACTION", extra);
                } else {
                    log(extra);
                }
            }
        }

        return next(action);
    }
}

export default createAnalyticsMiddleware;