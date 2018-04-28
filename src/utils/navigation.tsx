import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {
     NavigationStackScreenOptions, NavigationDrawerScreenOptions, NavigationTabScreenOptions,
     NavigationScreenProps, NavigationRouteConfigMap,
     NavigationState, StackNavigator, DrawerNavigator, TabNavigator,
     StackNavigatorConfig, DrawerNavigatorConfig, TabNavigatorConfig,
     NavigationActions,
     NavigationParams,
     NavigationAction,
} from "react-navigation";
import { addNavigationHelpers, NavigationContainer, NavigationNavigatorProps } from "react-navigation";
import { BackHandler } from "react-native";

const {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
} = require("react-navigation-redux-helpers");

interface NavigatorProperties extends NavigationNavigatorProps<any> {
    dispatch?: any,
    navState: any,
}

type Routes<T> = {
    [P in keyof T]: string
}

interface NavigatorLifecycle {
    didMount?: (getProps: () => NavigatorProperties) => void,
    willUnmount?: (getProps: () => NavigatorProperties) => void,
}

interface NavigatorDefinition<T> {
    reducer: (state: any, action: any) => any,
    Component: React.ComponentClass<{}>,
    routes: { [P in keyof T]: string }
    middleware: any,
}

function mergeBackHandler(lifecycle: NavigatorLifecycle): NavigatorLifecycle {
    let backHandler: () => void;
    let didMount: NavigatorLifecycle["didMount"] = (getProps) => {
        lifecycle.didMount && lifecycle.didMount(getProps);
        backHandler = () => {
            let props = getProps();
            if (props.navState.index > 0) {
                props.dispatch(NavigationActions.back());
                return true;
            }
            return false;
        };
        BackHandler.addEventListener("hardwareBackPress", backHandler);
    }
    let willUnmount: NavigatorLifecycle["willUnmount"] = (getProps) => {
        lifecycle.willUnmount && lifecycle.willUnmount(getProps);
        BackHandler.removeEventListener("hardwareBackPress", backHandler)
    }

    return { didMount, willUnmount };
}

function bindCreateNavigator<Config>(
    creator: (routes: NavigationRouteConfigMap, config?: Config) => NavigationContainer,
) {
    return function<StoreState, T extends NavigationRouteConfigMap>(
        options: {
            navState: (state: StoreState) => NavigationState,
            routes: T,
            config?: Config,
            withBackHandler?: boolean,
            lifecycle?: NavigatorLifecycle,
            mapToscreenProps?: ((state: StoreState) => { [key: string]: any }),
        }
    ) {
        const initialScreen = Object.keys(options.routes)[0];
        const Navigator = creator(options.routes, options.config)
        const routeKeys: Routes<T> = Object.keys(options.routes).reduce((r: Routes<T>, k) => { r[k] = k; return r; }, {} as any);
        let lifecycle = options.lifecycle || {}; 
        if (options.withBackHandler) {
            lifecycle = mergeBackHandler(lifecycle);
        }
        return createNavigator(initialScreen, routeKeys, Navigator, lifecycle, options.navState, options.mapToscreenProps);
    }
}

let middlewareNameCounter = 0;
const getMiddlewareName = () => {
    return "navigator_" + middlewareNameCounter++;
}

function createNavigator<RouteMap, StoreState>(
    initialScreen: string,
    routes: Routes<RouteMap>,
    Navigator: NavigationContainer,
    lifecycle: NavigatorLifecycle,
    mapToNavState: (state: StoreState) => any,
    mapToScreenProps?: (state: StoreState) => { [key: string]: any },
): NavigatorDefinition<RouteMap>
{
    const initialState = Navigator.router.getStateForAction(
        Navigator.router.getActionForPathAndParams(initialScreen) as NavigationAction,
        undefined,
    )

    const reducer = (state = initialState, action: any) => {
        const nextState = Navigator.router.getStateForAction(action, state);
        return nextState || state;
    };

    const middlewareName = getMiddlewareName();
    const middleware = createReactNavigationReduxMiddleware(
        middlewareName,
        mapToNavState
    );

    const addListener = createReduxBoundAddListener(middlewareName);

    class AppNavigator extends React.Component<NavigatorProperties> {
        render() {
            let { dispatch, navState, screenProps } = this.props;
            return (
                <Navigator navigation={addNavigationHelpers({
                    dispatch: dispatch,
                    state: navState,
                    addListener,
                })} screenProps={screenProps} />
            );
        }

        componentDidMount() {
            lifecycle.didMount && lifecycle.didMount(() => this.props);
        }

        componentWillUnmount() {
            lifecycle.willUnmount && lifecycle.willUnmount(() => this.props);
        }
    };

    const mapStateToProps = (state: StoreState): NavigatorProperties => {
        return {
            navState: mapToNavState(state),
            screenProps: mapToScreenProps && mapToScreenProps(state),
        }
    }

    const NavigatorComponent = connect(mapStateToProps)(AppNavigator);

    return {
        reducer: reducer,
        Component: NavigatorComponent,
        routes: routes,
        middleware,
    }
}

function bindMakeScreenOptions<TOpt>() {
    return function makeScreenOptions<Params>() {
        return {
            build: (creator: (params: Partial<Params>) => TOpt): ((props: NavigationScreenProps) => TOpt) => {
                return (props) => {
                    let params = props.navigation.state.params;
                    return creator((params || {}) as Params);
                };
            },
            setParams: (props: any, params?: Params) => {
                if (params) {
                    props.navigation.setParams(params);
                } else {
                    props.navigation.setParams(props);
                }
            },
            getParam<K extends keyof Params>(props: any, field: K): Params[K] | undefined {
                let params = props.navigation.state.params;
                return params && params[field];
            }
        }
    }
}

export function initScreenParams<Params>(props: NavigationScreenProps, params: Params) {
    props.navigation.setParams(params);
}

export type Anchor<T extends NavigationParams, Routes> = {
    action: (params: T) => { routeName: keyof Routes, params: NavigationParams, key: string },
    getParam: <K extends keyof T>(props: any, field: K) => T[K] | undefined
};

export class Router<Routes> {
    private dispatch: Dispatch<any>;

    constructor(dispatch: Dispatch<any>) {
        this.dispatch = dispatch;
    }

    public back = (key?: keyof Routes): void => {
        this.dispatch(NavigationActions.back({ key }))
    };

    public navigate = <T extends NavigationParams>(anchor: Anchor<T, Routes>, params: T, key?: string): void => {
        let actionParams = anchor.action(params)
        if (key) {
            actionParams["key"] = key;
        }
        this.dispatch(NavigationActions.navigate(actionParams));
    };

    public reset = (route: keyof Routes, params: NavigationParams): void => {
        this.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: route,
                    params
                })
            ]
        }));
    }
}

export function bindCreateAnchor<Routes>() {
    return function <T extends NavigationParams>(
        routeName: keyof Routes,
        convert?: (params: T) => NavigationParams
    ): Anchor<T, Routes> {
        return {
            action: (params) => ({
                routeName,
                params: convert ? convert(params) : params,
                key: routeName,
            }),
            getParam: (props, field) => {
                let params = props.navigation.state.params;
                return params && params[field];
            }
        }
    }
};

export type NavigationReducers<T> = {
    [P in keyof T]: (state: any, action: any) => any
}

export interface NavigationDefinitionMap {
    [name: string]: NavigatorDefinition<any>
}

export function combineNavigationReducer<T extends NavigationDefinitionMap>(navs: T): NavigationReducers<T> {
    let reducers: NavigationReducers<T> = ({} as any);
    Object.keys(navs).forEach((name: keyof T) => {
        reducers[name]= navs[name].reducer
    });

    return reducers;
}

export const createStackNavigator = bindCreateNavigator<StackNavigatorConfig>(StackNavigator);
export const createDrawerNavigator = bindCreateNavigator<DrawerNavigatorConfig>(DrawerNavigator);
export const createTabNavigator = bindCreateNavigator<TabNavigatorConfig>(TabNavigator);

export const makeStackScreenOptions = bindMakeScreenOptions<NavigationStackScreenOptions>();
export const makeTabScreenOptions = bindMakeScreenOptions<NavigationTabScreenOptions>();
export const makeDrawerScreenOptions = bindMakeScreenOptions<NavigationDrawerScreenOptions>();

export default {
    createStackNavigator,
    createDrawerNavigator,
    createTabNavigator,
    makeStackScreenOptions,
    makeTabScreenOptions,
    makeDrawerScreenOptions,
    combineNavigationReducer,
    bindCreateAnchor,
}
